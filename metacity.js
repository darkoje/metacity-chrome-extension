
// READ LAND ID FROM METACITY UI
function getRealEstateId(){
    let os_button = document.getElementsByClassName("MuiButton-contained")[0]||"";
    if (((os_button.href)==null)||((os_button.href)===undefined)){} else {
        let id = os_button.href.split("0x17a0fed3bf90c0a12a7cdad83e3d4b0e06ebab54/")[1]||"";
        return id;
    }
}

// TO KEEP OUR TINY UI CLEAN
function cleanup(){
    let my_price = document.getElementById('my_price');
    if(my_price==null){}else{
        document.getElementById('my_price').remove();
    }
}

// WHEN ESTATE IS NOT LISTED
function notListed(){
    cleanup();
    let css = '"border-radius:6px !important;padding-left:15px;color:rgb(80, 69, 147);"';
    let start = `<button id="my_price" class="css-3zukih" style=${css} disabled>`;
    let text = 'Not listed on OS';
    let end = '</button>';
    document.getElementsByClassName("MuiCardActions-root")[0].insertAdjacentHTML('beforeend', start + text + end);
}

// INJECT PRICE TO METACITY INTERFACE
function injectPriceToBox(text){
    cleanup();
    let inject_here = document.getElementsByClassName("MuiCardActions-root")[0];
    if(inject_here==null){}else{
        let css = '"border-radius:6px !important;padding-left:15px; color:white;background:seagreen !important;"';
        let pre = `<button id="my_price" class="css-3zukih" style=${css} disabled> Price:  `;
        let post = ' ETH</button>';
        inject_here.insertAdjacentHTML('beforeend', pre + text + post);
    }
}

// FETCH PRICE FROM OPENSEA
function fetchPrice(id){
    let url = "https://api.opensea.io/api/v1/asset/0x17a0fed3bf90c0a12a7cdad83e3d4b0e06ebab54/" + id + "?include_orders=true";
    let headers = {method: 'GET', headers: {Accept: 'application/json', 'X-API-KEY': ''}};
    fetch(url, headers)
    .then(response => response.json())
    .then(json => {
        let orders = json.orders;
        if ((orders.length)==0){
            notListed();
        } else {
            let sell_orders = [];
            orders.forEach(function (order) {
                // convert WEI to ETH
                let price = order.base_price/10**18;
                let side = order.side;
                if(side==1){sell_orders.push(price);}
            });
            // what if there are only offers on OS?
            if ((sell_orders.length)==0){
                notListed();
            // add only lowest active sell order price
            } else {
                let lowest_listing_price = Math.min.apply(Math, sell_orders);
                injectPriceToBox(lowest_listing_price.toString());
            }
        }
     })
    .catch(err => {
        // what if opensea api is down?
        cleanup();
        let css = '"border-radius:6px !important;padding-left:15px; color:indianred;"';
        let button = `<button id="my_price" class="css-3zukih" style=${css} disabled> OpenSea API is down!</button>`;
        if (((document.getElementsByClassName("MuiCardActions-root")[0])==null)||(document.getElementsByClassName("MuiCardActions-root")[0]===undefined)){}
        else{
            document.getElementsByClassName("MuiCardActions-root")[0].insertAdjacentHTML('beforeend', button);
        }
     });
}


function isItPositiveNumber(str) {
  if (typeof str !== 'string') {
    return false;
  }
  const num = Number(str);
  if (Number.isInteger(num) && num > 0) {
    return true;
  }
  return false;
}

// START EXTENSION
window.onload = (event) => {

    // process first estate if accessed directly via url
    function processFirstEstate(){
        let box = getRealEstateId();
        let isItPositive = isItPositiveNumber(box);
        // process only land that is not reserved
        if(box==null||box===undefined||box==""){}else if(isItPositive){
            fetchPrice(box);
        }
    }
    // 5s pause for Metacity interface
    setTimeout(processFirstEstate, 5000);

    // LISTEN METACITY UI CHANGES
    let root = document.getElementById("root");
    root.onclick = (event) => {
        cleanup();
        let box = getRealEstateId();
        let itIsPositive = isItPositiveNumber(box);
        if(box==null){}else if(itIsPositive){
            console.log("boxx", box);
            fetchPrice(box);
        }
    };

};
