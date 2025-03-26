const express = require('express');
const connectDB = require('./src/config/db.config');
const userRoutes = require('./src/routes/user.routes');

const app = express();
const port = 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// API Routes
app.use('/users', userRoutes);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Handle 404 for API routes
app.use('/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Start the server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`API Server is running on http://localhost:${port}`);
  });
}

module.exports = app;
