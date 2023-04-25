require("dotenv/config");
require("./db");
const express = require("express");

const app = express();

const session = require("express-session");
const MongoStore = require("connect-mongo");

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

app.use(
  session({
    secret: "123secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      maxAge: 600000,
    },
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/project-management-server",
    }),
  })
);

// 👇 Start handling routes here
const allRoutes = require("./routes");
app.use("/api", allRoutes);

const customerRouter = require("./routes/customer.routes");
app.use("/api", customerRouter);

const taskRouter = require("./routes/task.routes");
app.use("/api", taskRouter);

const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

require("./error-handling")(app);

module.exports = app;
