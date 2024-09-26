let watchlistArr = JSON.parse(localStorage.getItem('watchlist'));
let moviesHtmlArr = [];

// finds a movie from the API using the ID
function getMovieById(movieId, session) {
    moviesHtmlArr = [];
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
            inWatchlist: watchlistArr.indexOf(data.imdbID) > -1,
        };
        createMovieHtml(movieObj, session);
    })
}

// Creates a movie html block based off the movieObj
function createMovieHtml(movie, session) {
    let totalRating = getTotalRating(movie.ratings);
    let plot = get150Plot(movie.plot, movie.id)
    let watchlistHtml = getWatchlistInHtml(movie.inWatchlist, movie.id);

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
                                    ${watchlistHtml}
                                </div>
                                <div class="movie-plot" id="plot-${movie.id}">
                                    ${plot}
                                </div>
                            </div>
                        </article>
                        <hr />`;
    addMovieHtmltoArr(movieHtml, session);
}

// gets the total rating for the movie
function getTotalRating(ratings) {
    let totalRating = 0;
    let value = 0;
    ratings.map(function(rating) {
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
    return ((totalRating)/(ratings.length)).toFixed(1)
}

// gets the plot with 150 char or less
function get150Plot(plot, id) {
    if (plot.length > 150) {
        return plot.slice(0, 150) + `<p id="showingLess${id}" class="show-text">
                                        ... <a class="read-more" data-read-more-movie="${id}">Read More</a>
                                    </p>`;
    } else {
        return plot;
    }
}

// gets the watchlist Html based off if its in the watchlist or not
function getWatchlistInHtml(inWatchlist, id) {
    if (inWatchlist) {
        return `<p class="add-to-watchlist">
                            <i class="fa-solid fa-circle-minus white-icon" data-remove-watchlist="${id}"></i> Remove
                        </p>`;
    } else {
        return `<p class="add-to-watchlist">
                            <i class="fa-solid fa-circle-plus white-icon" data-add-watchlist="${id}"></i> Watchlist
                        </p>`;
    }
}

// adds the movie html block to an array of movie html blocks
function addMovieHtmltoArr(html, session) {
    moviesHtmlArr.push(html);
    displayMoviesHtml(moviesHtmlArr, session);
}

// displays the movies on the appropriate page
function displayMoviesHtml(html, session) {
    if (session === 'search') {
        const exploreMoviesEl = document.getElementById('exploreMovies');
        exploreMoviesEl.innerHTML = '';
        exploreMoviesEl.style.position = 'static';
        exploreMoviesEl.style.transform = 'none';
        exploreMoviesEl.innerHTML = html.join('');
    } else {
        const savedMoviesEl = document.getElementById('savedMovies');
        savedMoviesEl.innerHTML = '';
        savedMoviesEl.style.position = 'static';
        savedMoviesEl.style.transform = 'none';
        savedMoviesEl.innerHTML = html.join('');
    }
}

//shows no more than 150 char of the plot
function showLessPlot(event) {
    let movieId = event.target.dataset.readLessMovie;
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
        moviePlotEl.innerHTML = `<p id="showingLess${movie.id}">
                                    ${movie.plot.slice(0, 150)}... <a data-read-more-movie="${movie.id}">Read More</a>
                                </p>`
    })
}

// shows the whole movie plot
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
    const movieIndex = watchlistArr.indexOf(movieId)
    if (movieId && movieIndex > -1) {
        const movieIndex = watchlistArr.indexOf(movieId);
        watchlistArr.splice(movieIndex, 1);
        localStorage.setItem("watchlist", JSON.stringify(watchlistArr));

        event.target.parentElement.innerHTML = `<i class="fa-solid fa-circle-plus white-icon" data-add-watchlist="${movieId}"></i> Watchlist`;
    }
}

export { getMovieById, watchlistArr, showLessPlot, showMorePlot, addToWatchlist, removeFromWatchlist }