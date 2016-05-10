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
        this.load.image('MenuBackground', 'assets/menu-background.jpg');
        this.load.image('MenuStartButton', 'assets/Menu_Red_03.png');
        this.load.image('MenuContinueButton', 'assets/Menu_Red_01.png');
        this.load.image('MenuPauseButton', 'assets/Menu_Red_04.png');
        this.load.image('MenuQuitButton', 'assets/Menu_Red_02.png');
        
                //Loading sounds
        this.load.audio('StartGameSound', 'assets/sounds/menu/start_game_sound.wav');
        this.load.audio('MouseOver', 'assets/sounds/menu/mouse_over_item.wav');
        
            //Loading everything for the player
        this.load.image('player-front', 'assets/player/front-view-char.png');
        this.load.image('player-back', 'assets/player/back-view-char.png');
        this.load.image('player-right', 'assets/player/right-view-char.png');
        this.load.image('player-left', 'assets/player/left-view-char.png');
    },
    create: function() {
        this.state.start('Menu');
    }
};