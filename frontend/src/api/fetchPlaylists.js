export default async function fetchPlaylists(props, abortController) {
  const { spotifyToken } = props;

  if (!spotifyToken) {
    throw new Error("No Spotify token provided");
  }

  // First get regular playlists
  const playlistResponse = await fetch(
    "https://api.spotify.com/v1/me/playlists",
    {
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
      signal: abortController?.signal,
    }
  );

  if (!playlistResponse.ok) {
    throw new Error("Failed to fetch playlists");
  }

  const playlistData = await playlistResponse.json();

  // Add Liked Songs as a "playlist"
  const likedSongsPlaylist = {
    id: "liked_songs",
    name: "Liked Songs",
    images: [{ url: "https://misc.scdn.co/liked-songs/liked-songs-640.png" }], // Spotify's default liked songs image
    tracks: { total: 0 }, // We'll get the actual count below
    owner: { display_name: "You" },
  };

  // Get Liked Songs count
  const likedResponse = await fetch(
    "https://api.spotify.com/v1/me/tracks?limit=1",
    {
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
      signal: abortController?.signal,
    }
  );

  if (likedResponse.ok) {
    const likedData = await likedResponse.json();
    likedSongsPlaylist.tracks.total = likedData.total;
  }

  // Add Liked Songs to the start of the playlists array
  return [likedSongsPlaylist, ...playlistData.items];
}
