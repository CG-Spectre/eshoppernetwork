const amazon = require("./stores/amazon");
const amazonInst = new amazon.amazon();
async function start(){
    let amznRes = await amazonInst.query("nike shoes");
    console.log(amznRes);
}
start();
//console.log(require("cheerio").load("<div><p id='hi'>asdd</p><p>asd</p></div>")("div").children()[0].attributes)