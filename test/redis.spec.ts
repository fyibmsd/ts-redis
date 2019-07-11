import Client from '../src/client';

import { expect } from 'chai';

describe('test redis client', () => {
    let client: Client;

    before(() => client = new Client());

    after(() => client.close());

    it('should connect to server', async () => {
        let ping = await client.ping();

        expect(ping).equal('PONG');
    });

    it('should set and get value', async () => {
        let key = 'foo', value = 'bar';

        let set = await client.set(key, value);
        expect(set).equal('OK');

        let get = await client.get(key);
        expect(get).equal(value);

        let remove = await client.del(key);
        expect(remove).equal('1');
    });

    it('should execute command', async () => {
        let key = 'bitmap';
        let map = [1, 2, 4, 9, 10, 13, 15];

        for (let item of map)
            await client.execute('setbit', key, item.toString(), '1');

        let resp = await client.execute('get', key);

        expect(resp).equal('he');

        await client.execute('del', key);
    });
});
