const Accounts = require("../models/account");
const Transaction = require("../models/transactions");

const deposit = async (req, res) => {
  const session = await Accounts.startSession();
  session.startTransaction();
  try {
    const amount = req.body.amount;
    if (!amount || amount < 0) {
      return res.json({ Error: "Invalid amount" });
    }
    const account = await Accounts.findById(req.params.id).session(session);
    if (!account) {
      return res.json({ Error: "Account not found" });
    }
    const transaction = await Transaction.create({
      amount,
    });

    account.transactions.push(transaction._id);
    account.balance += amount;
    await account.save();
    await session.commitTransaction();

    res.json({
      "new balance": account.balance,
      "amount deposited": amount,
      account,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.json({ Error: err.message });
  } finally {
    session.endSession();
  }
};

const withdraw = async (req, res) => {
  const session = await Accounts.startSession();
  session.startTransaction();
  try {
    const amount = req.body.amount;
    if (!amount || amount < 0) {
      throw new Error("Invalid amount");
    }
    const account = await Accounts.findById(req.params.id).session(session);
    if (!account) {
      throw new Error("Account not found");
    }
    if (account.balance < amount) {
      throw new Error("Insufficient funds");
    }
    const transaction = await Transaction.create({
      amount,
    });
    account.transactions.push(transaction._id);
    account.balance -= amount;
    await account.save();
    await session.commitTransaction();
    await session.endSession();

    res.json({
      "new balance": account.balance,
      "amount withdrawn": amount,
      account,
    });
  } catch (err) {
    session.endSession();
    res.json({ Error: err.message });
  }
};

const transferMoney = async (req, res) => {
  const { toId, fromId } = req.params;
  const amount = req.body.amount;
  const session = await Accounts.startSession();
  session.startTransaction();
  try {
    //gasirea conturilor
    const toAccount = await Accounts.findById(toId).session(session);
    const fromAccount = await Accounts.findById(fromId).session(session);
    //daca nu exista contul
    if (!toAccount || !fromAccount) {
      throw new Error("Account not found.");
    }
    //daca, cantitatea trimisa e mai mare decat cantitatea contului
    if (amount > fromAccount.balance) {
      throw new Error("Insufficient funds! Transaction was aborted.");
    }

    const newFromBalance = fromAccount.balance - amount;
    const newToBalance = toAccount.balance + amount;

    await Accounts.findByIdAndUpdate(
      toAccount,
      {
        $inc: { balance: +amount },
      },
      { session }
    );
    await Accounts.findByIdAndUpdate(
      fromAccount,
      {
        $inc: { balance: -amount },
      },
      { session }
    );

    const transaction = await Transaction.create({
      from: fromAccount,
      to: toAccount,
      amount,
    });

    fromAccount.transactions.push(transaction._id);
    toAccount.transactions.push(transaction._id);
    await fromAccount.save();
    await toAccount.save();

    await session.commitTransaction();
    await session.endSession();

    res.json({
      ok: true,
      message: "Transaction was successful.",
      newFromBalance: newFromBalance,
      newToBalance: newToBalance,
    });
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    res.json({ Error: err.message });
  }
};

const getBalance = async (req, res) => {
  const session = await Accounts.startSession();
  session.startTransaction();
  try {
    const account = await Accounts.findById(req.params.id).session(session);
    if (!account) {
      throw new Error("No account found.");
    }
    await session.commitTransaction();
    await session.endSession();
    return res.json({ balance: account.balance });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    res.json({ Error: error.message });
  }
};

const getTransactionHistory = async (req, res) => {
  const session = await Accounts.startSession();
  session.startTransaction();
  try {
    const account = await Accounts.findById(req.params.id).session(session);
    if (!account) {
      throw new Error("No account found.");
    }
    await session.commitTransaction();
    await session.endSession();
    return res.json({ transactionHistory: account.transactions });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    return res.json({ Error: error.message });
  }
};

module.exports = {
  deposit,
  withdraw,
  transferMoney,
  getBalance,
  getTransactionHistory,
};
