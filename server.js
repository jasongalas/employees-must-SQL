const express = require('express');
// Import and require Pool (node-postgres)
const { Pool } = require('pg');
const db = require('db');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const pool = new Pool(
  
  db.connect({
    // TODO: Enter PostgreSQL username
    user: process.env.DB_USER,
    // TODO: Enter PostgreSQL password
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE
  }),
  console.log(`Connected to the database.`)
)

pool.connect();

