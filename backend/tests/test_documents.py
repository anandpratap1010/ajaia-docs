from conftest import login

def test_document_content_persists(client):
    headers = login(client)
    created = client.post("/api/v1/documents", json={"title": "  Design notes  "}, headers=headers)
    assert created.status_code == 201
    document_id = created.json()["id"]
    content = {"type": "doc", "content": [{"type": "paragraph", "content": [{"type": "text", "marks": [{"type": "bold"}], "text": "Important"}]}]}
    updated = client.patch(f"/api/v1/documents/{document_id}", json={"title": "Final notes", "content": content}, headers=headers)
    assert updated.status_code == 200
    reopened = client.get(f"/api/v1/documents/{document_id}", headers=headers).json()
    assert reopened["title"] == "Final notes"
    assert reopened["content"] == content
