
let pageSearchList = false;
let moviesHtmlArr = [];
const exploreMoviesEl = document.getElementById('exploreMovies');
let watchlistArr = [];


document.getElementById('searchBtn').addEventListener('click', function() {
    searchMovies(document.getElementById('searchBar').value);
});

function searchMovies(searchedTerm) {
    fetch(`http://www.omdbapi.com/?apikey=48a8d3aa&s=${searchedTerm}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => renderMovies(data.Search))
}

function renderMovies(moviesArr) {
    let moviesHTML = [];
    moviesHTML = moviesArr.map(movie => {
        const id = movie.imdbID;
        getMovieById(id);
    }).join('');
}

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
            inWatchlist: watchlistArr.indexOf(data.imdbID) > -1,
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

    let watchlistHtml = '';
    console.log(movie.inWatchlist)
    if (movie.inWatchlist) {
        watchlistHtml = `<p class="add-to-watchlist">
                            <i class="fa-solid fa-circle-minus white-icon" data-remove-watchlist="${movie.id}"></i> Remove
                        </p>`;
    } else {
        watchlistHtml = `<p class="add-to-watchlist">
                            <i class="fa-solid fa-circle-plus white-icon" data-add-watchlist="${movie.id}"></i> Watchlist
                        </p>`;
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
                                    ${watchlistHtml}
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
    exploreMoviesEl.style.position = 'static';
    exploreMoviesEl.style.transform = 'none';
    exploreMoviesEl.innerHTML = html;
}

exploreMoviesEl.addEventListener('click', function(event) {
    if (event.target.dataset.addWatchlist) {
        addToWatchlist(event);
    }

    if (event.target.dataset.removeWatchlist) {
        removeFromWatchlist(event);
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

function addToWatchlist(event) {
    const movieId = event.target.dataset.addWatchlist;
    if (movieId && !(watchlistArr.indexOf(movieId) > -1)) {
        watchlistArr.push(movieId);
        localStorage.setItem("watchlist", JSON.stringify(watchlistArr));

        event.target.parentElement.innerHTML = `<i class="fa-solid fa-circle-minus white-icon" data-remove-watchlist="${movieId}"></i> Remove`
    }
}

function removeFromWatchlist(event) {
    const movieId = event.target.dataset.removeWatchlist;
    if (movieId && watchlistArr.indexOf(movieId) > -1) {
        const movieIndex = watchlistArr.indexOf(movieId);
        watchlistArr.splice(movieIndex, 1);
        localStorage.setItem("watchlist", JSON.stringify(watchlistArr));

        event.target.parentElement.innerHTML = `<i class="fa-solid fa-circle-plus white-icon" data-add-watchlist="${movieId}"></i> Watchlist`
    }
}