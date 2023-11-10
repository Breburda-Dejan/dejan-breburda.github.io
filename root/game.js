function Ball(x, y, radius, e, mass, density, colour){
    this.position = {x: x, y: y}; //m
    this.velocity = {x: 0, y: 0}; // m/s
    this.e = -e; // has no units
    this.mass = mass; //kg
    this.radius = radius; //m
    this.height = radius;
    this.width = radius;
    this.density = density;
    this.colour = colour;
    this.area = (Math.PI * radius * radius) / 10000; //m^2
}
function Goal(x, y, height, width, colour){
    this.position = {x: x, y: y}; //m
    this.height = height;
    this.width = width;
    this.colour = colour;

}

function Player(x, y, pheight, pwidth, e, mass, density, src, control,goals, colour){
    this.position = {x: x, y: y};
    this.velocity = {x: 0, y: 0};
    this.e = -e;
    this.mass = mass;
    this.height = pheight * 2;
    this.width = pwidth * 3;
    this.density = density;
    this.colour = colour;
    this.area = this.height * this.width / 10000; //m^2
    this.radius = this.height;
    this.control = control;
    this.img = src;
    this.goals = goals;
}

let canvas = null;
let ctx = null;
let fps = 1/120;
let dt = fps * 1000;
let timer = false;
let mouse = {x: 0, y:0, isDown: false};
let ag = 9.81;
let width = 0;
let height = 0;
let balls = [];
let player = [];
let goals = [];
let arrowscounter = 0;
let wasdcounter = 0;
let arrows = {velocity:{x:0,y:0},jump:false};
let wasd = {velocity:{x:0,y:0},jump:false};
let score = 50;

let goals1 = 0;
let goals2 = 0;




let checkgameover =0;

function setup() {
    canvas = document.getElementById('canvas');
    canvas.width = window.screen.width - 30; //document.width is obsolete
    canvas.height = window.screen.height - 170; //document.height is obsolete

    ctx = canvas.getContext('2d');

    document.getElementById("title").style.display = "none";
    document.getElementById("startButton").style.display = "none";

    document.body.style.backgroundImage = "none";

    width = canvas.width;
    height = canvas.height;
    balls.push(new Ball(width/2, 200, 40, 0.7, 0.45, 0.08, "rgb(" + 0 + "," + 0 + "," + 0 + ")"));
    player.push(new Player(70, 0, 183, 50, 0.2, 78, 0.002, "../gettyimages-1350908003-594x594-removebg-preview.png","wasd", goals1,"rgb(" + 0 + "," + 255 + "," + 0 + ")"));
    player.push(new Player((width/8)*7, 0, 183, 50, 0.2, 78, 0.002, "../imago0019901674s-removebg-preview.png","arrows",goals2, "rgb(" + 0 + "," + 0 + "," + 255 + ")"));
    goals.push(new Goal(0, height/2 , height/2,width/16, "rgb(" + 230 + "," + 0 + "," + 0 + ")"));
    goals.push(new Goal(width-width/16, height/2 , height/2,width/16, "rgb(" + 200 + "," + 240 + "," + 0 + ")"));

    canvas.onmousemove = getMousePosition
    looptimer = setInterval(loop, dt);
    console.log("Setup Done");


    //Timer
    timer = setInterval(function() {
        if(score>0) {
            score--;
            console.log(score);
        }
        else{
            checkgameover++;
            console.log(checkgameover);
        }
    }, 1000);

}

function chill(){
}

window.addEventListener("keydown", function (event) {
    console.log(event.key)
    if (event.defaultPrevented) {
        return;
    }
    switch (event.key) {
        case "ArrowUp":
            if(!arrows.jump) {
                arrowscounter  = 0;
                arrows.jump = true;
            }
            break;
        case "ArrowLeft":
            arrows.velocity.x = -6;
            break;
        case "ArrowRight":
            arrows.velocity.x = 6;
            break;
        case "w":
            if(!wasd.jump) {
                wasdcounter    = 0;
                wasd.jump = true;
            }
            break;
        case "a":
            wasd.velocity.x = -6;
            break;
        case "d":
            wasd.velocity.x = 6;
            break;
        default:
            return;
    }
    event.preventDefault();
}, true);

window.addEventListener("keyup", function (event) {
    switch (event.key) {
        case "ArrowLeft":
            arrows.velocity.x = 0;
            break;
        case "ArrowRight":
            arrows.velocity.x = 0;
            break;
        case "a":
            wasd.velocity.x = 0;
            break;
        case "d":
            wasd.velocity.x = 0;
            break;
        default:
            return;
    }
    event.preventDefault();
}, false);

function getMousePosition(e){
    mouse.x = e.pageX - canvas.offsetLeft;
    mouse.y = e.pageY - canvas.offsetTop;
}

function loop() {
    //create constants
    let gravity = 1;
    let density;
    let drag = 0.45;


    //Clear window at the begining of every frame
    ctx.clearRect(0, 0, width, height);
    ctx.font = "50px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(score, width / 2, 60);
    ctx.font = "35px Arial";
    ctx.fillText(goals1, goals[1].position.x-600+goals[1].width, goals[1].position.y-300);
    ctx.fillText(goals2, goals[0].position.x+600, goals[0].position.y-300);

    if(checkgameover<1) {
        for (let i = 0; i < balls.length; i++) {
            density = balls[i].density;
            //physics - calculating the aerodynamic forces to drag
            // -0.5 * Cd * A * v^2 * rho
            let fx = -0.5 * drag * density * balls[i].area * balls[i].velocity.x * balls[i].velocity.x * (balls[i].velocity.x / Math.abs(balls[i].velocity.x));
            let fy = -0.5 * drag * density * balls[i].area * balls[i].velocity.y * balls[i].velocity.y * (balls[i].velocity.y / Math.abs(balls[i].velocity.y));

            for (let i = 0; i < goals.length; i++) {
                ctx.beginPath();
                ctx.fillStyle = goals[i].colour;
                ctx.fillRect(goals[i].position.x, goals[i].position.y, goals[i].width, goals[i].height);
                ctx.fill();
                ctx.closePath();
            }

            for (let i = 0; i < balls.length; i++) {
                density = balls[i].density;
                //physics - calculating the aerodynamic forces to drag
                // -0.5 * Cd * A * v^2 * rho
                let fx = -0.5 * drag * density * balls[i].area * balls[i].velocity.x * balls[i].velocity.x * (balls[i].velocity.x / Math.abs(balls[i].velocity.x));
                let fy = -0.5 * drag * density * balls[i].area * balls[i].velocity.y * balls[i].velocity.y * (balls[i].velocity.y / Math.abs(balls[i].velocity.y));

                fx = (isNaN(fx) ? 0 : fx);
                fy = (isNaN(fy) ? 0 : fy);
                //Calculating the accleration of the ball
                //F = ma or a = F/m
                let ax = fx / balls[i].mass;
                let ay = (ag * gravity) + (fy / balls[i].mass);

                //Calculating the ball velocity
                balls[i].velocity.x += ax * fps;
                balls[i].velocity.y += ay * fps;

                //Calculating the position of the ball
                balls[i].position.x += balls[i].velocity.x * fps * 100;
                balls[i].position.y += balls[i].velocity.y * fps * 100;

                //Rendering the ball
                ctx.beginPath();
                ctx.fillStyle = balls[i].colour;
                ctx.arc(balls[i].position.x, balls[i].position.y, balls[i].radius, 0, 2 * Math.PI, true);
                ctx.fill();
                ctx.closePath();
                collisionBallWall(balls[0]);

            }

            for (let i = 0; i < player.length; i++) {
                if (!mouse.isDown || i != player.length - 1) {

                    if (player[i].control == "arrows") {
                        if (arrowscounter == -1) {
                            chill;
                        } else if (arrows.jump && arrowscounter <= 3000 * fps) {
                            player[i].velocity.y = -8;
                            arrowscounter++;
                        } else {
                            arrowscounter = -1;
                            player[i].velocity.y = 1;
                        }
                        player[i].velocity.x = arrows.velocity.x;
                    } else if (player[i].control == "wasd") {
                        if (wasdcounter == -1) {
                            chill;
                        } else if (wasd.jump && wasdcounter <= 3000 * fps) {
                            player[i].velocity.y = -8;
                            wasdcounter++;
                        } else {
                            wasdcounter = -1;
                            player[i].velocity.y = 1;
                        }
                        player[i].velocity.x = wasd.velocity.x;
                    }

                    density = player[i].density;
                    // -0.5 * Cd * A * v^2 * rho
                    let fx = -0.5 * drag * density * player[i].area * player[i].velocity.x * player[i].velocity.x * (player[i].velocity.x / Math.abs(player[i].velocity.x));
                    let fy = -0.5 * drag * density * player[i].area * player[i].velocity.y * player[i].velocity.y * (player[i].velocity.y / Math.abs(player[i].velocity.y));

                    fx = (isNaN(fx) ? 0 : fx);
                    fy = (isNaN(fy) ? 0 : fy);
                    //Calculating the accleration of the ball
                    //F = ma or a = F/m
                    let ax = fx / player[i].mass;
                    let ay = (ag * gravity) + (fy / player[i].mass);

                    //Calculating the ball velocity
                    player[i].velocity.x += ax * fps;
                    player[i].velocity.y += ay * fps;

                    //Calculating the position of the ball
                    player[i].position.x += player[i].velocity.x * fps * 100;
                    player[i].position.y += player[i].velocity.y * fps * 100;
                }

                //Rendering the Player
                ctx.beginPath();
                ctx.fillStyle = player[i].colour;
                let img = new Image();
                img.src = player[i].img;
                ctx.drawImage(img,player[i].position.x,player[i].position.y,player[i].width,player[i].height);
                ctx.fill();

                ctx.closePath();

                collisionPlayerWall(player[i]);
                collisionBallPlayer(player[i]);
            }

            function collisionPlayerWall(object) {
                width = canvas.width;
                height = canvas.height;
                if (object.position.x > width - object.width) {
                    object.velocity.x *= object.e;
                    object.position.x = width - object.width;
                }
                if (object.position.y > height - object.height) {
                    object.velocity.y *= object.e;
                    object.position.y = height - object.height;
                }
                if (object.position.x < 0) {
                    object.velocity.x *= object.e;
                    object.position.x = 0;
                }
                if (object.position.y < object.height) {
                    object.velocity.y *= object.e;
                    object.position.y = object.height;
                }
                if (object.position.y + object.height >= height) {
                    if (object.control === "arrows") {
                        arrows.jump = false;
                    } else if (object.control === "wasd") {
                        wasd.jump = false;
                    }
                }
            }

            function ballingoal(ball, goal) {
                return !(!(goal.position.x + goal.width - 5 >= ball.position.x - ball.radius) || !(ball.position.x + ball.radius >= goal.position.x + 5)) && (ball.position.y + ball.radius >= goal.position.y);
            }

            function collisionBallWall(object) {
                width = canvas.width;
                height = canvas.height;
                if (object.position.x > width - object.width) {
                    object.velocity.x *= object.e;
                    object.position.x = width - object.width;
                }
                if (object.position.y > height - object.height) {
                    object.velocity.y *= object.e;
                    object.position.y = height - object.height;
                }
                for (let j = 0; j < goals.length; j++) {
                    if (ballingoal(object, goals[j])) {
                        switch (j) {
                            case 0:
                                goals1 += 1;

                                break;
                            case 1:
                                goals2 += 1;

                                break;
                        }
                        player = [];
                        balls = [];
                        goals = [];
                        arrows = {velocity: {x: 0, y: 0}, jump: false};
                        wasd = {velocity: {x: 0, y: 0}, jump: false};
                        clearInterval(looptimer);
                        clearInterval(timer);
                        setup();
                    }
                }
                if (object.position.x < 0) {
                    object.velocity.x *= object.e;
                    object.position.x = 0;
                }
                if (object.position.y < object.height) {
                    object.velocity.y *= object.e;
                    object.position.y = object.height;
                }
            }

            function collisionBallPlayer(player) {
                for (let i = 0; i < balls.length; i++) {
                    ball = balls[i];
                    if (((ball.position.x + ball.radius <= player.position.x + player.width && ball.position.x + ball.radius >= player.position.x) || (ball.position.x - ball.radius >= player.position.x && ball.position.x - ball.radius <= player.position.x + player.width)) && ball.position.y + ball.radius >= player.position.y && player.position.y + player.height >= ball.position.y - ball.radius) {
                        if (ball.position.x - ball.radius >= player.position.x && ball.position.x - ball.radius <= player.position.x + player.width) {
                            ball.velocity.x = player.velocity.x * ball.e * (-4) + 3;
                            ball.velocity.y = player.velocity.y * ball.e * (-1) - 0.5;
                            ball.position.x = player.position.x + player.width + ball.radius;
                        }
                        if (ball.position.x + ball.radius <= player.position.x + player.width && ball.position.x + ball.radius >= player.position.x) {
                            ball.velocity.x = player.velocity.x * ball.e * (-4) - 3;
                            ball.velocity.y = player.velocity.y * ball.e * (-1) - 0.5;
                            ball.position.x = player.position.x - ball.radius;
                        }
                    }
                }
            }
        }
    }
    else {

        ctx.clearRect(0, 0, width, height);
        ctx.font = "100px Arial";
        ctx.beginPath();
        ctx.fillStyle = "rgb(" + 255 + "," + 255 + "," + 255 + "," + 1 +")";
        ctx.rect(0,0,width,height);
        ctx.fill();
        ctx.closePath();
        let winnerimage = new Image();
        winnerimage.src = "";


        // "rgb(" + 0 + "," + 0 + "," + 0 + ")"

        if (goals1 > goals2) {
            ctx.fillStyle = "rgb(" + 255 + "," + 255 + "," + 0 + "," + 0.7 +")";
            winner = "Messi won";
            winnerimage.src = "../9f3e0cc2a6b6e315a4491cf02acfbaac_fdec12e0-removebg-preview.png";
        }

        else if (goals1 < goals2) {
            ctx.fillStyle = "red";
            winner = "Ronaldo won";
            winnerimage.src = "../220119103641-ronaldo-siu-celebration-removebg-preview.png";
        }
        else if (goals1 === goals2) {
            ctx.fillStyle = "black";
            winner = "Tied";
            winnerimage.src = "";
        }

        if(winnerimage !== ""){
            ctx.drawImage(winnerimage,width/2 - 140,300);
        }
        ctx.fillText(winner, width / 2 - winner.length * 25, height / 3);
        ctx.font = "50px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("     Score", width / 2 - "Score".length * 25, height /2 +50);

        scoreend = goals2 +":"+goals1;
        ctx.fillText("    "+scoreend, width / 2 - scoreend.length * 25 , height /2 +150);

    }



}