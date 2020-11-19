"use strict";
let canvas = document.getElementById("player_area");
let ctx = canvas.getContext("2d");

var score = 0;
var line_num = 0;
var piece_num = 0;

var grid = Array.from({ length: 20 }, () => Array(10).fill(0));
const sprite = new Image(); sprite.src = 'sprites.png';
var color = document.getElementById("color").value;

const shapes = [
    [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]],
    [[0, 0, 0], [2, 2, 2], [2, 0, 0]],
    [[0, 0, 0], [3, 3, 3], [0, 0, 3]],
    [[4, 4], [4, 4]],
    [[0, 0, 0], [0, 5, 5], [5, 5, 0]],
    [[0, 6, 0], [6, 6, 6], [0, 0, 0]],
    [[0, 0, 0], [7, 7, 0], [0, 7, 7]]
];
var piece_id = Math.floor(Math.random() * 7);
var piece = shapes[piece_id];
var piece_state = 0;
var piece_x = 3;
var piece_y = 0;
var alive = true;
var load = false;
var speed = 450;
var time = { start: 0, elapsed: 0, level: speed };

function init() {
    defKeys();
    grid = Array.from({ length: 20 }, () => Array(10).fill(0));
    piece_id = Math.floor(Math.random() * 7);
    piece = shapes[piece_id];
    piece_state = 0;
    piece_x = 3;
    piece_y = 0;
    alive = true;
    score = 0;
    line_num = 0;
    piece_num = 0;
    speed = 450;

    ctx.canvas.width = 10 * 30;
    ctx.canvas.height = 20 * 30;
    ctx.scale(30, 30);
    ctx.imageSmoothingEnabled = false;
    time.start = performance.now();

    if (load == false) {
        document.addEventListener('keydown', event => {
            if (event.keyCode == keys.DOWN) {
                if (alive == true) {
                    if (validPos(piece_x, piece_y + 1)) {
                        piece_y++;
                    }
                    event.preventDefault();
                }
            }

            if (event.keyCode == keys.FALL) {
                if (alive == true) {
                    while (validPos(piece_x, piece_y + 1)) {
                        piece_y++;
                    }
                    event.preventDefault();
                }
            }

            if (event.keyCode == keys.LEFT) {
                if (alive == true) {
                    if (validPos(piece_x - 1, piece_y)) {
                        piece_x--;
                    }
                    event.preventDefault();
                }
            }
            if (event.keyCode == keys.RIGHT) {
                if (alive == true) {
                    if (validPos(piece_x + 1, piece_y)) {
                        piece_x++;
                    }
                    event.preventDefault();
                }
            }

            if (event.keyCode == keys.ROTATE_R) {
                if (alive == true) {
                    if (piece_id == 0 || piece_id == 4 || piece_id == 6) {
                        if (piece_state == 0) {
                            console.log(canRotate(3));
                            if (canRotate(3)) { rotate(3); piece_state = 1; }

                        }
                        else if (piece_state == 1) {
                            console.log(canRotate());
                            if (canRotate()) { rotate(); piece_state = 0; }

                        }
                    }
                    else {
                        console.log(canRotate());
                        if (canRotate()) { rotate(); }
                    }
                    event.preventDefault();
                }
            }

            if (event.keyCode == keys.ROTATE_L) {
                if (alive == true) {
                    if (piece_id == 0 || piece_id == 4 || piece_id == 6) {
                        if (piece_state == 0) {
                            console.log(canRotate());
                            if (canRotate()) { rotate(); piece_state = 1; }

                        }
                        else if (piece_state == 1) {
                            console.log(canRotate(3));
                            if (canRotate(3)) { rotate(3); piece_state = 0; }
                        }
                    }
                    else {
                        console.log(canRotate(3));
                        if (canRotate(3)) { rotate(3); }
                    }
                    event.preventDefault();
                }
            }
        });
    }
    load = true;
    window.requestAnimationFrame(gameLoop);
}


function gameLoop(now = 0) {
    time.elapsed = now - time.start;

    if (time.elapsed > time.level) {
        time.level = speed;
        document.getElementById("speed").value = speed;
        time.start = now;
        if (validPos(piece_x, piece_y + 1)) {
            piece_y++;
        }
        else {
            piece.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value != 0) {
                        grid[piece_y + y][piece_x + x] = value;
                    }
                });
            });
            if (alive == true) {
                clearLines();
                piece_num++;
                document.getElementById("piece").value = piece_num;
                piece_id = Math.floor(Math.random() * 7);
                piece = shapes[piece_id];
                piece_state = 0;
                piece_x = 3;
                piece_y = 0;
            }
            if (!validPos(piece_x, piece_y)) {
                alive = false;
                piece = [];
                grid.forEach((row, y) => {
                    var timeout = (y * 50);
                    row.forEach((value, x) => {
                        console.log(timeout);
                        setTimeout(() => { grid[19 - y][x] = 8; }, timeout);
                    });
                });
            }
        }
    }

    draw();
    window.requestAnimationFrame(gameLoop);
}

function draw() {
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    grid.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value == 1) { ctx.drawImage(sprite, 0, color * 8, 8, 8, x, y, 1, 1); }
            if (value == 2) { ctx.drawImage(sprite, 16, color * 8, 8, 8, x, y, 1, 1); }
            if (value == 3) { ctx.drawImage(sprite, 8, color * 8, 8, 8, x, y, 1, 1); }
            if (value == 4) { ctx.drawImage(sprite, 0, color * 8, 8, 8, x, y, 1, 1); }
            if (value == 5) { ctx.drawImage(sprite, 16, color * 8, 8, 8, x, y, 1, 1); }
            if (value == 6) { ctx.drawImage(sprite, 0, color * 8, 8, 8, x, y, 1, 1); }
            if (value == 7) { ctx.drawImage(sprite, 8, color * 8, 8, 8, x, y, 1, 1); }
            if (value == 8) { ctx.drawImage(sprite, 24, color * 8, 8, 8, x, y, 1, 1); }
            if (value == 9) { ctx.drawImage(sprite, 32, color * 8, 8, 8, x, y, 1, 1); }
        });
    });
    if (alive == true) {
        piece.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value == 1) { ctx.drawImage(sprite, 0, color * 8, 8, 8, piece_x + x, piece_y + y, 1, 1); }
                if (value == 2) { ctx.drawImage(sprite, 16, color * 8, 8, 8, piece_x + x, piece_y + y, 1, 1); }
                if (value == 3) { ctx.drawImage(sprite, 8, color * 8, 8, 8, piece_x + x, piece_y + y, 1, 1); }
                if (value == 4) { ctx.drawImage(sprite, 0, color * 8, 8, 8, piece_x + x, piece_y + y, 1, 1); }
                if (value == 5) { ctx.drawImage(sprite, 16, color * 8, 8, 8, piece_x + x, piece_y + y, 1, 1); }
                if (value == 6) { ctx.drawImage(sprite, 0, color * 8, 8, 8, piece_x + x, piece_y + y, 1, 1); }
                if (value == 7) { ctx.drawImage(sprite, 8, color * 8, 8, 8, piece_x + x, piece_y + y, 1, 1); }
                if (value == 8) { ctx.drawImage(sprite, 24, color * 8, 8, 8, piece_x + x, piece_y + y, 1, 1); }
            });
        });


        var y_tested = 0;
        while (validPos(piece_x, y_tested + 1)) {
            y_tested++;
        }
        ctx.globalAlpha = 0.4;
        piece.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value == 1) { ctx.drawImage(sprite, 0, color * 8, 8, 8, piece_x + x, y_tested + y, 1, 1); }
                if (value == 2) { ctx.drawImage(sprite, 16, color * 8, 8, 8, piece_x + x, y_tested + y, 1, 1); }
                if (value == 3) { ctx.drawImage(sprite, 8, color * 8, 8, 8, piece_x + x, y_tested + y, 1, 1); }
                if (value == 4) { ctx.drawImage(sprite, 0, color * 8, 8, 8, piece_x + x, y_tested + y, 1, 1); }
                if (value == 5) { ctx.drawImage(sprite, 16, color * 8, 8, 8, piece_x + x, y_tested + y, 1, 1); }
                if (value == 6) { ctx.drawImage(sprite, 0, color * 8, 8, 8, piece_x + x, y_tested + y, 1, 1); }
                if (value == 7) { ctx.drawImage(sprite, 8, color * 8, 8, 8, piece_x + x, y_tested + y, 1, 1); }
                if (value == 8) { ctx.drawImage(sprite, 24, color * 8, 8, 8, piece_x + x, y_tested + y, 1, 1); }
            });
        });
    }
}

function validPos(piece_x, piece_y) {
    var valid = true;
    piece.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value != 0) {
                try {
                    if (grid[piece_y + y][piece_x + x] != 0) { valid = false; }
                } catch { valid = false; }
            }
        });
    });
    return valid;
}

function rotate(n = 1) {
    for (var i = 0; i < n; i++) {
        for (var y = 0; y < piece.length; ++y) {
            for (var x = 0; x < y; ++x) {
                [piece[x][y], piece[y][x]] = [piece[y][x], piece[x][y]];
            }
        }
        piece.forEach(row => row.reverse());
    }
}

function canRotate(n = 1) {
    var can = true;
    var p = JSON.parse(JSON.stringify(piece));

    for (var i = 0; i < n; i++) {
        for (var y = 0; y < p.length; ++y) {
            for (var x = 0; x < y; ++x) {
                [p[x][y], p[y][x]] = [p[y][x], p[x][y]];
            }
        }
        p.forEach(row => row.reverse());
    }

    p.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value != 0) {
                if (grid[piece_y + y][piece_x + x] != 0) { can = false; }
            }
        });
    });
    return can;
}

function clearLines() {
    let lines = 0;
    var prev = JSON.parse(JSON.stringify(grid));

    grid.forEach((row, y) => {
        if (row.every(value => value !== 0 && value != 8)) {
            lines++;
            row.forEach((value, x) => {
                var timeout = ((x - 4.5) * 50);
                if (timeout < 0) { timeout *= -1; }
                timeout -= 25;
                setTimeout(() => { grid[y][x] = 0; }, timeout);
            });

            setTimeout(() => {
                grid.splice(y, 1);
                grid.unshift(Array(10).fill(0));
            }, 250);
        }
    });
    if (lines == 1) { score += 40; }
    if (lines == 2) { score += 120; }
    if (lines == 3) { score += 300; }
    if (lines == 4) { score += 1200; }
    line_num += lines;
    document.getElementById("scoreD").value = score;
    document.getElementById("line").value = line_num;

    if (line_num > 200) { speed = 50; color = 5; }
    else if (line_num > 150) { speed = 60; color = 4; }
    else if (line_num > 120) { speed = 70; color = 3; }
    else if (line_num > 100) { speed = 80; color = 2; }
    else if (line_num > 80) { speed = 90; color = 1; }
    else if (line_num > 60) { speed = 100; color = 0; }
    else if (line_num > 50) { speed = 110; color = 9; }
    else if (line_num > 40) { speed = 130; color = 8; }
    else if (line_num > 35) { speed = 150; color = 7; }
    else if (line_num > 30) { speed = 170; color = 6; }
    else if (line_num > 25) { speed = 200; color = 5; }
    else if (line_num > 20) { speed = 250; color = 4; }
    else if (line_num > 15) { speed = 300; color = 3; }
    else if (line_num > 10) { speed = 350; color = 2; }
    else if (line_num > 5) { speed = 400; color = 1; }
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}
