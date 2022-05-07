const forge = require('node-forge');

export const getIv = () => {
  return Buffer.from(forge.random.getBytesSync(16));
};
