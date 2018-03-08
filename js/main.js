/*
*  Main.js
*  Mise en place du jeu
*
*  Auteur : Laure Vincent-Cuaz
*  Version : 1.0
*/

// Mise en place d'une instance de jeu de 650px de large et 380px de hauteur
var game;
game = new Phaser.Game(650, 380, Phaser.CANVAS, 'gameDiv');

// Mise en place du statut 'Main_Menu' en appelant l'objet Main_Menu
game.state.add('Main_Menu', Main_Menu);

// Mise en place du statut 'Game' en appelant l'objet Game
game.state.add('Game', Game);

// Mise en place du statut 'Game_Over' en appelant l'objet Game_Over
game.state.add('Game_Over', Game_Over);

// Début du statut 'Main_Menu'
game.state.start('Main_Menu');