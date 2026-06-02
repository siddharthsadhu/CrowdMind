import datetime

import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt, jwk, JWTError

from app.core.config import settings

security_scheme = HTTPBearer(auto_error=False)

JWKS_CACHE: dict[str, dict[str, dict]] = {}
JWKS_CACHE_EXPIRY: dict[str, datetime.datetime] = {}


async def get_jwks(issuer: str) -> dict[str, dict] | None:
    now = datetime.datetime.now(datetime.timezone.utc)
    cached_at = JWKS_CACHE_EXPIRY.get(issuer)
    if issuer in JWKS_CACHE and cached_at and (now - cached_at).seconds < 3600:
        return JWKS_CACHE[issuer]

    try:
        async with httpx.AsyncClient() as client:
            r = await client.get(f"{issuer}/.well-known/jwks.json", timeout=5)
            r.raise_for_status()
            data = r.json()
            keys = {k["kid"]: k for k in data.get("keys", [])}
            JWKS_CACHE[issuer] = keys
            JWKS_CACHE_EXPIRY[issuer] = now
            return keys
    except Exception:
        return None


async def verify_clerk_token(credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme)) -> dict | None:
    if credentials is None:
        return None

    token = credentials.credentials
    if not token:
        return None

    # Dev/test mode: skip signature verification when no Clerk key is configured
    if not settings.clerk_secret_key:
        try:
            payload = jwt.decode(token, "", algorithms=["RS256"], options={"verify_signature": False})
            return payload
        except Exception:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication token")

    try:
        unverified_header = jwt.get_unverified_header(token)
        unverified_claims = jwt.get_unverified_claims(token)

        issuer = unverified_claims.get("iss")
        if not issuer:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing issuer in token")

        keys = await get_jwks(issuer)
        if not keys:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Failed to fetch signing keys")

        kid = unverified_header.get("kid")
        key_data = keys.get(kid)
        if not key_data:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unknown signing key")

        public_key = jwk.construct(key_data)
        payload = jwt.decode(token, public_key, algorithms=["RS256"], options={"verify_aud": False})
        return payload
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication token")
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication failed")


async def get_current_user_id(payload: dict | None = Depends(verify_clerk_token)) -> str | None:
    if payload is None:
        return None
    return payload.get("sub")
