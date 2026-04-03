# Publishing

## npm packages

Build the monorepo first:

```bash
npm run build
```

Then publish individual packages from their package directories:

```bash
npm publish --workspace @ainative/client
npm publish --workspace @ainative/server-node
npm publish --workspace @ainative/cli
```

## Python package

From `packages/server-python`:

```bash
python -m build
python -m twine upload dist/*
```

## Release checklist

- Run `npm test`
- Run `npm run test:e2e`
- Confirm docs and examples reflect current package capabilities
- Tag the release and update `CHANGELOG.md`
