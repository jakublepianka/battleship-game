export const Ship = (shipLength) => {
  let stats = {
    length: shipLength,
    hitsTaken: 0,
  };

  function hit() {
    stats.hitsTaken++;
  }

  function isSunk() {
    return stats.hitsTaken >= stats.length ? true : false;
  }

  return {
    stats,
    hit,
    isSunk,
  };
};
