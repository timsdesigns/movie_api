(() => {
  // Import modules
  const express = require("express"),
    morgan = require("morgan"),
    fs = require("fs"),
    path = require("path"),
    bodyParser = require("body-parser"),
    uuid = require("uuid");

  // Assign functions
  const app = express(),
    accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
      flags: "a",
    });

  app.use(bodyParser.json());

  // Placeholders for DTO as JSON strings
  let users = [
    {
      id: 1,
      name: "Kim",
      favMovies: [],
    },
    {
      id: 2,
      name: "Joe",
      favMovies: ["Apocalypse Now"],
    },
  ];

  let topMovies = [
    {
      title: "Apocalypse Now",
      description: "",
      genre: {
        name: "War",
        description: "",
      },
      director: {
        name: "Francis Ford Coppola",
        bio: "",
        born: "",
      },
      imageURL: "",
      featured: false,
    },
    {
      title: "Interstellar",
      description: "",
      genre: {
        name: "Science fiction",
        description: "",
      },
      director: {
        name: "Christopher Nolan",
        bio: "",
        born: "",
      },
      imageURL: "",
      featured: false,
    },
    {
      title: "The Matrix",
      description: "",
      genre: {
        name: "Science fiction",
        description: "",
      },
      director: {
        name: "Lana/Lilly Wachowski",
        bio: "",
        born: "",
      },
      imageURL: "",
      featured: false,
    },
    {
      title: "John Wick",
      description: "",
      genre: {
        name: "Action",
        description: "",
      },
      director: {
        name: "Chad Stahelski",
        bio: "",
        born: "",
      },
      imageURL: "",
      featured: false,
    },
    {
      title: "Wall-E",
      description: "",
      genre: {
        name: "Animation",
        description: "",
      },
      director: {
        name: "Andrew Stanton",
        bio: "",
        born: "",
      },
      imageURL: "",
      featured: false,
    },
    {
      title: "The Avengers",
      description: "",
      genre: {
        name: "Superhero",
        description: "",
      },
      director: {
        name: "Joss Whedon",
        bio: "",
        born: "",
      },
      imageURL: "",
      featured: false,
    },
    {
      title: "Guardians of the Galaxy",
      description: "",
      genre: {
        name: "Superhero",
        description: "",
      },
      director: {
        name: "James Gunn",
        bio: "",
        born: "",
      },
      imageURL: "",
      featured: false,
    },
    {
      title: "Up",
      description: "",
      genre: {
        name: "Animation",
        description: "",
      },
      director: {
        name: "Pete Docter",
        bio: "",
        born: "",
      },
      imageURL: "",
      featured: false,
    },
    {
      title: "Heat",
      description: "",
      genre: {
        name: "Crime",
        description: "",
      },
      director: {
        name: "Michael Mann",
        bio: "",
        born: "",
      },
      imageURL: "",
      featured: false,
    },
    {
      description: "",
      genre: {
        name: "Drama",
        description: "",
      },
      director: {
        name: "Anthony Minghella",
        bio: "",
        born: "",
      },
      imageURL: "",
      featured: false,
    },
  ];

  // Middleware-Chain: log, auth user, parse json, serve static, route app, handle err, listen req
  // Declaration: function(req, res, next) // Call/Invocation: app.use(function),
  app.use(morgan("combined", { stream: accessLogStream }));

  // READ   Get a list of all movies
  app.get("/movies", (req, res) => {
    res.status(200).json(topMovies);
  });

  // READ   Get data about a single movie by title (description, genre, director, image URL, whether it’s featured or not)
  app.get("/movies/:title", (req, res) => {
    const { title } = req.params; // object restructuring
    const movie = topMovies.find((m) => m.title === title);
    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(400).send("Movie not found.");
    }
  });

  // READ   Get data about a genre by name (description)
  app.get("/movies/genre/:name", (req, res) => {
    const { name } = req.params; // object restructuring
    const genre = topMovies.find((m) => m.genre.name === name).genre;
    if (genre) {
      res.status(200).json(genre);
    } else {
      res.status(400).send("Movie not found.");
    }
  });

  // READ   Get data about a director by name (bio, birth year, death year)
  app.get("/movies/director/:name", (req, res) => {
    const { name } = req.params; // object restructuring
    const director = topMovies.find((m) => m.director.name === name).director;
    if (director) {
      res.status(200).json(director);
    } else {
      res.status(400).send("Movie not found.");
    }
  });

  // CREATE Register a new user
  app.post("/users", (req, res)=>{
    const user = req.body;
    if(user.name){
      user.id = uuid.v4();
      users.push(user);
      res.status(201).json(user);
    } else {
      res.status(400).send("Please provide user name.");
    }
  });

  // UPDATE Update user info (username)
  app.put("/users/:id", (req, res)=>{
    const { id } = req.params;
    const updatedUser = req.body;
    let user = users.find(u=>u.id == id); // Number truthy to string: `==`, to be updated: `let`
    if(user){
      user.name = updatedUser;
      res.status(200).json(user);
    } else {
      res.status(400).send("User not found.");
    }
  });

  // CREATE Add movie to favorites (showing only a text that a movie has been added)
  app.post("/users/:id/:title", (req, res)=>{
    const { id, title } = req.params; // store multiple const from params
    let user = users.find(u=>u.id == id);
    if(user){
      user.favMovies.push(title)
      //res.status(201).json(user);
      res.status(201).send(`Movie ${title} has been added to ${user.name}'s favorites.`);
    } else {
      res.status(400).send("User not found.");
    }
  });

  // DELETE Remove movie from favorites (showing only a text that a movie has been removed)
  app.delete("/users/:id/:title", (req, res)=>{
    const { id, title } = req.params;
    let user = users.find(u=>u.id == id);
    if(user){
      user.favMovies = user.favMovies.filter(t=>t !== title);
      //res.status(200).json(user);
      res.status(200).send(`Movie ${title} has been removed from ${user.name}'s favorites.`);
    } else {
      res.status(400).send("User not found.");
    }
  });

  // DELETE Deregister User (showing only a text that a user email has been removed)
  app.delete("/users/:id", (req, res)=>{
    const { id } = req.params;
    let user = users.find(u=>u.id == id);
    if(user){
      users = users.filter(u=>u.id !== id);
      //res.status(200).json(user);
      res.status(200).send(`User ${user.name} with id: ${id} has been removed from.`);
    } else {
      res.status(400).send("User not found.");
    }
  });

  // Express HTTP implementation: app.METHOD(PATH, HANDLER(responseLogic))
  app.get("/", (req, res) => res.send("Welcome to Watchlist API!"));
  app.use(express.static("public"));

  app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send("Something broke server-side!");
  });

  app.listen(8080, () =>
    console.log("This app awaits requests from port 8080.")
  );
})();
