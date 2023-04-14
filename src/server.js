/*const amazon = require("./stores/amazon");
const amazonInst = new amazon.amazon();
const papi = require("amazon-product-api");
var client = papi.createClient({
    awsId:"3582-0430-2859",
    awsSecret:"l+s5BQpIWDDsBgc/HVmpznyIuul4xkXVF6L5ahrQ",
    awsTag:"AKIAVGZVD4YFWUUCXILF"
});
setTimeout(()=>{
    client.itemSearch({
        director: 'Quentin Tarantino',
        actor: 'Samuel L. Jackson',
        searchIndex: 'DVD',
        audienceRating: 'R',
        responseGroup: 'ItemAttributes,Offers,Images'
      }).then(function(results){
        console.log(results);
      }).catch(function(err){
        console.log(err);
      });
}, 2000);
async function start(){
    let amznRes = await amazonInst.query("nike shoes");
    console.log(amznRes);
}
//start();
//console.log(require("cheerio").load("<div><p id='hi'>asdd</p><p>asd</p></div>")("div").children()[0].attributes);*/

const puppeteer = require('puppeteer');

async function searchAmazon(searchTerm) {
  // Launch a new headless browser instance
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to Amazon.com
  await page.goto('https://www.amazon.com/');

  // Wait for the search box to be fully loaded
  await page.waitForSelector('#twotabsearchtextbox');

  // Enter the search term in the search box and submit the search form
  await page.type('#twotabsearchtextbox', searchTerm);
  await page.click('input[type="submit"]');

  // Wait for the search results page to load
  await page.waitForSelector('.s-result-list');

  // Wait a little longer for the page to fully load
  await page.waitForTimeout(1000);

  // Extract a list of product names and prices from the search results
  const products = await page.evaluate(() => {
    const results = [];
    const items = document.querySelectorAll('.s-result-item');
    items.forEach((item) => {
      const name = item.querySelector('h2 a').innerText;
      const price = item.querySelector('.a-price .a-offscreen').innerText;
      results.push({ name, price });
    });
    return results;
  });

  // Log the list of products to the console
  console.log(products);

  // Close the browser instance
  await browser.close();
}

// Usage: Call the searchAmazon() function with a search term
searchAmazon('iphone');