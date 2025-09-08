let selectedPeg = null;

const hidePossibleMoves = () => {
	Array.from(document.querySelectorAll(".possible")).forEach((el)=>el.classList.remove("possible"))}

const getPegCoordinates = (peg) => {
	return {x:peg.getAttribute("x"),y:peg.getAttribute("y")};
}

const showPossibleMoves = (peg) => {
	const {x,y} = getPegCoordinates(peg);

	const possibleMoves = [];
	
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

const getPegByIndex = (index) => {
	return	document.querySelector(`.peg[i='${index}']`)
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
				peg.setAttribute('x',x - (special ? 2 : 0));
				peg.setAttribute('y',(j*(rowHeight + (j==2 ? 1 : 0)))+y);
				peg.setAttribute('i', `${peg.getAttribute('x')}:${peg.getAttribute('y')}`);
				row.appendChild(peg)
				peg.addEventListener("click",()=>setSelectedPeg(peg));				i++;
			}
			board.appendChild(row)
		}
	}

	getPegByCoordinates(1,4).classList.remove("on");

}

window.addEventListener("load", init)
