import WebSocket from "ws";

import { onMessage } from "./helpers.js";

let interval, connected;

// How often to send status updates to the server (in ms)
const STATUS_INTERVAL = 5000;

// The location of the server, maybe an IP address or domain
// If testing on the same machine, use 127.0.0.1
const SERVER_ADDRESS = "127.0.0.1:8080";

// Whatever you return from this function will be the data sent
// to the server for status
async function statusData() {
  return {
    somethingA: 1,
    somethingB: 2,
  };
}

// These are the commands that the server might send the client
// You can edit these or add new ones
const COMMANDS = {
  async commandA(body) {
    console.log("A: " + body);
  },
  async commandB(body) {
    console.log("B: " + body);
  },
};

// Whenever you want to send raw data to the server,
// call the function `sendData()` with an array of things that
// you'd like to add to a CSV on the server
sendData(["some string to be in the csv", 1, 2, 3, "and numbers too"]);

const client = new WebSocket(`ws://${SERVER_ADDRESS}/`);

function sendData(data) {
  if (!connected) {
    setTimeout(() => sendData(data), 10);
  } else {
    client.send(JSON.stringify({ c: "SEND_DATA", b: data }));
  }
}

client.on("open", function open() {
  connected = true;
  console.log(`Connected to server: ws://${SERVER_ADDRESS}`);

  interval = setInterval(() => {
    statusData()
      .then((data) => {
        client.send(JSON.stringify({ c: "SEND_STATUS", b: data }));
      })
      .catch((error) => {
        console.error("Error reading status data");
        console.error(error);
      });
  }, STATUS_INTERVAL);
});

client.on("close", function close() {
  connected = false;
  console.log("Disconnected from server");
  clearInterval(interval);
  process.exit();
});

client.on("message", onMessage.bind(null, COMMANDS));
