import { EntityInterface, EntityManagerInterface, ProjectileInterface, RendererInterface } from './Entity';
import { Direction } from './CommonEnums';
import { PlayerLogic, PlayerRender, GameLogic } from './Constants';
import { RectangleInterface, Coordinate2DInterface, Vector2DInterface, MoveRectangle, CollisionRectRect } from './Physics';
import { getRGBString } from './ColorUtil';

export class BaseProjectile implements ProjectileInterface, RendererInterface {
	private velocityVector : Vector2DInterface;
	private opponent: EntityInterface;
	private connectionMade: boolean;
	public entityManager: EntityManagerInterface;
	public rectangle : RectangleInterface;

	constructor(bottomLeft: Coordinate2DInterface , direction: Direction, opponent: EntityInterface, entityManager: EntityManagerInterface) {
		this.rectangle = this.initRectangle(bottomLeft);
		this.velocityVector = this.initVelocityVector(direction);
		this.opponent = opponent;
		this.connectionMade = false;
		this.entityManager = entityManager;
	}

	private initRectangle(bottomLeft: Coordinate2DInterface) {
		return {
			bottomLeft: {
				x: bottomLeft.x,
				y: bottomLeft.y
			},
			bottomRight: {
				x: bottomLeft.x + PlayerLogic.PROJECTILE_WIDTH,
				y: bottomLeft.y,
			},
			topLeft: {
				x: bottomLeft.x,
				y: bottomLeft.y - PlayerLogic.PROJECTILE_HEIGHT,
			},
			topRight: {
				x: bottomLeft.x + PlayerLogic.PROJECTILE_WIDTH,
				y: bottomLeft.y - PlayerLogic.PROJECTILE_HEIGHT,
			},
		};
	}

	private initVelocityVector(direction: Direction): Vector2DInterface {
		return {
			vx: direction == Direction.RIGHT ? PlayerLogic.PROJECTILE_VEL_X: -PlayerLogic.PROJECTILE_VEL_X,
			vy: 0,
		};
	}

	public updatePosition() {
		this.rectangle = MoveRectangle(this.rectangle, this.velocityVector);
        if ( this.rectangle.bottomRight.x <  0 || this.rectangle.bottomLeft.x >  GameLogic.WIDTH ) {
            this.entityManager.removeEntity(this);
        }

        // collision detection
        if (!this.connectionMade) {
            if (CollisionRectRect(this.rectangle, this.opponent.rectangle)) {
                this.opponent.takePiu((this.velocityVector.vx < 0 ? Direction.LEFT : Direction.RIGHT));
                this.connectionMade = true;
                this.entityManager.removeEntity(this);
            }
        }
	}

	public getBaseColor(): readonly number[] {
		return PlayerRender.PROJECTILE_COLOR;
	}

	public draw(canvas: HTMLCanvasElement) {
		let context = canvas.getContext('2d');
		if (context) {
			context.fillStyle = getRGBString(this.getBaseColor());
			context.fillRect(
				this.rectangle.topLeft.x,
				this.rectangle.topLeft.y,
				PlayerLogic.PROJECTILE_WIDTH,
				PlayerLogic.PROJECTILE_HEIGHT);
		}
	}
}