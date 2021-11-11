export default class MousePossitionText extends Phaser.GameObjects.Text {
  constructor(scene) {
    super(scene, 10, 70, '', { color: 'black', fontSize: '28px' })
    scene.add.existing(this)
    this.setOrigin(0)
  }

  public update() {
    this.setText(`${Math.floor(this.scene.input.mousePointer.x)} ${Math.floor(this.scene.input.mousePointer.y)}`)
  }
}
