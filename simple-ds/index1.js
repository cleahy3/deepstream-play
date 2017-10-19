const deepstream = require('deepstream.io-client-js');
const client = deepstream('localhost:6020');
const prompt = require('prompt');

prompt.start();
client.login();

var schema = {
    properties: {
      chatString: {
        description: 'Enter Chat String to talk on server',
        pattern: /^[a-zA-Z\s\-]+$/,
        message: 'Name must be only letters, spaces, or dashes',
        required: true
      },
      name: {
        description: 'Enter Chat Username',
        pattern: /^[a-zA-Z\s\-]+$/,
        message: 'Name must be only letters, spaces, or dashes',
        required: true
      },
    }
  };

let record = client.record.getRecord('incoming');

prompt.get(schema, (err, result) => {
    record.whenReady(() => {
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        client.event.subscribe(result.chatString, (data) => {
            console.log('\033[1A' + data);
        })
        process.stdin.on('data', function (text) {
            if (text.includes('quit')) {
                done();
            }
            client.event.emit(result.chatString, result.name+':'+text);
        });
        client.event.subscribe('error', (err) => {
            console.log(err)
        })
    });
});