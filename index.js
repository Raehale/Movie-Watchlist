let pageSearchList = false;
let moviesHtmlArr = [];

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
            // document.getElementById('addWatchlist').addEventListener('click', function(event) {
            //     const selectedMovieId = event.target.dataset.addWatchlist;
                
            // });
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
            title: data.Title,
            poster: data.Poster,
            year: data.Year,
            ratings: data.Ratings,
            runtime: data.Runtime,
            genre: data.Genre,
            plot: data.Plot,
        };
        createMoviesArrHtml(movieObj);
    })
}

function createMoviesArrHtml(movie) {
    console.log(movie)
    let value = 0;
    let totalRating = 0;

    totalRating = movie.ratings.map(function(rating) {
        if (rating.Value.includes('%')) {
            value = Number(rating.Value.slice(0, -1))/10;
        } else if (rating.Value.includes('/100')) {
            value = Number(rating.Value.slice(0, -4))/10
        } else if (rating.Value.includes('10')) {
            value = Number(rating.Value.slice(0, -3));
        }

        return (totalRating + value)/(movie.ratings.length + 1);
    })

    if (movie.plot.length > length) {
        movie.plot = movie.plot.slice(0, 150) + `... <p class="read-more" id="readMore" data-read-more-movie="${movie.imdbID}">ReadMore</p>`
    }

    moviesHtmlArr.push(`<article class="movie">
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
                                <p class="add-to-watchlist" id="addWatchlist"><i class="fa-solid fa-circle-plus white-icon" data-add-watchlist="${movie.imdbID}"></i> Watchlist</p>
                            </div>
                            <p class="movie-plot">
                                ${movie.plot}
                            </p>
                        </div>
                    </article>
                    <hr />`);
    displayMoviesHtml(moviesHtmlArr)
}

function displayMoviesHtml(html) {
    document.getElementById('exploreMovies').innerHTML = html;
}

const watchlistArr = [];