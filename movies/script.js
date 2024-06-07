document.addEventListener('DOMContentLoaded', () => {
    let movieList = [];

    const movieTable = document.getElementById('movie-list');

    function displayMovies(movies) {
        movieTable.innerHTML = '';
        movies.forEach(movie => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${movie.title}</td>
                <td>${movie.format}</td>
                <td>${movie.notes}</td>
            `;
            movieTable.appendChild(row);
        });
    }

    function sortMoviesByTitle(movies) {
        return movies.sort((a, b) => {
            const titleA = a.title.replace(/^The\s+/i, '');
            const titleB = b.title.replace(/^The\s+/i, '');
            return titleA.localeCompare(titleB);
        });
    }

    // Fetch movies from the JSON file
    fetch('movies.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            movieList = sortMoviesByTitle(data);
            displayMovies(movieList);
        })
        .catch(error => console.error('Error fetching movie data:', error));

    // Modal functionality
    const modal = document.getElementById("movie-modal");
    const addMovieButton = document.getElementById("add-movie-button");
    const closeModal = document.getElementsByClassName("close")[0];

    addMovieButton.onclick = function() {
        modal.style.display = "block";
    }

    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Add movie functionality
    document.getElementById('movie-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const newMovie = {
            title: document.getElementById('title').value,
            format: document.getElementById('format').value,
            notes: document.getElementById('notes').value
        };
        movieList.push(newMovie);
        movieList = sortMoviesByTitle(movieList);
        displayMovies(movieList);
        modal.style.display = "none";
    });
});
