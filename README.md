# MedImmoSecret

## Getting Started

- Requirements: Node.js 18+, npm
- Install deps: `npm install`
- Environment variables (create `.env.local` or `.env`):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - Optional: `VITE_GRAPHQL_URL` (defaults to `http://localhost:4000/graphql`)
- Run dev server: `npm run dev`
- Build: `npm run build` and preview: `npm run preview`

## Testing

The project uses Vitest and Testing Library for unit and integration testing. No additional third-party libraries are required for testing.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Structure

- Tests are located next to the files they test in `__tests__` directories
- Mock files are located in `src/__mocks__`
- Global test setup is in `src/setupTests.ts`

### Writing Tests

Example test file:

```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Coverage Requirements

The project maintains a minimum test coverage of 70% for:
- Branches
- Functions
- Lines
- Statements

Coverage reports are generated in the `coverage` directory when running `npm run test:coverage`.
