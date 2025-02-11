# Authentication and Chat API

## Overview
This project provides an Express.js-based authentication system with user registration, login, logout, and a chat messaging system. It uses bcrypt.js for password hashing, JSON Web Tokens (JWT) for authentication, and MongoDB as the database.

## Features
- User registration with password encryption
- User login with JWT authentication
- Logout functionality using cookies
- Chat functionality between users

## Tech Stack
- Node.js
- Express.js
- MongoDB (Mongoose ORM)
- bcrypt.js (for password hashing)
- JSON Web Token (JWT)
- cookie-parser (for handling cookies)

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/your-repo.git
   ```
2. Navigate to the project directory:
   ```sh
   cd your-repo
   ```
3. Install dependencies:
   ```sh
   npm install
   ```

## Usage
### Start the Server
```sh
npm start
```

### API Endpoints and Their Roles
#### Authentication Routes
- **POST /v1/signup** - Registers a new user with encrypted credentials.
- **POST /v1/signIn** - Authenticates a user and issues a JWT token.
- **POST /v1/logout** - Logs out a user by clearing authentication cookies.

#### Chat Routes
- **GET /v1/requestAllChats/:user2** - Retrieves all chat messages between the authenticated user and another user.

## Environment Variables
Create a `.env` file in the root directory and add the following:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

