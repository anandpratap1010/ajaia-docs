from sqlalchemy import select
from app.core.security import hash_password
from app.db.session import SessionLocal
from app.models import User

DEMO_USERS = [
    ("Owner User", "owner@ajaia.demo"),
    ("Collaborator User", "collaborator@ajaia.demo"),
    ("Reviewer User", "reviewer@ajaia.demo"),
]
def seed() -> None:
    with SessionLocal() as db:
        for name, email in DEMO_USERS:
            if not db.scalar(select(User).where(User.email == email)):
                db.add(User(name=name, email=email, password_hash=hash_password("Password123!")))
        db.commit()
if __name__ == "__main__":
    seed()
