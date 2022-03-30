
// TO READ LAND ID FROM METACITY UI
function getRealEstateId(){
    let os_button = document.getElementsByClassName("MuiButton-contained")[0];
    if (os_button){
        let id = os_button.href.split("0x17a0fed3bf90c0a12a7cdad83e3d4b0e06ebab54/")[1]
        return id;
    }
}

// TO KEEP IT CLEAN
function cleanup(){
    let my_price = document.getElementById('my_price');
    if(my_price==null){}else{document.getElementById('my_price').remove();}
}

// TO INJECT PRICE TO OPENSEA
function injectPriceToBox(string){cleanup();
    let inject_here = document.getElementsByClassName("MuiCardActions-root")[0];
    if(inject_here==null){}else{inject_here.insertAdjacentHTML('beforeend',
        '<span id="my_price" style="padding-left:15px; color:purple;">Listed for: <strong>'+string+'</strong> ETH</span>');
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
    function start(){fetchPrice(getRealEstateId());}
    setTimeout(start, 5000);

    // LISTEN METACITY UI CHANGES
    var temporaryEstateId = getRealEstateId;
    let root = document.getElementById("root");
    root.onclick = (event) => {
        cleanup();
        let currentId = getRealEstateId();
        if (temporaryEstateId != currentId){
            temporaryEstateId = currentId;
            fetchPrice(currentId);
        }
    };

};
