let game;
function main(){
    game = new Game("canvas");
    game.start();
}


class Game{
    constructor(idCanvas) {
        this.idCanvas = idCanvas;
        this.doc = document.getElementById(this.idCanvas);
        this.rect = this.doc.getBoundingClientRect();
        this.ctx = this.doc.getContext("2d");
        this.doc.width = window.screen.width - 30;
        this.doc.height = window.screen.height - 170;
        this.width = this.doc.width;
        this.height = this.doc.height;
        this.fps = 1/120;
        this.dt = this.fps * 1000;
        this.players = [];
        this.goals = [];
        this.ball = null;
        this.time = 5;
        this.timer = null;
        this.posp1={x:70,y:0};
        this.posp2={x:(this.width/8)*7,y:0};
        this.posb = {x: this.width/2, y: 200};
        this.g = 1;
        this.ag = 9.81;
        this.loop = null;
        this.players.push(new Player(this,this.posp1.x, this.posp1.y, 183, 50, 0.2, 78, 0.005, "../gettyimages-1350908003-594x594-removebg-preview.png","arrows", "rgb(" + 0 + "," + 255 + "," + 0 + ")"))
        this.players.push(new Player(this,this.posp2.x, this.posp2.y, 183, 50, 0.2, 78, 0.005, "../imago0019901674s-removebg-preview.png","wasd", "rgb(" + 0 + "," + 0 + "," + 255 + ")"));
        this.ball = new Ball(this,this.posb.x, this.posb.y, 40, 0.7, 0.45, 0.08, "rgb(" + 0 + "," + 0 + "," + 0 + ")");
        this.goals.push(new Goal(this, 0, this.height/2 , this.height/2,this.width/16, "rgb(" + 230 + "," + 0 + "," + 0 + ")"));
        this.goals.push(new Goal(this, this.width-this.width/16, this.height/2 , this.height/2,this.width/16, "rgb(" + 200 + "," + 240 + "," + 0 + ")"));
    }

    start() {
        console.log('Canvas size: ' + this.width + ' / ' + this.height);
        let player1 = this.players[1];
        let player2 = this.players[0];
        window.addEventListener("keydown", function (event){
            console.log(event.key)
            if (event.defaultPrevented) {
                return;
            }
            switch (event.key) {
                case "ArrowUp":
                    if(!player1.jumping) {
                        player1.jumpcounter  = 0;
                        player1.jumping = true;
                    }
                    break;
                case "ArrowLeft":
                    player1.controlVelocity.x = -6;
                    break;
                case "ArrowRight":
                    player1.controlVelocity.x = 6;
                    break;
                case "w":
                    if(!player2.jumping) {
                        player2.jumpcounter  = 0;
                        player2.jumping = true;
                    }
                    break;
                case "a":
                    player2.controlVelocity.x = -6;
                    break;
                case "d":
                    player2.controlVelocity.x = 6;
                    break;
                default:
                    return;
            }
            event.preventDefault();
        }, true);
        window.addEventListener("keyup", function (event) {
            switch (event.key) {
                case "ArrowLeft":
                    player1.controlVelocity.x = 0;
                    break;
                case "ArrowRight":
                    player1.controlVelocity.x = 0;
                    break;
                case "a":
                    player2.controlVelocity.x = 0;
                    break;
                case "d":
                    player2.controlVelocity.x = 0;
                    break;
                default:
                    return;
            }
            event.preventDefault();
        }, false);

        this.loop = setInterval(() => this.gameLoop(), this.dt);

        this.timer = setInterval(function() {
            if(game.time>0) {
                game.time--;
            }
            else{
                game.gameOver();
            }
        }, 1000);
    }

    gameLoop(){
        const ctx = this.ctx;
        ctx.clearRect(0,0,this.width, this.height);
        ctx.font = "50px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(this.time, this.width / 2, 60);

        for (let i = 0; i < this.players.length; i++) {
            this.players[i].repaint();
        }
        for (let i = 0; i < this.goals.length; i++) {
            this.goals[i].repaint();
        }
        this.ball.repaint();
    }

    startPosition(){
        console.log("restart");
        this.players[1].position = {x:(this.width/8)*7,y:0};
        this.players[0].position = {x: 70, y: 0};
        this.ball.position = {x: this.width/2, y: 200};
        this.ball.velocity = {x:0,y:0};
    }

    gameOver(){
        clearInterval(this.loop);
        clearInterval(this.timer);
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.font = "100px Arial";
        ctx.beginPath();
        ctx.fillStyle = "rgb(" + 255 + "," + 255 + "," + 255 + "," + 0 +")";
        ctx.rect(0,0,this.width,this.height);
        ctx.fill();
        ctx.closePath();
        let winnerimage = new Image();
        let winner;
        let goals1 = this.goals[1].goal;
        let goals2 = this.goals[0].goal;
        let scoreend;

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
        winnerimage.onload = function() {
            ctx.drawImage(winnerimage, this.width/2 + 600, 300);
        };
        ctx.fillText(winner, this.width / 2 - winner.length * 25, this.height / 2 -350);
        ctx.font = "50px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("     Score", this.width / 2 - "Score".length * 25, this.height /2 -250);
        scoreend = goals2 +":"+goals1;
        ctx.fillText("    "+scoreend, this.width / 2 - scoreend.length * 25 , this.height /2 -200);

    }
}


class Goal{
    constructor(game, x, y, height, width, colour) {
        this.game = game;
        this.position = {x: x, y: y}; //m
        this.height = height;
        this.width = width;
        this.colour = colour;
        this.goal = 0;
    }

    repaint(){
        const ctx = this.game.ctx;
        ctx.beginPath();
        ctx.fillStyle = this.colour;
        ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
        ctx.fill();
        ctx.font = "50px Arial";
        ctx.fillStyle = "black";
        ctx.fillText(this.goal, this.position.x+this.width/2, this.position.y-50);
        ctx.closePath();
    }

    addGoal(){
        this.goal ++;
    }
}


class Ball{
    constructor(game, x, y, radius, e, mass, density, color) {
        this.game = game;
        this.position = {x: x, y: y}; //m
        this.velocity = {x: 0, y: 0}; // m/s
        this.e = -e;
        this.mass = mass;
        this.radius = radius;
        this.height = radius;
        this.drag = 0.45;
        this.width = radius;
        this.density = density;
        this.color = color;
        this.image = "../football-161132__340.webp"
        this.area = (Math.PI * radius * radius) / 10000;
        this.physics = new Physics(this.game, this)
    }
    repaint(){
        this.calcNewPosition();
        this.pressball();
        const ctx = this.game.ctx;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.closePath();
    }

    pressball(){

        let player1;
        let player2;
        if(this.game.players[0].position.x<this.game.players[1].position.x) {

            player1 = this.game.players[0];
            player2 = this.game.players[1];
        }
        else{
               player1 = this.game.players[1];
            player2 = this.game.players[0];
        }

            if ((player1.position.x + player1.width) - player2.position.x > (-2) * (this.radius)&& this.position.x > (player1.position.x + player1.width) &&  this.position.x< player2.position.x) {
              if(player1.position.y>(player2.position.y)){this.position.y = player1.position.y-100;}
                if(player1.position.y<=(player2.position.y)){this.position.y = player2.position.y-100; }
                this.velocity.x= 0;

            }


    }

    calcNewPosition(){
        this.physics.object = this;
        this.physics.calcNewPosition();
        this.collisionBallWall();
        for (let i = 0; i < this.game.players.length; i++) {
            this.collisionBallPlayer(this.game.players[i]);
        }
    }

    collisionBallWall() {
        if (this.position.x > this.game.width - this.width) {
            this.velocity.x *= this.e;
            this.position.x = this.game.width - this.width;
        }
        if (this.position.y > this.game.height - this.height) {
            this.velocity.y *= this.e;
            this.position.y = this.game.height - this.height;
        }
        for (let j = 0; j < this.game.goals.length; j++) {
            if (this.ballingoal(this.game.goals[j])) {
                if(j === 1) this.game.goals[0].addGoal();
                else this.game.goals[1].addGoal();
                this.game.startPosition();
            }
        }

        if (this.position.x < 0) {
            this.velocity.x *= this.e;
            this.position.x = 0;
        }
        if (this.position.y < this.height) {
            this.velocity.y *= this.e;
            this.position.y = this.height;
        }
    }

    collisionBallPlayer(player) {
        if (((this.position.x + this.radius <= player.position.x + player.width && this.position.x + this.radius >= player.position.x) || (this.position.x - this.radius >= player.position.x && this.position.x - this.radius <= player.position.x + player.width)) && this.position.y + this.radius >= player.position.y && player.position.y + player.height >= this.position.y - this.radius) {
            if (this.position.x - this.radius >= player.position.x && this.position.x - this.radius <= player.position.x + player.width) {
                this.velocity.x = player.velocity.x * this.e * (-4) + 3;
                this.velocity.y = player.velocity.y * this.e * (-1) - 0.5;
                this.position.x = player.position.x + player.width + this.radius;
            }
            if (this.position.x + this.radius <= player.position.x + player.width && this.position.x + this.radius >= player.position.x) {
                this.velocity.x = player.velocity.x * this.e * (-4) - 3;
                this.velocity.y = player.velocity.y * this.e * (-1) - 0.5;
                this.position.x = player.position.x - this.radius;
            }
        }

    }

    ballingoal(goal){
        return !(!(goal.position.x + goal.width - 5 >= this.game.ball.position.x - this.game.ball.radius) || !(this.game.ball.position.x + this.game.ball.radius >= goal.position.x + 5)) && (this.game.ball.position.y + this.game.ball.radius >= goal.position.y);
    }

}

class Physics{
    constructor(game, object) {
        this.game = game;
        this.object = object;
    }

    calcNewPosition(){
        let fx = -0.5 * this.object.drag * this.object.density * this.object.area * this.object.velocity.x * this.object.velocity.x * (this.object.velocity.x / Math.abs(this.object.velocity.x));
        let fy = -0.5 * this.object.drag * this.object.density * this.object.area * this.object.velocity.y * this.object.velocity.y * (this.object.velocity.y / Math.abs(this.object.velocity.y));

        fx = (isNaN(fx) ? 0 : fx);
        fy = (isNaN(fy) ? 0 : fy);
        let ax = fx / this.object.mass;
        let ay = (this.game.ag * this.game.g) + (fy / this.object.mass);

        //Calculating the ball velocity
        this.object.velocity.x += ax * this.game.fps;
        this.object.velocity.y += ay * this.game.fps;

        //Calculating the position of the ball
        this.object.position.x += this.object.velocity.x * this.game.fps*100;
        this.object.position.y += this.object.velocity.y * this.game.fps*100;
    }
}




class Player{
    constructor(game, x, y, playerHeight, playerWidth, e, mass, density, image, control, color) {
        this.game = game;
        this.position = {x: x, y: y};
        this.velocity = {x: 0, y: 0};
        this.height = playerHeight*2;
        this.width = playerWidth*3;
        this.e = -e;
        this.mass = mass;
        this.density = density;
        this.image = image;
        this.control = control;
        this.controlVelocity = {x: 0, y: 0};
        this.goals = 0;
        this.color = color;
        this.jumping = false;
        this.jumpcounter = -1;
        this.drag = 0.45;
        this.area = this.height * this.width / 10000;
        this.physics = new Physics(this.game, this);
    }

    repaint(){
        this.calcNewPosition();
        const ctx = this.game.ctx;
        ctx.beginPath();
        ctx.fillStyle = this.color;
        let img = new Image();
        img.src = this.image;
        ctx.drawImage(img,this.position.x,this.position.y,this.width,this.height);
        ctx.closePath();
    }

    calcNewPosition(){
        if(this.jumpcounter === -1){

        }
        else if(this.jumping && this.jumpcounter <= 3000 * this.game.fps){
            this.velocity.y = -8;
            this.jumpcounter ++;
        }else {
            this.jumpcounter = -1;
            this.velocity.y = 1;
        }
        this.velocity.x = this.controlVelocity.x;
        this.physics.object = this;
        this.physics.calcNewPosition();
        this.collisionPlayerWall();
    }

    collisionPlayerWall(){
        if (this.position.x > this.game.width - this.width) {
            this.velocity.x *= this.e;
            this.position.x = this.game.width - this.width;
        }
        if (this.position.y > this.game.height - this.height) {
            this.velocity.y *= this.e;
            this.position.y = this.game.height - this.height;
        }
        if (this.position.x < 0) {
            this.velocity.x *= this.e;
            this.position.x = 0;
        }
        if (this.position.y < this.height) {
            this.velocity.y *= this.e;
            this.position.y = this.height;
        }
        if (this.position.y + this.height >= this.game.height) {
            this.jumping = false;
        }
    }
}