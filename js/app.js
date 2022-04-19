'use strict';

const numImageDisplay = 4;
const maxClicksAllowed = 5;
const numImages = 15;

let productContainer = document.querySelector('section#img-container');
createImageElements(productContainer);
let sectionElem = document.createElement('section');
let resultBtn = document.createElement('button');
let imgElems = productContainer.children;
let articleElem = document.querySelector('article');

let clicks = 0;
let images = [];
let products = [];

function Product(name, src, views) {
    this.name = name;
    this.src = src;
    this.views = 0;
    this.clicks = 0;
    Product.productsArray.push(this);
}

Product.productsArray = [];
createProductArray();

function randomNumber() {
    return Math.floor(Math.random() * Product.productsArray.length);
}

function renderProducts() {
    products = [];
    let productNames = [];

    for (let i = 0; i < imgElems.length; i++) {
        let random = randomNumber();
        while (productNames.includes(Product.productsArray[random].name)) {
            random = randomNumber();
        }
        productNames.push(Product.productsArray[random].name);
        products.push(Product.productsArray[random]);
    }

    console.log(products);

    for (let i = 0; i < imgElems.length; i++) {
        images[i] = imgElems.item(i);
        images[i].src = products[i].src;
        images[i].alt = products[i].name;
        Product.productsArray.forEach((elm,idx) => { if (elm.name === products[i].name) {Product.productsArray[idx].views++;} });
    }

}

function handleProductClick(event) {
    sectionElem.className = 'clicks-allowed';
    resultBtn.className = 'clicks-allowed';
    clicks++;
    Product.productsArray.forEach((elm,i) => {if(event.target.alt===elm.name){Product.productsArray[i].clicks++;}});
    if (clicks === maxClicksAllowed) {
        resultBtn.id = 'result-btn';
        resultBtn.textContent = 'View Results';
        resultBtn.onclick = renderResults;

        articleElem.appendChild(sectionElem);
        sectionElem.appendChild(resultBtn);

        productContainer.removeEventListener('click', handleProductClick);
        productContainer.className = 'no-voting';

    } else {
        renderProducts();
    }
    console.log(clicks);
}

function renderResults() {
    console.log('renderResults');
    let ulElem = document.createElement('ul');
    let sectionElem = document.createElement('section');

    Product.productsArray.forEach(productObj => { let liElem = document.createElement('li'); liElem.textContent = `${productObj.name} had ${productObj.clicks} votes, and was seen ${productObj.views} times.`; ulElem.appendChild(liElem); });

    sectionElem.appendChild(ulElem);
    sectionElem.className = 'results';
    productContainer.parentElement.appendChild(sectionElem);
}

function createImageElements(parentElem) {
    for (let i = 0; i < numImageDisplay; i++) {
        let imgElem = document.createElement('img');
        imgElem.className = 'img-content';
        parentElem.appendChild(imgElem);
    }
    parentElem.addEventListener('click', handleProductClick);
    return parentElem;
}

function createProductArray() {
    for (let i = 0; i < numImages; i++) {
        new Product(`product${i + 1}`, `./img/products/${i + 1}.jpg`);
    }
    console.log(Product.productsArray);
}

renderProducts();
