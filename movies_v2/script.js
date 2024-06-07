document.addEventListener('DOMContentLoaded', () => {
    const addMovieBtn = document.getElementById('addMovieBtn');
    const addMovieModal = document.getElementById('addMovieModal');
    const closeModal = document.querySelector('.close');
    const addMovieForm = document.getElementById('addMovieForm');
    const movieTableBody = document.querySelector('#movieTable tbody');
    const repoOwner = 'YOUR_GITHUB_USERNAME';
    const repoName = 'YOUR_REPOSITORY_NAME';
    const filePath = 'movies.json';
    const githubToken = 'YOUR_PERSONAL_ACCESS_TOKEN';  // Store this securely in a real application
    const apiBaseUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    addMovieBtn.onclick = () => {
        addMovieModal.style.display = 'block';
    };

    closeModal.onclick = () => {
        addMovieModal.style.display = 'none';
    };

    window.onclick = (event) => {
        if (event.target == addMovieModal) {
            addMovieModal.style.display = 'none';
        }
    };

    addMovieForm.onsubmit = (event) => {
        event.preventDefault();
        const newMovie = {
            title: addMovieForm.title.value.trim(),
            format: addMovieForm.format.value,
            notes: addMovieForm.notes.value.trim()
        };

        fetchMovies().then(movies => {
            movies.push(newMovie);
            movies.sort((a, b) => a.title.replace(/^The\s/i, '').localeCompare(b.title.replace(/^The\s/i, '')));
            updateMoviesJson(movies);
        });
    };

    function fetchMovies() {
        return fetch(apiBaseUrl, {
            headers: {
                Authorization: `token ${githubToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const movies = JSON.parse(atob(data.content));
            return movies;
        });
    }

    function updateMoviesJson(movies) {
        fetch(apiBaseUrl, {
            headers: {
                Authorization: `token ${githubToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            const updatedContent = btoa(JSON.stringify(movies, null, 2));
            const payload = {
                message: 'Update movies.json',
                content: updatedContent,
                sha: data.sha
            };

            return fetch(apiBaseUrl, {
                method: 'PUT',
                headers: {
                    Authorization: `token ${githubToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        })
        .then(response => response.json())
        .then(() => {
            renderMovies(movies);
            addMovieModal.style.display = 'none';
            addMovieForm.reset();
        });
    }

    function renderMovies(movies) {
        movieTableBody.innerHTML = '';
        movies.forEach((movie, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${movie.title}</td>
                <td>${movie.format}</td>
                <td>${movie.notes}</td>
                <td>
                    <button onclick="editMovie(${index})">Edit</button>
                    <button onclick="deleteMovie(${index})">Delete</button>
                </td>
            `;
            movieTableBody.appendChild(row);
        });
    }

    fetchMovies().then(movies => {
        movies.sort((a, b) => a.title.replace(/^The\s/i, '').localeCompare(b.title.replace(/^The\s/i, '')));
        renderMovies(movies);
    });
});

function editMovie(index) {
    // Implement edit functionality
}

function deleteMovie(index) {
    // Implement delete functionality
}
