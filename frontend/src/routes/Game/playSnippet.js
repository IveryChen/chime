export default async function playSnippet(uri) {
  if (!uri) {
    console.error("No URI provided");
    return;
  }

  const audio = new Audio(uri);
  audio.volume = 1.0;

  return new Promise((resolve) => {
    audio.play();
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
      resolve();
    }, 2000);
  });
}
