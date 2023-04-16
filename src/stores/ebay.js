const webparser = require("../webparser");
const axios = require("axios");
const fs = require("fs");
const puppeteer = require("puppeteer");

exports.ebay = class{
    currentParser;
    constructor(){

    }
    async query(searchTerm){
        let url = "https://www.ebay.com/sch/i.html?_nkw=";
        for(let i = 0; i < searchTerm.split(" ").length; i++){
            if(i != 0){
                url += "+";
            }
            url += searchTerm.split(" ")[i];
        }
        const browser = await puppeteer.launch({headless:true});
        const page = await browser.newPage();
        page.setViewport({width:1920, height:1080})
        await page.goto(url);
        await page.waitForSelector(".s-item__image-wrapper img");
        await page.screenshot({path:"teste.png"})
        let res = await page.evaluate(()=>{
            const items = document.querySelector(".srp-results").children;
            let retList = [];
            for(let i = 0; i < items.length; i++){
                try{
                    let item = items[i];
                    let pushDict = {};
                    pushDict.name = item.querySelector(".s-item__link div").textContent;
                    pushDict.src = "eBay";
                    pushDict.price = item.querySelector(".s-item__price").textContent.replace(" to ", " - ");
                    pushDict.img = item.querySelector(".s-item__image-wrapper img").src;
                    pushDict.link = item.querySelector(".s-item__link").href;
                    try{
                        const rating = item.querySelector(".x-star-rating span").textContent.trim().split(" star")[0];
                        pushDict.rating = Math.round(((rating.split(" out of ")[0])/(rating.split(" out of ")[1]))*100)/100;
                    }catch(e){
                        pushDict.rating = "N/A";
                    }
                    retList.push(pushDict);

                }catch(e){}
            }
            return retList;
        });
        await browser.close();
        return res;
    }
}