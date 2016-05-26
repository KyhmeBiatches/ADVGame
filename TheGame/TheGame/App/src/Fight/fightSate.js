var fight = function (game) {
    this.game = game;
}

var cursors;

var number;

var player;
var playerHp;

var enemy;
var enemyHp;

var fightIsActive;
var status;

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

        //Load player bullet
        var gunNumber = 1;
        this.load.image('playerbullet', 'App/assets/fighting/guns/gun' + gunNumber + '/bullet.png');

        //Load player portrait
        this.load.image('playerportrait', 'App/assets/fighting/player/char_portrait.png');

        //Load enemy sounds
        this.load.audio('enemy' + number + 'gunsound', 'App/assets/sounds/fighting/enemy-' + number + '/enemy-' + number + '-gunsound.wav');

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

        //Setup player HP;
        playerHp = 5;

        //Setup enemy HP
        enemyHp = 5;

        //Set the fight to being active
        fightIsActive = true;
        status = 'ACTIVE';

        //Create player sprite
        player = this.game.add.sprite(80, 600, 'playerspritesheet');
        player.frame = 8;
        player.anchor.set(0.5);
        mainGroup.add(player);

        //Create player animations 
        player.animations.add(walkRightAnimation, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
        player.animations.add(walkLeftAnimation, [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
        player.animations.add('none', [8]);
        player.animations.play('none', 1, true);

        //Physics 
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.gravity.y = 1800;

        //  Turn on impact events for the world, without this we get no collision callbacks
        this.game.physics.p2.setImpactEvents(true);

        //Setup player portrait
        var playerportrait = this.game.add.sprite(0, 10, 'playerportrait');
        playerportrait.anchor.set(0, 0);
        playerportrait.scale.set(0.5);

        //Collision Groups
        this.enemyCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.game.physics.p2.updateBoundsCollisionGroup();

        //Setup the enemy
        enemy = this.game.add.sprite(880, 490, 'enemy' + number);
        enemy.anchor.set(0.5, 1);
        enemy.scale.set(1);
        mainGroup.add(enemy);

        //Setup enemy bullets
        this.enemyBullets = this.game.add.group();
        this.nextEnemyFire = 0;

        this.enemyBullets.enableBody = true;
        this.enemyBullets.physicsBodyType = Phaser.Physics.P2;
        this.enemyBullets.createMultiple(50, 'enemy' + number + 'bullet');
        this.enemyBullets.setAll('checkWorldBounds', true);
        this.enemyBullets.setAll('outOfBoundsKill', true);
        this.enemyBullets.setAll('anchor.x', 0.5);
        this.enemyBullets.setAll('anchor.y', 0.5);

        //Setup player bullets
        this.playerBullets = this.game.add.group();
        this.nextPlayerFire = 0;

        this.playerBullets.enableBody = true;
        this.playerBullets.physicsBodyType = Phaser.Physics.P2;
        this.playerBullets.createMultiple(50, 'playerbullet');
        this.playerBullets.setAll('checkWorldBounds', true);
        this.playerBullets.setAll('outOfBoundsKill', true);
        this.playerBullets.setAll('anchor.x', 0.5);
        this.playerBullets.setAll('anchor.y', 0.5);

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
        

        //Player physics debug and hitbox
        //player.body.debug = true;
        player.body.clearShapes();
        player.body.addRectangle(70, 180, 15, -20);
        player.body.fixedRotation = true;
        player.body.setCollisionGroup(this.playerCollisionGroup);

        //Tell sprites to collide with collision group
        player.body.collides(this.enemyCollisionGroup);
        enemy.body.collides(this.playerCollisionGroup);
        

        //Controls
        cursors = this.game.input.keyboard.createCursorKeys();
        this.shift = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    },
    update: function () {
        //Wraped everything in fightIsActive so we are able to stop the fight when its won or lost
        if (fightIsActive) {
            if (this.rightKey.isDown) {
                if (player.animations.name != walkRightAnimation) {
                    player.frame = 0;
                    player.animations.play(walkRightAnimation, 12, true);
                }
                player.body.velocity.x = 200;
            } else if (this.leftKey.isDown) {
                player.body.velocity.x = -200;
                player.animations.play(walkLeftAnimation, 12, true);
            } else {
                player.body.velocity.x = 0;
                player.animations.play('none');
            }

            if (this.upKey.isDown) {
                player.body.moveUp(700);
            } else if (this.downKey.isDown) {

            }

            if (cursors.left.isDown) {
                enemy.body.velocity.x = -100;
            } else if (cursors.right.isDown) {
                enemy.body.velocity.x = 100;
            } else {
                enemy.body.velocity.x = 0;
            }

            if (cursors.down.isDown) {
                this.enemyFire();
            }

            //Player mouse click / shooting
            if (this.game.input.activePointer.isDown) {
                this.playerFire();
            }
            //console.log('Dead = ' + this.enemyBullets.countDead());
            //console.log('Alive = ' + this.enemyBullets.countLiving());
            this.enemyBullets.forEachExists(function (bullet) {
                if (bullet.y < 0 || bullet.x  < 0) {
                    console.log(bullet.x + " " + bullet.y);
                    bullet.destroy();
                }
            }, this);
        }

    },

    enemyFire: function () {

        if (this.game.time.now > this.nextEnemyFire && this.enemyBullets.countDead() > 0) {

            var bullet = this.enemyBullets.getFirstExists(false);
            var angle = this.game.math.angleBetweenPoints(enemy.position, player.position);

            if (bullet) {
                this.game.physics.p2.enable(bullet);
                bullet.reset(enemy.x, enemy.y - 480);

                this.nextEnemyFire = this.game.time.now + 1200;

                bullet.anchor.set(0.5);
                bullet.scale.set(3);
                
                bullet.body.clearShapes();
                bullet.body.addCircle(27, -27, 414);
                bullet.body.velocity.x = 500 * Math.cos(angle);
                bullet.body.velocity.y = 500 * Math.sin(angle);
                bullet.body.fixedRotation = true;
                bullet.body.data.gravityScale = 0;
                bullet.body.allowGravity = false;
                bullet.checkWorldBounds = true;
                bullet.outOfBoundsKill = true;
           
                this.game.sound.play('enemy' + number + 'gunsound');

                bullet.body.setCollisionGroup(this.enemyCollisionGroup);
                bullet.body.removeCollisionGroup(this.enemyCollisionGroup);
                bullet.body.collides(this.playerCollisionGroup, this.playerHit, this);
                

                bullet.body.debug = true;
            }
        }
    },

    playerFire: function() {
        if (this.game.time.now > this.nextPlayerFire && this.playerBullets.countDead() > 0) {

            var bullet = this.playerBullets.getFirstExists(false);
            var mousePoint = new Phaser.Point(this.game.input.mousePointer.x, this.game.input.mousePointer.y);
            var angle = this.game.math.angleBetweenPoints(player.position, mousePoint);

            if (bullet) {
                this.game.physics.p2.enable(bullet);

                bullet.reset(player.x, player.y - 80 );

                this.nextPlayerFire = this.game.time.now + 1200;
                bullet.anchor.set(0.5);
                bullet.body.rotation = angle;
                bullet.rotation = angle;
                bullet.scale.set(.5);

                mainGroup.add(bullet);
                bullet.body.clearShapes();
                bullet.body.addRectangle(9, 9, 0, 0);
                bullet.body.velocity.x = 500 * Math.cos(angle);
                bullet.body.velocity.y = 500 * Math.sin(angle);
                bullet.body.fixedRotation = true;
                bullet.body.data.gravityScale = 0;
                bullet.body.allowGravity = false;

                //this.game.sound.play('playergunsound');

                bullet.body.setCollisionGroup(this.playerCollisionGroup);
                bullet.body.removeCollisionGroup(this.playerCollisionGroup);
                bullet.body.collides(this.enemyCollisionGroup, this.enemyHit, this);

                bullet.body.debug = true;
            }
        }
    },

    playerHit: function (bullet) {
        bullet.sprite.destroy();
        playerHp -= 1;
        if (playerHp === 0) {
            this.playerLost();
        }
        console.log('PLAYER HP = ' + playerHp);
    },

    enemyHit: function(bullet) {
        bullet.sprite.destroy();
        enemyHp -= 1;
        if (enemyHp === 0) {
            this.playerWon();
        }
        console.log('ENEMY HP = ' + enemyHp);
    },

    playerLost: function () {
        if (status === 'ACTIVE') {
            console.log('Player LOST');
            status = 'DEFEAT';
            fightIsActive = false;
            this.drawStatusScreen();
            player.animations.play('none');
        }
    },

    playerWon: function () {
        if (status === 'ACTIVE') {
            console.log('Player WON');
            status = 'WON';
            fightIsActive = false;
            this.drawStatusScreen();
            player.animations.play('none');
        }
    },

    drawStatusScreen: function () {
        var continueBtn;
        var backgroundBitmap = this.game.add.bitmapData(this.game.width / 2, this.game.height / 2);
        backgroundBitmap.context.fillStyle = '#999999';
        backgroundBitmap.context.fillRect(0, 0, this.game.width / 2, this.game.height / 2);
        var background = this.game.add.sprite(this.game.width / 2, this.game.height / 2, backgroundBitmap);
        background.anchor.set(0.5);
        UIGroup.add(background);

        var statusText = this.game.make.text(background.x, background.y - background.height / 2 + 50, status, { font: 'Bold 50px Arial', fill: '#ffffff' });
        statusText.anchor.set(0.5);
        UIGroup.add(statusText);


        if (status === 'DEFEAT') {
            var enemyTaunt = 'You aint strong enough human!';
            var enemyDefeatText = this.game.make.text(background.x, background.y - background.height / 2 + 150, enemyTaunt, { font: 'Bold 22px Arial', fill: '#ffffff' });
            enemyDefeatText.anchor.set(0.5);
            UIGroup.add(enemyDefeatText);

            var quitBtn = this.game.add.button(background.x, background.y + 130, 'MenuQuitButton', this.quitAfterLoose, this);
            quitBtn.events.onInputOver.add(this.mouseOver, this);
            quitBtn.events.onInputOut.add(this.mouseOut, this);
            quitBtn.anchor.set(0.5);
            UIGroup.add(quitBtn);
            continueBtn = this.game.add.button(background.x, background.y + 80, 'MenuContinueButton', this.retry, this);
        }

        else if (status === 'WON') {
            continueBtn = this.game.add.button(background.x, background.y + 120, 'MenuContinueButton', this.continueAfterFight, this);
        }

        continueBtn.events.onInputOver.add(this.mouseOver, this);
        continueBtn.events.onInputOut.add(this.mouseOut, this);
        continueBtn.anchor.set(0.5);
        UIGroup.add(continueBtn);
    },

    continueAfterFight: function() {
        this.game.sound.play('StartGameSound');
        //this.game.state.start('City');
    },

    quitAfterLoose: function () {
        this.game.sound.play('StartGameSound');
        this.game.state.start('City');
    },

    retry: function () {
        this.game.sound.play('StartGameSound');
        this.game.state.start('Fight');
    },

    mouseOver: function (button) {
        this.game.sound.play('MouseOver');
        button.scale.set(1.1, 1.1);
    },

    mouseOut: function (button) {
        button.scale.set(1, 1);
    }


}