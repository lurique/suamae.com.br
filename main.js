document.getElementById('hide-all').addEventListener('click', function() {
  document.getElementById('disclaimer').style.display = "none";
});

var windowWidth = 800;
var windowHeight = 600;

var game = new Phaser.Game(windowWidth, windowHeight, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var sky;

var score = 0;
var scoreText;

var winText;
var winAlterText;

var rectangle;

var flag = 0;

function preload() {
  game.load.image('sky', 'img/sky.png');
  game.load.image('ground', 'img/platform.png');
  game.load.image('dick', 'img/dickhead.png');
  game.load.spritesheet('mom', 'img/yourmom.png', 48, 64);
}

function create() {
  // Assets
  game.physics.startSystem(Phaser.Physics.ARCADE);
  sky = game.add.sprite(-160, 0, 'sky');   
  game.physics.enable(sky, Phaser.Physics.ARCADE);
  sky.body.velocity.x = -50;

  setInterval(function() {
    if ( flag === 0 ) {
      sky.body.velocity.x = 50;
      flag = 1;
    } else {
      sky.body.velocity.x = -50;
      flag = 0;
    }
  }, 3000);

  // Ground
  game.physics.startSystem(Phaser.Physics.ARCADE);
  platforms = game.add.group();
  platforms.enableBody = true;

  var ground = platforms.create(0, game.world.height - 31, 'ground');
  ground.scale.setTo(1, 1);
  ground.body.immovable = true;
    
  var ledge = platforms.create(400, 400, 'ground');
  ledge.body.immovable = true;
  ledge = platforms.create(-150, 250, 'ground');
  ledge.body.immovable = true;

  // Player
  player = game.add.sprite(32, game.world.height - 130, 'mom');
  game.physics.arcade.enable(player);

  player.body.bounce.y = 0;
  player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

  player.animations.add('right', [3, 4, 5, 4], 7, true);
  player.animations.add('left', [9, 10, 11, 10], 7, true);
  player.animations.add('top', [0, 1, 2, 1], 7, true);
  player.animations.add('down', [6, 7, 8, 7], 2, true);

  // Dicks
  dicks = game.add.group();
  dicks.enableBody = true;

  for (var i = 0; i < 16; i++)
  {
    var dick = dicks.create(i * 50, 0, 'dick');
    dick.body.gravity.y = 250;
    dick.body.bounce.y = 0.2 + Math.random() * 0.2;
  }

  // Score
  scoreText = game.add.text(12, 12, 'Pirocas coletadas: 0', { fontSize: '16px', fill: '#f1f1f1' });

  // Rectangle
  rectangle = this.game.add.graphics();

  // Cursor
  cursors = game.input.keyboard.createCursorKeys();
}

function update() {
  // Player
  var hitPlatform = game.physics.arcade.collide(player, platforms);
  game.physics.arcade.collide(dicks, platforms);

  player.body.velocity.x = 0;

  if ( score !== 16 ) {
    if (cursors.left.isDown) {
      player.body.velocity.x = -150;
      player.animations.play('left');
    } else if (cursors.right.isDown) {
      player.body.velocity.x = 150;
      player.animations.play('right');
    } else if (cursors.up.isDown) {
      player.animations.play('top');
    } else if (player.body.touching.down) {
      player.animations.play('down');
    } else {
      player.animations.stop();
      player.frame = 4;
    }
  
    if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
      player.body.velocity.y = -330;
    }
  }

  game.physics.arcade.overlap(player, dicks, collectDick, null, this);
}

function collectDick (player, dick) {
  dick.kill();
  score += 1;
  scoreText.text = 'Pirocas coletadas: ' + score;

  if ( score === 16 ) {
    blankRectangle();
    winnerText();
  }
}

function winnerText() {
  winText = game.add.text(0, 0, 'VOCÊ PERDEU!', { fontSize: '42px', fill: '#fff', boundsAlignH: "center", boundsAlignV: "middle" });
  winAlterText = game.add.text(0, 0, 'Infelizmente sua mãe é insaciável.', { fontSize: '18px', fill: '#fff', boundsAlignH: "center", boundsAlignV: "middle" });
  winText.setTextBounds(0 , windowHeight / 2.5, windowWidth, 100);
  winAlterText.setTextBounds(0 , windowHeight / 2.235, windowWidth, 100);
}

function blankRectangle() {
  rectangle.beginFill(0x000000, 0.5);
  rectangle.drawRect(0, 0, windowWidth, windowHeight);
  rectangle.endFill();
  game.add.group().add(rectangle);
}