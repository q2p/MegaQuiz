var shake:HTMLElement = null;

var shakeWindow:HTMLElement = null;

var shakeFadeTime:number = 500;

function shakeInit():void {
	shake = document.getElementById('shake');
	shakeWindow = document.getElementById('shake_window');
}

function shakeFadeIn():void {
	shake.classList.remove('hidden');
	shakeWindow.classList.add('rating_fade_in');

	setTimeout(function():void {
		shakeWindow.classList.remove('rating_fade_in');
		setScrollListeners(shakeFadeOut);
	}, shakeFadeTime);
}

function shakeFadeOut():void {
	setScrollListeners(null);
	shakeWindow.classList.add('rating_fade_out');
	setTimeout(function():void {
		shake.classList.add('hidden');
		shakeWindow.classList.remove('rating_fade_out');
		zone0FadeIn(false);
	}, shakeFadeTime);
}