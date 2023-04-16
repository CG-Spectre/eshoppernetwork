/*const amazon = require("./stores/amazon");
const amazonInst = new amazon.amazon();
const papi = require("amazon-product-api");
var client = papi.createClient({
    awsId:"3582-0430-2859",
    awsSecret:"l+s5BQpIWDDsBgc/HVmpznyIuul4xkXVF6L5ahrQ",
    awsTag:"AKIAVGZVD4YFWUUCXILF"
});
setTimeout(()=>{
    client.itemSearch({
        director: 'Quentin Tarantino',
        actor: 'Samuel L. Jackson',
        searchIndex: 'DVD',
        audienceRating: 'R',
        responseGroup: 'ItemAttributes,Offers,Images'
      }).then(function(results){
        console.log(results);
      }).catch(function(err){
        console.log(err);
      });
}, 2000);
async function start(){
    let amznRes = await amazonInst.query("nike shoes");
    console.log(amznRes);
}
//start();
//console.log(require("cheerio").load("<div><p id='hi'>asdd</p><p>asd</p></div>")("div").children()[0].attributes);*/

const amazon = require("./stores/amazon");
const amazonInst = new amazon.amazon();

const newegg = require("./stores/newegg");
const neweggInst = new newegg.newegg();

const bestbuy = require("./stores/bestbuy");
const bestbuyInst = new bestbuy.bestbuy();

const ebay = require("./stores/ebay");
const ebayInst = new ebay.ebay();

function start(){
  query("iphone", (res)=>{
    console.log(res);
  });
}

function query(query, callback){
  let toDo = 4;
  let done = 0;
  let currentList = [];
  amazonInst.query(query).then(res=>{
    currentList = [...currentList, ...res];
    done++;
    if(isDone()){
      callback(isDone());
    }
  });
  bestbuyInst.query(query).then(res=>{
    currentList = [...currentList, ...res];
    done++;
    if(isDone()){
      callback(isDone());
    }
  });
  neweggInst.query(query).then(res=>{
    currentList = [...currentList, ...res];
    done++;
    if(isDone()){
      callback(isDone());
    }
  });
  ebayInst.query(query).then(res=>{
    currentList = [...currentList, ...res];
    done++;
    if(isDone()){
      callback(isDone());
    }
  });
  function isDone(){
    if(done >= toDo){
      console.log(currentList.length + " results.");
      return currentList;
    }else{
      return false;
    }
  }
}

start();