// modules/storage.js
const fs = require('fs').promises;
const path = require('path');
const logger = require('./logger');
const { config } = require('./config');

class Storage {
  constructor() {
    this.dataFile = config.dataFile;
  }

  // อ่านข้อมูล tasks จากไฟล์
  async read() {
    try {
      try {
        await fs.access(this.dataFile);
      } catch {
        return []; // ไฟล์ไม่มี
      }
      
      const data = await fs.readFile(this.dataFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      logger.error(`Failed to read data: ${error.message}`);
      return [];
    }
  }

  // บันทึกข้อมูล tasks ลงไฟล์
  async write(data) {
    try {
      const dir = path.dirname(this.dataFile);
      await fs.mkdir(dir, { recursive: true });
      
      const jsonData = JSON.stringify(data, null, 2);
      await fs.writeFile(this.dataFile, jsonData, 'utf-8');
      
      logger.success('Data saved successfully');
      return true;
    } catch (error) {
      logger.error(`Failed to write data: ${error.message}`);
      throw error;
    }
  }

  // Export tasks ไปยังไฟล์อื่น
  async exportTo(filename, data) {
    try {
      const dir = path.dirname(filename);
      await fs.mkdir(dir, { recursive: true });
      
      const jsonData = JSON.stringify(data, null, 2);
      await fs.writeFile(filename, jsonData, 'utf-8');
      
      logger.success(`Data exported to ${filename}`);
      return true;
    } catch (error) {
      logger.error(`Failed to export: ${error.message}`);
      throw error;
    }
  }

  // Import tasks จากไฟล์อื่น
  async importFrom(filename) {
    try {
      await fs.access(filename);
      const data = await fs.readFile(filename, 'utf-8');
      const tasks = JSON.parse(data);
      
      logger.success(`Data imported from ${filename}`);
      return tasks;
    } catch (error) {
      logger.error(`Failed to import: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new Storage();