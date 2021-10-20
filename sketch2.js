

let cards = [];
let prevCards = [];
let selectedCards = [];
let intialCards = [];
let prevBoard = [];
let score = 0;
let info = false;
let buttons = [];
let buttonIds = ["add", "sub", "mult", "div", "undo", "reset", "next", "menu"];
let buttonPanelH;
let menuOpen = false;
let menuX, menuY;
let menuW;
let menuH;
let canvas;
let menuSlidingButton = [];
let menuButtonIds = ["randomloc", "allpossible", "confetti", "facenumbers"];
let spawnRandomLocation = true;
let allPossible = true;
let isConfetti = true;
let faceNumbers = true;

let confettiColor;
let confetti = [];

function setup() {
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    canvas.position(0, 0);
    confettiColor = [color('#00aeef'), color('#ec008c'), color('#72c8b6'), color('#d198f9')];
    initialize();

    // console.log(checkPossible());

    newBoard();
    // cards = [new Card(width/2, height/2, 24)];
    prevBoard = cards;

    // for(let n = 0; n < 4; n++) {
    //     for(let i = 1; i <= 13; i++) {
    //         cards.push(new Card(random(0, width-50), random(0, height-50), i));
    //     }
    // }
}

function windowResized() {
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    canvas.position(0, 0);
    initialize();
}

function initialize() {
    buttonPanelH = (width + 0.25 * height) / 15;

    menuW = (2 * width +  2 * height) / 10;
    menuX = width;
    menuY = buttonPanelH;
    menuH = height - buttonPanelH;

    buttons = [];
    for (let i = 0; i < buttonIds.length; i++) {
        buttons.push(new Button(width - buttonPanelH * (buttonIds.length - 0.5) + buttonPanelH * i, buttonPanelH / 2, buttonPanelH * 4 / 5, buttonIds[i]));
    }

    menuSlidingButton = [];
    for (let i = 0; i < menuButtonIds.length; i++) {
        menuSlidingButton.push(new SlidingButton(width + menuW * 3 / 4, buttonPanelH + menuW / 6 * (i + 1), menuW / 7, menuButtonIds[i]));
    }

    // for (let i = 0; i < cards.length; i++) {
    //     prevCards[i] = new Card(Math.min(prevCards[i].x, width-prevCards[i].w), Math.min(prevCards[i].y, height - prevCards[i].h), prevCards[i].n);
    // }

    // for (let i = 0; i < cards.length; i++) {
    //     intialCards[i] = new Card(Math.min(intialCards[i].x, width-intialCards[i].w), Math.min(intialCards[i].y, height - intialCards[i].h), intialCards[i].n);
    // }

    for (let i = 0; i < cards.length; i++) {
        cards[i] = new Card(Math.min(cards[i].x, width-cards[i].w), Math.min(cards[i].y, height - cards[i].h), cards[i].n);
    }

    // newBoard();
}


function draw() {
    background(51);


    let flag = false;
    if (!menuOpen) {
        for (let i = cards.length - 1; i >= 0; i--) {
            let card = cards[i];
            if (!flag && card.update()) {
                flag = true;
                cards.splice(i, 1);
                cards.push(card);
                // cards.splice(0, 0, card);
            }
        }
    }
    for (let i = 0; i < cards.length; i++) {
        let card = cards[i];
        card.show();
    }

    if (menuOpen) {
        menuX = lerp(menuX, width - menuW, 0.1);
    } else {
        menuX = lerp(menuX, width, 0.1);
    }

    fill(0, 100);
    noStroke();
    rectMode(CORNER);
    rect(menuX, menuY, menuW, menuH);

    menuSlidingButton.forEach(button => {
        if (menuOpen) {
            button.x += lerp(menuX, width - menuW, 0.1) - menuX;
            button.buttonX += lerp(menuX, width - menuW, 0.1) - menuX;
        } else {
            button.x += lerp(menuX, width, 0.1) - menuX;
            button.buttonX += lerp(menuX, width, 0.1) - menuX;
        }
        // button.buttonX = menuX + menuW / 2;
        button.update();
        button.show();
    });



    //Button panel
    rectMode(CORNER);
    noStroke();
    fill(70);
    rect(0, 0, width, buttonPanelH);
    textSize(buttonPanelH / 2);
    fill(255);
    noStroke();
    textAlign(LEFT, CENTER);
    text(score, buttonPanelH / 2, buttonPanelH / 2);


    buttons.forEach(button => {
        button.show();
    });

    confetti.forEach(c => {
        c.confettiDisplay();
    });

    for (let i = 0; i < confetti.length; i++) {
        if (confetti[i].y > height * 2) {
            confetti.splice(i, 1);
            i--;
        }
    }

    if (confetti.length < 75 && confetti.length > 0) {
        newBoard();
    }

    noCursor();
    if (mouseIsPressed) {
        stroke(255, 50, 50);
        strokeWeight(15);
    } else {
        stroke(255, 0, 0);
        strokeWeight(10);
    }

    line(mouseX, mouseY, pmouseX, pmouseY);
}

function touchStarted() {
    buttons.forEach(button => {
        button.update();
    });

    if (menuOpen) {
        menuSlidingButton.forEach(button => {
            button.click();
        });
    }

    if (menuOpen) {
        if (mouseX < width - menuW) {
            toggleMenu();
        }
        return false;
    }
    let flag = false;
    for (let i = cards.length - 1; i >= 0; i--) {
        let card = cards[i];
        if (!flag && card.touchingMouse()) {
            flag = true;
            // card.selected = !card.selected;
            cards.splice(i, 1);
            cards.push(card);
            if (selectedCards.includes(card)) {
                selectedCards.splice(selectedCards.indexOf(card), 1);
            } else {
                selectedCards.push(card);
                if (selectedCards.length > 2) {
                    selectedCards.splice(0, 1);
                }

            }
        }
    }

    return false;
}

function keyTyped() {
    if (key == ' ') {
    }

    if (key == 'n') {
        newBoard();
    }

    if (selectedCards.length == 2) {
        if (key == 'a' || key == '+') {
            prevCards = [];
            cards.forEach(card => {
                prevCards.push(card);
            });
            cards.push(new Card(selectedCards[1].x, selectedCards[1].y, selectedCards[0].n + selectedCards[1].n));
            cards.splice(cards.indexOf(selectedCards[0]), 1);
            cards.splice(cards.indexOf(selectedCards[1]), 1);
            selectedCards = [];
        }

        if (key == 's' || key == '-') {
            prevCards = [];
            cards.forEach(card => {
                prevCards.push(card);
            });
            cards.push(new Card(selectedCards[1].x, selectedCards[1].y, selectedCards[0].n - selectedCards[1].n));
            cards.splice(cards.indexOf(selectedCards[0]), 1);
            cards.splice(cards.indexOf(selectedCards[1]), 1);
            selectedCards = [];
        }

        if (key == 'd' || key == '/') {
            prevCards = [];
            cards.forEach(card => {
                prevCards.push(card);
            });
            cards.push(new Card(selectedCards[1].x, selectedCards[1].y, selectedCards[0].n / selectedCards[1].n));
            cards.splice(cards.indexOf(selectedCards[0]), 1);
            cards.splice(cards.indexOf(selectedCards[1]), 1);
            selectedCards = [];
        }

        if (key == 'm' || key == '*') {
            prevCards = [];
            cards.forEach(card => {
                prevCards.push(card);
            });
            cards.push(new Card(selectedCards[1].x, selectedCards[1].y, selectedCards[0].n * selectedCards[1].n));
            cards.splice(cards.indexOf(selectedCards[0]), 1);
            cards.splice(cards.indexOf(selectedCards[1]), 1);
            selectedCards = [];
        }

        if (cards.length == 1) {
            if (cards[0].n == 24) {
                scorePoint();
                // score++;
                // newBoard();
            }
        }
    }

    if (key == 'u') {
        cards = [];
        selectedCards = [];
        prevCards.forEach(card => {
            cards.push(card);
        });
    }

    if (key == 'r') {
        cards = [];
        selectedCards = [];
        intialCards.forEach(card => {
            cards.push(card);
        });
    }

    if (key == 'p') {
        cards = [];
        selectedCards = [];
        prevBoard.forEach(card => {
            cards.push(card);
        });
    }

}

function touchMoved() {
    return false;
}

function newBoard() {
    confetti = [];
    prevBoard = [];

    intialCards.forEach(card => {
        prevBoard.push(card);
    });

    cards = [];

    if (spawnRandomLocation) {
        for (let i = 0; i < 4; i++) {
            let h = (width + height) / 10;
            let w = h / 7 * 5;
            let randX = random(0, width - w);
            let randY = random(buttonPanelH, height - h);
            while (locationTaken(randX, randY)) {
                randX = random(0, width - w);
                randY = random(buttonPanelH, height - h);
            }
            cards.push(new Card(randX, randY, Math.floor(random(1, 14))));
        }
        // cards = [new Card(100, 100, 1),new Card(200, 100, 3),new Card(300, 100, 4),new Card(400, 100, 6)];

        if (allPossible) {
            while (checkPossible() == 0) {
                cards = [];
                for (let i = 0; i < 4; i++) {
                    let h = (width + height) / 10;
                    let w = h / 7 * 5;
                    let randX = random(0, width - w);
                    let randY = random(buttonPanelH, height - h);
                    while (locationTaken(randX, randY)) {
                        randX = random(0, width - w);
                        randY = random(buttonPanelH, height - h);
                    }
                    cards.push(new Card(randX, randY, Math.floor(random(1, 14))));
                }
            }
        }
    } else {
        for (let i = 0; i < 4; i++) {
            let h = (width + height) / 10;
            let w = h / 7 * 5;
            cards.push(new Card(width / 8 * i + width / 4 + (width / 8 - w) / 2, height / 2 + buttonPanelH / 2 - h / 2, Math.floor(random(1, 14))));
        }
        if (allPossible) {
            while (checkPossible() == 0) {
                cards = [];
                for (let i = 0; i < 4; i++) {
                    let h = (width + height) / 10;
                    let w = h / 7 * 5;
                    cards.push(new Card(width / 8 * i + width / 4 + (width / 8 - w) / 2, height / 2 + buttonPanelH / 2 - h / 2, Math.floor(random(1, 14))));
                }
            }
        }
    }

    prevCards = [];
    cards.forEach(card => {
        prevCards.push(card);
    });

    intialCards = [];
    cards.forEach(card => {
        intialCards.push(card);
    });

    selectedCards = [];

    // console.log(checkPossible());
}


function permutator(inputArr) {
    var results = [];

    function permute(arr, memo) {
        var cur, memo = memo || [];

        for (var i = 0; i < arr.length; i++) {
            cur = arr.splice(i, 1);
            if (arr.length === 0) {
                results.push(memo.concat(cur));
            }
            permute(arr.slice(), memo.concat(cur));
            arr.splice(i, 0, cur[0]);
        }

        return results;
    }

    return permute(inputArr);
}

function locationTaken(x, y) {
    let result = false;
    cards.forEach(card => {
        if (x > card.x - card.w && x < card.x + card.w && y > card.y - card.h && y < card.y + card.h) {
            result = true;
        }
    });
    return result;
}

function scorePoint() {
    score++;
    if (isConfetti) {
        for (let i = 0; i < 150; i++) {
            confetti[i] = new Confetti(random(0, width), random(height / 2, height * 2), -height / 7);
        }
    } else {
        newBoard();
    }

}

function toggleMenu() {
    menuOpen = !menuOpen;
}

function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
}