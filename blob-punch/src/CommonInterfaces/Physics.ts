export interface Coordinate2DInterface {
	x: number;
	y: number;
}

export interface Vector2DInterface {
	vx: number;
	vy: number;
}

export interface RectangleInterface {
	bottomLeft: Coordinate2DInterface;
	bottomRight: Coordinate2DInterface;
	topLeft: Coordinate2DInterface;
	topRight: Coordinate2DInterface;
}