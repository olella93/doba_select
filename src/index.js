// function to fetch artists based on genre input

function getRecommendations() {
    let genre = document.getElementById("genreInput").value.trim();

    //checking if input is empty
    if (genre === ""){
        alert("Please enter a genre!");
        return;
    }

    //fetch artists related to the genre from Deezer API
    fetch(`https://api.deezer.com/search/artist?q=${genre}`)
    .then(response => response.json ())
    .then(data => {
        displayRecommendations(data.data);
    })
    .catch(error => {
        console.error("Error fetching data:", error);
        alert("Something went wrong. Please try again!");
    });
}

//function to display artist recommendation on page
function displayRecommendations(artists) {
    const recommendationsDiv = document.getElementById("recommendations");
    recommendationsDiv.innerHTML = ""; //clears previous results

    // Loop through the artists to create elements for them
    artists.forEach(artist => {
        const
    })
}


document.getElementById("recommend-btn").addEventListener("click", getRecommendations);