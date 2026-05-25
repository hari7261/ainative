# Publishing

## npm packages

Prepare the release from a clean branch with reviewed changes and an updated `CHANGELOG.md`.

Build the monorepo first:

```bash
npm run build
```

Run tests before publishing:

```bash
npm test
npm run test:e2e
```

Then publish individual packages from the repo root:

```bash
npm publish --workspace @hari7261/ainative-client
npm publish --workspace @hari7261/ainative-server-node
npm publish --workspace @hari7261/ainative-cli
```

Recommended release order:

1. Publish `@hari7261/ainative-client`
2. Publish `@hari7261/ainative-server-node`
3. Publish `@hari7261/ainative-cli`

Verify npm after each publish:

```bash
npm view @hari7261/ainative-client version
npm view @hari7261/ainative-server-node version
npm view @hari7261/ainative-cli version
```

## Python package

From `packages/server-python`:

```bash
python -m build
python -m twine upload dist/*
```

## Release checklist

- Confirm package versions are aligned across the repo
- Run `npm test`
- Run `npm run test:e2e`
- Run `npm run build`
- Confirm docs and examples reflect current package capabilities
- Publish the npm packages
- Tag the release and update `CHANGELOG.md`
- Create a GitHub release using the matching tag and changelog notes
