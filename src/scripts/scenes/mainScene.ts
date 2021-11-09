import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'

function perlinNoise1D(seed: number[], octaves: number) {
    
}

function generateLand(width: number, height: number) {

}


export default class MainScene extends Phaser.Scene {
  fpsText

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    // let {width, height} = this.sys.game.canvas;
    // var rt = this.add.renderTexture(0,0,width,height).;

    // rt.setData

    // for (let y = 0; y < height; y++) {
    //     for (let x = 0; x < width; x++) {
        
    //     }    
    // }
    
    new PhaserLogo(this, this.cameras.main.width / 2, 0)
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
