import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './style.css';

// Set the app element for accessibility in modals
Modal.setAppElement('#root');

function App() {
  // State variables
  const [movies, setMovies] = useState([]);         // Array to store movies
  const [newMovie, setNewMovie] = useState('');     // State for new movie input
  const [modalIsOpen, setModalIsOpen] = useState(false);  // State to control modal open/close
  const [selectedMovie, setSelectedMovie] = useState(null);  // State to track selected movie for edit
  const [updatedName, setUpdatedName] = useState('');  // State for updated movie name input

  // Function to open the modal
  const openModal = () => {
    setModalIsOpen(true);   // Set modal state to open
    fetchMovies();          // Fetch movies when modal opens
  };

  // Function to close the modal and reset states
  const closeModal = () => {
    setModalIsOpen(false);  // Set modal state to close
    setSelectedMovie(null); // Reset selected movie state
    setUpdatedName('');     // Reset updated movie name state
  };

  // Function to fetch movies from the server
  const fetchMovies = async () => {
    try {
      const response = await axios.get('http://localhost:3000/movies');
      setMovies(response.data); // Update movies state with fetched data
    } catch (error) {
      console.error('Error fetching movies:', error); // Log error if fetching fails
    }
  };

  // Function to add a new movie
  const addMovie = async () => {
    try {
      await axios.post('http://localhost:3000/movies', { name: newMovie });
      fetchMovies();        // Refresh movies list after adding a movie
      setNewMovie('');      // Clear new movie input field
    } catch (error) {
      console.error('Error adding movie:', error); // Log error if adding movie fails
    }
  };

  // Function to update a selected movie
  const updateMovie = async () => {
    if (selectedMovie) {   // Check if a movie is selected for update
      try {
        await axios.put(`http://localhost:3000/movies?id=${selectedMovie.id}`, { name: updatedName });
        fetchMovies();        // Refresh movies list after updating
        setSelectedMovie(null); // Reset selected movie state
        setUpdatedName('');    // Clear updated movie name input
      } catch (error) {
        console.error('Error updating movie:', error); // Log error if updating fails
      }
    }
  };

  // Function to handle selection of a movie for update
  const handleMovieSelection = (movie) => {
    setSelectedMovie(movie);   // Set the selected movie for update
    setUpdatedName(movie.name);  // Set the updated name input to current movie name
  };

  // Render the component
  return (
    <div className="App">
      {/* Button to open the modal */}
      <button className="open-modal-button" onClick={openModal}>Show Movies</button>

      {/* Modal component */}
      <Modal
        isOpen={modalIsOpen}   // Modal open state
        onRequestClose={closeModal}  // Function to handle modal close
        contentLabel="Movies Modal"  // Accessible label for screen readers
        className="Modal"     // Class name for modal content
        overlayClassName="Overlay"   // Class name for modal overlay
      >
        {/* Modal header */}
        <h2>Movies</h2>
        <p>Select any item for update.</p>

        {/* Container for modal content */}
        <div className='modal-container'>
          {/* List of movies */}
          <ol>
            {/* Map through movies and render each as a list item */}
            {movies.map((movie, index) => (
              <li key={index} onClick={() => handleMovieSelection(movie)} style={{ cursor: 'pointer' }}>
                {movie.name}   {/* Display movie name */}
              </li>
            ))}
          </ol>

          {/* Input field for adding new movie */}
          <input
            type="text"
            value={newMovie}
            onChange={(e) => setNewMovie(e.target.value)}
            placeholder="Add new movie"
          />
          {/* Button to add new movie */}
          <button onClick={addMovie}>Add Movie</button>

          {/* Section for updating selected movie */}
          {selectedMovie && (
            <div>
              <h3>Edit Movie</h3>
              {/* Input field for updating movie name */}
              <input
                type="text"
                value={updatedName}
                onChange={(e) => setUpdatedName(e.target.value)}
                placeholder="Update movie name"
              />
              {/* Button to update movie */}
              <button onClick={updateMovie}>Update Movie</button>
            </div>
          )}

          {/* Button to close the modal */}
          <button className='closeModal-btn' onClick={closeModal}>Close</button>
        </div>
      </Modal>
    </div>
  );
}

export default App;
