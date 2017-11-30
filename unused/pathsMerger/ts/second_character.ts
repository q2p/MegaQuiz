var secondCharacter:HTMLElement = null;

var secondCharacterFadeInTime:number = 2000;

var secondCharacterLetters:HTMLCollectionOf<Element> = null;

var secondCharacterState:number = -1; /* hoi, im aching, im batter, fine*/ // TODO: диалог раскрывается при нажатии клавишь

var secondCharacterStart:HTMLElement = null;
var secondCharacterDialogueWrappers:HTMLCollectionOf<Element> = null;
var secondCharacterDialogueContainers:HTMLCollectionOf<Element> = null;

var secondCharacterWritings:Writings[] = [];

var secondCharacterAudio:HTMLAudioElement = null;
var secondCharacterAudioTimeout:number = -1;

function secondCharacterInit():void {
	secondCharacter = document.getElementById('second_character');

	secondCharacterStart = document.getElementById('second_character_start_wrapper');
	secondCharacterDialogueWrappers = document.getElementsByClassName('second_character_dialogue_wrapper');

	secondCharacterDialogueContainers = document.getElementsByClassName('second_character_dialogue_blink');

	secondCharacterAudio = <HTMLAudioElement>document.getElementById('second_character_audio');

	secondCharacterWritings[0] = secondCharacterGenerateDialogue(
		secondCharacterDialogueContainers[0],
		'n',
		'p', 0, 'z0/judge3.png',
		's', 0, 'snd/JudgeTalk.wav',
		't', 100, 'Я',
		't', 700, ' ',
		't', 50, 'представлю себя.',
		't', 200, ' ',
		't', 50, 'Меня зовут Судья, и мне не терпится узнать твоё имя!',
		'n',
		'p', 0, 'z0/batter.png',
		's', 0, null,
		't', 50, 'Я Бэттер. Мне была доверена священная миссия.',
		'n',
		'p', 0, 'z0/judge3.png',
		's', 0, 'snd/JudgeTalk.wav',
		't', 50, 'Приятно познакомится, однако я обращался не к кукле, а к кукловоду. Как тебя зовут, кукловод?'
	);

	secondCharacterWritings[1] = secondCharacterGenerateDialogue(
		secondCharacterDialogueContainers[1],
		'n',
		'p', 0, 'z0/batter.png',
		's', 0, null,
		't', 50, 'Я думаю, что мы нуждаемся в твоих услугах.',
	);

	secondCharacterWritings[2] = secondCharacterGenerateDialogue(
		secondCharacterDialogueContainers[2],
		'n',
		'p', 0, 'z0/judge3.png',
		's', 0, 'snd/JudgeTalk.wav',
		't', 100, 'Я понял... но какого рода помощь я могу предложить эктоплазматическому созданию?'
	);

	secondCharacterWritings[3] = secondCharacterGenerateDialogue(
		secondCharacterDialogueContainers[3],
		'n',
		'p', 0, 'z0/batter.png',
		's', 0, null,
		't', 50, 'Мне была доверена священная миссия. Я должен очистить мир.',
		'n',
		'p', 0, 'z0/judge3.png',
		's', 0, 'snd/JudgeTalk.wav',
		't', 50, 'Нет цели более доброкачественной, чем твоя. Я согласен служить тебе гидом, если это как-либо поможет тебе.'
	);
}

function secondCharacterFadeInInit(forward:boolean) {
	secondCharacterState = 0;

	secondCharacter.classList.remove('hidden');
	secondCharacter.classList.add('second_character_fade_in');

	secondCharacterStart.classList.remove('hidden');
	secondCharacterDialogueWrappers[0].classList.add('hidden');
	secondCharacterDialogueWrappers[1].classList.add('hidden');

	secondCharacterAudio.currentTime = 0;
	secondCharacterAudio.play();

	secondCharacterAudioTimeout = audioFadeIn(secondCharacterAudio, 3000, function():void {
		secondCharacterAudioTimeout = -1;
	});
}

function secondCharacterFadeIn(forward:boolean):void {
	setTimeout(function():void {
		secondCharacter.classList.remove('second_character_fade_in');
		setScrollListeners(secondCharacterFadeOut, secondCharacterFadeOut);
		secondCharacterState = 0;
	}, secondCharacterFadeInTime);
}

function secondCharacterFadeOut(forward:boolean):void {
	setScrollListeners(null); // TODO: fade

	if(secondCharacterState == 0) {
		if(forward) {
			secondCharacterStart.classList.add('hidden');
			secondCharacterDialogueWrappers[0].classList.remove('hidden');
			startDialogue(secondCharacterWritings[0], 0);
			secondCharacterState = 1;
			setScrollListeners(secondCharacterFadeOut);
		} else {
			// TODO: fadeout
		}
	} else if(secondCharacterState == 1) {
		if(forward) {
			secondCharacterDialogueWrappers[0].classList.add('hidden');
			secondCharacterDialogueWrappers[1].classList.remove('hidden');
			startDialogue(secondCharacterWritings[1], 0, function() {
				startDialogue(secondCharacterWritings[2], 0);
			});
			secondCharacterState = 2;
			setScrollListeners(secondCharacterFadeOut);
		} else {
			secondCharacterDialogueWrappers[1].classList.add('hidden');
			secondCharacterDialogueWrappers[0].classList.remove('hidden');
			startDialogue(secondCharacterWritings[0], 0);
			secondCharacterState = 1;
			setScrollListeners(secondCharacterFadeOut);
		}
	} else if(secondCharacterState == 2) {
		if(forward) {
			secondCharacterDialogueWrappers[1].classList.add('hidden');
			secondCharacterDialogueWrappers[2].classList.remove('hidden');
			startDialogue(secondCharacterWritings[3], 0);
			secondCharacterState = 3;
			setScrollListeners(secondCharacterFadeOut);
		} else {
			secondCharacterDialogueWrappers[2].classList.add('hidden');
			secondCharacterDialogueWrappers[1].classList.remove('hidden');
			startDialogue(secondCharacterWritings[1], 0);
			secondCharacterState = 1;
			setScrollListeners(secondCharacterFadeOut);
		}
	} else {
		if(forward) {
			if(secondCharacterState == 3) {
				// TODO: fadeout
			} else {
				// TODO: next
			}
		} else {
			// TODO: 0
		}
	}

	/*secondCharacter.classList.add('second_character_fade_out');
	setTimeout(function():void {
		secondCharacter.classList.add('hidden');
		secondCharacter.classList.remove('second_character_fade_out');
		if(forward) {
			
		} else
			zone0FadeIn(false);
	}, secondCharacterFadeInTime);*/
}