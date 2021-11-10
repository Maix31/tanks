import * as CONSTANTS from '../utility/constants'

enum TankColor {
    Red = 'red',
    Blue = 'blue',
}

// колебая се дали композиция ще е по-добре от унаследяване
// https://labs.phaser.io/edit.html?src=src/physics/arcade/extending%20arcade%20sprite.js&v=3.55.2 taken from example code
export class Tank extends Phaser.Physics.Arcade.Sprite /* Или може би Image */ {

    static movementSpeed: number = 0.02;

    // private scene: Phaser.Scene;
    private health: number;
    /**
     * Flag telling us where it needs to be affected by gravity
     */
    private isOnGround: boolean; // В момента спазвам идеята за енкапсулация от ООП, но не смятам че трява да е private

    constructor(scene: Phaser.Scene, x: number ,y: number, health: number, texture: string | Phaser.Textures.Texture) {
        super(scene, x, y, texture)
        // this.scene = scene;
        this.health = health;

        // This adds its to the the display list
        scene.add.existing(this);
        scene.physics.add.existing(this, false /* This sets to body to be static(true) or dynamic(false)*/);

        this.turnGravityOff();

        this.body.velocity.x = 0.02;
        this.body.velocity.y = 0.02;

        // Initial so it will fall down to the ground
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
}