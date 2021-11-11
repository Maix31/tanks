export class HealthBar {
    
    private readonly maxHealth: number;
    private health: number;
    private barGlass: Phaser.GameObjects.Image;
    private barBackground: Phaser.GameObjects.Image;
    private barColor: Phaser.GameObjects.Image;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        health: number,
        barBackground: Phaser.Textures.Texture | string,
        barColor: Phaser.Textures.Texture | string,
        barGlass: Phaser.Textures.Texture | string,
    ) {
        this.maxHealth = health;
        this.health = health;
        this.barBackground = scene.add.image(x,y,barBackground);
        this.barColor = scene.add.image(x,y,barColor);
        this.barGlass = scene.add.image(x,y,barGlass);

        this.barBackground.setOrigin(0, 0.5);
        this.barColor.setOrigin(0, 0.5)
        this.barGlass.setOrigin(0, 0.5)

        let scale = 1 / 4;

        this.barBackground.setScale(scale);
        this.barColor.setScale(scale/8, scale);
        this.barGlass.setScale(scale);
    }

    update(health: number) {
        this.barColor.setSize
    }
}