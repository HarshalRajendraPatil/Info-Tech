const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");

const middleware = require("./middleware");
const loginRoute = require("./Routes/loginRoute");
const signupRoute = require("./Routes/signupRoute");
const logoutRoute = require("./Routes/logoutRoute");
const postRoute = require("./Routes/postRoute");
const blogRoute = require("./Routes/blogRoute");
const profileRoute = require("./Routes/profileRoute");
const subscribeRoute = require("./Routes/subscribeRoute");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");
app.use(
  session({
    secret: "my application",
    resave: true,
    saveUninitialized: false,
  })
);
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://harshalrptl62:qwerty123@cluster1.2vpilje.mongodb.net/Data?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Successfully connected to database");
    app.listen(3001, () => {
      console.log("Server started at port 3001");
    });
  })
  .catch((err) => console.log(err.message));

app.get("/", middleware.requireLogin, (req, res) => {
  res.render("home");
});

app.use("/login", loginRoute);

app.use("/signup", signupRoute);

app.use("/logout", logoutRoute);

app.use("/subscribe", subscribeRoute);

app.use("/post", postRoute);

app.use("/blogs", blogRoute);

app.use("/profile", profileRoute);
