import FpsText from '../objects/fpsText'
import MousePossitionText from '../objects/mousePossitionText';
import { Tank }    from '../objects/tank'
import { Terrain } from '../objects/terrain';
import { randBetween } from '../utility/math'

export default class MainScene extends Phaser.Scene {
  
    fpsText;
    mousePossitionText;
    background: Phaser.GameObjects.Image;
    cloud: Phaser.GameObjects.Image[];
    terrain: Terrain;
    mouse;
    tankLeft: Tank;
    tankRigth: Tank;
    fireButton: Phaser.GameObjects.Sprite;
    inputPower; // This is a HTMLInputElement
    inputAngle; // This is a HTMLInputElement
    textPower: Phaser.GameObjects.Image;
    textAngle: Phaser.GameObjects.Image;
    basicProjectileSound: Phaser.Sound.BaseSound;
    superiorProjectileSound: Phaser.Sound.BaseSound;
    ambientMusic: Phaser.Sound.BaseSound;
    cursors;

    constructor() {
        super({ key: 'MainScene' })
    }

    preload() {

        this.load.html('nameform', 'assets/nameform.html');

        this.load.image('background', 'assets/background.png')
        
        this.load.image('cloud_0', 'assets/cloud_0.png')
        this.load.image('cloud_1', 'assets/cloud_1.png')
        this.load.image('cloud_2', 'assets/cloud_2.png')
        this.load.image('cloud_3', 'assets/cloud_3.png')
        

        this.load.image('tankBodyBlue', 'assets/tank_body_blue_scaled.png');
        this.load.image('tankBodyRed', 'assets/tank_body_red_scaled.png');
        
        this.load.image('tankGunBlue', 'assets/tank_gun_blue_scaled.png');
        this.load.image('tankGunRed', 'assets/tank_gun_red_scaled.png');

        this.load.image('fireButton', 'assets/fire_button.png');

        this.load.image('textPower', 'assets/power_input_text.png')
        this.load.image('textAngle', 'assets/angle_input_text.png')

        this.load.audio('basicProjectileSound', 'assets/basic_projectile.wav');
        this.load.audio('superiorProjectileSound', 'assets/superior_projectile.wav');
        this.load.audio('ambientMusic', 'assets/ambient_sound.wav');
    }

    create() {

        let { width, height } = this.cameras.main;

        this.background = this.add.image(0,0,'background');
        let scalingFactorX = width  / this.background.width;
        let scalingFactorY = height / this.background.height;
        this.background.setPosition(this.background.width/2 * scalingFactorX, this.background.height/2 * scalingFactorY);
        this.background.setScale(width / this.background.width, height / this.background.height);

        this.cloud = [...Array(1)].map((_, i) => {
            let image = this.add.image(0,0, 'cloud_'+i);
            let scalingFactor = 1/8;
            image.setPosition(image.width/2 * scalingFactor, image.height/2 * scalingFactor)
            image.setScale(scalingFactor);
            image.setAlpha(0.6);
            // image
            return image;
        });

        // Terrain could use diffrent width and heighth than pixel size of canvas but would require the use of scaling when drawing
        this.terrain = new Terrain(this, width, height);
        this.tankLeft  = new Tank(this, 0,0,100, 'tankBodyBlue', 'tankGunBlue', true);
        this.tankRigth = new Tank(this, width,0,100, 'tankBodyRed', 'tankGunRed', false);
        this.cursors = this.input.keyboard.createCursorKeys();
        
        let padding = { x : width * (5 / 100), y: height * (5 / 100)};
        this.fireButton = this.add.sprite(0,0, 'fireButton');
        this.fireButton.setPosition(width - this.fireButton.width / 2 - padding.x,height- this.fireButton.height / 2 - padding.y);
        this.fireButton.setInteractive().on('pointerup', this.tankLeft.fire);

        this.inputPower = this.add.dom(width * (50 / 100),height * (90 / 100), document.createElement('input'), `width:10%; placeholder="100"`);
        this.inputAngle = this.add.dom(width * (50 / 100),height * (95 / 100), document.createElement('input'), `width:10%; placeholder="power"`);

        this.textPower = this.add.image(width * (39 / 100),height * (90 / 100), 'textPower');
        this.textAngle = this.add.image(width * (39 / 100),height * (95 / 100), 'textAngle');
        this.textPower.scale = 90 / 100;
        this.textAngle.scale = 90 / 100;
        this.inputPower.addListener('input');
        this.inputPower.on('input', (event) => {
            this.tankLeft.setFirePower(Number(event.target.value));
        })
        this.inputAngle.addListener('input');
        this.inputAngle.on('input', (event) => {
            this.tankLeft.setGunAngle(Number(event.target.value));
        })

        this.basicProjectileSound    = this.sound.add('basicProjectileSound');
        this.superiorProjectileSound = this.sound.add('superiorProjectileSound');
        this.ambientMusic = this.sound.add('ambientMusic');
        let musicConfig: Phaser.Types.Sound.SoundConfig = {
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0,
        };
        this.ambientMusic.play(musicConfig);

        this.input.on('pointerup', (pointer) => {
            this.basicProjectileSound.play();
            // this.ambientSound.play();
            this.terrain.damageTerrain(pointer.x, pointer.y,50);
        });
        
        this.fpsText = new FpsText(this)
        this.mousePossitionText = new MousePossitionText(this)

        // display the Phaser.VERSION
        this.add
        .text(this.cameras.main.width - 15, 45, `Phaser v${Phaser.VERSION}`, {
            color: '#000000',
            fontSize: '24px'
        })
        .setOrigin(1, 0)
        
    }

    update(time: number, delta: number) {

        this.tankLeft.collideWithTerrain(this.terrain);
        this.tankRigth.collideWithTerrain(this.terrain);

        if (this.cursors.left.isDown)
            this.tankLeft.moveLeft(delta);
            
        if (this.cursors.right.isDown) 
            this.tankLeft.moveRight(delta);

        this.tankLeft.gunFollow();
        this.tankRigth.gunFollow();

        this.fpsText.update()
        this.mousePossitionText.update();
    }   
}
