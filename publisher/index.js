const redis = require('redis');
//const ioredis = require('ioredis');
const prompt = require('prompt')

let opts = {url: "redis://127.0.0.1:6379"}
const pub = redis.createClient(opts);
const s = redis.createClient(opts);

const properties = [
  {
      name: 'topic',
      validator: /^[a-zA-Z\s\-]+$/,
      warning: 'topic must be only letters, spaces, or dashes'
  },
  {
      name: 'message',
      //validator: /^[a-zA-Z\s\-]+$/,
      warning: 'topic must be only letters, spaces, or dashes'
  },

  /** 
  {
      name: 'password',
      hidden: true
  }
  */
];



const getInput = () => {
  try {
    setTimeout(() => {
      console.log("publishing");
      /*
      pub.publish("OFFERACQ", JSON.stringify({
        "event": "OFFERACQ", 
        data: {msisdn: "0008888", posting: true} 
      }) );

      pub.publish("FCA", JSON.stringify({
        "event": "FCA", 
        data: {msisdn: "0008888", posting: true} 
      }));
      */

      s.xadd("FCA", "*" , "data", JSON.stringify({"event": "FCA", data: {msisdn: "1234", posting: true}}), (err, reply) => {
        if(err) {
          console.log(err);
        }

        console.log(reply);
      })

      let ipndata = {
        "payment_token":"","token_expiry_datetime":"",
        "store_name":"MyTelenor App - Store","response_code":"0000",
        "order_id":"WL_05636279cb","order_datetime":"Thu Jan 14 10:25:27 PKT 2021",
        "paid_datetime":"","transaction_status":"PAID","transaction_amount":"2500",
        "store_id":"40409","msisdn":"03415709139","payment_method":"MA",
        "account_number":"6393900092781437","description":"Success","transaction_id":""
      }

      s.xadd("ipn", "*" , "data", JSON.stringify({"event": "ipn", data: ipndata }), (err, reply) => {
        if(err) {
          console.log(err);
        }

        console.log(reply);
      })

      s.xadd("ACQ", "*" , "data", JSON.stringify({"event": "ACQ", data: {msisdn: "1234", posting: true}}), (err, reply) => {
        if(err) {
          console.log(err);
        }

        console.log(reply);
      })
      getInput();
    }, 1000);
    
    
    return 

    prompt.get(properties, function (err, input) {
        if (err) { 
          console.log(err);
          return 1; 
        }

        pub.publish( input.topic, input.message );
        
        s.xadd(input.topic, "*", "data", input.message)
        getInput();
    });

  } catch (error) {
      console.log(error);
      return error
  }
}

prompt.start();
getInput();


  