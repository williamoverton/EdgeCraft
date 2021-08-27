import { Application, Rectangle } from "pixi.js";
import Chunk from "./Chunk";
import { Tile, TileType } from "./Tile";

export default class World {
  app: Application;
  chunks: any;
  scale: number;

  constructor(app: Application, scale: number) {
    this.app = app;
    this.scale = scale;

    this.chunks = [];

    this.buildWorld();
  }

  buildWorld(): void {
    // const dirtTexture = loader.resources.dirt.texture as Texture<Resource>;

    for (let y = 1; y < 4; y += 1) {
      for (let x = -3; x < 6; x += 1) {

        if(this.chunks[y] == undefined){
          this.chunks[y] = {};
        }

        this.chunks[y][x] = new Chunk(this.app, this.scale, x, y);
      }
    }
  }

  doesCollide(bounds: Rectangle): boolean {
    for (let row in this.chunks) {
      for (let col in this.chunks[row]) {
        for (let t of this.chunks[row][col].tiles) {
          if (t.type == TileType.AIR) continue;

          const tb = t.entity.sprite.getBounds();

          if (boxesIntersect(bounds, tb)) {
            return true;
          }
        }
      }
    }

    return false;
  }

  getTileAtScreenPos(x: number, y: number): Tile {
    let tx = Math.floor(x / 16 / this.scale);
    let ty = Math.floor(y / 16 / this.scale);

    let cx = Math.floor(tx / 16);
    let cy = Math.floor(ty / 16);
    
    let chunk = this.getChunk(cx, cy);

    if(!chunk){
      return null;
    }

    return chunk.tiles[(tx % 16) + ((ty % 16) * 16)]
  }

  getChunk(cx, cy): Chunk {
    if(this.chunks.hasOwnProperty(cy) && this.chunks[cy].hasOwnProperty(cx)){
      return this.chunks[cy][cx];
    }

    return null;
  }
}

function boxesIntersect(ab: Rectangle, bb: Rectangle): boolean {
  return (
    ab.x + ab.width > bb.x &&
    ab.x < bb.x + bb.width &&
    ab.y + ab.height > bb.y &&
    ab.y < bb.y + bb.height
  );
}
