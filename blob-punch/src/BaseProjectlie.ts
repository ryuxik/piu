import { EntityInterface, EntityManagerInterface, ProjectileInterface, RendererInterface } from './Entity';
import { Direction } from './CommonEnums';
import { PlayerLogic } from './Constants';

type BaseProjectileProps {
	x: number,
	y: number,
	direction: Direction,
	opponent: EntityInterface
}

type BaseProjectileState {
	x: number,
	y: number,
	vx: number,
	connectionMade: boolean,
}

export class BaseProjectile implements ProjectileInterface, RendererInterface {
	private _x : number;
	private _y : number;
	private _vx : number;
	private _opponent: EntityInterface;
	private _connectionMade: boolean;
	private _entityManager: EntityManagerInterface;

	constructor(x: number, y: number, direction: Direction, opponent: EntityInterface) {
		this._x = x;
		this._y = y;
		this._vx = direction == Direction.RIGHT ? PlayerLogic.PROJECTILE_VEL_X: -PlayerLogic.PROJECTILE_VEL_X;
		this._opponent = opponent;
		this._connectionMade = false;
	}

	public setEntityManager(entityManager: EntityManagerInterface) {
		this._entityManager = entityManager;
	}

	public updatePosition() {
		this._x += this._vx;
        if (this._x < -10 || this._x > 10 - PlayerLogic.PROJECTILE_WIDTH) {
            // remove
            this._entityManager.removeEntity(this);
        }

        // collision detection
        if (!this._connectionMade) {
            if(collideRectRect(this._x, 
                (this._vx < 0 ? this._y - PlayerLogic.PROJECTILE_WIDTH: this._y),
                PlayerLogic.PROJECTILE_WIDTH,
                PlayerLogic.PROJECTILE_HEIGHT,
                this._opponent.position_x, this._opponent.position_y - this._opponent.height, this._opponent.width, this._opponent.height)) {
                this._opponent.takePiu((this._vx < 0 ? Direction.LEFT : Direction.RIGHT));
                this._connectionMade = true;
                this._entityManager.removeEntity(this);
            }
        }
	}

	public draw() {
		
	}
}