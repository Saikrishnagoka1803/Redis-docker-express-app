import express from "express";
import { createClient } from "redis";

const app = express();
const redisClient = createClient({
  url: "redis://my-redis-server:6379",
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

async function startApp() {
  await redisClient.connect();

  console.log("Redis connected:", await redisClient.ping());

  app.listen(3000, () => {
    console.log("Express running on http://localhost:3000");
  });
}

startApp().catch((err) => {
  console.error("Failed to start application:", err);
  process.exitCode = 1;
});

app.get("/", async (req, res) => {
  try {
    const count = await redisClient.incr("visitors");
    res.send(`visitors count: ${count}`);
  } catch (err) {
    console.error("Redis Error:", err);
    res.status(500).send("Unable to update visitor count");
  }
});

// app.get("/", (req, res) => {
//   redisClient.get("visitors", (err, visitors) => {
//     var count = parseInt(visitors) || 0;
//     count++;
//     redisClient.set("visitors", count);
//     res.send(`Visitor count: ${count}`);
//   });
// });
