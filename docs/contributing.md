# Contributing

## Setup

```bash
npm install
```

Optional Python setup:

```bash
cd packages/server-python
pip install -e .[dev]
```

## Validation

```bash
npm run build
npm test
npm run test:e2e
```

## Expectations

- Keep docs aligned with actual implementation.
- Prefer deterministic tests over provider-dependent tests.
- Validate Windows-compatible scripts before merging CLI/build changes.
