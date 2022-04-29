var xmlDoc, parser;

function loadSlide(slideNumber)
{
    var slideData = xmlDoc.getElementsByTagName("slide")[slideNumber];
    var slideButtons = slideData.getElementsByTagName("button");
    var slideTexts = slideData.getElementsByTagName("text");
    var slideAudios = slideData.getElementsByTagName("audio");
    var slideImages = slideData.getElementsByTagName("image");
    var classes = slideData.getElementsByTagName("slideClass");

    var slideNode = document.createElement("div");
    var body = document.getElementsByTagName("body")[0];
    
    var id = document.createAttribute("id");
    id.value = `slide${slideNumber}`;
    slideNode.setAttributeNode(id);

    addClasses(slideNode, classes);
    createButtons(slideButtons, slideNode);
    createTexts(slideTexts, slideNode);
    createAudios(slideAudios, slideNode);
    createImages(slideImages, slideNode);

    body.innerHTML = "";
    body.appendChild(slideNode);
}

function loadXML()
{
    let input = document.getElementsByTagName("input")[0];
    let file = input.files[0];
    let reader = new FileReader();  
    reader.readAsText(file);

    reader.onload = function() {
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(reader.result,"text/xml");
      loadSlide(0);
    };
}

function createImages(images, slideNode)
{
    for (let i = 0; i < images.length; i++)
    {
        var src = images[i].getElementsByTagName("src")[0].childNodes[0].nodeValue;
        var classes = images[i].getElementsByTagName("imageClass");

        var imageEle = document.createElement("img");
        var id = document.createAttribute("id");
        id.value = `image${i}`;
        imageEle.setAttributeNode(id);

        var srcAtt = document.createAttribute("src");
        srcAtt.value = `img/${src}`;
        imageEle.setAttributeNode(srcAtt);

        addClasses(imageEle, classes);
        slideNode.appendChild(imageEle);
    }
}

function createAudios(audios, slideNode)
{
    for (let i = 0; i < audios.length; i++)
    {
        var src = audios[i].getElementsByTagName("src")[0].childNodes[0].nodeValue;
        var classes = audios[i].getElementsByTagName("audioClass");

        var audioEle = document.createElement("audio");
        var id = document.createAttribute("id");
        id.value = `audio${i}`;
        audioEle.setAttributeNode(id);
        var autoplay = document.createAttribute("autoplay");
        audioEle.setAttributeNode(autoplay);
        var loop = document.createAttribute("loop");
        audioEle.setAttributeNode(loop);

        var srcEle = document.createElement("source");
        var srcAtt = document.createAttribute("src");
        srcAtt.value = `audio/${src}`;
        srcEle.setAttributeNode(srcAtt);
        var typeAtt = document.createAttribute("type");
        typeAtt.value = "audio/mpeg";
        srcEle.setAttributeNode(typeAtt);

        addClasses(audioEle, classes);
        audioEle.appendChild(srcEle);
        slideNode.appendChild(audioEle);
    }
}

function createTexts(texts, slideNode)
{
    for (let i = 0; i < texts.length; i++)
    {
        var value = texts[i].getElementsByTagName("value")[0].childNodes[0].nodeValue;
        var classes = texts[i].getElementsByTagName("textClass");

        var text = document.createElement("div");
        text.innerHTML = value;

        var id = document.createAttribute("id");
        id.value = `text${i}`;
        text.setAttributeNode(id);

        addClasses(text, classes);
        slideNode.appendChild(text);
    }
}

function createButtons(buttons, slideNode)
{
    for (let i = 0; i < buttons.length; i++)
    {
        var to = buttons[i].getElementsByTagName("to")[0].childNodes[0].nodeValue;
        var value = buttons[i].getElementsByTagName("value")[0].childNodes[0].nodeValue;
        var classes = buttons[i].getElementsByTagName("buttonClass");

        var button = document.createElement("button");
        button.innerHTML = value;

        var onclick = document.createAttribute("onclick");
        onclick.value = `loadSlide(${to})`;
        button.setAttributeNode(onclick);

        var id = document.createAttribute("id");
        id.value = `button${i}`;
        button.setAttributeNode(id);

        addClasses(button, classes);

        slideNode.appendChild(button);
    }
}

function addClasses(element, classes)
{
    var classesString = "";

    for (let i = 0; i < classes.length; i++)
    {
        classesString += " " + classes[i].childNodes[0].nodeValue;
    }

    var a = document.createAttribute("class");
    a.value = classesString;
    element.setAttributeNode(a);
}
