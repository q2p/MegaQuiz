var rating:HTMLElement = null;

var ratingText:HTMLElement = null;

var ratingElements:HTMLCollectionOf<Element> = null;

var ratingFadeTime:number = 500;
var ratingPopDelay:number = 100;

var ratingTimeout:number = null;

function ratingInit():void {
	rating = document.getElementById('rating');
	ratingText = document.getElementById('rating_wrapper');
	ratingElements = document.getElementsByClassName('rating_flow');
}

function ratingFadeIn():void {
	for(var i = 0; i != ratingElements.length; i++)
		ratingElements[i].classList.remove('rating_flowed');

	rating.classList.remove('hidden');
	ratingText.classList.add('rating_fade_in');

	setTimeout(function():void {
		ratingText.classList.remove('rating_fade_in');
		ratingPopId = 0;
		ratingPop();
		setScrollListeners(ratingFadeOut);
	}, ratingFadeTime);
}

var ratingPopId:number = null;

function ratingPop():void {
	if(ratingPopId == ratingElements.length) {
		ratingTimeout = null;
		return;
	}
	ratingElements[ratingPopId].classList.add('rating_flowed');
	ratingPopId++;
	ratingTimeout = setTimeout(ratingPop, ratingPopDelay);
}

function ratingFadeOut(forward:boolean):void {
	setScrollListeners(null);
	ratingText.classList.add('rating_fade_out');
	setTimeout(function():void {
		if(ratingTimeout != null)
			clearTimeout(ratingTimeout);

		rating.classList.add('hidden');
		ratingText.classList.remove('rating_fade_out');
		if(forward)
			introducementFadeIn(1, true);
		else
			introducementFadeIn(0, false);
	}, ratingFadeTime);
}