# 📚 Book Library API - รายงานการทดสอบ
**Workshop 10 - Level 2: Challenge**

---

## 👤 ข้อมูลผู้จัดทำ
**ชื่อ-นามสกุล:** วิศรุต กอบคำ  
**วันที่ทำการทดสอบ:** 3 Feb 2026

---

## 🚀 ขั้นตอนการเริ่มต้นใช้งาน

### 1. การติดตั้งโปรเจค
เข้าไปยังโฟลเดอร์โปรเจคและติดตั้ง dependencies:
```bash
cd level-2-challenge
npm install
```

### 2. การรันโปรเจค
เริ่มต้น server ด้วยคำสั่ง:
```bash
# Development mode
npm run dev

# หรือ Production mode
npm start

# กำหนด port เอง
PORT=3000 node server.js
```

**URL ของ API:** `http://localhost:3000`

---

## 🧪 การทดสอบ API Endpoints

### 📖 API สำหรับจัดการ Authors (ผู้แต่ง)

#### 1. ดึงรายชื่อผู้แต่งทั้งหมด
```bash
curl http://localhost:3000/api/authors
```

#### 2. กรองผู้แต่งตามประเทศ
```bash
curl 'http://localhost:3000/api/authors?country=UK'
```
*หมายเหตุ:* สามารถกรองตามประเทศต่างๆ เช่น UK, Japan

#### 3. ดูข้อมูลผู้แต่งพร้อมหนังสือที่เขียน
```bash
curl http://localhost:3000/api/authors/1
```

#### 4. เพิ่มผู้แต่งใหม่
```bash
curl -X POST http://localhost:3000/api/authors \
  -H "Content-Type: application/json" \
  -d '{"name":"J.R.R. Tolkien","country":"UK","birthYear":1892}'
```

#### 5. แก้ไขข้อมูลผู้แต่ง
```bash
curl -X PUT http://localhost:3000/api/authors/4 \
  -H "Content-Type: application/json" \
  -d '{"name":"J.R.R. Tolkien","country":"UK","birthYear":1892}'
```

#### 6. ลบผู้แต่ง
```bash
curl -X DELETE http://localhost:3000/api/authors/4
```
*หมายเหตุ:* ระบบจะไม่อนุญาตให้ลบผู้แต่งที่มีหนังสือในระบบ

---

### 📚 API สำหรับจัดการ Books (หนังสือ)

#### 1. ดึงรายการหนังสือทั้งหมด
```bash
curl http://localhost:3000/api/books
```
*ผลลัพธ์จะรวมข้อมูลผู้แต่งด้วย*

#### 2. กรองหนังสือและใช้ pagination
```bash
curl 'http://localhost:3000/api/books?genre=Fantasy&page=1&limit=2'
```
- `genre`: ประเภทหนังสือ (Fantasy, Fiction, Dystopian)
- `page`: หน้าที่ต้องการ (เริ่มต้น 1)
- `limit`: จำนวนรายการต่อหน้า

#### 3. ดูรายละเอียดหนังสือเล่มใดเล่มหนึ่ง
```bash
curl http://localhost:3000/api/books/1
```

#### 4. ค้นหาหนังสือจากชื่อ
```bash
curl 'http://localhost:3000/api/books/search?q=harry'
```
*การค้นหาไม่คำนึงถึงตัวพิมพ์เล็ก-ใหญ่*

#### 5. เพิ่มหนังสือเล่มใหม่
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"The Hobbit","authorId":4,"year":1937,"genre":"Fantasy","isbn":"978-0261102217"}'
```
*ต้องมี authorId ที่มีอยู่แล้วในระบบ*

#### 6. แก้ไขข้อมูลหนังสือ
```bash
curl -X PUT http://localhost:3000/api/books/4 \
  -H "Content-Type: application/json" \
  -d '{"title":"The Hobbit","authorId":4,"year":1937,"genre":"Fantasy","isbn":"978-0261102217"}'
```

#### 7. ลบหนังสือ
```bash
curl -X DELETE http://localhost:3000/api/books/4
```

---

### 🔒 การทดสอบ Rate Limiting

วิธีการทดสอบการจำกัดจำนวน request (ส่ง 120 requests):
```bash
for i in $(seq 1 120); do
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/authors
done | sort | uniq -c
```

**ผลที่คาดว่าจะได้:**
- Request ที่ 1-100: HTTP 200 (สำเร็จ)
- Request ที่ 101+: HTTP 429 (ถูกจำกัด)

**การตั้งค่า:**
- จำนวน request สูงสุด: 100 ต่อ IP address
- ระยะเวลา: 15 นาที (900,000 milliseconds)

---

## 📊 ตัวอย่าง Response จาก API

### Response: ดึงรายชื่อผู้แต่ง
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "name": "J.K. Rowling",
      "country": "UK",
      "birthYear": 1965
    }
  ]
}
```

### Response: ดูข้อมูลผู้แต่งพร้อมหนังสือ
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "J.K. Rowling",
    "country": "UK",
    "birthYear": 1965,
    "books": [
      {
        "id": 1,
        "title": "Harry Potter and the Philosopher's Stone",
        "authorId": 1,
        "year": 1997,
        "genre": "Fantasy",
        "isbn": "9780747532699"
      }
    ]
  }
}
```

### Response: หนังสือพร้อม pagination
```json
{
  "success": true,
  "count": 1,
  "page": 1,
  "limit": 2,
  "totalPages": 1,
  "data": [
    {
      "id": 1,
      "title": "Harry Potter and the Philosopher's Stone",
      "authorId": 1,
      "year": 1997,
      "genre": "Fantasy",
      "isbn": "9780747532699",
      "author": {
        "id": 1,
        "name": "J.K. Rowling",
        "country": "UK",
        "birthYear": 1965
      }
    }
  ]
}
```

### Response: สร้างผู้แต่งสำเร็จ
```json
{
  "success": true,
  "message": "Author created successfully",
  "data": {
    "id": 4,
    "name": "J.R.R. Tolkien",
    "country": "UK",
    "birthYear": 1892
  }
}
```

### Response: ถูก Rate Limit
```json
{
  "success": false,
  "error": {
    "message": "Too many requests, please try again later"
  }
}
```