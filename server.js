require('dotenv').config();
console.log("==>", process.env.DB_NAME);
const express = require('express');
const app = express();
const port = 3000;
const usersRoute = require('./routes/usersRoutes');
const bodyParser = require("body-parser");
global.database = require('./models/database');
 
app.use(bodyParser());
app.use(database.connect);

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.use('/api/users', usersRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})
 
app.use(database.disconnect);
// middleware de sortie a faire