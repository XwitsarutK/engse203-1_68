// middleware/rateLimit.js

const rateLimit = () => {
  // ใช้ Map เก็บ request count
  const requests = new Map();

  return (req, res, next) => {
    // TODO: ดึง IP address จาก request
    // TODO: ตรวจสอบจำนวน requests ใน time window
    // TODO: ถ้าเกิน limit ให้ส่ง 429 Too Many Requests
    // TODO: ถ้าไม่เกิน ให้บันทึกและเรียก next()
    
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW) || 900000; // 15 min
    const maxRequests = parseInt(process.env.RATE_LIMIT_MAX) || 100;

    // YOUR CODE HERE
    // คำแนะนำ:
    // 1. เช็คว่า IP นี้มีใน Map หรือยัง
    // 2. ถ้ามี ให้เช็คว่าอยู่ใน time window หรือไม่
    // 3. นับจำนวน requests
    // 4. ถ้าเกิน limit ส่ง error
    
  };
};

module.exports = rateLimit;