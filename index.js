const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello Sales Invoice!");
});

app.listen(port, () => {
  console.log(`Sales Invoice app listening on port ${port}`);
});
