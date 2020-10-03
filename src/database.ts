import "reflect-metadata";
import { createConnection } from "typeorm";
import Contact from "./entity/Contact";
import Transaction from "./entity/Transaction";

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
})
  .then(async (connection) => {
    console.log("Inserting a new user into the database...");
    const contact = new Contact();
    contact.firstName = "George";
    contact.lastName = "Ungureanu";
    contact.phone = "0756503015";
    contact.email = "gung@yahoo.com";
    await connection.manager.save(contact);
    console.log("Saved a new user with id: " + contact.id);

    console.log("Inserting a new transaction into the database...");
    const transaction1 = new Transaction();
    transaction1.contact = contact;
    transaction1.date = new Date();
    transaction1.sum = 50.01;
    transaction1.type = "loan";
    await connection.manager.save(transaction1);
    console.log("Saved a new user with id: " + contact.id);
  })
  .catch(console.error);
