/**
 * The interface for a 2D coordinate.
 * 
 * @interface
 * @property {number} x - The x coordinate.
 * @property {number} y - The y coordinate.
 */
export interface Coordinate2DInterface {
	x: number;
	y: number;
}

/**
 * The interface for a 2D vector.
 * 
 * @interface
 * @property {number} vx - The component of the vector in the x direction.
 * @property {number} vy - The component of the vector in the y direction.
 */
export interface Vector2DInterface {
	vx: number;
	vy: number;
}

/**
 * The interface for a rectangle.
 * 
 * @interface
 * @property {Coordinate2DInterface} bottomLeft - The bottom left coordinate of the rectangle.
 * @property {Coordinate2DInterface} bottomRight - The bottom right coordinate of the rectangle.
 * @property {Coordinate2DInterface} topLeft - The top left coordinate of the rectangle.
 * @property {Coordinate2DInterface} topRight - The top right coordinate of the rectangle.
 */
export interface RectangleInterface {
	bottomLeft: Coordinate2DInterface;
	bottomRight: Coordinate2DInterface;
	topLeft: Coordinate2DInterface;
	topRight: Coordinate2DInterface;
}