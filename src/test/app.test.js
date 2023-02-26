const request = require('supertest');

const app = require('../app');

test('Test #1 - Test root', () => {
    return request(app).get('/').then((res) => expect(res.status).toBe(200));
});