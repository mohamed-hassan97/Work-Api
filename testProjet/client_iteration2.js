'use strict'

const {expect} = require('@hapi/code');
const Lab = require('@hapi/lab');
const lab = exports.lab = Lab.script();

const Restify = require('restify-clients');

const client = Restify.createJsonClient({
    url: 'http://localhost:3000'
});

// test data...
let paulWR = {
    applicant: "paul",
    work: "PC update"
};

let pierreWR = {
    applicant: "pierre",
    work: "PC configuration"
};

let henriWR = {
    applicant: "henry",
    work: "Hard disk installation"
};

let jacquesWR = {
    applicant: "jacques",
    work: "PC installation"
};

// to make asynchronous calls
function makePromiseRequest(request, route, arg) {
    var args = [route];
    var i = 1;
    // the number of arguments depends on the type of the request (only for POST and PUT)
    if (arg !== undefined) {
        args[1] = arg
        i++;
    }
    return new Promise(resolve => {
        args[i] = (err, req, res, result) => {
            resolve(result);
        };
        request.apply(client, args);
    });
}

lab.experiment('work request app', () => {

    // delay between each test (if necessary)
    /*
    lab.beforeEach(() => {

        return new Promise( (resolve) => {
            // Wait 50 ms
            setTimeout( () => { resolve(); }, 50);
        });
    });
    */

    lab.test('create a wr from paul', async () => {
        const result = await makePromiseRequest(client.post, '/api/wr', paulWR);
        expect(result).to.not.be.null();
        expect(result.success).to.be.true();
        // for creation (post) we use 'include' because fields are added
        expect(result.data[0]).to.include(paulWR);
        expect(result.data[0].id).to.not.be.undefined();
        expect(result.data[0].state).to.be.equals('created');
        paulWR = result.data[0];
    });


    lab.test('get w/ id', async () => {
        const result = await makePromiseRequest(client.get, '/api/wr/' + paulWR.id);
        expect(result.success).to.be.true();
        expect(result.data).to.be.equals([paulWR]);
    });


    lab.test('update work item', async () => {
        let newWorkItem = 'PC reinstall';
        const result = await makePromiseRequest(client.put, '/api/wr/' + paulWR.id, {"work": newWorkItem});
        expect(result.success).to.be.true();
        paulWR.work = newWorkItem;
        expect(result.data[0]).to.be.equals(paulWR);
    });

    lab.test('update state (closing)', async () => {
        const result = await makePromiseRequest(client.put, '/api/wr/' + paulWR.id, {"state": "closed"});
        expect(result.success).to.be.true();
        paulWR.state = 'closed';
        expect(result.data[0]).to.be.equals(paulWR);
    });

    lab.test('attempt to update a closed wr', async () => {
        const result = await makePromiseRequest(client.put, '/api/wr/' + paulWR.id, {"work": "PC reinstall"});
        expect(result.success).to.be.false();
        expect(result.msg).to.be.equals('wr is already closed');
    });

    lab.test('attempt to delete a closed wr', async () => {
        const result = await makePromiseRequest(client.del, '/api/wr/' + paulWR.id);
        expect(result.success).to.be.false();
        expect(result.msg).to.be.equals('wr is already closed');
    });

    lab.test('create a wr from pierre', async () => {
        const result = await makePromiseRequest(client.post, '/api/wr', pierreWR);
        expect(result.success).to.be.true();
        expect(result.data[0]).to.include(pierreWR);
        pierreWR = result.data[0];
    });

    lab.test('get all WR (w/o id)', async () => {
        const result = await makePromiseRequest(client.get, '/api/wr');
        expect(result.success).to.be.true();
        // tests inclusion in both directions to determine equality
        expect(result.data).to.include([paulWR, pierreWR]);
        expect([paulWR, pierreWR]).to.include(result.data);
    });

    lab.test('delete an opened wr', async () => {
        const result = await makePromiseRequest(client.del, '/api/wr/' + pierreWR.id);
        expect(result.success).to.be.true();
        expect(result.data[0]).to.be.equals(pierreWR);
    });

    lab.test('attempt to update a dummy wr', async () => {
        const result = await makePromiseRequest(client.put, '/api/wr/_______', {});
        expect(result.success).to.be.false();
        expect(result.msg).to.be.equals('wr not found');
    });

    lab.test('attempt to update a wr w/o id', async () => {
        const result = await makePromiseRequest(client.put, '/api/wr', {});
        expect(result.success).to.be.false();
        expect(result.msg).to.be.equals('wr id not provided');
    });

    lab.test('attempt to delete a dummy wr', async () => {
        const result = await makePromiseRequest(client.del, '/api/wr/_______');
        expect(result.success).to.be.false();
        expect(result.msg).to.be.equals('wr not found');
    });


});

