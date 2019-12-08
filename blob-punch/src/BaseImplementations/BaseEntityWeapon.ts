import { EntityWeaponInterface, EntityInterface, RendererInterface } from '../CommonInterfaces/Entity';
import { RectangleInterface, Coordinate2DInterface } from '../CommonInterfaces/Physics';
import { PlayerLogic, PlayerRender } from '../Constants';
import { Direction } from '../CommonEnums';
import { getRGBString } from '../Utils/ColorUtil';
import { CollisionRectRect } from '../Utils/PhysicsUtils';

export class BaseEntityWeapon implements EntityWeaponInterface, RendererInterface {
    private isAttacking: boolean;
    private isColliding: boolean;
    private attackingTick: number;
    private direction: Direction;
    public rectangle: RectangleInterface;
    public opponent?: EntityInterface;
    constructor(bottomLeft: Coordinate2DInterface) {
        this.isAttacking = false;

        this.attackingTick = 0;
        this.isColliding = false;

        this.rectangle = this.initRectangle(bottomLeft);
        this.direction = Direction.STOP; 
    }

    public registerOpponent(opponent: EntityInterface): void {
        this.opponent = opponent;
    }

    private initRectangle(bottomLeft: Coordinate2DInterface): RectangleInterface {
        return {
            bottomLeft,
            bottomRight: {
                x: bottomLeft.x,
                y: bottomLeft.y,
            },
            topLeft: {
                x: bottomLeft.x,
                y: bottomLeft.y - PlayerLogic.ARM_HEIGHT,
            },
            topRight: {
                x: bottomLeft.x,
                y: bottomLeft.y - PlayerLogic.ARM_HEIGHT,
            },
        };
    }

    private extendRectangle(bottomLeft: Coordinate2DInterface, extension: number, direction: Direction ): RectangleInterface {
        switch (direction) {
            case Direction.RIGHT:
                return {
                    bottomLeft,
                    bottomRight: {
                        x: bottomLeft.x + extension,
                        y: bottomLeft.y,
                    },
                    topLeft: {
                        x: bottomLeft.x,
                        y: bottomLeft.y - PlayerLogic.ARM_HEIGHT,
                    },
                    topRight: {
                        x: bottomLeft.x + extension,
                        y: bottomLeft.y - PlayerLogic.ARM_HEIGHT,
                    },
                };
            case Direction.LEFT:
                return {
                    bottomLeft: {
                        x: bottomLeft.x - extension,
                        y: bottomLeft.y,
                    },
                    bottomRight: {
                        x: bottomLeft.x,
                        y: bottomLeft.y,
                    },
                    topLeft: {
                        x: bottomLeft.x - extension,
                        y: bottomLeft.y - PlayerLogic.ARM_HEIGHT,
                    },
                    topRight: {
                        x: bottomLeft.x,
                        y: bottomLeft.y - PlayerLogic.ARM_HEIGHT,
                    },
                };    
            case Direction.STOP:
                console.log("should never get here");
                return this.rectangle;
        }   
    }
 
    public attack( direction: Direction ):void {
        this.attackingTick = 0;
        this.isAttacking = true;
        this.isColliding = false;
        this.direction = direction;
    }

    public tick(bottomLeft: Coordinate2DInterface, direction: Direction) {
        this.attackingTick++;
        if (this.attackingTick > PlayerLogic.ARM_SPEED * 2) {
            this.isAttacking = false;
            this.rectangle = this.initRectangle(bottomLeft);
            return;
        }

        let extension: number;
        // TODO: check this logic
        if (this.attackingTick < PlayerLogic.ARM_SPEED) { // weapon is moving out
            extension = ( this.attackingTick / PlayerLogic.ARM_SPEED ) * PlayerLogic.ARM_REACH;
        } else { // weapon is moving in
            extension = ( PlayerLogic.ARM_SPEED * 2 - this.attackingTick ) / ( PlayerLogic.ARM_SPEED * PlayerLogic.ARM_REACH ); 
        }

        this.rectangle = this.extendRectangle(bottomLeft, extension, direction);
        this.direction = direction;
        this.updatePosition();
    }

    public updatePosition() { //  used only for collision detection
        if (!this.isColliding && this.opponent) {
            if(CollisionRectRect(this.rectangle, this.opponent.rectangle)) {
                this.opponent.takePunch(this.direction);
                this.isColliding = true;
            }
        }
    }

    public getBaseColor(): readonly number[] {
        return PlayerRender.ARM_COLOR;
    }

    public draw(canvas: HTMLCanvasElement) {
        if (!this.isAttacking) {
            return;
        }
        let ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = getRGBString(this.getBaseColor());
            ctx.fillRect(
                this.rectangle.topLeft.x,
                this.rectangle.topLeft.y,
                this.rectangle.topRight.x - this.rectangle.topLeft.x,
                this.rectangle.bottomLeft.y - this.rectangle.topLeft.y);
        }
    }
}