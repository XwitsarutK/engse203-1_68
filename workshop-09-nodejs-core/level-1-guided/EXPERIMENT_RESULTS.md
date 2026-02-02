# 📊 บันทึกผลการทดลอง - Workshop 9 Level 1

## ผู้ทดลอง
- ชื่อ: วิศรุต กอบคำ
- วันที่: 31 Jan 2026

## การทดลองที่ 1: ทดสอบคำสั่งพื้นฐาน

### คำสั่งที่ใช้:
```bash
node index.js create test1.txt "Hello Node.js"
node index.js list
node index.js read test1.txt
```

### ผลลัพธ์:
- สร้างไฟล์ test1.txt สำเร็จ ✅
- แสดงรายการไฟล์ในโฟลเดอร์ data/ ได้ถูกต้อง
- อ่านเนื้อหาไฟล์แสดงผล "Hello Node.js" ถูกต้อง

### สังเกต:
- คำสั่งทำงานได้ดี มี color coding ชัดเจน (chalk)
- Logger บันทึก log ลงไฟล์ logs/app.log อัตโนมัติ
- Error handling ทำงานถูกต้อง

## การทดลองที่ 2: ทดสอบ Error Handling

### คำสั่งที่ใช้:
```bash
node index.js read nonexistent.txt
```

### ผลลัพธ์:
```
✖ Failed to read file: ENOENT: no such file or directory
```

### สังเกต:
- Error handling ทำงานได้ดี แสดงข้อความ error ชัดเจน
- ไม่ crash program แต่จัดการ error อย่างเหมาะสม
- ใช้สีแดงแสดง error message เด่นชัด

## 🎯 Challenge: เพิ่มฟีเจอร์
## Challenge 1: เพิ่มคำสั่ง append

### คำสั่งที่ใช้:
```bash
node index.js append sample.txt "New line"
node index.js read sample.txt
```

### ผลลัพธ์:
- เพิ่มข้อความต่อท้ายไฟล์สำเร็จ ✅
- ข้อความถูกเพิ่มในบรรทัดใหม่

### สังเกต:
- ใช้ fs.appendFile() ทำงานได้ดี
- การใส่ '\n' ข้างหน้าทำให้ขึ้นบรรทัดใหม่ถูกต้อง

## Challenge 2: เพิ่มคำสั่ง search

### คำสั่งที่ใช้:
```bash
node index.js search "sample"
node index.js search "Node.js"
node index.js search "notfound"
```

### ผลลัพธ์:
- ค้นหา "sample" พบใน sample.txt ✅
- ค้นหา "Node.js" พบใน test1.txt ✅
- ค้นหา "notfound" แสดง warning ไม่พบไฟล์ ✅

### สังเกต:
- วนอ่านไฟล์ทั้งหมดและค้นหาด้วย includes() ได้ผลดี
- แยกตรวจสอบเฉพาะไฟล์ (ไม่ใช่โฟลเดอร์)

## Challenge 3: เพิ่มคำสั่ง stats

### คำสั่งที่ใช้:
```bash
node index.js stats sample.txt
node index.js stats test1.txt
```

### ผลลัพธ์:
- แสดงข้อมูลไฟล์ครบถ้วน:
  - ขนาดไฟล์ (bytes)
  - วันที่สร้าง
  - วันที่แก้ไขล่าสุด
  - จำนวนบรรทัด

### สังเกต:
- ใช้ fs.stat() ดึงข้อมูล metadata ของไฟล์
- นับบรรทัดด้วย split('\n').length
- แสดงวันที่เป็น locale string อ่านง่าย



- เพิ่ม recursive search ใน subfolder
- เพิ่ม filter ตาม file extension
- เพิ่ม rename file command
- เพิ่ม move file command
- ทำ interactive mode แทน command line args
