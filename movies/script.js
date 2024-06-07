document.addEventListener('DOMContentLoaded', function () {
    const movieList = document.getElementById('movie-list');
    const movieForm = document.getElementById('movie-form');
    const addMovieButton = document.getElementById('add-movie-button');
    const movieModal = document.getElementById('movie-modal');
    const closeModal = document.getElementsByClassName('close')[0];
    let moviesData = [];

    function fetchMovies() {
        fetch('movies.json')
            .then(response => response.json())
            .then(data => {
                moviesData = data.movies;
                renderMovies('title');
            });
    }

    function renderMovies(sortBy = null) {
        movieList.innerHTML = '';

        if (sortBy) {
            moviesData.sort((a, b) => {
                let aValue = a[sortBy];
                let bValue = b[sortBy];

                if (sortBy === 'title') {
                    aValue = aValue.replace(/^The\s+/i, '');
                    bValue = bValue.replace(/^The\s+/i, '');
                }

                if (aValue < bValue) return -1;
                if (aValue > bValue) return 1;
                return 0;
            });
        }

        moviesData.forEach(movie => {
            const movieRow = document.createElement('tr');
            movieRow.innerHTML = `
                <td>${movie.title}</td>
                <td>${movie.format}</td>
                <td>${movie.notes}</td>
            `;
            movieList.appendChild(movieRow);
        });
    }

    function addMovie(event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const notes = document.getElementById('notes').value;
        const format = document.getElementById('format').value;

        const newMovie = { title, format, notes };
        moviesData.push(newMovie);

        updateMoviesJson();
        closeModalWindow();
    }

    function updateMoviesJson() {
        const githubUsername = 'your-username';
        const repoName = 'movie-collection';
        const branch = 'main';
        const token = 'your-personal-access-token';

        fetch(`https://api.github.com/repos/${githubUsername}/${repoName}/contents/movies.json`, {
            headers: {
                Authorization: `token ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const sha = data.sha;
            const content = btoa(JSON.stringify({ movies: moviesData }));

            const updateContent = {
                message: 'Update movies.json',
                content: content,
                sha: sha,
                branch: branch
            };

            return fetch(`https://api.github.com/repos/${githubUsername}/${repoName}/contents/movies.json`, {
                method: 'PUT',
                headers: {
                    Authorization: `token ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updateContent)
            });
        })
        .then(response => {
            if (response.ok) {
                renderMovies('title');
            } else {
                alert('Failed to update movies.json');
            }
        });
    }

    function sortTable(property) {
        renderMovies(property);
    }

    function openModal() {
        movieModal.style.display = "block";
    }

    function closeModalWindow() {
        movieModal.style.display = "none";
    }

    addMovieButton.addEventListener('click', openModal);
    closeModal.addEventListener('click', closeModalWindow);
    window.addEventListener('click', function(event) {
        if (event.target == movieModal) {
            closeModalWindow();
        }
    });

    movieForm.addEventListener('submit', addMovie);
    fetchMovies();
    /* change */
});