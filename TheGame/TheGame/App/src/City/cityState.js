var city = function (game) {
    this.game = game;
}

var map;
var player;
var background;
var playerSprite;
var playerSprite;
var door;


var lastMovement;
var timeForIdle = 300;
var movementspeed;
var cursors;

city.prototype = {
    //Gets called once
    create: function () {
        console.log("City state");
        //Enable arcade physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //Setting up the background
        this.game.add.tileSprite(0, 0, 3240, 5760, 'map');

        this.game.world.setBounds(0, 0, 3240, 5760);

        

        playerSprite = this.game.add.sprite(100, 100, 'player-right');
        playerSprite.frame = 41;

        //Creating door
        door = this.game.add.sprite(550, 550, 'player-front');
        door.scale.setTo(0.2, 0.2);
        

        //player for PLayer model
        player = new this.Player(playerSprite);

      
        playerSprite.animations.add('left', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
        playerSprite.animations.add('right', [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41]);
        playerSprite.animations.add('none', [21]);
        playerSprite.animations.play('none', 12, false);
        this.game.physics.enable([playerSprite, door], Phaser.Physics.ARCADE);
        playerSprite.scale.setTo(0.6, 0.6);
        playerSprite.smoothed = false;
        playerSprite.body.collideWorldBounds = true;
        playerSprite.body.fixedRotation = true;

        playerSprite.body.setSize(83, 240, 120, 60);

        this.hitDoor = function () {
            console.log('Her nu');
            this.state.start('Fight');
        }


        //Camera
        this.game.camera.follow(playerSprite);

        //Controls
        cursors = this.game.input.keyboard.createCursorKeys();
        this.shift = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.fightStateKey = this.game.input.keyboard.addKey(Phaser.KeyCode.FIVE);


        this.game.debug.body(door);
        this.game.debug.body(playerSprite);
    },

    //Gets called every time the canvas updates 60fps = 60 times a second
    update: function () {

        //playerSprite.body.setZeroVelocity();

        this.game.physics.arcade.overlap(playerSprite, door, this.hitDoor.bind(this));

        //Controll movement an player inputs
        if (this.shift.isDown) {
            movementspeed = player.runSpeed;
        } else {
            movementspeed = player.walkSpeed;
        }
        if (this.rightKey.isDown) {
            playerSprite.body.velocity.x = movementspeed;
            lastMovement = this.game.time.now;
            if (playerSprite.animations.name != 'right') {
                playerSprite.frame = 0;
                playerSprite.animations.play('right', 12, true);
            }
        } else if (this.leftKey.isDown) {
            playerSprite.body.velocity.x = -movementspeed;
            lastMovement = this.game.time.now;
            playerSprite.animations.play('left', 12, true);
        } else {
            player.sprite.body.velocity.x = 0;
            playerSprite.animations.play('none', 1, true);
        }

        if (this.upKey.isDown) {
            playerSprite.body.velocity.y = -movementspeed;
            lastMovement = this.game.time.now;
            playerSprite.animations.play('right', 12, true);
        } else if (this.downKey.isDown) {
            playerSprite.body.velocity.y = +movementspeed;
            lastMovement = this.game.time.now;
            playerSprite.animations.play('right', 12, true);
        } else {
            playerSprite.body.velocity.y = 0;
        }

        if (this.game.time.now == lastMovement + timeForIdle) {
        }
    },

    Player: function (sprite) {
        this.walkSpeed = 300;
        this.runSpeed = 400;
        this.sprite = sprite;
        this.lastTexture = "";
        this.health = 100;
        this.maxHealth = 100;

        this.moveRight = function (movementspeed) {
            
            
        };

        this.moveLeft = function (movementspeed) {
            player.sprite.body.velocity.x = -movementspeed;
            if (this.lastTexture != 'player-right') {
                this.sprite.loadTexture('player-right');
            }
        };

        this.moveDown = function (movementspeed) {
            player.sprite.body.velocity.y = +movementspeed;
            if (this.lastTexture != 'player-right') {
                this.sprite.loadTexture('player-right');
            }
        };

        this.moveUp = function (movementspeed) {
            player.sprite.body.velocity.y = -movementspeed;
            if (this.lastTexture != 'player-right') {
                this.sprite.loadTexture('player-right');
            }
        };

        this.fightMoveRight = function () {
            player.sprite.body.velocity.x = 300;
            if (this.lastTexture != 'player-fight-right') {
                this.sprite.loadTexture('player-fight-right');
            }
        };

        this.fightMoveLeft = function () {
            player.sprite.body.velocity.x = -300;
            if (this.lastTexture != 'player-fight-right') {
                this.sprite.loadTexture('player-fight-right');
            }
        };

        this.fightJump = function () {
            player.sprite.body.y = player.sprite.body.y - 50;
        };
    },
    shop: function () {
        this.state.start('Shop');
    }
}