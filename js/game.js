/*
*  Game.js
*  Mise en place et application du jeu et de ses éléments
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

// Éléments principaux du jeu
var player;
var background;
var groupTeddyBears;

// Variable d'affichage pendant le jeu
var instructionText;
var scoreText;

// Variables mises en place lors de la pause du jeu
var graphicsPause;
var pauseLabel;
var goBackLabel;

// Score du jeu
var score;

// Touches pour le contrôle du jeu
var spaceKey;
var upKey;
var enterKey;

// Variable du fichier audio
var meowSound;


var Game = {
	
	/* 
	* Fonction de préchargement des éléments du jeu
	*/
	preload : function() {	
		// Couleur de fond du jeu
		game.stage.backgroundColor = '#dccab3';
		
		// Chargement de l'image de fond
		game.load.image('background', 'img/Bedroom-800px.png');	
		
		// Chargement des sprites
		game.load.spritesheet('cat', 'sprites/cat.png', 49, 54, 16);  // Image comportant 16 frames de dimension 49px*54px chacun
		game.load.spritesheet('teddyBear', 'sprites/obstacles.png', 50, 50, 95);  // Image comportant 16 frames de dimension 50px*50px chacun

		// Chargement du fichier audio en format mp3 et ogg pour Firefox ne supportant pas les fichiers mp3
		game.load.audio('meow', ['audio/203121_npeo_kitty-meow.mp3', 'audio/203121_npeo_kitty-meow.ogg']);
	},

	/* 
	* Fonction de création du jeu avec mise en place des éléments et des graphismes
	*/
	create : function() {		
		// Mise en place des physiques d'arcade (permettant entre autres de gérer la collision d'éléments)
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = 300;  // Mise en place de la gravité du jeu
		game.physics.arcade.setBounds(-45, 0, 750, 320); // Mise en place des limites du jeu avec (x,y) = (-50,0) et une dimension de 750px*320px

		// Création d'une image de fond
		this.background = game.add.tileSprite(0, 0, 650, 300, 'background');
		
		// Création d'un texte d'indication avec (x,y) = (70,342)
		var text = "Appuyez sur la flèche du haut ou espace pour sauter";
		this.instructionText = game.add.text(70, 342, text, { font: "22px Coming Soon", fill: "#000000" });		
		
		// Création du texte indiquant le score avec (x,y) = (10,2)
		scoreText = game.add.text(10, 2, "Score : 0", { font: "22px Coming Soon", fill: "#000000" });
		
		/* Code pour le menu de pause */
		// Création d'un texte utilisé comme un bouton pour mettre le jeu en pause (avec (x,y) = (580,2))
		var pauseText = game.add.text(580, 2, "Pause", { font: "22px Coming Soon", fill: "#000000" });
		pauseText.inputEnabled = true;
		pauseText.events.onInputUp.add(function () {
			// Jeu mis en pause lors du clic sur le texte
			game.paused = true;
			
			// Création d'un rectangle rempli noir par dessus le jeu en tant que fond
			this.graphicsPause = game.add.graphics(0, 0);
			this.graphicsPause.beginFill(0x000000, 0.6);
			this.graphicsPause.drawRect(0, 0, 650, 380);
			this.graphicsPause.endFill();
			
			// Création de textes annonçant une mise en pause du jeu et un indication pour retourner au jeu
			this.pauseLabel = game.add.text(280, 100, "Pause", { font: "30px Coming Soon", fill: "#ffffff" });	
			this.goBackLabel = game.add.text(130, 200, "Appuyez sur 'Entrée' pour retourner au jeu", { font: "22px Coming Soon", fill: "#ffffff" });
		});
			
		// Enregistrement de la touche 'Entrée' dans le jeu
		this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
		// Ajout d'un listener lors d'un clic sur 'Entrée' pour retourner au jeu
		this.enterKey.onUp.add(this.unpause, this);
		
		// Création d'un groupe représentant les obstacles à éviter
		groupTeddyBears = game.add.group();
		groupTeddyBears.enableBody = true; // Mise en place d'un corps physique sur les éléments du groupe
		var teddyBear = groupTeddyBears.create(750, 290, 'teddyBear', 10);  // Création d'un élément dans le groupe avec (x,y) = (750,290)
		game.physics.enable(teddyBear, Phaser.Physics.ARCADE);  // Mise en place des physiques d'arcade sur l'élément du groupe
		teddyBear.body.collideWorldBounds = true;  // Respecte des limites du jeu établies
		teddyBear.body.setSize(30, 30);	 // Mise en place d'une taille du corps de l'élément de 30px*30px

		this.player = game.add.sprite(60, 300, 'cat');  // Création du personnage du jeu avec (x,y) = (60,300)
		game.physics.enable(this.player, Phaser.Physics.ARCADE);  // Mise en place des physiques d'arcade sur le personnage
		this.player.body.collideWorldBounds = true;  // Respecte des limites du jeu établies
		this.player.body.setSize(35, 35);  // Mise en place d'une taille du corps du personnage de 35px*35px

		this.player.animations.add('run', [8,9,10,11]);  // Ajout de l'animation du personnage courant des frames numéro 8 à 11
		this.player.animations.play('run', 10, true);  // Lecture de l'animation du personnage courant en boucle avec 10 frames/seconde
		
		// Enregistrement des touches dans le jeu
		this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
		
		// Ajout du son de miaulement au jeu avec un volume de 0.5 (1 étant le maximum)
		this.meowSound = game.add.audio('meow', 0.5);
		
		score = 0;
	},
	
	/* Fonction de traitement du menu de pause pour retourner au jeu
	* Permet de retourner au jeu
	* Exécutée lors d'un clic sur la touche 'Entrée'
	*/
	unpause : function() {
		// Fonctionne uniquement si le jeu est en pause
		if(game.paused){				
			// Enlève les éléments du menu de pause du jeu
			graphicsPause.destroy();
			pauseLabel.destroy();
			goBackLabel.destroy();
				
			// Remet en route le jeu 
			game.paused = false;
		}	
	},

	/* 
	* Fonction de traitement lors d'une collision entre le joueur et un obstacle
	* Mise en place d'un menu indiquant une fin de jeu
	*/
	collisionHandler : function(player, teddyBear) {
		// Début du statut 'Game_Over'
        game.state.start('Game_Over');
	},
	
	/* 
	* Fonction de mise à jour appelée en continue pendant le jeu
	*/
	update : function() {	
		var jumpTimer = 0;  // Mise en place d'un timer de saut
		var timeDelay = game.rnd.integerInRange(1300, 2000);  // Délai de temps entre 1.3 et 2 secondes
		
		this.background.tilePosition.x -= 1.4 + (score * 0.2);  // Augmentation de la vitesse de déplacement du fond en fonction du score
		groupTeddyBears.forEach(function(teddyBear) {
			teddyBear.x -= 1.4 + (score * 0.2);  // Augmentation de la vitesse de déplacement de chaque élément du groupe en fonction du score
		}, this);
		game.physics.arcade.gravity.y = 300 + (score * 20);  // Augmentation de la gravité en fonction du score
		
		// Gestion de la collision entre le personnage et un élément du groupe
		game.physics.arcade.collide(this.player, groupTeddyBears, this.collisionHandler, null, this);
		
		// Vérification de l'état des touches (générant un saut du personnage)
		if ((this.spaceKey.isDown || this.upKey.isDown) && this.player.body.onFloor() && game.time.now > jumpTimer) {	
			this.instructionText.destroy();  // Suppression de l'instruction de saut
			this.meowSound.play();  // Lecture du son de miaulement
			this.player.body.velocity.y = -220;  // Augmentation de la vitesse verticale de saut du personnage	 
			jumpTimer = game.time.now + 750;  // Mise en place du timer de saut à 0.75 secondes
		}
		
		// Gestion de l'arrêt de l'animation du personnage lors de son saut
		if(this.player.body.velocity.y < 0 || this.player.body.velocity.y > 0) { 
			this.player.animations.stop('run', true);  
		} else {
			this.player.animations.play('run', 10, true);  // Lecture de l'animation de course du personnage en boucle avec 10 frames/seconde
		}

		// Gestion du déplacement d'un élément du groupe lorsqu'il arrive aux limites du jeu et gestion du score 
		groupTeddyBears.forEach(function (teddyBear) {
			if (teddyBear.x <= -40) {
				teddyBear.x = 750;
				this.scoreHandler();
				
				// Génération d'un élement dans le groupe si sa taille est inférieure à 4
				if(groupTeddyBears.length < 4) {
					setTimeout(generateRandTeddyBears, timeDelay);
				}
			}
		}, this);
		
		// Fonction de génération d'éléments dans le groupe		
		function generateRandTeddyBears() {		
			var teddyBearCount = 0;
			groupTeddyBears.forEach(function(teddyBear) {
				// Vérification de l'abscisse de chaque élément du groupe pour espacer les éléments
				if(teddyBear.x >= 680 && teddyBear.x <= 750) {
					teddyBearCount++;
				}
			}, this);
			// Vérification qu'aucun élément n'est présent à l'abscisse donnée de génération (750)
			if(teddyBearCount == 0) {	
				// Création d'un nouvel élément dans le groupe et mise en place des physiques d'arcade sur celui-ci
				var newTeddyBear = groupTeddyBears.create(750, 290, 'teddyBear', 10);
				game.physics.enable(newTeddyBear, Phaser.Physics.ARCADE);
				newTeddyBear.body.collideWorldBounds = true;
				newTeddyBear.body.setSize(30, 30);	
			}
		}
	},

	/* 
	* Fonction de traitement du score
	* Augmentation du score et modification du texte de score
	*/
	scoreHandler : function() {
		score += 1;
		scoreText.setText("Score : " + score);	
	}	
}