var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var hbs = require("express-handlebars");
var db = require("./essentials/database");
var session = require("express-session");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var adminRouter = require("./routes/admin");
const constants = require("./essentials/constants");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs.engine({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials",
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({ secret: constants["session-secret"], cookie: { maxAge: 6000000 } }));

// Database connection
db.connect;

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Uncommand following for enabling custom 404 message
//app.all('*', (req, res) => {
//  res.status(404).send('<h1>404! Page not found</h1>');
//});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
