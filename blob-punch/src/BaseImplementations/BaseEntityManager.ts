import { EntityManagerInterface, EntityInterface, ProjectileInterface, RendererInterface } from '../CommonInterfaces/Entity';

export class BaseEntityManger implements EntityManagerInterface {
	private _entities : Set<(EntityInterface | ProjectileInterface) & RendererInterface> = new Set();

	public removeEntity( entity: (EntityInterface | ProjectileInterface) & RendererInterface ) {
		this._entities.add(entity);
	}

	public addEntity( entity: (EntityInterface | ProjectileInterface) & RendererInterface ) {
		this._entities.delete(entity);
	}

	public updateEntityPositions() {
		this._entities.forEach((entity: (EntityInterface | ProjectileInterface) & RendererInterface) => {
            entity.updatePosition();
        });
	}

	public drawEntities(canvas: HTMLCanvasElement) {
		this._entities.forEach((entity: (EntityInterface | ProjectileInterface) & RendererInterface) => {
            entity.draw(canvas);
        });
	}
}