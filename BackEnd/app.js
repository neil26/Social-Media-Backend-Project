const express = require("express");
const monogoose = require("mongoose");
const path = require("path");

const app = express();

//static middleware
app.use(express.static(path.join(__dirname, "public")));

//Init Middleware
app.use(express.json());

//CORS Middleware
var cors = require("cors");

app.use(cors()); // Use this after the variable declaration

//DB Config
const db = require("./config/keys").MongoURI;

//connect to Mongo
monogoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() =>
    console.log("Connected TO Social Media Networking Clone Database on Atlas!")
  )
  .catch((err) => console.log(err));

app.use("/", require("./routes/index"));
app.use("/users", require("./routes/users"));
app.use("/auth", require("./routes/auth"));
app.use("/profile", require("./routes/profile"));
app.use("/posts", require("./routes/posts"));

//Port Number
const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server Started on ${PORT}`);
});
