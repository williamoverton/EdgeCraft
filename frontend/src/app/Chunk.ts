import { Application } from "pixi.js";
import { Tile, TileType } from "./Tile";

export default class Chunk {
  app: Application;
  tiles: Tile[];
  x: number;
  y: number;
  scale: number;
  active: boolean;

  chunkWidth: number;

  constructor(app: Application, scale: number, x: number, y: number) {
    this.app = app;
    this.scale = scale;
    this.x = x;
    this.y = y;
    this.tiles = [];
    this.active = true;

    this.chunkWidth = 16;

    this.make();

    setTimeout(() => {
      this.update();
    }, Math.random() * 5000);
  }

  async make() {
    let chunkX = this.x * this.chunkWidth;
    let chunkY = this.y * this.chunkWidth;

    let req = await fetch(`${(window as any).APP_BACKEND_URL}`, {
      method: "POST",
      body: JSON.stringify({
        action: "getChunk",
        options: {
          chunkX: this.x,
          chunkY: this.y,
        },
      }),
    });

    let tData = await req.json();

    let i = 0;
    for (let y = 0; y < 16; y++) {
      for (let x = 0; x < 16; x++) {
        let tileType = TileType[tData[i].toUpperCase()];

        this.tiles.push(
          new Tile(
            this.app,
            this.scale,
            chunkX + x,
            chunkY + y,
            this.x,
            this.y,
            tileType
          )
        );

        i++;
      }
    }
  }

  async update() {
    let req = await fetch(`${(window as any).APP_BACKEND_URL}`, {
      method: "POST",
      body: JSON.stringify({
        action: "getChunk",
        options: {
          chunkX: this.x,
          chunkY: this.y,
        },
      }),
    });

    let tData = await req.json();

    if (this.active) {
      let i = 0;
      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 16; x++) {
          let tileType = TileType[tData[i].toUpperCase()];

          this.tiles[i].setType(tileType);

          i++;
        }
      }
    }

    if (this.active) {
      setTimeout(() => this.update(), 2000 + Math.random() * 500);
    }
  }

  destroy() {
    this.active = false;
    for (let t of this.tiles) {
      t.destroy();
    }
  }
}
