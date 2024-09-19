fetch('http://www.omdbapi.com/?i=tt3896198&apikey=48a8d3aa', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => console.log(data))