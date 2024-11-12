NestJS application to handle Portfolio, Blog, and other feature

```
src/
├── common/                      # Common utilities, types, and helpers
│   ├── utils/                   # Utility/helper functions
│   ├── interfaces/              # Common interfaces
│   ├── guards/                  # Guards for role-based access control (RBAC)
│   ├── interceptors/            # Interceptors (logging, response transformation)
│   ├── pipes/                   # Pipes (validation, transformation)
│   └── filters/                 # Global exception filters
├── database/                    # Database-related files (seeders, migrations, repositories)
│   ├── migrations/              # Migrations for schema changes
│   ├── seeders/                 # Seeders for populating data
│   ├── repositories/            # Repositories (data access layer)
│   └── database.module.ts       # Module to manage migrations, seeders, repositories
├── modules/                     # Feature-based modules
│   ├── auth/                    # Authentication module
│   │   ├── commands/            # Command handlers (write operations)
│   │   │   ├── create-user.command.ts
│   │   │   └── update-user.command.ts
│   │   ├── queries/             # Query handlers (read operations)
│   │   │   ├── get-user.query.ts
│   │   │   └── get-all-users.query.ts
│   │   ├── dto/                 # Command and Query DTOs
│   │   │   ├── create-user.dto.ts
│   │   │   └── get-user.dto.ts
│   │   ├── events/              # Event handlers (for async processing)
│   │   │   └── user-created.event.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── auth.repository.ts
│   ├── users/                   # Users module
│   │   ├── commands/            # Command handlers
│   │   │   ├── create-user.command.ts
│   │   │   └── delete-user.command.ts
│   │   ├── queries/             # Query handlers
│   │   │   ├── get-user.query.ts
│   │   │   └── get-users.query.ts
│   │   ├── dto/                 # User-related DTOs for commands and queries
│   │   │   ├── create-user.dto.ts
│   │   │   └── get-user.dto.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.entity.ts
│   │   ├── user.module.ts
│   │   └── user.repository.ts
│   ├── blogs/                   # Blog module (similar structure)
│   └── ...                      # Other feature modules
├── shared/                      # Shared utilities or libraries
│   ├── mail/                    # Mail service
│   ├── logger/                  # Logger service
│   └── ...                      # Other shared services
├── config/                      # Configuration files
├── app.module.ts                # Main application module
├── main.ts                      # Application bootstrap file
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Project dependencies and scripts
```
