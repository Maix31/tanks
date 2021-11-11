import * as CONSTANTS from '../utility/constants'
import { Terrain } from './terrain';

enum TankColor {
    Red = 'red',
    Blue = 'blue',
}

// колебая се дали композиция ще е по-добре от унаследяване
// https://labs.phaser.io/edit.html?src=src/physics/arcade/extending%20arcade%20sprite.js&v=3.55.2 taken from example code
export class Tank extends Phaser.Physics.Arcade.Sprite /* Или може би Image */ {

    static readonly movementSpeed: number = 0.02;
    static readonly deafaultFirePower: number = 100;

    // private scene: Phaser.Scene;
    private health: number;
    private firePower: number = Tank.deafaultFirePower;
    /**
     * Flag telling us where it needs to be affected by gravity
     */
    private isOnGround: boolean; // В момента спазвам идеята за енкапсулация от ООП, но не смятам че трява да е private
    private gun: Phaser.GameObjects.Image;

    constructor(
        scene: Phaser.Scene, 
        x: number ,
        y: number, 
        health: number, 
        textureBody: string | Phaser.Textures.Texture,
        textureGun: string,
        flipX :boolean,
    ) {
        
        super(scene, x, y, textureBody)
        
        this.scale = 1/2;

        this.setScale(this.scale);
        this.flipX = flipX;
        this.health = health;

        this.gun = scene.add.image(x,y, textureGun);
        this.gun.flipX = flipX;
        this.gun.setScale(this.scale)
        this.gun.setOrigin(0,0);

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
    
    /**
     * 
     * @param dt in miliseconds
     */
    moveLeft(dt: number) {
        this.x -= Tank.movementSpeed * dt;
    }

    /**
     * 
     * @param dt in miliseconds
     */
    moveRight(dt: number) {
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

    fire() {
        console.log('Boom!')
    }

    setFirePower(power: number) {
        this.firePower = power;
        console.log(this.firePower);
    }

    getFirePower() :number {
        return this.firePower
    }

    /**
     * 
     * @param angle The angle is expressed in degrees
     */
    setGunAngle(angle: number) {
        this.gun.angle = angle;
        console.log(this.firePower);
    }

    /**
     * 
     * @returns The angle is expressed in degrees
     */
    getGunAngle() :number {
        return this.gun.angle
    }
}