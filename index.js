require('dotenv').config();

const PORT = process.env.PORT || 8080;

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const salary = require('./routes/salary');
const crypto = require('./routes/crypto');
const expense = require('./routes/expense');

app.use('/api/income/salary', salary);
app.use('/api/investment/crypto', crypto);
app.use('/api/expense', expense);

app.listen(PORT, () => console.log(`Server is up and listening on port ${PORT}...`));