export default async function fetchPlaylistTracks(props, abortController) {
  const { playlistId, spotifyToken } = props;
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
      signal: abortController?.signal,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch playlists");
  }

  const data = await response.json();
  return data.items;
}
