const redis = require('redis');
const ioredis = require('ioredis');

let opts = {url: "redis://127.0.0.1:6379"}

const subscriber = redis.createClient(opts);
const s = redis.createClient(opts);

let messageCount = 0;

subscriber.on("subscribe", function(channel, count) {
 
});

subscriber.on("message", function(channel, message) {
  messageCount += 1;
  console.log("Subscriber received message in channel '" + channel + "': " + message);
  console.log(`${messageCount} messages received`);
});

subscriber.subscribe("ipn");

const readstream = () => {
  s.xread ("BLOCK", 0, "STREAMS", "ipn", "$", (err, stream) => {   
    if(err) {
      console.log("error is ", err);
    }

    let messages = stream[0][1];

    messages.forEach(msg => {
      console.log(msg);
    });

    readstream();
  });
}

readstream();