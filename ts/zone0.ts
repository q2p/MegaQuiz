var zone0:HTMLElement = null;

var zone0Text:HTMLElement = null;

var zone0Bundle:HTMLElement = null;

var zone0FadeTime:number = 2000;

function zone0Init():void {
	zone0 = document.getElementById('zone0');
	zone0Bundle = document.getElementById('zone0_bundle');
}

function zone0FadeIn(forward:boolean):void {
	zone0.classList.remove('hidden');
	zone0Bundle.classList.add('zone0_fade_in');

	setTimeout(function():void {
		zone0Bundle.classList.remove('zone0_fade_in');
		setScrollListeners(zone0FadeOut);
	}, zone0FadeTime);
}

function zone0FadeOut(forward:boolean):void {
	setScrollListeners(null);
	if(forward)
		secondCharacterFadeInInit(true);
	else
		zone0Bundle.classList.add('zone0_fade_out');
	
	setTimeout(function():void {
		zone0.classList.add('hidden');
		zone0Bundle.classList.remove('zone0_fade_out');
		if(forward)
			secondCharacterFadeIn(true);
		else {
			zone0Bundle.classList.remove('zone0_fade_out');
			introducementFadeIn(3, false);
		}
	}, zone0FadeTime);
}