const supertest = require('supertest');

const request = supertest('http://localhost:3001');

test('Test #1 - Validate server response on port 3001', () => {
    return request.get('/').then((res) => expect(res.status).toBe(200));
});