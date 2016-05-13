var fight = function (game) {
    this.game = game;
}

var player;
var number;

fight.prototype = {
    preload: function () {
        //Controll witch enemy number
        number = 1;
        //Loads the arena/background
        this.load.image('arena-' + number, 'App/assets/fighting/arenas/arena' + number + '.png');
        //load enemy
        this.load.spriteSheet('enemy' + number, 'App/assets/fighting/enemy/enemy-' + number + '.png', 480, 550);
        this.load.image('enemy' + number + 'bullet', 'App/assets/fighting/enemy/enemy-' + number + 'projectile.png')
        
    },
    create: function() {
        //Setup background image
        var background = this.game.add.tileSprite(0, 0, 1080, 720, 'arena-' + number);
        background.sacle.set(0);
    },
    update: function() {
        
    }
}