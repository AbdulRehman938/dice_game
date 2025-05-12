import express from "express";
import bodyParser from "body-parser";
import { Sequelize, DataTypes } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import path from "path";

const app = express();
const port = 3300;

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the current directory
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Sequelize with MySQL
const sequelize = new Sequelize("game1login", "root", "8naqn0h4", {
  host: "localhost",
  dialect: "mysql",
});

// Define the User model
const User = sequelize.define("User", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  username: { 
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default User;

// Sync the database and seed initial data
sequelize
  .sync()
  .then(async () => {
    console.log("Database & tables synced!");
  })
  .catch((err) => {
    console.error("Unable to sync database:", err);
  });

// JWT secret key
const JWT_SECRET = "i_am_abduls"; 

// Serve login.html at the root path
app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Serve create-account.html
app.get("/create-account", (req, res) => {
  res.sendFile(path.join(__dirname, "create-account.html"));
});

// Serve the game page (protected route)
app.get("/game", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header
  if (!token) {
    return res.status(401).sendFile(path.join(__dirname, "login.html")); // Redirect to login if no token
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify the token
    console.log("Token decoded:", decoded); // Debugging
    res.sendFile(path.join(__dirname, "index.html")); // Serve the game page
  } catch (error) {
    console.error("Invalid token:", error);
    res.status(401).sendFile(path.join(__dirname, "login.html")); // Redirect to login if token is invalid
  }
});

// Handle login form submission
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Login attempt:", { username, password }); // Debugging

  try {
    const user = await User.findOne({ where: { username } });
    console.log("User found:", user); // Debugging

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("Password valid:", isPasswordValid); // Debugging

      if (isPasswordValid) {
        // Generate a JWT token
        const token = jwt.sign({ username: user.username }, JWT_SECRET, {
          expiresIn: "1h", // Token expires in 1 hour
        });
        res.status(200).json({ success: true, message: "Login successful", token });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Invalid username or password" });
      }
    } else {
      res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

// Handle create account form submission
app.post("/api/create-account", async (req, res) => {
  const { firstName, lastName, username, password, verifyPassword } = req.body;

  // Validate inputs
  if (!firstName || !lastName || !username || !password || !verifyPassword) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  if (password !== verifyPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Passwords do not match" });
  }

  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    await User.create({
      firstName,
      lastName,
      username,
      password: hashedPassword,
    });
    res
      .status(201)
      .json({ success: true, message: "Account created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error creating account" });
  }
});

app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});