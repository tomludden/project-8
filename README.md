# Art Gallery API

A RESTful API for managing a digital art gallery with **artists, paintings**, and **user authentication**. Built using **Node.js, Express, MongoDB, dotenv, bcrypt**, and **JWT-based auth**, with role-based access control.

---

## Features

- Register & login users (default role: `user`)
- CRUD operations for **Artists** and their linked **Paintings**
- Protected routes (admin-only for sensitive ops)
- Verified/unverified paintings (admin can verify)
- Seeding scripts to populate the DB
- Passwords hashed using **bcrypt**
- Auth via **JWT tokens**

---

## Project Structure

**/src**\
**-/api**\
--/controllers -- # Business logic\
--/models -- # Mongoose schemas\
--/routes -- # Route declarations\
**-/config**\
-- db.js -- # Database config\
-- jwt.js -- # JWT signing/verification\
**-/middlewares**\
-- auth.js -- # Auth middleware\
-- file.js -- # Multer (cloudinary) file upload middleware\
**-/utils**\
--/seeds -- # Seed scripts\
**/data** -- # JSON seed data\
**index.js** -- # App entry point

---

## Setup Instructions

### 1. Clone and install

git clone https://github.com/tomludden/project-8.git \
cd project-8\
npm install

### 2. Environment Setup

Create a .env file:

PORT=3000\
DB_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/gallery\
JWT_SECRET=your_secret_key

---

## Start the Server

npm run dev (Runs on: http://localhost:3000)

---

## API Documentation

### Auth

POST /api/V1/users/register -- Register new user (role: user by default)\
POST /api/V1/users/login -- Login, returns JWT token

Use the token in header:\
Authorization: Bearer <token>

### Users (Admin Only)

###### Method -- Route -- Description

GET /api/v1/users -- List all users\
GET /api/v1/users/:id -- Get user by ID\
PUT /api/v1/users/:id -- Update user role\
DELETE /api/v1/users/:id -- Delete a user (admin can delete any user and a users can delete themselves if authenticated)

### Artists

###### Method -- Route -- Access -- Description

GET /api/v1/artists -- Public -- Get all artists\
GET /api/v1/artists/:id -- Public -- Get a single artist\
POST /api/v1/artists -- Admin Only -- Create new artist\
PUT /api/v1/artists/:id -- Admin Only -- Update an artist\
DELETE /api/v1/artists/:id -- Admin Only -- Delete an artist

### Paintings

###### Method -- Route -- Access -- Description

GET /api/v1/paintings -- Public -- Get all verified paintings\
GET /api/v1/paintings/:id -- Public -- Get one painting\
GET /api/v1/paintings/unverified -- Admin Only -- Get all unverified paintings\
POST /api/v1/paintings -- Auth -- Submit new painting (auto-verifies if admin)\
PUT /api/v1/paintings/:id -- Admin Only -- Update a painting\
DELETE /api/v1/paintings/:id -- Admin Only -- Delete a painting

---

## Seed the Database

You can seed mock data using:

./src/utils/seeds/artistSeed.js\
./src/utils/seeds/paintingSeed.js\
./src/utils/seeds/userSeed.js

###### Note: One admin user is preserved during user seeding (\_id: 68161176f57313443ce20393)

---

## Role-Based Access Control

### Role Abilities

**user** -- View paintings, create paintings, delete themselves\
**admin** -- Full control over all resources

###### Middleware: isAuth, isAdmin

---

## Example Request

Create a Painting

POST /api/v1/paintings
Authorization: Bearer <your_token>
Content-Type: application/json

{
"painting": "Starry Night", \
"img": "https://link.to/image.jpg", \
"year": 1889, \
"category": ["Post-Impressionism"], \
"artist": "66112233abcde01234567890"
}

---
