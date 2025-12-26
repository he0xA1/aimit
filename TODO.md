# Refactoring to Layered Architecture with Domain Separation

## 📋 Overview

This document outlines the step-by-step plan to refactor the aimit project from a flat file structure to a **Layered Architecture with Domain Separation**. This architecture will improve maintainability, testability, and scalability.

## 🏗️ Target Architecture

```ls
src/
├── cli/                    # Presentation Layer - User interface
├── commands/               # Application Layer - Command handlers
├── domain/                 # Domain Layer - Business logic & models
├── infrastructure/         # Infrastructure Layer - External services
└── shared/                 # Shared utilities
```

## 📦 File Migration Map

| Current File | Target Location                                        | Layer                   |
| ------------ | ------------------------------------------------------ | ----------------------- |
| `cli.ts`     | `cli/index.ts`                                         | Presentation            |
| `command.ts` | `commands/*.command.ts`                                | Application             |
| `service.ts` | Split into `infrastructure/ai/` and `domain/services/` | Infrastructure + Domain |
| `git.ts`     | `infrastructure/git/git.repository.ts`                 | Infrastructure          |
| `config.ts`  | `shared/config/`                                       | Shared                  |
| `error.ts`   | `shared/errors/index.ts`                               | Shared                  |
| `logger.ts`  | `shared/logger/index.ts`                               | Shared                  |
| `utils.ts`   | `shared/utils/index.ts`                                | Shared                  |
| `index.ts`   | `index.ts` (refactored)                                | Entry Point             |

---

## 🚀 Phase 1: Setup New Directory Structure

### 1.1 Create Directory Structure

- [ ] Create `src/cli/` directory
- [ ] Create `src/commands/` directory
- [ ] Create `src/domain/` directory
  - [ ] Create `src/domain/models/` subdirectory
  - [ ] Create `src/domain/services/` subdirectory
  - [ ] Create `src/domain/types/` subdirectory
- [ ] Create `src/infrastructure/` directory
  - [ ] Create `src/infrastructure/ai/` subdirectory
  - [ ] Create `src/infrastructure/git/` subdirectory
  - [ ] Create `src/infrastructure/storage/` subdirectory
- [ ] Create `src/shared/` directory
  - [ ] Create `src/shared/errors/` subdirectory
  - [ ] Create `src/shared/logger/` subdirectory
  - [ ] Create `src/shared/config/` subdirectory
  - [ ] Create `src/shared/utils/` subdirectory

### 1.2 Update TypeScript Configuration

- [ ] Verify `tsconfig.json` includes new directories
- [ ] Ensure path aliases work correctly (if needed)

---

## 🔧 Phase 2: Migrate Shared Utilities

### 2.1 Error Handling (`shared/errors/`)

- [ ] Create `src/shared/errors/index.ts`
- [ ] Move `BaseError` class from `error.ts`
- [ ] Move `handleError` function from `error.ts`
- [ ] Move `fatal` function from `error.ts`
- [ ] Move `installGlobalHandlers` function from `error.ts`
- [ ] Update all imports across the codebase
- [ ] Delete old `src/error.ts`

### 2.2 Logger (`shared/logger/`)

- [ ] Create `src/shared/logger/index.ts`
- [ ] Move `setUpLogger` function from `logger.ts`
- [ ] Move `logDebug`, `logInfo`, `logWarn` functions from `logger.ts`
- [ ] Move `LogSetting` type from `logger.ts`
- [ ] Update all imports across the codebase
- [ ] Delete old `src/logger.ts`

### 2.3 Utilities (`shared/utils/`)

- [ ] Create `src/shared/utils/index.ts`
- [ ] Move `promisedExec` from `utils.ts`
- [ ] Move `isExecException` function from `utils.ts`
- [ ] Move `gitCommandExecuter` function from `utils.ts` (temporary, will be refactored in Phase 4)
- [ ] Update all imports across the codebase
- [ ] Delete old `src/utils.ts`

### 2.4 Configuration (`shared/config/`)

- [ ] Create `src/shared/config/loader.ts`
  - [ ] Move `loadConfigFile` function
  - [ ] Move `getConfigPaths` function
  - [ ] Move `loadConfig` function
- [ ] Create `src/shared/config/validator.ts`
  - [ ] Move `configOptionsSchema` from `config.ts`
  - [ ] Move `validateOptions` function
- [ ] Create `src/shared/config/defaults.ts`
  - [ ] Move `defaultConfig` object
  - [ ] Move `defaultSystemPrompt` constant
  - [ ] Move `defaultUserPrompt` constant
- [ ] Create `src/shared/config/types.ts`
  - [ ] Move `Options` interface
  - [ ] Move `Config` type
- [ ] Create `src/shared/config/index.ts` (barrel export)
- [ ] Create `src/shared/config/factory.ts`
  - [ ] Move `createGlobalConfigFile` function
  - [ ] Export singleton `config` instance
- [ ] Update all imports across the codebase
- [ ] Delete old `src/config.ts`

---

## 🏛️ Phase 3: Migrate Infrastructure Layer

### 3.1 Git Repository (`infrastructure/git/`)

- [ ] Create `src/infrastructure/git/git.repository.ts`
- [ ] Create `GitRepository` class
  - [ ] Move `getListsOfStagedFiles` as private method
  - [ ] Move `getDiffOfStagedFiles` as public method `getStagedDiff()`
  - [ ] Add proper error handling
  - [ ] Add interface/type for Git operations
- [ ] Create `src/infrastructure/git/index.ts` (barrel export)
- [ ] Update all imports across the codebase
- [ ] Delete old `src/git.ts`

### 3.2 AI Infrastructure (`infrastructure/ai/`)

- [ ] Create `src/infrastructure/ai/ollama.client.ts`
  - [ ] Create `OllamaClient` class
  - [ ] Move `ollama` instance initialization
  - [ ] Move `getFirstModel` function as private method
  - [ ] Add `generate(prompt: string, systemPrompt: string, model: string): Promise<string>` method
  - [ ] Add `checkConnection(): Promise<void>` method (from `ollama.ps()`)
- [ ] Create `src/infrastructure/ai/llama.loader.ts`
  - [ ] Create `LlamaLoader` class
  - [ ] Move `LLMLoader` class from `service.ts`
  - [ ] Move `initializeModel` function (or integrate into class)
  - [ ] Move model path logic
- [ ] Create `src/infrastructure/ai/index.ts` (barrel export)
- [ ] Update all imports across the codebase

### 3.3 Storage Infrastructure (`infrastructure/storage/`)

- [ ] Create `src/infrastructure/storage/config.repository.ts`
  - [ ] Move `createGlobalConfigFile` function (from shared/config)
  - [ ] Add methods for reading/writing config files
- [ ] Create `src/infrastructure/storage/index.ts` (barrel export)

---

## 🎯 Phase 4: Create Domain Layer

### 4.1 Domain Models

- [ ] Create `src/domain/models/commit-message.ts`
  - [ ] Define `CommitMessage` class or interface
  - [ ] Add validation logic
  - [ ] Add formatting methods
- [ ] Create `src/domain/models/config.ts`
  - [ ] Move `Config` type (if not already in shared)
  - [ ] Add domain-specific config operations

### 4.2 Domain Services

- [ ] Create `src/domain/services/message-generator.service.ts`
  - [ ] Create `MessageGeneratorService` class
  - [ ] Move core `generateMessage` logic from `service.ts`
  - [ ] Inject dependencies: `OllamaClient`, `GitRepository`, `Config`
  - [ ] Extract prompt building logic
  - [ ] Add business logic for message generation
- [ ] Create `src/domain/services/prompt-builder.service.ts`
  - [ ] Create `PromptBuilderService` class
  - [ ] Extract prompt template logic
  - [ ] Handle prompt variable substitution
- [ ] Create `src/domain/types/index.ts`
  - [ ] Define domain-specific types and interfaces
- [ ] Create `src/domain/index.ts` (barrel export)

---

## 🎨 Phase 5: Migrate Application Layer (Commands)

### 5.1 Command Handlers

- [ ] Create `src/commands/commit.command.ts`
  - [ ] Move `handleCommit` function
  - [ ] Refactor to use `GitRepository`
  - [ ] Add proper error handling
- [ ] Create `src/commands/amend.command.ts`
  - [ ] Move `handleAmend` function
  - [ ] Refactor to use `GitRepository`
  - [ ] Add proper error handling
- [ ] Create `src/commands/dry-run.command.ts`
  - [ ] Move `handleDryRun` function
  - [ ] Improve output formatting
- [ ] Create `src/commands/generate-config.command.ts`
  - [ ] Extract config generation logic from `index.ts`
  - [ ] Use `ConfigRepository` from infrastructure
- [ ] Create `src/commands/index.ts` (barrel export)

---

## 🖥️ Phase 6: Migrate Presentation Layer (CLI)

### 6.1 CLI Setup

- [ ] Create `src/cli/index.ts`
  - [ ] Move `commands` Command instance from `cli.ts`
  - [ ] Refactor to use new config structure
  - [ ] Update option definitions
- [ ] Create `src/cli/parser.ts` (optional)
  - [ ] Extract option parsing logic
  - [ ] Add option validation helpers
- [ ] Create `src/cli/index.ts` (barrel export)
- [ ] Delete old `src/cli.ts`

---

## 🔗 Phase 7: Refactor Entry Point & Dependency Injection

### 7.1 Create Factory Functions

- [ ] Create `src/factories/index.ts`
  - [ ] Create `createOllamaClient(config: Config): OllamaClient`
  - [ ] Create `createGitRepository(): GitRepository`
  - [ ] Create `createMessageGeneratorService(...): MessageGeneratorService`
  - [ ] Create `createCommandHandlers(...): CommandHandlers`

### 7.2 Refactor Main Entry Point

- [ ] Update `src/index.ts`
  - [ ] Use factory functions to create dependencies
  - [ ] Refactor `main()` function to use new structure
  - [ ] Update imports to use new paths
  - [ ] Ensure all functionality works correctly

---

## 🧪 Phase 8: Update Tests

### 8.1 Update Test Structure

- [ ] Create `test/unit/` directory structure
  - [ ] `test/unit/domain/`
  - [ ] `test/unit/commands/`
  - [ ] `test/unit/infrastructure/`
- [ ] Create `test/integration/` directory
- [ ] Update `test/service.test.ts` to match new structure
  - [ ] Update imports
  - [ ] Mock new dependencies
  - [ ] Update test cases

### 8.2 Add New Tests

- [ ] Add unit tests for `MessageGeneratorService`
- [ ] Add unit tests for `OllamaClient`
- [ ] Add unit tests for `GitRepository`
- [ ] Add unit tests for command handlers
- [ ] Add integration tests for end-to-end flows

---

## 🧹 Phase 9: Cleanup & Verification

### 9.1 Remove Old Files

- [ ] Delete `src/service.ts` (fully migrated)
- [ ] Verify no old imports remain
- [ ] Check for any unused code

### 9.2 Update Documentation

- [ ] Update `README.md` with new architecture
- [ ] Add architecture diagram (optional)
- [ ] Update any code examples in documentation

### 9.3 Final Verification

- [ ] Run `npm run build` - verify build succeeds
- [ ] Run `npm run test` - verify all tests pass
- [ ] Test CLI commands manually:
  - [ ] `aimit --dry-run`
  - [ ] `aimit --commit`
  - [ ] `aimit --amend`
  - [ ] `aimit --generate-config`
- [ ] Verify no functionality regressions
- [ ] Check bundle size (should be similar or smaller)

---

## 📝 Phase 10: Code Quality Improvements

### 10.1 Add Type Safety

- [ ] Add proper TypeScript interfaces for all services
- [ ] Add return types to all functions
- [ ] Remove `any` types where possible
- [ ] Add JSDoc comments for public APIs

### 10.2 Improve Error Handling

- [ ] Create domain-specific error classes
  - [ ] `GitRepositoryError`
  - [ ] `AIServiceError`
  - [ ] `ConfigError`
- [ ] Add proper error messages
- [ ] Improve error context

### 10.3 Code Organization

- [ ] Ensure consistent naming conventions
- [ ] Add barrel exports where appropriate
- [ ] Organize imports consistently
- [ ] Run linter and fix issues

---

## 🎯 Success Criteria

- [ ] All tests pass
- [ ] Build succeeds without errors
- [ ] All CLI commands work as expected
- [ ] Code is organized in clear layers
- [ ] Dependencies flow in one direction (Presentation → Application → Domain ← Infrastructure)
- [ ] No circular dependencies
- [ ] Improved testability (services can be easily mocked)
- [ ] Better separation of concerns

---

## 📚 Architecture Principles

1. **Dependency Rule**: Dependencies should point inward
   - Presentation depends on Application
   - Application depends on Domain
   - Infrastructure depends on Domain
   - Domain has no dependencies on other layers

2. **Single Responsibility**: Each class/function has one clear purpose

3. **Dependency Injection**: Use factories or constructor injection

4. **Interface Segregation**: Define clear interfaces between layers

5. **Testability**: Each layer can be tested independently

---

## 🔄 Migration Strategy

1. **Incremental Migration**: Migrate one layer at a time
2. **Keep Tests Passing**: Ensure tests pass after each phase
3. **Small Commits**: Commit after each major step
4. **Verify Functionality**: Test CLI after each phase
5. **Refactor Gradually**: Don't try to do everything at once

---

## 📅 Estimated Timeline

- **Phase 1-2**: 1-2 hours (Setup + Shared utilities)
- **Phase 3**: 2-3 hours (Infrastructure layer)
- **Phase 4**: 2-3 hours (Domain layer)
- **Phase 5-6**: 1-2 hours (Application + Presentation)
- **Phase 7**: 1-2 hours (Dependency injection)
- **Phase 8**: 2-3 hours (Tests)
- **Phase 9-10**: 1-2 hours (Cleanup + Quality)

**Total**: ~12-18 hours

---

## 🚨 Notes

- Keep the old code working until migration is complete
- Test after each phase before moving to the next
- Use feature flags if needed to support both old and new code
- Document any architectural decisions in code comments
- Consider creating a migration branch for safety

---

**Last Updated**: 2024
**Status**: 🟡 In Progress
