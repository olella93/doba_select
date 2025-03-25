// function to fetch artists based on genre input

function getRecommendations() {
    let genre = document.getElementById("genreInput").value.trim();

    //checking if input is empty
    if (genre === ""){
        alert("Please enter a genre!");
        return;
    }

    //fetch artists related to the genre from my API
    fetch(`https://doba-select-db.vercel.app/artists`)
    .then(response =>{
        if (!response.ok){
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => {
        if (data.artists && Array.isArray(data.artists)){
            displayRecommendations(data.artists);
        } else {
            throw new Error("Invalid data format received");
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
    recommendationsDiv.innerHTML = ""; //clears previous results

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
}


document.getElementById("recommend-btn").addEventListener("click", getRecommendations);