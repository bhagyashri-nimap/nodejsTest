const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('./db.js');
const app = express();
app.use(cors());
app.options('*', cors());
 const apiRoutes = require('./controllers/UserController');
app.use('', apiRoutes);
const server = require('http').createServer(app);
server.listen(3000, () => {
  console.log("Success", 3000)
})

module.exports = app;