
export interface Shape {
	collide(thisShape: Shape, otherShape: Shape): boolean;
}