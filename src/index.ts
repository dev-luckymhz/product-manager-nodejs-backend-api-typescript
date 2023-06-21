require("dotenv").config();
import { AppDataSource } from "../ormconfig"
import  express from "express";
import  cors  from "cors";
import { routes } from "./routes";
import cookieParser from "cookie-parser";

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
        const app = express();
        app.use(cookieParser());
        app.use(express.json());
        app.use(cors({
            credentials: true,
            origin: ["http://localhost:3000"]
            }));
        routes(app);
        app.listen(process.env.APP_PORT, ()=>{
        console.log("listening in port 8000");
        });
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })
