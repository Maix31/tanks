import 'phaser'
import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'
import * as CONSTANTS from './utility/constants'

const config = {
    type: Phaser.AUTO,
    backgroundColor: '#ffffff',
    scale: {
        parent: 'phaser-game',
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: CONSTANTS.DEFAULT_WIDTH,
        height: CONSTANTS.DEFAULT_HEIGHT
    },
    scene: [PreloadScene, MainScene],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: CONSTANTS.GRAVITY }
        }
    },
    dom: {
        createContainer: true
    },
    audio: {
        disableWebAudio: true
    }
}

window.addEventListener('load', () => {
    const game = new Phaser.Game(config)
})
