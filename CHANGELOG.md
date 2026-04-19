# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

No unreleased changes documented yet.

## [0.2.4] - 2026-04-19

### Fixed
- Updated the CLI init banner to display `v0.2.4` consistently
- Aligned generated project dependency versions and package manifests with the `0.2.4` release

## [0.2.3] - 2026-04-19

### Fixed
- Compiled the refreshed CLI banner into the distributed init command so new installs show the latest branding
- Aligned workspace and starter template package versions for the `0.2.3` release

## [0.2.2] - 2026-04-19

### Changed
- Refreshed the CLI init banner and startup presentation
- Completed the version bump across the workspace and starter template for `v0.2.2`

## [0.2.1] - 2026-04-19

### Fixed
- Resolved CLI template issues, missing package READMEs, and streaming TypeScript typing problems
- Added `publishConfig` to scoped packages to support public npm publishing
- Cleaned temporary release artifacts before publishing

## [0.2.0] - 2026-04-04

### Added
- Advanced AI prompt box template with multimodal text, image, and voice input
- Search, Think, and Canvas interaction modes in the starter experience
- Radix UI and Framer Motion powered template polish plus improved template documentation

### Fixed
- Resolved template linting issues before npm release

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
