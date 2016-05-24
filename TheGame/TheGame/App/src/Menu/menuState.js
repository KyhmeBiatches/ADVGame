var menu = function (game) {
    this.game = game;
}

var startBtn;
var continueBtn;
var quitBtn;

var lastButtonHovered;

menu.prototype = {
    create: function () {
        console.log("Menu state");
        
        //Setup background image
        this.game.add.tileSprite(0, 0, 1080, 720, 'MenuBackground');

        //Setting up the text
        var title = this.game.add.text(540, 150, 'Epoch', {
            font: 'Bold 64px Arial',
            fill: '#660000'
        });
        title.anchor.set(0.5);

        //Setup all the buttons
        startBtn = this.game.add.button(540, 300, 'MenuStartButton', this.startGame, this);
        continueBtn = this.game.add.button(540, 350, 'MenuContinueButton', this.continueGame, this);
        quitBtn = this.game.add.button(540, 400, 'MenuQuitButton', this.quitGame, this);
        startBtn.anchor.set(0.5);
        continueBtn.anchor.set(0.5);
        quitBtn.anchor.set(0.5);
        
        startBtn.events.onInputOver.add(this.mouseOver, this);
        startBtn.events.onInputOut.add(this.mouseOut, this);
        continueBtn.events.onInputOver.add(this.mouseOver, this);
        continueBtn.events.onInputOut.add(this.mouseOut, this);
        quitBtn.events.onInputOver.add(this.mouseOver, this);
        quitBtn.events.onInputOut.add(this.mouseOut, this);

    },

    update: function () {
    },

    //Starts a new game
    startGame: function () {
        
        //Plays a sound when button is clicked
        this.game.sound.play('StartGameSound');
        
        //Chages the game state to City, since thats the main stage of the game
        this.state.start('Fight');
    },

    loadGame: function () {

    },

    continueGame: function () {

    },

    quitgame: function () {

    },

    mouseOver: function (button) {
        this.game.sound.play('MouseOver');
        button.scale.set(1.1, 1.1);
    },
    
    mouseOut: function (button) {
        button.scale.set(1, 1);
    }
    
}