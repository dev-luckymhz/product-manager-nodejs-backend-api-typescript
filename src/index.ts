require("dotenv").config();

import { AppDataSource } from "../ormconfig";
import express from "express";
import cors from "cors";
import { routes } from "./routes";
import cookieParser from "cookie-parser";

// Initialize the data source
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");

        const app = express(); // Create an instance of the Express application
        app.use(cookieParser()); // Parse cookies in incoming requests
        app.use(express.json()); // Parse JSON bodies in incoming requests

        app.use(
            cors({
                credentials: true,
                origin: ["http://localhost:3000"]
            })
        ); // Enable CORS with specific configuration

        routes(app); // Register routes with the Express application

        app.listen(process.env.APP_PORT, () => {
            console.log("Listening on port", process.env.APP_PORT);
        }); // Start the server and listen on the specified port
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });
