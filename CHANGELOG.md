# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of AINative framework
- Client runtime with React-compatible component system
- AI-driven state reconciliation
- Native token streaming support (SSE + WebSocket)
- Multimodal input handling (text, audio, image, file)
- Server adapters for Node.js and Python
- LLM provider integrations (OpenAI, Anthropic, Ollama, Google Gemini)
- Tool/Action execution protocol
- CLI for project scaffolding and development
- Comprehensive documentation
- Example applications

## [0.1.1] - 2026-04-04

### Changed
- Refreshed the CLI starter template with a modern responsive chat workspace
- Upgraded the `basic-chat` example to match the new visual direction
- Improved starter ergonomics with a stronger default layout and onboarding copy

### Fixed
- Preserved streaming state updates and cleaned up stream listeners correctly
- Improved Windows and pnpm compatibility across build and test scripts
- Added CLI test coverage and validated the full monorepo build, test, and E2E flow

## [0.1.0] - 2026-04-03

### Added
- Framework foundation and monorepo structure
- Core packages: client, server-node, server-python, cli
- Basic examples and documentation
