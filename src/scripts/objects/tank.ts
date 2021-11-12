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

    // private scene: Phaser.Scene;
    private readonly initialHealth;
    private health: number;
    private firePower: number = Tank.deafaultFirePower;
    /**
     * Flag telling us where it needs to be affected by gravity
     */
    private isOnGround: boolean; // В момента спазвам идеята за енкапсулация от ООП, но не смятам че трява да е private
    private gun: Phaser.GameObjects.Image;
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
        this.gun.setOrigin(0,0);

        this.currentProjectile = ProjectileType.BasicProjectile;

        // random engine sound
        this.engineSound = scene.sound.add('engineSound' + Math.round(Math.random()));

        // This adds its to the the display list
        scene.add.existing(this);
        scene.physics.add.existing(this, false /* This sets to body to be static(true) or dynamic(false)*/);

        // I'll be simulating gravity myself because of the terrain collision.
        // It gives me more control.
        this.turnGravityOff();

        this.setCollideWorldBounds();

        this.body.velocity.x = 0.02;
        this.body.velocity.y = 0.02;

        // Initial acceleration so it will fall down to the ground
        this.setAcceleration(0, 100);
    }
    
    update(time: number, delta: number) {
        this.gunFollow();
    }

    /**
     * 
     * @param dt in miliseconds
     */
    moveLeft(dt: number) {
        this.playEngineSound();
        this.x -= Tank.movementSpeed * dt;
    }
    
    /**
     * 
     * @param dt in miliseconds
     */
    moveRight(dt: number) {
        this.playEngineSound();
        this.x += Tank.movementSpeed * dt;
    }

    setGrounded(flag: boolean) {
        this.isOnGround = flag;
        this.turnGravityOff();
    }

    turnGravityOff() {
        // Couldn't find another way to turn off the gravity and still by dynamic object
        this.setGravity(0,-CONSTANTS.GRAVITY);
    }

    turnGravityOn() {
        // Couldn't find another way to turn off the gravity and still by dynamic object
        this.setGravity(0,0);
    }

    collideWithTerrain(terrain: Terrain) {

        if (terrain.checkCollision(this.x, this.y + this.height/3 )) {
            this.setAcceleration(0,0);
            this.setVelocity(0,0);
        } else {
            this.setAcceleration(0,100);
        }
    }

    /**
     * Call this function when changining the possiting of the tank
     * otherwise they would seperate
     */
    gunFollow() {
        let offsetX;
        if (this.flipX) 
            offsetX = this.width  * (10 / 100) * this.scale;
        else 
            offsetX = -1*this.width  * (80 / 100) * this.scale;

        let offsetY = this.height * (38 / 100) * this.scale;

        this.gun.setPosition(this.x + offsetX, this.y - offsetY);
    }

    fire(scene: Phaser.Scene): Projectile {

        // This is so projectiles won't always go in the positive x direction
        let sign = this.flipX? 1 : -1;

        let v = new Phaser.Math.Vector2(this.getFirePower(), 0);
        v.rotate(Phaser.Math.DegToRad(this.gun.angle));

        let projectile = createProjectile(scene, this.currentProjectile, this.gun.x, this.gun.y, sign * v.x, v.y);
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
        this.gun.angle = Phaser.Math.Clamp(angle, -Tank.maxGunAngle, -Tank.minGunAngle);
    }

    /**
     * 
     * @returns The angle is expressed in degrees and is a negative number
     */
    getGunAngle() :number {
        return this.gun.angle
    }

    incrementFirePower() {
        this.setFirePower(this.firePower + 1);
    }

    decrementFirePower() {
        this.setFirePower(this.firePower - 1);
    }

    // I know it says increment but this is not a bug
    // I actually need it to subtract from the angle
    incrementGunAngle() {
        this.setGunAngle(this.gun.angle - 1);
    }

    // I know it says decrement but this is not a bug
    // I actually need it to add to the angle
    decrementGunAngle() {
        this.setGunAngle(this.gun.angle + 1);
    }

    setProjectile(projectile: ProjectileType) {
        this.currentProjectile = projectile;
    }

    /**
     * 
     * @param damage Damage could potentialy be negative and heal the tank. Ill say this is a feature
     */
    takeDamage(damage: number) {
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

    getHealth(): number {
        return this.health;
    }

    reset(width, min, max) {
        this.setPosition(width  * (randBetween(min, max) / 100),  0);
        this.health = this.initialHealth;
        this.healthBar.update(this.health);
    }
}