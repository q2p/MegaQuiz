const offTitleFadeTime:number = 11000;

var offTitleContainer:HTMLElement;
var offTitleBG:HTMLElement;
var offTitleAudio:HTMLAudioElement;

function offTitleInit():void {
	offTitleContainer = document.getElementById('off_title');
	offTitleBG = document.getElementById('off_title_background');
	offTitleAudio = <HTMLAudioElement>document.getElementById('off_title_audio');
}

function offTittleFadeIn():void {
	offTitleContainer.classList.remove('hidden');
	
	offTitleContainer.classList.add('off_title_cont_anim');

	offTitleBG.classList.add('off_title_BG_anim');

	if(!offTitleAudio.paused)
		offTitleAudio.pause();

	offTitleAudio.currentTime = 0;
	
	offTitleAudio.play();

	setTimeout(function():void {
		offTitleContainer.classList.add('hidden');
		offTitleContainer.classList.remove('off_title_cont_anim');
		offTitleBG.classList.remove('off_title_BG_anim');
		
		zone0FadeIn(true);
	}, offTitleFadeTime);
}