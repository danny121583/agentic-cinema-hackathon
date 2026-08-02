# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Backend**: Modular FastAPI architecture with `app/api`, `app/models`, `app/services`, and `app/agents`.
- **Backend**: In-memory and Firestore storage providers.
- **Backend**: Script breakdown agent with deterministic mock AI toggle.
- **Frontend**: Next.js 16 setup with Shadcn UI components (Card, Input, Textarea, Label, Button).
- **Frontend**: `ScriptInputForm` and `ProjectDetails` components.
- **Frontend**: Typed API client (`src/lib/api.ts`).
- **Testing**: Pytest suite for API and agent logic.
- **Testing**: Playwright configuration and end-to-end tests for UI flow.
- **Documentation**: Iteration 01 report and initial project setup guides.
