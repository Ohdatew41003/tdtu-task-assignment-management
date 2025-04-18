const request = require('supertest');
const app = require('../app');
const User = require('../models/User');

describe('Authentication API', () => {
  beforeAll(async () => {
    await User.sync({ force: true });
    await User.create({
      username: 'admin',
      password: 'admin123',
      role: 'truong_khoa'
    });
  });

  test('Đăng nhập thành công', async () => {
    const res = await request(app)
      .post('/login')
      .send({ username: 'admin', password: 'admin123' });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('accessToken');
  });
});