interface Point {
	x:number;
	y:number;
}

class ReflectionPoint {
	mapX:number;
	mapY:number;
	screenX:number;
	screenY:number;

	constructor(mapX:number, mapY:number, screenX:number, screenY:number) {
		this.mapX = mapX;
		this.mapY = mapY;
		this.screenX = screenX;
		this.screenY = screenY;
	}
}

class GrabPoint {
	screenX:number = 0;
	screenY:number = 0;

	pointerId:any = null;
}

class Geography {
	// TODO: при отпускании указателя и быстром движении карта должна продолжать скользить по инерции.
	// TODO: threshold при касании пальцем, чтобы карта не дрожала, когда пальцы слабо двигаются.

	public static readonly mapWidth  = 612;
	public static readonly mapHeight = 792;

	private static viewportWidth:number;
	private static viewportHeight:number;

	private static viewportOffsetX:number;
	private static viewportOffsetY:number;

	private static readonly zoomMax = 3;
	private static readonly zoomStep = 1.2;
	private static zoom:number = 1;
	private static zoomSteps:number = 0;

	private static readonly mapContainer:HTMLElement = document.getElementById('map_container');
	private static readonly mapGroup:HTMLElement = document.getElementById('map_group');
	private static readonly mapLines:HTMLElement = document.getElementById('map_lines');
	private static readonly mapLinesCover:HTMLElement = document.getElementById('map_lines_cover');

	private static activeGrabingPointers:0|1|2 = 0;
	private static readonly grabPoint1:GrabPoint = new GrabPoint();
	private static readonly grabPoint2:GrabPoint = new GrabPoint();
	private static grabMapDistance:number = 0;
	private static grabDistance:number = 0;

	private static readonly mapOffset:Point = {x:(+Geography.mapWidth)/2, y:(Geography.mapHeight)/2};

	private static readonly grabRotationCenter:Point = {x:Geography.mapOffset.x, y:Geography.mapOffset.y};

	static init():void {
		Geography.mapContainer.addEventListener('mousewheel', Geography.mouseWheel, false);
		Geography.mapContainer.addEventListener('pointerdown', Geography.pointerDown, false);
		Geography.mapContainer.addEventListener('pointerup', Geography.pointerUp, false);
		Geography.mapContainer.addEventListener('pointermove', Geography.pointerMove, false);

		window.addEventListener('resize', Geography.onResize, false);

		Geography.onResize();
	}

	static pointerDown(event:PointerEvent):boolean {
		console.log(event.srcElement);

		if(Geography.activeGrabingPointers == 2)
			return false;

		const grabPoint:GrabPoint = Geography.activeGrabingPointers == 0 ? Geography.grabPoint1 : Geography.grabPoint2;

		grabPoint.pointerId = event.pointerId;

		grabPoint.screenX = event.clientX;
		grabPoint.screenY = event.clientY;

		let cx, cy;

		if(Geography.activeGrabingPointers == 1) {
			cx = (Geography.grabPoint1.screenX + Geography.grabPoint2.screenX)/2;
			cy = (Geography.grabPoint1.screenY + Geography.grabPoint2.screenY)/2;

			let xDiff = Geography.grabPoint1.screenX - Geography.grabPoint2.screenX;
			let yDiff = Geography.grabPoint1.screenY - Geography.grabPoint2.screenY;

			Geography.grabMapDistance = Geography.pixelsToUnits(Math.sqrt(xDiff*xDiff + yDiff*yDiff));
		} else {
			cx = grabPoint.screenX;
			cy = grabPoint.screenY;
		}

		Geography.grabRotationCenter.x = Geography.mapOffset.x + Geography.pixelsToUnits(cx - Geography.viewportWidth /2);
		Geography.grabRotationCenter.y = Geography.mapOffset.y + Geography.pixelsToUnits(cy - Geography.viewportHeight/2);

		Geography.activeGrabingPointers++;

		return false;
	}

	static pointerMove(event:PointerEvent):boolean {
		console.log(event);

		if(Geography.activeGrabingPointers == 0)
			return true;

		let grabPoint:GrabPoint;

		let cx, cy;
		if(Geography.activeGrabingPointers == 1) {
			if(Geography.grabPoint1.pointerId != event.pointerId)
				return true;

			Geography.grabPoint1.screenX = event.clientX;
			Geography.grabPoint1.screenY = event.clientY;
			cx = event.clientX;
			cy = event.clientY;
		} else {
			if(Geography.grabPoint1.pointerId == event.pointerId) {
				grabPoint = Geography.grabPoint1;
			} else if(Geography.grabPoint2.pointerId == event.pointerId) {
				grabPoint = Geography.grabPoint2;
			} else {
				return true;
			}

			grabPoint.screenX = event.clientX;
			grabPoint.screenY = event.clientY;

			cx = (Geography.grabPoint1.screenX + Geography.grabPoint2.screenX)/2;
			cy = (Geography.grabPoint1.screenY + Geography.grabPoint2.screenY)/2;

			const xDiff = Geography.grabPoint1.screenX - Geography.grabPoint2.screenX;
			const yDiff = Geography.grabPoint1.screenY - Geography.grabPoint2.screenY;

			Geography.zoom = Math.sqrt(xDiff*xDiff + yDiff*yDiff) / Geography.grabMapDistance;

			Geography.zoomSteps = 0;
		}

		Geography.mapOffset.x = Geography.grabRotationCenter.x - Geography.pixelsToUnits(cx - Geography.viewportWidth /2);
		Geography.mapOffset.y = Geography.grabRotationCenter.y - Geography.pixelsToUnits(cy - Geography.viewportHeight/2);

		Geography.render();

		return true;
	}

	static pointerUp(event:PointerEvent):boolean {
		console.log(event);

		let grabPointX:number;
		let grabPointY:number;

		let leftGrabPoint:GrabPoint;

		if(Geography.activeGrabingPointers > 0 && Geography.grabPoint1.pointerId == event.pointerId) {
			grabPointX = Geography.grabPoint1.screenX;
			grabPointY = Geography.grabPoint1.screenY;
			Geography.grabPoint1.screenX   = Geography.grabPoint2.screenX;
			Geography.grabPoint1.screenY   = Geography.grabPoint2.screenY;
			Geography.grabPoint1.pointerId = Geography.grabPoint2.pointerId;
		} else if(Geography.activeGrabingPointers == 2 && Geography.grabPoint2.pointerId == event.pointerId) {
			grabPointX = Geography.grabPoint2.screenX;
			grabPointY = Geography.grabPoint2.screenY;
		} else {
			return true;
		}

		if(Geography.activeGrabingPointers == 2) {
			Geography.grabRotationCenter.x = Geography.mapOffset.x + Geography.pixelsToUnits(Geography.grabPoint1.screenX - Geography.viewportWidth /2);
			Geography.grabRotationCenter.y = Geography.mapOffset.y + Geography.pixelsToUnits(Geography.grabPoint1.screenY - Geography.viewportHeight/2);
		} else {
			Geography.grabRotationCenter.x = Geography.mapOffset.x;
			Geography.grabRotationCenter.y = Geography.mapOffset.y;
		}

		Geography.activeGrabingPointers--;

		return true;
	}

	static mouseWheel(event:WheelEvent):boolean {
		console.log(event);

		event.preventDefault();

		if(Geography.activeGrabingPointers == 2)
			return false;

		Geography.zoomSteps += event.deltaY;
		if(Geography.zoomSteps < 0) {
			while(Geography.zoomSteps <= -100) {
				Geography.zoom *= Geography.zoomStep;
				Geography.zoomSteps += 100;
			}
		} else {
			while(Geography.zoomSteps >= 100) {
				Geography.zoom /= Geography.zoomStep;
				Geography.zoomSteps -= 100;
			}
		}

		if(Geography.activeGrabingPointers == 1) {
			Geography.mapOffset.x = Geography.grabRotationCenter.x - Geography.pixelsToUnits(Geography.grabPoint1.screenX - Geography.viewportWidth /2);
			Geography.mapOffset.y = Geography.grabRotationCenter.y - Geography.pixelsToUnits(Geography.grabPoint1.screenY - Geography.viewportHeight/2);
		}

		Geography.render();

		return false;
	}

	static onResize():void {
		// TODO: event?
		Geography.viewportOffsetX = Geography.mapContainer.clientLeft;
		Geography.viewportOffsetY = Geography.mapContainer.clientTop;
		Geography.viewportWidth = Geography.mapContainer.clientWidth;
		Geography.viewportHeight = Geography.mapContainer.clientHeight;

		// При изменении зума с двумя нажатиями шаги колёсика должы обнуляться.
		if(Geography.activeGrabingPointers == 2)
			Geography.zoomSteps = 0;

		// TODO: смещение указателей.

		Geography.render();
	}

	static render():void {
		if(Geography.zoom > Geography.zoomMax) {
			Geography.zoom = Geography.zoomMax;
			Geography.zoomSteps = 0;
		} else if(Geography.zoom < 1) {
			Geography.zoom = 1;
			Geography.zoomSteps = 0;
		}

		const projetionWidth  = Geography.pixelsToUnits(Geography.viewportWidth);
		const projetionHeight = Geography.pixelsToUnits(Geography.viewportHeight);

		const mox = Math.max(0, Geography.mapWidth  - projetionWidth );
		const moy = Math.max(0, Geography.mapHeight - projetionHeight);

		Geography.mapOffset.x = Math.min(Math.max((Geography.mapWidth  - mox)/2, Geography.mapOffset.x), (Geography.mapWidth  + mox)/2);
		Geography.mapOffset.y = Math.min(Math.max((Geography.mapHeight - moy)/2, Geography.mapOffset.y), (Geography.mapHeight + moy)/2);

		Geography.mapGroup.style.left   = (-Geography.unitsToPixels(Geography.mapOffset.x - projetionWidth  / 2))+'px';
		Geography.mapGroup.style.top    = (-Geography.unitsToPixels(Geography.mapOffset.y - projetionHeight / 2))+'px';

		Geography.mapGroup.style.width  = Geography.unitsToPixels(Geography.mapWidth )+'px';
		Geography.mapGroup.style.height = Geography.unitsToPixels(Geography.mapHeight)+'px';
	}

	static pixelsToUnits(value:number):number {
		return value / Geography.zoom;
	}

	static unitsToPixels(value:number):number {
		return value * Geography.zoom;
	}
}
Geography.init();