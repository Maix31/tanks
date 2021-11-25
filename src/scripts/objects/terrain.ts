import {perlinNoise1D,  isInsideCircle} from '../utility/math'

// The values are used for some math in Terrain.updateCanvas, so please don't change them
enum Pixel {
    Air = 0,
    Ground = 1,
}

// Seems to be using ~10mb per instance so use sparingly
export class Terrain {

    // Refrence to the global context it might turn out that I don't need this field
    // private scene: Phaser.Scene;

    private width: number;
    private height: number;
    // This needs to be a bit array
    private data: Pixel[];

    // We will be using this to draw the Terrain.data to
    // Also combining it with a image so we don't have to manually make a draw call
    private canvas: Phaser.Textures.CanvasTexture;
    private terrainImage: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, width: number, height: number, noiseSeed?: number[]) {
        // this.scene = scene;

        this.width  = width;
        this.height = height;
        this.data   = this.generateTerrain(noiseSeed);

        this.canvas = this.initCanvas(scene);
        // For some reason its coordiates aren't top left(0,0) but centre is (0,0) so translate by half the image
        this.terrainImage = scene.add.image(width/2,height/2,this.canvas);
    }

    private generateTerrain(noiseSeed?: number[]) : Pixel[] {

        let data = Array<Pixel>(this.width * this.height);
        
        if (noiseSeed === undefined)
            noiseSeed = [...Array(this.width)].map(Math.random);
        // Set the first and last element to a specific height because perlinNoise1d samples at a fixed interval
        noiseSeed[0] = 0.7;

        // Array holding height information per pixel on the surface in 0 to 1
        let surface = perlinNoise1D(noiseSeed, 8, 2);

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (y >= (surface[x] * this.height)) 
                    data[x + y * this.width] = Pixel.Ground;
                else 
                    data[x + y * this.width] = Pixel.Air;
            }    
        }

        return data;
    }

    // returning value doesn't make much sense
    private initCanvas(scene: Phaser.Scene): Phaser.Textures.CanvasTexture {
        this.canvas = scene.textures.createCanvas('terrain', this.width, this.height);
        this.updateCanvas();
        return this.canvas;
    }

    /** 
     * Always call this function when making changes to this.data
     * This is an expensive operation! Measurement said its between 20ms to 5ms per call
     * */ 
    private updateCanvas() {
        let arr = new Uint8ClampedArray(this.width * this.height * 4);
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {

                // 0   alpha value means 100% transperancy
                // 255 alpha value means   0% transperancy            
                // This wouldn't work because we migth have more than 1 y value for every x 
                // let alphaValue = (-Phaser.Math.SmoothStep(surface[x] * heigth, y - 1, y) + 1) * 255;
                arr[(x + y * this.width) * 4 + 0] = 0;          // R value
                arr[(x + y * this.width) * 4 + 1] = 150;        // G value
                arr[(x + y * this.width) * 4 + 2] = 0;          // B value
                arr[(x + y * this.width) * 4 + 3] = this.data[x + y * this.width] * 255; // A value
            }    
        }
        
        let imageData = new ImageData(arr, this.width);
        this.canvas.putData(imageData, 0,0);
        
        // Please help me find a easy way to do gaussian blur
        // Tried this but coudn't get it to work
        // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter
        
        // canvas.setFilter(Phaser.Textures.FilterMode.LINEAR);
        this.canvas.context.filter = 'blur(16px)';
        // canvas.context.shadowBlur = 4;

        // To make changes call this
        this.canvas.update();
    }

    // remove part of the terrain
    // x,y is the centre of the circle
    //
    // A|-----|
    //  |(x,y)|
    //  |_____|B
    public damageTerrain(x: number, y: number, radius: number) {

        for (let i = y - radius; i < y + radius; i++ )
            for (let j = x - radius; j < x + radius; j++ ) 
                if (isInsideCircle(j - x, i - y, radius)) 
                    this.setPixel(j, i, 0);
        // might consider not calling this if destoyTerrain is called too many times consecutively
        this.updateCanvas();
    }

    private isOutsideBoundry(x: number, y: number) {
        return x < 0 || x > this.width || y < 0 || y > this.height;
    }

    private setPixel(x: number, y: number, tile: Pixel) {

        if (this.isOutsideBoundry(x,y))
            return;
            
        // This took me 2-3 hours to figuer out that I need to use Math.floor()
        this.data[Math.floor(x) + Math.floor(y) * this.width] = tile;
    }

    getPixel(x: number, y: number) : Pixel {
        return this.data[x + y * this.width];
    }

    public checkCollision(x: number, y: number): boolean {
        
        if (this.isOutsideBoundry(x,y))
            return false;

        x = Math.floor(x);
        y = Math.floor(y);

        if (this.data[x + y * this.width] == Pixel.Air) 
            return false;

        return true;
    }

    // getData() {
    //     return this.data;
    // }

    // getWidth() {
    //     return this.width;
    // }

    // getHeight() {
    //     return this.height;
    // }

    reset(noiseSeed?: number[]) {
        this.data = this.generateTerrain(noiseSeed);
        this.updateCanvas();
    }
}