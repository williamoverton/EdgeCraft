import SimplexNoise from "simplex-noise";
import DynamoDB from "./dynamodb";

addEventListener("fetch", async function(event) {
  let req = event.request;

  if (req.method != "POST") {
    event.respondWith(
      new Response(
        JSON.stringify({
          error: "Only POST requests are accepted!",
        }),
        {
          status: 400,
        }
      )
    );

    return;
  }

  let postData = {};

  try {
    postData = await req.json();
  } catch (e) {
    console.log(e);

    event.respondWith(
      new Response(
        JSON.stringify({
          error: "Post body must be JSON!",
        }),
        {
          status: 400,
        }
      )
    );

    return;
  }

  const headers = new Headers();
  headers.set("Access-Control-Allow-Origin", "*")

  // Catch all other requests and return a 404.
  let response = new Response(JSON.stringify(await handleRequest(postData)), {
    status: 200,
    headers
  });
  // Send the response back to the client.
  event.respondWith(response);
});

async function handleRequest(postData){
  if(postData.action == "getChunk"){
    return await getChunk(postData.options.chunkX, postData.options.chunkY)
  }else if(postData.action == "updateTile"){
    return await updateTile(postData.options.chunkX, postData.options.chunkY, postData.options.tileX, postData.options.tileY, postData.options.type);
  }else {
    return {
      message: "Invalid action!"
    }
  }
}

async function getChunk(cx, cy) {
  const dynamodb = new DynamoDB();

  let foundChunk = await dynamodb.getChunk(cx, cy);
  if(foundChunk) {
    return foundChunk;
  }

  let chunkData = makeChunk(cx, cy);

  await dynamodb.setChunk(cx, cy, chunkData);

  return chunkData;
}

function makeChunk(cx, cy) {
  const simplex = new SimplexNoise("EdgeCraft");

  let chunkData: string[] = [];

  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      let nx = (cx + (x / 16.0)) * 2.0;
      let ny = (cy + (y / 16.0)) * 2.0;
      chunkData.push(getTileTypeFromValue(simplex.noise2D(nx, ny)));
    }
  }

  return chunkData;
}

function getTileTypeFromValue(value: number){
  if(value > 0.1){
    return "AIR";
  }else {
    return "BRICK"
  }
}

async function updateTile(cx, cy, tx, ty, type){
  const dynamodb = new DynamoDB();

  console.log(`Updating tile at {${cx},${cy}}-{${tx},${ty}} to ${type}`);

  await dynamodb.updateTile(cx, cy, tx, ty, type);

  return {updated: true}
}