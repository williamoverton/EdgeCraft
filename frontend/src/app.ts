import {
  settings,
  SCALE_MODES,
  Application,
  Loader,
  Text,
  Ticker,
} from "pixi.js";

import World from "./app/World";
import Player from "./app/Player";
import OnlinePlayers from "./app/OnlinePlayers";

settings.SCALE_MODE = SCALE_MODES.NEAREST;

(window as any).APP_BACKEND_URL = "http://127.0.0.1:7676";

// constants
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

// create and append app
const app = new Application({
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: 0x5599dd,
  sharedTicker: true,
  sharedLoader: true,
});

document.body.appendChild(app.view);
const loader = Loader.shared;
const ticker = Ticker.shared;

// preload needed assets
loader.add("grass", "/assets/img/grass.png");
loader.add("dirt", "/assets/img/dirt.png");
loader.add("brick", "/assets/img/brick.png");
loader.add("dark_brick", "/assets/img/dark_brick.png");
loader.add("playerSpriteSheet", "/assets/img/pirate_people.png");

// when loader is ready
loader.load(() => {
  // create and append FPS text
  const fps = new Text("FPS: 0", { fill: 0xffe8d6 });
  fps.scale.set(0.7, 0.7);
  fps.zIndex = 9999;
  app.stage.addChild(fps);

  app.stage.sortableChildren = true;

  const scale = 5;

  const world = new World(app, scale);
  const player = new Player(app, scale, world);
  new OnlinePlayers(app, scale, player);

  ticker.add(() => {
    player.tick();

    fps.text = `FPS: ${ticker.FPS.toFixed(2)}`;
    fps.position.x = player.entity.sprite.position.x - window.innerWidth / 2;
    fps.position.y = player.entity.sprite.position.y - window.innerHeight / 2;
  });
});
