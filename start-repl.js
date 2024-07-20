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

const replServer = repl.start("> ");

replServer.context.services = services;
replServer.context.addrService = new services.AddressService(process.env.API_KEY);

console.log(
  "REPL started. Use `services` to access the loaded services."
);
