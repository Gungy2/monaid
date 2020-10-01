import { Sequelize, DataTypes, Model, Optional } from "sequelize";
import { ContactAttributes } from "./types";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

interface ContactCreationAttributes extends Optional<ContactAttributes, "id"> {}

interface ContactInstance
  extends Model<ContactAttributes, ContactCreationAttributes>,
    ContactAttributes {}

export const ContactModel = sequelize.define<ContactInstance>(
  "Contact",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
  },
  { freezeTableName: true }
);

(async () => {
  ContactModel.sync();
})();
