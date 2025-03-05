import express from "express";
import dotenv from "dotenv";

//configure dotenv

dotenv.config();

//instance of express
const app = express();

//load the variables
const port = process.env.PORT;
console.log(port);
// a simple get request
app.get("/", (req, res) => {
  res.send("Hello world, Be HUMBLE to us");
});

//create server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
