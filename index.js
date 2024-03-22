(() => {
  // Import modules
  const express = require("express"),
    morgan = require("morgan"),
    fs = require("fs"),
    path = require("path"),
    bodyParser = require("body-parser"),
    uuid = require("uuid"),
    swaggerUi = require("swagger-ui-express"),
    swaggerJsdoc = require("swagger-jsdoc");

  // Assign functions
  const app = express(),
    accessLogStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
      flags: "a",
    });

  app.use(bodyParser.json());

  // Swagger Setup
  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Watchlist API",
        version: "1.0.0",
      },
      components: {
        schemas: {
          Movie: {
            type: "object",
            properties: {
              title: {
                type: "string",
                description: "The title of the movie",
              },
              description: {
                type: "string",
                description: "A brief description of the movie",
              },
              genre: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "The genre of the movie",
                  },
                  description: {
                    type: "string",
                    description: "A brief description of the genre",
                  },
                },
              },
              director: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "The name of the director",
                  },
                  bio: {
                    type: "string",
                    description: "A brief biography of the director",
                  },
                  born: {
                    type: "string",
                    description: "The birth year of the director",
                  },
                },
              },
              imageURL: {
                type: "string",
                description: "URL to the movie poster image",
              },
              featured: {
                type: "boolean",
                description: "Whether the movie is featured or not",
              },
            },
          },
          // New User schema
          User: {
            type: "object",
            properties: {
              id: {
                type: "integer",
                format: "int64",
                description: "Unique identifier for the user",
              },
              name: {
                type: "string",
                description: "Name of the user",
              },
              favMovies: {
                type: "array",
                items: {
                  $ref: '#/components/schemas/Movie', // Reference to Movie schema
                },
                description: "List of user's favorite movies",
              },
            },
          },
          // New Genre schema
          Genre: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "The genre of the movie",
              },
              description: {
                type: "string",
                description: "A brief description of the genre",
              },
            },
          },
          // New Director schema
          Director: {
            type: "object",
            properties: {
              name: {
                type: "string",
                description: "The name of the director",
              },
              bio: {
                type: "string",
                description: "A brief biography of the director",
              },
              born: {
                type: "string",
                description: "The birth year of the director",
              },
            },
          },
        },
      },
      description: "Watchlist API offering CRUD operations using Express",
      servers: [{ url: "http://localhost:8080" }],
    },
    apis: ["./index.js"],
  };
  const specs = swaggerJsdoc(options);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

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

  // Routing and Handling:

  // READ   Get a list of all movies
  /**
   * @openapi
   * /movies:
   *   get:
   *     summary: Retrieve the list of all movies
   *     description: Returns a list of all movies available in the database.
   *     responses:
   *       200:
   *         description: A list of movies
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Movie'
   *             example:
   *               - title: "Apocalypse Now"
   *                 description: ""
   *                 genre:
   *                   name: "War"
   *                   description: ""
   *                 director:
   *                   name: "Francis Ford Coppola"
   *                   bio: ""
   *                   born: ""
   *                 imageURL: ""
   *                 featured: false
   *     tags:
   *       - Movies
   */
  app.get("/movies", (req, res) => {
    res.status(200).json(topMovies);
  });

  // READ   Get data about a single movie by title (description, genre, director, image URL, whether it’s featured or not)
  /**
 * @openapi
 * /movies/{title}:
 *   get:
 *     summary: Retrieve data about a single movie by title
 *     description: Returns detailed information about a movie, including its description, genre, director, image URL, and whether it's featured or not.
 *     parameters:
 *       - in: path
 *         name: title
 *         schema:
 *           type: string
 *         required: true
 *         description: The title of the movie to retrieve.
 *     responses:
 *       200:
 *         description: Movie details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movie'
 *             example:
 *               title: "Apocalypse Now"
 *               description: ""
 *               genre:
 *                 name: "War"
 *                 description: ""
 *               director:
 *                 name: "Francis Ford Coppola"
 *                 bio: ""
 *                 born: ""
 *               imageURL: ""
 *               featured: false
 *       400:
 *         description: Movie not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Movie not found."
 *     tags:
 *       - Movies
 */
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
  /**
   * @openapi
   * /movies/genre/{name}:
   *   get:
   *     summary: Retrieve data about a genre by name
   *     description: Returns detailed information about a genre, including its description.
   *     parameters:
   *       - in: path
   *         name: name
   *         schema:
   *           type: string
   *         required: true
   *         description: The name of the genre to retrieve.
   *     responses:
   *       200:
   *         description: Genre details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Genre'
   *             example:
   *               name: "War"
   *               description: "A genre that includes war movies."
   *       400:
   *         description: Genre not found
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *               example: "Genre not found."
   *     tags:
   *       - Genres
   */
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
  /**
   * @openapi
   * /movies/director/{name}:
   *   get:
   *     summary: Retrieve data about a director by name
   *     description: Returns detailed information about a director, including their bio, birth year, and death year.
   *     parameters:
   *       - in: path
   *         name: name
   *         schema:
   *           type: string
   *         required: true
   *         description: The name of the director to retrieve.
   *     responses:
   *       200:
   *         description: Director details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Director'
   *             example:
   *               name: "Francis Ford Coppola"
   *               bio: "American film director, producer, screenwriter, and film editor."
   *               born: "1939"
   *               death: "2020"
   *       400:
   *         description: Director not found
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *               example: "Director not found."
   *     tags:
   *       - Directors
   */
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
  /**
   * @openapi
   * /users:
   *   post:
   *     summary: Register a new user
   *     description: Creates a new user with the provided details.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/User'
   *     responses:
   *       201:
   *         description: User created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *             example:
   *               id: "123e4567-e89b-12d3-a456-426614174000"
   *               name: "John Doe"
   *       400:
   *         description: Missing user name
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *               example: "Please provide user name."
   *     tags:
   *       - Users
   */
  app.post("/users", (req, res) => {
    const user = req.body;
    if (user.name) {
      user.id = uuid.v4();
      users.push(user);
      res.status(201).json(user);
    } else {
      res.status(400).send("Please provide user name.");
    }
  });

  // UPDATE Update user info (username)
  /**
   * @openapi
   * /users/{id}:
   *   put:
   *     summary: Update user info
   *     description: Updates the username of a user with the provided ID.
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The ID of the user to update.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *                 description: The new username for the user.
   *     responses:
   *       200:
   *         description: User info updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *             example:
   *               id: "123e4567-e89b-12d3-a456-426614174000"
   *               name: "New Username"
   *       400:
   *         description: User not found
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *               example: "User not found."
   *     tags:
   *       - Users
   */
  app.put("/users/:id", (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;
    let user = users.find((u) => u.id == id); // Number truthy to string: `==`, to be updated: `let`
    if (user) {
      user.name = updatedUser;
      res.status(200).json(user);
    } else {
      res.status(400).send("User not found.");
    }
  });

  // CREATE Add movie to favorites (showing only a text that a movie has been added)
  /**
   * @openapi
   * /users/{id}/{title}:
   *   post:
   *     summary: Add movie to favorites
   *     description: Adds a specified movie to the favorites list of a user.
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The ID of the user.
   *       - in: path
   *         name: title
   *         schema:
   *           type: string
   *         required: true
   *         description: The title of the movie to add to favorites.
   *     responses:
   *       201:
   *         description: Movie added to favorites successfully
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *             example: "Movie [Title] has been added to [User Name]'s favorites."
   *       400:
   *         description: User not found
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *             example: "User not found."
   *     tags:
   *       - Users
   */
  app.post("/users/:id/:title", (req, res) => {
    const { id, title } = req.params; // store multiple const from params
    let user = users.find((u) => u.id == id);
    if (user) {
      user.favMovies.push(title);
      //res.status(201).json(user);
      res
        .status(201)
        .send(`Movie ${title} has been added to ${user.name}'s favorites.`);
    } else {
      res.status(400).send("User not found.");
    }
  });

  // DELETE Remove movie from favorites (showing only a text that a movie has been removed)
  /**
   * @openapi
   * /users/{id}/{title}:
   *   delete:
   *     summary: Remove movie from favorites
   *     description: Removes a specified movie from the favorites list of a user.
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The ID of the user.
   *       - in: path
   *         name: title
   *         schema:
   *           type: string
   *         required: true
   *         description: The title of the movie to remove from favorites.
   *     responses:
   *       200:
   *         description: Movie removed from favorites successfully
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *             example: "Movie [Title] has been removed from [User Name]'s favorites."
   *       400:
   *         description: User not found
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *             example: "User not found."
   *     tags:
   *       - Users
   */
  app.delete("/users/:id/:title", (req, res) => {
    const { id, title } = req.params;
    let user = users.find((u) => u.id == id);
    if (user) {
      user.favMovies = user.favMovies.filter((t) => t !== title);
      //res.status(200).json(user);
      res
        .status(200)
        .send(`Movie ${title} has been removed from ${user.name}'s favorites.`);
    } else {
      res.status(400).send("User not found.");
    }
  });

  // DELETE Deregister User (showing only a text that a user email has been removed)
  /**
   * @openapi
   * /users/{id}:
   *   delete:
   *     summary: Deregister User
   *     description: Removes a user with the specified ID from the system.
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: The ID of the user to deregister.
   *     responses:
   *       200:
   *         description: User deregistered successfully
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *             example: "User [User Name] with id: [ID] has been removed."
   *       400:
   *         description: User not found
   *         content:
   *           text/plain:
   *             schema:
   *               type: string
   *             example: "User not found."
   *     tags:
   *       - Users
   */
  app.delete("/users/:id", (req, res) => {
    const { id } = req.params;
    let user = users.find((u) => u.id == id);
    if (user) {
      users = users.filter((u) => u.id !== id);
      //res.status(200).json(user);
      res
        .status(200)
        .send(`User ${user.name} with id: ${id} has been removed from.`);
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
