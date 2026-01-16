# prod_rec-backend

A Node.js backend server for product recommendations using Express, MongoDB, and JWT authentication.

## Installation

1. Clone the repository
2. Run `npm install` to install dependencies
3. Copy `.env.example` to `.env` and configure your environment variables
4. Ensure MongoDB is running locally or update `MONGO_URI` to your MongoDB instance
5. Run `npm start` to start the server

## Usage

The server will start on the port specified in `.env` (default: 3000).

### Endpoints

- `GET /` : Returns a welcome message

## Dependencies

- express: Web framework
- mongodb: Database driver
- jsonwebtoken: JWT handling
- cors: Cross-origin resource sharing
- cookie-parser: Cookie parsing
- dotenv: Environment variable management

## Scripts

- `npm start`: Start the server
- `npm test`: Run tests (currently not implemented)