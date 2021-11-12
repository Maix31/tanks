// It makes alot of sense to make this a Phaser.GameObjects.Container
// Leaving it for future refactoring
// https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Container.html
export class HealthBar {
    
    private readonly maxHealth: number;
    private health: number;
    private barGlass: Phaser.GameObjects.Image;
    private barBackground: Phaser.GameObjects.Image;
    private barColor: Phaser.GameObjects.Image;

    /**
     * 
     * @param scene 
     * @param x 
     * @param y 
     * @param health Greater than 0 value  
     * @param barBackground 
     * @param barColor 
     * @param barGlass 
     */
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        health: number,
        barBackground: Phaser.Textures.Texture | string,
        barColor: Phaser.Textures.Texture | string,
        barGlass: Phaser.Textures.Texture | string,
    ) {
        if (health <= 0)
            throw new Error('Please don\'t use 0 health HealthBars!');

        this.maxHealth = health;
        this.health = health;
        this.barBackground = scene.add.image(x,y,barBackground);
        this.barColor = scene.add.image(x,y,barColor);
        this.barGlass = scene.add.image(x,y,barGlass);

        this.barBackground.setOrigin(0, 0.5);
        this.barColor.setOrigin(0, 0.5)
        this.barGlass.setOrigin(0, 0.5)

        let scaleX = 1 / 4;
        let scaleY = 1 / 6;

        this.barBackground.setScale(scaleX, scaleY);
        this.barColor.setScale(scaleX, scaleY);
        this.barGlass.setScale(scaleX, scaleY);

    }

    update(health: number) {
        this.health = health;
        let percentHealthLeft = this.health / this.maxHealth;

        this.barColor.setCrop(0,0, this.barColor.width * percentHealthLeft, this.barColor.height);
    }
}