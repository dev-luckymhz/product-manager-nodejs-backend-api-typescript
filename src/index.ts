require("dotenv").config();

import app from "./app";
import { AppDataSource } from "../ormconfig";

const PORT = process.env.APP_PORT || 4000;

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Data Source has been initialized!");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error during Data Source initialization", err);
  });
