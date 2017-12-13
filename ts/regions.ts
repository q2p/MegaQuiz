class Region {
	readonly devName:string;
	readonly name:string;
	readonly availabile:boolean;
	readonly mapX:number;
	readonly mapY:number;

	constructor(devName:string, name:string, availability:boolean, mapX:number, mapY:number) {
		this.devName = devName;
		this.name = name;
		this.availabile = availability;
		this.mapX = mapX;
		this.mapY = mapY;
	}
}

const regions:Array<Region> = [
	new Region("nkz",  "Новокузнецк", true,  52, 65.5),
	new Region("kem",  "Кемерово",    false, 36.5, 33.5),
	new Region("tsht", "Таштагол",    false, 63.5, 85.4)
];