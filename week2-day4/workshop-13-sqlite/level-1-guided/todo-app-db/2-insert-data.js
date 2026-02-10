// 2-insert-data.js
const Database = require('better-sqlite3');
const db = new Database('database.db');

console.log('➕ Inserting todos...');
console.log('');

// เพิ่มข้อมูลทีละรายการ
const insert = db.prepare('INSERT INTO todos (task) VALUES (?)');

// เพิ่มงาน 5 รายการ
insert.run('ซื้อของที่ตลาด');
insert.run('ทำการบ้านคณิตศาสตร์');
insert.run('ออกกำลังกาย');
insert.run('อ่านหนังสือ');
insert.run('ทำความสะอาดห้อง');

console.log('✅ Added 5 todos');
console.log('');

// ดูข้อมูลทั้งหมด
const todos = db.prepare('SELECT * FROM todos').all();
console.log('📋 All todos:');
console.table(todos);

db.close();