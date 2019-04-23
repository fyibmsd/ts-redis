export default class Command {
    private msg: Array<string> = [];

    constructor(cmd: string, args: string[]) {
        this.format(cmd, args);
    }

    private format(cmd: string, args: string[]) {
        this.msg.push(`*${ args.length + 1 }`);
        this.msg.push(`$${ cmd.length }`);
        this.msg.push(cmd);

        args.map(arg => this.msg.push(`$${ arg.length }`) && this.msg.push(arg));
        this.msg.push('\r\n');
    }

    static parse(buffer: Buffer): string | string[] {
        let msg = buffer.toString('utf-8').split('\r\n');

        if (msg[0].match(/(\+\w+)/g) || msg[0].match(/(:\d+)/g))
            return msg[0].substr(1);

        let res: string[] = [];
        let cmd;

        while ((cmd = msg.shift()) !== undefined) {
            if (cmd.match(/(\$\d+)/g)) {
                let raw = msg.shift();

                raw !== undefined && res.push(raw);
            }
        }

        return res.length > 1 ? res : res[0];
    }

    toString(): string {
        return this.msg.join('\r\n');
    }
}
