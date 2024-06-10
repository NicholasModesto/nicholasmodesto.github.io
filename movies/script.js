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

    // // Fetch movies from the JSON file
    // fetch('movies.json')
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return response.json();
    //     })
    //     .then(data => {
    //         movieList = sortMoviesByTitle(data);
    //         displayMovies(movieList);
    //     })
    //     .catch(error => console.error('Error fetching movie data:', error));

    // // Modal functionality
    // const modal = document.getElementById("movie-modal");
    // const addMovieButton = document.getElementById("add-movie-button");
    // const closeModal = document.getElementsByClassName("close")[0];

    // addMovieButton.onclick = function() {
    //     modal.style.display = "block";
    // }

    // closeModal.onclick = function() {
    //     modal.style.display = "none";
    // }

    // window.onclick = function(event) {
    //     if (event.target == modal) {
    //         modal.style.display = "none";
    //     }
    // }

    // // Add movie functionality
    // document.getElementById('movie-form').addEventListener('submit', function(e) {
    //     e.preventDefault();
    //     const newMovie = {
    //         title: document.getElementById('title').value,
    //         format: document.getElementById('format').value,
    //         notes: document.getElementById('notes').value
    //     };
    //     movieList.push(newMovie);
    //     movieList = sortMoviesByTitle(movieList);
    //     displayMovies(movieList);
    //     modal.style.display = "none";
    // });

    //Fetch Google Sheets Data
    function fetchGoogleSheetData() {
        const apiKey = 'AIzaSyD0NTvju2gQOz-RlnmQdoR00cSvP-iRnw4'; // Replace with your actual API Key
        const spreadsheetId = '1dlPnmIyduK_qcAziuLkWEfEoTCUAu3aK';
        const range = 'Sheet1!A:C'; // Adjust range as needed

        const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const data = await response.json();
            const values = data.values;

            if (!values || values.length === 0) {
                console.log('No data found.');
                return;
            }

            const movies = [];
            // Assuming the first row is headers and data starts from the second row
            for (let i = 1; i < values.length; i++) {
                const row = values[i];
                const movie = {
                    title: row[0],
                    format: row[1],
                    notes: row[2]
                };
                movies.push(movie);
            }

            console.log(movies);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    
        movieList = sortMoviesByTitle(movies);
        displayMovies(movieList)
    }
    
    fetchGoogleSheetData();
});
