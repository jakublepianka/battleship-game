export const Player = (givenName, opponentName, isComputer, gameActions) => {
  const name = isComputer ? "Computer" : givenName;
  let triedShots = [];
  let hits = [];
  let misses = [];

  function getRandomCoords(triedShotsArr) {
    let arr = [];
    while (arr.length !== 2) {
      for (let i = 0; i < 2; i++) {
        arr.push(Math.floor(Math.random() * 10));
      }
      for (const coord of triedShotsArr) {
        if (coord[0] === arr[0] && coord[1] === arr[1]) {
          arr = [];
        }
      }
    }
    return JSON.stringify(arr);
  }

  function publishAttack(attCoords) {
    setTimeout(() => {
      gameActions.sendAttack({
        receiver: opponentName,
        coords: attCoords,
      });
    }, 400);
  }

  function attackRandomSquare() {
    triedShots = misses.concat(hits);
    const randomCoords = getRandomCoords(triedShots);
    publishAttack(randomCoords);
  }

  return {
    set hits(value) {
      hits = value;
    },
    set misses(value) {
      misses = value;
    },
    attackRandomSquare,
  };
};
