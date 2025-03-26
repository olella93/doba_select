const LASTFM_API_KEY = "1725fece22768045e16bb3c4f649f4e3";
const MOCKAPI_URL = "https://67e3226297fc65f53538d793.mockapi.io/music-recommendation/artists"; 

function getRecommendations() {
    let genre = document.getElementById("genreInput").value.trim().toLowerCase();

    if (genre === "") {
        alert("Please enter a genre!");
        return;
    }

    // Last.fm API to get top artists for a genre (tag)
    fetch(`https://ws.audioscrobbler.com/2.0/?method=tag.gettopartists&tag=${genre}&api_key=${LASTFM_API_KEY}&format=json`)
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
                <div id="media-${artist.name.replace(/\s/g, '')}"></div>
            </div>
        `;

        recommendationsDiv.appendChild(artistElement);

        // Check cache before fetching from Deezer
        checkCache(artist.name).then(cachedImage => {
            if (cachedImage) {
                document.getElementById(`media-${artist.name.replace(/\s/g, '')}`).innerHTML = `<img src="${cachedImage}" alt="${artist.name}" width="100">`;
            } else {
                fetchDeezerThumbnail(artist.name);
            }
        });

    });
}

// check if artist image is already cached in db.json
async function checkCache(artistName) {
    try {
        let response = await fetch(MOCKAPI_URL);
        let cachedArtists = await response.json();
        let cachedArtist = cachedArtists.find(a => a.name.toLowerCase() === artistName.toLowerCase());
        return cachedArtist ? cachedArtist.image : null;
    } catch (error) {
        console.error("Error checking cache:", error);
        return null;
    }
}

// fetching deezer preview
function fetchDeezerThumbnail(artistName) {
    const deezerApiUrl = `https://api.deezer.com/search/artist?q=${artistName}`;
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(deezerApiUrl)}`;

    fetch(proxyUrl)
        .then(response => response.json())
        .then(data => {
            if (data.data && data.data.length > 0) {
                const artistImage = data.data[0].picture_medium || data.data[0].picture;
                if (artistImage) {
                    document.getElementById(`media-${artistName.replace(/\s/g, '')}`).innerHTML = `<img src="${artistImage}" alt="${artistName}" width="100">`;
                    saveToCache(artistName, artistImage); // Save to cache
                }
            } else {
                console.error("No image found for", artistName);
            }
        })
        .catch(error => console.error("Error fetching Deezer image:", error));
}

// save artist image to db.json cache
async function saveToCache(artistName, imageUrl) {
    try {
        let response = await fetch(MOCKAPI_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: artistName, image: imageUrl })
        });

        if (!response.ok) {
            console.error("Error saving to cache:", response.statusText);
        }
    } catch (error) {
        console.error("Error saving to cache:", error);
    }
}

document.getElementById("recommend-btn").addEventListener("click", getRecommendations);
