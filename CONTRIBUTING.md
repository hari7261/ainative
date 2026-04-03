# Contributing to AINative

Thank you for your interest in contributing to AINative! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Python >= 3.10 (for Python server adapter)
- Git

### Getting Started

1. Fork and clone the repository:
```bash
git clone https://github.com/hari7261/ainative.git
cd ainative
```

2. Install dependencies:
```bash
pnpm install
```

3. Build all packages:
```bash
pnpm build
```

4. Run tests:
```bash
pnpm test
```

## Project Structure

```
ainative/
├── packages/
│   ├── client/          # Client runtime and components
│   ├── server-node/     # Node.js server adapter
│   ├── server-python/   # Python server adapter
│   └── cli/             # CLI tool
├── examples/            # Example applications
├── docs/                # Documentation
├── scripts/             # Build and release scripts
└── tests/               # E2E tests
```

## Development Workflow

### Making Changes

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes following our coding standards

3. Add tests for new functionality

4. Ensure all tests pass:
```bash
pnpm test
```

5. Lint your code:
```bash
pnpm lint
```

6. Commit your changes:
```bash
git commit -m "feat: description of your changes"
```

### Commit Message Format

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

### Testing

- Write unit tests for utilities and core logic
- Write integration tests for API endpoints
- Write E2E tests for critical user flows
- Ensure test coverage remains high

### Code Style

- Use TypeScript for all new code
- Follow existing code formatting (enforced by Prettier)
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Pull Request Process

1. Update documentation if needed
2. Add tests for new functionality
3. Ensure all tests pass
4. Update CHANGELOG.md
5. Submit PR with clear description
6. Address review feedback

## Release Process

Releases are managed using changesets:

1. Create a changeset:
```bash
pnpm changeset
```

2. Commit the changeset

3. When ready to release, run:
```bash
pnpm version-packages
pnpm release
```

## Getting Help

- Open an issue for bugs or feature requests
- Join our Discord community (coming soon)
- Check existing documentation in `/docs`

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Assume good intentions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
