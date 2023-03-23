const express = require(`express`);
const mongoose = require(`mongoose`);
const dotenv = require("dotenv");
const app = express();

mongoose.set("strictQuery", false);
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const postAccount = require("./controllers/account");
const {
  deposit,
  withdraw,
  transferMoney,
  getTransactionHistory,
  getBalance,
} = require("./controllers/transactions");

app.post("/api/account", postAccount);
app.post("/api/account/:id/deposit", deposit);
app.post("/api/account/:id/withdraw", withdraw);
app.post("/api/account/:toId/:fromId/transaction", transferMoney);
app.get("/api/account/transactions/:id", getTransactionHistory);
app.get("/api/account/balance/:id", getBalance);
// Connection
const port = process.env.PORT || 8080;
const start = async () => {
  await mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to the DB");
    })
    .catch((err) => {
      console.log(err);
    });

  app.listen(port, () => console.log(`Server is listening on port ${port}...`));
};
start();

module.exports = app;
