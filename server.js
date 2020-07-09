const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.status(200).send("server says hello");
});

const port = 3000;
app.listen(port, () => {
  console.log(`the app is running at ${port}...`);
});
