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
    let moviesHTML = '[]';
    moviesHTML = moviesArr.map(movie => {
        const id = movie.imdbID;
        fetch(`http://www.omdbapi.com/?apikey=48a8d3aa&i=${id}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            let movieObj = {
                year: data.Year,
                ratings: data.Ratings,
                runtime: data.Runtime,
                genre: data.Genre,
                plot: data.Plot,
            };

            let value = 0;
            let totalRating = 0;
            movieObj.ratings.map(function(rating) {
                if (rating.Value.includes('%')) {
                    value = Number(rating.Value.slice(0, -1))/10;
                } else if (rating.Value.includes('/100')) {
                    value = Number(rating.Value.slice(0, -4))/10;
                } else if (rating.Value.includes('/10')) {
                    value = Number(rating.Value.slice(0, -3));
                }
                totalRating += value;

                return totalRating;
            })

            if (movieObj.plot.length > 150) {
                movieObj.plot = movieObj.plot.slice(0, 150) + `... <a class="read-more" id="readMore" data-id="${id}">Read more</a>`;
            }

            moviesHTML += `<article class="movie">
                                <div class="movie-poster">
                                    <img src="${movie.Poster}" alt="${movie.Title}" />
                                </div>
                                <div class="movie-info">
                                    <div class="movie-title">
                                        <h3>${movie.Title}</h3> 
                                        <p>
                                            <i class="fa-solid fa-star yellow-icon"></i> 
                                            ${totalRating}
                                        </p>
                                    </div>
                                    <div class="movie-details">
                                        <p>${movieObj.runtime}</p>
                                        <p>${movieObj.genre}</p>
                                        <p class="add-to-watchlist" data-id="${id}"><i class="fa-solid fa-circle-plus white-icon"></i> Watchlist</p>
                                    </div>
                                    <p class="movie-plot">
                                        ${movieObj.plot}
                                    </p>
                                </div>
                            </article>
                            <hr />`;

            displayMovies(moviesHTML);
        });
    }).join('');
}

function displayMovies(html) {
    document.getElementById('exploreMovies').innerHTML = html;
}