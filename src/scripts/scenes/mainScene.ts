import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'
import { Scene } from 'phaser';

// https://en.wikipedia.org/wiki/Perlin_noise
function perlinNoise1D(seed: number[], octaves: number, bias: number) {
    
    let output: number[] = [];

    const count = seed.length;
    for (let x = 0; x < count ; x++)
    {
        let noise = 0.0;
        let scaleAcc = 0.0;
        let scale = 1.0;

        for (let o = 0; o < octaves; o++)
        {
            let pitch = seed.length >> o;
            let sample1 = Math.floor(x / pitch) * pitch;
            let sample2 = (sample1 + pitch) % count;
            let blend = (x - sample1) / pitch;
            let sample = (1.0 - blend) * seed[sample1] + blend * seed[sample2];
            scaleAcc += scale;
            noise += sample * scale;
            scale = scale / bias;
        }
        // Scale to seed range
        output.push(noise / scaleAcc);
    }

    return output;
}

function generateLand(width: number, height: number) {

}

class Projectile {

}

class BasicProjectile extends Projectile {

}

class SuperiorProjectile extends Projectile {

}

class Tank extends Phaser.Physics.Arcade.Image {
    health
    // sprite: Phaser.

    constructor(scene: Phaser.Scene) {
        scene.add.image
        super(scene, 0,0, '');
        
    }
}

enum Tile {
    Air = 0,
    Ground = 1,
}

class Terrain {

    // Refrence to the global context
    private scene: Phaser.Scene;

    private width: number;
    private heigth: number;
    private data: Tile[];

    // We will be using this to draw the Terrain.data to
    // Also combining it with a sprite so we don't have to manually make a draw call
    private canvas: Phaser.Textures.CanvasTexture;
    private terrainImage: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, width: number, heigth: number) {
        this.scene = scene;

        this.width  = width;
        this.heigth = heigth;
        this.data   = this.generateTerrain();

        this.canvas = this.initCanvas();
        // For some reason its coordiates aren't top left(0,0) but centre is (0,0) so translate by half the image
        this.terrainImage = this.scene.add.image(width/2,heigth/2,this.canvas);
    }

    private generateTerrain() : Tile[] {
        let data = Array<Tile>(this.width * this.heigth)
        
        let noiseSeed = [...Array(this.width)].map(Math.random);
        // Set the first and last element to a specific height because perlinNoise1d samples at a fixed interval
        noiseSeed[0] = 0.5;

        // Array holding height information per pixel on the surface in 0 to 1
        let surface = perlinNoise1D(noiseSeed, 8, 2);

        for (let y = 0; y < this.heigth; y++) {
            for (let x = 0; x < this.width; x++) {
                if (y >= (surface[x] * this.heigth)) 
                    data[x + y * this.width] = Tile.Ground;
                else 
                    data[x + y * this.width] = Tile.Air;
            }    
        }

        return data;
    }

    private initCanvas(): Phaser.Textures.CanvasTexture {
        let canvas = this.scene.textures.createCanvas('terrain', this.width, this.heigth);
        Terrain.updateCanvas(canvas, this.data, this.width, this.heigth);
        return canvas;

    }
    // Uses this.data to update the canvas with
    private static updateCanvas(canvas: Phaser.Textures.CanvasTexture, data: Tile[], width: number, heigth: number) {
        let arr = new Uint8ClampedArray(width * heigth * 4);
        for (let y = 0; y < heigth; y++) {
            for (let x = 0; x < width; x++) {

                // 0   alpha value means 100% transperancy
                // 255 alpha value means   0% transperancy            
                // First idea but interpolation is always better
                // let alphaValue = (-Phaser.Math.SmoothStep(surface[x] * heigth, y - 1, y) + 1) * 255;

                arr[(x + y * width) * 4 + 0] = 0;          // R value
                arr[(x + y * width) * 4 + 1] = 255;        // G value
                arr[(x + y * width) * 4 + 2] = 0;          // B value
                arr[(x + y * width) * 4 + 3] = data[x + y * width] * 255; // A value
            }    
        }
        
        let imageData = new ImageData(arr, width);
        canvas.putData(imageData, 0,0);
        
        // Please help me find a easy way to do gaussian blur
        
        // This is to avoid any unwanted pixelation
        // canvas.setFilter(Phaser.Textures.FilterMode.LINEAR);
        // canvas.context.filter = 'blur(4px)';
        // canvas.context.shadowBlur = 4;
        // To make changes call this
        canvas.update();
    }
}

export default class MainScene extends Phaser.Scene {
  
    fpsText;
    terrain: Terrain;

  constructor() {
    super({ key: 'MainScene' })

  }

    create() {

        // Terrain could use diffrent width and heighth than pixel size of canvas but would require the use of scaling when drawing
        let { width, height } = this.cameras.main;
        this.terrain = new Terrain(this, width, height);

        // const mapWidth = 800;
        // const mapHeigth = 600;

        // let noiseSeed = [...Array(mapWidth)].map(Math.random);
        // // Set the first and last element to a specific height because perlinNoise1d samples at a fixed interval
        // noiseSeed[0] = 0.5;

        // // Array holding height information per pixel on the surface in 0 to 1
        // let surface = perlinNoise1D(noiseSeed, 8, 2);
        
        
        

        // const terrainImage = this.add.image(mapWidth/2,mapHeigth/2, 'terrain');
        // console.log(terrainImage);

        
        // new PhaserLogo(this, this.cameras.main.width / 2, 0)
        this.fpsText = new FpsText(this)

        // display the Phaser.VERSION
        this.add
        .text(this.cameras.main.width - 15, 15, `Phaser v${Phaser.VERSION}`, {
            color: '#000000',
            fontSize: '24px'
        })
        .setOrigin(1, 0)
    }

    update() {
        this.fpsText.update()
    }   
}
