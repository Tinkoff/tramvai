let idCounter = 0;

function uniqueId() {
  // eslint-disable-next-line no-plusplus
  return ++idCounter;
}

export { uniqueId };
