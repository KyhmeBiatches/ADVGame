var main = main || {};
//set up size on csreen      X    Y
main.game = new Phaser.Game(1080, 720, Phaser.AUTO,'');
//add states
main.game.state.add('Preload', preload);
main.game.state.add('Menu', menu);
//main.game.state.add('City', city);

//starting preload
main.game.state.start('Preload');