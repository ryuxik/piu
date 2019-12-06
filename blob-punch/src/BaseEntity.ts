import { EntityInterface, EntityManagerInterface, RendererInterface } from './Entity';
import { PlayerLogic, GameLogic } from './Constants';
import { RectangleInterface, Coordinate2DInterface, Vector2DInterface, MoveRectangle } from './Physics';
import { Direction, Action } from './CommonEnums';
import { BaseProjectile } from './BaseProjectlie';

export class BaseEntity implements EntityInterface, RendererInterface {
	public name: string;
	public health: number;
	public mana: number;
	public rectangle: RectangleInterface;
	public entityNumber: number;
	public isOnstage: boolean;
	public directionMoving: Direction;
	public directionFacing: Direction;
	public numLives: number;
	public chargeCounter: number;
	public isCharging: boolean;
	public isBlocking: boolean;
	public knockbackTicks: number;
	public numTicksAlive: number;
	public isAlive: boolean;
	public numTicksInactive: number;
	public opponent?: EntityInterface;
	public entityManager: EntityManagerInterface;
	private readonly baseColor: readonly number[];
	private velocity: Vector2DInterface;
 
	constructor(name: string, baseColor: readonly number[], entityNumber: number, entityManager: EntityManagerInterface) {
		this.name = name;
		this.baseColor = baseColor;
		this.entityNumber = entityNumber;
		this.entityManager = entityManager;

		//  condition
        this.health = PlayerLogic.STARTING_HEALTH;
        this.mana   = PlayerLogic.STARTING_MANA;
        
        //  position & velocity
        this.rectangle = this.initRectangle(
        	{	x: PlayerLogic.STARTING_POS_X,
        		y: PlayerLogic.STARTING_POS_Y});
        this.velocity = this.initVelocity();
        
        //  state
        this.isOnstage        = true;
        this.directionMoving  = Direction.STOP;
        this.directionFacing  = (entityNumber % 2 == 0) ? Direction.RIGHT : Direction.LEFT;
        this.numLives         = PlayerLogic.STARTING_LIVES;
        this.chargeCounter    = 0;
        this.isCharging       = false;
        this.isBlocking       = false;
        this.knockbackTicks   = 0;
        this.numTicksAlive    = 0;
        this.isAlive          = true;
        this.numTicksInactive = 0;

        //  weapon
        //this.arm = new Arm();
	}

	private initVelocity(): Vector2DInterface {
		return {
        	vx: PlayerLogic.STARTING_VEL_X,
        	vy: PlayerLogic.STARTING_VEL_Y};
	}

	private initRectangle(bottomLeft: Coordinate2DInterface) {
		return {
			bottomLeft: {
				x: bottomLeft.x,
				y: bottomLeft.y
			},
			bottomRight: {
				x: bottomLeft.x + PlayerLogic.PLAYER_WIDTH,
				y: bottomLeft.y,
			},
			topLeft: {
				x: bottomLeft.x,
				y: bottomLeft.y + PlayerLogic.PLAYER_HEIGHT,
			},
			topRight: {
				x: bottomLeft.x + PlayerLogic.PLAYER_WIDTH,
				y: bottomLeft.y + PlayerLogic.PLAYER_HEIGHT,
			},
		};
	}

	public registerOponent(opponent: EntityInterface) {
		this.opponent = opponent;
	}

	public getFitness(): number {
        let fitness = 0;
        let numOpponentLives = this.opponent ? this.opponent.numLives : 0;
        fitness += GameLogic.LIFE_DELTA_MULTIPLIER * (this.numLives - numOpponentLives);
        fitness += GameLogic.MANA_MULTIPLIER * this.mana;
        fitness += GameLogic.HEALTH_MULTIPLIER * this.health;
        fitness += this.numTicksAlive * GameLogic.TICK_DISCOUNT;
        fitness -= this.numTicksInactive * GameLogic.TICK_DISCOUNT;
        return fitness;
    }

    public resetManaCounter(): void {
    	this.isCharging = false;
    	this.chargeCounter = 0;
    }

	public setOnstage(isOnstage: boolean): void {
		this.isOnstage = isOnstage;
	}

	public block(): void {
		this.resetManaCounter();
		this.isBlocking = true;
	}

	public releaseBlock(): void {
		this.isBlocking = false;
	}

	public jump(): void {
		if (this.rectangle.bottomLeft.y == GameLogic.PLATFORM_HEIGHT) {
			let velocity = {
				vx : this.velocity.vx,
				vy: PlayerLogic.JUMP_VEL_Y,
			};
			this.velocity = velocity;
		} 
	}

	public takeKnockback(direction: Direction, damage: number): void {
		let newVelocity : Vector2DInterface = { vx: 0, vy: 0 };

		let knockbackVxMagnitude: number;
		if (this.isBlocking) {
			knockbackVxMagnitude = PlayerLogic.KNOCKBACK_VEL_X;
		} else {
			this.takeDamage(damage);
			newVelocity.vy = -PlayerLogic.KNOCKBACK_VEL_Y
			knockbackVxMagnitude = PlayerLogic.KNOCKBACK_VEL_X_BLOCK;
		}
		newVelocity.vx = Direction.LEFT ? -knockbackVxMagnitude : knockbackVxMagnitude;

		this.velocity = newVelocity;
        this.knockbackTicks = PlayerLogic.KNOCKBACK_TICKS;
	}

	takePunch(direction: Direction): void {
		this.takeKnockback(direction, PlayerLogic.ATTACK_DAMAGE);
	}

	takePiu(direction: Direction): void {
		this.takeKnockback(direction, PlayerLogic.ALT_ATTACK_DAMAGE);
	}

	takeDamage(damage: number): void {
		this.health -= damage;
        if (this.health < 0) {
            this.numLives -= 1;
            this.respawn();
        }
	}

	attack(): void {
		//this.arm.punch();
	}

	// TODO: fix hack that requires opponent to be registered before attacking
	altAttack(): void {
		if (this.mana > PlayerLogic.ALT_ATTACK_COST) {
            this.mana = Math.max(0, this.mana - PlayerLogic.ALT_ATTACK_COST);
            let bottomLeft: Coordinate2DInterface = {
            	x: this.directionFacing == Direction.RIGHT ? this.rectangle.bottomRight.x : this.rectangle.bottomLeft.x,
            	y: this.rectangle.topRight.y + 10 };
            this.entityManager.addEntity(
                new BaseProjectile(
                	bottomLeft,
                	this.directionFacing,
                	this.opponent!,
                	this.entityManager));
        } 
	}

	chargeMana(): void {
		this.isCharging = true;
	}

	addMana(): void {
		this.mana = Math.min(this.mana + this.chargeCounter / PlayerLogic.TICKS_PER_MANA_CHARGE,
                             PlayerLogic.MAX_MANA);        
        this.resetManaCounter();
	}

	takeAction(action: Action): void {
		 switch(action) {
            case Action.JUMP:
                if (!this.isBlocking && !this.isCharging) {
                    this.jump();
                    this.resetManaCounter();
                    this.numTicksInactive = 0;
                }
                break;
            case Action.ATTACK:
                if (!this.isBlocking && !this.isCharging) {
                    this.attack();
                    this.resetManaCounter();
                    this.numTicksInactive = 0;
                }
                break;
            case Action.ALT_ATTACK:
                if (!this.isBlocking && !this.isCharging) {
                    this.altAttack();
                    this.resetManaCounter();
                    this.numTicksInactive = 0;
                }
                break;
            case Action.CHARGE_MANA:
                if (!this.isBlocking) {
                    this.chargeMana();
                }
                break;
            case Action.BLOCK:
                if (!this.isCharging) {
                    this.block();
                } 
                break;
            case Action.MOVE_LEFT:
                if (!this.isBlocking && !this.isCharging) {
                    this.takeDirection(Direction.LEFT);
                }
                break;
            case Action.MOVE_RIGHT:
                if (!this.isBlocking && !this.isCharging) {
                    this.takeDirection(Direction.RIGHT);
                }
                break;
        }
	}

	takeDirection(direction: Direction): void {
		this.directionMoving = direction;
        switch(this.directionMoving){
            case Direction.LEFT:
                this.directionFacing = Direction.LEFT;
                break;
            case Direction.RIGHT:
                this.directionFacing = Direction.RIGHT;
                break;
            case Direction.STOP:
                break;
        }
	}

	getCommandedXVel(): number {
		switch(this.directionMoving){
            case Direction.LEFT:
                this.numTicksInactive = 0;
                return -PlayerLogic.MAX_X_VEL_COMMANDED;
            case Direction.RIGHT:
                this.numTicksInactive = 0;
                return PlayerLogic.MAX_X_VEL_COMMANDED;
            case Direction.STOP:
                return 0;
        }
	}

	respawn(): void {
		if (this.numLives <= 0) {
            this.isAlive = false;
        } else {
            this.rectangle = this.initRectangle(
        	{	x: PlayerLogic.STARTING_POS_X,
        		y: PlayerLogic.STARTING_POS_Y});
        	this.velocity = this.initVelocity();
            this.health = PlayerLogic.STARTING_HEALTH;
        }
	}

	public updatePosition(): void {
		this.numTicksAlive += 1;
        this.numTicksInactive += 1;
        if (this.numTicksInactive > PlayerLogic.INACTIVE_KILL_THRESHOLD) {
            this.numTicksInactive = 0;
            this.numLives -= 1;
            this.respawn();
            return;
        }

        if (this.isCharging)
            this.chargeCounter += 1;

        if (this.knockbackTicks > 0)
            this.knockbackTicks--;

        let commandedXVel = this.getCommandedXVel();
        if (this.knockbackTicks == 0) {
            this.velocity.vx = commandedXVel;
        }
        
        this.velocity.vy += GameLogic.GRAVITY;
        let lastRectangle = this.rectangle;
        this.rectangle = MoveRectangle(this.rectangle, this.velocity);

        if (this.rectangle.bottomLeft.x < GameLogic.PLATFORM_STARTING_X + GameLogic.PLATFORM_WIDTH &&
            this.rectangle.bottomRight.x > GameLogic.PLATFORM_STARTING_X ||
            lastRectangle.topLeft.y < GameLogic.PLATFORM_STARTING_Y) {
            this.setOnstage(true);
        	let delta_y = this.rectangle.bottomLeft.y - GameLogic.PLATFORM_STARTING_Y;
        	if (delta_y > 0) {
        		// move to the floor of the platform, should not intersect platform
        		let adjustmentVector : Vector2DInterface = { vx: 0, vy: delta_y };
        		this.rectangle = MoveRectangle(this.rectangle, adjustmentVector);
        	}
            
            if (this.rectangle.bottomRight.y == GameLogic.PLATFORM_STARTING_Y) {
                this.velocity.vy = 0;
                // friction from standing on the platform
                if (this.directionMoving == Direction.STOP) {
                    this.velocity.vx += this.velocity.vx > 0 ? -GameLogic.FRICTION : GameLogic.FRICTION;
                    // Remove entity creeping
                    if (Math.abs(this.velocity.vx) <= PlayerLogic.MIN_VEL_X) {
                        this.velocity.vx = 0;
                    }
                }
            }
        } else {
            this.setOnstage(false);
        }

        if (!this.isOnstage) {
            this.numLives -= 1;
            this.respawn();
        }

        // this.arm.tick(this.position_x + (this.face_dir == directions.RIGHT ? this.width: 0),
        //               this.position_y-this.height+10,
        //               this.face_dir);
	}


}