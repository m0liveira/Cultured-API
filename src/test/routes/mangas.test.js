const request = require('supertest');
const app = require('../../app');

test('Test #1 - Validates if the get method retrieves mangas from the website', async () => {
    const response = await request(app).get('/mangas');
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);

    console.log(response.body);
});