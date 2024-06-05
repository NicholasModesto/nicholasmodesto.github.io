document.addEventListener('DOMContentLoaded', function () {
    const movieList = document.getElementById('movie-list');
    const movieForm = document.getElementById('movie-form');
    let moviesData = [];

    function fetchMovies() {
        fetch('movies.json')
            .then(response => response.json())
            .then(data => {
                moviesData = data.movies;
                renderMovies();
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
                <td>${movie.year}</td>
                <td>${movie.format}</td>
            `;
            movieList.appendChild(movieRow);
        });
    }

    function addMovie(event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const year = document.getElementById('year').value;
        const format = document.getElementById('format').value;

        const newMovie = { title, year, format };
        moviesData.push(newMovie);

        updateMoviesJson();
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
                renderMovies();
            } else {
                alert('Failed to update movies.json');
            }
        });
    }

    function sortTable(property) {
        renderMovies(property);
    }

    movieForm.addEventListener('submit', addMovie);
    fetchMovies();
});
