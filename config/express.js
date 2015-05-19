"use strict";

var express = require("express"),
    path = require("path"),
    fs = require("fs"),
    http = require("http"),
    https = require("https"),
    cookieParser = require("cookie-parser"),
    bodyParser = require("body-parser"),
    consolidate = require("consolidate"),
    morgan = require("morgan"),
    session = require("express-session"),
    SessionStore = require("express-mysql-session"),
    helmet = require("helmet"),
    favicon = require("serve-favicon"),
    passport = require("passport"),
    passportSetup = require("./passport"),
    LocalStrategy = require("passport-local").Strategy,
    config = require("./config");

module.exports = function () {
  // Initialize the app
  var app = express();

  // Setting application local variables
  app.locals.title = config.app.title;
  app.locals.description = config.app.description;

  // App favicon
  app.use(favicon(path.resolve("./public/favicons/favicon.ico")));

  // Pass url to environment locals
  app.use(function (req, res, next) {
    res.locals.url = req.protocol + "://" + req.headers.host + req.url;
    next();
  });
  app.use(bodyParser.json({limit: "2mb"}));
  app.use(bodyParser.urlencoded({limit: "2mb", extended: true}));

  // Set swig as the template engine
  app.engine("server.view.html", consolidate.swig);

  // view engine setup
  app.set("view engine", "server.view.html");
  app.set("views", "./app/views");

  // Environment dependent middleware
  if (process.env.NODE_ENV === "development") {
    // Enable logger
    app.use(morgan("dev"));

    // Disable views cache
    app.set("view cache", false);
  } else if (process.env.NODE_ENV === "production") {
    app.locals.cache = "memory";
  }

  // Request body parsing middleware
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

  // CookieParser should be above session
  app.use(cookieParser());

  // Express MySQL session storage
  app.use(session({
    secret: config.sessionSecret,
    store: new SessionStore(config.database.connection),
    resave: true,
    saveUninitialized: true
  }));

  // Setup flash messages
  app.use(require("connect-flash")());
  app.use(function (req, res, next) {
    res.locals.messages = require("express-messages")(req, res);
    next();
  });

  // Use passport session
  passport.serializeUser(passportSetup.serializeUser);
  passport.deserializeUser(passportSetup.deserializeUser);
  passport.use(new LocalStrategy(
    {usernameField: "username", passwordField: "password"},
    passportSetup.strategy)
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // Use helmet to secure Express headers
  app.use(helmet.xframe());
  app.use(helmet.xssFilter());
  app.use(helmet.nosniff());
  app.use(helmet.ienoopen());
  app.disable("x-powered-by");

  // Static folder
  app.use(express.static(path.resolve("./public")));

  // Routing files
  require("../app/routes/index.server.routes")(app);

  app.use(function (err, req, res, next) {
    if (!err) { return next(); }

    console.error(err.stack);

    res.status(500).render("500", {
      error: err.stack
    });
  });

  // Assume 404 since no middleware responded
  app.use(function(req, res) {
    res.status(404).render("404", {
      url: req.originalUrl,
      error: "Not Found"
    });
  });

  if (process.env.NODE_ENV === "secure") {
    // Log SSL usage
    console.log("Securely using https protocol");

    // Load SSL key and certificate
    var privateKey = fs.readFileSync("./config/ssl_certs/key.pem", "utf8");
    var certificate = fs.readFileSync("./config/ssl_certs/cert.pem", "utf8");

    // Create HTTPS Server
    var httpsServer = https.createServer({
      key: privateKey,
      cert: certificate
    }, app);

    // Return HTTPS server instance
    return httpsServer;
  }

  return http.createServer(app);
};
