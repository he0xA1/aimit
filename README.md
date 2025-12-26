# AIMit

<div align="center">

**🤖 Intelligent Commit Messages, Instantly Generated**

Generate meaningful Git commit messages automatically using fine-tuned local AI models.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: Development](https://img.shields.io/badge/Status-Development-orange)](https://github.com/he0xA1/aimit)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D20-green)](https://nodejs.org/)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Development](#-development) • [Contributing](#-contributing)

</div>

---

## ⚠️ Project Status

**🚧 This project is currently under active development.**

We are in the process of refactoring the codebase to a layered architecture and fine-tuning the AI model. The project is not yet production-ready, but contributions and feedback are welcome!

### Current Development Focus

- **Architecture Refactoring**: Migrating to a layered architecture with domain separation (see [TODO.md](TODO.md))
- **Model Fine-Tuning**: Preparing to fine-tune [Qwen2.6-Coder-0.5B](https://huggingface.co/Qwen/Qwen2.6-Coder-0.5B-Instruct) specifically for Git commit message generation
- **Code Quality**: Improving test coverage, error handling, and documentation

---

## 📖 About

AIMit is a CLI tool that automatically generates intelligent, context-aware Git commit messages by analyzing your staged changes. It uses the **Qwen2.6-Coder-0.5B** model directly via node-llama-cpp for local inference. After the current refactoring is complete, AIMit will use a fine-tuned version of this model optimized specifically for generating high-quality commit messages.

### Why AIMit?

- **Privacy-First**: All processing happens locally on your machine - no data leaves your computer
- **Fast & Efficient**: Lightweight model (0.5B parameters) provides quick responses
- **Context-Aware**: Understands code changes, file modifications, and commit patterns
- **Conventional Commits**: Generates messages following industry best practices
- **Fine-Tuned for Commits**: The model will be specifically trained on commit message patterns

---

## 🌟 Features

- **🔒 Fully Local**: All AI processing happens on your machine - no API keys, no cloud services
- **⚡ Lightning Fast**: Generate commit messages in seconds with optimized local models
- **🎯 Context-Aware**: Analyzes staged changes to create meaningful, accurate commit messages
- **📝 Conventional Commits**: Follows best practices and conventional commit standards
- **🎨 Customizable**: Configure commit styles and message formats
- **🔄 Git Integration**: Seamlessly integrates with your existing Git workflow
- **💡 Smart Analysis**: Understands code context, file changes, and modification patterns

---

## 📋 Prerequisites

- **Node.js** >= 20
- **Git** installed and configured

---

## 🚀 Installation

### Install AIMit

```bash
# Clone the repository
git clone https://github.com/he0xA1/aimit.git
cd aimit

# Install dependencies
npm install

# Build the project
npm run build

# Link globally (optional)
npm link
```

---

## 💻 Usage

### Basic Usage

```bash
# Generate a commit message (dry-run)
aimit --dry-run

# Generate and commit automatically
aimit --commit

# Amend the last commit with a new message
aimit --amend
```

### Options

```bash
# Specify Git directory
aimit --directory /path/to/repo

# Set commit message style
aimit --style conventional

# Set maximum message length
aimit --max-length 100

# Include emojis in commit messages
aimit --emoji

# Verbose output for debugging
aimit --verbose

# Generate global config file
aimit --generate-config
```

### Configuration

Create a global configuration file:

```bash
aimit --generate-config
```

This creates `~/.config/aimit/config.json` with default settings that you can customize.

---

## 🛠️ Development

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/he0xA1/aimit.git
cd aimit

# Install dependencies
npm install

# Run in watch mode
npm run watch

# Run tests
npm test

# Build the project
npm run build
```

### Project Structure

```
aimit/
├── src/              # Source code
├── test/             # Tests
├── dist/             # Build output
├── llm/              # Model files
├── esbuild.config.mjs
├── jest.config.mjs
└── tsconfig.json
```

### Available Scripts

- `npm run build` - Build the project
- `npm run build:watch` - Watch mode for development
- `npm run build:prod` - Production build
- `npm run build:types` - Generate TypeScript declarations
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run format` - Format code with Prettier
- `npm run watch` - Run in development mode with tsx

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

### Current Refactoring

We're currently refactoring to a layered architecture. See [TODO.md](TODO.md) for the detailed migration plan. If you'd like to help, check the TODO list for tasks that need to be done.

---

## 📝 Roadmap

### Short Term (Current)

- [x] Setup esbuild configuration
- [x] Setup Jest testing framework
- [ ] Complete architecture refactoring (see [TODO.md](TODO.md))
- [ ] Fine-tune Qwen2.6-Coder-0.5B model for commit messages
- [ ] Improve test coverage
- [ ] Add comprehensive documentation

### Medium Term

- [ ] Custom prompt templates
- [ ] Git hook integration
- [ ] Interactive commit message editing
- [ ] Multi-language support

### Long Term

- [ ] VS Code extension
- [ ] IDE plugins

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Model: [Qwen2.6-Coder-0.5B-Instruct](https://huggingface.co/Qwen/Qwen2.6-Coder-0.5B-Instruct) (will be fine-tuned)
- Powered by [node-llama-cpp](https://github.com/withcatai/node-llama-cpp) for local AI inference
- Built with ❤️ for developers who care about their Git history

---

## 📞 Support & Community

- 🐛 [Report a Bug](https://github.com/he0xA1/aimit/issues)
- 💡 [Request a Feature](https://github.com/he0xA1/aimit/issues)
- 💬 [Discussions](https://github.com/he0xA1/aimit/discussions)
- 📖 [Documentation](https://github.com/he0xA1/aimit/wiki)

---

## ⚠️ Security

If you discover a security vulnerability, please see [SECURITY.md](SECURITY.md) for reporting guidelines.

---

<div align="center">

**Made with ☕ and 🤖**

If you find AIMit helpful, consider giving it a ⭐ on GitHub!

</div>
