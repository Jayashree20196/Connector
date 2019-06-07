//express package import
const express = require('express');

//use express package using app variable
const app = express();

//Init middleware
app.use(express.json({ extended: false }));

//get db connection file
const connectDB = require('./config/db');
connectDB();

//set port, either environment port or assign default port
const PORT = process.env.PORT || 5000;

//route method
app.get('/', (req, res) => res.send('API Running'));

//listen to the port
app.listen(PORT, () => console.log(`server is listening ${PORT}`));

//routers
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/posts', require('./routes/api/posts'));
