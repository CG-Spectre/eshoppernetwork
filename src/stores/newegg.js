const webparser = require("../webparser");
const axios = require("axios");
const fs = require("fs");
const puppeteer = require("puppeteer");

exports.newegg = class{
    currentParser;
    constructor(){

    }
    async query(searchTerm, callback){
        let url = "https://www.newegg.com/p/pl?d=";
        for(let i = 0; i < searchTerm.split(" ").length; i++){
            if(i != 0){
                url += "+";
            }
            url += searchTerm.split(" ")[i];
        }
        const browser = await puppeteer.launch({headless:true});
        const page = await browser.newPage();
        page.setViewport({width:1920, height:1080})
        
        
        page.goto(url, {timeout:15000}).then(()=>{
            page.waitForSelector(".checkedimg2", {timeout:15000}).then(async ()=>{
                await page.screenshot({path:"testn.png"});
                let res = await page.evaluate(()=>{
                    const items = document.querySelector(".item-cells-wrap").children;
                    let retList = [];
                    for(let i = 0; i < items.length; i++){
                        try{
                            let item = items[i];
                            let pushDict = {};
                            pushDict.name = item.querySelector(".item-title").textContent;
                            pushDict.src = "Newegg";
                            pushDict.price = "$"+item.querySelector(".price-current strong").textContent + item.querySelector(".price-current sup").textContent;
                            pushDict.img = item.querySelector(".checkedimg").src;
                            pushDict.link = item.querySelector(".item-title").href;
                            let rating = item.querySelector(".rating").getAttribute("aria-label").split("ated")[1];
                            pushDict.rating = Math.round(((rating.split(" out of ")[0])/(rating.split(" out of ")[1]))*100)/100;
                            retList.push(pushDict);
                        }catch(e){}
                    }
                    return retList;
                });
                await browser.close();
                callback(res);
            }).catch(async ()=>{
                await browser.close();
                callback([]);
            });
        }).catch(async ()=>{
            await browser.close();
            callback([]);
        });
        
    }
}