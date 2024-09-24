
import { getMovieById, watchlistArr, showLessPlot, showMorePlot, addToWatchlist, removeFromWatchlist } from './index.js';

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