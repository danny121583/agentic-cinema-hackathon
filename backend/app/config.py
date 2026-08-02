from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    google_cloud_project: Optional[str] = Field(default=None, validation_alias="GOOGLE_CLOUD_PROJECT")
    google_cloud_location: Optional[str] = Field(default=None, validation_alias="GOOGLE_CLOUD_LOCATION")
    google_genai_use_vertexai: bool = Field(default=True, validation_alias="GOOGLE_GENAI_USE_VERTEXAI")
    gemini_model: str = Field(default="gemini-1.5-flash-001", validation_alias="GEMINI_MODEL")
    gemini_api_key: Optional[str] = Field(default=None, validation_alias="GEMINI_API_KEY")
    parallel_api_key: Optional[str] = Field(default=None, validation_alias="PARALLEL_API_KEY")
    firestore_emulator_host: Optional[str] = Field(default=None, validation_alias="FIRESTORE_EMULATOR_HOST")

    scenescout_use_mock_ai: bool = Field(default=True, validation_alias="SCENESCOUT_USE_MOCK_AI")
    scenescout_use_in_memory_store: bool = Field(default=True, validation_alias="SCENESCOUT_USE_IN_MEMORY_STORE")
    allowed_origins: str = Field(default="http://localhost:3000", validation_alias="ALLOWED_ORIGINS")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    def validate_production(self) -> None:
        if not self.scenescout_use_mock_ai:
            if not self.google_cloud_project:
                raise ValueError("GOOGLE_CLOUD_PROJECT is required when SCENESCOUT_USE_MOCK_AI is false.")
        if not self.scenescout_use_in_memory_store:
            if not self.google_cloud_project and not self.firestore_emulator_host:
                raise ValueError("GOOGLE_CLOUD_PROJECT or FIRESTORE_EMULATOR_HOST is required when SCENESCOUT_USE_IN_MEMORY_STORE is false.")

settings = Settings()
