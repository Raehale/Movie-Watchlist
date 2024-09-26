import { getMovieById, watchlistArr, showLessPlot, showMorePlot, removeFromWatchlist } from './index.js';

const savedMoviesEl = document.getElementById('savedMovies');

// itterates through the watchlist array to create the movie blocks
watchlistArr.forEach(function(movieId) {
    getMovieById(movieId, 'watchlist');
});

// when a user clicks on the saved movies section they can remove a movie from their watch list, or read more or less of the plot
savedMoviesEl.addEventListener('click', function(event) {
    if (event.target.dataset.removeWatchlist) {
        removeFromWatchlist(event);
        if (watchlistArr === undefined || watchlistArr.length == 0) {
            savedMoviesEl.style.position = 'absolute';
            savedMoviesEl.style.transform = 'translate(-50%, -50%)';
            savedMoviesEl.innerHTML = `<p>Your watchlist is looking a little empty...</p>
                                        <a href="./index.html">
                                            <i class="fa-solid fa-circle-plus white-icon"></i> Let's add some movies!
                                        </a>`;
        } else {
            savedMoviesEl.innerHTML = '';
            watchlistArr.forEach(function(movieId) {
                getMovieById(movieId, 'watchlist')
            });
        }
    }

    if (event.target.dataset.readMoreMovie) {
        showMorePlot(event);
    }
    if (event.target.dataset.readLessMovie) {
        showLessPlot(event);
    }
})
