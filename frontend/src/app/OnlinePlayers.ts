import { Application, Sprite, Rectangle, Loader, Texture } from "pixi.js";
import Player from "./Player";

export default class OnlinePlayers {
  app: Application;
  scale: number;
  player: Player;
  sprites: Sprite[];

  constructor(app: Application, scale: number, player: Player) {
    this.app = app;
    this.scale = scale;
    this.player = player;

    this.sprites = [];

    this.getPlayers();
  }

  async getPlayers() {
    let skipId = this.player.id;

    // Get players
    let players = (
      await (
        await fetch(`${(window as any).APP_BACKEND_URL}`, {
          method: "POST",
          body: JSON.stringify({
            action: "getPlayers",
            options: {},
          }),
        })
      ).json()
    ).filter((p) => {
      return p.id != skipId;
    });

    //Cleanup
    this.sprites.map((sprite) => {
      this.app.stage.removeChild(sprite);
    });

    this.sprites = [];

    // Draw players
    players.map((player) => {
      const playerSpriteSheet =
        Loader.shared.resources.playerSpriteSheet.texture.baseTexture;
      const playerSprite = new Texture(
        playerSpriteSheet,
        new Rectangle(
          (player.avatar % 5) * 16,
          (player.avatar % 2) * 16,
          16,
          16
        )
      );

      const sprite = new Sprite(playerSprite);
      sprite.y = player.y;
      sprite.x = player.x;
      sprite.anchor.x = 0.5;
      sprite.scale.set(this.scale * 0.9, this.scale * 0.8);

      this.sprites.push(sprite);

      this.app.stage.addChild(sprite);
    });

    setTimeout(() => this.getPlayers(), 50);
  }
}
