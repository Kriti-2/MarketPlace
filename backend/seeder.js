import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import connectDB from './config/db.js';

dotenv.config();

const defaultUsers = [
  {
    name: 'Admin User',
    email: 'admin@horizon.com',
    password: 'admin123',
    isAdmin: true,
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    isAdmin: false,
  }
];

const defaultProducts = [
  {
    name: 'AeroGlide Wireless Gaming Mouse',
    image: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Ultra-lightweight gaming mouse featuring a premium 26K DPI optical sensor, customizable RGB accent lighting, and a lag-free 2.4GHz wireless connection.',
    brand: 'AeroTech',
    category: 'Electronics',
    price: 89.99,
    countInStock: 15,
    rating: 4.8,
    numReviews: 24,
  },
  {
    name: 'SoundAura ANC Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Experience pure sonic isolation with active hybrid noise cancellation, high-resolution audio codecs, and a luxurious memory foam headband with 40-hour battery life.',
    brand: 'SoundAura',
    category: 'Audio',
    price: 249.99,
    countInStock: 8,
    rating: 4.6,
    numReviews: 18,
  },
  {
    name: 'Vortex Mechanical Keyboard',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33faf9c1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Sleek 75% mechanical keyboard outfitted with hot-swappable linear yellow switches, double-shot PBT keycaps, and a robust machined aluminum chassis.',
    brand: 'KeyVortex',
    category: 'Electronics',
    price: 139.99,
    countInStock: 12,
    rating: 4.9,
    numReviews: 32,
  },
  {
    name: 'Lumina RGB Desk Mat',
    image: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Vibrant, liquid-resistant textile desk pad bordered with dual-zone customizable RGB light tubing to elevate your workspace aesthetics.',
    brand: 'Lumina',
    category: 'Office',
    price: 29.99,
    countInStock: 25,
    rating: 4.5,
    numReviews: 12,
  },
  {
    name: 'Apex 4K UHD Webcam',
    image: 'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Ultra-crisp 4K video recording with automatic HDR light correction, wide-angle lens, and built-in noise-reducing dual microphones for professional streaming.',
    brand: 'ApexVision',
    category: 'Electronics',
    price: 119.99,
    countInStock: 0,
    rating: 4.2,
    numReviews: 9,
  },
  {
    name: 'OmniStand Dual Monitor Arm',
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Heavy-duty steel gas spring dual monitor mount that increases desk space and delivers perfect ergonomic flexibility for screens up to 32 inches.',
    brand: 'OmniDesk',
    category: 'Office',
    price: 79.99,
    countInStock: 5,
    rating: 4.7,
    numReviews: 15,
  }
];

const importData = async () => {
  try {
    // Attempt Mongoose connection
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/horizoncart');

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Hash passwords of seeder users
    const salt = await bcrypt.genSalt(10);
    const preparedUsers = await Promise.all(defaultUsers.map(async (u) => {
      const hashedPassword = await bcrypt.hash(u.password, salt);
      return { ...u, password: hashedPassword };
    }));

    const createdUsers = await User.insertMany(preparedUsers);
    const adminUser = createdUsers[0]._id;

    const sampleProducts = defaultProducts.map((p) => {
      return { ...p, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log('\x1b[32m[Database Seeder]: Data imported successfully!\x1b[0m');
    process.exit();
  } catch (error) {
    console.error(`\x1b[31m[Database Seeder Error]: ${error.message}\x1b[0m`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/horizoncart');

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('\x1b[31m[Database Seeder]: Data destroyed successfully!\x1b[0m');
    process.exit();
  } catch (error) {
    console.error(`\x1b[31m[Database Seeder Error]: ${error.message}\x1b[0m`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
