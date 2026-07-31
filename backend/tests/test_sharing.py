from conftest import login

def test_sharing_and_editor_authorization(client):
    owner = login(client)
    document_id = client.post("/api/v1/documents", json={}, headers=owner).json()["id"]
    shared = client.post(f"/api/v1/documents/{document_id}/shares", json={"email": "collaborator@ajaia.demo"}, headers=owner)
    assert shared.status_code == 201
    collaborator = login(client, "collaborator@ajaia.demo")
    listing = client.get("/api/v1/documents", headers=collaborator).json()
    assert listing["shared"][0]["id"] == document_id
    assert client.patch(f"/api/v1/documents/{document_id}", json={"title": "Edited together"}, headers=collaborator).status_code == 200
    assert client.delete(f"/api/v1/documents/{document_id}", headers=collaborator).status_code == 403
    reviewer = login(client, "reviewer@ajaia.demo")
    assert client.get(f"/api/v1/documents/{document_id}", headers=reviewer).status_code == 403
