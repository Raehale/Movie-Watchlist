let watchlistArr = JSON.parse(localStorage.getItem('watchlist'));
const savedMoviesEl = document.getElementById('savedMovies');
let moviesHtmlArr = [];
console.log(watchlistArr)

watchlistArr.forEach(function(movieId) {
    getMovieById(movieId)
})

function getMovieById(movieId) {
    let movieObj = {};
    fetch(`http://www.omdbapi.com/?apikey=48a8d3aa&i=${movieId}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        movieObj = {
            id: data.imdbID,
            title: data.Title,
            poster: data.Poster,
            year: data.Year,
            ratings: data.Ratings,
            runtime: data.Runtime,
            genre: data.Genre,
            plot: data.Plot,
            readMore: false,
        };
        createMovieHtml(movieObj);
    })
}

function createMovieHtml(movie) {
    let value = 0;
    let totalRating = 0;

    movie.ratings.map(function(rating) {
        if (rating.Value.includes('%')) {
            value = Number(rating.Value.slice(0, -1))/10;
        } else if (rating.Value.includes('/100')) {
            value = Number(rating.Value.slice(0, -4))/10
        } else if (rating.Value.includes('10')) {
            value = Number(rating.Value.slice(0, -3));
        }
        totalRating += value;
        return totalRating;
    });
    totalRating = ((totalRating)/(movie.ratings.length)).toFixed(1)

    if (movie.plot.length > 150) {
        movie.plot = movie.plot.slice(0, 150) + `<p id="showingLess${movie.id}" class="showText">... <a class="read-more" data-read-more-movie="${movie.id}">Read More</a></p><p id="showingMore${movie.id}" class="hide-text">${movie.plot.slice(150, movie.plot.length)} <a data-read-more-movie="${movie.id}">Show Less</a></p>`
    }

    const movieHtml = `<article class="movie">
                            <div class="movie-poster">
                                <img src="${movie.poster}" alt="${movie.title}" />
                            </div>
                            <div class="movie-info">
                                <div class="movie-title">
                                    <h3>${movie.title}</h3> 
                                    <p>
                                        <i class="fa-solid fa-star yellow-icon"></i> 
                                        ${totalRating}
                                    </p>
                                </div>
                                <div class="movie-details">
                                    <p>${movie.runtime}</p>
                                    <p>${movie.genre}</p>
                                    <p class="add-to-watchlist"><i class="fa-solid fa-circle-plus white-icon" data-add-watchlist="${movie.id}"></i> Watchlist</p>
                                </div>
                                <p class="movie-plot">
                                    ${movie.plot}
                                </p>
                            </div>
                        </article>
                        <hr />`;
    addMovieHtmltoArr(movieHtml);
}

function addMovieHtmltoArr(html) {
    moviesHtmlArr.push(html);
    displayMoviesHtml(moviesHtmlArr);
}


function displayMoviesHtml(html) {
    savedMoviesEl.style.position = 'static';
    savedMoviesEl.style.transform = 'none';
    savedMoviesEl.innerHTML = html;
}