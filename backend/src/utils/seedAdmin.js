/**
 * Seed Admin User Script
 * Run with: node src/utils/seedAdmin.js
 * 
 * Creates the admin user in MongoDB if it doesn't already exist.
 * Password is hashed via bcrypt (same as the User model's pre-save hook).
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const dns      = require('dns');

// Force Google DNS (same as db.js — needed for Atlas SRV lookups)
dns.setServers(['8.8.8.8', '8.8.4.4']);

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('❌ MONGO_URI not found in .env');
  process.exit(1);
}

// ─── Admin credentials (must match admin.json) ────────────────────────────
const ADMIN = {
  name:          'Admin',
  email:         'babynath1712@gmail.com',
  password:      'Admin@1234',
  role:          'admin',
  phone:         '+91 9000000001',
  address: {
    street:  'TechVault HQ, Cyber City',
    city:    'Hyderabad',
    state:   'Telangana',
    pincode: '500081',
    country: 'India',
  },
  isVerified: true,
  isActive:   true,
};

async function seedAdmin() {
  try {
    // 1. Connect to MongoDB Atlas
    await mongoose.connect(MONGO_URI, { dbName: 'techvault' });
    console.log('✅ Connected to MongoDB Atlas (techvault)');

    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // 2. Check if admin already exists
    const existing = await usersCollection.findOne({ email: ADMIN.email });
    if (existing) {
      console.log('ℹ️  Admin user already exists:', existing.email);
      console.log('   Role:', existing.role);
      console.log('   isVerified:', existing.isVerified);
      console.log('   isActive:', existing.isActive);

      // If it exists but role is not admin, fix it
      if (existing.role !== 'admin') {
        await usersCollection.updateOne(
          { email: ADMIN.email },
          { $set: { role: 'admin', isVerified: true, isActive: true } }
        );
        console.log('🔧 Fixed: Updated role to admin and marked verified/active.');
      } else {
        console.log('✅ Admin user is correctly configured. No changes needed.');
      }

      await mongoose.disconnect();
      return;
    }

    // 3. Hash the password (12 salt rounds — matches User model)
    console.log('🔐 Hashing password...');
    const salt          = await bcrypt.genSalt(12);
    const password_hash = await bcrypt.hash(ADMIN.password, salt);

    // 4. Insert admin user directly into collection (bypasses Mongoose validation quirks)
    const now = new Date();
    const result = await usersCollection.insertOne({
      name:          ADMIN.name,
      email:         ADMIN.email.toLowerCase(),
      password_hash,
      role:          ADMIN.role,
      phone:         ADMIN.phone,
      address:       ADMIN.address,
      isVerified:    ADMIN.isVerified,
      isActive:      ADMIN.isActive,
      profileImage:  null,
      created_at:    now,
      updated_at:    now,
    });

    console.log('');
    console.log('🎉 Admin user seeded successfully!');
    console.log('──────────────────────────────────');
    console.log('   Email   :', ADMIN.email);
    console.log('   Password:', ADMIN.password);
    console.log('   Role    :', ADMIN.role);
    console.log('   ID      :', result.insertedId);
    console.log('──────────────────────────────────');
    console.log('');

  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB.');
  }
}

seedAdmin();
