import { Sleeping } from 'matter';
import * as CONSTANTS from '../utility/constants'
import { randBetween } from '../utility/math';
import { HealthBar } from './healthBar';
import { createProjectile, Projectile, ProjectileType } from './projectile';
import { Terrain } from './terrain';

// колебая се дали композиция ще е по-добре от унаследяване
// https://labs.phaser.io/edit.html?src=src/physics/arcade/extending%20arcade%20sprite.js&v=3.55.2 taken from example code
export class Tank extends Phaser.Physics.Arcade.Sprite /* Или може би Image */ {

    static readonly movementSpeed: number = 0.02;
    static readonly deafaultFirePower: number = 50;
    static readonly deafaultHealth: number = 70;
    static readonly minGunAngle: number = 0;
    static readonly maxGunAngle: number = 66;
    static readonly minFirePower: number = 10;
    static readonly maxFirePower: number = 100;

    scene: Phaser.Scene;
    private readonly initialHealth;
    private health: number;
    private firePower: number = Tank.deafaultFirePower;
    /**
     * Flag telling us where it needs to be affected by gravity
     */
    private isStable: boolean = false;
    private gun: Phaser.GameObjects.Image;
    private gunAngle: number = 0; // number is in degrees
    private tankAngle: number = 0; // number is in degrees
    private currentProjectile: ProjectileType;
    private healthBar: HealthBar;

    private engineSound: Phaser.Sound.BaseSound;

    constructor(
        scene: Phaser.Scene, 
        x: number ,
        y: number, 
        heathBar: HealthBar,
        textureBody: string | Phaser.Textures.Texture,
        textureGun: string,
        flipX :boolean,
        health: number = Tank.deafaultHealth, 
    ) {
        
        super(scene, x, y, textureBody)
        
        this.scene = scene;
        this.scale = 1/2;

        this.setScale(this.scale);
        this.flipX = flipX;
        this.initialHealth = health;
        this.health = health;
        this.healthBar = heathBar;

        this.healthBar.setMaxHealth(this.health);

        this.gun = scene.add.image(x,y, textureGun);
        this.gun.flipX = flipX;
        this.gun.setScale(this.scale)
        if (this.gun.flipX)
            this.gun.setOrigin(0,0.5);
        else
            this.gun.setOrigin(1,0.5);

        this.currentProjectile = ProjectileType.BasicProjectile;

        // random engine sound
        this.engineSound = scene.sound.add('engineSound' + Math.round(Math.random()));

        // This adds its to the the display list
        scene.add.existing(this);
        scene.physics.add.existing(this, false /* This sets to body to be static(true) or dynamic(false)*/);

        // I'll be simulating gravity myself because of the terrain collision.
        // It gives me more control.
        this.setGravity(0,-CONSTANTS.GRAVITY); // For some reason just setting it to zero is not enough

        this.setCollideWorldBounds();

        this.body.velocity.x = 0.02;
        this.body.velocity.y = 0.02;

        // Initial acceleration so it will fall down to the ground
        this.setAcceleration(0, 100);
    }
    
    update(terrain: Terrain, time: number, delta: number) {
        this.collideWithTerrain(terrain);
        this.gunFollow();
    }

    /**
     * 
     * @param dt in miliseconds
     */
    moveLeft(dt: number) {
        // this.isStable = false;
        
        // this.x -= Tank.movementSpeed * dt;

        let offset = new Phaser.Math.Vector2(0, -Tank.movementSpeed).scale(dt).rotate(this.rotation - 3.1415/2);
        this.body.position.add(offset);

        this.playEngineSound();
    }
    
    /**
     * 
     * @param dt in miliseconds
     */
    moveRight(dt: number) {
        // this.isStable = false;
        let offset = new Phaser.Math.Vector2(0, Tank.movementSpeed).scale(dt).rotate(this.rotation - 3.1415/2);
        this.playEngineSound();
        this.body.position.add(offset);
        // this.x += Tank.movementSpeed * dt;
    }

    collideWithTerrain(terrain: Terrain) {

    // Helpers with debugging
        // let graphics = this.scene.add.graphics();
        
        // let drawLine = (x1, y1, x2, y2, color) => {
        //     let line = new Phaser.Geom.Line(x1, y1, x2, y2);
        //     graphics.lineStyle(2, color);
        //     let lineObj = graphics.strokeLineShape(line);
        //     setTimeout(() => {
        //         lineObj.destroy()
        //     }, 10);
        // };

        // let drawCircle = (x,y,r,color) => {
        //     let circle = this.scene.add.circle(x,y,r,color);
        //     setTimeout(() => {
        //         circle.destroy();
        //     }, 10);
        // };
    // Helpers END

    // Code commented out is useful for debugging purposes don't delete it

        let collided = false;
        let responseVector = new Phaser.Math.Vector2(0,0);
        let radius = this.height / 4;
        let counter = 0;
        for (let angle = this.angle; angle <  this.angle + 360; angle += 5) {
            let radians = Phaser.Math.DegToRad(angle);
            let pointAlongSemiCirlceRelativeToTank = new Phaser.Math.Vector2(radius * Math.cos(radians), radius * Math.sin(radians));
            let pointAlongSemiCircle = new Phaser.Math.Vector2(this.x, this.y).add(pointAlongSemiCirlceRelativeToTank)

            let color = 0xffffff;
            if (terrain.checkCollision(pointAlongSemiCircle.x, pointAlongSemiCircle.y)) {
                // if (this.flipX)
                //     console.log(pointAlongSemiCirlceRelativeToTank);
                counter += 1;
                responseVector.x += pointAlongSemiCirlceRelativeToTank.x;
                responseVector.y += pointAlongSemiCirlceRelativeToTank.y;
                color = 0xff0000;
                collided = true;
            }
            // drawCircle(pointAlongSemiCircle.x, pointAlongSemiCircle.y, 1, color);
        }

        if (counter !== 0 ) 
            responseVector.scale(1/counter);

        // if (this.flipX) {
        //     console.log(responseVector);
        // }
        // drawLine(this.x, this.y, this.x + responseVector.x, this.y + responseVector.y, 0xff0000);

        if (collided) {
            // Round the number to prevent stuttering
            let angle =  Math.atan2(responseVector.y, responseVector.x) - 3.1415/2;
            angle = Math.round(angle * 10) / 10;
            this.setRotation(angle);
        }
        
        if (terrain.checkCollision(this.x, this.y)) {
            this.isStable = true;
            this.body.position.add(responseVector.negate());
            this.setVelocity(0,0);
            this.setAcceleration(0,0);
        } else if (!this.isStable) {
            this.setAcceleration(0,100);
        }
    }

    /**
     * Call this function when changining the possiting of the tank
     * otherwise they would seperate
     */
    private gunFollow() {

        let sign = this.flipX? -1 : 1;
        let offsetX = sign * this.width  * (10 / 100) * this.scale;
        let offsetY = this.height * (31 / 100) * this.scale;

        this.gun.angle = sign * this.gunAngle + this.angle;

        this.gun.setPosition(this.x - offsetX, this.y - offsetY);
    }

    fire(scene: Phaser.Scene): Projectile {

        // This is so projectiles won't always go in the positive x direction
        let sign = this.flipX? 1 : -1;

        let intialVector = new Phaser.Math.Vector2(this.firePower, 0);
        intialVector.rotate(Phaser.Math.DegToRad(-this.gunAngle + this.angle + Math.PI / 2));

        let endOfGun = new Phaser.Math.Vector2(this.gun.width /2 * sign, - this.gun.height / 2);
        endOfGun.rotate(Phaser.Math.DegToRad(-1 * sign * this.gunAngle + this.angle));

        // this.scene.add.circle(this.gun.x, this.gun.y,2,0xffff00)
        // this.scene.add.circle(this.gun.x, this.gun.y + endOfGun.y,10,0xff0000)
        // this.scene.add.circle(this.x + endOfGun.x, this.y + endOfGun.y,2,0xff0000)

        let projectile = createProjectile(
            scene, this.currentProjectile, 
            this.gun.x + endOfGun.x, 
            this.gun.y + endOfGun.y, 
            sign * intialVector.x, 
            intialVector.y
        );
        projectile.playSound();
        return projectile;
    }

    setFirePower(power: number) {
        if (Number.isNaN(power)) power = 0;
        this.firePower = Phaser.Math.Clamp(power, Tank.minFirePower, Tank.maxFirePower);
    }

    getFirePower() :number {
        return this.firePower
    }

    /**
     * 
     * @param angle The angle is expressed in degrees
     */
    setGunAngle(angle: number) {
        if (Number.isNaN(angle)) angle = 0;   
        this.gunAngle = Phaser.Math.Clamp(angle, Tank.minGunAngle, Tank.maxGunAngle);
    }

    /**
     * 
     * @returns The angle is expressed in degrees and is a negative number
     */
    getGunAngle() :number {
        return this.gunAngle
    }

    incrementFirePower() {
        this.setFirePower(this.firePower + 1);
    }

    decrementFirePower() {
        this.setFirePower(this.firePower - 1);
    }

    incrementGunAngle() {
        this.setGunAngle(this.gunAngle + 1);
    }

    decrementGunAngle() {
        this.setGunAngle(this.gunAngle - 1);
    }

    setProjectile(projectile: ProjectileType) {
        this.currentProjectile = projectile;
    }

    /**
     * @param damage Damage could potentialy be negative and heal the tank. Ill say this is a feature
     */
    takeDamage(damage: number) {

        this.isStable = false;
        this.body.velocity.add(new Phaser.Math.Vector2(-Math.log(Math.abs(damage) + 1) * 30, 0).rotate(this.tankAngle + Math.PI / 2));

        this.health -= damage;
        if (this.health < 0) this.health = 0;

        this.healthBar.update(this.health);
    }

    playEngineSound() {
        if (this.engineSound.isPlaying) {
            // don't play the engine sound
        } else 
            this.engineSound.play();
    }

    stopEngineSound() {
        this.engineSound.stop();
    }

    getHealth(): number {
        return this.health;
    }

    reset(width, min, max) {
        this.setPosition(width  * (randBetween(min, max) / 100),  0);
        this.health = this.initialHealth;
        this.healthBar.update(this.health);
    }
}