import os
os.environ["DATABASE_URL"] = "sqlite:///./test_ajaia_docs.db"
os.environ["JWT_SECRET_KEY"] = "test-key"
import pytest
from fastapi.testclient import TestClient
from app.db.session import Base, engine
from app.main import app

@pytest.fixture(autouse=True)
def clean_database():
    Base.metadata.drop_all(engine)
    with TestClient(app):
        yield
    Base.metadata.drop_all(engine)

@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client

def login(client, email="owner@ajaia.demo"):
    response = client.post("/api/v1/auth/login", json={"email": email, "password": "Password123!"})
    return {"Authorization": f"Bearer {response.json()['access_token']}"}
