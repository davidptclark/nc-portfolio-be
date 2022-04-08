const fs = require("fs/promises");

exports.fetchEndpointDescriptions = async () => {
  const jsonDescriptions = await fs.readFile("./endpoints.json", "utf-8");
  const parsedDescriptions = JSON.parse(jsonDescriptions);

  return parsedDescriptions;
};
