# Contributing to AIMit

Thank you for your interest in contributing to AIMit! This document provides guidelines and instructions for contributing to the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)

## 📜 Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- npm or yarn
- Git

### Setup

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/aimit.git
   cd aimit
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

4. **Make your changes**

5. **Test your changes**
   ```bash
   npm test
   npm run build
   ```

## 🔄 Development Workflow

### Current Status

**⚠️ Important**: This project is currently undergoing a major refactoring to a layered architecture. See [TODO.md](TODO.md) for the migration plan.

### Working on Issues

1. Check the [TODO.md](TODO.md) file for tasks that need to be done
2. Comment on an issue to claim it (or create a new issue if needed)
3. Create a branch from `main` (or the appropriate base branch)
4. Make your changes following our coding standards
5. Write or update tests
6. Ensure all tests pass
7. Submit a pull request

### Branch Naming

Use descriptive branch names:
- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates
- `test/description` - Test additions/updates

## 📝 Coding Standards

### TypeScript

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Avoid `any` types - use proper typing

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings (unless escaping)
- Use trailing commas in multi-line objects/arrays
- Run `npm run format` before committing

### File Organization

Follow the layered architecture (once refactoring is complete):
- `src/cli/` - Presentation layer
- `src/commands/` - Application layer
- `src/domain/` - Domain layer
- `src/infrastructure/` - Infrastructure layer
- `src/shared/` - Shared utilities

### Testing

- Write tests for new features
- Write tests for bug fixes
- Aim for high test coverage
- Use descriptive test names
- Follow the existing test structure

## 📋 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test additions or changes
- `chore`: Maintenance tasks
- `build`: Build system changes
- `ci`: CI/CD changes

### Examples

```bash
feat(commands): add dry-run command handler

Implement the dry-run command to preview commit messages
without committing changes.

Closes #123
```

```bash
fix(git): handle deleted files in diff

Previously, deleted files would cause errors when generating
commit messages. This fix properly handles deleted files.

Fixes #456
```

## 🔀 Pull Request Process

1. **Update your branch**
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-branch
   git rebase main
   ```

2. **Ensure quality**
   - All tests pass (`npm test`)
   - Code builds successfully (`npm run build`)
   - Code is formatted (`npm run format`)
   - No linter errors
   - Documentation is updated (if needed)

3. **Create Pull Request**
   - Use a clear, descriptive title
   - Reference related issues
   - Describe what changes were made and why
   - Include screenshots if UI changes
   - Mark as "Draft" if work in progress

4. **Respond to feedback**
   - Address review comments
   - Make requested changes
   - Keep the PR updated with main branch

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Related Issues
Closes #issue-number

## Testing
- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Updated existing tests

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
```

## 🐛 Reporting Issues

### Before Reporting

1. Check if the issue already exists
2. Verify it's not a configuration problem
3. Try the latest version

### Bug Reports

Include:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Error messages/logs
- Minimal reproduction case (if possible)

### Issue Template

```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Run command '...'
2. See error

**Expected behavior**
What you expected to happen.

**Environment:**
- OS: [e.g., macOS 14.0]
- Node version: [e.g., 20.10.0]
- AIMit version: [e.g., 1.0.0]

**Additional context**
Add any other context about the problem.
```

## 💡 Feature Requests

When requesting a feature:
- Describe the use case
- Explain why it would be useful
- Suggest how it might be implemented (optional)
- Consider alternatives

## 🏗️ Architecture Contributions

If you're working on the architecture refactoring:
- Follow the plan in [TODO.md](TODO.md)
- Maintain backward compatibility where possible
- Update tests as you migrate code
- Document architectural decisions

## 📚 Documentation

- Update README.md for user-facing changes
- Update code comments for complex logic
- Add JSDoc for public APIs
- Update CHANGELOG.md for significant changes

## ❓ Questions?

- Open a [Discussion](https://github.com/he0xA1/aimit/discussions)
- Check existing [Issues](https://github.com/he0xA1/aimit/issues)
- Review [TODO.md](TODO.md) for current work

## 🙏 Thank You!

Your contributions make this project better. Thank you for taking the time to contribute!

