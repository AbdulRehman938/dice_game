import { Sequelize } from "sequelize";
// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize("game1login", "root", "8naqn0h4", {
  host: "localhost",
  dialect: "mysql",
});

try {
  await sequelize.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
