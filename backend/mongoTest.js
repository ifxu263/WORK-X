const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://ifxu:<db_password>@cluster0.eqijs8h.mongodb.net/'; // Replace with your MongoDB URI
const client = new MongoClient(uri);

async function connectMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    // You can now use client.db('your-db-name') to access your database
  } catch (err) {
    console.error('MongoDB connection error:', err);
  } finally {
    await client.close();
  }
}

connectMongo();