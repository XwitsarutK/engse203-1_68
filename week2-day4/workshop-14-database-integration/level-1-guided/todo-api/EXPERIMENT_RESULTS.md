📝 บันทึกผลการทดลอง

# 📊 บันทึกผลการทดลอง - Workshop 14 Level 1

## ผู้ทดลอง
- ชื่อ: วิศรุต กอบคำ
- วันที่: 7 Feb 2026

---

## 🎯 Challenge Tasks

### Challenge 1: Filter by Status - กรองตามสถานะ ✅

**เป้าหมาย:** กรองรายการ todos ตามสถานะ (เสร็จแล้ว หรือ ยังไม่เสร็จ)

**วิธีการทำงาน:**
1. รับค่า `done` จาก query parameter (`?done=true` หรือ `?done=false`)
2. แปลงค่าเป็น boolean (true/false)
3. เพิ่มเงื่อนไข `WHERE done = ?` ใน SQL query
4. ส่งกลับเฉพาะ todos ที่ตรงกับสถานะที่ต้องการ

**Implementation:**

```javascript
// Controller: todoController.js
exports.getAll = (req, res) => {
  const { done } = req.query;
  const filters = {};
  
  if (done !== undefined) {
    // แปลง string เป็น boolean
    filters.done = done === 'true' || done === '1';
  }
  
  const todos = Todo.getAll(filters);
  res.json({ success: true, data: todos });
};

// Model: Todo.js
getAll(filters = {}) {
  let sql = 'SELECT * FROM todos';
  const params = [];
  
  if (filters.done !== undefined) {
    sql += ' WHERE done = ?';
    params.push(filters.done ? 1 : 0);  // SQLite ใช้ 1/0 แทน true/false
  }
  
  return this.db.prepare(sql).all(...params);
}
```

**ตัวอย่างการใช้งาน:**

```bash
# ดูงานที่ยังไม่เสร็จ
GET /api/todos?done=false
```

**ผลลัพธ์:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "task": "ซื้อของที่ตลาด",
      "done": 0,
      "created_at": "2026-02-07 10:00:00"
    },
    {
      "id": 3,
      "task": "ออกกำลังกาย",
      "done": 0,
      "created_at": "2026-02-07 10:02:00"
    }
  ],
  "filters": {
    "done": false
  }
}
```

```bash
# ดูงานที่เสร็จแล้ว
GET /api/todos?done=true
```

**ผลลัพธ์:**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "task": "ทำการบ้านคณิตศาสตร์",
      "done": 1,
      "created_at": "2026-02-07 10:01:00"
    },
    {
      "id": 5,
      "task": "ทำความสะอาดห้อง",
      "done": 1,
      "created_at": "2026-02-07 10:04:00"
    }
  ],
  "filters": {
    "done": true
  }
}
```

---

### Challenge 2: Search - ค้นหาในงาน ✅

**เป้าหมาย:** ค้นหา todos ที่มีคำที่ต้องการในข้อความ (ไม่สนใจตัวพิมพ์เล็ก-ใหญ่)

**วิธีการทำงาน:**
1. รับค่า `search` จาก query parameter (`?search=ซื้อ`)
2. ใช้ SQL `LIKE` operator เพื่อค้นหาแบบ pattern matching
3. ใช้ `LOWER()` function เพื่อค้นหาแบบ case-insensitive
4. ส่งกลับเฉพาะ todos ที่มีคำที่ค้นหา

**Implementation:**

```javascript
// Controller: todoController.js
exports.getAll = (req, res) => {
  const { search } = req.query;
  const filters = {};
  
  if (search && search.trim() !== '') {
    filters.search = search.trim();
  }
  
  const todos = Todo.getAll(filters);
  res.json({ success: true, data: todos });
};

// Model: Todo.js
getAll(filters = {}) {
  let sql = 'SELECT * FROM todos';
  const params = [];
  const conditions = [];
  
  if (filters.search) {
    conditions.push('LOWER(task) LIKE LOWER(?)');
    params.push(`%${filters.search}%`);  // % หมายถึง match อะไรก็ได้
  }
  
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  
  return this.db.prepare(sql).all(...params);
}
```

**ตัวอย่างการใช้งาน:**

```bash
# ค้นหางานที่มีคำว่า "ซื้อ"
GET /api/todos?search=ซื้อ
```

**ผลลัพธ์:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "task": "ซื้อของที่ตลาด",
      "done": 0,
      "created_at": "2026-02-07 10:00:00"
    }
  ],
  "filters": {
    "search": "ซื้อ"
  }
}
```

```bash
# ค้นหางานที่มีคำว่า "ทำ" (จะเจอทั้ง "ทำการบ้าน" และ "ทำความสะอาด")
GET /api/todos?search=ทำ
```

**ผลลัพธ์:**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "task": "ทำการบ้านคณิตศาสตร์",
      "done": 1,
      "created_at": "2026-02-07 10:01:00"
    },
    {
      "id": 5,
      "task": "ทำความสะอาดห้อง",
      "done": 1,
      "created_at": "2026-02-07 10:04:00"
    }
  ],
  "filters": {
    "search": "ทำ"
  }
}
```

---

### Challenge 3: Pagination - แบ่งหน้า ✅

**เป้าหมาย:** แบ่งรายการ todos ออกเป็นหน้าๆ (เหมาะกับข้อมูลจำนวนมาก)

**วิธีการทำงาน:**
1. รับค่า `page` (หน้าที่ต้องการ) และ `limit` (จำนวนรายการต่อหน้า)
2. คำนวณ `offset = (page - 1) × limit` (จำนวนรายการที่ต้องข้าม)
3. ใช้ SQL `LIMIT` และ `OFFSET` เพื่อดึงข้อมูลเฉพาะหน้าที่ต้องการ
4. นับจำนวนรายการทั้งหมดเพื่อคำนวณว่ามีกี่หน้า

**Implementation:**

```javascript
// Controller: todoController.js
exports.getAll = (req, res) => {
  const { page = 1, limit } = req.query;
  const filters = {};
  
  if (limit !== undefined) {
    const limitNum = parseInt(limit);
    const pageNum = parseInt(page);
    
    // Validation
    if (limitNum <= 0 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        error: 'Limit must be between 1-100'
      });
    }
    
    filters.limit = limitNum;
    filters.offset = (pageNum - 1) * limitNum;
  }
  
  const total = Todo.count(filters);
  const todos = Todo.getAll(filters);
  
  const response = {
    success: true,
    data: todos,
    pagination: {
      page: parseInt(page),
      limit: filters.limit || null,
      total: total,
      totalPages: filters.limit ? Math.ceil(total / filters.limit) : 1
    }
  };
  
  res.json(response);
};

// Model: Todo.js
getAll(filters = {}) {
  let sql = 'SELECT * FROM todos ORDER BY created_at DESC';
  const params = [];
  
  if (filters.limit) {
    sql += ' LIMIT ?';
    params.push(filters.limit);
    
    if (filters.offset !== undefined) {
      sql += ' OFFSET ?';
      params.push(filters.offset);
    }
  }
  
  return this.db.prepare(sql).all(...params);
}

count(filters = {}) {
  const sql = 'SELECT COUNT(*) as total FROM todos';
  return this.db.prepare(sql).get().total;
}
```

**ตัวอย่างการใช้งาน:**

สมมติว่ามี todos ทั้งหมด 15 รายการ

```bash
# หน้าที่ 1 (แสดง 5 รายการแรก)
GET /api/todos?page=1&limit=5
```

**ผลลัพธ์:**
```json
{
  "success": true,
  "data": [
    { "id": 15, "task": "งานล่าสุด", "done": 0 },
    { "id": 14, "task": "งานใหม่", "done": 0 },
    { "id": 13, "task": "อ่านหนังสือ", "done": 0 },
    { "id": 12, "task": "ออกกำลังกาย", "done": 1 },
    { "id": 11, "task": "ซื้อของ", "done": 1 }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 15,
    "totalPages": 3
  }
}
```

```bash
# หน้าที่ 2 (แสดง 5 รายการถัดไป)
GET /api/todos?page=2&limit=5
```

**ผลลัพธ์:**
```json
{
  "success": true,
  "data": [
    { "id": 10, "task": "ทำการบ้าน", "done": 0 },
    { "id": 9, "task": "ทำความสะอาด", "done": 1 },
    { "id": 8, "task": "ประชุม", "done": 0 },
    { "id": 7, "task": "ส่งอีเมล", "done": 1 },
    { "id": 6, "task": "โทรหาเพื่อน", "done": 0 }
  ],
  "pagination": {
    "page": 2,
    "limit": 5,
    "total": 15,
    "totalPages": 3
  }
}
```

```bash
# หน้าที่ 3 (แสดง 5 รายการสุดท้าย)
GET /api/todos?page=3&limit=5
```

**ผลลัพธ์:**
```json
{
  "success": true,
  "data": [
    { "id": 5, "task": "ทำความสะอาดห้อง", "done": 1 },
    { "id": 4, "task": "อ่านหนังสือ", "done": 0 },
    { "id": 3, "task": "ออกกำลังกาย", "done": 0 },
    { "id": 2, "task": "ทำการบ้านคณิตศาสตร์", "done": 1 },
    { "id": 1, "task": "ซื้อของที่ตลาด", "done": 0 }
  ],
  "pagination": {
    "page": 3,
    "limit": 5,
    "total": 15,
    "totalPages": 3
  }
}
```

---
