# Challenge 1: Test Todo Model with Mocks

## 📋 Overview
ตัวอย่างการเขียน Unit Tests สำหรับ Model ที่ต้องติดต่อกับ Database โดยใช้ **Jest Mock** เพื่อ isolate การทดสอบและไม่ต้องเชื่อมต่อกับ Database จริง

## 🎯 Learning Objectives
- เรียนรู้การใช้ `jest.mock()` เพื่อ mock external dependencies
- เข้าใจ `mockResolvedValue` และ `mockRejectedValue` สำหรับ async functions
- ฝึกเขียน tests ที่ครอบคลุมทั้ง success และ error cases
- เรียนรู้การใช้ `mockClear()` และ assertion helpers

## 📁 File Structure
```
src/
  ├── config/
  │   └── database.js          # Database connection แบบ simple
  └── models/
      └── Todo.js              # Todo Model with CRUD operations
tests/
  └── unit/
      └── Todo.test.js         # Tests with database mocking
```

## 🔧 Key Concepts

### 1. Mock Database Module
```javascript
jest.mock('../../src/config/database');
```
- Mock ทั้ง module เพื่อไม่ให้เชื่อมต่อ database จริง
- สามารถควบคุม return value ของแต่ละ test ได้

### 2. Setup Mock Return Values
```javascript
// Mock successful response
db.query.mockResolvedValue(mockData);

// Mock error response
db.query.mockRejectedValue(new Error('Database error'));
```

### 3. Verify Mock Calls
```javascript
// ตรวจสอบว่าถูกเรียกกี่ครั้ง
expect(db.query).toHaveBeenCalledTimes(1);

// ตรวจสอบว่าถูกเรียกด้วย parameters อะไร
expect(db.query).toHaveBeenCalledWith('SELECT * FROM todos');
```

### 4. Clear Mocks Between Tests
```javascript
beforeEach(() => {
  jest.clearAllMocks();
});
```
- ป้องกันไม่ให้ mock state จาก test ก่อนหน้ามากระทบ

## 🧪 Test Coverage

### ✅ Tests Included (16 tests total)

#### `getAll()` - 3 tests
- ✓ Return all todos from database
- ✓ Return empty array when no todos exist
- ✓ Handle database errors

#### `getById(id)` - 3 tests
- ✓ Return a todo by ID
- ✓ Return undefined when todo not found
- ✓ Handle different ID types

#### `create(data)` - 3 tests
- ✓ Create new todo and return it with ID
- ✓ Create todo with minimal data
- ✓ Handle database insertion errors

#### `update(id, data)` - 3 tests
- ✓ Update todo and return true
- ✓ Return false when todo not found
- ✓ Update partial fields

#### `delete(id)` - 3 tests
- ✓ Delete todo and return true
- ✓ Return false when todo not found
- ✓ Handle deletion errors

#### CRUD Workflow - 1 test
- ✓ Simulate complete CRUD workflow

## 🚀 Running Tests

```bash
# Run all Todo tests
npm test Todo.test.js

# Run with coverage
npm test:coverage Todo.test.js

# Run in watch mode
npm test:watch Todo.test.js
```

## 📊 Test Results
```
 PASS  tests/unit/Todo.test.js
  Todo Model
    getAll
      ✓ should return all todos from database
      ✓ should return empty array when no todos exist
      ✓ should handle database errors
    ...

Test Suites: 1 passed, 1 total
Tests:       16 passed, 16 total
```

## 💡 Best Practices Demonstrated

1. **Arrange-Act-Assert Pattern**
   ```javascript
   // Arrange: Setup mock data
   const mockTodos = [{ id: 1, task: 'Test' }];
   db.query.mockResolvedValue(mockTodos);
   
   // Act: Call the method
   const result = await Todo.getAll();
   
   // Assert: Check results
   expect(result).toEqual(mockTodos);
   ```

2. **Test Both Success and Error Cases**
   - Success: normal operation
   - Error: database failures, not found cases

3. **Clear Mocks Between Tests**
   - Prevent test contamination
   - Each test starts with clean slate

4. **Verify Mock Interactions**
   - Check function was called
   - Verify correct parameters
   - Count number of calls

## 🎓 Key Takeaways

✅ **Why Mock Database?**
- Tests run faster (no real DB connection)
- Tests are more reliable (no external dependencies)
- Can test error scenarios easily
- No need for test database setup

✅ **Mock Best Practices**
- Mock at module level with `jest.mock()`
- Use `mockResolvedValue` for successful async responses
- Use `mockRejectedValue` for error scenarios
- Always clear mocks between tests

✅ **What to Test?**
- Normal operation (happy path)
- Edge cases (empty results, not found)
- Error handling (database failures)
- Parameter passing (correct SQL queries)

## 🔗 Related Concepts
- Unit Testing vs Integration Testing
- Test Doubles (Mock, Stub, Spy, Fake)
- Dependency Injection
- Test Isolation

## 📚 References
- [Jest Mock Functions](https://jestjs.io/docs/mock-functions)
- [Jest Mock Modules](https://jestjs.io/docs/manual-mocks)
- [Testing Async Code](https://jestjs.io/docs/asynchronous)
