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
});
