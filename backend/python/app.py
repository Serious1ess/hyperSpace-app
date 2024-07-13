from flask import Flask, request, jsonify
import psycopg2
import logging
from dotenv import load_dotenv
import os
from pydantic import BaseModel, ValidationError

app = Flask(__name__)

logging.basicConfig(level=logging.DEBUG)  # Configure logging to debug level

# Load environment variables from .env file
load_dotenv()

class Movie(BaseModel):
    id: int
    name: str

class NewMovie(BaseModel):
    name: str

def get_db_connection():
    try:
        # Establish database connection using environment variables
        conn = psycopg2.connect(
            host="localhost",
            database=os.getenv('DATABASE'),
            user=os.getenv('DATABASE_USERNAME'),
            password=os.getenv('DATABASE_PASSWORD')
        )
        return conn
    except Exception as e:
        app.logger.error(f"Error connecting to database: {e}")
        return None

@app.route('/movies', methods=['GET'])
def get_movies():
    conn = get_db_connection()
    if conn is None:
        return "Database connection failed", 500  # Return error if database connection fails
    try:
        cur = conn.cursor()
        cur.execute('SELECT id, name FROM movies ORDER BY id;')
        movies = cur.fetchall()  # Fetch all movies from the database
        cur.close()
        conn.close()
        return jsonify([Movie(id=movie[0], name=movie[1]).dict() for movie in movies])  # Return movies as JSON
    except Exception as e:
        app.logger.error(f"Error fetching movies: {e}")
        return "Error fetching movies", 500  # Return error if fetching movies fails

@app.route('/movies', methods=['POST'])
def add_movie():
    try:
        new_movie_data = request.json
        new_movie = NewMovie(**new_movie_data)  # Validate the incoming movie data using Pydantic
    except ValidationError as e:
        return jsonify(e.errors()), 400  # Return validation errors if data is invalid

    conn = get_db_connection()
    if conn is None:
        return "Database connection failed", 500  # Return error if database connection fails
    try:
        cur = conn.cursor()
        cur.execute('INSERT INTO movies (name) VALUES (%s) RETURNING id;', (new_movie.name,))
        movie_id = cur.fetchone()[0]
        conn.commit()  # Commit the transaction
        cur.close()
        conn.close()
        return jsonify(Movie(id=movie_id, name=new_movie.name).dict()), 201  # Return the created movie
    except Exception as e:
        app.logger.error(f"Error adding movie: {e}")
        return "Error adding movie", 500  # Return error if adding movie fails

@app.route('/movies', methods=['PUT'])
def update_movie():
    movie_id = request.args.get('id')  # Get movie ID from query parameters
    try:
        updated_movie_data = request.json
        updated_movie = NewMovie(**updated_movie_data)  # Validate the incoming movie data using Pydantic
    except ValidationError as e:
        return jsonify(e.errors()), 400  # Return validation errors if data is invalid

    if not movie_id:
        return "Movie ID is required", 400  # Return error if movie ID is missing

    conn = get_db_connection()
    if conn is None:
        return "Database connection failed", 500  # Return error if database connection fails
    try:
        cur = conn.cursor()
        cur.execute('UPDATE movies SET name = %s WHERE id = %s', (updated_movie.name, movie_id))
        conn.commit()  # Commit the transaction
        cur.close()
        conn.close()
        return '', 204  # Return status code 204 (No Content) on successful update
    except Exception as e:
        app.logger.error(f"Error updating movie: {e}")
        return "Error updating movie", 500  # Return error if updating movie fails

if __name__ == '__main__':
    app.run(port=8000)  # Start the Flask application on port 8000 if executed directly
