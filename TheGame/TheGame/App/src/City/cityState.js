var city = function (game) {
    this.game = game;
}

var map;
var player;
var background;
var playerSprite;

var lastMovement;
var timeForIdle = 300;
var movementspeed;
var cursors;

city.prototype = {
    //Gets called once
    create: function () {
        console.log("City state");
        //Enable p2 physics
        this.game.physics.startSystem(Phaser.Physics.P2JS);

        //Turn on impact events. Without this line collision callback wont work
        this.game.physics.p2.setImpactEvents(true);

        //Creating collsion gruops for the player and the doors
        var playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
        var doorCollisionGroup = this.game.physics.p2.createCollisionGroup();

        //Setting up the background
        this.game.add.tileSprite(0, 0, 1080, 720, 'map');

        //creating player
        playerSprite = this.game.add.sprite(50, 300, 'player-front');
        playerSprite.scale.setTo(0.2, 0.2);
        playerSprite.smoothed = false;

        //player for PLayer model
        player = new this.Player(playerSprite);

        //Enable body
        this.game.physics.p2.enable(playerSprite, true);
        playerSprite.body.setRectangle(40, 60, 0, 0);
        playerSprite.body.fixedRotation = true;

        //creating doors to a group
        var doors = this.game.add.group();
        doors.enableBody = true;
        doors.physicsBodyType = Phaser.Physics.P2JS;

        //creating and places door
        var door = doors.create(500, 400, 'player-back');
        door.body.setRectangle(40, 60, 0, 0);
        door.body.debug = false;
        door.body.fixedRotation = true;
        door.scale.setTo(0.2, 0.2);
        door.body.immoveable = false;
        door.body.moves = false;

        //set collsion gruops to bodies and tell which to collide to
        door.body.setCollisionGroup(doorCollisionGroup);
        door.body.collides(playerCollisionGroup);

        playerSprite.body.setCollisionGroup(playerCollisionGroup);
        playerSprite.body.collides(doorCollisionGroup, this.hitDoor, this);


        // this.game.world.setBounds(0, 0, 3240, 5760);

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
    },

    //Gets called every time the canvas updates 60fps = 60 times a second
    update: function () {

        playerSprite.body.setZeroVelocity();

        //Controll movement an player inputs
        if (this.shift.isDown) {
            movementspeed = player.runSpeed;
        } else {
            movementspeed = player.walkSpeed;
        }
        if (this.rightKey.isDown) {
            player.moveRight(movementspeed);
            lastMovement = this.game.time.now;
        } else if (this.leftKey.isDown) {
            player.moveLeft(movementspeed);
            lastMovement = this.game.time.now;
        } else {
            player.sprite.body.velocity.x = 0;
        }

        if (this.upKey.isDown) {
            player.moveUp(movementspeed);
            lastMovement = this.game.time.now;
        } else if (this.downKey.isDown) {
            player.moveDown(movementspeed);
            lastMovement = this.game.time.now;
        } else {
            player.sprite.body.velocity.y = 0;
        }

        if (this.game.time.now == lastMovement + timeForIdle) {
        }
    },


    hitDoor: function (body1, body2) {
        if (!body1.hasCollided) {
            console.log("virker");
            var enterDoorlabel = this.game.add.text(400, this.game.world.height - 220, 'press e to enter door', { font: '25px Arial', fill: '#ffffff' });
            var ekey = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
            ekey.onDown.addOnce(this.shop, this);

            body1.hasCollided = true;
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
            player.sprite.body.velocity.x = movementspeed;
            if (this.lastTexture != 'player-right') {
                this.sprite.loadTexture('player-right');
            }
        };

        this.moveLeft = function (movementspeed) {
            player.sprite.body.velocity.x = -movementspeed;
            if (this.lastTexture != 'player-left') {
                this.sprite.loadTexture('player-left');
            }
        };

        this.moveDown = function (movementspeed) {
            player.sprite.body.velocity.y = +movementspeed;
            if (this.lastTexture != 'player-front') {
                this.sprite.loadTexture('player-front');
            }
        };

        this.moveUp = function (movementspeed) {
            player.sprite.body.velocity.y = -movementspeed;
            if (this.lastTexture != 'player-back') {
                this.sprite.loadTexture('player-back');
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
            if (this.lastTexture != 'player-fight-left') {
                this.sprite.loadTexture('player-fight-left');
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