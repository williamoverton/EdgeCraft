import { Application, Texture, Resource, Loader } from "pixi.js";
import { createEntity, Entity } from "./Entity";

export class Tile {
  app: Application;
  x: number;
  y: number;
  type: TileType;

  tileSpriteWidth: number;
  scale: number;
  tileWidth: number;

  entity: Entity;

  constructor(
    app: Application,
    scale: number,
    x: number,
    y: number,
    type: TileType
  ) {
    this.app = app;
    this.scale = scale;
    this.x = x;
    this.y = y;
    this.type = type;

    this.entity = null;

    this.tileSpriteWidth = 16;

    this.tileWidth = this.tileSpriteWidth * this.scale;

    if(this.type != TileType.AIR){
      this.makeSprite();
    }
  }

  private makeSprite() {
    const texture = Loader.shared.resources[this.type.valueOf()]
      .texture as Texture<Resource>;

      this.entity = createEntity(
      texture,
      null,
      false,
      this.x * this.tileWidth,
      this.y * this.tileWidth
    );
    this.entity.sprite.scale.set(this.scale, this.scale);
    this.entity.sprite.zIndex = 0;
    this.app.stage.addChild(this.entity.sprite);
  }
}

export enum TileType {
  AIR = "air",
  GRASS = "grass",
  DIRT = "dirt",
}
