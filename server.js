import { WebSocketServer } from "ws";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { onMessage } from "./helpers.js";

// Location of the data CSV file
const DATA_FILE = "data-file.csv";

const COMMANDS = {
  /**
   * Whenever the client sends a status update, this will be executed
   * The status param contains whatever data is sent in the status update
   */
  async SEND_STATUS(status) {
    const { somethingA, somethingB } = status;
    console.log("somethingA: " + somethingA);
    console.log("somethingB: " + somethingB);
  },

  /**
   *  The data sent from the client. This shows up a lot more often than
   *  the status update.
   */
  async SEND_DATA(data) {
    // Write the data to the CSV file
    await fs.appendFile(
      path.resolve(currentDirectory, DATA_FILE),
      '\n' + data.join(",")
    );
  },
};

const PORT = 8080;

const ws = new WebSocketServer({ port: PORT });

const currentDirectory = fileURLToPath(new URL(".", import.meta.url));

console.log("Listening at http://localhost:" + PORT);

ws.on("connection", function connection(ws) {
  console.log("Client connected");
  ws.on("message", onMessage.bind(null, COMMANDS));
});
