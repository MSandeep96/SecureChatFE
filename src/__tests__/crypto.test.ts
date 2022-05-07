import { Crypto } from '../main/crypto';

describe('Crypto', () => {
  let crypto1: Crypto;
  let crypto2: Crypto;

  beforeEach(() => {
    crypto1 = new Crypto();
    crypto2 = new Crypto();
  });

  it('should create same secret keys', () => {
    crypto1.calculateSecretKey(crypto2.myPublicKey, 'user2');
    crypto2.calculateSecretKey(crypto1.myPublicKey, 'user1');
    expect(crypto1.secretKeyMap.get('user2')?.toString('hex')).toEqual(
      crypto2.secretKeyMap.get('user1')?.toString('hex')
    );
  });

  it('should derive the same key', async () => {
    crypto1.calculateSecretKey(crypto2.myPublicKey, 'user2');
    crypto2.calculateSecretKey(crypto1.myPublicKey, 'user1');
    const dk1 = crypto1.getDerivedKey('user2');
    const dk2 = crypto2.getDerivedKey('user1');
    expect(dk1.toString('hex')).toEqual(dk2.toString('hex'));
  });

  it('should encrypt and decrypt', async () => {
    crypto1.calculateSecretKey(crypto2.myPublicKey, 'user2');
    crypto2.calculateSecretKey(crypto1.myPublicKey, 'user1');
    const message = 'Hello World!';
    const encrypted = await crypto1.encrypt(message, 'user2');
    const decrypted = crypto2.decrypt(encrypted.message, encrypted.iv, 'user1');
    expect(decrypted).toEqual(message);
  });
});
