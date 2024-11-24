export default function setBaobabState(state, path, value) {
  return new Promise((resolve) => {
    const cursor2 = state.select(path);
    cursor2.once("udpate", (event) => resolve(event.data.currentData));
    cursor2.set(value);
  });
}
