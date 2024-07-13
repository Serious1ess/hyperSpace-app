HyperSpace 3-Tier Application

This repository contains a 3-tier application built using React, Node.js, Python, and PostgreSQL.

Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v14 or higher)
Python (v3.8 or higher)
PostgreSQL (v12 or higher)
Git
Installation
Clone the Repository


git clone https://github.com/Serious1ess/HyperSpace-3-tier-app.git
cd HyperSpace-3-tier-app


Setting Up the Backend (Python Service)

Navigate to the backend directory:
cd backend/python

Create a virtual environment and activate it:
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

Install dependencies:
pip install -r requirements.txt
Setting Up the PostgreSQL Database


Ensure PostgreSQL is installed and running. Connect to PostgreSQL using psql:
psql -U postgres
pip install pydantic

Create a new database and table:
CREATE DATABASE movies_db;
\c movies_db;

CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

Troubleshooting
If you encounter issues, ensure PostgreSQL service is running, and check credentials and database names.

add .env File

add the .env file in the backend directory with your PostgreSQL credentials:
DATABASE=movies_db
DATABASE_USERNAME=your_postgres_username
DATABASE_PASSWORD=your_postgres_password



Setting Up the Node.js Service

Navigate to the  node directory:
cd backend/node

Install dependencies:
npm install
npm install axios cors express



Starting the Node.js Service
node server.js



Setting Up the Frontend (React Client)

Navigate to the frontend directory:
cd ./frontend


Install dependencies:
npm install


Starting the React Client

npm start
Running the Services

Ensure all three services are running simultaneously in separate terminals:

Python Backend Service:
cd backend/python
source venv/bin/activate
python app.py


Node.js Service:
cd backend/node
node index.js

React Client:
cd frontend
npm start
API Documentation

Python Service Endpoints
GET /movies: Fetch all movies.
POST /movies: Add a new movie. Request body should contain name.
Node.js Service Endpoints
GET /movies: Fetch all movies from the Python service.
POST /movies: Add a new movie by forwarding the request to the Python service.
Environment Variables
Ensure environment variables are correctly set in .env files for each service as mentioned above.