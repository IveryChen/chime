export default async function fetchPlaylists(props, abortController) {
  const { spotifyToken } = props;
  const response = await fetch("https://api.spotify.com/v1/me/playlists", {
    headers: {
      Authorization: `Bearer ${spotifyToken}`,
    },
    signal: abortController?.signal,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch playlists");
  }

  const data = await response.json();
  return data.items;
}
