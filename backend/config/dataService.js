import fs from 'fs';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { checkIsMock, getMockDataPath, initializeMockFile } from './db.js';

// Default seed data to populate if MongoDB is empty or if mock files are empty
const defaultUsers = [
  {
    _id: '66517a2245b0a70198f3b140',
    name: 'Admin User',
    email: 'admin@horizon.com',
    password: '', // will be hashed
    isAdmin: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '66517a2245b0a70198f3b141',
    name: 'John Doe',
    email: 'john@example.com',
    password: '', // will be hashed
    isAdmin: false,
    createdAt: new Date().toISOString(),
  }
];

const defaultProducts = [
  {
    _id: '66517a2245b0a70198f3b142',
    name: 'AeroGlide Wireless Gaming Mouse',
    image: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Ultra-lightweight gaming mouse featuring a premium 26K DPI optical sensor, customizable RGB accent lighting, and a lag-free 2.4GHz wireless connection.',
    brand: 'AeroTech',
    category: 'Electronics',
    price: 89.99,
    countInStock: 15,
    rating: 4.8,
    numReviews: 24,
    reviews: [],
    user: '66517a2245b0a70198f3b140'
  },
  {
    _id: '66517a2245b0a70198f3b143',
    name: 'SoundAura ANC Headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Experience pure sonic isolation with active hybrid noise cancellation, high-resolution audio codecs, and a luxurious memory foam headband with 40-hour battery life.',
    brand: 'SoundAura',
    category: 'Audio',
    price: 249.99,
    countInStock: 8,
    rating: 4.6,
    numReviews: 18,
    reviews: [],
    user: '66517a2245b0a70198f3b140'
  },
  {
    _id: '66517a2245b0a70198f3b144',
    name: 'Vortex Mechanical Keyboard',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33faf9c1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Sleek 75% mechanical keyboard outfitted with hot-swappable linear yellow switches, double-shot PBT keycaps, and a robust machined aluminum chassis.',
    brand: 'KeyVortex',
    category: 'Electronics',
    price: 139.99,
    countInStock: 12,
    rating: 4.9,
    numReviews: 32,
    reviews: [],
    user: '66517a2245b0a70198f3b140'
  },
  {
    _id: '66517a2245b0a70198f3b145',
    name: 'Lumina RGB Desk Mat',
    image: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Vibrant, liquid-resistant textile desk pad bordered with dual-zone customizable RGB light tubing to elevate your workspace aesthetics.',
    brand: 'Lumina',
    category: 'Office',
    price: 29.99,
    countInStock: 25,
    rating: 4.5,
    numReviews: 12,
    reviews: [],
    user: '66517a2245b0a70198f3b140'
  },
  {
    _id: '66517a2245b0a70198f3b146',
    name: 'Apex 4K UHD Webcam',
    image: 'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Ultra-crisp 4K video recording with automatic HDR light correction, wide-angle lens, and built-in noise-reducing dual microphones for professional streaming.',
    brand: 'ApexVision',
    category: 'Electronics',
    price: 119.99,
    countInStock: 0,
    rating: 4.2,
    numReviews: 9,
    reviews: [],
    user: '66517a2245b0a70198f3b140'
  },
  {
    _id: '66517a2245b0a70198f3b147',
    name: 'OmniStand Dual Monitor Arm',
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    description: 'Heavy-duty steel gas spring dual monitor mount that increases desk space and delivers perfect ergonomic flexibility for screens up to 32 inches.',
    brand: 'OmniDesk',
    category: 'Office',
    price: 79.99,
    countInStock: 5,
    rating: 4.7,
    numReviews: 15,
    reviews: [],
    user: '66517a2245b0a70198f3b140'
  }
];

// Initialize Mock Files
const initMockDB = async () => {
  const salt = await bcrypt.genSalt(10);
  const hashedAdminPassword = await bcrypt.hash('admin123', salt);
  const hashedUserPassword = await bcrypt.hash('user123', salt);

  defaultUsers[0].password = hashedAdminPassword;
  defaultUsers[1].password = hashedUserPassword;

  initializeMockFile('users', defaultUsers);
  initializeMockFile('products', defaultProducts);
  initializeMockFile('orders', []);
};

initMockDB();

// Mock Helper functions
const readJSON = (collection) => {
  try {
    const data = fs.readFileSync(getMockDataPath(collection), 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
};

const writeJSON = (collection, data) => {
  fs.writeFileSync(getMockDataPath(collection), JSON.stringify(data, null, 2), 'utf-8');
};

const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const dataService = {
  users: {
    find: async (query = {}) => {
      if (!checkIsMock()) return await User.find(query).select('-password');
      let users = readJSON('users');
      // Simple filter logic if needed
      return users.map(u => {
        const { password, ...rest } = u;
        return rest;
      });
    },

    findOne: async (query = {}) => {
      if (!checkIsMock()) return await User.findOne(query);
      const users = readJSON('users');
      const key = Object.keys(query)[0];
      if (!key) return null;
      const user = users.find(u => u[key] === query[key]);
      if (!user) return null;
      // Add standard compare function if mock user
      return {
        ...user,
        matchPassword: async function (enteredPassword) {
          return await bcrypt.compare(enteredPassword, this.password);
        }
      };
    },

    findById: async (id) => {
      if (!checkIsMock()) return await User.findById(id).select('-password');
      const users = readJSON('users');
      const user = users.find(u => u._id === id);
      if (!user) return null;
      const { password, ...rest } = user;
      return rest;
    },

    create: async (userData) => {
      if (!checkIsMock()) {
        const user = new User(userData);
        return await user.save();
      }
      const users = readJSON('users');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      const newUser = {
        _id: generateId(),
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        isAdmin: userData.isAdmin || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      users.push(newUser);
      writeJSON('users', users);
      const { password, ...rest } = newUser;
      return rest;
    },

    findByIdAndUpdate: async (id, updateData) => {
      if (!checkIsMock()) return await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
      const users = readJSON('users');
      const idx = users.findIndex(u => u._id === id);
      if (idx === -1) return null;
      
      if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
      }

      users[idx] = { ...users[idx], ...updateData, updatedAt: new Date().toISOString() };
      writeJSON('users', users);
      const { password, ...rest } = users[idx];
      return rest;
    }
  },

  products: {
    find: async (query = {}, options = {}) => {
      if (!checkIsMock()) {
        let mongooseQuery = Product.find(query);
        if (options.sort) mongooseQuery = mongooseQuery.sort(options.sort);
        return await mongooseQuery;
      }
      
      let products = readJSON('products');
      
      // Implement filtering
      if (query.category) {
        products = products.filter(p => p.category.toLowerCase() === query.category.toLowerCase());
      }
      if (query.price) {
        if (query.price.$gte) products = products.filter(p => p.price >= query.price.$gte);
        if (query.price.$lte) products = products.filter(p => p.price <= query.price.$lte);
      }
      if (query.rating) {
        if (query.rating.$gte) products = products.filter(p => p.rating >= query.rating.$gte);
      }
      if (query.name) {
        // Keyword search regex match
        const regex = new RegExp(query.name.$regex, 'i');
        products = products.filter(p => regex.test(p.name) || regex.test(p.description));
      }

      // Implement sorting
      if (options.sort) {
        const sortKey = Object.keys(options.sort)[0];
        const sortOrder = options.sort[sortKey]; // 1 or -1
        products.sort((a, b) => {
          if (a[sortKey] < b[sortKey]) return sortOrder === 1 ? -1 : 1;
          if (a[sortKey] > b[sortKey]) return sortOrder === 1 ? 1 : -1;
          return 0;
        });
      }

      return products;
    },

    findById: async (id) => {
      if (!checkIsMock()) return await Product.findById(id);
      const products = readJSON('products');
      return products.find(p => p._id === id) || null;
    },

    create: async (productData) => {
      if (!checkIsMock()) {
        const product = new Product(productData);
        return await product.save();
      }
      const products = readJSON('products');
      const newProduct = {
        _id: generateId(),
        ...productData,
        reviews: [],
        rating: 0,
        numReviews: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      products.push(newProduct);
      writeJSON('products', products);
      return newProduct;
    },

    findByIdAndUpdate: async (id, updateData) => {
      if (!checkIsMock()) return await Product.findByIdAndUpdate(id, updateData, { new: true });
      const products = readJSON('products');
      const idx = products.findIndex(p => p._id === id);
      if (idx === -1) return null;
      products[idx] = { ...products[idx], ...updateData, updatedAt: new Date().toISOString() };
      writeJSON('products', products);
      return products[idx];
    },

    findByIdAndDelete: async (id) => {
      if (!checkIsMock()) return await Product.findByIdAndDelete(id);
      const products = readJSON('products');
      const filtered = products.filter(p => p._id !== id);
      if (products.length === filtered.length) return null;
      writeJSON('products', filtered);
      return { _id: id };
    }
  },

  orders: {
    find: async (query = {}) => {
      if (!checkIsMock()) return await Order.find(query).populate('user', 'id name email');
      let orders = readJSON('orders');
      const users = readJSON('users');
      
      // Match query
      if (query.user) {
        orders = orders.filter(o => o.user === query.user);
      }

      // Populate user info mock-style
      return orders.map(o => {
        const userObj = users.find(u => u._id === o.user);
        return {
          ...o,
          user: userObj ? { id: userObj._id, name: userObj.name, email: userObj.email } : { id: o.user }
        };
      });
    },

    findById: async (id) => {
      if (!checkIsMock()) return await Order.findById(id).populate('user', 'name email');
      const orders = readJSON('orders');
      const order = orders.find(o => o._id === id);
      if (!order) return null;
      const users = readJSON('users');
      const userObj = users.find(u => u._id === order.user);
      return {
        ...order,
        user: userObj ? { _id: userObj._id, name: userObj.name, email: userObj.email } : { _id: order.user }
      };
    },

    create: async (orderData) => {
      if (!checkIsMock()) {
        const order = new Order(orderData);
        return await order.save();
      }
      const orders = readJSON('orders');
      const products = readJSON('products');
      
      const newOrder = {
        _id: generateId(),
        ...orderData,
        isPaid: orderData.isPaid || false,
        paidAt: orderData.isPaid ? new Date().toISOString() : null,
        isDelivered: orderData.isDelivered || false,
        deliveredAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Deduct stock for products
      for (const item of newOrder.orderItems) {
        const pIdx = products.findIndex(p => p._id === item.product);
        if (pIdx !== -1) {
          products[pIdx].countInStock = Math.max(0, products[pIdx].countInStock - item.qty);
        }
      }
      
      writeJSON('products', products);
      orders.push(newOrder);
      writeJSON('orders', orders);
      return newOrder;
    },

    findByIdAndUpdate: async (id, updateData) => {
      if (!checkIsMock()) return await Order.findByIdAndUpdate(id, updateData, { new: true });
      const orders = readJSON('orders');
      const idx = orders.findIndex(o => o._id === id);
      if (idx === -1) return null;
      orders[idx] = { ...orders[idx], ...updateData, updatedAt: new Date().toISOString() };
      writeJSON('orders', orders);
      return orders[idx];
    }
  }
};
