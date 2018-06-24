'use strict'

function init() {
  var images = getImagesToDisplay('All')
  renderGallery(images)
  renderFilter()
  createKeywordsMap()
  renderKeywords()
}


function renderGallery(images) {

  var strHtml = images.map(function (img) {
    return `
    <div class="gallery-img" 
    style="background-image: url(${img.url})" onclick="showEditor(${img.id})"></div> `
  });

  document.querySelector('.gallery').innerHTML = strHtml.join('');
}


function showEditor(imgId) {

  initMeme()
  document.querySelector('#user-text').value = ''
  setMeme(imgId)

  document.querySelector('.gallery-container').classList.add('.gallery-hide')
  document.querySelector('.gallery-container').style.display = 'none'
  document.querySelector('.meme-container').style.display = 'block'
  document.querySelector('.back').style.display = "block"
  document.querySelector('#about').style.display = 'none'
  document.querySelector('.contact').style.display = 'none'
  document.querySelector('nav').style.display = 'none'
  drawCanvas()
  renderCanvas()
}

function drawCanvas() {
  canvas = document.querySelector('#myCanvas');
  ctx = canvas.getContext('2d')

}

function renderCanvas() {
  // ctx.clearRect(0, 0, canvas.width, canvas.height);
  var id = getMemeImgId();
  var image = getImgById(id)
  drawImage(image)


}


function onKeywordClick(keyword) {
  setKeywordClicks(keyword)
  setFilter(keyword)
  renderKeywords()

}

function renderKeywords() {
  var keywords = getKeywordsMap()
  var strHtml = ''
  for (var keyword in keywords) {
    strHtml += `<li style="font-size:${keywords[keyword]}px" 
    onclick="onKeywordClick('${keyword}')"> ${keyword}

    </li>`

  }

  document.querySelector('.keywords-list').innerHTML = strHtml;
}


function onTextType(ev) {
  var text = document.querySelector('#user-text').value;
  setMemeLine(text)
  renderCanvas()

}

function drawImage(image) {
  var img = new Image();
  img.src = image.url;
  img.onload = function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var ratio = img.height / img.width;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.width * ratio);
    drawText()
  };

}


function drawText() {
  var currMeme = getMeme()
  for (var i = 0; i < currMeme.txts.length; i++) {
    var txt = currMeme.txts[i]
    if (txt.align == 'center') txt.x = canvas.width / 2;
    if (txt.align === 'right') txt.x = canvas.width;
    if (txt.align === 'left') txt.x = 0;
    if (txt.shadow === true) {

      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 3;
      ctx.shadowBlur = 7;
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    } else {
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = 0;
    }
    ctx.font = txt.size + 'px ' + txt.font;
    ctx.fillStyle = txt.color;
    ctx.textAlign = txt.align;
    ctx.strokeText(txt.line, txt.x, canvas.height * txt.y);
    ctx.fillText(txt.line, txt.x, txt.y);

  }
}



function changFontSize(elSymbol) {
  var currMeme = getMeme()
  var symbol = elSymbol.innerHTML
  for (var i = 0; i < currMeme.txts.length; i++) {
    var txt = currMeme.txts[i]
    var fontSize = null
    if (symbol === '+') fontSize = txt.size + 10
    else fontSize = txt.size - 10
    ctx.font = fontSize + 'px' + txt.font;
    txt.size = fontSize
  }
  renderCanvas()


}

function onColorChange(color) {

  setMemeColor(color)
  renderCanvas()

}

function setFilter(strFilter) {

  var images = getImagesToDisplay(strFilter)
  renderGallery(images)

}

function onChangeLine() {
  document.querySelector('#user-text').value = ''
  addLine()
  renderCanvas()
}

function renderFilter() {

  var keywords = getKeywords();
  keywords = keywords.filter(function (keyword, keyId, keywords) {
    return keywords.indexOf(keyword) === keyId;
  });
  var strHtml = `<option value="All">`

  keywords.forEach(function (keyword) {
    console.log(keyword)
    strHtml += `<option value="${keyword}">`
  })

  document.querySelector('#keywords').innerHTML = strHtml
}

function handleClick(ev) {
  console.log(ev)
  var currMeme = getMeme()
  var elCanvas = document.querySelector('#myCanvas')
  var currLine = 0;

  for (var i = 0; i < currMeme.txts.length; i++) {

    var txt = currMeme.txts[i]

    if (
      ev.clientX > txt.x + 150 &&
      ev.clientX < txt.x + canvas.width &&
      ev.clientY > txt.y &&
      ev.clientY < txt.y + 100) {

      currLine = currMeme.txts[i]
      document.querySelector('#user-text').value = currLine.line
      console.log(currLine.x, currLine.y)
      gCurrLine = i;
      console.log(gCurrLine)
 
      renderCanvas()

    }
  }
}


function onMoveText(ElIcon) {

  if (ElIcon.classList[0] === 'left') setMemeCords('left')
  if (ElIcon.classList[0] === 'right') setMemeCords('right')
  if (ElIcon.classList[0] === 'center') setMemeCords('center')

  renderCanvas()
}

function addShadow() {
  setShadow();
  renderCanvas()
}

function goBack() {
  document.querySelector('.back').style.display = 'none'
  document.querySelector('.gallery-container').style.display = 'flex'
  document.querySelector('.meme-container').style.display = 'none'
  document.querySelector('#about').style.display = 'flex'
  document.querySelector('.contact').style.display = 'flex'
  document.querySelector('nav').style.display = 'flex'


}

function downloadCanvas(elLink) {
  var elCanvas = document.querySelector('#myCanvas')
  elLink.href = elCanvas.toDataURL()
  elLink.download = 'my-meme.jpg'
}

function onSubmit(ev) {

  ev.preventDefault()

  var emailInput = document.querySelector('.email').value
  var msgInput = document.querySelector('.msg').value

  if (!emailInput || !msgInput) return;

  window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=szelnir@gmail.com&body=+${msgInput}`)
  window.location.reload(true);

  document.querySelector('.email').value = '';
  document.querySelector('.msg').value = '';
}



function toggleMenu() {
  document.querySelector('.main-menu').classList.toggle('open')
  document.querySelector('.humburger').classList.toggle('humburger-open');

}

// function handleUpload() {
//   var reader = new FileReader();
//   reader.onload = function(event) {
//     addImage()
//     img.src = reader.result;
//   }
//   reader.readAsDataURL(fileInput.files[0]);
//  }


