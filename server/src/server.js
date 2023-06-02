import express from "express";

import cors from "cors";

import dotenv from 'dotenv';

dotenv.config()

import connectDB from "./config/db.js";

// connect database
connectDB();

const app = express();
const PORT = 5000;

// middleware
app.use(cors()); // can connect multiple domains with this (eg : localhost 5000 and 3000)
app.use(express.json()); // can use req.body with the help of this

app.listen(PORT, () => {
    console.log(`server has started on port ${PORT}`)
});

// routes
import todo from "./routes/todo.js"

// use routes
app.use("/", todo); // added
