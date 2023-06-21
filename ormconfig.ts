import { DataSource, DataSourceOptions } from "typeorm"
const dbConfig = {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "admin",
    password: "zobest",
    database: "projet-typescript",
    entities: [
        "src/entity/entity.ts"
    ],
    logging: false,
    synchronize: true,
    subscribers: [],
    migrations: []
    } as DataSourceOptions

    export const AppDataSource = new DataSource(dbConfig)