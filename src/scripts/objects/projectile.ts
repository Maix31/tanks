import { Terrain } from './terrain'

abstract class Projectile extends Phaser.GameObjects.Sprite {
    damage: number;
    blastRadius: number;

    constructor(
        scene: Phaser.Scene, 
        x: number, 
        y: number, 
        texture: string | Phaser.Textures.Texture,
        damage: number,
        blastRadius: number,
        frame?: string | number | undefined
    ) {
        super(scene,x,y,texture,frame);
        this.damage = damage;
        this.blastRadius = blastRadius;
    }

    abstract fire();
    abstract collideTerrain(terrain: Terrain);
}

export class BasicProjectile extends Projectile {
    
    static readonly defaultDamage: number = 10;
    static readonly defaultBlastRadius  : number = 10;

    constructor(
        scene: Phaser.Scene, 
        x: number, 
        y: number, 
        texture: string | Phaser.Textures.Texture,
        frame?: string | number | undefined
    ) {
        super(scene,x,y,texture,BasicProjectile.defaultDamage,BasicProjectile.defaultBlastRadius,frame);
    }
    
    fire() {
        throw new Error('Method not implemented.');
    }

    collideTerrain(terrain: Terrain) {
        throw new Error('Method not implemented.');
    }
}

export class SuperiorProjectile extends Projectile {
    
    static readonly defaultDamage: number = 10;
    static readonly blastRadius  : number = 10;

    constructor(
        scene: Phaser.Scene, 
        x: number, 
        y: number, 
        texture: string | Phaser.Textures.Texture,
        frame?: string | number | undefined
    ) {
        super(scene,x,y,texture,BasicProjectile.defaultDamage,BasicProjectile.defaultBlastRadius,frame);
    }

    fire() {
        throw new Error('Method not implemented.');
    }

    collideTerrain() {
        throw new Error('Method not implemented.');
    }
}