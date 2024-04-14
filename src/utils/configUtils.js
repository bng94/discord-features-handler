const checkConfig = async (configFile) => {
  return new Promise((resolve, reject) => {
    const requiredProperties = [
      ["ownerID", "string"],
      ["admins", "string"],
      ["support", "string"],
      ["prefix", "string", "object"],
      ["token", "string"],
      ["clientId", "string"],
      ["modRole", "string"],
      ["adminRole", "string"],
      ["permissions", "object"],
    ];
    for (const [key, type, type2] of requiredProperties) {
      if (!(key in configFile)) {
        reject(
          new TypeError(`Loading Configuration file, Missing property: ${key}`)
        );
        return;
      }

      if (typeof configFile[key] !== type) {
        if (type2) {
          if (typeof configFile[key] !== type2) {
            reject(
              new TypeError(
                `Loading Configuration file, Property ${key} should be a typeof ${type} or ${type2}`
              )
            );
            return;
          }
        } else {
          reject(
            new TypeError(
              `Loading Configuration file, Property ${key} should be a ${type}`
            )
          );
          return;
        }
      }
    }
    resolve();
  });
};

module.exports = { checkConfig };
