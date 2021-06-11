"use strict";
/** Memory game: find matching pairs of cards and flip both of them. */

// Make sure DOM is loaded before doing any javascript
document.addEventListener('DOMContentLoaded', function() {
	
	const FOUND_MATCH_WAIT_MSECS = 1000;
	const COLORS = [
		"w", "u", "b", "r", "g", "c",
		"w", "u", "b", "r", "g", "c"
	];

	const colors = shuffle(COLORS);
	
	
	createCards(colors);
	
	let howManySelected=0;
	let cards = document.getElementsByClassName('flip-card-inner');
	let selectedCard="";
	//reset game
	document.getElementById('resetButton').addEventListener("click", function(){resetGame()});
	

	/** Shuffle array items in-place and return shuffled array. */

	function shuffle(items) {
	  // This algorithm does a "perfect shuffle", where there won't be any
	  // statistical bias in the shuffle (many naive attempts to shuffle end up not
	  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
	  // you're interested, you can learn about it, but it's not important.

	  for (let i = items.length - 1; i > 0; i--) {
		// generate a random index between 0 and i
		let j = Math.floor(Math.random() * i);
		// swap item at i <-> item at j
		[items[i], items[j]] = [items[j], items[i]];
		//I should keep this trick in mind to swap stuff, I've always declared a new variable to hold items to be swapped.
	  }

	  return items;
	}

	/** Create card for every color in colors (each will appear twice)
	 *
	 * Each div DOM element will have:
	 * - a class with the value of the color
	 * - an click listener for each card to handleCardClick
	 */

	function createCards(colors) {
		const gameBoard = document.getElementById("game");
	
		for (let color of colors) {
			// console.log(color)
			gameBoard.insertAdjacentHTML('beforeend', `
					<div class="flip-card">
					  <div class="flip-card-inner `+color+`">
						<div class="flip-card-front">
						  <img src="Mtg_back.png" alt="mtg-back" >
						</div>
						<div class="flip-card-back">
						  <img src="mtg-`+color+`.jpg">
						</div>
					  </div>
					</div>
			`);
			
			document.querySelector('#game').lastElementChild.addEventListener("click", function(evt){
				if(evt.target.tagName==="IMG"){
					// alert("the event is "+evt.target.parentNode.parentNode.classList);
					handleCardClick(evt);
				}
			})
			
		}
	  
	}
	
	

	/** Flip a card face-up. */

	function flipCard(card) {
		if(!card.classList.contains('is-flipped')){
			card.classList.add('is-flipped', 'selected');
		}
		
	}

	/** Flip a card face-down. */

	function unFlipCard(card) {
		if(card.classList.contains('is-flipped')){
			card.classList.remove('is-flipped', 'selected');
		}
	}

	/** Handle clicking on a card: this could be first-card or second-card. */
	function handleCardClick(evt) {
		
		let card=evt.target.parentNode.parentNode;
		
		// card.classList.toggle('is-flipped');
		// card.classList.toggle('selected');
		// alert(card.classList.toString());
		
		
		if(howManySelected===0 && !card.classList.contains('is-flipped')){
			flipCard(card);
			howManySelected++;
			selectedCard=card.classList;
		}else if(howManySelected===1 && !card.classList.contains('is-flipped')){
			howManySelected++;
			flipCard(card);
			if(card.classList.toString()!==selectedCard.toString()){
				setTimeout(function(){
					document.querySelectorAll(".selected").forEach(ele=>{unFlipCard(ele)});
					howManySelected=0;
				},FOUND_MATCH_WAIT_MSECS);	
			}else{
				for(let i=0;i<cards.length;i++){
						cards[i].classList.remove('selected');
						howManySelected=0;
					}
			}
			
		}
		
	}
	
	function resetGame(){
		document.getElementById("game").replaceChildren();
		createCards(shuffle(COLORS));
	}


});