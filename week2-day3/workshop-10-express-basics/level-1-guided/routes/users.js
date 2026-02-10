// routes/users.js
const express = require('express');
const router = express.Router();

// Dummy data (จะใช้ database ในภายหลัง)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
];

/**
 * GET /api/users - Get all users with pagination
 * Query params: ?role=admin&page=1&limit=10
 */
router.get('/', (req, res) => {
  // ตรวจสอบ query parameter
  const { role, page, limit } = req.query;

  let filteredUsers = users;

  // กรองตาม role ถ้ามี
  if (role) {
    filteredUsers = users.filter(u => u.role === role);
  }

  // Pagination logic
  const pageNum = parseInt(page) || 1;
  const limitNum = parseInt(limit) || 10;
  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;

  // คำนวณข้อมูล pagination
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / limitNum);
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

  res.json({
    success: true,
    count: paginatedUsers.length,
    total: totalUsers,
    page: pageNum,
    totalPages: totalPages,
    data: paginatedUsers
  });
});

/**
 * GET /api/users/search?name=john&email=example
 * Query params: name, email
 */
router.get('/search', (req, res) => {
  // TODO: ค้นหา users ที่มี name หรือ email ตรงกับ query

  console.log('req.query: ' + req.query);

  // ตรวจสอบ query parameter
  const { name, email } = req.query;

  console.log('search name: ' + name);
  console.log('search email: ' + email);

  let filteredUsers = users;

  // กรองตาม name ถ้ามี
  if (name) {
    filteredUsers = filteredUsers.filter(u => u.name.toLowerCase().includes(name.toLowerCase()));
  }

  // กรองตาม email ถ้ามี
  if (email) {
    filteredUsers = filteredUsers.filter(u => u.email.toLowerCase().includes(email.toLowerCase()));
  }

  res.json({
    success: true,
    count: filteredUsers.length,
    data: filteredUsers
  });
});

/**
 * GET /api/users/:id - Get user by ID
 * Route parameter: id
 */
router.get('/:id', (req, res) => {
  // แปลง id จาก string เป็น number
  const id = parseInt(req.params.id);

  // หา user
  const user = users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({
      success: false,
      error: {
        message: `User with ID ${id} not found`
      }
    });
  }

  res.json({
    success: true,
    data: user
  });
});

/**
 * POST /api/users - Create new user
 * Body: { name, email, role }
 */
router.post('/', (req, res) => {
  const { name, email, role } = req.body;

  // Validation
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Name and email are required'
      }
    });
  }

  // สร้าง user ใหม่
  const newUser = {
    id: users.length + 1,
    name,
    email,
    role: role || 'user'
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    data: newUser
  });
});

/**
 * PUT /api/users/:id - Update user
 * Body: { name, email, role }
 */
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, role } = req.body;

  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: {
        message: `User with ID ${id} not found`
      }
    });
  }

  // Update user
  users[userIndex] = {
    ...users[userIndex],
    ...(name && { name }),
    ...(email && { email }),
    ...(role && { role })
  };

  res.json({
    success: true,
    message: 'User updated successfully',
    data: users[userIndex]
  });
});

/**
 * DELETE /api/users/:id - Delete user
 */
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const userIndex = users.findIndex(u => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      error: {
        message: `User with ID ${id} not found`
      }
    });
  }

  // ลบ user
  const deletedUser = users.splice(userIndex, 1)[0];

  res.json({
    success: true,
    message: 'User deleted successfully',
    data: deletedUser
  });
});

module.exports = router;