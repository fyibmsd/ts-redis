import { createConnection, Socket } from 'net';
import Command from './command';

export default class Client {
    private readonly host: string;

    private readonly port: number;

    private conn: Socket;

    private connected: boolean = false;

    constructor(host: string = '127.0.0.1', port: number = 6379) {
        this.host = host;
        this.port = port;
        this.conn = this.connect();
    }

    private connect() {
        return createConnection(this.port, this.host, () => this.connected = true);
    }

    async ping() {
        return this.call('PING');
    }

    async set(key: string, value: string) {
        return this.call('SET', key, value);
    }

    async get(key: string) {
        return this.call('GET', key);
    }

    async del(...key: string[]) {
        return this.call('DEL', ...key);
    }

    close() {
        this.conn.destroy();
    }

    private async call(cmd: string, ...args: string[]) {
        return new Promise((resolve, reject) => this.conn.write((new Command(cmd, args)).toString(), err => {
            if (err !== undefined) reject(err);

            this.conn.on('data', buf => resolve(Command.parse(buf)));
        }));
    }
}


