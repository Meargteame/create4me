# 🧪 Create4Me Testing Guide

## Overview

This guide covers the testing infrastructure and best practices for the Create4Me platform.

---

## 📦 Testing Stack

### Frontend Testing
- **Test Runner:** Vitest (fast, Vite-native)
- **Testing Library:** React Testing Library
- **DOM Matchers:** @testing-library/jest-dom
- **Coverage:** Vitest Coverage (v8)

### Backend Testing (Future)
- **Test Runner:** Jest
- **API Testing:** Supertest
- **Mocking:** Jest mocks

---

## 🚀 Quick Start

### Installation

```bash
cd react-frontend
npm install --save-dev vitest @vitest/ui @vitest/coverage-v8 jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

---

## 📁 Test Structure

```
react-frontend/
├── src/
│   ├── test/
│   │   ├── setup.ts              # Global test setup
│   │   └── utils/
│   │       └── test-utils.tsx    # Custom render with providers
│   ├── components/
│   │   └── ui/
│   │       └── __tests__/
│   │           └── ImageUpload.test.tsx
│   ├── utils/
│   │   └── __tests__/
│   │       └── debounce.test.ts
│   └── lib/
│       └── __tests__/
│           └── api.test.ts
└── vitest.config.ts              # Vitest configuration
```

---

## ✅ Implemented Tests

### 1. **Utility Tests**

#### `debounce.test.ts`
- ✅ Debounces function calls correctly
- ✅ Passes arguments to debounced function
- ✅ Resets timer on subsequent calls
- ✅ useDebounce hook works correctly

### 2. **Component Tests**

#### `ImageUpload.test.tsx`
- ✅ Renders upload button when no image
- ✅ Displays preview when image provided
- ✅ Shows error for invalid file type
- ✅ Shows error for oversized file
- ✅ Calls onChange when valid file selected

### 3. **API Tests**

#### `api.test.ts`
- ✅ Login successfully
- ✅ Includes auth token in requests
- ✅ Fetches campaigns
- ✅ Creates campaign
- ✅ Handles errors correctly
- ✅ Handles network failures

---

## 🎯 Testing Best Practices

### 1. **Test Organization**

```typescript
describe('ComponentName', () => {
  describe('Feature/Behavior', () => {
    it('should do something specific', () => {
      // Arrange
      // Act
      // Assert
    })
  })
})
```

### 2. **Using Custom Render**

```typescript
import { render, screen } from '../../../test/utils/test-utils'

it('should render with providers', () => {
  render(<MyComponent />)
  expect(screen.getByText('Hello')).toBeInTheDocument()
})
```

### 3. **Testing User Interactions**

```typescript
import { render, screen, fireEvent } from '@testing-library/react'

it('should handle click', () => {
  const handleClick = vi.fn()
  render(<Button onClick={handleClick}>Click me</Button>)
  
  fireEvent.click(screen.getByText('Click me'))
  
  expect(handleClick).toHaveBeenCalledTimes(1)
})
```

### 4. **Testing Async Operations**

```typescript
import { render, screen, waitFor } from '@testing-library/react'

it('should load data', async () => {
  render(<DataComponent />)
  
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument()
  })
})
```

### 5. **Mocking API Calls**

```typescript
import { vi } from 'vitest'

global.fetch = vi.fn()

it('should fetch data', async () => {
  (global.fetch as any).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ data: 'test' })
  })
  
  // Test component that uses fetch
})
```

---

## 📊 Coverage Goals

### Target Coverage
- **Statements:** 80%
- **Branches:** 75%
- **Functions:** 80%
- **Lines:** 80%

### Priority Areas
1. **Critical Business Logic** - 90%+
   - Authentication
   - Campaign creation/application
   - Payment processing

2. **Utility Functions** - 90%+
   - Validation
   - Formatting
   - Data transformation

3. **UI Components** - 70%+
   - Reusable components
   - Forms
   - Modals

4. **Pages** - 60%+
   - Main user flows
   - Error states

---

## 🧪 Test Categories

### Unit Tests
Test individual functions and components in isolation.

**Example:**
```typescript
describe('validateEmail', () => {
  it('should return true for valid email', () => {
    expect(validateEmail('test@example.com')).toBe(true)
  })
  
  it('should return false for invalid email', () => {
    expect(validateEmail('invalid')).toBe(false)
  })
})
```

### Integration Tests
Test how multiple components work together.

**Example:**
```typescript
describe('LoginFlow', () => {
  it('should login and redirect to dashboard', async () => {
    render(<App />)
    
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password' }
    })
    fireEvent.click(screen.getByText('Sign In'))
    
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument()
    })
  })
})
```

### E2E Tests (Future)
Test complete user journeys using Playwright.

---

## 🔧 Configuration

### `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
})
```

### `setup.ts`

```typescript
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})

// Mock window.matchMedia
// Mock IntersectionObserver
// Mock localStorage
```

---

## 📝 Writing New Tests

### 1. Create Test File
Place test file next to the code it tests or in `__tests__` folder:
- `Component.tsx` → `Component.test.tsx`
- `utils/helper.ts` → `utils/__tests__/helper.test.ts`

### 2. Import Dependencies
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '../../../test/utils/test-utils'
```

### 3. Write Test Cases
```typescript
describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
```

### 4. Run Tests
```bash
npm test MyComponent
```

---

## 🐛 Debugging Tests

### 1. **Use screen.debug()**
```typescript
it('should render', () => {
  render(<MyComponent />)
  screen.debug() // Prints DOM to console
})
```

### 2. **Use Vitest UI**
```bash
npm run test:ui
```
Opens interactive UI to debug tests.

### 3. **Check Test Output**
```bash
npm test -- --reporter=verbose
```

---

## 🚦 CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
```

---

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## 🎯 Next Steps

### Immediate
1. ✅ Install test dependencies
2. ✅ Run existing tests
3. ✅ Review test coverage

### Short Term
1. Add tests for critical components
2. Add tests for authentication flow
3. Add tests for campaign creation

### Long Term
1. Achieve 80% coverage
2. Add E2E tests with Playwright
3. Add visual regression tests

---

**Status:** 🟢 Test Infrastructure Ready  
**Coverage:** 🟡 Basic tests implemented  
**Next:** Add more component and integration tests

---

*Generated for Create4Me Platform Testing*
