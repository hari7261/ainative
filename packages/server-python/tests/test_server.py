from fastapi.testclient import TestClient

from ainative.server import create_app


def test_healthcheck_endpoint():
    client = TestClient(create_app())
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"
