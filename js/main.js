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
    style="background-image: url(${img.url})" onclick="setEditor(${img.id})"></div> `
  });

  document.querySelector('.gallery').innerHTML = strHtml.join('');
}


function setEditor(imgId) {
  gCurrLine = 0
  initMeme()
  setMeme(imgId)
  showEditor()
  drawCanvas()
  renderCanvas()
}



function showEditor() {
  document.querySelector('.keywords').style.display = 'none'
  document.querySelector('#user-text').value = ''
  document.querySelector('.gallery-container').style.display = 'none'
  document.querySelector('.meme-container').style.display = 'block'
  document.querySelector('.back').style.display = "block"
  document.querySelector('#about').style.display = 'none'
  document.querySelector('.contact').style.display = 'none'
  document.querySelector('nav').style.display = 'none'
}

function drawCanvas() {
  canvas = document.querySelector('#myCanvas');
  ctx = canvas.getContext('2d')

}

function renderCanvas() {

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
    ctx.strokeStyle = "black";
    ctx.fillText(txt.line, txt.x, txt.y);
    ctx.strokeText(txt.line, txt.x, txt.y);

  }
}

function onFontSizeChange(elSymbol) {
  var symbol = elSymbol.innerHTML
  changFontSize(symbol)
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
    strHtml += `<option value="${keyword}">`
  })

  document.querySelector('#keywords').innerHTML = strHtml
}

function handleClick(ev) {

  var currMeme = getMeme()
  var elCanvas = document.querySelector('#myCanvas')

  for (var i = 0; i < currMeme.txts.length; i++) {

    var txt = currMeme.txts[i]
    if (
      ev.offsetX > txt.x / 2 &&
      ev.offsetX < txt.x + canvas.width &&
      ev.offsetY < txt.y &&
      ev.offsetY > txt.y - txt.size) {

      document.querySelector('#user-text').value = txt.line

      updateCurrLine(i)
      renderCanvas()

    }
  }
}
function onFontStyleChange(font) {

  changFontStyle(font)
  renderCanvas()
}


function onMoveText(strDirection) {

  setMemeCords(strDirection)
  renderCanvas()
}

function addShadow() {
  setShadow();
  renderCanvas()
}

function goBack() {
  document.querySelector('.keywords').style.display = 'block'
  document.querySelector('.back').style.display = 'none'
  document.querySelector('.gallery-container').style.display = 'flex'
  document.querySelector('.meme-container').style.display = 'none'
  document.querySelector('#about').style.display = 'block'
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
  document.querySelector('.menu-btn').classList.toggle('menu-btn-open');

}

// function handleUpload() {
//   var reader = new FileReader();
//   reader.onload = function(event) {
//     addImage()
//     img.src = reader.result;
//   }
//   reader.readAsDataURL(fileInput.files[0]);
//  }


