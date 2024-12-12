// Input-Feld für die Suche
const searchInput = document.getElementById("searching");
const main = document.getElementById("main-section");
const startScreen = document.getElementById("start-screen");

// Debouncing-Funktion
let debounceTimeout;
function debounce(func, delay) {
    return (...args) => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => func(...args), delay);
    };
}

// Filme laden, wenn der Input sich ändert
searchInput.addEventListener("input", debounce(function () {
    const search = searchInput.value.trim();

    // Keine leere Eingabe suchen
    if (search === "") {
        main.innerHTML = "";
        main.appendChild(startScreen); // Zeigt den Start-Screen an
        return;
    }

    // Start-Screen ausblenden
    if (startScreen) startScreen.style.display = "none";

    // API-Abfrage
    fetch(`https://www.omdbapi.com/?s=${search}&apikey=1887ba6c`)
        .then(res => res.json())
        .then(data => {
            if (data.Response === "True") {
                main.innerHTML = ""; // Inhalt zurücksetzen

                data.Search.forEach((movie) => {
                    main.innerHTML += `
                        <div class="movie-section">
                            <img src="${movie.Poster}" alt="Movie Poster" class="movie-image">
                            <div class="movie-text">
                                <div class="movie-title-and-btn">
                                    <h2>${movie.Title}</h2>
                                    <button class="add-movie-btn" onclick="addToWatchlist('${movie.imdbID}')">+</button>
                                </div>
                                <p><strong>Year:</strong> ${movie.Year}</p>
                                <p><strong>Genre:</strong> ${movie.Type}</p>
                            </div>
                        </div>
                    `;
                });
            } else {
                main.innerHTML = `<p>No movies found. Please try again with another search term.</p>`;
            }
        })
        .catch(error => {
            console.error("Error fetching movies:", error);
            main.innerHTML = `<p>Error retrieving the data. Please try again later.</p>`;
        });
}, 300)); // 300ms Verzögerung für das Debouncing


function addToWatchlist(imdbID) {
    const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
    
    // Prüfen, ob der Film schon in der Watchlist ist
    if (!watchlist.some(movie => movie.imdbID === imdbID)) {
        // Film-Daten holen
        fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=1887ba6c`)
            .then(res => res.json())
            .then(movie => {
                watchlist.push(movie); // Hinzufügen zur Watchlist
                localStorage.setItem("watchlist", JSON.stringify(watchlist));
                alert(`${movie.Title} has been added to your watchlist!`);
            });
    } else {
        alert("This movie is already in your watchlist.");
    }
}
