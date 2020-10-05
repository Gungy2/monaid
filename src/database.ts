import "reflect-metadata";
import { createConnection } from "typeorm";
import Contact from "./entity/Contact";
import Transaction from "./entity/Transaction";

export const openDatabase = () =>
  createConnection({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: true,
    entities: [Contact, Transaction],
    cli: {
      entitiesDir: "entity",
      migrationsDir: "migration",
      subscribersDir: "subscriber",
    },
  });
