var optimizedContainer:HTMLElement = null;
var optimizedButton:HTMLElement = null;

const fadeOutTime = 1000;

function optimizedInit() {
	optimizedContainer = document.getElementById('optimized_container');
	optimizedButton = document.getElementById('optimized_button');
}

function optimizedClick():void {
	optimizedButton.removeAttribute('onclick');

	optimizedContainer.classList.add('optimized_fade_out');
	
	setTimeout(optimizedOnTimeout, fadeOutTime);
}

function optimizedOnTimeout():void {
	document.body.removeChild(optimizedContainer);

	viewport.classList.remove('hidden');
	scrollButtonsContainer.classList.remove('hidden');

	introducementFadeIn(0, true); // TODO:
	//secondCharacterFadeInInit(true);
	//secondCharacterFadeIn(true);
}