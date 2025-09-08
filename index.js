let selectedPeg = null;

const hidePossibleMoves = () => {
	Array.from(document.querySelectorAll(".possible")).forEach((el)=>el.classList.remove("possible"))}

const getPegCoordinates = (peg) => {
	return {x:parseInt(peg.getAttribute("x")),y:parseInt(peg.getAttribute("y"))};
}

const showPossibleMoves = (peg) => {
	const {x,y} = getPegCoordinates(peg);

	// x+2 y+2 x-2 y-2

	const possibleMoves = [];

	const offsets = [2,-2];
	
	offsets.forEach(offset=>possibleMoves.push(getPegByCoordinates(x+offset,y)))
	offsets.forEach(offset=>possibleMoves.push(getPegByCoordinates(x,y+offset)))
	
	console.log(possibleMoves)

	possibleMoves.filter(el=>el!=null).filter(el=>!el.classList.contains("on")).forEach((el)=>el.classList.add("possible"))
	
}

const setSelectedPeg =(peg) =>{
	if(selectedPeg){
		selectedPeg.classList.remove("selected");
	}
	selectedPeg = peg
	selectedPeg.classList.add("selected");
	
	hidePossibleMoves();
	showPossibleMoves(peg);

}

const getPegByCoordinates = (x,y) => {
	return document.querySelector(`[x="${x}"][y="${y}"]`)
}

const init = () => {
	let rowHeight = 2;
	let rowLength = 2;
	let i = 0;
	for(let j = 0; j < 3; j++){
		let special = (j==1)
		rowHeight = special ? 3 : 2;
		rowLength = special ? 7 : 3;
		for(let y = 0; y< rowHeight; y++){
			let row = document.createElement("div")
			row.classList.add("row")

			for(let x = 0;x < rowLength; x++){
				let peg = document.createElement("div")
				peg.classList.add("peg")
				peg.classList.add("on");
				peg.setAttribute('x',x - (special ? 2 : 0))
				peg.setAttribute('y',(j*(rowHeight-1) + (j==2 ? 1 : 0)+y));
				peg.setAttribute('i', `${peg.getAttribute('x')}:${peg.getAttribute('y')}`);
				row.appendChild(peg)
				peg.addEventListener("click",()=>setSelectedPeg(peg));				i++;
			}
			board.appendChild(row)
		}
	}

	getPegByCoordinates(1,3).classList.remove("on");

}

window.addEventListener("load", init)
