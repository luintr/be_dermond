import mongoose from "mongoose";
import dotenv from 'dotenv';
import users from "./data/user";
import { products } from "./data/product";
import User from "./model/userModel";
import Order from "./model/orderModel";
import Product from "./model/productModel";
import connectDB from "./config/db";

dotenv.config()

connectDB()

const importData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    const createUsers = await User.insertMany(users);

    const adminUser = createUsers[0]._id

    const sampleProduct = products.map(product => {
      return { ...product, user: adminUser }
    })

    await Product.insertMany(sampleProduct)
    console.log('Data Imported')
    process.exit()
  } catch (error) {
    console.log(`${error}`)
    process.exit(1)
  }
}

const destroyData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    console.log('Data Deleted')
    process.exit()
  } catch (error) {
    console.log(`${error}`)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}