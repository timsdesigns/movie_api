(() => {
  // Import modules
  const express = require("express"),
    morgan = require("morgan"),
    fs = require("fs"),
    path = require("path");

  // Assign functions
  const app = express(),
    accessLogStream = fs.createWriteStream(
      path.join(__dirname, "log.txt"),
      { flags: "a" }
    );

  // Placeholder for DTO as JSON string
  let topMovies = [
    {
      title: "Apocalypse Now",
      director: "Francis Ford Coppola"
    },
    {
      title: "Interstellar",
      director: "Christopher Nolan"
    },
    {
      title: "The Matrix",
      director: "Lana/Lilly Wachowski"
    },
    {
      title: "John Wick",
      director: "Chad Stahelski"
    },
    {
      title: "Wall-E",
      director: "Andrew Stanton"
    },
    {
      title: "The Avengers",
      director: "Joss Whedon"
    },
    {
      title: "Guardians of the Galaxy",
      director: "James Gunn"
    },
    {
      title: "Up",
      director: "Pete Docter"
    },
    {
      title: "Heat",
      director: "Michael Mann"
    },
    {
      title: "The Talented Mr. Ripley",
      director: "Anthony Minghella"
    }
  ];

  // Middleware-Chain: log, auth user, parse json, serve static, route app, handle err, listen req
  // Declaration: function(req, res, next) // Call/Invocation: app.use(function), 
  app.use(morgan("combined", { stream: accessLogStream }));

  // Express HTTP implementation: app.METHOD(PATH, HANDLER(responseLogic))
  app.get("/", (req, res) => res.send("Welcome to Watchlist API!")); 
  app.use(express.static("public")); // app.get("/documentation", (req, res) => res.sendFile("public/documentation.html", { root: __dirname }));
  app.get("/movies", (req, res) => res.json(topMovies));

  app.use((err, req, res, next)=>{
    console.log(err.stack);
    res.status(500).send("Something broke server-side!");
  });

  app.listen(8080, () => console.log("This app awaits requests from port 8080."));
})();
