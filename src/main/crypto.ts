import { DiffieHellman } from 'node:crypto';
// import { getIv } from './fortuna';

const hkdf = require('futoin-hkdf');

const cryptoLib = require('crypto');

// Parameter overview
//-------------------
// required output length in bytes
const length = 32;
// can be empty string or false equivalent
const salt = 'strongly-encouraged';
// HMAC hashing algorithm to use
const hash = 'SHA-256';

const prime =
  'c3364c9131f4cb7504d8140efa162ffefc19e29248e2f36a638b696201b3806150aa0229c8ff18d1a85df673dc62d0f9a38181084abbfaa7bb65a8a9e8b6d6bf7409f8fde6d7267a839e42d5e5154638c677d95ebc56a50af1999a1956531b345c27ab979ad26ce33c4a99fe471c3959ed2d6ba368db70619ea365865a1fe00aba288a435450d214f4a72593b8b1cb0e3952148ed941f824b0a7667d92052e3abf2077614aa8d3917c4332ed6fc96007b932567d75799267d8141f8e3efc204bf69b85835e9ba15f8a8a6e5b13b3559686fcecec774f655aa5ca6d73220756e6dddb2fd66c2520653e9b00231b90996f75e054cef48ba186867e37458787558b';

export class Crypto {
  myDiffieHellman: DiffieHellman;

  myPublicKey: string;

  secretKeyMap = new Map<string, Buffer>();

  constructor() {
    this.myDiffieHellman = cryptoLib.createDiffieHellman(prime, 'hex');
    this.myPublicKey = this.myDiffieHellman.generateKeys('hex');
  }

  calculateSecretKey(publicKey: string, fromUsername: string) {
    const secret = this.myDiffieHellman.computeSecret(
      Buffer.from(publicKey, 'hex')
    );
    this.secretKeyMap.set(fromUsername, secret);
  }

  getDerivedKey(username: string) {
    const secret = this.secretKeyMap.get(username);
    return hkdf(secret, length, { salt, hash });
  }

  async encrypt(message: string, toUsername: string) {
    const derivedKey = this.getDerivedKey(toUsername);
    const iv = cryptoLib.randomBytes(16);
    const cipher = cryptoLib.createCipheriv('aes-256-ctr', derivedKey, iv);
    const encrypted = cipher.update(message, 'utf8', 'hex');
    return {
      message: encrypted + cipher.final('hex'),
      iv: iv.toString('hex'),
      ivBuffer: iv,
    };
  }

  decrypt(message: string, iv: string, fromUsername: string) {
    console.log(Array.from(this.secretKeyMap));
    const derivedKey = this.getDerivedKey(fromUsername);
    const decipher = cryptoLib.createDecipheriv(
      'aes-256-ctr',
      derivedKey,
      Buffer.from(iv, 'hex')
    );
    const decrypted = decipher.update(message, 'hex', 'utf8');
    return decrypted + decipher.final('utf8');
  }
}
