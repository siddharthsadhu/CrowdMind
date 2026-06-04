"""UUID validation helper to avoid 500 errors on bad IDs."""
import uuid

from fastapi import HTTPException, status


def parse_uuid(value: str, field: str = "id") -> uuid.UUID:
    """Parse a string to UUID, raising 400 on invalid input.

    Use this in all GET-by-ID endpoints to prevent 500 errors when users
    hit URLs like /faqs/garbage.
    """
    try:
        return uuid.UUID(value)
    except (ValueError, AttributeError, TypeError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid {field} format: must be a valid UUID",
        )
