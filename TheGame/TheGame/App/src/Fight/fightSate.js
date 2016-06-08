var fight = function (game) {
    this.game = game;
}

var cursors;

var number;

var player;
var playerMaxHp;
var playerHp;

var enemy;
var enemyMaxHp;
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

        //Load healthbar background
            //For the enemy
        this.load.image('enemyFrame', 'App/assets/fighting/utillity/enemy/enemy-frame.png');
            //For the player
        this.load.image('playerFrame', 'App/assets/fighting/utillity/player/player-frame.png');


        //load enemy
        this.game.load.spritesheet('enemy' + number, 'App/assets/fighting/enemy/enemy-' + number + '/enemy-' + number + '.png', 480, 550);
            //Load bullet
        this.load.image('enemy' + number + 'bullet', 'App/assets/fighting/enemy/enemy-' + number + '/enemy-' + number + '-projectile.png');
            //Load enemy icon
        this.load.image('enemy' + number + 'icon', 'App/assets/fighting/enemy/enemy-' + number + '/enemy-' + number + '-icon.png');

        //Loads player sprite sheet
        this.game.load.spritesheet('playerspritesheet', 'App/assets/player/skeleton-animation-right.png', 480, 550);

        //Load player bullet
        var gunNumber = 1;
        this.load.image('playerbullet', 'App/assets/fighting/guns/gun' + gunNumber + '/bullet.png');

        //Load player icon
        this.load.image('playerIcon', 'App/assets/fighting/player/player-icon.png');

        //Load enemy sounds
        this.load.audio('enemygunsound', 'App/assets/sounds/fighting/enemy-' + number + '/enemy-' + number + '-gunsound.wav');
        this.load.audio('enemyhitsound', 'App/assets/sounds/fighting/enemy-' + number + '/enemy-' + number + '-hit-sound.wav');

        //Load player sounds
        this.load.audio('playerHitSound', 'App/Assets/sounds/fighting/player/player-hit-sound.wav');

        //Load gun sounds
        this.load.audio('playerFireSound', 'App/Assets/sounds/fighting/gun-' + gunNumber + '/fire-sound.wav');

        //Load uttility icons
        this.load.image('gunpowderIcon', 'App/assets/fighting/utillity/gunpowder-icon.png');
        this.load.image('energyIcon', 'App/assets/fighting/utillity/energy-icon.png');

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
        playerMaxHp = playerHp;

        //Setup enemy HP
        enemyHp = 10;
        enemyMaxHp = enemyHp;

        //Setup enemy gunpowder drop
        this.gundpowderDrop = 10;

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
        var playerframe = this.game.add.sprite(-30, 0, 'playerFrame');
        playerframe.scale.set(0.5);
        this.playericon = this.game.add.sprite(-30, 0, 'playerIcon');
        this.playericon.scale.set(0.5);
        UIGroup.add(playerframe);
        UIGroup.add(this.playericon);
        

        //Setup the healthbars
        this.setUpHeahtBars();

        //Collision Groups
        this.enemyCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.enemyBulletsCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.playerBulletsCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.game.physics.p2.updateBoundsCollisionGroup();

        //Setup the enemy
        enemy = this.game.add.sprite(880, 490, 'enemy' + number);
        enemy.anchor.set(0.5, 1);
        enemy.scale.set(1);
        mainGroup.add(enemy);

        //Create enemy animations
        enemy.animations.add('idle', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20]);
        enemy.animations.play('idle', 10, true);

        //Setup enemy bullets
        this.enemyBullets = this.game.add.group();
        this.nextEnemyFire = 0;

        this.enemyBullets.enableBody = true;
        this.enemyBullets.physicsBodyType = Phaser.Physics.P2;
        this.enemyBullets.createMultiple(50, 'enemy' + number + 'bullet');

        //Setup player bullets
        this.playerBullets = this.game.add.group();
        this.nextPlayerFire = 0;

        this.playerBullets.enableBody = true;
        this.playerBullets.physicsBodyType = Phaser.Physics.P2;
        this.playerBullets.createMultiple(50, 'playerbullet');

        //Setup enemy portrait
        var enemyFrame = this.game.add.sprite(150, -10, 'enemyFrame');
        enemyFrame.scale.set(0.5);
        this.enemyicon = this.game.add.sprite(150, -10, 'enemy' + number + 'icon');
        this.enemyicon.scale.set(0.5);
        UIGroup.add(enemyFrame);
        UIGroup.sendToBack(enemyFrame);
        UIGroup.add(this.enemyicon);

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
        player.body.collides(this.enemyBulletsCollisionGroup);
        enemy.body.collides(this.playerBulletsCollisionGroup);
        

        //Controls
        cursors = this.game.input.keyboard.createCursorKeys();
        this.shift = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);

        //Setup the jump
        this.upKey.onDown.add(this.jump, this);

        //Make sure player is on top
        mainGroup.bringToTop(player);

        //Set the fight to being active
        fightIsActive = true;
        status = 'ACTIVE';
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

            if (cursors.left.isDown) {
                enemy.body.velocity.x = -100;
            } else if (cursors.right.isDown) {
                enemy.body.velocity.x = 100;
            } else {
                enemy.body.velocity.x = 0;
            }

            if (this.canEnemyFire) {
                this.enemyFire();
            }

            //Player mouse click / shooting
            if (this.game.input.activePointer.isDown) {
                this.playerFire();
            }
        }

    },

    jump: function() {
        player.body.moveUp(700);
    },

    setUpHeahtBars: function () {
        //Making bitmap (rectangle) for healthbars
        var healthbarBitmap = this.game.add.bitmapData(158, 25);
        healthbarBitmap.context.fillStyle = '#cc0000';
        healthbarBitmap.context.fillRect(0, 0, 158, 64);

        //Make player healthbar
        this.playerHealthbar = this.game.add.sprite(118, 63, healthbarBitmap);
        UIGroup.add(this.playerHealthbar);

        //Bringing the player icon to top, to cover the healthbar
        UIGroup.bringToTop(this.playericon);

        //Setup the enemy healthbar
        this.enemyHealthbar = this.game.add.sprite(961, 63, healthbarBitmap);
        this.enemyHealthbar.anchor.set(1, 0);
        UIGroup.add(this.enemyHealthbar);

        //Setup hpbar text style
        var hpbarTextStyle = { font: 'Bold 22px Arial', fill: '#ffffff' };

        //Add player HP text
        this.playerHpText = this.game.add.text(this.playerHealthbar.x + this.playerHealthbar.width / 2, this.playerHealthbar.y + this.playerHealthbar.height / 2 + 3, playerHp + "/" + playerMaxHp, hpbarTextStyle);
        this.playerHpText.anchor.set(0.5);

        //Add enemy HP text
        this.enemyHpText = this.game.add.text(this.enemyHealthbar.x - this.enemyHealthbar.width / 2, this.enemyHealthbar.y + this.enemyHealthbar.height / 2 + 3, enemyHp + "/" + enemyMaxHp, hpbarTextStyle);
        this.enemyHpText.anchor.set(0.5);
    },

    enemyFire: function () {

        if (this.game.time.now > this.nextEnemyFire && this.enemyBullets.countDead() > 0) {

            var bullet = this.enemyBullets.getFirstExists(false);
            var angle = this.game.math.angleBetweenPoints(enemy.position, player.position);

            if (bullet) {
                this.game.physics.p2.enable(bullet);
                bullet.reset(enemy.x, enemy.y - 480);

                bullet.anchor.set(0.5);
                bullet.scale.set(3);

                mainGroup.add(bullet);
                bullet.body.clearShapes();
                bullet.body.addCircle(27, -27, 414);
                bullet.body.velocity.x = 500 * Math.cos(angle);
                bullet.body.velocity.y = 500 * Math.sin(angle);
                bullet.body.fixedRotation = true;
                bullet.body.data.gravityScale = 0;
                bullet.body.allowGravity = false;
                bullet.body.collideWorldBounds = false;

                bullet.checkWorldBounds = true;
                bullet.outOfBoundsKill = true;
                bullet.autoCull = true;
                bullet.outOfCameraBoundsKill = true;

                this.nextEnemyFire = this.game.time.now + 1200;
           
                this.game.sound.play('enemygunsound');

                bullet.body.setCollisionGroup(this.enemyBulletsCollisionGroup);
                bullet.body.removeCollisionGroup(this.enemyCollisionGroup);
                bullet.body.collides(this.playerCollisionGroup, this.playerHit, this);
                

                //.body.debug = true;
            }
        }
    },

    canEnemyFire: function () {
        var result;
        if (this.game.time.now > this.nextEnemyFire) {
            result = true;
        } else {
            result = false;
        }
        return result;
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
                bullet.body.collideWorldBounds = false;

                bullet.checkWorldBounds = true;
                bullet.outOfBoundsKill = true;
                bullet.autoCull = true;
                bullet.outOfCameraBoundsKill = true;

                this.game.sound.play('playerFireSound');

                bullet.body.setCollisionGroup(this.playerBulletsCollisionGroup);
                bullet.body.removeCollisionGroup(this.playerCollisionGroup);
                bullet.body.collides(this.enemyCollisionGroup, this.enemyHit, this);

                //bullet.body.debug = true;
            }
        }
    },

    playerHit: function (bullet) {
        bullet.sprite.destroy();
        if (status === 'ACTIVE') {
            playerHp -= 1;
            this.game.sound.play('playerHitSound');
            var healthBarProcent = (playerHp / playerMaxHp);
            this.playerHealthbar.scale.set(healthBarProcent, 1);
            if (playerHp === 0) {
                this.playerLost();
                this.playerHpText.setText('DEAD');
            }
            if (playerHp > 0) {
                this.playerHpText.setText(playerHp + '/' + playerMaxHp);
            }
        }
    },

    enemyHit: function(bullet) {
        bullet.sprite.destroy();
        if (status === 'ACTIVE') {
            enemyHp -= 1;
            this.game.sound.play('enemyhitsound');
            var healthBarProcent = (enemyHp / enemyMaxHp);
            this.enemyHealthbar.scale.set(healthBarProcent, 1);
            if (enemyHp === 0) {
                this.playerWon();
                this.enemyHpText.setText('DEAD');
                enemy.animations.stop(null, true);
            }
            if (enemyHp > 0) {
                this.enemyHpText.setText(enemyHp + '/' + enemyMaxHp);
            }
        }
    },

    playerLost: function () {
        if (status === 'ACTIVE') {
            status = 'DEFEAT';
            fightIsActive = false;
            this.drawStatusScreen();
            player.animations.play('none');
        }
    },

    playerWon: function () {
        if (status === 'ACTIVE') {
            status = 'WON';
            fightIsActive = false;
            this.drawStatusScreen();
            player.animations.play('none');
        }
    },

    drawStatusScreen: function () {
        var continueBtn;
        var energyText;
        var energyIcon;
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
            var enemyDefeatText = this.game.make.text(background.x, background.y - background.height / 2 + 100, enemyTaunt, { font: 'Bold 22px Arial', fill: '#ffffff' });
            enemyDefeatText.anchor.set(0.5);
            UIGroup.add(enemyDefeatText);

            var quitBtn = this.game.add.button(background.x, background.y + 130, 'MenuQuitButton', this.quitAfterLoose, this);
            quitBtn.events.onInputOver.add(this.mouseOver, this);
            quitBtn.events.onInputOut.add(this.mouseOut, this);
            quitBtn.anchor.set(0.5);
            UIGroup.add(quitBtn);
            continueBtn = this.game.add.button(background.x, background.y + 80, 'MenuContinueButton', this.retry, this);

            energyText = this.game.add.text(background.x - 100, background.y + 10, '- 1', { font: 'Bold 26px Arial', fill: '#cc0000' });
            energyText.anchor.set(0, 0.5);

            energyIcon = this.game.add.sprite(background.x + 30, background.y, 'energyIcon');
            energyIcon.anchor.set(0.5);
            energyIcon.scale.set(0.3);

        }

        else if (status === 'WON') {
            continueBtn = this.game.add.button(background.x, background.y + 120, 'MenuContinueButton', this.continueAfterFight, this);

            var gunpowderText = this.game.add.text(background.x - 100, background.y - 40, '+ ' + this.gundpowderDrop, { font: 'Bold 26px Arial', fill: '#47d147' });
            gunpowderText.anchor.set(0, 0.5);

            var gunpowderIcon = this.game.add.sprite(background.x + 30, background.y - 50, 'gunpowderIcon');
            gunpowderIcon.anchor.set(0.5);
            gunpowderIcon.scale.set(0.3);

            energyText = this.game.add.text(background.x - 100, background.y + 30, '- 1', { font: 'Bold 26px Arial', fill: '#cc0000' });
            energyText.anchor.set(0, 0.5);

            energyIcon = this.game.add.sprite(background.x + 30, background.y + 20, 'energyIcon');
            energyIcon.anchor.set(0.5);
            energyIcon.scale.set(0.3);
        }

        continueBtn.events.onInputOver.add(this.mouseOver, this);
        continueBtn.events.onInputOut.add(this.mouseOut, this);
        continueBtn.anchor.set(0.5);
        UIGroup.add(continueBtn);
    },

    continueAfterFight: function() {
        this.game.sound.play('StartGameSound');
        this.game.state.start('City');
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