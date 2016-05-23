var fight = function (game) {
    this.game = game;
}

var cursors;

var player;
var number;

var enemy;


var backgroundGroup;
var mainGroup;
var UIGroup;

var walkRightAnimation = 'WalkRight';
var walkLeftAnimation = 'WalkLeft';
var jumpAnimation = 'Jump';
var duck = 'Duck';

fight.prototype = {
    preload: function () {
        //Controll witch enemy number
        number = 1;
        //Loads the arena/background
        this.load.image('arena-' + number, 'App/assets/fighting/arenas/arena-' + number + '.png');
        //load enemy
        this.game.load.spritesheet('enemy' + number, 'App/assets/fighting/enemy/enemy-' + number + '/enemy-' + number + '.png', 480, 550);
        this.load.image('enemy' + number + 'bullet', 'App/assets/fighting/enemy/enemy-' + number + '/enemy-' + number + '-projectile.png');
        this.load.image('enemy' + number + 'portrait', 'App/assets/fighting/enemy/enemy-' + number + '/enemy-' + number + '-portrait.png');

        //Loads player sprite sheet
        this.game.load.spritesheet('playerspritesheet', 'App/assets/player/skeleton-animation-right.png', 480, 550);

        //Load player portrait
        this.load.image('playerportrait', 'App/assets/fighting/player/char_portrait.png');



    },
    create: function () {
        //Setup the needed groups
        backgroundGroup = this.game.add.group();
        mainGroup = this.game.add.group();
        UIGroup = this.game.add.group();

        //Setup background image
        var background = this.game.add.tileSprite(0, 0, 1080, 720, 'arena-' + number);
        backgroundGroup.add(background);
        //background.sacle.set(0);

        //Create player sprite
        player = this.game.add.sprite(80, 600, 'playerspritesheet');
        player.frame = 8;
        player.anchor.set(0.5);
        mainGroup.add(player);

        //Create player animations 
        player.animations.add(walkRightAnimation, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
        player.animations.add(walkLeftAnimation, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
        player.animations.add('none', [8]);
        player.animations.play('none', 1, true);

        //Physics 
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.gravity.y = 1800;

        //Setup player portrait
        var playerportrait = this.game.add.sprite(0, 10, 'playerportrait');
        playerportrait.anchor.set(0, 0);
        playerportrait.scale.set(0.5);

        //Collision Groups
        this.enemyCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.game.physics.p2.updateBoundsCollisionGroup();

        //Setup the enemy
        enemy = this.game.add.sprite(950, 490, 'enemy' + number);
        enemy.anchor.set(0.5, 1);
        enemy.scale.set(1);
        mainGroup.add(enemy);

        //Setup enemy bullets
        this.bullets = this.game.add.group();
        this.nextEnemyFire = 0;

        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.P2;
        this.bullets.createMultiple(50, 'enemy' + number + 'bullet');
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);

        //Setup enemy portrait
        var enemyportrait = this.game.add.sprite(1080, 0, 'enemy' + number + 'portrait');
        enemyportrait.anchor.set(1, 0);
        UIGroup.add(enemyportrait);
        enemyportrait.scale.set(0.5);

        //Enable physics for sprites
        this.game.physics.p2.enable([enemy, player]);

        //Enemy physics   
        enemy.body.fixedRotation = true;

        //Enemy physics debug and hitbox
        //enemy.body.debug = true;
        enemy.body.clearShapes();
        enemy.body.addRectangle(210, 460, 10, 0);
        enemy.body.setCollisionGroup(this.enemyCollisionGroup);
        enemy.body.collides(this.playerCollisionGroup);

        //Player physics debug and hitbox
        //player.body.debug = true;
        player.body.clearShapes();
        player.body.addRectangle(70, 180, 15, -20);
        player.body.fixedRotation = true;
        player.body.setCollisionGroup(this.playerCollisionGroup);
        player.body.collides(this.enemyCollisionGroup);
        

        //Controls
        cursors = this.game.input.keyboard.createCursorKeys();
        this.shift = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    },
    update: function() {
        if (this.rightKey.isDown) {
            if (player.animations.name != walkRightAnimation) {
                player.frame = 0;
                player.animations.play(walkRightAnimation, 12, true);
            }
            player.body.velocity.x = 200;
        }
        else if (this.leftKey.isDown) {
            player.body.velocity.x = -200;
            player.animations.play(walkLeftAnimation, 12, true);
        } else {
            player.body.velocity.x = 0;
            player.animations.play('none');
        }

        if (this.upKey.isDown) {
            player.body.moveUp(700);
        }
        else if (this.downKey.isDown) {
            
        }

        if (cursors.left.isDown) {
            enemy.body.velocity.x = -100;
        }
        else if (cursors.right.isDown) {
            enemy.body.velocity.x = 100;
        } else {
            enemy.body.velocity.x = 0;
        }

        if (cursors.down.isDown) {
            this.enemyFire();
        }
    },

    enemyFire: function () {

        if (this.game.time.now > this.nextEnemyFire && this.bullets.countDead() > 0) {

            var bullet = this.bullets.getFirstExists(false);
            var angle = this.game.math.angleBetweenPoints(enemy.position, player.position);

            if (bullet) {
                this.game.physics.p2.enable(bullet);
                bullet.reset(enemy.x - 180, enemy.y - 20);

                this.nextEnemyFire = this.game.time.now + 1200;

                bullet.body.setCollisionGroup(this.enemyCollisionGroup);
                bullet.body.clearShapes();
                bullet.body.addRectangle(18, 18, 137, -14);
                bullet.body.velocity.x = 500 * Math.cos(angle);
                bullet.body.velocity.y = 500 * Math.sin(angle);
                bullet.rotation = angle + 1.58;
                bullet.body.fixedRotation = true;
                bullet.body.data.gravityScale = 0;
                bullet.body.allowGravity = false;

                //bullet.body.debug = true;
                //bullet.body.collides(this.playerCollisionGroup);
                //console.log(bullet.body.collidesWith);

            }
        }
    },

    playerHit: function() {
        console.log("HIT");
    }
}