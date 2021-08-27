/* eslint-disable no-param-reassign */
import { Sprite, Texture, Resource } from "pixi.js";
import World from "./World";

export class Entity {
  sprite: Sprite;
  world: World;
  dynamic: boolean;
  dx: number;
  dy: number;

  grounded: boolean;

  constructor(
    sprite: Sprite,
    world: World,
    dynamic: boolean,
    dx: number,
    dy: number
  ) {
    this.sprite = sprite;
    this.world = world;
    this.dynamic = dynamic;
    this.dx = dx;
    this.dy = dy;

    this.grounded = false;
  }

  tick() {
    if (this.dynamic) {
      this.dy += 0.5;

      this.sprite.y += this.dy;

      if (this.world.doesCollide(this.sprite.getBounds())) {
        this.sprite.y -= this.dy;
        this.dy = 0;

        this.grounded = true;
      }else{
        this.grounded = false;
      }

      this.sprite.x += this.dx;

      if (this.world.doesCollide(this.sprite.getBounds())) {
        this.sprite.x -= this.dx;
        this.dx = 0;
      }

      this.dx *= 0.9;
    }
  }
}

export const createEntity = (
  texture: Texture<Resource>,
  world: World,
  dynamic: boolean,
  x: number,
  y: number
): Entity => {
  const sprite = new Sprite(texture);
  sprite.y = y;
  sprite.x = x;
  return new Entity(sprite, world, dynamic, 0, 0);
};
