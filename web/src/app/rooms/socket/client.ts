import { io, Socket } from "socket.io-client";

export class SocketClient {
  #socket: Socket;

  constructor() {
    this.#socket = io(import.meta.env.VITE_SOCKET_URL);
  }

  get socket(): Socket {
    return this.#socket;
  }

  connect(): void {
    if (!this.#socket.connected) {
      this.#socket.connect();
    }
  }

  disconnect(): void {
    this.#socket.disconnect();
  }
}
