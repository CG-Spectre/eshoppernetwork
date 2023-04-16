const webparser = require("../webparser");
const axios = require("axios");
const fs = require("fs");
const puppeteer = require("puppeteer");

exports.target = class{
    currentParser;
    constructor(){

    }
    async query(searchTerm){
        let url = "https://www.target.com/s?searchTerm=";
        for(let i = 0; i < searchTerm.split(" ").length; i++){
            if(i != 0){
                url += "+";
            }
            url += searchTerm.split(" ")[i];
        }
        const browser = await puppeteer.launch({headless:false});
        const page = await browser.newPage();
        page.setViewport({width:1920, height:1080})
        await page.goto(url);
        await page.waitForSelector(".fPNzT img");
        await page.screenshot({path:"testw.png"})
        let res = await page.evaluate(()=>{
            const items = document.querySelector(".jvgxLX").children[0].children;
            let retList = [];
            for(let i = 0; i < items.length; i++){
                try{
                    let item = items[i];
                    let pushDict = {};
                    pushDict.name = item.querySelector(".fajhWk").textContent;
                    pushDict.src = "Target";
                    pushDict.price = "";
                    pushDict.img = "";
                    pushDict.link = "";
                    retList.push(pushDict);
                    retList[retList.length - 1].brand = "";
                }catch(e){}
            }
            return retList;
        });
        await browser.close();
        return res;
    }
}