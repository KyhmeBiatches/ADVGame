var fight = function (game) {
    this.game = game;
}

var player;
var number;

var enemy;

var backgroundGroup;
var mainGroup;
var UIGroup;

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

        //Physics 
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.gravity.y = 300;

        //Setup the enemy
        enemy = this.game.add.sprite(950, 715, 'enemy' + number);
        enemy.anchor.set(0.5, 1);
        enemy.scale.set(1);
        mainGroup.add(enemy);

        //Setup enemy portrait
        var enemyportrait = this.game.add.sprite(1080, 0, 'enemy' + number + 'portrait');
        enemyportrait.anchor.set(1, 0);
        UIGroup.add(enemyportrait);
        enemyportrait.scale.set(0.5);

        //Enable physics for sprites
        this.game.physics.p2.enable(enemy);

        //Enemy physics
        enemy.body.collideWorldBounds = true;    
        enemy.body.fixedRotation = true;

        //Enemy physics debug and hitbox
        enemy.body.debug = true;
        enemy.body.clearShapes();
        enemy.body.addRectangle(210, 460, 10, 0);

        //Controls
        cursors = this.game.input.keyboard.createCursorKeys();
        this.shift = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
        this.upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
        this.downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
        this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
        this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    },
    update: function() {
        
    }
}