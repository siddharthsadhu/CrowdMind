from app.models.user import User
from app.repositories.users import UserRepository


class UserService:
    def __init__(self, repo: UserRepository):
        self.repo = repo

    async def get_by_clerk_id(self, clerk_id: str) -> User | None:
        return await self.repo.get_by_clerk_id(clerk_id)

    async def update_profile(self, user: User, data: dict) -> User:
        for key, value in data.items():
            if value is not None:
                setattr(user, key, value)
        return user
