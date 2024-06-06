document.addEventListener('DOMContentLoaded', function() {
    const moviesTable = document.getElementById('movie-table');
    const moviesList = document.getElementById('movie-list');
    const addMovieButton = document.getElementById('add-movie-button');
    const modal = document.getElementById('movie-modal');
    const closeModalButton = document.querySelector('.close');
    const movieForm = document.getElementById('movie-form');

    let movies = [];

    function loadMovies() {
        fetch('movies.json')
            .then(response => response.json())
            .then(data => {
                movies = data;
                displayMovies();
            })
            .catch(error => console.error('Error loading movies:', error));
    }

    function displayMovies() {
        moviesList.innerHTML = '';

        // Sort movies by title by default
        movies.sort((a, b) => {
            let titleA = a.title.replace(/^The\s+/i, '').toLowerCase();
            let titleB = b.title.replace(/^The\s+/i, '').toLowerCase();
            return titleA.localeCompare(titleB);
        });

        movies.forEach((movie, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${movie.title}</td>
                <td>${movie.year}</td>
                <td>${movie.format}</td>
            `;
            moviesList.appendChild(row);
        });
    }

    function sortTable(column) {
        const sortOrder = moviesTable.dataset.sortOrder === 'asc' ? 'desc' : 'asc';
        moviesTable.dataset.sortOrder = sortOrder;

        movies.sort((a, b) => {
            let valueA = a[column];
            let valueB = b[column];

            if (column === 'title') {
                valueA = valueA.replace(/^The\s+/i, '').toLowerCase();
                valueB = valueB.replace(/^The\s+/i, '').toLowerCase();
            }

            if (sortOrder === 'asc') {
                return valueA.localeCompare(valueB);
            } else {
                return valueB.localeCompare(valueA);
            }
        });

        displayMovies();
    }

    addMovieButton.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    closeModalButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    movieForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const newMovie = {
            title: event.target.title.value,
            year: event.target.year.value,
            format: event.target.format.value
        };

        movies.push(newMovie);
        displayMovies();
        modal.style.display = 'none';

        // Update the movies.json file (only feasible in a server-side environment)
        // This part is illustrative since we can't write to a file in GitHub Pages
        // fetch('path/to/update/movies.json', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(movies)
        // }).catch(error => console.error('Error updating movies:', error));
    });

    // Add event listeners for sorting
    const headers = moviesTable.querySelectorAll('th');
    headers.forEach(header => {
        const column = header.textContent.toLowerCase();
        header.addEventListener('click', () => sortTable(column));
    });

    loadMovies();
});
