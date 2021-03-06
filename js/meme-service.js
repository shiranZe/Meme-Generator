'use strict'

var canvas;
var ctx;
var gFilter = 'All'
var gKeywords = {}
var gCurrLine = 0;


var gImgs = [
    { id: 1, url: 'img/meme-img/003.jpg', keywords: ['Politics'] },
    { id: 2, url: 'img/meme-img/2.jpg', keywords: ['Happy'] },
    { id: 3, url: 'img/meme-img/004.jpg', keywords: ['Cute', 'Animals'] },
    { id: 4, url: 'img/meme-img/005.jpg', keywords: ['Love', 'Babies'] },
    { id: 5, url: 'img/meme-img/5.jpg', keywords: ['Babies', 'Angry'] },
    { id: 6, url: 'img/meme-img/006.jpg', keywords: ['Animals'] },
    { id: 7, url: 'img/meme-img/8.jpg', keywords: ['Funny'] },
    { id: 8, url: 'img/meme-img/9.jpg', keywords: ['Funny'] },
    { id: 9, url: 'img/meme-img/12.jpg', keywords: ['TV'] },
    { id: 10, url: 'img/meme-img/19.jpg', keywords: ['Scary'] },
    { id: 11, url: 'img/meme-img/Ancient-Aliens.jpg', keywords: ['TV'] },
    { id: 12, url: 'img/meme-img/drevil.jpg', keywords: ['Movies'] },
    { id: 13, url: 'img/meme-img/img2.jpg', keywords: ['Dance'] },
    { id: 14, url: 'img/meme-img/img4.jpg', keywords: ['Politics'] },
    { id: 15, url: 'img/meme-img/img5.jpg', keywords: ['Babies'] },
    { id: 16, url: 'img/meme-img/img6.jpg', keywords: ['Animals'] },
    { id: 17, url: 'img/meme-img/img11.jpg', keywords: ['Politics', 'Funny'] },
    { id: 18, url: 'img/meme-img/img12.jpg', keywords: ['Angry'] },
    { id: 19, url: 'img/meme-img/leo.jpg', keywords: ['Cheers', 'Leo'] },
    { id: 20, url: 'img/meme-img/meme1.jpg', keywords: ['Matrix'] },
    { id: 21, url: 'img/meme-img/Oprah.jpg', keywords: ['TV', 'Winner'] },
    { id: 22, url: 'img/meme-img/patrick.jpg', keywords: ['StarWars', 'Movies'] },
    { id: 23, url: 'img/meme-img/Putin.jpg', keywords: ['Politics'] },


];

var gMeme = {
    selectedImgId: null,
    txts: [
        {
            line: '',
            size: 40,
            align: 'center',
            color: 'white',
            font: 'Impact',
            shadow: false,
            x: 125,
            y: 50
        }
    ]
}


function getImgIdxById(imgId) {
    var idx = gImgs.findIndex(function (img) {
        return img.id === imgId;

    })
    return idx
}

function getImgById(imgId) {
    var img = gImgs.find(function (img) {
        return img.id === imgId;

    })
    return img;
}

function setMeme(id) {
    gMeme.selectedImgId = id;
}

function getMemeImgId() {
    return gMeme.selectedImgId;
}
function setMemeLine(text) {

    gMeme.txts[gCurrLine].line = text;
}

function setMemeColor(color) {

    gMeme.txts[gCurrLine].color = '#' + color;
}

function getMeme() {
    return gMeme;
}


function initMeme() {

    gMeme = {
        selectedImgId: null,
        txts: [
            {
                line: '',
                size: 40,
                align: 'center',
                color: 'white',
                font: 'Impact',
                shadow: false,
                x: 125,
                y: 50
            }
        ]
    }

}


function getImagesToDisplay(strFliter) {

    var imgs = [];
    if (strFliter === 'All' || strFliter === '') {
        imgs = gImgs;
    } else {
        gImgs.forEach(function (img) {
            img.keywords.forEach(function (keyword) {
                if (keyword === strFliter) imgs.push(img);


            })
        })
    }
    return imgs;
}

function addLine() {

    if (gMeme.txts[gCurrLine].line === '' || gCurrLine === 1) return;

    var newLine = {
        line: '',
        size: 40,
        align: 'center',
        color: 'white',
        font: 'Impact',
        shadow: false,
        x: 125,
        y: gMeme.txts[gCurrLine].y + (canvas.height / 1.5)
    }
    gCurrLine += 1;
    gMeme.txts.push(newLine);
}


function getKeywords() {
    var keywordsList = gImgs.reduce(function (acc, img) {
        acc = acc.concat(img.keywords);
        return acc;
    }, []);

    return keywordsList;
}

function setMemeCords(strDirection) {
    var align = gMeme.txts[gCurrLine].align
    var currLine = gMeme.txts[gCurrLine]

    switch (strDirection) {
        case ('left'):
            align = 'left';
            currLine.x = 5;
            break;
        case ('right'):
            align = 'right';
            currLine.x = canvas.width - 5;
            break;
        case ('center'):
            align = 'center';
            currLine.x = canvas.width / 2;
            break;

        case ('up'):
            gMeme.txts[gCurrLine].y -= 5;

            console.log(gMeme.txts[gCurrLine].y)

            break;

        case ('down'):
            gMeme.txts[gCurrLine].y += 5;
            break;


    }
    gMeme.txts[gCurrLine].align = align;

}

function changFontStyle(newFont) {
    gMeme.txts[gCurrLine].font = newFont
}

function setShadow() {

    gMeme.txts.forEach(function (txt) {
        if (!txt.shadow) txt.shadow = true;
        else (txt.shadow = false);
    })
}

function createKeywordsMap() {
    gKeywords = loadFromStorage('KEY-WORDS');
    if (gKeywords) return gKeywords;

    var keywords = gImgs.reduce(function (acc, img) {
        img.keywords.forEach(function (keyword) {
            if (acc[keyword]) acc[keyword] = acc[keyword] + 1;
            else (acc[keyword] = 10);
        });
        return acc;
    }, {});
    gKeywords = keywords
    saveToStorage('KEY-WORDS', gKeywords);
    return gKeywords;
}

function setKeywordClicks(keyword) {
    if (gKeywords[keyword] === 40) return;

    gKeywords[keyword] = gKeywords[keyword] + 5;
    saveToStorage('KEY-WORDS', gKeywords);

}

function getKeywordsMap() {
    return gKeywords;
}

function updateCurrLine(idx) {
    gCurrLine = idx;
}

function changFontSize(symbol) {

    var fontSize = gMeme.txts[gCurrLine].size;
    if (symbol === '+') fontSize = fontSize + 10;
    else fontSize = fontSize - 10;

    gMeme.txts[gCurrLine].size = fontSize;

}
