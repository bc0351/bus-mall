'use strict';

const numImageDisplay = 3;
const maxClicksAllowed = 2;
const numImages = 15;

let productContainer = document.querySelector('section#img-container');
createImageElements(productContainer);
let sectionElem = document.createElement('section');
let resultsSectionElem = document.querySelector('section#results');
let resultBtn = document.querySelector('button');
let imgElems = productContainer.children;
let articleElem = document.querySelector('article');

let clicks = 0;
let images = [];
let products = [];
let prevProducts = [];

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

function rgbaRandomColorArray(numColors, bgOpacity, borderOpacity) {
    let rgbArr = [];
    for (let i = 0; i < numColors; i++) {
        if (i===0) {
            rgbArr.push([Math.floor(Math.random() * 256),Math.floor(Math.random() * 256),Math.floor(Math.random() * 256)]);
        }
        let rgbTemp = [];
        let color = Math.floor(Math.random() * 256);
        for (let j = 0; j < rgbArr.length; j++) {
            color = Math.floor(Math.random() * 256);
            while (rgbArr[i][j]===color) {
                color = Math.floor(Math.random() * 256);
                console.log(color);
            }
            rgbTemp.push(color);
        }
        rgbArr.push(rgbTemp);
    }
    return [rgbArr.map(e => { `rgba(${e[0]},${e[1]},${e[2]},${bgOpacity})` }), rgbArr.map(e => { `rgba(${e[0]},${e[1]},${e[2]},${borderOpacity})` })];
}

function renderProducts() {
    products = [];
    for (let i = 0; i < imgElems.length; i++) {
        let random = randomNumber();
        while (products.includes(random) || prevProducts.includes(random)) {
            random = randomNumber();
        }
        console.log(random);
        products.push(random);
    }
    prevProducts = [];
    prevProducts = products;
    console.log(products, prevProducts);

    for (let i = 0; i < imgElems.length; i++) {
        images[i] = imgElems.item(i);
        images[i].src = Product.productsArray[products[i]].src;
        images[i].alt = Product.productsArray[products[i]].name;
        Product.productsArray.forEach((elm, idx) => { if (elm.name === Product.productsArray[products[i]].name) { Product.productsArray[idx].views++; } });
    }

}
function handleProductClick(event) {

    clicks++;

    Product.productsArray.forEach((elm, i) => { if (event.target.alt === elm.name) { Product.productsArray[i].clicks++; } });
    
    if (clicks === maxClicksAllowed) {
        let btnSectionElem = document.querySelector('section#btn-container');
        let canvasElem = document.querySelector('canvas#product-vote-chart');
        articleElem.appendChild(btnSectionElem);
        articleElem.appendChild(canvasElem);
        resultBtn.textContent = 'View Chart';
        resultBtn.onclick = renderChart;

        articleElem.appendChild(resultsSectionElem);
        btnSectionElem.appendChild(resultBtn);

        // productContainer.className = 'no-voting';
        productContainer.removeEventListener('click', handleProductClick);

    } else {
        renderProducts();
    }
    console.log(clicks);
}

function renderChart() {

    let colorsArray = rgbaRandomColorArray(15, 0.2, 1);
    let chartSectionElem = document.querySelector('section#product-vote-chart');

    const ctx = document.getElementById('product-vote-chart').getContext('2d');
    const productChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Product.productsArray.map(e => e.name),
            datasets: [{
                label: '# of Votes',
                data: Product.productsArray.map(e => e.clicks),
                backgroundColor: colorsArray[0],
                borderColor: colorsArray[1],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    chartSectionElem.appendChild(ctx);

}

function renderResults() {
    console.log('renderResults');
    let ulElem = document.createElement('ul');

    Product.productsArray.forEach(productObj => { let liElem = document.createElement('li'); liElem.textContent = `${productObj.name} had ${productObj.clicks} votes, and was seen ${productObj.views} times.`; ulElem.appendChild(liElem); });

    resultsSectionElem.appendChild(ulElem);
    articleElem.appendChild(resultsSectionElem);
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
