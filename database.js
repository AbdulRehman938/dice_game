import { Sequelize } from "sequelize";
const sequelize = new Sequelize("game1login", "root", "8naqn0h4AR", {
  host: "localhost",
  dialect: "mysql",
});

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
