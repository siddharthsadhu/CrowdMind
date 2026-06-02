from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

security_scheme = HTTPBearer(auto_error=False)


async def verify_clerk_token(credentials: HTTPAuthorizationCredentials | None = Depends(security_scheme)) -> dict | None:
    if credentials is None:
        return None

    token = credentials.credentials
    if not token:
        return None

    try:
        from jose import jwt

        payload = jwt.decode(
            token,
            "",
            algorithms=["RS256"],
            options={"verify_signature": False},
        )
        return payload
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
        )


async def get_current_user_id(payload: dict | None = Depends(verify_clerk_token)) -> str | None:
    if payload is None:
        return None
    return payload.get("sub")
