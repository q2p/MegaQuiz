var zone0Container:HTMLElement = null;
var japhetTower:HTMLElement = null;

var viewport:HTMLElement = null;

var scrollButtonsContainer:HTMLElement = null;
var scrollButtons:HTMLElement[] = [];

var scrollListeners:((forward?:boolean)=>any)[] = [];

function initilize():any {
	optimizedInit();
	introducementInit();
	ratingInit();
	offTitleInit();
	zone0Init();
	secondCharacterInit();
	// shakeInit();
	viewport = document.getElementById('viewport');
	zone0Container = document.getElementById('zone0');
	japhetTower = document.getElementById('japhet_tower');

	scrollButtonsContainer = document.getElementById('scroll_buttons_container');

	scrollButtons[0] = document.getElementById('scroll_button_left');
	scrollButtons[1] = document.getElementById('scroll_button_right');

	scrollListeners[0] = null;
	scrollListeners[1] = null;

	document.onkeydown = checkKeyPress;

	//optimizedClick(); // TODO:
}

function checkKeyPress(event:KeyboardEvent):void {
	if(event.keyCode == 37)
		changePosition(0);
	else if(event.keyCode == 39)
		changePosition(1);
};

function changePosition(id:number):void {
	if(scrollListeners[id] != null)
		scrollListeners[id](id == 1);
}

function setScrollListeners(back:(forward?:boolean)=>any, forward?:(forward?:boolean)=>any):void {
	if(forward == undefined)
		forward = back;
	
	scrollListeners[0] = back;
	scrollListeners[1] = forward;
}