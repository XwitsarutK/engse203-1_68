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

    const validPriorities = ['low', 'medium', 'high'];
    if (!validPriorities.includes(priority.toLowerCase())) {
      priority = 'medium';
    }

    const task = {
      id: this.nextId++,
      title,
      priority: priority.toLowerCase(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

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

    let filteredTasks = this.tasks;

    if (filter === 'pending') {
      filteredTasks = this.tasks.filter(t => !t.completed);
    } else if (filter === 'completed') {
      filteredTasks = this.tasks.filter(t => t.completed);
    }

    if (filteredTasks.length === 0) {
      logger.warning(`No ${filter} tasks found`);
      return;
    }

    logger.info(`\n${filter.toUpperCase()} TASKS:\n`);
    
    const tableData = filteredTasks.map(task => ({
      ID: task.id,
      Title: task.title,
      Priority: task.priority,
      Status: task.completed ? '✓ Done' : '○ Pending',
      Created: new Date(task.createdAt).toLocaleDateString()
    }));
    
    logger.table(tableData);
    console.log(`\nTotal: ${filteredTasks.length} task(s)\n`);
  }

  // ทำเครื่องหมาย task เสร็จ
  async completeTask(id) {
    await this.loadTasks();

    const task = this.tasks.find(t => t.id === id);
    
    if (!task) {
      logger.error(`Task with ID ${id} not found`);
      return;
    }
    
    if (task.completed) {
      logger.warning(`Task ${id} is already completed`);
      return;
    }
    
    task.completed = true;
    task.completedAt = new Date().toISOString();
    
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

    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed).length;
    const pending = this.tasks.filter(t => !t.completed).length;
    
    const highPriority = this.tasks.filter(t => t.priority === 'high').length;
    const mediumPriority = this.tasks.filter(t => t.priority === 'medium').length;
    const lowPriority = this.tasks.filter(t => t.priority === 'low').length;
    
    console.log('\n' + '='.repeat(40));
    console.log('  📊 TASK STATISTICS');
    console.log('='.repeat(40));
    
    console.log(`\n  Total Tasks      : ${total}`);
    console.log(`  Completed        : ${completed}`);
    console.log(`  Pending          : ${pending}`);
    console.log(`\n  Priority Breakdown:`);
    console.log(`    High           : ${highPriority}`);
    console.log(`    Medium         : ${mediumPriority}`);
    console.log(`    Low            : ${lowPriority}`);
    console.log('\n' + '='.repeat(40) + '\n');
  }

  // Export tasks
  async exportTasks(filename) {
    await this.loadTasks();
    
    if (this.tasks.length === 0) {
      logger.warning('No tasks to export');
      return;
    }
    
    await storage.exportTo(filename, this.tasks);
    logger.success(`${this.tasks.length} task(s) exported to ${filename}`);
  }

  // Import tasks
  async importTasks(filename) {
    await this.loadTasks();
    
    const importedTasks = await storage.importFrom(filename);
    
    if (!importedTasks || importedTasks.length === 0) {
      logger.warning('No tasks to import');
      return;
    }
    
    // หา ID ที่ใหญ่ที่สุดเพื่อป้องกัน ID ซ้ำ
    const maxExistingId = this.tasks.length > 0 
      ? Math.max(...this.tasks.map(t => t.id)) 
      : 0;
    
    // ปรับ ID ของ tasks ที่ import เข้ามา
    let nextId = maxExistingId + 1;
    const adjustedTasks = importedTasks.map(task => ({
      ...task,
      id: nextId++
    }));
    
    this.tasks = [...this.tasks, ...adjustedTasks];
    this.nextId = nextId;
    
    await this.saveTasks();
    logger.success(`${adjustedTasks.length} task(s) imported from ${filename}`);
  }
}

module.exports = new TaskManager();