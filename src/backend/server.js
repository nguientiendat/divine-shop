const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute  = require("./routes/user");
const productRoute = require("./routes/product");
const categoryRoute = require("./routes/category");
// const authController = require("./controllers/authController");

const app = express();
dotenv.config();
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log(`Connected to MongoDB 
--------------------------------`);
    
  } catch (err) {
    console.error(`Failed to connect to MongoDB
---------------------------------`, err);
  }
}

connectDB();

app.use(cors());
app.use(cookieParser());
app.use(express.json())




  //ROUTEs
app.use("/v1/auth",authRoute);
app.use("/v1/user",userRoute)
app.use("/v1/category", categoryRoute);
app.use("/v1/product", productRoute);



app.listen(8000, () => {
    console.log("app is running on port 8000");
  });