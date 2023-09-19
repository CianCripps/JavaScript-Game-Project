let canvas;
let context;

let fpsInterval = 1000 / 30;
let now;
let then = Date.now();

let zombies = [];

let keys = [];

let houses = [];

let trees = [];

// Inspiration from MDN, in particular the play() function and volume attribute, by linked webpage and through similar method as to how images can be uploaded
// https://developer.mozilla.org/en-US/docs/Games/Techniques/Audio_for_Web_Games
let key_sound = new Audio("../static/key.mp3");

let request_id;

let xhttp;

let score = 0;

let player = {
    x : 0,
    y : 150,
    width : 64,
    height : 64.25, 
    frameX : 0,
    frameY : 0,
    xChange : 0, 
    yChange : 0, 
};

let floor;


let moveLeft = false;
let moveUp = false;
let moveDown = false;
let moveRight = false;



let background = [
    [0,1,1,127,82,82,82,82,127,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5],
    [22,26,26,127,82,82,82,82,127,26,26,26,70,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,127,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,127,26,27],
    [22,26,26,127,82,82,82,82,127,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,28,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,48,48,48,48,48,48,48,48,28,26,27], 
    [22,26,26,127,82,82,82,82,127,26,26,26,26,26,26,26,26,26,26,26,26,26,70,26,26,26,26,26,28,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,48,48,48,48,48,48,48,48,28,26,27], 
    [22,70,26,127,82,82,82,82,127,26,48,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,28,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,48,48,48,48,48,48,48,48,28,26,27], 
    [22,26,26,127,82,82,82,82,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,48,48,48,48,48,48,48,48,28,26,27], 
    [22,26,26,127,82,82,82,82,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,28,26,27], 
    [22,26,26,127,82,82,82,82,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,28,26,27], 
    [22,26,26,127,82,82,82,82,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,48,48,48,48,48,48,48,48,28,26,27], 
    [22,26,48,127,82,82,82,82,127,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,28,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,48,48,48,48,48,48,48,48,28,26,27], 
    [22,26,26,127,82,82,82,82,127,26,26,26,26,26,26,26,26,26,26,26,26,70,26,26,26,26,26,26,28,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,48,48,48,48,48,48,48,48,28,26,27], 
    [22,26,26,127,82,82,82,82,127,26,26,26,48,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,28,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,70,48,48,48,48,48,48,48,48,28,26,27], 
    [22,26,26,127,82,82,82,82,127,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,127,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,127,26,27], 
    [22,26,26,127,82,82,82,82,127,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,70,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27], 
    [22,26,26,127,82,82,82,82,127,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27], 
    [22,26,26,127,82,82,82,82,127,26,26,26,26,26,26,26,26,26,26,48,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27], 
    [22,26,26,127,82,82,82,82,127,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27], 
    [127,127,127,127,82,82,82,82,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127], 
    [105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105], 
    [105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105], 
    [87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,87,27], 
    [105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105], 
    [105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105,105], 
    [127,127,127,127,82,82,82,82,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127,127], 
    [22,26,26,127,82,82,82,82,127,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27], 
    [22,26,26,127,82,82,82,82,127,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27], 
    [22,26,26,127,82,82,82,82,127,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,70,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27], 
    [22,26,26,127,82,82,82,82,127,26,26,26,26,26,26,26,26,26,26,26,48,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27], 
    [22,26,26,127,82,82,82,82,127,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27], 
    [22,26,26,127,82,82,82,82,127,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,70,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27], 
    [22,26,26,127,82,82,82,82,127,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27], 
    [22,26,26,127,82,82,82,82,127,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27], 
    [22,26,26,127,82,82,82,82,127,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,48,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27], 
    [22,26,26,127,82,82,82,82,127,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,48,26,26,26,26,26,26,26,26,26,26,26,26,27], 
    [22,26,26,127,82,82,82,82,127,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27], 
    [22,26,26,127,82,82,82,82,127,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27], 
    [22,26,26,127,82,82,82,82,127,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27], 
    [22,26,26,127,82,82,82,82,127,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,70,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,26,27], 
    [11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11,11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
    [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100,100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    [40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40,40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40]   
];
  
let tilesPerRow = 22;
let tileSize = 16;
  
let IMAGES = {player: "../static/kenny.png", background: "../static/forest.png", zombies: "../static/ghost.png", keys: "../static/keys.png",trees: "../static/tree.png", houses: "../static/building.png"};
  
document.addEventListener("DOMContentLoaded", init, false); 

function init() {
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");

    floor = canvas.height-27;
    player.x = canvas.width / 2; 
    player.y = floor - player.height;
    
    window.addEventListener("keydown", activate, false); 
    window.addEventListener("keyup", deactivate, false);

    load_images(draw);
}

//show_score function inspiration from: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillText
function show_score() {
    context.font = "16px Tahoma";
    context.fillStyle = "#FFFFFF";
    context.fillText("Score: "+ score, 5, 25);
}

function draw() {
    window.requestAnimationFrame(draw); 
    let now = Date.now();
    let elapsed = now - then;
    if (elapsed <= fpsInterval) {
        return;
    }
    then = now - (elapsed % fpsInterval);

    // Draw ghosts
    if (zombies.length < 6) { 
        let z = {
            x : randint(0,canvas.width-64),
            y : randint(0,floor),
            height: 65,
            width: 64,
            frameX : 0,
            frameY : 0,
            size : 64, 
            xChange : randint(-10, 1), 
            yChange : randint(-10, 1),
        };
        zombies.push(z);
    }

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#87cefa"; 
    context.fillRect(0, 0, canvas.width, canvas.height);
    for (let r = 0; r < 40; r += 1) {
        for (let c = 0; c < 64; c += 1) {
            let tile = background[r][c];
            if (tile >= 0) {
                let tileRow = Math.floor(tile / tilesPerRow);
                let tileCol = Math.floor(tile % tilesPerRow);
                context.drawImage(IMAGES.background,
                    tileCol * tileSize, tileRow * tileSize, tileSize, tileSize,
                    c * tileSize, r * tileSize, tileSize, tileSize);
            }
        }
    }
    context.fillStyle = "yellow";
    for (let z of zombies) {
        context.drawImage(IMAGES.zombies,
            z.frameX * z.width, z.frameY * z.height, z.width, z.height,
            z.x, z.y, z.width, z.height);
            z.frameX = 0;
    }
    
    context.fillStyle = "red";
    context.drawImage(IMAGES.player,
        player.frameX * player.width, player.frameY * player.height, player.width, player.height,
        player.x, player.y, player.width, player.height);
    if ((moveLeft || moveRight) || (moveDown || moveUp) && !( moveLeft && moveRight)) {
        player.frameX += 1;
        if (player.frameX > 2) {
            player.frameX = 0;
        }
    }
    for (let z of zombies) { 
        if (player_collides(z)) {
            z.frameY = 1;
            z.frameX = 0;
            stop("Game Over"); 
            return;
        }
    }
    for (let z of zombies) {
        if (z.x + z.size < 0) {
            z.x = canvas.width;
            z.y = randint(0 , canvas.height);
        } else {
        z.x = z.x + z.xChange;
        z.y = z.y + z.yChange;
        }
    }

    context.fillStyle = "yellow";
    for (let k of keys) {
        context.drawImage(IMAGES.keys,
            k.frameX * k.width, k.frameY * k.height, k.width, k.height,
            k.x, k.y, k.width, k.height);
            k.frameX += 1;
        if (k.frameX > 10) {
            k.frameX = 0;
        }
    }

    if (keys.length < 1) { 
        let k = {
            x : randint(0,canvas.width - 32),
            y : randint(0,floor),
            height: 32,
            width: 32,
            frameX : 0,
            frameY : 0,
            size : 32, 
            xChange : 0,
            yChange : 0 
        };
        keys.push(k);
    }
    

    for (let k of keys) {
        if (k.x + k.size < 0) {
            k.x = canvas.width;
            k.y = randint(0 , canvas.height);
        } else {
        k.x = k.x + k.xChange;
        k.y = k.y + k.yChange;
        }
    }

    for (let k of keys) { 
        if (player_collides(k)) { 
            score = score + 1;

            let data = new FormData();
            data.append("score", score);

            xhttp = new XMLHttpRequest();
            xhttp.addEventListener("readystatechange", handle_response, false);
            xhttp.open("POST", "/store_score", true);
            xhttp.send(data);
            

            k.frameY = 1;
            k.frameX = 0;
            keys.length = keys.length - 1;
            key_sound.play();
            return;
        }
    }
    
    for (let t of trees) {
        context.drawImage(IMAGES.trees,
            t.frameX * t.width, t.frameY * t.height, t.width, t.height,
            t.x, t.y, t.width, t.height);
    }

    if (trees.length < 6) { 
        let t = {
            x : randint(0,canvas.width),
            y : randint(0, 422),
            height: 180,
            width: 180,
            frameX : 0,
            frameY : 0,
            size : 180,
            xChange : 0, 
            yChange : 0 
        };
        trees.push(t);
    }
    

    for (let t of trees) {
        if (t.x + t.size < 0) {
            t.x = canvas.width;
            t.y = randint(0 , canvas.height);
        } else {
        t.x = t.x + t.xChange;
        t.y = t.y + t.yChange;
        }
    }

    for (let h of houses) {
        context.drawImage(IMAGES.houses,
            h.frameX * h.width, h.frameY * h.height, h.width, h.height,
            h.x, h.y, h.width, h.height);
        
    }

    if (houses.length < 1) { 
        let h = {
            x : 780,
            y : 390,
            height: 360,
            width: 360,
            frameX : 0,
            frameY : 0,
            size : 360, 
            xChange : 0, 
            yChange : 0 
        };
        houses.push(h);
    }

    for (let h of houses) {
        if (h.x + h.size < 0) {
            h.x = canvas.width;
            h.y = randint(0 , canvas.height);
        } else {
        h.x = h.x + h.xChange;
        h.y = h.y + h.yChange;
        }
    }

    if (moveLeft) {
        player.xChange = player.xChange - 0.75; 
        player.frameY = 1 ;

    }
    if (moveRight) {
        player.xChange = player.xChange + 0.75;
        player.frameY = 2;
    }
    
    if (moveUp) {
        player.yChange = player.yChange - 0.75;
        player.frameY = 3;
        
    }
    if (moveDown) {
        player.yChange += 0.75; 
        player.frameY = 0;
    }
       
    player.x = player.x + player.xChange;
    player.y = player.y + player.yChange;

    // Physics
    player.xChange = player.xChange * 0.9; 
    player.yChange = player.yChange * 0.9; 

    // Collisions
    if (player.y + player.height > floor) {
        player.y = floor - player.height;
        player.yChange = 0;
    }
    
    // Going off left or right
    if (player.x + player.width < 0) {
        player.x = canvas.width; // puts you on the other side of the canvas
    } else if (player.x > canvas.width) {
        player.x = -player.width;
    }
    if (player.y + player.height < 0) {
        player.y = canvas.height; // puts you on the other side of the canvas
    } else if (player.y > canvas.height) {
        player.y = -player.height;
    }
    
    show_score();

}


function randint(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function activate(event) {
    let key = event.key;
    if (key === "ArrowLeft") {
        moveLeft = true;
    } else if (key === "ArrowUp") {
        moveUp = true;
    } else if (key === "ArrowRight") {
        moveRight = true;
    } else if (key === "ArrowDown") {
        moveDown = true;
    } // else if (event.keyCode === 32) {
    //     jump = true;
    // }
}

function deactivate(event) {
    let key = event.key;
    if (key === "ArrowLeft") {
        moveLeft = false;
    } else if (key === "ArrowUp") {
        moveUp = false;
    } else if (key === "ArrowRight") {
        moveRight = false;
    } else if (key === "ArrowDown") {
        moveDown = false;
    } // else if (event.keyCode === 32) {
        //jump = false;
    // }
}

function player_collides(z) { 
    if (player.x + player.height < z.x ||
        z.x + z.size < player.x ||
        player.y > z.y + z.size ||
        z.y > player.y + player.height) {
        return false;
    } else {
        return true;
    }
}

function load_images(callback) {
    let num_images = Object.keys(IMAGES).length;
    let loaded = function() {
        num_images = num_images - 1;
        if (num_images === 0) {
            callback();
        }
    };
    for (let name of Object.keys(IMAGES)) {
        let img = new Image();
        img.addEventListener("load", loaded, false);
        img.src = IMAGES[name];
        IMAGES[name] = img;
    }
}

function stop(message) {
    // can tell user if they won or lost
    window.removeEventListener("keydown", activate, false); 
    window.removeEventListener("keyUp", deactivate, false);
    window.cancelAnimationFrame(request_id); // kills animation
    let outcome_element = document.querySelector("#outcome") // ID
    outcome_element.innerHTML = message;
}

function handle_response() {
    if ( xhttp.readyState === 4 ) {
        if ( xhttp.status === 200 ) {
            if ( xhttp.responseText === "success" ) {
            } else {
                // score was unsuccessful
            }
        }
    }
}