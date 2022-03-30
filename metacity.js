
// TO READ LAND ID FROM METACITY UI
function getRealEstateId(){
    let os_button = document.getElementsByClassName("MuiButton-contained")[0];
    if (os_button){
        let id = os_button.href.split("0x17a0fed3bf90c0a12a7cdad83e3d4b0e06ebab54/")[1]
        return id;
    }
}

// NOT LISTED TO UI
function notListed(){
    document.getElementsByClassName("MuiCardActions-root")[0].insertAdjacentHTML('beforeend', '<button id="my_price" class="css-3zukih" style="border-radius:6px !important;padding-left:15px; color:rgb(80, 69, 147);" disabled>Not listed on OS</button>');
}

// TO KEEP IT CLEAN
function cleanup(){
    let my_price = document.getElementById('my_price');
    if(my_price==null){}else{
        document.getElementById('my_price').remove();
    }
}

// TO INJECT PRICE TO OPENSEA
function injectPriceToBox(string){cleanup();
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
        orders.forEach(function (order) {
            let price = order.base_price;
            price = price/10**18;
            injectPriceToBox(price.toString());
        });
     })
    .catch(err => console.log(err));
}

window.onload = (event) => {

    // PROCESS FIRST LAND IF DIRECTLY OPENED VIA URL
    function start(){
        // check for box
        let box = getRealEstateId();
        if(box==null){}else{
            notListed();
            fetchPrice(getRealEstateId());
        }
    }
    setTimeout(start, 5000);

    // LISTEN METACITY UI CHANGES
    var temporaryEstateId = getRealEstateId;
    let root = document.getElementById("root");
    root.onclick = (event) => {
        cleanup();
        let currentId = getRealEstateId();
        let box = getRealEstateId();

        if(box==null){}else{
            if (temporaryEstateId != currentId){
                temporaryEstateId = currentId;
                notListed();
                fetchPrice(getRealEstateId());
            } else {
                //console.log("the same box reloaded.");
                notListed();
                fetchPrice(getRealEstateId());
            }
        }

    };

};
