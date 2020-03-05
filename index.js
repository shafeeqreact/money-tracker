require('dotenv').config();

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const income = require('./routes/income');
const expense = require('./routes/expense');

const PORT = process.env.PORT || 8080;

app.use('/api/income', income);
app.use('/api/expense', expense);

app.listen(PORT, () => console.log(`Server is up and listening on port ${PORT}...`));