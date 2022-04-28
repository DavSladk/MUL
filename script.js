var xmlDoc, parser;

function loadSlide(slideNumber)
{
    var slide = xmlDoc.getElementsByTagName("slide")[slideNumber];
    document.getElementsByTagName("body")[0].innerHTML = slide.getElementsByTagName("text")[0].childNodes[0].nodeValue;
}

function loadXML(input)
{
    let file = input.files[0];
    let reader = new FileReader();  
    reader.readAsText(file);

    reader.onload = function() {
      parser = new DOMParser();
      xmlDoc = parser.parseFromString(reader.result,"text/xml");
      loadSlide(0);
    };
}
