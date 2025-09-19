import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import compression from "compression";
import expressStatusMonitor from "express-status-monitor";
import { routes } from "./routes";

const app = express();

// Core middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("src/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Monitoring
app.use(expressStatusMonitor());

// CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Compression
app.use(compression());

// Routes
routes(app);

export default app;
