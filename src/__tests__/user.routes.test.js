const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const User = require('../models/user.model');

describe('User Routes', () => {
  let testUser;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect('mongodb://localhost:27017/test', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Create a test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      age: 25
    });
  });

  afterAll(async () => {
    // Clean up test data
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /users/:id', () => {
    it('should return user when valid ID is provided and age > 21', async () => {
      const response = await request(app)
        .get(`/users/${testUser._id}`)
        .expect(200);

      expect(response.body).toHaveProperty('_id', testUser._id.toString());
      expect(response.body).toHaveProperty('name', 'Test User');
      expect(response.body).toHaveProperty('email', 'test@example.com');
      expect(response.body).toHaveProperty('age', 25);
    });

    it('should return 404 when user age is <= 21', async () => {
      // Create a user with age <= 21
      const youngUser = await User.create({
        name: 'Young User',
        email: 'young@example.com',
        age: 21
      });

      const response = await request(app)
        .get(`/users/${youngUser._id}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'User not found or age is 21 or below');
    });

    it('should return 400 when invalid ID format is provided', async () => {
      const response = await request(app)
        .get('/users/invalid-id')
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid user ID format');
    });

    it('should return 404 when user is not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/users/${nonExistentId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'User not found or age is 21 or below');
    });
  });
}); 