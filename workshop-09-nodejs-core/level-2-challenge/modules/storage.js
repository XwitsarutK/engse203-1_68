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
      // TODO: ตรวจสอบว่าไฟล์มีอยู่หรือไม่
      // ถ้าไม่มี ให้ return empty array
      // ถ้ามี ให้อ่านและ parse JSON
      
      // คำแนะนำ: ใช้ fs.access() เพื่อเช็คว่าไฟล์มีอยู่
      // ใช้ fs.readFile() เพื่ออ่านไฟล์
      // ใช้ JSON.parse() เพื่อแปลงเป็น object
      
      // YOUR CODE HERE
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
      // TODO: สร้างโฟลเดอร์ data ถ้ายังไม่มี
      // TODO: แปลง data เป็น JSON string (แบบ pretty print)
      // TODO: เขียนลงไฟล์

      // คำแนะนำ: ใช้ path.dirname() เพื่อหา directory
      // ใช้ fs.mkdir() เพื่อสร้างโฟลเดอร์ (recursive: true)
      // ใช้ JSON.stringify() พร้อม indent
      // ใช้ fs.writeFile() เพื่อเขียนไฟล์

      const filePath = this.dataFile;
      const dir = path.dirname(filePath);

      await fs.mkdir(dir, { recursive: true });

      //console.log('Directory ensured:', dir);
      console.log('New task created:', JSON.stringify(data, null, 2));

      // ตรวจสอบว่าไฟล์มีอยู่แล้วหรือไม่
      try {
        await fs.access(filePath);
        logger.warning(`File '${filePath}' already exists`);
        //return false;

        const json = JSON.stringify(data, null, 2);

        await fs.writeFile(filePath, json, 'utf-8');

      } catch (error) {
        // ไฟล์ยังไม่มี → เขียนได้
        logger.success(`ไฟล์ยังไม่มี → เขียนได้`);
        const json = JSON.stringify(data, null, 2);

        await fs.writeFile(filePath, json, 'utf-8');

        logger.success(`Created file: ${filePath}`);
        logger.success('Data saved successfully');

        return true;
      }


    } catch (error) {
      logger.error(`Failed to write data: ${error.message}`);
      throw error;
    }
  }

  // Export tasks ไปยังไฟล์อื่น
  async exportTo(filename, data) {
    try {
      // TODO: ทำคล้ายกับ write() แต่ใช้ filename ที่ระบุ
      
      // YOUR CODE HERE
      
    } catch (error) {
      logger.error(`Failed to export: ${error.message}`);
      throw error;
    }
  }

  // Import tasks จากไฟล์อื่น
  async importFrom(filename) {
    try {
      // TODO: อ่านไฟล์ที่ระบุและ return data
      
      // YOUR CODE HERE
      
    } catch (error) {
      logger.error(`Failed to import: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new Storage();