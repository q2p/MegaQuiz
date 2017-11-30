function startDialogue(writings:Writings, id:number, onCompletition?:()=>any):void {
	var event:WritingsEvent;
	do {
		event = writings.events[id++];
		switch(event.type) {
			case 0:
				event.portraitContainer.style.backgroundImage = 'url(\''+event.portraitNew+'\')';
				break;
			case 1:
				for(var a of writings.sounds) {
					if(a == event.soundNew) {
						a.currentTime = 0;

						if(a.paused)
							a.play();
					} else {
						if(!a.paused)
							a.pause();
					}
				}
				break;
			case 2:
				event.letter.classList.remove('writing_hidden');
				break;
		}
	} while(event.sleep == 0);

	if(writings.events.length == id) {
		if(onCompletition != undefined)
			onCompletition();
	} else {
		setTimeout(function() {
			startDialogue(writings, id, onCompletition)
		}, event.sleep);
	}
}

function secondCharacterGenerateDialogue(container:Element, ...args:any[]):Writings {
	var events:WritingsEvent[] = [];
	var soundsEls:HTMLAudioElement[] = [];
	var soundsNames:string[] = [];
	var currentBlock:HTMLElement = null;
	var currentPortrait:HTMLElement = null;
	var currentLetterHolder:HTMLElement = null;
	for(var i:number = 0; i < args.length; i++) {
		switch(args[i]) {
			case 'n':
				currentBlock = document.createElement('div');
				currentBlock.classList.add('writing_block');
				container.appendChild(currentBlock);

				currentPortrait = document.createElement('div');
				currentPortrait.classList.add('writing_portrait');
				currentBlock.appendChild(currentPortrait);

				currentLetterHolder = document.createElement('div');
				currentLetterHolder.classList.add('writing_letters');
				currentBlock.appendChild(currentLetterHolder);
				break;
			case 'p':
				events[events.length] = { type: 0, sleep: args[++i], portraitContainer: currentPortrait, portraitNew: 'i/'+args[++i] };
				break;
			case 's':
				var sleep:number = args[++i];
				var name:string = args[++i];
				var el:HTMLAudioElement = null;

				if(name != null) {
					for(var j = 0; j != soundsNames.length; j++)
						if(soundsNames[j] == name)
							el = soundsEls[j];
					
					if(el == null) {
						el = document.createElement('audio');

						soundsNames[soundsNames.length] = name;

						soundsEls[soundsEls.length] = el;

						el.src = 'i/'+name;

						if(container.hasChildNodes)
							container.insertBefore(el, container.firstChild);
						else
							container.appendChild(el);
					}
				}

				events[events.length] = { type: 1, sleep: sleep, soundNew: el };
				break;
			case 't':
				var delay:number = args[++i];
				var input:string = args[++i];

				for(var j:number = 0; j != input.length; j++) {
					var letterEl:HTMLElement = document.createElement('span');

					currentLetterHolder.appendChild(letterEl);

					letterEl.innerText = input.charAt(j);

					letterEl.classList.add('writing_hidden');

					events[events.length] = { type: 2, sleep: delay, letter: letterEl }
				}
				break;
		}
	}

	return {container: container, sounds: soundsEls, events: events};
}

interface Writings {
	container:Element;
	sounds:HTMLAudioElement[];
	events:WritingsEvent[];
}

interface WritingsEvent {
	type:number; // 0 = p 1 = s 2 = t
	sleep?:number;

	portraitContainer?:HTMLElement;
	portraitNew?:string;

	soundNew?:HTMLAudioElement;

	letter?:HTMLSpanElement;
}