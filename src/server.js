

const amazon = require("./stores/amazon");
const amazonInst = new amazon.amazon();

const newegg = require("./stores/newegg");
const neweggInst = new newegg.newegg();

const bestbuy = require("./stores/bestbuy");
const bestbuyInst = new bestbuy.bestbuy();

const ebay = require("./stores/ebay");
const ebayInst = new ebay.ebay();
const fs = require("fs");
const WebSocket = require("ws"); 
const https = require("https");
const WebSocketServer = WebSocket.WebSocketServer;
const express = require("express");
const app = express();
const port = 25580;
const key = fs.readFileSync("certs/privkey.pem");
const cert = fs.readFileSync("certs/cert.pem");
const server = https.createServer({key, cert}, app);
const requests = [];
const wss = new WebSocketServer({
  //port:25581,
  server
});
server.listen(25581);
wss.on("listening", ()=>{console.log("Websocket listening on port 25581")});
wss.on("connection", (ws)=>{
  ws.on("message", (data)=>{
    const req = JSON.parse(data.toString());
    reqDict[req.request](req.data,ws);
  })
});
const reqDict = {
  query: function(data, socket){
    const query = data.query;
    queryIncrem(query, (res, toDo, done)=>{
      socket.send(JSON.stringify({request:"query", data:res}));
    })
  }
}
app.get("/", (req, res)=>{
  res.sendFile(__dirname+"/views/home.html")
});

app.get("/query", (req, res)=>{
  query(req.query.kq, (e)=>{
    res.send(e);
  });
});

app.get("/img/logo.svg", (req, res)=>{
  res.sendFile(__dirname + "/img/eShopperNet.svg");
});

app.listen(port, ()=>{
  console.log("Started on port "+port);
})

function start(){
  query("iphone", (res)=>{
    console.log(res);
  });
}

function query(query, callback){
  let toDo = 4;
  let done = 0;
  let currentList = [];
  try{
    amazonInst.query(query, res=>{
      currentList = [...currentList, ...res];
      done++;
      if(isDone()){
        callback(isDone());
      }
    });
  }catch(e){}

  try{
    bestbuyInst.query(query, res=>{
      currentList = [...currentList, ...res];
      done++;
      if(isDone()){
        callback(isDone());
      }
    });
  }catch(e){}

  try{
    neweggInst.query(query, res=>{
      currentList = [...currentList, ...res];
      done++;
      if(isDone()){
        callback(isDone());
      }
    });
  }catch(e){}
  
  try{
    ebayInst.query(query, res=>{
      currentList = [...currentList, ...res];
      done++;
      if(isDone()){
        callback(isDone());
      }
    });
  }catch(e){}
  
  function isDone(){
    if(done >= toDo){
      return currentList;
    }else{
      return false;
    }
  }
}

function queryIncrem(query, callback){
  let toDo = 4;
  let done = 0;
  let currentList = [];
  try{
    amazonInst.query(query, res=>{
      currentList = [...currentList, ...res];
      done++;
      callback(currentList, toDo, done);
    });
  }catch(e){}

  try{
    bestbuyInst.query(query, res=>{
      currentList = [...currentList, ...res];
      done++;
      callback(currentList, toDo, done);
    });
  }catch(e){}

  try{
    neweggInst.query(query, res=>{
      currentList = [...currentList, ...res];
      done++;
      callback(currentList, toDo, done);
    });
  }catch(e){}
  
  try{
    ebayInst.query(query, res=>{
      currentList = [...currentList, ...res];
      done++;
      callback(currentList, toDo, done);
    });
  }catch(e){}
}
