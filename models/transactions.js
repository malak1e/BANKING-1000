const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
