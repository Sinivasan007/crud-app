const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const app = express();
const port = 5000;

// Database connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mydatabase',
  password: 'Sini@2005',
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

app.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, phoneNumber, address } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password, phone_number, address) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [firstName, lastName, email, hashedPassword, phoneNumber, address]
    );
    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        // Return user ID along with the token (simulating token for simplicity)
        res.status(200).json({ message: 'Logged in successfully', userId: user.id, token: 'dummy-token' });
      } else {
        res.status(400).json({ error: 'Invalid email or password' });
      }
    } else {
      res.status(400).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/user/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/user/:id', async (req, res) => {
  const userId = req.params.id;
  const { firstName, lastName, email, phoneNumber, address } = req.body;

  try {
    const result = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, email = $3, phone_number = $4, address = $5 WHERE id = $6 RETURNING *',
      [firstName, lastName, email, phoneNumber, address, userId]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/user/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
