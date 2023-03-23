const Account = require("../models/account");

const postAccount = async (req, res) => {
  const session = await Account.startSession();
  session.startTransaction();

  try {
    const balance = req.body.balance;
    if (!balance || balance < 0) {
      throw new Error("Invalid balance");
    }
    const account = await Account.create(
      {
        balance: req.body.balance,
        transactions: [],
      },
      { session }
    );

    await session.commitTransaction();

    res.json({
      message: "Account created successfully",
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.json({ Error: err.message });
  } finally {
    await session.endSession();
  }
};

module.exports = postAccount;
