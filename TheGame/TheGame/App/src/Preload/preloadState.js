var preload = function (game) {
    this.game = game;
};

preload.prototype = {
    preload: function() {
        
         //Setting up the game canvas
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.pageAlignHorizontally = true;
        this.game.scale.pageAlignVertically = true;
        this.game.stage.backgroundColor = '#eee';
    
        //Load all needed assets
            //Loading everything for the menu
                //Loading images
        this.load.image('MenuBackground', '/App/assets/menu-background.jpg');
        this.load.image('MenuStartButton', '/App/assets/Menu_Red_03.png');
        this.load.image('MenuContinueButton', '/App/assets/Menu_Red_01.png');
        this.load.image('MenuPauseButton', '/App/assets/Menu_Red_04.png');
        this.load.image('MenuQuitButton', '/App/assets/Menu_Red_02.png');
        
                //Loading sounds
        this.load.audio('StartGameSound', '/App/assets/sounds/menu/start_game_sound.wav');
        this.load.audio('MouseOver', '/App/assets/sounds/menu/mouse_over_item.wav');
        
            //Loading everything for the player
        this.load.image('player-front', '/App/assets/player/front-view-char.png');
        this.load.image('player-back', '/App/assets/player/back-view-char.png');
      //  this.load.image('player-right', '/App/assets/player/right-view-char.png');
        this.load.image('player-left', '/App/assets/player/left-view-char.png');

        this.game.load.spritesheet('player-right', '/App/assets/PlayerSpriteSheet.png', 480, 550);
        this.game.load.spritesheet('player-left', '/App/assets/skeleton-animation-left.png', 480, 550);

        //Loading everything for the city
        this.game.load.image('map', '/App/assets/NEWMAP.jpg');
    },
    create: function() {
        this.state.start('Menu');
    }
};