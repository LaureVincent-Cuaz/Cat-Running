/*
*  Main_menu.js
*  Mise en place du menu principal du jeu
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

// Son du menu principal du jeu
var menuSound;

var Main_Menu = {
	
	/* 
	* Fonction de préchargement des éléments du menu principal du jeu
	*/
    preload : function() {
		// Couleur de fond du menu du jeu
		game.stage.backgroundColor = '#dccab3';
		
		// Chargement des sprites
		game.load.spritesheet('cat', 'sprites/cats_menu.png', 49, 54, 16);  // Image comportant 16 frames de dimension 49px*54px chacun
		
		// Chargement du fichier audio en format mp3 et ogg pour Firefox ne supportant pas les fichiers mp3
		game.load.audio('soundMenu', ['audio/Mourioche---lilouby.mp3', 'audio/Mourioche---lilouby.ogg']);
	},

	/* 
	* Fonction de création du menu du jeu avec mise en place des éléments
	*/
    create : function()  {			
		// Création du texte du nom du jeu avec (x,y) = (125,50) pour la première partie et (x,y) = (260,50) pour la deuxième
		var gameTitle1 = game.add.text(125, 50, "Cat", { font: "70px Coming Soon", fill: "#ff80c0", fontWeight: 'bold' });	
		var gameTitle2 = game.add.text(260, 50, "Running", { font: "70px Coming Soon", fill: "#6cb6ff", fontWeight: 'bold' });	

		// Mise en place d'un contour sur le texte du nom du jeu
		gameTitle1.stroke = '#844200';  // Couleur du contour du texte
		gameTitle1.strokeThickness = 4;  // Largeur du contour du texte
		gameTitle2.stroke = '#844200';  // Couleur du contour du texte
		gameTitle2.strokeThickness = 4;  // Largeur du contour du texte
		
		// Création du texte d'instruction pour jouer au jeu
		var instructionText = game.add.text(190, 270, "Cliquez ici pour jouer", { font: "30px Coming Soon", fill: "#844200", fontWeight: 'bold' });
		instructionText.inputEnabled = true;
		instructionText.events.onInputUp.add(this.startGame, this);	
		
		var cat1 = game.add.sprite(250, 180, 'cat');  // Création d'un personnage avec (x,y) = (260,180)
		var cat2 = game.add.sprite(350, 188, 'cat');  // Création d'un personnage avec (x,y) = (330,188)
		
		cat1.animations.add('moveHead', [0,1,2,3]);  // Ajout de l'animation du premier chat bougeant sa tête des frames 0 à 3
		cat1.animations.play('moveHead', 3, true);  // Lecture de l'animation du premier chat bougeant sa tête en boucle avec 3 frames/seconde
		
		cat2.animations.add('moveHead', [8,9,10,11]);  // Ajout de l'animation du deuxième chat bougeant sa tête des frames 0 à 3
		cat2.animations.play('moveHead', 3, true);  // Lecture de l'animation du deuxième chat bougeant sa tête en boucle avec 3 frames/seconde
		
		// Ajout du son au menu du jeu avec un volume de 0.5 (1 étant le maximum)
		this.menuSound = game.add.audio('soundMenu', 0.5);
		this.menuSound.play();  // Lecture du son
	},
	
	/* 
	* Fonction de début du jeu 
	* Exécutée lors d'un clic sur le texte de début de jeu du menu principal
	*/
	startGame : function() {
		this.menuSound.stop();  // Arrêt du son du menu principal
		game.state.start('Game');  // Début du statut 'Game' pour lancer le jeu
	}	
};