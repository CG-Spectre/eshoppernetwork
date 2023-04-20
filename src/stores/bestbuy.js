const webparser = require("../webparser");
const axios = require("axios");
const fs = require("fs");
const puppeteer = require("puppeteer");

exports.bestbuy = class{
    currentParser;
    constructor(){

    }
    async query(searchTerm, callback){
        let url = "https://www.bestbuy.com/site/searchpage.jsp?st=";
        for(let i = 0; i < searchTerm.split(" ").length; i++){
            if(i != 0){
                url += "+";
            }
            url += searchTerm.split(" ")[i];
        }
        const browser = await puppeteer.launch({headless:true});
        
        const page = await browser.newPage();
        page.setViewport({width:1920, height:1080})
        await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36');
        //page.setCacheEnabled(false);
        await page.screenshot({path:"testb.png"})
        /*
        page.goto(url, {timeout:15000}).then(()=>{

        }).catch(()=>{
            
        });
        page.goto(url, {timeout:15000}).then(()=>{
            page.waitForSelector(".sku-item-list", {timeout:15000}).then(()=>{

            }).catch(()=>{
                return [];
            });
        }).catch(()=>{
            return [];
        });
        */
        page.goto(url).then(()=>{
            page.waitForSelector(".sku-item-list", {timeout:15000}).then(async ()=>{
                let res = await page.evaluate(()=>{
                    const items = document.querySelector(".sku-item-list").children;
                    let retList = [];
                    for(let i = 0; i < items.length; i++){
                        try{
                            let item = items[i];
                            let pushDict = {};
                            pushDict.name = item.querySelector('h4').children[0].textContent.trim();
                            pushDict.src = "Best Buy";
                            let subunits = false;
                            try{
                                subunits = item.querySelector(".priceView-subscription-units").textContent.trim();
                            }catch(e){}
                            pushDict.price = item.querySelector('.priceView-customer-price').children[0].textContent.trim() + (subunits ? subunits : '');
                            pushDict.img = item.querySelector('.product-image').src;
                            pushDict.link = item.querySelector('h4').children[0].href;
                            let rating = item.querySelector(".c-ratings-reviews").children[0].textContent.trim().split("ating ")[1].split(" stars with")[0];
                            pushDict.rating = Math.round((parseFloat(rating.split(" out of ")[0]))/(parseFloat(rating.split(" out of ")[1]))*100)/100;
                            retList.push(pushDict);
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
        
    }
}