// modules/taskManager.js
const { v4: uuidv4 } = require('uuid');
const storage = require('./storage');
const logger = require('./logger');

class TaskManager {
  constructor() {
    this.tasks = [];
    this.nextId = 1;
  }

  // โหลด tasks จาก storage
  async loadTasks() {
    this.tasks = await storage.read();
    if (this.tasks.length > 0) {
      this.nextId = Math.max(...this.tasks.map(t => t.id)) + 1;
    }
  }

  // บันทึก tasks ไปยัง storage
  async saveTasks() {
    await storage.write(this.tasks);
  }

  // เพิ่ม task ใหม่
  async addTask(title, priority = 'medium') {
    await this.loadTasks();

    // TODO: สร้าง task object ใหม่
    // ควรมี properties: id, title, priority, completed, createdAt
    // priority ต้องเป็น low, medium, หรือ high เท่านั้น
    

    // YOUR CODE HERE
    const task = {
      id: this.nextId++,
      title: title,
      priority: priority,
      completed: false,
      createdAt: new Date().toISOString()
    };

    //console.log('New task created:', JSON.stringify(task, null, 2));

    this.tasks.push(task);
    await this.saveTasks();
    
    logger.success(`Task added: "${title}" (ID: ${task.id})`);
    return task;
  }

  // แสดงรายการ tasks
  async listTasks(filter = 'all') {
    await this.loadTasks();

    if (this.tasks.length === 0) {
      logger.warning('No tasks found');
      return;
    }

    // TODO: กรอง tasks ตาม filter (all/pending/completed)
    
    // YOUR CODE HERE
    let filteredTasks = this.tasks;

    if (filteredTasks.length === 0) {
      logger.warning(`No ${filter} tasks found`);
      return;
    }

    // แสดงผลแบบ table
    logger.info(`\n${filter.toUpperCase()} TASKS:\n`);
    
    // TODO: จัดรูปแบบข้อมูลให้แสดงเป็น table
    // แสดง: ID, Title, Priority, Status, Created
    
    // YOUR CODE HERE
    
    console.log(`\nTotal: ${filteredTasks.length} task(s)\n`);
  }

  // ทำเครื่องหมาย task เสร็จ
  async completeTask(id) {
    await this.loadTasks();

    // TODO: หา task จาก id
    // TODO: เปลี่ยน completed เป็น true
    // TODO: เพิ่ม completedAt timestamp
    
    // YOUR CODE HERE
    
    await this.saveTasks();
    logger.success(`Task ${id} marked as completed`);
  }

  // ลบ task
  async deleteTask(id) {
    await this.loadTasks();

    // TODO: ลบ task ที่มี id ตรงกัน
    // TODO: ตรวจสอบว่าหา task เจอหรือไม่
    
    // YOUR CODE HERE
    
    await this.saveTasks();
    logger.success(`Task ${id} deleted`);
  }

  // แก้ไข task
  async updateTask(id, newTitle) {
    await this.loadTasks();

    // TODO: หา task และแก้ไข title
    // TODO: เพิ่ม updatedAt timestamp
    
    // YOUR CODE HERE
    
    await this.saveTasks();
    logger.success(`Task ${id} updated`);
  }

  // แสดง statistics
  async showStats() {
    await this.loadTasks();

    // TODO: คำนวณ statistics
    // - จำนวน tasks ทั้งหมด
    // - tasks ที่เสร็จแล้ว
    // - tasks ที่รอดำเนินการ
    // - แยกตาม priority (high/medium/low)
    
    // YOUR CODE HERE
    
    console.log('\n' + '='.repeat(40));
    console.log('  📊 TASK STATISTICS');
    console.log('='.repeat(40));
    
    // แสดงผล statistics
    // YOUR CODE HERE
  }

  // Export tasks
  async exportTasks(filename) {
    await this.loadTasks();
    
    // TODO: ใช้ storage.exportTo() เพื่อ export
    
    // YOUR CODE HERE
    
    logger.success(`Tasks exported to ${filename}`);
  }

  // Import tasks
  async importTasks(filename) {
    // TODO: ใช้ storage.importFrom() เพื่อ import
    // TODO: merge กับ tasks ที่มีอยู่ (ถ้ามี)
    // TODO: ระวัง id ซ้ำ
    
    // YOUR CODE HERE
    
    await this.saveTasks();
    logger.success(`Tasks imported from ${filename}`);
  }
}

module.exports = new TaskManager();