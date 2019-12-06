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

export function CollisionRectRect (thisShape: RectangleInterface, otherShape: RectangleInterface): boolean {
	return thisShape.bottomLeft.x < otherShape.bottomRight.x &&
		thisShape.bottomRight.x > otherShape.bottomLeft.x &&
		thisShape.bottomLeft.y < otherShape.topLeft.y &&
		thisShape.topLeft.y > otherShape.bottomLeft.y;
}

export function MoveCoordinate (coordinate: Coordinate2DInterface, movement: Vector2DInterface): Coordinate2DInterface {
	return  {
		x: coordinate.x + movement.vx,
		y: coordinate.y + movement.vy,
	};
}

export function MoveRectangle (shape: RectangleInterface, movement: Vector2DInterface): RectangleInterface {
	return  {
		bottomLeft: MoveCoordinate(shape.bottomLeft, movement),
		bottomRight: MoveCoordinate(shape.bottomRight, movement),
		topLeft: MoveCoordinate(shape.topLeft, movement),
		topRight: MoveCoordinate(shape.topRight, movement),
	};
}