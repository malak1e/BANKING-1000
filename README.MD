# BANKING-API-1000

## A RESTful API for a banking server that persists data in a database, _should_ handle 1000 concurrent requests per second WITHOUT getting race conditions, and includes automated tests using JEST.

## How to set up locally.

- Clone the repo.
- Run `npm install` to install dependencies.
- input environment variables for `MONGO_URI`, `PORT`
- enter `npm run dev` in the terminal to start up the development server.

## Technology

- This API is created using the Node JS language and Express JS framework.
- It uses MongoDB database.

### Users are able to:

- Create a basic account.
- Deposit money.
- Withdraw money.
- Transfer money between accounts.
- Get the current balance of an account.
- Get the complete, ordered transaction history of an account.

# NOTE

This project is for educational purposes only and is not intended to be used in a production environment. It does not include any security measures or authentication mechanisms, and data privacy is not guaranteed. I have other projects that include those security measures.
