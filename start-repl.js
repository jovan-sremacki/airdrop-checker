const fs = require("fs");
const path = require("path");
const repl = require("repl");
const dotenv = require("dotenv");

dotenv.config();

function loadServices(folderPath) {
  const services = {};
  const absoluteFolderPath = path.resolve(folderPath);

  fs.readdirSync(absoluteFolderPath).forEach((file) => {
    const filePath = path.join(absoluteFolderPath, file);
    if (fs.statSync(filePath).isFile() && filePath.endsWith(".ts")) {
      const serviceName = path.basename(file, path.extname(file));

      delete require.cache[require.resolve(filePath)];

      services[serviceName] = require(filePath).default || require(filePath);
    }
  });

  return services;
}

let services = loadServices("./backend/services");

const historyFile = path.resolve(__dirname, '.ts_node_repl_history');
const maxHistoryItems = 1000;

const replServer = repl.start("> ");

// Load history
fs.readFile(historyFile, 'utf8', (err, data) => {
  if (err) return;
  replServer.history = data.split('\n').reverse().filter(Boolean);
});

// Save history
replServer.on('exit', () => {
  fs.writeFile(historyFile, replServer.history.reverse().slice(0, maxHistoryItems).join('\n'), (err) => {
    if (err) console.error(err);
    process.exit();
  });
});

replServer.context.services = services;
replServer.context.addrService = new services.AddressService(process.env.API_KEY);

console.log(
  "REPL started. Use `services` to access the loaded services."
);
