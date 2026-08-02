import pytest

from app.tools.parallel_search import ParallelSearchClient


def test_parallel_client_missing_key():
    client = ParallelSearchClient(api_key="")
    with pytest.raises(ValueError, match="PARALLEL_API_KEY is not configured."):
        client.search("test query")

def test_parallel_client_fake_response():
    client = ParallelSearchClient(api_key="fake-key")
    response = client.search("test query")
    assert response.query == "test query"
    assert len(response.results) == 1
    assert response.results[0]["title"] == "Fake Source"
