import { Application, Texture, Resource, Loader } from "pixi.js";
import { createEntity, Entity } from "./Entity";

export class Tile {
  app: Application;
  x: number;
  y: number;
  cx: number;
  cy: number;
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
    cx: number,
    cy: number,
    type: TileType
  ) {
    this.app = app;
    this.scale = scale;
    this.x = x;
    this.y = y;
    this.cx = cx;
    this.cy = cy;
    this.type = type;

    this.entity = null;

    this.tileSpriteWidth = 16;

    this.tileWidth = this.tileSpriteWidth * this.scale;

    this.makeSprite();
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

  setType(type: TileType) {
    if (type == this.type) {
      return;
    }

    fetch(`${(window as any).APP_BACKEND_URL}`, {
      method: "POST",
      body: JSON.stringify({
        action: "updateTile",
        options: {
          chunkX: this.cx,
          chunkY: this.cy,
          tileX: this.x % 16,
          tileY: this.y % 16,
          type: Object.keys(TileType)[Object.values(TileType).indexOf(type)],
        },
      }),
    });

    this.type = type;

    this.app.stage.removeChild(this.entity.sprite);
    this.makeSprite();

    console.log("Changing Type!");
  }
}

export enum TileType {
  AIR = "dark_brick",
  BRICK = "brick",
  DIRT = "dirt",
}
