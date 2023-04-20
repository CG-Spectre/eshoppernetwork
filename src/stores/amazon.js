const webparser = require("../webparser");
const axios = require("axios");
const fs = require("fs");
const puppeteer = require("puppeteer");

exports.amazon = class{
    currentParser;
    constructor(){

    }
    async query(searchTerm, callback){
        let url = "https://www.amazon.com/s?k=";
        for(let i = 0; i < searchTerm.split(" ").length; i++){
            if(i != 0){
                url += "+";
            }
            url += searchTerm.split(" ")[i];
        }
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        page.goto(url, {timeout:15000}).then(()=>{
            page.waitForSelector(".s-result-list", {timeout:15000}).then(async ()=>{
                let res = await page.evaluate(()=>{
                    const items = document.querySelector(".s-result-list").children;
                    let retList = [];
                    for(let i = 0; i < items.length; i++){
                    let item = items[i];
                    try{
                        let pushDict = {};
                        pushDict.name = item.querySelector('h2').textContent.trim();
                        pushDict.src = "Amazon";
                        pushDict.price = item.querySelector('.a-price').children[0].textContent.trim();
                        pushDict.img = item.querySelector('.s-image').src;
                        pushDict.link = item.querySelector('.a-link-normal').href;
                        let rating = item.querySelector('.a-declarative').parentElement.getAttribute("aria-label").trim().split(" star")[0];
                        let ratingRatio = Math.round(parseFloat(rating.split(" out of ")[0])/parseFloat(rating.split(" out of ")[1])*100)/100;
                        pushDict.rating = ratingRatio;
                        retList.push(pushDict);
                        retList[retList.length - 1].brand = item.querySelector('h5').children[0].textContent.trim();
                    }catch(e){
        
                    }
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
        //await page.screenshot({path:"test.png"})
        
    }
}