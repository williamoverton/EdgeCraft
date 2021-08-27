import * as aws4 from "aws4";

export default class Dynamodb {
  async setChunk(x, y, chunkData) {
    let data = chunkData.map((c) => {
      return { S: c };
    });

    await this.makeRequest("UpdateItem", {
      TableName: "edgecraft-chunks",
      Key: {
        pos: {
          S: `${x}@${y}`,
        },
      },
      ExpressionAttributeValues: {
        ":chunkData": { L: data },
      },
      UpdateExpression: "SET chunkData = :chunkData",
    });
  }

  async updateTile(cx, cy, tx, ty, type) {
    await this.makeRequest("UpdateItem", {
      TableName: "edgecraft-chunks",
      Key: {
        pos: {
          S: `${cx}@${cy}`,
        },
      },
      ExpressionAttributeValues: {
        ":type": { S: type },
      },
      UpdateExpression: `SET chunkData[${tx + ty * 16}] = :type`,
    });
  }

  async getChunk(x, y) {
    let data = (
      await this.makeRequest("GetItem", {
        TableName: "edgecraft-chunks",
        Key: {
          pos: {
            S: `${x}@${y}`,
          },
        },
      })
    ).Item;

    if (!data) {
      return null;
    }

    return data.chunkData.L.map((v) => v.S);
  }

  async updatePlayer(id, x, y, avatar, lastseen) {
    let data = {
      x: {
        N: `${x}`,
      },
      y: {
        N: `${y}`,
      },
      avatar: {
        N: `${avatar}`
      }
    };

    return await this.makeRequest("UpdateItem", {
      TableName: "edgecraft-players",
      Key: {
        player: {
          S: id,
        },
      },
      ExpressionAttributeValues: {
        ":lastseen": { N: `${lastseen}` },
        ":playerData": {
          M: data
        }
      },
      UpdateExpression: "SET lastseen = :lastseen, playerData = :playerData",
    });
  }

  async getPlayers(){
    let players = (await this.makeRequest("Scan", {
      TableName: "edgecraft-players"
    })).Items;

    return players.map(p => {
      return {
        id: p.player.S,
        x: p.playerData.M.x.N,
        y: p.playerData.M.y.N,
        avatar: p.playerData.M.avatar.N,
      }
    })
  }

  // let resp = (await this.makeRequest("GetItem", {
  //   TableName: "ecp-testing",
  //   Key: {
  //     pk: {
  //       S: "test",
  //     },
  //     sk: {
  //       S: "test",
  //     },
  //   },
  // })).Item.visits.N;

  async makeRequest(target: string, query: any): Promise<any> {
    let startTime = new Date().getTime();

    const dict = new Dictionary("config");

    let opts = {
      path: "/",
      service: "dynamodb",
      region: dict.get("region"),
      method: "POST",
      headers: {
        "Content-Type": "application/x-amz-json-1.0",
        "X-Amz-Target": `DynamoDB_20120810.${target}`,
      },
      body: JSON.stringify(query),
    };

    // aws4.sign() will sign and modify these options, ready to pass to http.request
    aws4.sign(opts, {
      accessKeyId: dict.get("accessKeyId"),
      secretAccessKey: dict.get("secretAccessKey"),
    });

    let req = new Request(
      `https://${opts.service}.${opts.region}.amazonaws.com${opts.path}`,
      {
        headers: opts.headers,
        method: opts.method,
        body: opts.body,
      }
    );

    req.setCacheOverride(new CacheOverride("pass"));

    let f = await fetch(req, { backend: "aws_dynamodb" });

    console.log(`DynamoDb Request took: ${new Date().getTime() - startTime}ms`);

    return await f.json();
  }
}
