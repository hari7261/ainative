# AINative Framework Report

Date: 2026-04-19
Repo path reviewed: `C:\Users\Hariom kumar\Desktop\ainative`
GitHub repo: https://github.com/hari7261/ainative

## Executive Summary

AINative is the framework foundation behind the website/project direction. It is a monorepo for building AI-native interfaces, with a React client runtime, a Node server adapter, a Python server adapter, a CLI, example apps, and framework docs.

As of 2026-04-19, the local repository is on version `0.2.4`, and GitHub already shows a `v0.2.4` release. However, npm still shows `0.2.3` as the latest published version for the public packages at the time of review. That means the latest local/GitHub state and the latest npm-installable state are currently out of sync.

## What This Framework Is

AINative is positioned as an AI-native frontend/framework layer for LLM-driven apps. Its core goal is to remove repetitive infrastructure work around:

- chat state synchronization
- token streaming
- prompt-driven UI updates
- multimodal inputs
- tool execution
- provider switching

The repo is organized as:

- `packages/client`: React runtime, UI components, multimodal helpers
- `packages/server-node`: Express-based AI server and provider adapters
- `packages/server-python`: FastAPI-based Python server adapter
- `packages/cli`: starter generation and dev commands
- `examples/basic-chat`: polished example app
- `examples/streaming-demo`: streaming-focused example
- `docs`: framework documentation

## Core Technical Surface

### Client

Package: `@hari7261/ainative-client`

Exports include:

- runtime primitives: `createAIApp`, `AIApp`, `AIStateManager`, `StreamingEngine`, `AIReconciler`
- React components: `AIAppComponent`, `AIInput`, `AIStream`, `AIStreamList`, `AIPane`
- multimodal helpers: audio, image, file utilities

Main UI/runtime responsibilities:

- records user messages
- streams assistant output token by token
- reconciles state updates into the app
- exposes a React-friendly rendering model

### Server

Node package: `@hari7261/ainative-server-node`
Python package: `ainative-server`

Main API surface:

- `POST /ai/action`
- `POST /ai/stream`
- `POST /ai/tool`
- `GET /ai/tools`

Supported provider adapters present in code:

- OpenAI
- Anthropic
- Ollama

### CLI

Package: `@hari7261/ainative-cli`

Commands:

- `ainative init`
- `ainative dev`
- `ainative build`
- `ainative preview`
- `ainative doctor`
- `ainative add-provider`

The CLI template is important because it currently defines the framework's most polished starter UI direction.

## UI / Design Direction In The Framework

The strongest visual/product direction is in the CLI starter template and example app, not in the bare runtime components.

### Baseline runtime components

The built-in `AIInput` component is functional and generic:

- text input / textarea
- audio recording
- image capture
- file upload
- simple attachment chips

This is useful as framework infrastructure, but it is not the most polished showcase UI.

Relevant file:

- `packages/client/src/components/AIInput.tsx`

### Advanced starter-template UI

The richer UI direction is in:

- `packages/cli/templates/project/src/PromptInputBox.tsx`
- `test-app/src/PromptInputBox.tsx`
- `examples/basic-chat/src/main.tsx`

Notable UI characteristics:

- multimodal prompt box
- drag/drop and paste image support
- image preview modal
- voice recording affordance
- Search / Think / Canvas interaction toggles
- Radix UI dialog + tooltip usage
- Framer Motion animation
- Lucide icons
- responsive chat layout
- polished onboarding/hero/sidebar treatment

Starter template dependency stack:

- `@hari7261/ainative-client` `^0.2.4`
- `@hari7261/ainative-server-node` `^0.2.4`
- `@radix-ui/react-dialog` `^1.0.5`
- `@radix-ui/react-tooltip` `^1.0.7`
- `framer-motion` `^11.0.0`
- `lucide-react` `^0.453.0`
- `react` `^18.2.0`
- `react-dom` `^18.2.0`

## Latest Updates Done On 2026-04-19

Local git history today shows release-focused work throughout the day.

Important commits from 2026-04-19:

- `c595992` fix: resolve CLI template bugs, missing READMEs, and streaming TS typing
- `84d2594` chore: bump version to `0.2.1` for npm and GitHub release
- `963c826` fix: add `publishConfig` to scoped packages for public npm release
- `6e29d1f` feat: updated CLI banner and bumped to `0.2.2`
- `7089519` feat: complete `v0.2.2` bump and CLI banner update
- `5226173` fix: compile refreshed CLI banner and release `v0.2.3`
- `1ccc145` fix(cli): bump to `0.2.4` and update displayed version in init banner
- `62c859c` docs: add missing release history
- `1396f45` chore: remove outdated banner file

Changelog entries added today:

- `0.2.1`: publishing fixes and package hardening
- `0.2.2`: CLI banner refresh and workspace version alignment
- `0.2.3`: banner compile fix for shipped CLI output
- `0.2.4`: version display fix and generated dependency alignment

## Latest GitHub State

GitHub releases page shows:

- `v0.2.4` as the latest release
- release date: 2026-04-19 18:47:40 IST
- release summary: CLI version display fix and generated dependency alignment

Other GitHub releases published today:

- `v0.2.3` at 2026-04-19 18:43:23 IST
- `v0.2.2` at 2026-04-19 18:39:13 IST
- `v0.2.1` at 2026-04-19 18:15:24 IST

This indicates a fast release sequence on the same day, mostly around packaging and CLI UX consistency.

## Latest npm State

npm registry check results at review time:

- `@hari7261/ainative-client`: latest published `0.2.3`
- `@hari7261/ainative-cli`: latest published `0.2.3`
- `@hari7261/ainative-server-node`: latest published `0.2.3`

Latest publish timestamps from npm:

- client `0.2.3`: 2026-04-19T13:14:23Z
- cli `0.2.3`: 2026-04-19T13:13:52Z
- server-node `0.2.3`: 2026-04-19T13:14:46Z

Important conclusion:

- local repo version: `0.2.4`
- GitHub latest release: `v0.2.4`
- npm latest published installable version: `0.2.3`

So `0.2.4` appears released on GitHub but not yet reflected in npm for the public JS packages.

## Current Versions In Local Source

- repo root version: `0.2.4`
- `@hari7261/ainative-client`: `0.2.4`
- `@hari7261/ainative-cli`: `0.2.4`
- `@hari7261/ainative-server-node`: `0.2.4`
- `ainative-server` Python package: `0.2.4`

## Key Files That Matter For Our Website Sync

If the website is meant to mirror the actual framework direction, these are the most important source files to track:

- `README.md`
- `CHANGELOG.md`
- `docs/architecture.md`
- `docs/runtime.md`
- `docs/component-api.md`
- `docs/server-api.md`
- `docs/cli.md`
- `packages/cli/templates/project/src/PromptInputBox.tsx`
- `packages/cli/templates/project/src/style.css`
- `examples/basic-chat/src/main.tsx`
- `packages/client/src/components/AIInput.tsx`

## Notable Gaps / Mismatches

### Published-state mismatch

The main mismatch right now is release state:

- GitHub says latest is `v0.2.4`
- npm still serves `0.2.3`

If the website says "`0.2.4 available on npm`" right now, that would be inaccurate.

### Docs drift around providers

There is a small documentation inconsistency:

- `README.md` lists current provider support as OpenAI, Anthropic, and Ollama
- `packages/server-node/src/adapters` also contains only OpenAI, Anthropic, and Ollama
- `docs/architecture.md` includes "Google" in the provider diagram

Best interpretation: Google is mentioned in architecture docs, but it is not currently implemented in the visible provider adapters.

### Product emphasis

The framework's strongest product story today is:

- AI-native streaming UI
- multimodal prompt interactions
- CLI-generated starter experience

It is less about a huge component library and more about a focused runtime + server + starter framework for AI interfaces.

## Recommended Positioning For The Website Later

When we update the website/UI, the most accurate messaging should center on:

- AI-native interface framework
- streaming-first React runtime
- Node and Python server adapters
- built-in multimodal affordances
- provider support for OpenAI, Anthropic, Ollama
- polished CLI starter template

Avoid claiming right now:

- npm `0.2.4` availability
- Google provider support
- a broad, mature design-system/component-library positioning

## Sources Used

- Local repo at `C:\Users\Hariom kumar\Desktop\ainative`
- GitHub repo: https://github.com/hari7261/ainative
- GitHub releases: https://github.com/hari7261/ainative/releases
- npm package pages:
  - https://www.npmjs.com/package/@hari7261/ainative-client
  - https://www.npmjs.com/package/@hari7261/ainative-cli
  - https://www.npmjs.com/package/@hari7261/ainative-server-node

