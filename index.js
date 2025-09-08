// TODO please create a layer of separation between DOM and game logic - to increase performance


// init vars
let selectedPeg, moves;

// dashboard buttons...
undoButton.onclick = () => {
  const popped = moves.pop();
  if (!popped) {
    return;
  }
  const { origin, center, target } = popped;
  makeMove(target, center, origin, true)
}

resetButton.onclick = () => {
  init();
}

rotateLeftButton.onclick = () => {
  board.style.rotate = `${parseInt(board.style.rotate.slice(0, -3) || 0) + 90}deg`;
}
rotateRightButton.onclick = () => {
  board.style.rotate = `${parseInt(board.style.rotate.slice(0, -3) || 0) - 90}deg`;
}

const hidePossibleMoves = () => {
  Array.from(document.querySelectorAll(".possible")).forEach((el) => el.classList.remove("possible"))
}

const getPegPos = (peg) => {
  return { x: parseInt(peg.getAttribute("x")), y: parseInt(peg.getAttribute("y")) };
}

const makeMove = (origin, center, target, undo = false) => {

  if (!undo && origin != selectedPeg) {
    return;
  }
  if (!undo) {
    moves.push({ origin, center, target });
  }
  hidePossibleMoves();
  origin.classList.remove("on");
  if (!undo) {
    center.classList.remove("on");
  } else {
    center.classList.add("on");
  }
  target.classList.add("on");
  calculateMoveCount();
}


const calculateMovesAtPosition = (x, y) => {
  const offsets = [-2, 2];
  return [
    offsets.map((offset) => { return { origin: getPegAt(x, y), center: getPegAt(x + parseInt(offset / 2), y), target: getPegAt(x + offset, y) } }),
    offsets.map((offset) => { return { origin: getPegAt(x, y), center: getPegAt(x, y + offset / 2), target: getPegAt(x, y + offset) } })
  ].flat().filter((move) => move.origin && move.origin.classList.contains("on") && move.center && move.target && move.center.classList.contains("on") && !move.target.classList.contains("on"))
}


const showPossibleMoves = (peg) => {
  const { x, y } = getPegPos(peg);
  let possibleMoves = calculateMovesAtPosition(x, y);
  possibleMoves.forEach(({ target, origin, center }) => {
    target.classList.add("possible")
    target.addEventListener("click", () => makeMove(origin, center, target))
  })
}

const setSelectedPeg = (peg) => {
  if (!peg.classList.contains("on")) {
    return;
  }
  if (selectedPeg) {
    selectedPeg.classList.remove("selected");
  }
  hidePossibleMoves();
  selectedPeg = peg
  selectedPeg.classList.add("selected");
  showPossibleMoves(peg);
}

const getPegAt = (x, y) => {
  return document.querySelector(`[x="${x}"][y="${y}"]`)
}

const calculateMoveCount = () => {
  let pegCount = 0;
  let result = 0;
  Array.from(board.children).forEach((row) => {
    Array.from(row.children).forEach((peg) => {
      if (peg.classList.contains("on")) {
        pegCount++;
      }
      const { x, y } = getPegPos(peg)
      result += calculateMovesAtPosition(x, y).length
    })
  })


  moveCount.innerText = `possible moves: ${result}, peg count: ${pegCount}`;
  if (result != 0) {
    return;

  }
  if (pegCount > 1) {
    alert("Przegraleś...");
    return;
  }
  alert("Wygrałeś!");
}

const init = () => {
  board.innerHTML = "";
  selectedPeg = null;
  moves = [];

  let rowHeight = 2;
  let rowLength = 2;
  let i = 0;
  for (let j = 0; j < 3; j++) {
    let special = (j == 1)
    rowHeight = special ? 3 : 2;
    rowLength = special ? 7 : 3;
    for (let y = 0; y < rowHeight; y++) {
      let row = document.createElement("div")
      row.classList.add("row")

      for (let x = 0; x < rowLength; x++) {
        let peg = document.createElement("div")
        peg.classList.add("peg")
        peg.classList.add("on");
        peg.setAttribute('x', x - (special ? 2 : 0))
        peg.setAttribute('y', y + j + (j > 0 ? 1 : 0) + (j > 1 ? 2 : 0));
        row.appendChild(peg)
        peg.addEventListener("click", () => setSelectedPeg(peg)); i++;
      }
      board.appendChild(row)
    }
  }

  // center should be empty - as per rules of the game.
  getPegAt(1, 3).classList.remove("on");

  calculateMoveCount()
}

window.addEventListener("load", init)
