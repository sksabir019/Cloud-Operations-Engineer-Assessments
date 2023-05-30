require("dotenv").config();
const express = require("express");
const app = express();
const csvParser = require("csv-parser");
const fs = require("fs");
const errorHandler = require("./errorHandler");
const asyncHandler = require("./asyncHandler");

// Middleware to parse JSON request bodies
app.use(express.json());

//Home page
app.get("/", (req, res) => {
  const availableEndpoints = [
    "GET /v1/users",
    "POST /v1/users",
    "GET /v1/users/:userId",
  ];

  const welcomeMessage = "Welcome to User API";

  const response = {
    message: welcomeMessage,
    endpoints: availableEndpoints,
  };

  res.json(response);
});

// Define routes
app.get(
  "/v1/users",
  asyncHandler(async (req, res) => {
    const users = [];

    fs.createReadStream("data.csv")
      .pipe(csvParser())
      .on("data", (row) => {
        const id = parseInt(row.id);
        const name = row.name.trim();
        users.push({ id, name });
      })
      .on("end", () => {
        res.json(users);
      });
  })
);

app.post(
  "/v1/users",
  asyncHandler(async (req, res) => {
    // Logic to create a new user
    const newUser = req.body;

    // Read the existing CSV file
    const existingData = fs.readFileSync("data.csv", "utf8");

    // Parse the CSV data
    const rows = existingData.trim().split("\n");

    // Remove the header row from the CSV data
    const header = rows.shift();

    // Parse the remaining rows as user objects
    const users = rows.map((row) => {
      const [id, name] = row.split(",");
      return { id: parseInt(id), name: name.trim() };
    });

    // Generate a new ID for the user
    const newUserId =
      users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1;

    // Add the new user to the array
    users.push({ id: newUserId, name: newUser.name });

    // Generate the updated CSV data
    const updatedCSV = `${header}\n${users
      .map((user) => `${user.id},${user.name}`)
      .join("\n")}`;

    // Write the updated CSV data back to the file
    fs.writeFileSync("data.csv", updatedCSV);

    // Return the newly created user
    res.status(201).json({ id: newUserId, name: newUser.name });
  })
);

app.get(
  "/v1/users/:userId",
  asyncHandler(async (req, res) => {
    // Logic to retrieve a user by ID
    const userId = parseInt(req.params.userId);

    // Read the existing CSV file
    const existingData = fs.readFileSync("data.csv", "utf8");

    // Parse the CSV data
    const users = existingData
      .trim()
      .split("\n")
      .map((row) => {
        const [id, name] = row.split(",");
        return { id: parseInt(id), name: name.trim() };
      });

    // Find the user with the given userId
    const user = users.find((user) => user.id === userId);

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  })
);

// Error handling middleware
app.use(errorHandler);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
