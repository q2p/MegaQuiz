var canvasBox:HTMLElement;
var canvas:HTMLCanvasElement;

var dots:Array<Dot>;

var croshairs:[Croshair, Croshair] = [null, null];

function initilize():void {
	canvasBox = document.getElementById('box');
	canvas = document.getElementsByTagName('canvas').item(0);

	var parsed:Array<Array<number>> = JSON.parse(prompt('Введи точки.'));

	for(var path of parsed) {
		var tempDots:Array<Dot> = [];

		// TODO: разбить числа на X и Y точек.

		var lastDot:Dot = null;

		for(var dot of path) {
			if(lastDot != null) {
				lastDot.connectedTo.push(dot);
				dot.connectedTo.push(lastDot);
			}
			lastDot = dot;
			tempDots.push(lastDot);
		}
		// TODO: мержить с общим массивом
	}

	resized();
}

function resized():void {
	canvas.setAttribute('width', canvasBox.clientWidth.toString());
	canvas.setAttribute('height', canvasBox.clientHeight.toString());
}

interface Dot {
	readonly x:number;
	readonly y:number;
	readonly connectedTo:Array<Dot>;
}

interface Croshair {
	readonly x:number;
	readonly y:number;
	readonly radius:number;
}