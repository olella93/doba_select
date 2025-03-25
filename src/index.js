// function to fetch artists based on genre input

function getRecommendations() {
    let genre = document.getElementById("genreInput").value.trim().toLowerCase();

    //checking if input is empty
    if (genre === ""){
        alert("Please enter a genre!");
        return;
    }

    //deezer search API
    fetch(`https://api.deezer.com/genre`)
    .then(response => response.json())
    .then(data => {
        if (data.data) {
            const foundGenre = data.data.find(g => g.name.toLowerCase() === genre);
            if (!foundGenre) {
                alert("No genre found!");
                return;
            }

            // fetching artists based on genre
            fetch(`https://api.deezer.com/genre/${foundGenre.id}/artists`)
            .then(response => response.json())
            .then(artistData => {
                if (artistData.data.length === 0) {
                    alert("No artists found for this genre!");
                } else {
                    displayRecommendations(artistData.data);
            }
        });
        } else {
            throw new Error("Invalid genre data received");
        }
    })
    
    .catch(error => {
        console.error("Error fetching data:", error);
        alert("Something went wrong. Please try again!");
    });
}

//function to display artist recommendation on page
function displayRecommendations(artists) {
    const recommendationsDiv = document.getElementById("recommendations");
    recommendationsDiv.innerHTML = ""; // Clears
    // previous results

    artists.forEach(artist => {
        const artistElement = document.createElement("div");
        artistElement.classList.add("artist-card"); // Styling

        artistElement.innerHTML = `
        <div>
            <h3>${artist.name}</h3>
            <img src="${artist.picture_medium}" alt="${artist.name}">
        </div>
        `;

        recommendationsDiv.appendChild(artistElement);
    });
}

    // Loop through the artists to create elements for them
    artists.forEach(artist => {
        const artistElement = document.createElement("div");
        artistElement.classList.add("artist-card"); // styling

        artistElement.innerHTML = `
        <div>
            <h3>${artist.name}</h3>
            <img src="${artist.picture_medium}" alt="${artist.name}">
        </div>
        `;

        recommendationsDiv.appendChild(artistElement);
    });

document.getElementById("recommend-btn").addEventListener("click", getRecommendations);