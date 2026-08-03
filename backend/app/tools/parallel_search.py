import asyncio
from typing import Any, Dict, List, Optional
from datetime import datetime
import logging

from pydantic import BaseModel

from app.config import settings
from parallel import AsyncParallel
from parallel.types.search_result import SearchResult

logger = logging.getLogger(__name__)

class ParallelSearchResponse(BaseModel):
    query: str
    results: List[Dict[str, Any]]

class ParallelSearchClient:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.parallel_api_key
        if self.api_key:
            self.client = AsyncParallel(api_key=self.api_key)
        else:
            self.client = None

    async def search(self, query: str, objective: Optional[str] = None) -> ParallelSearchResponse:
        """
        Executes a live search against the Parallel API. 
        Falls back to a deterministic fake response if in mock mode or lacking an API key.
        """
        if settings.scenescout_use_mock_ai:
            await asyncio.sleep(1) # Simulate network latency
            return ParallelSearchResponse(
                query=query,
                results=[
                    {
                        "url": "https://example.com/fake-source",
                        "title": "Mock Parallel Search Result",
                        "publish_date": datetime.now().strftime("%Y-%m-%d"),
                        "excerpts": ["This is a mock excerpt because the live search is disabled."]
                    }
                ]
            )
            
        if not self.client:
            raise ValueError("PARALLEL_API_KEY is not configured.")

        try:
            logger.info(f"Executing live Parallel search for query: {query}")
            # The exact kwargs for client.search depend on the SDK schema. 
            # We use search_queries per the client_search_params.py schema.
            params: Dict[str, Any] = {"search_queries": [query]}
            if objective:
                params["objective"] = objective
            
            response: SearchResult = await self.client.search(**params) # type: ignore
            
            formatted_results = []
            for res in response.results:
                formatted_results.append({
                    "url": res.url,
                    "title": res.title,
                    "publish_date": res.publish_date,
                    "excerpts": res.excerpts
                })
                
            return ParallelSearchResponse(
                query=query,
                results=formatted_results
            )
            
        except Exception as e:
            logger.error(f"Parallel search failed: {str(e)}")
            # In case of partial failure or rate limit, we do not swallow silently, 
            # but for this prototype we can return an empty list or raise.
            raise ValueError(f"Parallel search error: {str(e)}")
