import SimplexNoise from "simplex-noise";

addEventListener("fetch", async function handleRequest(event) {
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
  let response = new Response(JSON.stringify(makeChunk(postData.options.chunkX, postData.options.chunkY)), {
    status: 200,
    headers
  });
  // Send the response back to the client.
  event.respondWith(response);
});

function makeChunk(cx, cy) {
  const simplex = new SimplexNoise("EdgeCraft");

  let chunkData = [];

  for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      chunkData.push(simplex.noise2D(cx + (x / 16), cy = (y / 16)));
    }
  }

  return chunkData;
}
