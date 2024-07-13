import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

try:
    conn = psycopg2.connect(
        host="localhost",
        database=os.getenv('DATABASE'),
        user=os.getenv('DATABASE_USERNAME'),
        password=os.getenv('DATABASE_PASSWORD')
    )
    print("Connection successful")
    conn.close()
except Exception as e:
    print(f"Error connecting to database: {e}")
