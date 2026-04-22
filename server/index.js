const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./src/config/db');

connectDB();

const apiRoutes = require('./src/routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/status', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
