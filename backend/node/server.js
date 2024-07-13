const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// GET endpoint to fetch movies from another service
app.get('/movies', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:8000/movies');
        res.json(response.data); // Respond with the data fetched from the other service
    } catch (error) {
        console.error('Error fetching movies:', error);
        res.status(500).send('Error fetching movies'); // Handle errors with status 500
    }
});

// POST endpoint to add a new movie through another service
app.post('/movies', async (req, res) => {
    try {
        const response = await axios.post('http://localhost:8000/movies', req.body);
        res.status(201).send(); // Respond with status 201 (Created) upon successful addition
    } catch (error) {
        console.error('Error adding movie:', error);
        res.status(500).send('Error adding movie'); // Handle errors with status 500
    }
});

// PUT endpoint to update a movie by ID through another service
app.put('/movies', async (req, res) => {
    try {
        const { id } = req.query;
        const response = await axios.put(`http://localhost:8000/movies?id=${id}`, req.body);
        res.status(204).send(); // Respond with status 204 (No Content) upon successful update
    } catch (error) {
        console.error('Error updating movie:', error);
        res.status(500).send('Error updating movie'); // Handle errors with status 500
    }
});

// Start the Express server
app.listen(port, () => {
    console.log(`Node.js service listening at http://localhost:${port}`);
});
