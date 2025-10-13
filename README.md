# MedImmoSecret

## Testing

The project uses Jest and Testing Library for unit and integration testing. No additional third-party libraries are required for testing.

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