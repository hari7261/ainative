# @hari7261/ainative-cli

**AINative** is a domain-specific micro-framework built for creating AI-driven user interfaces quickly and robustly.

## What is it?
This package is the Command Line Interface (CLI) component of the **AINative Framework**. It simplifies the creation, scaffolding, and developer workflow for React-based AI projects that use the `@hari7261/ainative-client` and `@hari7261/ainative-server-node` ecosystem.

## Why is it helpful?
Building the scaffolding for an AI application with streaming, a server-side route for generating completions, and a client-side layout for reconciliation can be complex. This CLI helps automate these boilerplate tasks.

Features:
- **`ainative init`:** Kickstarts a new, immediately runnable full-stack application (frontend + Node backend).
- **`ainative dev`:** Automatically runs your client dev server and API backend simultaneously.
- **`ainative doctor`:** Diagnoses system requirements, checking for essential missing environment variables (like API keys) and installed dependencies.

## How it works

The CLI injects a robust set of templates directly into your working directory and can start up parallel development environments (using Vite for your React client and TSX for your Node.js server routes). It is how most developers begin with the AINative micro-framework.

## Installation / Usage

No global installation is required. You can scaffold a new AINative app simply by running:

```bash
npx @hari7261/ainative-cli init my-ai-app
cd my-ai-app
npx @hari7261/ainative-cli dev
```

For full documentation, visit the [main AINative repository](https://github.com/hari7261/ainative).