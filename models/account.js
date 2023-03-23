const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const accountSchema = new Schema({
  balance: {
    type: Number,
    required: true,
    min: 0,
  },
  transactions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transaction",
    },
  ],
});

const Accounts = mongoose.model("accounts", accountSchema);
module.exports = Accounts;
