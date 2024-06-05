document.addEventListener('DOMContentLoaded', function () {
    const movieList = document.getElementById('movie-list');
    const movieForm = document.getElementById('movie-form');
    
    function fetchMovies() {
        fetch('movies.json')
            .then(response => response.json())
            .then(data => {
                movieList.innerHTML = '';
                data.movies.forEach(movie => {
                    const movieDiv = document.createElement('div');
                    movieDiv.className = 'movie';
                    movieDiv.innerHTML = `
                        <h2>${movie.title}</h2>
                        <p>${movie.year}</p>
                        <p>${movie.format}</p>
                    `;
                    movieList.appendChild(movieDiv);
                });
            });
    }

    function addMovie(event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const year = document.getElementById('year').value;
        const poster = document.getElementById('format').value;

        fetch('movies.json')
            .then(response => response.json())
            .then(data => {
                const newMovie = { title, year, format };
                data.movies.push(newMovie);
                
                updateMoviesJson(data.movies);
            });
    }

    function updateMoviesJson(movies) {
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
            const content = btoa(JSON.stringify({ movies }));

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
                fetchMovies();
            } else {
                alert('Failed to update movies.json');
            }
        });
    }

    movieForm.addEventListener('submit', addMovie);
    fetchMovies();
});
