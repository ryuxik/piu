import { EntityManagerInterface, EntityInterface, ProjectileInterface, RendererInterface } from '../CommonInterfaces/Entity';

export class BaseEntityManger implements EntityManagerInterface {
	public entities : Set<(EntityInterface | ProjectileInterface) & RendererInterface> = new Set();

	public removeEntity( entity: (EntityInterface | ProjectileInterface) & RendererInterface ) {
		this.entities.delete(entity);
	}

	public addEntity( entity: (EntityInterface | ProjectileInterface) & RendererInterface ) {
		this.entities.add(entity);
		entity.registerEntityManager(this);
	}

	public updateEntityPositions() {
		this.entities.forEach((entity: (EntityInterface | ProjectileInterface) & RendererInterface) => {
            entity.updatePosition();
        });
	}

	public drawEntities(canvas: HTMLCanvasElement) {
		this.entities.forEach((entity: (EntityInterface | ProjectileInterface) & RendererInterface) => {
            entity.draw(canvas);
        });
	}
}