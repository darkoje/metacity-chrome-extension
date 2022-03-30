
// READ LAND ID FROM METACITY UI
function getRealEstateId(){
    let os_button = document.getElementsByClassName("MuiButton-contained")[0];
    if (os_button){
        let id = os_button.href.split("0x17a0fed3bf90c0a12a7cdad83e3d4b0e06ebab54/")[1]
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


// WHEN NOT LISTED
function notListed(){
    cleanup();
    document.getElementsByClassName("MuiCardActions-root")[0].insertAdjacentHTML('beforeend', '<button id="my_price" class="css-3zukih" style="border-radius:6px !important;padding-left:15px; color:rgb(80, 69, 147);" disabled>Not listed on OS</button>');
}


// INJECT PRICE TO METACITY INTERFACE
function injectPriceToBox(string){
    cleanup();
    let inject_here = document.getElementsByClassName("MuiCardActions-root")[0];
    if(inject_here==null){}else{inject_here.insertAdjacentHTML('beforeend',
        '<button id="my_price" class="css-3zukih" style="border-radius:6px !important;padding-left:15px; color:white;background:seagreen !important;" disabled>Listed for: <strong>'+string+'</strong> ETH</button>');
    }
}


// FETCH PRICE FROM OPENSEA
function fetchPrice(id){
    let url = "https://api.opensea.io/api/v1/asset/0x17a0fed3bf90c0a12a7cdad83e3d4b0e06ebab54/" + id + "?include_orders=true";
    let headers = {method: 'GET', headers: {Accept: 'application/json', 'X-API-KEY': ''}};
    fetch(url, headers)
    .then(response => response.json())
    .then(json => {
        let orders = json['orders'];
        if ((orders.length)==0){
            notListed();
        } else {
            let sell_orders = []
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
        document.getElementsByClassName("MuiCardActions-root")[0].insertAdjacentHTML('beforeend', '<button id="my_price" class="css-3zukih" style="border-radius:6px !important;padding-left:15px; color:rgb(80, 69, 147);" disabled>OpenSea API problem</button>');
     });
}


// START EXTENSION
window.onload = (event) => {

    // process first estate if accessed directly via url
    function processFirstEstate(){
        let box = getRealEstateId();
        if(box==null){}else{
            fetchPrice(getRealEstateId());
        }
    }
    // 5s timeout for Metacity interface to load
    setTimeout(processFirstEstate, 5000);

    // LISTEN METACITY UI CHANGES
    var temporaryEstateId = getRealEstateId;
    let root = document.getElementById("root");
    root.onclick = (event) => {
        cleanup();
        let box = getRealEstateId();
        // only fire if estate property box available
        if(box==null){}else{fetchPrice(getRealEstateId());}
    };

};
