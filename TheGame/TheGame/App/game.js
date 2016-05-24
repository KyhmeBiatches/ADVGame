var main = main || {};
//set up size on csreen      X    Y
main.game = new Phaser.Game(1080, 720, Phaser.AUTO,'');
//add states
main.game.state.add('Preload', preload);
main.game.state.add('Menu', menu);
<<<<<<< HEAD
//main.game.state.add('City', city);
main.game.state.add('Fight', fight);
=======
main.game.state.add('City', city);
main.game.state.add('Shop', shop);
>>>>>>> feature/CityState

//starting preload
main.game.state.start('Preload');