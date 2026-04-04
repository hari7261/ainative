# Publishing Guide for AINative v0.2.0

This guide provides step-by-step instructions for publishing the updated AINative packages to npm.

## Prerequisites

1. **npm Authentication**: Ensure you're logged in to npm with an account that has publish permissions
   ```bash
   npm whoami  # Check current user
   npm login   # Login if needed
   ```

2. **Repository Access**: You must have write access to the `hari7261/ainative` repository

3. **Clean Working Directory**: All changes should be committed
   ```bash
   git status  # Should show clean working tree
   ```

## What's New in v0.2.0

The CLI package (@hari7261/ainative-cli) has been updated with a major template enhancement:

### Template Features
- **Advanced PromptInputBox Component**: Multi-modal AI input with modern UI
- **Image Support**: Drag & drop, paste, and file upload (up to 10MB)
- **Voice Recording**: Built-in voice message recording
- **Smart Modes**: Search 🌐, Think 🧠, and Canvas 📁 modes
- **Modern UI**: Radix UI components with Framer Motion animations
- **Full Documentation**: Comprehensive README in generated projects

### New Dependencies Added to Template
- @radix-ui/react-dialog@^1.0.5
- @radix-ui/react-tooltip@^1.0.7
- framer-motion@^11.0.0
- lucide-react@^0.344.0

## Publishing Steps

### 1. Verify the Build

```bash
# From repository root
corepack pnpm install
corepack pnpm run build
```

All packages should build successfully.

### 2. Run Tests

```bash
corepack pnpm test
```

Ensure all tests pass before publishing.

### 3. Verify Package Contents

Check what will be published:

```bash
# CLI package
cd packages/cli
npm pack --dry-run

# This should include:
# - dist/ (built JavaScript)
# - templates/ (project template files including PromptInputBox.tsx)
# - package.json
# - README.md (if exists)
```

### 4. Publish the CLI Package

The CLI package is the only one that changed in this release.

```bash
# From repository root
npm publish --workspace @hari7261/ainative-cli --access public

# Or from the package directory
cd packages/cli
npm publish --access public
```

**Note**: Use `--access public` to ensure the package is publicly available.

### 5. Tag the Release

After successful publishing:

```bash
git tag -a v0.2.0 -m "Release v0.2.0: Advanced AI prompt box template"
git push origin v0.2.0
```

### 6. Create GitHub Release

1. Go to https://github.com/hari7261/ainative/releases
2. Click "Draft a new release"
3. Choose tag `v0.2.0`
4. Title: "v0.2.0: Advanced AI Prompt Box Template"
5. Description: Use the content from CHANGELOG.md
6. Publish release

## Post-Publishing Verification

### Test the Published Package

```bash
# In a new directory
npx @hari7261/ainative-cli@latest init test-app
cd test-app
npm install
npm run server  # Terminal 1
npm run dev     # Terminal 2
```

Verify that:
- ✅ Template generates correctly
- ✅ All dependencies install
- ✅ PromptInputBox component works
- ✅ Image upload, drag & drop, and paste work
- ✅ Voice recording buttons appear
- ✅ Smart mode toggles function
- ✅ UI is responsive

### Update Documentation

If needed, update the main README.md to reflect the new version:

```bash
# Update any version numbers in README.md
npm install -g @hari7261/ainative-cli@latest  # Should show 0.2.0
```

## Troubleshooting

### "You do not have permission to publish"
- Verify you're logged in: `npm whoami`
- Check package name is available: `npm view @hari7261/ainative-cli`
- Ensure your account has access to the `@hari7261` scope

### "Version 0.2.0 already exists"
- Check current version: `npm view @hari7261/ainative-cli version`
- If needed, bump to 0.2.1 or another version

### Template Files Missing After Install
- Verify `templates/` is in the `files` array in package.json
- Check `.npmignore` doesn't exclude templates
- Test with `npm pack` to see what's included

## Rollback Procedure

If issues are discovered after publishing:

```bash
# Deprecate the version
npm deprecate @hari7261/ainative-cli@0.2.0 "Issues found, use 0.1.1 instead"

# Or unpublish (only within 72 hours)
npm unpublish @hari7261/ainative-cli@0.2.0
```

## Alternative: Publish as Next Tag

To publish as a preview/next version without affecting the stable release:

```bash
npm publish --workspace @hari7261/ainative-cli --tag next --access public
```

Users can then install with:
```bash
npm install -g @hari7261/ainative-cli@next
```

## Notes

- The client and server-node packages remain at v0.1.1 (no changes)
- Only the CLI package needs to be published for this release
- The template files are bundled with the CLI package
- Users will get the new template automatically when they run `ainative init`

## Summary

```bash
# Quick publish checklist:
✅ Build passes
✅ Tests pass
✅ Version bumped to 0.2.0
✅ CHANGELOG.md created
✅ Published to npm
✅ Git tagged
✅ GitHub release created
✅ Verified with test install
```
