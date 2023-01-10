const express = require("express");
const { config } = require('dotenv');
const app = express();
config();
const port = process.env.PORT;
const router = require('./routes/user.route');
app.use(router)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
