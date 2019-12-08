import { RectangleInterface, Coordinate2DInterface, Vector2DInterface } from "../CommonInterfaces/Physics";

export function CollisionRectRect (thisShape: RectangleInterface, otherShape: RectangleInterface): boolean {
	let xsIntersect = thisShape.bottomLeft.x < otherShape.bottomRight.x &&
		thisShape.bottomRight.x > otherShape.bottomLeft.x;
	let ysIntersect = thisShape.bottomLeft.y > otherShape.topLeft.y &&
	thisShape.topLeft.y < otherShape.bottomLeft.y;
	return xsIntersect && ysIntersect;
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