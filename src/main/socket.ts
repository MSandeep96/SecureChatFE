import { BrowserWindow } from 'electron';
import io, { Socket } from 'socket.io-client';
import { Crypto } from './crypto';

export class SocketClient {
  crypto = new Crypto();

  socket: Socket;

  myUsername: string;

  constructor(username: string) {
    this.myUsername = username;
    this.socket = io('http://localhost:3001', { query: { username } });

    this.socket.on('userlist', (userlist) => {
      const window = BrowserWindow.getAllWindows()[0];
      window.webContents.send('userlist', userlist);
    });

    this.socket.on('establishConnection', (args) => {
      console.log('estC', args);
      const { publicKey, fromUsername } = args;
      this.crypto.calculateSecretKey(publicKey, fromUsername);
      this.socket.emit('respondConnection', {
        fromUsername: this.myUsername,
        toUsername: fromUsername,
        publicKey: this.crypto.myPublicKey,
      });
      const window = BrowserWindow.getAllWindows()[0];
      window.webContents.send('keyrecieved', fromUsername);
    });

    this.socket.on('respondConnection', (args) => {
      console.log('respC', args);
      const { publicKey, fromUsername } = args;
      this.crypto.calculateSecretKey(publicKey, fromUsername);
      const window = BrowserWindow.getAllWindows()[0];
      window.webContents.send('keyrecieved', fromUsername);
    });

    this.socket.on('message', (args) => {
      console.log('message', args);
      const { message, iv, fromUsername } = args;
      const decryptedMessage = this.crypto.decrypt(message, iv, fromUsername);
      const window = BrowserWindow.getAllWindows()[0];
      window.webContents.send('message', {
        message: decryptedMessage,
        username: fromUsername,
      });
    });
  }

  establishConnection = (toUsername: string) => {
    if (this.crypto.secretKeyMap.has(toUsername)) {
      return;
    }
    this.socket.emit('establishConnection', {
      toUsername,
      publicKey: this.crypto.myPublicKey,
      fromUsername: this.myUsername,
    });
  };

  sendMessage = async (message: string, toUsername: string) => {
    const { message: encryptedMessage, iv } = await this.crypto.encrypt(
      message,
      toUsername
    );
    this.socket.emit('message', {
      message: encryptedMessage,
      iv,
      fromUsername: this.myUsername,
      toUsername,
    });
  };
}
