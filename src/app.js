const app = require('express')();

app.get('/', (req, res) => {
    res.status(200).send('<h1>Wealcome to Cultured API</h1>');
});

app.get('/:ticker', (req, res) => {
    const { ticker } = req.params;
    const { key } = req.query;

    if (!ticker || !key) {
      return res.status(400).send({ message: 'Please provide api key and ticker' });
    }

    return res.send('Api key and ticker provided');
});

module.exports = app;