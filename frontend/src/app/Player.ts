import { Application, Loader, Texture, Rectangle } from "pixi.js";
import { Entity, createEntity } from "./Entity";
import World from "./World";
import Keyboard from "pixi.js-keyboard";
import { TileType } from "./Tile";
const Mouse = require("pixi.js-mouse");

export default class Player {
  app: Application;
  x: number;
  y: number;
  scale: number;
  entity: Entity;
  world: World;

  constructor(app: Application, scale: number, world: World) {
    this.app = app;
    this.scale = scale;
    this.world = world;
    this.entity = null;

    this.x = 1000;
    this.y = 100;

    this.make();
    this.tick();
  }

  make() {
    const playerSpriteSheet =
      Loader.shared.resources.playerSpriteSheet.texture.baseTexture;
    const playerSprite = new Texture(
      playerSpriteSheet,
      new Rectangle(
        Math.floor(Math.random() * 5) * 16,
        Math.floor(Math.random() * 2) * 16,
        16,
        16
      )
    );

    this.entity = createEntity(playerSprite, this.world, true, this.x, this.y);
    this.entity.sprite.scale.set(this.scale * 0.9, this.scale * 0.8);
    this.entity.sprite.anchor.x = 0.5;
    this.entity.sprite.zIndex = 9999;
    this.app.stage.addChild(this.entity.sprite);

    console.log("Making Player!");
  }

  tick() {
    Keyboard.update();
    Mouse.update();

    // Keyboard
    if (Keyboard.isKeyDown("ArrowLeft", "KeyA")) this.entity.dx += -1;
    if (Keyboard.isKeyDown("ArrowDown", "KeyD")) this.entity.dx += 1;

    if (this.entity.grounded) {
      if (Keyboard.isKeyDown("ArrowUp", "KeyW")) this.entity.dy = -20;
    }

    if (this.entity.dx > 0) {
      this.entity.sprite.scale.set(-this.scale * 0.9, this.scale * 0.8);
    } else if (this.entity.dx < 0) {
      this.entity.sprite.scale.set(this.scale * 0.9, this.scale * 0.8);
    }

    //Physics
    this.entity.tick();

    // Camera
    this.app.stage.pivot.x = this.entity.sprite.x;
    this.app.stage.pivot.y = this.entity.sprite.y;
    this.app.stage.position.x = this.app.renderer.width / 2;
    this.app.stage.position.y = this.app.renderer.height / 2;

    // Mouse
    let mx = Mouse.getPosX();
    let my = Mouse.getPosY();

    if (Mouse.isButtonDown(Mouse.Button.LEFT)) {
      const tile = this.world.getTileAtScreenPos(
        mx + this.entity.sprite.x - this.app.renderer.width / 2,
        my + this.entity.sprite.y - this.app.renderer.height / 2
      );

      if (tile && tile.entity) {
        tile.setType(TileType.AIR);
      }
    }
  }
}
