var xmlDoc, parser;

function loadSlide(slideNumber)
{
    var slideData = xmlDoc.getElementsByTagName("slide")[slideNumber];
    var slideButtons = slideData.getElementsByTagName("button");
    var slideTexts = slideData.getElementsByTagName("text");
    var classes = slideData.getElementsByTagName("slideClass");

    var slideNode = document.createElement("div");
    var body = document.getElementsByTagName("body")[0];
    
    var id = document.createAttribute("id");
    id.value = `slide${slideNumber}`;
    slideNode.setAttributeNode(id);

    addClasses(slideNode, classes);
    createButtons(slideButtons, slideNode);
    createTexts(slideTexts, slideNode);

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

function createTexts(texts, slideNode)
{
    for (let i = 0; i < texts.length; i++) {
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