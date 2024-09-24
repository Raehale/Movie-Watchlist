import { getMovieById, watchlistArr } from './index.js';

const savedMoviesEl = document.getElementById('savedMovies');

let moviesHtmlArr = [];

// itterates through the watchlist array to create the movie blocks
watchlistArr.forEach(function(movieId) {
    getMovieById(movieId, 'watchlist');
});

savedMoviesEl.addEventListener('click', function(event) {
    const movieIdWatchlist = event.target.dataset.removeWatchlist
    if (movieIdWatchlist && watchlistArr.indexOf(movieIdWatchlist) > -1) {
        const movieIndex = watchlistArr.indexOf(movieIdWatchlist);
        watchlistArr.splice(movieIndex, 1);

        if (watchlistArr === undefined || watchlistArr.length == 0) {
            savedMoviesEl.style.position = 'absolute';
            savedMoviesEl.style.transform = 'translate(-50%, -50%)';
            savedMoviesEl.innerHTML = `<p>Your watchlist is looking a little empty...</p>
                                        <a href="./index.html">
                                            <i class="fa-solid fa-circle-plus white-icon"></i> Let's add some movies!
                                        </a>`;
        } else {
            moviesHtmlArr = [];
            watchlistArr.forEach(function(movieId) {
                getMovieById(movieId)
            })
        }

        localStorage.setItem("watchlist", JSON.stringify(watchlistArr));
    }
    
    if (event.target.dataset.readMoreMovie) {
        let movieId = event.target.dataset.readMoreMovie;
        let showingMoreId = `showingMore${movieId}`;
        const showingMoreEl = document.getElementById(showingMoreId);
        showingMoreEl.classList.toggle('show-text');
        showingMoreEl.classList.toggle('hide-text');
        let showingLessId = `showingLess${movieId}`;
        const showingLessEl = document.getElementById(showingLessId);
        showingLessEl.classList.toggle('show-text');
        showingLessEl.classList.toggle('hide-text');
    }
})
