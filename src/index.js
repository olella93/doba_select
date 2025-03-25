const API_KEY = "1725fece22768045e16bb3c4f649f4e3"; 

function getRecommendations() {
    let genre = document.getElementById("genreInput").value.trim().toLowerCase();

    if (genre === "") {
        alert("Please enter a genre!");
        return;
    }

    // Last.fm API to get top artists for a genre (tag)
    fetch(`https://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=${genre}&api_key=${API_KEY}&format=json`)
    .then(response => response.json())
    .then(data => {
        if (data.topartists && data.topartists.artist.length > 0) {
            displayRecommendations(data.topartists.artist);
        } else {
            alert("No artists found for this genre!");
        }
    })
    .catch(error => {
        console.error("Error fetching data:", error);
        alert("Something went wrong. Please try again!");
    });
}

// Function to display recommendations
function displayRecommendations(artists) {
    const recommendationsDiv = document.getElementById("recommendations");
    recommendationsDiv.innerHTML = ""; 

    artists.forEach(artist => {
        const artistElement = document.createElement("div");
        artistElement.classList.add("artist-card");


        artistElement.innerHTML = `
            <div>
                <h3>${artist.name}</h3>
                <img src="${artist.image[2]['#text']}" alt="${artist.name}">
            </div>
        `;

        recommendationsDiv.appendChild(artistElement);
    });
}

document.getElementById("recommend-btn").addEventListener("click", getRecommendations);
