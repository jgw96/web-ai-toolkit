# Linting Setup

This project uses ESLint for code linting and formatting to maintain consistent code quality.

## Configuration

- **ESLint Config**: `eslint.config.js` (uses ESLint 9 flat config format)
- **VS Code Settings**: `.vscode/settings.json` (integrates ESLint with VS Code)

## Available Scripts

- `npm run lint` - Run ESLint to check for issues
- `npm run lint:fix` - Run ESLint and automatically fix issues where possible
- `npm run lint:check` - Run ESLint with zero warnings tolerance (useful for CI)

## Rules Overview

### TypeScript Rules
- Enforces explicit return types for functions (warning)
- Prevents use of `any` type (warning)
- Prevents unused variables (error)
- Removes inferrable type annotations (error)

### Code Style
- 2-space indentation
- Single quotes for strings
- Semicolons required
- Trailing commas in multiline objects/arrays

### Import Organization
- Alphabetical order within groups
- Proper grouping: builtin, external, internal, parent, sibling, index
- Empty lines between import groups

### Code Quality
- Console statements are warnings (allowed in development)
- No debugger statements (error)
- Async promise executors are warnings
- Consistent equality checks (===)
- Prefer const over let where possible

## VS Code Integration

The project includes VS Code settings to:
- Enable ESLint validation for TypeScript and JavaScript files
- Auto-fix ESLint issues on save
- Format code on save

## Customization

To modify rules, edit the `eslint.config.js` file. Rules can be:
- `"error"` - Will cause ESLint to exit with an error code
- `"warn"` - Will show warnings but won't fail
- `"off"` - Disable the rule

## Ignoring Files

Files are ignored using the `ignores` property in `eslint.config.js`:
- `node_modules/`
- `dist/`
- `build/`
- `*.min.js`
- `coverage/`
