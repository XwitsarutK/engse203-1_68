# 📊 บันทึกการพัฒนา Task Manager CLI

## ผู้พัฒนา
- ชื่อ: [วิศรุต กอบคำ]
- วันที่: [ 31 Jan 2026]

## แนวทางการพัฒนา

### 1. storage.js
**ปัญหาที่พบ:**
- ตอนแรกไม่เข้าใจการทำงานของ `fs.access()` ว่าต้องใช้ try-catch เพื่อเช็คว่าไฟล์มีอยู่หรือไม่
- การเขียนไฟล์ครั้งแรกทำให้ไฟล์ถูกสร้างแต่ไม่สามารถเขียนทับได้เมื่อมีไฟล์อยู่แล้ว
- การจัดการ directory ต้องสร้างโฟลเดอร์ก่อนถึงจะเขียนไฟล์ได้

**วิธีแก้:**
- ใช้ `fs.access()` ภายใน try-catch เพื่อตรวจสอบการมีอยู่ของไฟล์ ถ้า throw error แปลว่าไฟล์ไม่มี
- ใช้ `fs.mkdir(dir, { recursive: true })` เพื่อสร้างโฟลเดอร์อัตโนมัติ ถึงแม้โฟลเดอร์จะมีอยู่แล้วก็ไม่ error
- แก้ไขโค้ดให้เขียนไฟล์ได้ทั้งกรณีที่ไฟล์มีอยู่แล้ว (เขียนทับ) และไฟล์ยังไม่มี (สร้างใหม่)
- ใช้ `JSON.stringify(data, null, 2)` เพื่อแปลงข้อมูลเป็น JSON แบบ pretty print

**สิ่งที่ได้เรียนรู้:**
- การใช้ `fs.promises` API แบบ async/await ทำให้โค้ดอ่านง่ายและจัดการ error ได้ดีกว่า callback
- `fs.access()` ไม่ได้ return boolean แต่ throw error เมื่อไฟล์ไม่มี ต้องใช้ร่วมกับ try-catch
- `path.dirname()` ช่วยดึง path ของ directory จาก file path ได้สะดวก
- `recursive: true` ใน `fs.mkdir()` จะสร้างโฟลเดอร์ซ้อนกันได้และไม่ error ถ้าโฟลเดอร์มีอยู่แล้ว
- การจัดการ JSON file เป็นวิธีที่ง่ายในการ persist data สำหรับ application ขนาดเล็ก

### 2. taskManager.js
**ปัญหาที่พบ:**
- การจัดการ ID ของ task ต้องหา ID ถัดไปที่ไม่ซ้ำกัน โดยเฉพาะเมื่อมีการลบ task
- การตรวจสอบ priority ที่ user ป้อนเข้ามาว่าถูกต้องหรือไม่ (ต้องเป็น low, medium, high)
- ต้องเรียก loadTasks() ทุกครั้งก่อนทำงานเพื่อให้ข้อมูลเป็นปัจจุบัน
- การจัดการ timestamp สำหรับ createdAt, updatedAt, completedAt

**วิธีแก้:**
- ใช้ `this.nextId++` เพื่อสร้าง ID อัตโนมัติที่เพิ่มขึ้นเรื่อยๆ และคำนวณ nextId จาก `Math.max(...this.tasks.map(t => t.id)) + 1`
- สร้าง array `validPriorities` เพื่อเช็ค priority และถ้าไม่ถูกต้องให้ใช้ค่า default เป็น 'medium'
- เรียก `await this.loadTasks()` ในทุกเมธอดก่อนทำงานเพื่อให้ข้อมูลเป็นปัจจุบัน
- ใช้ `new Date().toISOString()` เพื่อสร้าง timestamp ในรูปแบบมาตรฐาน ISO 8601
- สร้าง task object พร้อม properties ครบถ้วน: id, title, priority, completed, createdAt

## ผลการทดสอบ

### Test Case 1: CRUD Operations
- ✅/❌ เพิ่ม task
- ✅/❌ แสดง tasks
- ✅/❌ แก้ไข task
- ✅/❌ ลบ task
- ✅ เพิ่ม task - สามารถเพิ่ม task พร้อม validate priority ได้สำเร็จ
- ⏳ แสดง tasks - ยังไม่ได้ implement
- ⏳ แก้ไข task - ยังไม่ได้ implement  
- ⏳ ลบ task - ยังไม่ได้ implement
### Test Case 2: Advanced Features
- ✅/❌ กรอง tasks
- ✅/❌ Complete task
- ✅/❌ Statistics
- ✅/❌ Export/Import
- ⏳ กรอง tasks - ยังไม่ได้ implement
- ⏳ Complete task - ยังไม่ได้ implement
- ⏳ Statistics - ยังไม่ได้ implement
- ⏳ Export/Import - ยังไม่ได้ implement

## Features เพิ่มเติม (ถ้ามี)
- [บันทึก features ที่เพิ่มเอง]

## สรุป
[สรุปสิ่งที่ได้เรียนรู้จากการทำ workshop นี้]

## Screenshots
[แนบ screenshots การทำงาน]