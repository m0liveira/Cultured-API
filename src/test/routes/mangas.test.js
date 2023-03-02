const request = require('supertest');
const app = require('../../app');

test('Test #1 - Validates if the get method retrieves mangas from the website', async () => {
    const response = await request(app).get('/mangas');
    // #NOTE: It's a long time running test (it´s working)
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
});

test('Test #2 - Validates if the get method retrieves most popular mangas from the website', async () => {
    const response = await request(app).get('/mangas/trending');
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
});