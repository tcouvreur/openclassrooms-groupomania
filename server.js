const express = require('express');
const app = express();
const port = 3000;
const usersRoute = require('./routes/usersRoutes');

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.use('/api/users', usersRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})