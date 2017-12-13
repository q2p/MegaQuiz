class Geography {
	private static readonly mapWidth  = 612;
	private static readonly mapHeight = 792;

	private static readonly aspect = Geography.mapWidth / Geography.mapHeight;

	private static readonly mapContainer:HTMLElement = document.getElementById('map_container');
	private static readonly mapBox:HTMLElement = document.getElementById('map_box');
	private static readonly mapGroup:HTMLElement = document.getElementById('map_group');
	private static readonly mapLines:HTMLElement = document.getElementById('map_lines');
	private static readonly fadeCover:HTMLElement = document.getElementById('fade_cover');

	static init():void {
		window.addEventListener('resize', Geography.onResize, false);

		const sorted = regions.slice().sort((a, b) => {
			return a.mapY == b.mapY ? a.mapX - b.mapX : a.mapY - b.mapY;
		});

		for(const region of sorted) {
			const centre:HTMLElement = document.createElement('div');
			centre.className = 'coat_centre';
			centre.style.top  = region.mapY + '%';
			centre.style.left = region.mapX + '%';

			const name:HTMLElement = document.createElement('div');
			name.className = 'map_city_name';
			name.innerText = region.name;
			centre.appendChild(name);

			const container:HTMLElement = document.createElement('div');
			container.className = 'coat_container';
			centre.appendChild(container);

			const square:HTMLElement = document.createElement('div');
			square.className = 'coat_square';
			container.appendChild(square);

			const triangle:HTMLElement = document.createElement('div');
			triangle.className = 'coat_triangle';
			container.appendChild(triangle);

			const coat:HTMLImageElement = document.createElement('img');
			coat.className = 'coat_img';
			coat.src = 'coats/'+region.devName;
			square.appendChild(coat);

			Geography.mapGroup.appendChild(centre);
		}

		Geography.onResize();

		Geography.mapGroup.addEventListener('transitionend', Geography.onFadeEnd, false);

		setTimeout(() => {
			Geography.fadeCover.style.opacity = '0';
			Geography.mapGroup.style.transform = 'scale(1)';
		}, 0);
	}

	static onFadeEnd(event:TransitionEvent):boolean {
		Geography.fadeCover.remove();
		Geography.mapGroup.className = '';
		Geography.mapGroup.style.transform = '';

		return true;
	}

	static onResize():void {
		const viewportWidth  = Geography.mapContainer.clientWidth;
		const viewportHeight = Geography.mapContainer.clientHeight;

		const viewAspect = viewportWidth / viewportHeight;

		if(viewAspect > Geography.aspect) {
			Geography.mapBox.style.height = '100%';
			const width = viewportWidth * Geography.aspect / viewAspect;
			Geography.mapBox.style.width = width + 'px';
			Geography.mapBox.style.marginLeft = (viewportWidth - width)/2 + 'px';
			Geography.mapBox.style.marginTop = '0';
		} else {
			Geography.mapBox.style.width = '100%';
			const height = viewportHeight * viewAspect / Geography.aspect;
			Geography.mapBox.style.height = height + 'px';
			Geography.mapBox.style.marginTop = (viewportHeight - height)/2 + 'px';
			Geography.mapBox.style.marginLeft = '0';
		}


	}
}
Geography.init();