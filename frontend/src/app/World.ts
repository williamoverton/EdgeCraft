import { Application, Rectangle } from "pixi.js";
import Chunk from "./Chunk";
import { TileType } from "./Tile";

export default class World {
  app: Application;
  chunks: Chunk[];
  scale: number;

  constructor(app: Application, scale: number) {
    this.app = app;
    this.scale = scale;

    this.chunks = [];

    this.buildWorld();
  }

  buildWorld(): void {
    // const dirtTexture = loader.resources.dirt.texture as Texture<Resource>;

    for (let y = 1; y < 3; y += 1) {
      for (let x = 0; x < 5; x += 1) {
        this.chunks.push(new Chunk(this.app, this.scale, x, y));
      }
    }
  }

  doesCollide(bounds: Rectangle): boolean {
    for(let c of this.chunks){
      for(let t of c.tiles){

        if(t.type == TileType.AIR) continue;

        const tb = t.entity.sprite.getBounds();

        if(boxesIntersect(bounds, tb)){
          return true;
        }
      }
    }

    return false;
  }
}

function boxesIntersect(ab: Rectangle, bb: Rectangle): boolean
{
  return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}