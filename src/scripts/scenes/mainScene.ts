import FpsText from '../objects/fpsText'
import { HealthBar } from '../objects/healthBar';
import MousePossitionText from '../objects/mousePossitionText';
import { Tank }    from '../objects/tank'
import { Terrain } from '../objects/terrain';
import { randBetween } from '../utility/math'

export default class MainScene extends Phaser.Scene {
  
    fpsText;
    mousePossitionText;
    background: Phaser.GameObjects.Image;
    zeppelin: Phaser.GameObjects.Image;
    cloud: Phaser.GameObjects.Image[];
    terrain: Terrain;
    mouse;

    tankLeft: Tank;
    tankRigth: Tank;

    healthBarLeft: HealthBar;
    healthBarRigth: HealthBar;

    fireButton: Phaser.GameObjects.Sprite;
    
    powerButtonIncrement: Phaser.GameObjects.Image;
    powerButtonDecrement: Phaser.GameObjects.Image;
    angleButtonIncrement: Phaser.GameObjects.Image;
    angleButtonDecrement: Phaser.GameObjects.Image;
    // I decided to go with buttons for input in the end.
    // Initialy I did html input field but it turns out that I
    // misread my assignment, whoops. Thought I had to to it with text input.
    // inputPower; // This is a HTMLInputElement
    // inputAngle; // This is a HTMLInputElement
    textPower: Phaser.GameObjects.Image;
    textAngle: Phaser.GameObjects.Image;
    textPowerNumber: Phaser.GameObjects.Text;
    textAngleNumber: Phaser.GameObjects.Text;
    
    arrowButtonRigth: Phaser.GameObjects.Image;
    arrowButtonLeft: Phaser.GameObjects.Image;

    currentProjectile: {sprite: Phaser.GameObjects.Sprite, currentIndex: number};

    basicProjectileSound: Phaser.Sound.BaseSound;
    superiorProjectileSound: Phaser.Sound.BaseSound;
    ambientMusic: Phaser.Sound.BaseSound;
    uiClickSound: Phaser.Sound.BaseSound;

    cursors;

    shouldMoveLeft: boolean = false;
    shouldMoveRigth: boolean = false;

    constructor() {
        super({ key: 'MainScene' })
    }

    preload() {

        this.load.image('background', 'assets/background.png')
        this.load.image('zeppelin', 'assets/zeppelin.png');
        
    //Clouds
        this.load.image('cloud_0', 'assets/cloud/cloud_0.png');
        this.load.image('cloud_1', 'assets/cloud/cloud_1.png');
        this.load.image('cloud_2', 'assets/cloud/cloud_2.png');
        this.load.image('cloud_3', 'assets/cloud/cloud_3.png');

    //Tank
        this.load.image('tankBodyBlue', 'assets/tank/tank_body_blue_scaled.png');
        this.load.image('tankBodyRed', 'assets/tank/tank_body_red_scaled.png');
        
        this.load.image('tankGunBlue', 'assets/tank/tank_gun_blue_scaled.png');
        this.load.image('tankGunRed', 'assets/tank/tank_gun_red_scaled.png');
    //HUD
        this.load.image('barBackground', 'assets/hud/bar_background.png');
        this.load.image('barRed', 'assets/hud/bar_red.png');
        this.load.image('barBlue', 'assets/hud/bar_blue.png');
        this.load.image('barGlass', 'assets/hud/bar_glass.png');
    //GUI
        this.load.image('fireButton', 'assets/gui/fire_button.png');
    
        this.load.image('textPower', 'assets/gui/power_input_text.png');
        this.load.image('textAngle', 'assets/gui/angle_input_text.png');

        this.load.image('minus', 'assets/gui/minus.png');
        this.load.image('plus', 'assets/gui/plus.png');

        this.load.image('arrowRigth', 'assets/gui/arrow_rigth.png');

        this.load.spritesheet('currentProjectileButton', 'assets/gui/current_projectile_button.png', {frameWidth: 94, frameHeight: 45});

    //Sounds
        this.load.audio('basicProjectileSound', 'assets/sounds/basic_projectile.wav');
        this.load.audio('superiorProjectileSound', 'assets/sounds/superior_projectile.wav');
        this.load.audio('ambientMusic', 'assets/sounds/ambient_sound.wav');
        this.load.audio('uiClickSound', 'assets/sounds/ui_click.wav');
    }

    // Should refactor this function into a couple of functions
    // 100 lines is too much
    create() {

        let { width, height } = this.cameras.main;

        this.background = this.add.image(0,0,'background');
        let scalingFactorX = width  / this.background.width;
        let scalingFactorY = height / this.background.height;
        this.background.setPosition(this.background.width/2 * scalingFactorX, this.background.height/2 * scalingFactorY);
        this.background.setScale(width / this.background.width, height / this.background.height);

        let addAnimatedImage = (imageName: string, flipX: boolean, alpha: number, scale: number) => {
            let image = this.add.image(0,0, imageName);
            let randomOffsetX = randBetween(-width  * (100 / 100), width  * (100 / 100))
            let randomOffsetY = randBetween(0, height * (30 / 100))
            image.setPosition(image.width/2 * scale + randomOffsetX, image.height/2 * scale  + randomOffsetY)
            image.setScale(scale);
            image.setAlpha(alpha);
            image.setFlipX(flipX); // add more variation to the clouds
            this.tweens.add({
                targets: image,
                x: width * 2,
                duration: randBetween(200,400) * 1000,
                repeat: -1,
                yoyo: true,
            });
            return image;
        }

        this.cloud = [...Array(4)].map( (_, i) => addAnimatedImage('cloud_' + i, Math.random() < 0.5, 0.6, 1/8));
        this.zeppelin = addAnimatedImage('zeppelin', true, 1, 1/2);

        // Terrain could use diffrent width and heighth than pixel size of canvas but would require the use of scaling when drawing
        this.terrain = new Terrain(this, width, height);
        this.tankLeft  = new Tank(this, 0,0,100, 'tankBodyBlue', 'tankGunBlue', true);
        this.tankRigth = new Tank(this, width,0,100, 'tankBodyRed', 'tankGunRed', false);

        this.healthBarLeft  = new HealthBar(this, width * (0 / 100), height * (10 / 100), 100,'barBackground', 'barBlue', 'barGlass');
        this.healthBarRigth = new HealthBar(this, width * (68 / 100), height * (10 / 100), 100,'barBackground', 'barRed', 'barGlass');

        this.cursors = this.input.keyboard.createCursorKeys();
        
        let padding = { x : width * (5 / 100), y: height * (5 / 100)};
        this.fireButton = this.add.sprite(0,0, 'fireButton');
        this.fireButton.setPosition(width - this.fireButton.width / 2 - padding.x,height- this.fireButton.height / 2 - padding.y);
        this.fireButton.setInteractive().on('pointerup', (event) => { this.uiClickSound.play(); this.tankLeft.fire();});

        this.powerButtonIncrement = this.add.image(width * (60 / 100), height * (88 / 100), 'plus' )
            .setScale(1/2.5)
            .setInteractive()
            .on('pointerup', (event) => { 
                this.uiClickSound.play(); 
                this.tankLeft.incrementFirePower();
            })
        this.powerButtonDecrement = this.add.image(width * (40 / 100), height * (88 / 100), 'minus')
            .setScale(1/2.5)
            .setInteractive()
            .on('pointerup', (event) => { 
                this.uiClickSound.play(); 
                this.tankLeft.decrementFirePower();
            });

        this.angleButtonIncrement = this.add.image(width * (60 / 100), height * (95 / 100), 'plus' )
            .setScale(1/2.5)
            .setInteractive()
            .on('pointerup', (event) => { 
                this.uiClickSound.play();
                this.tankLeft.incrementGunAngle();
            });
        this.angleButtonDecrement = this.add.image(width * (40 / 100), height * (95 / 100), 'minus')
            .setScale(1/2.5)
            .setInteractive()
            .on('pointerup', (event) => { 
                this.uiClickSound.play(); 
                this.tankLeft.decrementGunAngle();
            });

        // this.inputPower = this.add.dom(width * (50 / 100),height * (90 / 100), document.createElement("input"), `width:10%; placeholder="100"`);
        // this.inputAngle = this.add.dom(width * (50 / 100),height * (95 / 100), document.createElement("input"), `width:10%; placeholder="power"`);

        this.textPower = this.add.image(width * (50 / 100),height * (88 / 100), 'textPower');
        this.textAngle = this.add.image(width * (50 / 100),height * (95 / 100), 'textAngle');
        this.textPower.scale = 120 / 100;
        this.textAngle.scale = 120 / 100;

        this.textPowerNumber = this.add.text(width * (43.2 / 100),height * (86.5 / 100), `${this.tankLeft.getFirePower()}`, {align: 'center'});
        this.textAngleNumber = this.add.text(width * (43.2 / 100),height * (94 / 100), `${this.tankLeft.getGunAngle()}`, {align: 'center'});

        // this.inputPower.addListener('input');
        // this.inputPower.on('input', (event) => {
        //     this.tankLeft.setFirePower(parseFloat(event.target.value));
        // })
        // this.inputAngle.addListener('input');
        // this.inputAngle.on('input', (event) => {
        //     this.tankLeft.setGunAngle(parseFloat(event.target.value));
        // })

        this.arrowButtonLeft  = this.add.image(width * (10 / 100), height * (90 / 100), 'arrowRigth');
        this.arrowButtonRigth = this.add.image(width * (23 / 100), height * (90 / 100), 'arrowRigth');

        this.arrowButtonLeft .setInteractive().on('pointerdown', (event) => { this.uiClickSound.play() ;this.shouldMoveLeft  = true ;});
        this.arrowButtonLeft .setInteractive().on('pointerup',   (event) => { this.uiClickSound.play() ;this.shouldMoveLeft  = false;});
        this.arrowButtonRigth.setInteractive().on('pointerdown', (event) => { this.uiClickSound.play() ;this.shouldMoveRigth = true ;});
        this.arrowButtonRigth.setInteractive().on('pointerup',   (event) => { this.uiClickSound.play() ;this.shouldMoveRigth = false;});

        this.arrowButtonLeft.flipX = true;

        // This is a work around 
        // Needs refactoring
        this.currentProjectile = {
            currentIndex: 0,
            sprite: this.add.sprite(width * (70 / 100), height * (90 / 100),'currentProjectileButton', 0)
            .setInteractive()
            .on('pointerup', (event) => {
                console.log(this.currentProjectile.currentIndex);
                this.currentProjectile.currentIndex += 1;
                this.currentProjectile.currentIndex %= 2;
                this.currentProjectile.sprite.setFrame(this.currentProjectile.currentIndex);
            })
        };

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
        this.uiClickSound = this.sound.add('uiClickSound');
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

        this.textPowerNumber.setText(`${this.tankLeft.getFirePower()}`);
        this.textAngleNumber.setText(`${this.tankLeft.getGunAngle()}`);

        this.tankLeft.collideWithTerrain(this.terrain);
        this.tankRigth.collideWithTerrain(this.terrain);

        if (this.cursors.left.isDown || this.shouldMoveLeft)
            this.tankLeft.moveLeft(delta);
            
        if (this.cursors.right.isDown || this.shouldMoveRigth) 
            this.tankLeft.moveRight(delta);

        this.tankLeft.gunFollow();
        this.tankRigth.gunFollow();

        this.fpsText.update()
        this.mousePossitionText.update();
    }   
}
