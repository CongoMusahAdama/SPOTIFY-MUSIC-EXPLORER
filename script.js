/**
 * this code handles user interactions and displays data.
 *  It checks if the user is authenticated and initializes the Spotify player if they are. 
 * It also handles the login button click and search button click event
 */
//using the DOM (document object model)
const loginButton= document.getElementById('login-button');
const searchInput= document.getElementById('search-input');
const searchButton= document.getElementById('search-button');
const artistContainer= document.getElementById('artist-container');



// Check if user is authenticated
if (window.location.hash === '#access_token=') {
  loginButton.style.display = 'none';
  searchInput.disabled = false;
  searchButton.disabled = false;

  // Get access token from URL
  const accessToken = window.location.hash.substring(14);

  // Set access token in session storage
  sessionStorage.setItem('access_token', accessToken);

  // Initialize Spotify player
  const player = new Spotify.Player({
    name: 'Spotify Music Explorer',
    getOAuthToken: cb => { cb(accessToken); }
  });

  // Connect to Spotify Web API
  player.connect();
} else {
  loginButton.style.display = 'block';
  searchInput.disabled = true;
  searchButton.disabled = true;
}


// Handle login button click using the event listener to listen when a user click
loginButton.addEventListener('click', () => {
  window.location.href = '/auth';
});

// Handle search button click
searchButton.addEventListener('click', () => {
  const artistName = searchInput.value.trim();

  if (artistName) {
    axios.get(`https://api.spotify.com/v1/search?q=${artistName}&type=artist`, {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('access_token')}`
      }
    })
    .then(response => {
      const artist = response.data.artists.items[0];

      if (artist) {
        const artistContainer = document.getElementById('artist-container');
        artistContainer.innerHTML = `
          <div class="artist">
            <img src="${artist.images[0].url}" alt="${artist.name}">
            <h2>${artist.name}</h2>
            <p>${artist.genres.join(', ')}</p>
          </div>
        `;
      } else {
        artistContainer.innerHTML = '<p>No artist found.</p>';
      }
    })
    .catch(error => {
      console.error(error);
      artistContainer.innerHTML = '<p>An error occurred while searching for the artist.</p>';
    });
  }
});