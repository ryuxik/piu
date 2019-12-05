import { ControllerInterface, KeyBindings } from './Controller';
import { EntityInterface } from './Entity';
import { Action, Direction } from './CommonEnums';

export class BaseController implements ControllerInterface {
    private _entity: EntityInterface;
    private _leftArrowActive: boolean;
    private _rightArrowActive: boolean;
    private readonly _keyBindings: KeyBindings;

    constructor(entity: EntityInterface, keyBindings: KeyBindings) {
        this._entity = entity;

        this._leftArrowActive = false;
        this._rightArrowActive = false;
        this._keyBindings = keyBindings;
    }

    private figureDirection() {
        if (this._leftArrowActive && !this._rightArrowActive) {
            this._entity.takeAction(Action.MOVE_LEFT);
        }     
        else if (this._rightArrowActive && !this._leftArrowActive) {
            this._entity.takeAction(Action.MOVE_RIGHT);
        } else {
            this._entity.takeDirection(Direction.STOP);
        }
    }

    public moveLeft() {
        this._leftArrowActive = true;
        this.figureDirection();    
    }

    public moveRight() {
        this._rightArrowActive = true;
        this.figureDirection();    
    }

    public stopLeft() {
        this._leftArrowActive = false;
        this.figureDirection();    
    }

    public stopRight() {
        this._rightArrowActive = false;
        this.figureDirection();    
    }

    public stop() {
        this._entity.takeDirection(Direction.STOP);     
    }

    public jump() {
        this._entity.takeAction(Action.JUMP);
    }

    public chargeMana() {
        this._entity.takeAction(Action.CHARGE_MANA);
    }

    public attack() {
        this._entity.takeAction(Action.ATTACK);
    }

    public altAttack() {
        this._entity.takeAction(Action.ALT_ATTACK);
    }

    public addMana() {
        this._entity.addMana();
    }
    
    public block() {
        this._entity.takeAction(Action.BLOCK);
    }

    public releaseBlock() {
        this._entity.releaseBlock();
    }

    public keyPressed(keyCode: number) {
        if(keyCode == this._keyBindings.left) {
            this.moveLeft();
        }
        if(keyCode == this._keyBindings.right) {
            this.moveRight();
        }
        if(keyCode == this._keyBindings.jump) {
            this.jump();
        }
        if(keyCode == this._keyBindings.charge) {
            this.chargeMana();
        }
        if(keyCode == this._keyBindings.attack) {
            this.attack();
        }
        if(keyCode == this._keyBindings.altAttack){
            this.altAttack();
        }
        if(keyCode == this._keyBindings.block) {
            this.block();
        }
    }

    public keyReleased(keyCode: number) {
        if(keyCode == this._keyBindings.left) {
            this.stopLeft();
        }
        if(keyCode == this._keyBindings.right) {
            this.stopRight();
        }
        if(keyCode == this._keyBindings.charge) {
            this.addMana();
        }
        if(keyCode == this._keyBindings.block) {
            this.releaseBlock();
        }
    }
}