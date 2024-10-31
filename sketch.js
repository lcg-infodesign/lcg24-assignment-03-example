// Vogliamo riprodurre questo progetto: https://www.behance.net/gallery/99114047/Population-Density

let data;

function preload() {
  // Carica i dati dal file CSV e li memorizza nella variabile 'data'
  data = loadTable("assets/data/data.csv", "csv", "header");
}

// Definiamo alcune variabili globali per colori e dimensioni
let bgColor = "#0f1632"; // Colore di sfondo dei cerchi
let dotsColor = "#fbfffd"; // Colore dei punti all'interno dei cerchi
let pageColor = "#ededed"; // Colore di sfondo della pagina
let textColor = "#040404"; // Colore del testo (nomi dei paesi)
let symbolColor = "#203783"; // Colore dei simboli delle regioni

let circleSize = 130; // Dimensione dei cerchi principali
let dotsSize = 3; // Dimensione dei punti
let symbolSize = 12; // Dimensione dei simboli delle regioni
let padding = 20; // Spaziatura orizzontale tra i cerchi
let vPadding = 60; // Spaziatura verticale tra le righe di cerchi
let outerpadding = 50; // Spaziatura esterna dal bordo della pagina

function setup() {
  // Crea un'area di disegno che occupa l'intera finestra del browser
  createCanvas(windowWidth, windowHeight);

  // Imposta il colore di sfondo della pagina
  background(pageColor);

  // Converte i dati in un oggetto per facilitarne l'uso
  let dataobj = data.getObject();

  console.log(dataobj);

  // Posizioni iniziali per disegnare i cerchi
  let xpos = outerpadding + circleSize / 2;
  let ypos = outerpadding + circleSize / 2;

  // Ciclo per disegnare un cerchio per ogni paese nel dataset
  for (let i = 0; i < data.getRowCount(); i++) {
    let item = dataobj[i];
    console.log(item);

    // Chiama la funzione per disegnare i glifi (cerchi con punti e simboli)
    drawGlyphs(xpos, ypos, circleSize, item);

    // Incrementa la posizione x per il prossimo cerchio
    xpos += circleSize + padding;

    // Se la posizione x supera la larghezza della finestra, va a capo
    if (xpos > width - circleSize) {
      // Resetta la posizione x per iniziare una nuova riga
      xpos = outerpadding + circleSize / 2;
      // Incrementa la posizione y per la nuova riga
      ypos += circleSize + vPadding;
    }
  }
}

function draw() {
  // La funzione draw è vuota perché tutto il disegno avviene in setup()
}

function drawGlyphs(x, y, size, data) {
  // Disegna un cerchio proporzionale alla popolazione del paese
  fill("red");
  noStroke();

  // Applica un gradiente conico per un effetto visivo sul cerchio
  fillGradient("conic", {
    from: [x + 47, y + 47, 0], // Posizione iniziale del gradiente
    steps: ["#cb9ea5", "#b86b73", "#cb9ea5"], // Colori del gradiente
  });

  // Calcola la dimensione del cerchio in base alla popolazione
  let popSize = map(data.population, 0, 1439, 0, size);
  ellipse(x + 47, y + 47, popSize, popSize);

  // Disegna il cerchio di sfondo
  fill(bgColor);
  noStroke();
  ellipse(x, y, size, size);

  // Scrive il nome del paese sotto il cerchio
  fill(textColor);
  textAlign(CENTER, CENTER);
  textSize(14);
  textFont("Georgia"); // Imposta il font per il testo

  text(data.country, x, y + size / 2 + padding / 2);

  // Disegna all'interno del cerchio un numero di punti proporzionale alla densità di popolazione
  let density = data.density;

  // Disegna i punti distribuiti casualmente all'interno del cerchio
  fill(dotsColor);
  noStroke();

  for (var i = 0; i < density; i++) {
    // Angolo casuale
    let angle = random(TWO_PI);
    // Distanza casuale dal centro del cerchio.
    // La radice quadrata è usata per distribuire i punti in modo uniforme
    // Se usassimo solo random(size), i punti sarebbero più concentrati verso il centro
    // perché l'area cresce con il quadrato della distanza dal centro (raggio).
    // Usando Math.sqrt(random(size * size)), uniformiamo la distribuzione dei punti
    // sull'intera superficie del cerchio, creando un effetto di densità più uniforme.
    let radius = Math.sqrt(random(size * size)) / 2 - dotsSize;
    let xDot = x + cos(angle) * radius;
    let yDot = y + sin(angle) * radius;
    ellipse(xDot, yDot, dotsSize, dotsSize); // Disegna il punto
  }

  // Disegna un simbolo rappresentativo della regione del paese
  let symbol = data.region;

  rectMode(CENTER); // Imposta il modo di disegno per i rettangoli

  let xSymbol = x;
  let ySymbol = y - size / 2 - symbolSize - 3; // Posizione del simbolo sopra il cerchio

  if (symbol === "Americas") {
    // Se il paese è nelle Americhe, disegna un quadrato pieno
    fill(symbolColor);
    rect(xSymbol, ySymbol, symbolSize, symbolSize);
  }
  if (symbol === "Europe") {
    // Se il paese è in Europa, disegna un cerchio vuoto
    noFill();
    strokeWeight(2);
    stroke(symbolColor);
    ellipse(xSymbol, ySymbol, symbolSize, symbolSize);
  }

  if (symbol === "Africa") {
    // Se il paese è in Africa, disegna due semi-cerchi
    noFill();
    strokeWeight(2);
    stroke(symbolColor);
    // Disegna due archi per creare i semi-cerchi
    arc(xSymbol - symbolSize / 4, ySymbol, symbolSize, symbolSize, PI, TWO_PI);
    arc(xSymbol + symbolSize / 4, ySymbol, symbolSize, symbolSize, TWO_PI, PI);
  }
  if (symbol === "Asia") {
    // Se il paese è in Asia, disegna un rombo (quadrato ruotato di 45 gradi)
    push(); // Salva lo stato corrente del disegno
    translate(xSymbol, ySymbol); // Sposta l'origine al punto del simbolo
    rotate(PI / 4); // Ruota il sistema di coordinate di 45 gradi
    fill(symbolColor);
    rect(0, 0, symbolSize, symbolSize); // Disegna il quadrato ruotato
    pop(); // Ripristina lo stato precedente del disegno
  }
}
