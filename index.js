// TODO please create a layer of separation between DOM and game logic - to increase performance

let selectedPeg;

// dashboard buttons...

const rotateBoard = (degrees) => {
  board.style.rotate = `${parseInt(board.style.rotate.slice(0, -3) || 0) + degrees}deg`;
}

rotateLeftButton.onclick = () => rotateBoard(90)
rotateRightButton.onclick = () => rotateBoard(-90)

resetButton.onclick = () => init();
undoButton.onclick = () => {
  const popped = moves.pop();
  if (!popped) {
    return;
  }
  const { origin, center, target } = popped;
  makeMove(target, center, origin, true)
}

const hidePossibleMoves = () => Array.from(document.querySelectorAll(".possible")).forEach((el) => el.classList.remove("possible"))

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
  target.classList.add("on");
  undo ? center.classList.add("on") : center.classList.remove("on")

  calculateMoveCount();
}


const calculateMovesAtPosition = (x, y) => {
  const offsets = [-2, 2];
  return [
    offsets.map((offset) => { return { origin: getPegAt(x, y), center: getPegAt(x + offset / 2, y), target: getPegAt(x + offset, y) } }),
    offsets.map((offset) => { return { origin: getPegAt(x, y), center: getPegAt(x, y + offset / 2), target: getPegAt(x, y + offset) } })
  ]
    .flat()
    .filter(({ origin, center, target }) => origin && origin.classList.contains("on") &&
      center && center.classList.contains("on") &&
      target && !target.classList.contains("on"))
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
  let possibleMovesCount = 0;
  Array.from(board.children).forEach((row) => {
    Array.from(row.children).forEach((peg) => {
      if (peg.classList.contains("on")) {
        pegCount++;
      }
      const { x, y } = getPegPos(peg)
      possibleMovesCount += calculateMovesAtPosition(x, y).length
    })
  })

  pegCountSpan.innerText = pegCount;
  possibleMovesCountSpan.innerText = possibleMovesCount;

  if (possibleMovesCount != 0) {
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

  for (let j = 0; j < 3; j++) {
    let center = (j == 1)
    rowHeight = center ? 3 : 2;
    rowLength = center ? 7 : 3;
    for (let y = 0; y < rowHeight; y++) {
      let row = document.createElement("div")
      row.classList.add("row")

      for (let x = 0; x < rowLength; x++) {
        let peg = document.createElement("div")
        peg.classList.add("peg")
        peg.classList.add("on");

        // if center then do some magic so the x pos makes sense
        // its relative to center, so pegs at the left side have negative x pos 
        peg.setAttribute('x', x - (center ? 2 : 0))
        // a lot of magic numbers - all you need to know is that it works
        peg.setAttribute('y', y + j + (j > 0 ? 1 : 0) + (j > 1 ? 2 : 0));

        peg.addEventListener("click", () => setSelectedPeg(peg));

        row.appendChild(peg)
      }
      board.appendChild(row)
    }
  }

  // center should be empty - as per rules of the game.
  getPegAt(1, 3).classList.remove("on");

  calculateMoveCount()
}

const popupRoot = document.getElementById("popup-root");
const popupBackground = popupRoot.querySelector(".popup-background")
const popupContent = popupRoot.querySelector(".popup-content")

function closePopup(){
	popupBackground.classList.remove("visible");
	
}

addEventListener("keydown",(e)=>e.key == "Escape" ? closePopup() : null)

function showPopup(title, content){
	popupBackground.classList.add("visible");
	popupBackground.onclick = closePopup;
	popupContent.innerHTML = `<p class='title'>${title}</p><div>${content}</div>`
}

function showGameWalkthroughInfo(){
	const title = "<strong >Jak grać w Samotnika?</strong>";
    const content = `
        <strong>Cel gry:</strong> Zostawić na planszy tylko jeden pionek, najlepiej w samym centrum.<br><br>
        <strong>Zasady:</strong><ul style="text-align: left; margin-top: 10px;">
            <li>Pionek bije innego pionka, przeskakując nad nim w pionie lub poziomie na wolne pole.</li>
            <li>Zbity pionek zostaje usunięty z planszy.</li>
            <li>Nie można poruszać się po skosie ani przeskakiwać nad pustymi polami.</li>
        </ul>
	<br>
        <strong>Wskazówka:</strong> Planuj ruchy tak, aby nie zostawiać pojedynczych pionków w rogach – trudno je potem "odebrać"!
	<br><br><p style='text-align:center;font-weight:700'>Powodzenia! (kliknij gdziekolwiek na ekranie lub ESC aby kontynuować)</p>
    `;
showPopup(title, content);
}

init()
showGameWalkthroughInfo();
