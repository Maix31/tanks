import { Tank } from './tank';
import { Terrain } from './terrain'

export abstract class Projectile extends Phaser.Physics.Arcade.Sprite {

    damage: number;
    blastRadius: number;
    speed: number;

    constructor(
        scene: Phaser.Scene, 
        x: number, 
        y: number, 
        velX: number,
        velY: number,
        texture: string | Phaser.Textures.Texture,
        damage: number,
        blastRadius: number,
        speed: number,
        frame?: string | number | undefined
    ) {
        super(scene,x,y,texture,frame);
        this.damage = damage;
        this.blastRadius = blastRadius;

        scene.add.existing(this);
        scene.physics.add.existing(this, false /* This sets to body to be static(true) or dynamic(false)*/);

        this.setVelocity(velX * speed, velY * speed );
    }

    /**
     * 
     * @param terrain 
     * @returns false - if it wants continue to fly | true - if it wants to stop
     */
    collideTerrain(terrain: Terrain): boolean {
        let collision = terrain.checkCollision(this.x, this.y);
        return collision;
    }

    collideTank(tank: Tank) {
        let collision = tank.body.hitTest(this.x, this.y);
        return collision;   
    }

    getBlastRadius() {
        return this.blastRadius;
    }

    getDamage() {
        return this.damage;
    }
    
    abstract playSound();

}

export class BasicProjectile extends Projectile {
    
    static readonly defaultDamage: number = 10;
    static readonly defaultBlastRadius  : number = 10;
    static readonly defaultSpeed  : number = 10;
    static readonly defaultSound  : string = 'basicProjectileSound';

    sound: Phaser.Sound.BaseSound;

    constructor(
        scene: Phaser.Scene, 
        x: number, 
        y: number,
        velX: number,
        velY: number,
        texture: string | Phaser.Textures.Texture,
        frame?: string | number | undefined
    ) {
        super(scene,x,y, velX, velY,texture,BasicProjectile.defaultDamage,BasicProjectile.defaultBlastRadius, BasicProjectile.defaultSpeed,frame);
        this.sound = scene.sound.add(BasicProjectile.defaultSound);
    }

    playSound() {
        this.sound.play();
    }

}

export class SuperiorProjectile extends Projectile {
    
    static readonly defaultDamage: number = 20;
    static readonly defaultBlastRadius  : number = 20;
    static readonly defaultSpeed  : number = 15;
    static readonly defaultSound  : string = 'superiorProjectileSound';

    sound: Phaser.Sound.BaseSound;

    constructor(
        scene: Phaser.Scene, 
        x: number, 
        y: number,
        velX: number,
        velY: number,
        texture: string | Phaser.Textures.Texture,
        frame?: string | number | undefined
    ) {
        super(scene,x,y, velX, velY,texture,SuperiorProjectile.defaultDamage,SuperiorProjectile.defaultBlastRadius, SuperiorProjectile.defaultSpeed,frame);
        this.sound = scene.sound.add(SuperiorProjectile.defaultSound);
    }

    playSound() {
        this.sound.play();
    }
}

// Factory pattern that auto registers Projectiles would be nice
// This also works
export enum ProjectileType {
    BasicProjectile = 0,
    SuperiorProjectile = 1,
}

export function createProjectile(scene: Phaser.Scene, type: ProjectileType, x: number, y: number, velX: number, velY: number) :Projectile {

    switch (type) {
        case ProjectileType.BasicProjectile:
            return new BasicProjectile(scene, x, y, velX, velY, 'cannonball');
        case ProjectileType.SuperiorProjectile:
            return new SuperiorProjectile(scene, x, y, velX, velY, 'cannonball');
        default: 
            throw new Error('Unimplemented! Most likely you created a new Projectile and didn\'t register it in the ProjectileType.');
    }

}