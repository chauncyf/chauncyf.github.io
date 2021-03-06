let {init, Sprite, Pool, initKeys, bindKeys, load, setImagePath, imageAssets, getContext, keyPressed, GameLoop} = kontra;
let {canvas} = init();

canvas.width = 1200;
canvas.height = canvas.width / 16 * 9;
// canvas.style = "position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; margin: auto; border:1px solid gray";
canvas.style = "width:100%; margin: auto;";

let context = getContext('2d');
context.webkitImageSmoothingEnabled = false;
context.mozImageSmoothingEnabled = false;
context.imageSmoothingEnabled = false;

let UNIT_MAP_WIDTH = canvas.width / 16;
let UNIT_MAP_HEIGHT = canvas.height / 9;

let BLACK = '#333333';
let WHITE = '#FFFFFF';

let IS_BACK_SIDE = false;

// Game state: homepage 0, playing 1, over 2
let state = 0;

/**
 * Levels
 */
let LEVEL_1 = [
    [
        [0, UNIT_MAP_HEIGHT * 6, UNIT_MAP_WIDTH * 10, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 10, UNIT_MAP_HEIGHT * 3, UNIT_MAP_WIDTH * 6, UNIT_MAP_HEIGHT * 9]
    ],
    [UNIT_MAP_WIDTH * 12.5, UNIT_MAP_HEIGHT * 2.5, 0]
];

let LEVEL_2 = [
    [
        [0, UNIT_MAP_HEIGHT * 3, UNIT_MAP_WIDTH * 5, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 5, UNIT_MAP_HEIGHT * 6, UNIT_MAP_WIDTH * 6, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 11, UNIT_MAP_HEIGHT * 3, UNIT_MAP_WIDTH * 5, UNIT_MAP_HEIGHT * 9]
    ],
    [UNIT_MAP_WIDTH * 13, UNIT_MAP_HEIGHT * 2.5, 0]
];

let LEVEL_3 = [
    [
        [0, UNIT_MAP_HEIGHT * 6, UNIT_MAP_WIDTH * 4, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 4, UNIT_MAP_HEIGHT * 2, UNIT_MAP_WIDTH * 3, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 7, UNIT_MAP_HEIGHT * 4, UNIT_MAP_WIDTH * 3, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 10, UNIT_MAP_HEIGHT * 9, UNIT_MAP_WIDTH * 3, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 13, UNIT_MAP_HEIGHT * 4, UNIT_MAP_WIDTH * 3, UNIT_MAP_HEIGHT * 9]
    ],
    [UNIT_MAP_WIDTH * 14, UNIT_MAP_HEIGHT * 4 + 5, 1]
];

let LEVEL_4 = [
    [
        [0, UNIT_MAP_HEIGHT * 2, UNIT_MAP_WIDTH * 3, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 3, UNIT_MAP_HEIGHT * 4, UNIT_MAP_WIDTH, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 4, UNIT_MAP_HEIGHT * 6, UNIT_MAP_WIDTH, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 5, UNIT_MAP_HEIGHT * 9, UNIT_MAP_WIDTH * 2, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 7, UNIT_MAP_HEIGHT * 6, UNIT_MAP_WIDTH, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 8, UNIT_MAP_HEIGHT * 4, UNIT_MAP_WIDTH, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 9, UNIT_MAP_HEIGHT * 2, UNIT_MAP_WIDTH, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 10, UNIT_MAP_HEIGHT * 4, UNIT_MAP_WIDTH, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 11, UNIT_MAP_HEIGHT * 6, UNIT_MAP_WIDTH, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 12, UNIT_MAP_HEIGHT * 9, UNIT_MAP_WIDTH * 2, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 14, UNIT_MAP_HEIGHT * 6, UNIT_MAP_WIDTH, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 15, UNIT_MAP_HEIGHT * 4, UNIT_MAP_WIDTH, UNIT_MAP_HEIGHT * 9],
    ],
    [UNIT_MAP_WIDTH * 15.1, UNIT_MAP_HEIGHT * 4 + 5, 1]
];

let LEVEL_5 = [
    [
        [0, UNIT_MAP_HEIGHT * 6, UNIT_MAP_WIDTH * 3, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 3, UNIT_MAP_HEIGHT * 2, UNIT_MAP_WIDTH, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 4, UNIT_MAP_HEIGHT * 9, UNIT_MAP_WIDTH, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 5, UNIT_MAP_HEIGHT * 5.5, UNIT_MAP_WIDTH, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 6, UNIT_MAP_HEIGHT * 9, UNIT_MAP_WIDTH, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 7, UNIT_MAP_HEIGHT * 3.5, UNIT_MAP_WIDTH, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 8, UNIT_MAP_HEIGHT * 9, UNIT_MAP_WIDTH, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 9, UNIT_MAP_HEIGHT * 1.5, UNIT_MAP_WIDTH, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 10, UNIT_MAP_HEIGHT * 9, UNIT_MAP_WIDTH, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 11, UNIT_MAP_HEIGHT * 3.5, UNIT_MAP_WIDTH, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 12, UNIT_MAP_HEIGHT * 9, UNIT_MAP_WIDTH, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 13, UNIT_MAP_HEIGHT * 5.5, UNIT_MAP_WIDTH, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 14, UNIT_MAP_HEIGHT * 9, UNIT_MAP_WIDTH, UNIT_MAP_HEIGHT * 9],
        [UNIT_MAP_WIDTH * 15, UNIT_MAP_HEIGHT * 3.5, UNIT_MAP_WIDTH * 1.5, UNIT_MAP_HEIGHT * 9],
    ],
    [UNIT_MAP_WIDTH * 15.1, UNIT_MAP_HEIGHT * 3.5 + 5, 1]
];

let LEVELS = [LEVEL_1, LEVEL_2, LEVEL_3, LEVEL_4, LEVEL_5];
let CUR_LEVEL = 0;

setImagePath('../assets/backside/assets/img');
load(
    'home.png',
    'player1.png',
    'player2.png',
    'player3.png',
    'player4.png',
    'key1.png',
    'key2.png'
).then(function () {

    let TITLE = imageAssets['home'];
    let PLAYER_FRAME1 = imageAssets['player1'];
    let PLAYER_FRAME2 = imageAssets['player2'];
    let PLAYER_BACK_FRAME1 = imageAssets['player3'];
    let PLAYER_BACK_FRAME2 = imageAssets['player4'];
    let KEYS = [imageAssets['key1'], imageAssets['key2']];

    let goal = Sprite({
        x: UNIT_MAP_WIDTH * 12.5,
        y: UNIT_MAP_HEIGHT * 2,
        width: UNIT_MAP_HEIGHT * 0.8,
        height: UNIT_MAP_HEIGHT / 2.5,
        image: imageAssets['key1'],
        update: update_goal
    });

    function drawHomepage() {
        context.fillStyle = BLACK;
        context.fillRect(0, canvas.height / 2 - 1, canvas.width, canvas.height / 2);
        let title = TITLE;
        titleX = canvas.width / 2 - title.width * 5;
        titleY = canvas.height / 2 - title.height * 5;
        context.drawImage(title, titleX, titleY, title.width * 10, title.height * 10);
        context.font = '24px Arial';
        context.textAlign = 'center';
        context.fillStyle = WHITE;
        context.fillText('Use ARROW KEY to control.', canvas.width / 2, canvas.height / 2 + 120);
        context.fillText('Press ENTER to start.', canvas.width / 2, canvas.height / 2 + 180);
    }

    function game_over() {
        context.font = '100px Arial';
        context.textAlign = 'left';
        context.fillStyle = BLACK;
        context.fillText('Game over, you win!', 150, 350);
    }

    function update_goal() {
        goal.image = KEYS[LEVELS[CUR_LEVEL][1][2]];

        this.x = LEVELS[CUR_LEVEL][1][0];
        this.y = LEVELS[CUR_LEVEL][1][1];

        if (this.collidesWith(player)) {
            if (CUR_LEVEL < LEVELS.length - 1) {
                CUR_LEVEL++;
                player.x = 100;
                player.y = 0;
                player.is_landed = false;
                tile_pool.clear();
            } else {
                state = 2;
            }
        }
    }

    function generate_map() {
        LEVELS[CUR_LEVEL][0].forEach(function (para) {
            get_tile(...para)
        });
    }

    let player = Sprite({
        x: 100,
        y: 0,
        pre_y: 0,
        width: UNIT_MAP_HEIGHT * 0.64,
        height: UNIT_MAP_HEIGHT,
        dy: 0,
        ddy: 0,
        is_landed: false,
        move_right: null,
        rotation: 0,
        animCount: 0,
        image: PLAYER_FRAME1,
        walk: player_walk
    });

    function player_walk() {
        if (player.animCount === 30) {
            player.image = IS_BACK_SIDE ? PLAYER_BACK_FRAME2 : PLAYER_FRAME2;
        }
        if (player.animCount === 60) {
            player.image = IS_BACK_SIDE ? PLAYER_BACK_FRAME1 : PLAYER_FRAME1;
            player.animCount = 0;
        }
        player.animCount += 1;
    }

    let tile_pool = Pool({
        create: Sprite,
        maxSize: 16,
    });

    function get_tile(x, y, width, height) {
        tile_pool.get({
            x: x,
            y: y,
            width: width,
            height: height,
            anchor: {x: 0, y: 0},  // top left corner
            color: BLACK,
            update: update_status,
        })
    }

    function update_status() {
        if (!IS_BACK_SIDE) {
            this.anchor = {x: 0, y: 0};
            this.color = BLACK;
        } else {
            this.anchor = {x: 0, y: 1};
            this.color = WHITE;
        }

        if (player.collidesWith(this)) {
            if (!IS_BACK_SIDE) {
                if (player.y + player.height >= this.y && player.x + player.width >= this.x && player.x <= this.x + this.width) {
                    if (player.pre_y + player.height <= this.y + 1) {
                        player.y = this.y - player.height + 1;
                        player.dy = 0;
                        player.ddy = 0;
                        player.is_landed = true;
                    } else {
                        if (player.move_right) {
                            player.x = this.x - player.width;
                        } else {
                            player.x = this.x + this.width;
                        }
                    }
                }
            } else {
                if (player.y - player.height <= this.y && player.x + player.width >= this.x && player.x <= this.x + this.width) {
                    if (player.pre_y - player.height >= this.y) {
                        player.y = this.y + player.height;
                        player.dy = 0;
                        player.ddy = 0;
                        player.is_landed = true;
                    } else {
                        if (player.move_right) {
                            player.x = this.x - player.width;
                        } else {
                            player.x = this.x + this.width;
                        }
                    }
                }
            }
        } else {
            !IS_BACK_SIDE ? player.ddy = 1 : player.ddy = -1;
            if (Math.abs(player.dy) > 0) {
                player.is_landed = false;
            }
        }
    }

    function fill_canvas() {

        if (!IS_BACK_SIDE) {
            context.fillStyle = WHITE;
        } else {
            context.fillStyle = BLACK;
        }
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    /**
     * Game control
     */
    initKeys();

    function log_pre_pos() {
        player.pre_x = player.x;
        player.pre_y = player.y;
    }

    function playShort(moveType) {
        switch (moveType) {
            case "jump":
                D = IS_BACK_SIDE ? [13, 12, 10] : [13, 12, 15];
                break;
            case "flip":
                D = IS_BACK_SIDE ? [10, 15] : [15, 10];
                break;
            default:
                D = [];
        }
        try {
            with (new AudioContext)
                with (G = createGain())
                    for (i in D)
                        with (createOscillator())
                            if (D[i])
                                connect(G),
                                    G.connect(destination),
                                    start(i * .1),
                                    frequency.setValueAtTime(440 * 1.06 ** (13 - D[i]), i * .1),
                                    gain.setValueAtTime(1, i * .1),
                                    gain.setTargetAtTime(.0001, i * .1 + .08, .005),
                                    stop(i * .1 + .09)
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Game loop
     */
    let loop = GameLoop({
        update: function () {
            if (state === 0) {
                if (keyPressed('enter')) {
                    state += 1;
                }
            } else if (state === 1) {
                generate_map();
                goal.update();
                log_pre_pos();

                if (!IS_BACK_SIDE && player.y + player.height >= canvas.height) {
                    player.is_landed = false;
                    player.x = 100;
                    player.y = 0;
                }
                if (IS_BACK_SIDE && player.y - player.height < 0) {
                    player.is_landed = false;
                    player.x = 100;
                    player.y = UNIT_MAP_HEIGHT * 9;
                }

                if (keyPressed('up')) {
                    if (player.is_landed) {
                        playShort("jump");
                        if (IS_BACK_SIDE) {
                            IS_BACK_SIDE = false;
                            player.image = PLAYER_FRAME1;
                            player.animCount = 0;
                            player.anchor = {x: 0, y: 0};
                            player.y -= 150;
                        }
                        player.dy = -20;
                        player.ddy = 1;
                        player.is_landed = false;
                    }
                } else if (keyPressed('down')) {
                    if (player.is_landed) {
                        playShort("flip");
                        if (!IS_BACK_SIDE) {
                            IS_BACK_SIDE = true;
                            player.image = PLAYER_BACK_FRAME1;
                            player.animCount = 0;
                            player.anchor = {x: 0, y: 1};
                            player.y += 150;
                        }
                        player.dy = 20;
                        player.ddy = -1;
                        player.is_landed = false;
                    }
                }

                if (keyPressed('right')) {
                    player.x += 5;
                    player.move_right = true;
                } else if (keyPressed('left')) {
                    player.x -= 5;
                    player.move_right = false;
                }

                player.walk();
                player.update();
                tile_pool.update();
            }
        },
        render: function () {
            if (state === 0) {
                drawHomepage();
            } else if (state === 1) {
                fill_canvas();
                tile_pool.render();
                goal.render();
                player.render();
            }
            if (state === 2) {
                game_over();
            }
        }
    });
    /**
     * Start the game
     */
    loop.start();
}).catch(function (err) {
    console.log(err);
});
