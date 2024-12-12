// Reference to the watchlist content container
const watchlistContent = document.getElementById("watchlist-content");

// Load saved watchlist from localStorage
function loadWatchlist() {
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    watchlistContent.innerHTML = ""; // Clear previous content

    if (watchlist.length === 0) {
        watchlistContent.innerHTML = "<p>Your watchlist is empty. Add some movies from the search page!</p>";
        return;
    }

    // Populate watchlist
    watchlist.forEach(movie => {
        watchlistContent.innerHTML += `
            <div class="movie-section">
                <img src="${movie.Poster}" alt="Movie Poster" class="movie-image">
                <div class="movie-text">
                    <div class="movie-title-and-btn">
                        <h2>${movie.Title}</h2>
                        <button class="remove-movie-btn" onclick="removeFromWatchlist('${movie.imdbID}')">Remove</button>
                    </div>
                    <p><strong>Year:</strong> ${movie.Year}</p>
                    <p><strong>Genre:</strong> ${movie.Type}</p>
                </div>
            </div>
        `;
    });
}

// Remove movie from watchlist
function removeFromWatchlist(imdbID) {
    let watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    watchlist = watchlist.filter(movie => movie.imdbID !== imdbID);
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
    loadWatchlist(); // Reload the watchlist
}

// Initialize the watchlist when the page loads
document.addEventListener("DOMContentLoaded", loadWatchlist);