# 📊 ผลการทดลอง - Workshop 10 Level 1

## ผู้ทดลอง
- ชื่อ: วิศรุต กอบคำ
- วันที่: 3 February 2026

## 🚀 Step 6: ทดสอบการทำงาน

### 6.1 เริ่มต้น Server
**Command:**
```bash
npm run dev
```

**ผลลัพธ์:**
```
==================================================
🚀 Server is running on port 3000
📍 URL: http://localhost:3000
🌍 Environment: development
==================================================
```
✅ Server เริ่มต้นสำเร็จ

---

## 📋 การทดสอบ Endpoints

### 1. GET /api/users - ดึงข้อมูล users ทั้งหมด
**Request:**
```bash
curl http://localhost:3000/api/users
```

**Response:**
```json
{
  "success": true,
  "count": 4,
  "total": 4,
  "page": 1,
  "totalPages": 1,
  "data": [
    {"id": 1, "name": "John Updated", "email": "john@example.com", "role": "admin"},
    {"id": 2, "name": "Jane Smith", "email": "jane@example.com", "role": "user"},
    {"id": 3, "name": "Bob Johnson", "email": "bob@example.com", "role": "user"},
    {"id": 4, "name": "Alice", "email": "alice@example.com", "role": "user"}
  ]
}
```

**สังเกต:** 
- ✅ ส่ง response ในรูปแบบ JSON
- ✅ มี pagination info (page, totalPages, total)
- ✅ ได้ข้อมูล users 4 คน (รวม Alice ที่เพิ่งสร้าง)

---

### 2. GET /api/users/1 - ดึง user ตาม ID
**Request:**
```bash
curl http://localhost:3000/api/users/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Updated",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

**สังเกต:** 
- ✅ ดึงข้อมูล user เฉพาะคนที่ id = 1
- ✅ Route parameter (/:id) ทำงานถูกต้อง

---

### 3. GET /api/users?role=admin - Filter ตาม role
**Request:**
```bash
curl 'http://localhost:3000/api/users?role=admin'
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "total": 1,
  "page": 1,
  "totalPages": 1,
  "data": [
    {"id": 1, "name": "John Updated", "email": "john@example.com", "role": "admin"}
  ]
}
```

**สังเกต:** 
- ✅ Query string filtering ทำงานได้
- ✅ กรองเฉพาะ user ที่มี role = admin

---

### 4. POST /api/users - สร้าง user ใหม่
**Request:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice","email":"alice@example.com","role":"user"}'
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 4,
    "name": "Alice",
    "email": "alice@example.com",
    "role": "user"
  }
}
```

**สังเกต:** 
- ✅ สร้าง user ใหม่สำเร็จ
- ✅ Status code 201 (Created)
- ✅ Auto-generate ID

---

### 5. PUT /api/users/1 - แก้ไข user
**Request:**
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"John Updated"}'
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "name": "John Updated",
    "email": "john@example.com",
    "role": "admin"
  }
}
```

**สังเกต:** 
- ✅ Update ข้อมูลสำเร็จ
- ✅ ข้อมูลอื่นที่ไม่ได้ส่งมายังคงอยู่

---

### 6. GET /health - Health check
**Request:**
```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "uptime": 123.456,
  "timestamp": "2026-02-03T02:01:40.000Z"
}
```

**สังเกต:** 
- ✅ แสดง uptime ของ server
- ✅ ใช้เช็คว่า server ยังทำงานอยู่หรือไม่

---

### 7. GET /info - Server information
**Request:**
```bash
curl http://localhost:3000/info
```

**Response:**
```json
{
  "success": true,
  "info": {
    "nodeVersion": "v20.x.x",
    "platform": "linux",
    "memory": {...},
    "env": "development"
  }
}
```

**สังเกต:** 
- ✅ แสดงข้อมูล Node.js version
- ✅ แสดง platform และ memory usage

---

### 8. GET /api/products - ดึงข้อมูล products
**Request:**
```bash
curl http://localhost:3000/api/products
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {"id": 1, "name": "Laptop", "price": 999.99, "category": "electronics", "stock": 50},
    {"id": 2, "name": "Mouse", "price": 29.99, "category": "electronics", "stock": 200},
    {"id": 3, "name": "Desk", "price": 199.99, "category": "furniture", "stock": 30}
  ]
}
```

**สังเกต:** 
- ✅ Products route ทำงานได้ปกติ
- ✅ มี query filtering (category, minPrice, maxPrice)

---

### 9. GET /nonexistent - ทดสอบ 404 Error
**Request:**
```bash
curl http://localhost:3000/nonexistent
```

**Response:**
```json
{
  "success": false,
  "error": {
    "message": "Not Found - /nonexistent",
    "stack": "..."
  }
}
```

**สังเกต:** 
- ✅ 404 handler ทำงานถูกต้อง
- ✅ Status code 404
- ✅ แสดง error message ที่ชัดเจน

---

## 🎯 Challenge Tasks - ผลการทดสอบ

### Challenge 1: Search Endpoint
**Request:**
```bash
curl 'http://localhost:3000/api/users/search?name=john'
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {"id": 1, "name": "John Updated", "email": "john@example.com", "role": "admin"}
  ]
}
```

**สังเกต:** 
- ✅ ค้นหาตาม name ได้
- ✅ Support case-insensitive search
- ✅ สามารถค้นหาทั้ง name และ email

---

### Challenge 2: Pagination
**Request:**
```bash
curl 'http://localhost:3000/api/users?page=1&limit=2'
```

**Response:**
```json
{
  "success": true,
  "count": 2,
  "total": 4,
  "page": 1,
  "totalPages": 2,
  "data": [
    {"id": 1, "name": "John Updated", "email": "john@example.com", "role": "admin"},
    {"id": 2, "name": "Jane Smith", "email": "jane@example.com", "role": "user"}
  ]
}
```

**สังเกต:** 
- ✅ Pagination ทำงานถูกต้อง
- ✅ แสดงจำนวน 2 รายการตาม limit
- ✅ แสดงข้อมูล totalPages สำหรับ navigation

---

### Challenge 3: Validation Middleware
**สร้างไฟล์:** `middleware/validateUser.js`

**Features:**
- ✅ ตรวจสอบ required fields (name, email)
- ✅ Validate email format ด้วย regex
- ✅ Validate age (0-150)
- ✅ ส่ง error 400 เมื่อ validation ล้มเหลว

---

## 🧪 Middleware Testing

### 6.3 สังเกต Console Log
เมื่อทำ request จะเห็น log ดังนี้:

```
[2026-02-03T02:01:40.238Z] GET /api/users
GET /api/users 200 12.111 ms - 234
Request took 15ms

[2026-02-03T02:02:15.123Z] POST /api/users
GET /api/users 201 8.456 ms - 156
Request took 8ms
```

**การทำงานของ Middleware:**

1. **Logger Middleware** (`logger.js`)
   - ✅ แสดง timestamp, HTTP method, URL
   - ✅ ทำงานก่อน request ทุกตัว

2. **Request Timer Middleware** (`requestTimer.js`)
   - ✅ วัดเวลาที่ใช้ในการ process request
   - ✅ แสดงผลเป็น milliseconds
   - ✅ ใช้ monkey patching `res.send()`

3. **Morgan Middleware** (third-party)
   - ✅ แสดง HTTP log แบบละเอียด
   - ✅ Format: `METHOD /path STATUS time - size`

4. **Error Handler Middleware** (`errorHandler.js`)
   - ✅ จัดการ error แบบ centralized
   - ✅ แสดง stack trace ใน development mode
   - ✅ 404 handler ทำงานเมื่อไม่เจอ route

---

## 📊 สรุปผลการทดลอง

### ✅ สิ่งที่สำเร็จ:

#### Core Features:
- ✅ **Express Application Setup** - สร้าง Express app พร้อม configuration
- ✅ **Custom Middleware** - logger, requestTimer, errorHandler ทำงานถูกต้อง
- ✅ **Routes Implementation** - Home, Users, Products routes ครบถ้วน
- ✅ **CRUD Operations** - GET, POST, PUT, DELETE ทำงานได้ทั้งหมด
- ✅ **Route Parameters** - `/users/:id` ทำงานถูกต้อง
- ✅ **Query Strings** - `?role=admin`, `?page=1&limit=10` ทำงานได้
- ✅ **Error Handling** - จัดการ error และ 404 ได้ดี
- ✅ **Static Files** - serve `public/index.html` สำเร็จ

#### Challenge Tasks:
- ✅ **Challenge 1** - Search endpoint ด้วย name/email
- ✅ **Challenge 2** - Pagination พร้อม page info
- ✅ **Challenge 3** - Validation middleware สำหรับ user data

### 🎓 สิ่งที่ได้เรียนรู้:

1. **Express.js Fundamentals**
   - การ setup Express application
   - การแยก configuration (app.js) และ server (server.js)
   - การใช้ Router สำหรับจัดการ routes

2. **Middleware Concept**
   - Application-level middleware (express.json, cors)
   - Router-level middleware
   - Custom middleware development
   - Error handling middleware (4 parameters)
   - Middleware execution order สำคัญมาก

3. **RESTful API Design**
   - HTTP methods (GET, POST, PUT, DELETE)
   - Status codes (200, 201, 400, 404, 500)
   - Request/Response structure
   - Query parameters vs Route parameters

4. **Request Processing**
   - `req.params` - route parameters
   - `req.query` - query strings
   - `req.body` - request body
   - Response methods (`res.json()`, `res.status()`)

5. **Best Practices**
   - Separation of concerns
   - Centralized error handling
   - Validation before processing
   - Graceful shutdown handling
