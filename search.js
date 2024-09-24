
import { getMovieById, watchlistArr, fetchMovieObj } from './index.js';

const exploreMoviesEl = document.getElementById('exploreMovies');

// when a user searches for a movie the movie is found with an API
document.getElementById('searchBtn').addEventListener('click', function() {
    searchMovies(document.getElementById('searchBar').value);
});

// finds a movie based off a search
function searchMovies(searchedTerm) {
    fetch(`http://www.omdbapi.com/?apikey=48a8d3aa&s=${searchedTerm}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => renderMovies(data.Search))
}

// creates an array of the movie blocks in html
function renderMovies(moviesArr) {
    let moviesHTML = [];
    moviesHTML = moviesArr.map(movie => {
        const id = movie.imdbID;
        getMovieById(id, 'search');
    }).join('');
}

// when a user clicks on the explore movies section they can either add to or remove from their watch list, or read more or less of the plot
exploreMoviesEl.addEventListener('click', function(event) {
    if (event.target.dataset.addWatchlist) {
        addToWatchlist(event);
    }
    if (event.target.dataset.removeWatchlist) {
        removeFromWatchlist(event);
    }

    if (event.target.dataset.readMoreMovie) {
        showMorePlot(event)
    }
    if (event.target.dataset.readLessMovie) {
        showLessPlot(event)
    }
})

// shows the whole plot
function showMorePlot(event) {
    let movieId = event.target.dataset.readMoreMovie;
    const moviePlotEl = document.getElementById(`plot-${movieId}`);
    let movieObj = {};

    fetch(`http://www.omdbapi.com/?apikey=48a8d3aa&i=${movieId}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        return movieObj = {
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
    })
    .then(movie => {
        moviePlotEl.innerHTML = `<p id="showingMore${movie.id}">
                                    ${movie.plot} <a data-read-less-movie="${movie.id}"> Show Less</a>
                                </p>`
    })
}

//shows no more than 150 char of the plot
function showLessPlot(event) {
    let movieId = event.target.dataset.readLessMovie;
    const moviePlotEl = document.getElementById(`plot-${movieId}`);
    let movieObj = {};

    fetchMovieObj(movieId)
        .then(movie => {
            moviePlotEl.innerHTML = `<p id="showingLess${movie.id}">
                                        ${movie.plot.slice(0, 150)}... <a data-read-more-movie="${movie.id}">Read More</a>
                                    </p>`
        })
}

// adds a movie to the watchlist and makes it remove-able
function addToWatchlist(event) {
    const movieId = event.target.dataset.addWatchlist;
    if (movieId && !(watchlistArr.indexOf(movieId) > -1)) {
        console.log(watchlistArr)
        watchlistArr.push(movieId);
        localStorage.setItem("watchlist", JSON.stringify(watchlistArr));

        event.target.parentElement.innerHTML = `<i class="fa-solid fa-circle-minus white-icon" data-remove-watchlist="${movieId}"></i> Remove`;
    }
}

// removes a movie from the watchlist and makes it add-able
function removeFromWatchlist(event) {
    const movieId = event.target.dataset.removeWatchlist;
    if (movieId && watchlistArr.indexOf(movieId) > -1) {
        const movieIndex = watchlistArr.indexOf(movieId);
        watchlistArr.splice(movieIndex, 1);
        localStorage.setItem("watchlist", JSON.stringify(watchlistArr));

        event.target.parentElement.innerHTML = `<i class="fa-solid fa-circle-plus white-icon" data-add-watchlist="${movieId}"></i> Watchlist`;
    }
}