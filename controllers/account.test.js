const Accounts = require("../models/account");
const postAccount = require("../controllers/account");

describe("postAccount", () => {
  it("should create an account with valid balance", async () => {
    const req = {
      body: {
        balance: 100,
      },
    };

    const res = {
      json: jest
        .fn()
        .mockReturnValue({ message: "Account created successfully" }),
    };

    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    // Mock the Account model and return a promise that resolves with a new account
    Accounts.create = jest.fn().mockReturnValue(
      Promise.resolve({
        _id: "12345",
        balance: req.body.balance,
        transactions: [],
      })
    );

    // Mock the startSession method and return the mockSession object
    Accounts.startSession = jest.fn().mockReturnValue(mockSession);

    await postAccount(req, res);

    expect(Accounts.create).toHaveBeenCalledWith(
      {
        balance: req.body.balance,
        transactions: [],
      },
      { session: mockSession }
    );

    expect(res.json.mock.calls[0][0]).toEqual({
      message: "Account created successfully",
    });
    expect(mockSession.startTransaction).toHaveBeenCalled();
    expect(mockSession.commitTransaction).toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    expect(mockSession.abortTransaction).not.toHaveBeenCalled();
  });

  it("should return an error with invalid balance", async () => {
    const req = {
      body: {
        balance: -100,
      },
    };
    const res = {
      json: jest
        .fn()
        .mockReturnValue({ message: "Account created successfully" }),
    };

    const mockSession = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
      endSession: jest.fn(),
    };

    Accounts.create = jest.fn();
    Accounts.startSession = jest.fn().mockReturnValue(mockSession);

    await postAccount(req, res);

    expect(Accounts.create).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ Error: "Invalid balance" });
    expect(mockSession.startTransaction).toHaveBeenCalled();
    expect(mockSession.commitTransaction).not.toHaveBeenCalled();
    expect(mockSession.endSession).toHaveBeenCalled();
    expect(mockSession.abortTransaction).toHaveBeenCalled();
  });
});
