export function onMessage(COMMANDS, message) {
  try {
    const { c: command, b: body } = JSON.parse(message);
    if (COMMANDS[command]) COMMANDS[command](body);
    else console.error("No command available for: " + command);
  } catch (e) {
    console.error("Error processing message: " + message);
    console.error(e);
  }
}
