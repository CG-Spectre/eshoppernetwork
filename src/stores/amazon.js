const webparser = require("../webparser");
const axios = require("axios");
const fs = require("fs");

exports.amazon = class{
    currentParser;
    constructor(){

    }
    async query(searchTerm){
        let url = "https://www.amazon.com/s?k=";
        for(let i = 0; i < searchTerm.split(" ").length; i++){
            if(i != 0){
                url += "+";
            }
            url += searchTerm.split(" ")[i];
        }
        try {
            const { data } = await axios.get(
                url
            );
            fs.writeFile("tes.txt", data, (err)=>{});
            this.currentParser = new webparser.parser(data);
            let res = this.currentParser.$("div.s-main-slot.s-result-list.s-search-results.sg-row").children(".s-result-item");
            let resArr = [];
            for(let i = 2; i < res.length - 4; i++){
                let x = res[i];
                try{
                    let price = (x.children[0].children[0].children[0].children[0].children[1].children[3].children[0].children[0].children[0].children[0].children[0].data);
                    if(!price){
                        price = (x.children[0].children[0].children[0].children[0].children[1].children[3].children[1].children[0].children[0].children[0].children[0].data);
                    }
                    let brand = (x.children[0].children[0].children[0].children[0].children[1].children[1].children[0].children[0].children[0].children[0].data);
                    let name = (x.children[0].children[0].children[0].children[0].children[1].children[1].children[1].children[0].children[0].children[0].data);
                    let imgsrc = (x.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].attributes[1].value);
                    let reviews = (x.children[0].children[0].children[0].children[0].children[1].children[2].children[0].children[0].children[0].children[0].data);
                    let url = "https://amazon.com"+(x.children[0].children[0].children[0].children[0].children[0].children[0].children[0].children[0].attributes[1].value);
                    let brandname = brand + " " + name;
                    resArr.push({brandname, name, brand, price, reviews, imgsrc, url})
                }catch(e){
                    console.log(e);
                }
                
            }
            return resArr
        } catch (error) {
            throw error;
        }
    }
}