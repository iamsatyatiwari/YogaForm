const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const userschema = require("./user");

app.use(morgan("dev"));

// Database connection
require("./db_connection");

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cors({
        origin: "http://localhost:3000", // <-- location of the react app we're connecting to
        credentials: true,
    })
);

// POST endpoint to save data to the database
app.post("/saveUserData", async (req, res) => {
    try {
        console.log(req.body);
        const { name, age, email, phoneNumber, selectedBatch } = req.body;

        // Check if a user with the given email already exists
        const existingUser = await userschema.findOne({ email });

        if (existingUser) {
            // Check if the user has updated data in the last 30 days
            const lastUpdateDate = existingUser.updatedAt;
            const currentDate = new Date();

            // Calculate the difference in days
            const daysSinceLastUpdate = Math.floor(
                (currentDate - lastUpdateDate) / (1000 * 60 * 60 * 24)
            );

            // Allow update only once a month
            if (daysSinceLastUpdate < 30) {
                return res.status(201).json({ message: "You Can Update Data only once a month" });
            }

            // If user exists and the update is allowed, update the existing user
            existingUser.name = name;
            existingUser.age = age;
            existingUser.phoneNumber = phoneNumber; // Adding phone number to update
            existingUser.selectedBatch = selectedBatch;
            await existingUser.save();
        } else {
            // If user doesn't exist, create a new user
            const newUser = new userschema({ name, age, email, phoneNumber, selectedBatch });
            await newUser.save();
        }

        res.status(201).json({ message: "Data saved successfully" });
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log("Server Is Connected to Port " + PORT);
});
