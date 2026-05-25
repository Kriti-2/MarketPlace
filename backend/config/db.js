import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

let isMockDB = false;

// Mock database path
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const getMockDataPath = (collectionName) => {
  return path.join(dataDir, `${collectionName}.json`);
};

export const initializeMockFile = (collectionName, defaultData = []) => {
  const filePath = getMockDataPath(collectionName);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
};

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    // Attempt connecting with a short 3-second timeout so it doesn't hang indefinitely if MongoDB is offline
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/horizoncart', {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`\x1b[32m[MongoDB Connected]: ${conn.connection.host}\x1b[0m`);
    isMockDB = false;
  } catch (error) {
    console.warn(`\x1b[33m[MongoDB Connection Failed]: ${error.message}\x1b[0m`);
    console.warn('\x1b[36m[System Notice]: Falling back to local JSON File Database. No database installation required!\x1b[0m');
    isMockDB = true;
  }
};

export const checkIsMock = () => {
  return isMockDB;
};

export default connectDB;
