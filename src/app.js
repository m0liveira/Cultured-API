const app = require('express')();
const consign = require('consign');

consign({ cwd: 'src', verbose: false })
    .include('./routes')
    .then('./controllers/routes.js')
    .into(app);

app.get('/', (req, res) => {
    res.status(200).send('<h1>Wealcome to Cultured API</h1>');
});

module.exports = app;