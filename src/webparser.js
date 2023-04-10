const cheerio = require("cheerio");

exports.parser = class {
    $;
    constructor(content){
        this.$ = cheerio.load(content);
    }
    getTextFromId(id){
        return this.$("#"+id).text();
    }
    getTextFromClass(className){
        return this.$("."+className).text();
    }
    getText(cont){
        return this.$(cont).text();
    }
}