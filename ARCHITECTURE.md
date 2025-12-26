# Architecture Documentation

## Overview

AIMit is being refactored to follow a **Layered Architecture with Domain Separation**. This document describes the target architecture and design decisions.

## Current Status

⚠️ **In Development**: The project is currently being refactored from a flat structure to a layered architecture. See [TODO.md](TODO.md) for the migration plan.

## Target Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                   │
│                      (src/cli/)                         │
│  - CLI interface and command parsing                     │
│  - User interaction                                      │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│                 Application Layer                        │
│                  (src/commands/)                        │
│  - Command handlers                                      │
│  - Orchestration logic                                   │
└──────────────────┬──────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────┐
│                   Domain Layer                          │
│                  (src/domain/)                          │
│  - Business logic                                        │
│  - Domain models                                        │
│  - Domain services                                      │
└────────────┬───────────────────────┬────────────────────┘
             │                       │
┌────────────▼──────────┐  ┌─────────▼────────────────────┐
│   Infrastructure      │  │      Shared                   │
│   (src/infrastructure/)│  │   (src/shared/)              │
│  - AI clients          │  │  - Utilities                 │
│  - Git repository      │  │  - Error handling            │
│  - Storage            │  │  - Logging                    │
│  - External services  │  │  - Configuration             │
└───────────────────────┘  └──────────────────────────────┘
```

## Layer Responsibilities

### Presentation Layer (`src/cli/`)

**Purpose**: Handle user interface and input/output

**Responsibilities**:
- Parse command-line arguments
- Define CLI options and flags
- Format output for users
- Handle user input validation

**Dependencies**: Application Layer

**Key Components**:
- `cli/index.ts` - Main CLI setup
- `cli/parser.ts` - Option parsing logic

### Application Layer (`src/commands/`)

**Purpose**: Orchestrate business operations and handle commands

**Responsibilities**:
- Execute command handlers
- Coordinate between domain services
- Handle command-specific logic
- Manage command flow

**Dependencies**: Domain Layer

**Key Components**:
- `commands/commit.command.ts` - Commit command handler
- `commands/amend.command.ts` - Amend command handler
- `commands/dry-run.command.ts` - Dry-run command handler
- `commands/generate-config.command.ts` - Config generation handler

### Domain Layer (`src/domain/`)

**Purpose**: Core business logic and domain models

**Responsibilities**:
- Business rules and logic
- Domain models and entities
- Domain services
- Domain-specific types

**Dependencies**: None (pure business logic)

**Key Components**:
- `domain/models/` - Domain entities
- `domain/services/` - Business logic services
- `domain/types/` - Domain-specific types

**Example**:
```typescript
// domain/services/message-generator.service.ts
export class MessageGeneratorService {
  constructor(
    private aiClient: AIClient,
    private gitRepo: GitRepository,
    private config: Config
  ) {}
  
  async generateMessage(): Promise<string> {
    // Business logic here
  }
}
```

### Infrastructure Layer (`src/infrastructure/`)

**Purpose**: External services and technical implementations

**Responsibilities**:
- AI client implementations (Ollama, Llama)
- Git repository operations
- File system operations
- External API integrations

**Dependencies**: Domain Layer (implements domain interfaces)

**Key Components**:
- `infrastructure/ai/ollama.client.ts` - Ollama API client
- `infrastructure/ai/llama.loader.ts` - Local LLM loader
- `infrastructure/git/git.repository.ts` - Git operations
- `infrastructure/storage/config.repository.ts` - Config storage

### Shared Layer (`src/shared/`)

**Purpose**: Cross-cutting concerns and utilities

**Responsibilities**:
- Error handling
- Logging
- Configuration management
- Common utilities
- Type definitions

**Dependencies**: None (or minimal)

**Key Components**:
- `shared/errors/` - Error classes and handlers
- `shared/logger/` - Logging utilities
- `shared/config/` - Configuration management
- `shared/utils/` - Utility functions

## Design Principles

### 1. Dependency Rule

Dependencies should point inward:
- **Presentation** → **Application** → **Domain** ← **Infrastructure**
- **Domain** has no dependencies on other layers
- **Infrastructure** depends on **Domain** (implements interfaces)

### 2. Separation of Concerns

Each layer has a single, well-defined responsibility:
- **Presentation**: User interaction
- **Application**: Command orchestration
- **Domain**: Business logic
- **Infrastructure**: Technical implementation
- **Shared**: Cross-cutting concerns

### 3. Dependency Injection

Use dependency injection to:
- Enable testing (mock dependencies)
- Reduce coupling
- Improve flexibility

**Example**:
```typescript
// Factory pattern
export function createMessageGeneratorService(
  config: Config
): MessageGeneratorService {
  const aiClient = createAIClient(config);
  const gitRepo = createGitRepository();
  return new MessageGeneratorService(aiClient, gitRepo, config);
}
```

### 4. Interface Segregation

Define clear interfaces between layers:
- Domain defines interfaces
- Infrastructure implements them
- Application uses domain interfaces

## Data Flow

### Typical Command Flow

```
User Input
    ↓
CLI Layer (parse options)
    ↓
Application Layer (command handler)
    ↓
Domain Layer (business logic)
    ↓
Infrastructure Layer (AI client, Git repo)
    ↓
Response flows back up
```

### Example: Generate Commit Message

1. **CLI**: Parse `--dry-run` option
2. **Application**: Call `DryRunCommand.execute()`
3. **Domain**: `MessageGeneratorService.generateMessage()`
4. **Infrastructure**: 
   - `GitRepository.getStagedDiff()`
   - `OllamaClient.generate(prompt)`
5. **Domain**: Process and format response
6. **Application**: Handle output
7. **CLI**: Display to user

## Key Design Decisions

### Why Layered Architecture?

- **Testability**: Each layer can be tested independently
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new features
- **Flexibility**: Can swap implementations (e.g., different AI backends)

### Why Domain Separation?

- **Business Logic Isolation**: Core logic independent of technical details
- **Reusability**: Domain logic can be reused across different interfaces
- **Testability**: Test business logic without infrastructure

### Model Strategy

- **Current**: Using Ollama API and local models via node-llama-cpp
- **Future**: Fine-tuned Qwen2.6-Coder-0.5B model
- **Abstraction**: AI clients abstracted behind interfaces for easy swapping

## File Organization

```
src/
├── cli/
│   ├── index.ts
│   └── parser.ts
├── commands/
│   ├── commit.command.ts
│   ├── amend.command.ts
│   ├── dry-run.command.ts
│   └── index.ts
├── domain/
│   ├── models/
│   │   └── commit-message.ts
│   ├── services/
│   │   ├── message-generator.service.ts
│   │   └── prompt-builder.service.ts
│   ├── types/
│   │   └── index.ts
│   └── index.ts
├── infrastructure/
│   ├── ai/
│   │   ├── ollama.client.ts
│   │   ├── llama.loader.ts
│   │   └── index.ts
│   ├── git/
│   │   ├── git.repository.ts
│   │   └── index.ts
│   └── storage/
│       ├── config.repository.ts
│       └── index.ts
├── shared/
│   ├── errors/
│   │   └── index.ts
│   ├── logger/
│   │   └── index.ts
│   ├── config/
│   │   ├── loader.ts
│   │   ├── validator.ts
│   │   └── index.ts
│   └── utils/
│       └── index.ts
├── factories/
│   └── index.ts
└── index.ts
```

## Testing Strategy

### Unit Tests
- Test each layer independently
- Mock dependencies from other layers
- Focus on business logic in domain layer

### Integration Tests
- Test layer interactions
- Test end-to-end flows
- Use real implementations where appropriate

### Test Organization
```
test/
├── unit/
│   ├── domain/
│   ├── commands/
│   └── infrastructure/
└── integration/
    └── e2e/
```

## Future Considerations

### Potential Extensions

1. **Multiple AI Backends**: Easy to add new AI providers via infrastructure layer
2. **Plugin System**: Could add plugin architecture in application layer
3. **Web Interface**: Add new presentation layer (web UI)
4. **API Server**: Add HTTP API presentation layer

### Performance Considerations

- **Lazy Loading**: Load AI models only when needed
- **Caching**: Cache Git diffs and AI responses
- **Streaming**: Stream AI responses for better UX

## Migration Notes

See [TODO.md](TODO.md) for detailed migration steps. The migration is being done incrementally to maintain functionality throughout the process.

## References

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Layered Architecture Pattern](https://www.oreilly.com/library/view/software-architecture-patterns/9781491971437/ch01.html)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

---

**Last Updated**: 2024
**Status**: 🚧 In Development

