"""Base schema with automatic UUID-to-string serialization.

Pydantic v2 does not coerce UUID -> str by default in from_attributes mode.
This base converts any UUID field to str automatically.
"""
import uuid
from typing import Any

from pydantic import BaseModel, ConfigDict, model_validator


class BaseSchema(BaseModel):
    """Pydantic model that auto-converts UUID fields to strings on validate."""

    model_config = ConfigDict(from_attributes=True, arbitrary_types_allowed=True, populate_by_name=True)

    @model_validator(mode="before")
    @classmethod
    def _coerce_uuids(cls, data: Any) -> Any:
        """Recursively convert UUID instances to strings before field validation.

        For ORM objects, build a dict keyed by Python attribute name (not DB column
        name) so Pydantic can find the corresponding schema field.
        """
        return _coerce(data)


def _coerce(value: Any) -> Any:
    """Recursively convert UUID -> str in nested dicts/lists/ORM objects."""
    if isinstance(value, uuid.UUID):
        return str(value)
    if isinstance(value, dict):
        return {k: _coerce(v) for k, v in value.items()}
    if isinstance(value, (list, tuple, set)):
        coerced = [_coerce(v) for v in value]
        return type(value)(coerced) if not isinstance(value, set) else coerced
    if hasattr(value, "__dict__") and not isinstance(value, type):
        # ORM model: use vars() to get the instance __dict__ which is keyed by
        # the Python attribute name (e.g. "notif_type" for the "type" column).
        return {k: _coerce(v) for k, v in vars(value).items()
                if not k.startswith("_") and not callable(v)}
    return value
