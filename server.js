const express = require('express');

const app = express();

const connectDB = require('./config/db');
connectDB();

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('API Running'));

app.listen(PORT, () => console.log(`server is listening ${PORT}`));
