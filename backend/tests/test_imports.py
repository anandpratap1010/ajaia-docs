from conftest import login

def test_import_validation(client):
    headers = login(client)
    imported = client.post("/api/v1/documents/import", files={"file": ("notes.txt", b"First paragraph\nSecond paragraph", "text/plain")}, headers=headers)
    assert imported.status_code == 201
    assert imported.json()["title"] == "notes"
    unsupported = client.post("/api/v1/documents/import", files={"file": ("photo.png", b"not a png", "image/png")}, headers=headers)
    assert unsupported.status_code == 415
