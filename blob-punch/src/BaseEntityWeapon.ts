import { EntityWeaponInterface, RendererInterface } from './Entity';

export class BaseEntityWeapon implements EntityWeaponInterface, RendererInterface {
    constructor() {
        this.out_dist = player_logic.ARM_REACH; //pixels
        this.out_time = player_logic.ARM_SPEED; //ticks
        this.punching = false;

        this.x = 0;
        this.y = 0;
        this.dir = 0;
        this.extension = 0;
    }

    punch() {
        this.time = 0;
        this.punching = true;
        this.connection_made = false;
    }

    tick(x, y, dir) {
        this.time++;
        if (this.time > this.out_time * 2) {
            this.punching = false;
            return;
        }
        var extension;
        if (this.time < this.out_time) { // moving out
            extension = this.time / this.out_time * this.out_dist;
        } else { // moving in
            extension = (this.out_time * 2 - this.time) / this.out_time * this.out_dist;
        }

        this.extension = extension;
        this.x = x;
        this.y = y;
        this.dir = dir;

        // collision detection
        if (!this.connection_made) {
            var opp = this.opp;
            if(collideRectRect(x, y, extension, player_logic.ARM_HEIGHT,
                opp.position_x, opp.position_y - opp.height, opp.width, opp.height)) {
                opp.takePunch(dir);
                this.connection_made = true;
            }
        }
    }

    draw() {
        if(!this.punching)
            return;
        fill(player_render.ARM_COLOR);
        if (this.dir == directions.LEFT)
            this.x -= this.extension;
        rect(this.x, this.y, this.extension, player_logic.ARM_HEIGHT);
    }
}