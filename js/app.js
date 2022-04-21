'use strict';

const numImageDisplay = 3;
const maxClicksAllowed = 5;
const numImages = 15;

let productContainer = document.querySelector('section#img-container');
let sectionElem = document.createElement('section');
let articleElem = document.querySelector('article');
let resultBtn = document.createElement('button');
let btnSectionElem = document.querySelector('section#btn-container');
let canvasElem = document.querySelector('canvas#product-vote-chart');

let clicks = 0;
let images = [];
let products = [];
let prevProducts = [];

function Product(name, src, views = 0, votes = 0) {
    this.name = name,
        this.src = src,
        this.views = views,
        this.votes = votes,
        Product.productsArray.push(this)
}

Product.productsArray = [];

function randomNumber() { return Math.floor(Math.random() * Product.productsArray.length); }

function rgbaRandomColorArray(numColors, bgOpacity, borderOpacity) {
    let rgbArr = [];
    let rgbBackgroundArr = [];
    let rgbBorderArr = [];

    for (let i = 0; i < numColors; i++) {
        let rgbTemp = [];

        for (let j = 0; j < 3; j++) {
            let singleColorArray = rgbArr.map(elm => elm[j]);
            let color = Math.floor(Math.random() * 256);

            while (singleColorArray.includes(color)) {
                color = Math.floor(Math.random() * 256);
                console.log(`color: ${color}`);
            }

            rgbTemp.push(color);
        }

        rgbArr.push(rgbTemp);

        rgbBackgroundArr.push(`rgba(${rgbTemp.toString(',')},${bgOpacity})`);
        rgbBorderArr.push(`rgba(${rgbTemp.toString(',')},${borderOpacity})`);
    }

    console.log(rgbBackgroundArr, rgbBorderArr)

    return [rgbBackgroundArr, rgbBorderArr];
}

function renderProducts() {

    products = [];

    for (let i = 0; i < numImageDisplay; i++) {
        let random = randomNumber();
        while (products.includes(random) || prevProducts.includes(random)) {
            random = randomNumber();
        }

        products.push(random);
    }
    console.log(products);
    prevProducts = [];
    prevProducts = products;

    for (let i = 0; i < numImageDisplay; i++) {
        images[i] = imgElems.item(i);
        images[i].src = productsArray[products[i]].src;
        images[i].alt = productsArray[products[i]].name;
        productsArray.forEach((elm, idx) => { if (elm.name === productsArray[products[i]].name) { productsArray[idx].views++; } });
    }

}

function handleProductClick(event) {
    clicks++;

    productsArray.forEach((elm, i) => { if (event.target.alt === elm.name) { productsArray[i].votes++; } });

    if (clicks === maxClicksAllowed) {

        articleElem.appendChild(btnSectionElem);
        articleElem.appendChild(canvasElem);

        resultBtn.className = 'results';
        resultBtn.textContent = 'View Chart';
        resultBtn.onclick = renderChart;

        btnSectionElem.appendChild(resultBtn);

        productContainer.removeEventListener('click', handleProductClick);

        localStorage.removeItem('productsArray');
        localStorage.setItem('productsArray', JSON.stringify(productsArray));

    } else {

        renderProducts();
    }
    console.log(clicks);
}

function renderChart() {

    window.colorsArray = rgbaRandomColorArray(15, 0.2, 1);

    const ctx = document.getElementById('product-vote-chart').getContext('2d');

    window.productChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: productsArray.map(e => e.name),
            datasets: [{
                label: '# of Votes',
                data: productsArray.map(e => e.votes),
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

    btnSectionElem.removeChild(resultBtn);
    resultBtn.textContent = 'Reset';
    resultBtn.onclick = resetVoting;
    btnSectionElem.appendChild(resultBtn);

}

function resetVoting() {
    clicks = 0;
    productChart.destroy();
    btnSectionElem.removeChild(resultBtn);
    resultBtn.id = 'results-btn';
    resultBtn.className = 'voting-open';
    resultBtn.textContent = 'View Chart';
    btnSectionElem.appendChild(resultBtn);

    productContainer.addEventListener('click', handleProductClick);
}

function createImageElements() {

    for (let i = 0; i < numImageDisplay; i++) {
        let imgElem = document.createElement('img');
        imgElem.className = 'img-content';
        productContainer.appendChild(imgElem);
    }
    window.imgElems = productContainer.children;
}

function initializeProducts() {

    if (localStorage.getItem('productsArray')) {
        let parsedProducts = JSON.parse(localStorage.getItem('productsArray'));
        parsedProducts.map(product => new Product(product.name, product.src, product.views, product.votes));

    } else {
        for (let i = 0; i < numImages; i++) { new Product(`product${i + 1}`, `./img/products/${i + 1}.jpg`); }
    }
    window.productsArray = Product.productsArray;
    console.log(Product.name['product1']);

    localStorage.removeItem('productsArray');
    localStorage.setItem('productsArray', JSON.stringify(productsArray));

    console.log(localStorage.getItem('productsArray'));
    productContainer.addEventListener('click', handleProductClick);
}

function onLoadCallStack() {
    initializeProducts();
    createImageElements();
    renderProducts();
}

onLoadCallStack();