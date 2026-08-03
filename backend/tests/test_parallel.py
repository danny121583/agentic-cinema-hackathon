import pytest

from app.tools.parallel_search import ParallelSearchClient


@pytest.mark.asyncio
async def test_parallel_client_missing_key(monkeypatch):
    from app.config import settings
    monkeypatch.setattr(settings, "scenescout_use_mock_ai", False)
    monkeypatch.setattr(settings, "parallel_api_key", "")
    client = ParallelSearchClient(api_key="")
    with pytest.raises(ValueError, match="PARALLEL_API_KEY is not configured."):
        await client.search("test query")

@pytest.mark.asyncio
async def test_parallel_client_fake_response(monkeypatch):
    from app.config import settings
    monkeypatch.setattr(settings, "scenescout_use_mock_ai", True)
    client = ParallelSearchClient(api_key="fake-key")
    response = await client.search("test query")
    assert response.query == "test query"
    assert len(response.results) == 1
    assert response.results[0]["title"] == "Mock Parallel Search Result"
