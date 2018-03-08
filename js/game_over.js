/*
*  Game_over.js
*  Mise en place du menu de fin du jeu
*
*  Auteur : Laure Vincent-Cuaz
*  Version : 1.0
*/

// Chargement de la police Google Fonts choisie
 WebFontConfig = {
	google: {
		families: ['Coming Soon']
    }
 };

var Game_Over = {

	/* 
	* Fonction de préchargement des éléments du menu de fin du jeu
	*/
    preload : function() {
		// Couleur de fond du menu de fin du jeu
		game.stage.backgroundColor = '#dccab3';
		
		// Chargement des sprites
		game.load.spritesheet('cat', 'sprites/cats_gameOver.png', 49, 54, 12);  // Image comportant 12 frames de dimension 49px*54px chacun
	},
	
	/* 
	* Fonction de création du menu de fin du jeu avec mise en place des éléments
	*/
    create : function() {
		// Création du texte de fin de jeu avec (x,y) = (180,50) pour la première partie et (x,y) = (350,50) pour la deuxième
		var gameOverLabel1 = game.add.text(180, 50, "GAME", { font: "50px Coming Soon", fill: "#ff80c0", fontWeight: 'bold', align: "center" });	
		var gameOverLabel2 = game.add.text(350, 50, "OVER", { font: "50px Coming Soon", fill: "#6cb6ff", fontWeight: 'bold', align: "center" });	

		// Mise en place d'un contour sur le texte de fin de jeu
		gameOverLabel1.stroke = '#844200';  // Couleur du contour du texte
		gameOverLabel1.strokeThickness = 4;  // Largeur du contour du texte
		gameOverLabel2.stroke = '#844200';  // Couleur du contour du texte
		gameOverLabel2.strokeThickness = 4;  // Largeur du contour du texte
				
        // Création d'un texte indiquant le score de la dernière partie
        game.add.text(220, 140, "Dernier score : " + score.toString(), { font: "30px Coming Soon", fill: "#844200", align: "center"});
		
		// Création d'un texte indiquant une intruction pour rejouer
		var replayLabel = game.add.text(180, 280, "Cliquez ici pour rejouer", { font: "30px Coming Soon", fill: "#844200", fontWeight: 'bold', align: "center" });	
		replayLabel.inputEnabled = true;
		replayLabel.events.onInputUp.add(this.startGame, this);	
		
		var cat1 = game.add.sprite(250, 200, 'cat', 8);  // Création d'un personnage de la frame numéro 8 avec (x,y) = (250,200)	
		var cat2 = game.add.sprite(340, 204, 'cat', 11);  // Création d'un personnage de la frame numéro 11 avec (x,y) = (340,204)		
    },

	/* 
	* Fonction de début du jeu 
	* Exécutée lors d'un clic sur le texte pour rejouer lors d'une fin de jeu
	*/
    startGame: function () {
        game.state.start('Game');  // Début du statut 'Game' pour lancer le jeu
    }
};