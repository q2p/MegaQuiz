const introducements:IntroducementFrame[] = [];

const introducementFadeTime:number = 500;

var introducementFrameId:number = -1;

function introducementInit():void {
	for(var i = 0; i != 4; i++)
		introducements[i] = introducementGenerate(i);
}

function introducementGenerate(id:number):IntroducementFrame {
	return {
		container: document.getElementsByClassName('introducement')[id],
		text: document.getElementsByClassName('introducement_text')[id]
	};
}

interface IntroducementFrame {
	container:Element;
	text:Element;
}

function introducementFadeIn(id:number, forward:boolean):void {
	introducementFrameId = id;

	introducements[introducementFrameId].container.classList.remove('hidden');
	
	if(introducementFrameId == 0 && forward)
		introducements[introducementFrameId].container.classList.add('introducement_fade_in');
	else if(!forward && introducementFrameId == 3)
		introducements[introducementFrameId].container.classList.add('introducement_fade_in_zone0');
	else
		introducements[introducementFrameId].text.classList.add('introducement_fade_in');

	setTimeout(function():void {
		if(introducementFrameId == 0 && forward)
			introducements[introducementFrameId].container.classList.remove('introducement_fade_in');
		else if(!forward && introducementFrameId == 3)
			introducements[introducementFrameId].container.classList.remove('introducement_fade_in_zone0');
		else
			introducements[introducementFrameId].text.classList.remove('introducement_fade_in');
		
		setScrollListeners((introducementFrameId == 0 ? null : introducementFadeOut), introducementFadeOut);
	}, introducementFadeTime);
}

function introducementFadeOut(forward:boolean):void {
	setScrollListeners(null);

	if(forward && introducementFrameId == 3)
		introducements[introducementFrameId].container.classList.add('introducement_fade_out');
	else
		introducements[introducementFrameId].text.classList.add('introducement_fade_out');
	
	setTimeout(function():void {
		introducements[introducementFrameId].container.classList.add('hidden');

		if(forward && introducementFrameId == 3)
			introducements[introducementFrameId].container.classList.remove('introducement_fade_out');
		else
			introducements[introducementFrameId].text.classList.remove('introducement_fade_out');

		if(forward) {
			if(introducementFrameId == 0)
				ratingFadeIn();
			else if(introducementFrameId == 3) {
				offTittleFadeIn();
			} else
				introducementFadeIn(introducementFrameId+1, true);
		} else {
			if(introducementFrameId == 1)
				ratingFadeIn();
			else
				introducementFadeIn(introducementFrameId-1, false);
		}
	}, introducementFadeTime);
}