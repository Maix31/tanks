import FpsText from '../objects/fpsText'
import MousePossitionText from '../objects/mousePossitionText';
import * as CONSTANTS from '../scenes/constants'
import { Tank }    from '../objects/tank'
import { Terrain } from '../objects/terrain';

class Projectile {

}

class BasicProjectile extends Projectile {

}

class SuperiorProjectile extends Projectile {

}

export default class MainScene extends Phaser.Scene {
  
    fpsText;
    mousePossitionText;
    terrain: Terrain;
    mouse;
    tankLeft: Tank;
    cursors;

  constructor() {
    super({ key: 'MainScene' })

  }

    create() {

        this.load.image('tankBodyBlue', 'tank_body_blue.png');

        // Terrain could use diffrent width and heighth than pixel size of canvas but would require the use of scaling when drawing
        let { width, height } = this.cameras.main;
        this.terrain = new Terrain(this, width, height);
        // this.terrain.destroyTerrain(0, 600, 50);
        this.tankLeft = new Tank(this, 0,0,100,'tankBodyBlue');
        this.cursors = this.input.keyboard.createCursorKeys();

        this.input.on('pointerup', (pointer) => {
            this.terrain.damageTerrain(pointer.x, pointer.y,50);
        });        

        this.fpsText = new FpsText(this)
        this.mousePossitionText = new MousePossitionText(this)

        // display the Phaser.VERSION
        this.add
        .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
            color: '#000000',
            fontSize: '24px'
        })
        .setOrigin(1, 0)
        
    }

    update(time: number, delta: number) {

        
        if (this.terrain.checkCollision(this.tankLeft.x, this.tankLeft.y)) {
            this.tankLeft.setAcceleration(0,0);
            this.tankLeft.setVelocity(0,0);
        }

        if (this.cursors.left.isDown)
            this.tankLeft.moveLeft(delta);
            
        if (this.cursors.right.isDown) 
            this.tankLeft.moveRight(delta);

        this.fpsText.update()
        this.mousePossitionText.update();
    }   
}
