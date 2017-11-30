function audioFadeIn(audio:HTMLAudioElement, milisec:number, afterCompletition:()=>void):number {
	audio.volume = 0;

	var tId = setInterval(function() {
		audio.volume = Math.min(1, audio.volume + 50/milisec);
		if(audio.volume >= 1) {
			audio.volume = 1;
			clearInterval(tId);

			afterCompletition();
		}
	}, 50);

	return tId;
}

function audioFadeOut(audio:HTMLAudioElement, milisec:number, afterCompletition:()=>void):number {
	var tId = setInterval(function() {
		audio.volume = Math.max(0, audio.volume - 50/milisec);
		if(audio.volume <= 0) {
			audio.volume = 0;
			clearInterval(tId);

			afterCompletition();
		}
	}, 50);

	return tId;
}