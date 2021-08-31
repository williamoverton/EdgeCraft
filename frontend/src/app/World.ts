import { Application, Rectangle } from "pixi.js";
import Chunk from "./Chunk";
import { Tile, TileType } from "./Tile";

export default class World {
  app: Application;
  chunks: any;
  scale: number;
  startcx: number;
  startcy: number;
  activeChunkRadius: number;

  constructor(app: Application, scale: number) {
    this.app = app;
    this.scale = scale;

    this.startcx = 1000;
    this.startcy = 1000;

    this.activeChunkRadius = 5;

    this.chunks = [];

    this.buildWorld();
  }

  buildWorld(): void {
    for (
      let y = this.startcy - Math.floor(this.activeChunkRadius / 2);
      y < this.startcy + Math.floor(this.activeChunkRadius / 2);
      y += 1
    ) {
      for (
        let x = this.startcx - Math.floor(this.activeChunkRadius / 2);
        x < this.startcx + Math.floor(this.activeChunkRadius / 2);
        x += 1
      ) {
        if (this.chunks[y] == undefined) {
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

    if (!chunk) {
      return null;
    }

    return chunk.tiles[(tx % 16) + (ty % 16) * 16];
  }

  getChunk(cx, cy): Chunk {
    if (this.chunks.hasOwnProperty(cy) && this.chunks[cy].hasOwnProperty(cx)) {
      return this.chunks[cy][cx];
    }

    return null;
  }

  getSpawnLocation(): any {
    return {
      x: this.startcx * 16 * 16 * this.scale,
      y: this.startcy * 16 * 16 * this.scale,
    };
  }

  updatePlayerChunkRadius(px: number, py: number) {
    const cx = Math.round(px / 16 / 16 / this.scale);
    const cy = Math.round(py / 16 / 16 / this.scale);

    // Make new chunks as needed
    for (
      let y = cy - Math.floor(this.activeChunkRadius / 2);
      y < cy + Math.floor(this.activeChunkRadius / 2);
      y += 1
    ) {
      for (
        let x = cx - Math.floor(this.activeChunkRadius / 2);
        x < cx + Math.floor(this.activeChunkRadius / 2);
        x += 1
      ) {
        if (this.chunks[y] == undefined) {
          this.chunks[y] = {};
        }

        if(this.chunks[y][x]) continue;

        this.chunks[y][x] = new Chunk(this.app, this.scale, x, y);
      }
    }

    // Get rid of chunks no longer in active radius
    for(let y of Object.keys(this.chunks)){
      for(let x of Object.keys(this.chunks[y])){
        
        if(!this.chunks[y][x] || !this.chunks[y][x].active) continue;

        if(parseInt(y) < cy - this.activeChunkRadius / 2 || parseInt(y) > cy + this.activeChunkRadius / 2){
          console.log(this.chunks[y][x]);
          this.chunks[y][x].destroy();
          delete this.chunks[y][x];
          continue;
        }

        if(parseInt(x) < cx - this.activeChunkRadius / 2 || parseInt(x) > cx + this.activeChunkRadius / 2){
          this.chunks[y][x].destroy();
          delete this.chunks[y][x];
          continue;
        }
      }
    }
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
