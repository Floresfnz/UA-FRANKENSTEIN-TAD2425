// Declare variables for getting the xml file for the XSL transformation (folio_xml) and to load the image in IIIF on the page in question (number).
let tei = document.getElementById("folio");
let tei_xml = tei.innerHTML;
let extension = ".xml";
let folio_xml = tei_xml.concat(extension);
let page = document.getElementById("page");
let pageN = page.innerHTML;
let number = Number(pageN);

// Loading the IIIF manifest
var mirador = Mirador.viewer({
  "id": "my-mirador",
  "manifests": {
    "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json": {
      provider: "Bodleian Library, University of Oxford"
    }
  },
  "window": {
    allowClose: false,
    allowWindowSideBar: true,
    allowTopMenuButton: false,
    allowMaximize: false,
    hideWindowTitle: true,
    panels: {
      info: false,
      attribution: false,
      canvas: true,
      annotations: false,
      search: false,
      layers: false,
    }
  },
  "workspaceControlPanel": {
    enabled: false,
  },
  "windows": [
    {
      loadedManifest: "https://iiif.bodleian.ox.ac.uk/iiif/manifest/53fd0f29-d482-46e1-aa9d-37829b49987d.json",
      canvasIndex: number,
      thumbnailNavigationPosition: 'off'
    }
  ]
});


// function to transform the text encoded in TEI with the xsl stylesheet "Frankenstein_text.xsl", this will apply the templates and output the text in the html <div id="text">
function documentLoader() {

    Promise.all([
      fetch(folio_xml).then(response => response.text()),
      fetch("Frankenstein_text.xsl").then(response => response.text())
    ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("text");
      criticalElement.innerHTML = ''; // Clear existing content
      criticalElement.appendChild(resultDocument);
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
  }
  
// function to transform the metadate encoded in teiHeader with the xsl stylesheet "Frankenstein_meta.xsl", this will apply the templates and output the text in the html <div id="stats">
  function statsLoader() {

    Promise.all([
      fetch(folio_xml).then(response => response.text()),
      fetch("Frankenstein_meta.xsl").then(response => response.text())
    ])
    .then(function ([xmlString, xslString]) {
      var parser = new DOMParser();
      var xml_doc = parser.parseFromString(xmlString, "text/xml");
      var xsl_doc = parser.parseFromString(xslString, "text/xml");

      var xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl_doc);
      var resultDocument = xsltProcessor.transformToFragment(xml_doc, document);

      var criticalElement = document.getElementById("stats");
      criticalElement.innerHTML = ''; // Clear existing content
      criticalElement.appendChild(resultDocument);
    })
    .catch(function (error) {
      console.error("Error loading documents:", error);
    });
  }

  // Initial document load
  documentLoader();
  statsLoader();
  // Event listener for sel1 change
  function selectHand(event) {
  var visible_mary = document.getElementsByClassName('#MWS');
  var visible_percy = document.getElementsByClassName('#PBS');
  // Convert the HTMLCollection to an array for forEach compatibility
  var MaryArray = Array.from(visible_mary);
  var PercyArray = Array.from(visible_percy);
    if (event.target.value == 'both') {
      texts.forEach(function(text) {
        let div = document.createElement("div");
        div.textContent = text;
        div.style.color = "black";
        document.body.appendChild(div);
      }); //write an forEach() method that shows all the text written and modified by both hand (in black?). The forEach() method of Array instances executes a provided function once for each array element.
     
    } else if (event.target.value == 'Mary') {
      texts.forEach(function(entry) {
        let div = document.createElement("div");
        div.textContent = entry.text;

        if (entry.author === "Mary") {
          div.style.color = "purple";
          div.style.fontWeight = "bold";
        } else if (entry.author === "Percy") {
          div.style.color = "black";
        }
        document.body.appendChild(div);
      });//write an forEach() method that shows all the text written and modified by Mary in a different color (or highlight it) and the text by Percy in black. 
     
    } else  (event.target.value == 'Percy') ;{
      texts.forEach(function(entry) {
        let div = document.createElement("div");
        div.textContent = entry.text;

        if (entry.author === "Percy") {
          div.style.color = "yellow";
          div.style.fontWeight = "italic";
        } else if (entry.author === "Mary") {
          div.style.color = "black";
        }
        document.body.appendChild(div);
      });//write an forEach() method that shows all the text written and modified by Percy in a different color (or highlight it) and the text by Mary in black.
    
    }
  }
  function toggleDeletions() {
    const deletedElements = document.querySelectorAll(".deleted");
    deletedElements.forEach(function(element) {
      // Toggle the 'hidden' class to show/hide deletions
      element.classList.toggle("hidden");
    });
  }// write another function that will toggle the display of the deletions by clicking on a button
  
  function renderTexts(mode = "default") {
    const container = document.getElementById("textsContainer");
    container.innerHTML = '';  // Clear the container before re-rendering

    texts.forEach(function(entry) {
      // Create a new div for each text entry
      let div = document.createElement("div");

      // Display the text with deletions and additions in default mode
      if (mode === "default") {
        if (entry.deleted) {
          let deletedText = document.createElement("del");
          deletedText.textContent = entry.text;
          div.appendChild(deletedText);
          div.classList.add("deleted");
        } else {
          div.textContent = entry.text;
        }

        if (entry.added) {
          let addedText = document.createElement("sup");
          addedText.textContent = entry.added;
          div.appendChild(addedText);
          div.classList.add("added");
        }
      }

      // Display the text in reading mode (no deletions, additions inline)
      else if (mode === "reading") {
        let textContent = entry.text;
        // Remove the deleted portion and inline additions
        if (entry.added) {
          textContent += " " + entry.added;
        }
        div.textContent = textContent;
      }

      if (entry.author === "Mary") {
        div.style.color = "purple";
        div.style.fontWeight = "bold";
      } else if (entry.author === "Percy") {
        div.style.color = "black";
      }

      // Append the div to the container
      container.appendChild(div);
    });
  }

  // Function to toggle reading mode
  function toggleReadingMode() {
    const currentMode = document.body.classList.contains("reading-mode") ? "default" : "reading";
    if (currentMode === "reading") {
      document.body.classList.add("reading-mode");
    } else {
      document.body.classList.remove("reading-mode");
    }
    renderTexts(currentMode);
  }

  
  document.getElementById("toggleReadingModeButton").addEventListener("click", toggleReadingMode);

  document.getElementById("modeDropdown").addEventListener("change", function() {
    const selectedMode = this.value;
    if (selectedMode === "reading") {
      document.body.classList.add("reading-mode");
    } else {
      document.body.classList.remove("reading-mode");
    }
    renderTexts(selectedMode);
  });// EXTRA: write a function that will display the text as a reading text by clicking on a button or another dropdown list, meaning that all the deletions are removed and that the additions are shown inline (not in superscript)
