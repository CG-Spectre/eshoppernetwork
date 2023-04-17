

const amazon = require("./stores/amazon");
const amazonInst = new amazon.amazon();

const newegg = require("./stores/newegg");
const neweggInst = new newegg.newegg();

const bestbuy = require("./stores/bestbuy");
const bestbuyInst = new bestbuy.bestbuy();

const ebay = require("./stores/ebay");
const ebayInst = new ebay.ebay();

const express = require("express");
const app = express();
const port = 80;

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
      return currentList;
    }else{
      return false;
    }
  }
}