export default async function fetchPlaylistTracks(props, abortController) {
  const { playlistId, spotifyToken } = props;

  if (!spotifyToken) {
    throw new Error("No Spotify token provided");
  }

  // Special handling for Liked Songs
  const endpoint =
    playlistId === "liked_songs"
      ? "https://api.spotify.com/v1/me/tracks"
      : `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;

  const response = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${spotifyToken}`,
    },
    signal: abortController?.signal,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch playlist tracks");
  }

  const data = await response.json();
  return data;
}
