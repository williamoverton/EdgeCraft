import {
  settings,
  SCALE_MODES,
  Application,
  Loader,
  Text,
  Ticker,
  Sprite,
} from "pixi.js";

import World from "./app/World";
import Player from "./app/Player";
import OnlinePlayers from "./app/OnlinePlayers";

settings.SCALE_MODE = SCALE_MODES.NEAREST;

// (window as any).APP_BACKEND_URL = "http://localhost:7676";
(window as any).APP_BACKEND_URL = "https://edgecraft-backend.edgecompute.app";

// constants
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

// create and append app
const app = new Application({
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: 0x111111,
  sharedTicker: true,
  sharedLoader: true,
});

document.body.appendChild(app.view);
const loader = Loader.shared;
const ticker = Ticker.shared;

// preload needed assets
loader.add("grass", "/assets/img/grass.png");
loader.add("dirt", "/assets/img/dirt.png");
loader.add("dirt_air", "/assets/img/dirt_air.png");
loader.add("brick", "/assets/img/brick.png");
loader.add("dark_brick", "/assets/img/dark_brick.png");
loader.add("playerSpriteSheet", "/assets/img/pirate_people.png");
loader.add("shadow", "/assets/img/shadow.png");

// when loader is ready
loader.load(() => {
  // create and append FPS text
  const fps = new Text("FPS: 0", { fill: 0xffe8d6 });
  fps.scale.set(0.7, 0.7);
  fps.zIndex = 9999;
  app.stage.addChild(fps);

  // create shadow effect
  const shadowSprite = Loader.shared.resources.shadow.texture;
  const shadow = new Sprite(shadowSprite);
  const shadowScaleAmount = window.innerWidth / shadow.width;
  shadow.scale.set(shadowScaleAmount, shadowScaleAmount);
  shadow.zIndex = 9998;
  app.stage.addChild(shadow);
  
  // Main game

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

    shadow.position.x = player.entity.sprite.position.x - window.innerWidth / 2;
    shadow.position.y = player.entity.sprite.position.y - window.innerHeight / 2;
  });
});
