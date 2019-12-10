import { EntityInformationInterface, EntityInterface, RendererInterface} from '../CommonInterfaces/Entity';
import { Coordinate2DInterface } from '../CommonInterfaces/Physics';
import { PlayerInfoRender } from '../Constants';
import { getRGBString } from '../Utils/ColorUtil';

export class BaseEntityInfo implements EntityInformationInterface {
	public entity: EntityInterface & RendererInterface;
	public entityNumber: number;
	constructor(entity: EntityInterface & RendererInterface, entityNumber: number) {
		this.entity = entity;
		this.entityNumber = entityNumber;
	}

	public getBaseColor(): readonly number[] {
		return PlayerInfoRender.INFO_CONTAINER_COLOR;
	}

	public draw(canvas: HTMLCanvasElement) {
		let topLeft: Coordinate2DInterface = {
			x: (this.entityNumber % 2 === 0) ? 
                PlayerInfoRender.INFO_CONTAINER_LEFT_POS_X:
                PlayerInfoRender.INFO_CONTAINER_RIGHT_POS_X,
            y: PlayerInfoRender.INFO_CONTAINER_POS_Y,
		}
        let ctx = canvas.getContext('2d');
        if ( ctx ) {
        	// border
        	ctx.strokeStyle = getRGBString(this.entity.getBaseColor());
        	ctx.strokeRect(
        		topLeft.x - PlayerInfoRender.INFO_BORDER_X_OFFSET,
        		topLeft.y - PlayerInfoRender.INFO_BORDER_Y_OFFSET,
        		PlayerInfoRender.INFO_BORDER_WIDTH,
				PlayerInfoRender.INFO_BORDER_HEIGHT);

			// name
        	ctx.fillStyle = getRGBString(this.entity.getBaseColor());
        	ctx.font = '12px Roboto mono';
        	ctx.fillText(this.entity.name, topLeft.x, topLeft.y);
        
        	// health bar
        	ctx.strokeStyle = getRGBString(this.entity.getBaseColor());
       		ctx.strokeRect(
       			topLeft.x,
       			topLeft.y + PlayerInfoRender.HEALTH_BAR_Y_OFFSET,
       			PlayerInfoRender.HEALTH_BAR_WIDTH * PlayerInfoRender.INFO_SIZE_SCALING,
       			PlayerInfoRender.HEALTH_BAR_HEIGHT);

       		ctx.fillStyle = getRGBString(PlayerInfoRender.HEALTH_BAR_COLOR);
       		ctx.fillRect(
       			topLeft.x + PlayerInfoRender.HEALTH_BAR_INNER_X_OFFSET,
       			topLeft.y + PlayerInfoRender.HEALTH_BAR_INNER_Y_OFFSET,
       			this.entity.health * PlayerInfoRender.INFO_SIZE_SCALING,
				PlayerInfoRender.HEALTH_BAR_INNER_HEIGHT);

        	// mana bar
        	ctx.strokeStyle = getRGBString(this.entity.getBaseColor());
        	ctx.strokeRect(
        		topLeft.x,
        		topLeft.y + PlayerInfoRender.MANA_BAR_Y_OFFSET,
        		PlayerInfoRender.MANA_BAR_WIDTH * PlayerInfoRender.INFO_SIZE_SCALING,
        		PlayerInfoRender.MANA_BAR_HEIGHT);
       		
       		ctx.fillStyle = getRGBString(PlayerInfoRender.MANA_BAR_COLOR);
        	ctx.fillRect(
        		topLeft.x + PlayerInfoRender.MANA_BAR_INNER_X_OFFSET,
        		topLeft.y + PlayerInfoRender.MANA_BAR_INNER_Y_OFFSET,
        		this.entity.mana * PlayerInfoRender.INFO_SIZE_SCALING,
        		PlayerInfoRender.MANA_BAR_INNER_HEIGHT);
        	
        	// fitness
        	ctx.fillStyle = getRGBString(this.entity.getBaseColor());
        	ctx.font = '10px Roboto mono';
        	ctx.fillText(
        		`FITNESS: ${Math.trunc(this.entity.getFitness())}`,
        		topLeft.x + PlayerInfoRender.FITNESS_X_OFFSET,
				topLeft.y);
				
			// lives
			ctx.fillStyle = getRGBString(this.entity.getBaseColor());
			ctx.font = '12px Roboto mono';
			ctx.fillText(
				`LIVES:${this.entity.numLives}`,
				topLeft.x + PlayerInfoRender.LIVE_COUNT_X_OFFSET,
				topLeft.y
			);
        }
	}
}