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

// Function to display recommendations
async function displayRecommendations(artists) {
    const recommendationsDiv = document.getElementById("recommendations");
    recommendationsDiv.innerHTML = ""; 

    let cachedArtists = []; 
    try {
        let response = await fetch(MOCKAPI_URL);
        cachedArtists = await response.json();
    } catch (error) {
        console.error("Error fetching cache:", error);
    }

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

        // Check cache from pre-fetched data
        let cachedArtist = cachedArtists.find(a => a.name.toLowerCase() === artist.name.toLowerCase());
        if (cachedArtist) {
            document.getElementById(`media-${artist.name.replace(/\s/g, '')}`).innerHTML = `<img src="${cachedArtist.image}" alt="${artist.name}" width="100">`;
        } else {
            fetchDeezerThumbnail(artist.name);
        }
    });
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
                    saveToCache(artistName, artistImage); 
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

// update artist image in db.json cache
async function updateArtistImage(artistId, newImageUrl) {
    try {
        let response = await fetch(`${MOCKAPI_URL}/${artistId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: newImageUrl })
        });

        if (response.ok) {
            console.log("Artist image updated successfully!");
        } else {
            console.error("Error updating artist:", response.statusText);
        }
    } catch (error) {
        console.error("Error updating artist:", error);
    }
}

// menu dropdown
function toggleMenu() {
    document.querySelector(".menu").classList.toggle("show");
}


document.getElementById("recommend-btn").addEventListener("click", getRecommendations);



// guess the song trivia
function openDobaSelectTrivia() {
    let gameContainer = document.getElementById("gameContainer");

    // Toggle visibility if it already exists
    if (gameContainer) {
        gameContainer.style.display = gameContainer.style.display === "none" ? "block" : "none";
        return;
    }

    // Find the dropdown menu to place the game inside it
    let menu = document.querySelector(".menu");

    // Creating the game div dynamically
    gameContainer = document.createElement("div");
    gameContainer.id = "gameContainer";
    gameContainer.classList.add("guess-the-artist");
    gameContainer.style.display = "block"; 
    gameContainer.innerHTML = `
        <h2>Guess the Artist</h2>
        <p id="lyricDisplay">Click "Start Game" to get a lyric!</p>
        <input type="text" id="artistGuess" placeholder="Enter Artist name">
        <button onclick="checkGuess()">Submit Guess</button>
        <button onclick="startGame()">Start Game</button>
        <p id="resultMessage"></p>
    `;

    menu.appendChild(gameContainer); 
}

const TRIVIA_API_URL = "https://67e3226297fc65f53538d793.mockapi.io/music-recommendation/guess_the_song";
let currentArtist = ""; 

// Function to start the game by fetching a random lyric
function startGame() {
    fetch(TRIVIA_API_URL)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                let randomIndex = Math.floor(Math.random() * data.length);
                let triviaItem = data[randomIndex];
                
                document.getElementById("lyricDisplay").innerText = triviaItem.lyric;
                currentArtist = triviaItem.artist.toLowerCase(); 
                document.getElementById("resultMessage").innerText = ""; 
            } else {
                alert("No trivia data available!");
            }
        })
        .catch(error => {
            console.error("Error fetching trivia:", error);
            alert("Failed to fetch trivia. Try again later!");
        });
}

// Function to check the user's guess
function checkGuess() {
    let userGuess = document.getElementById("artistGuess").value.trim().toLowerCase();
    let resultMessage = document.getElementById("resultMessage");

    if (userGuess === "") {
        resultMessage.innerText = "Please enter an artist name!";
        return;
    }

    if (userGuess === currentArtist) {
        resultMessage.innerText = "✅ Correct! Well done!";
        resultMessage.style.color = "green";
    } else {
        resultMessage.innerText = "❌ Incorrect! Try again.";
        resultMessage.style.color = "red";
    }
    document.getElementById("artistGuess").value = "";
}

