import React, { useEffect } from 'react';

const SnakeGame = () => {
    useEffect(() => {
        const canvas = document.getElementById('gameBoard');
        const ctx = canvas.getContext('2d');

        const scale = 20;
        const rows = canvas.height / scale;
        const columns = canvas.width / scale;

        let snake;

        (function setup() {
            snake = new Snake();
            fruit = new Fruit();

            fruit.pickLocation();

            snake.changeDirection('Right'); // Add this line to set the initial direction.

            window.setInterval(() => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                fruit.draw();
                snake.update();
                snake.draw();

                if (snake.eat(fruit)) {
                    fruit.pickLocation();
                }

                //snake.checkCollision();
            }, 250);
        }());

        document.addEventListener('keydown', (event) => {
            const directionMap = {
                'w': 'Up',
                's': 'Down',
                'a': 'Left',
                'd': 'Right',
            };

            const direction = directionMap[event.key];
            if (direction) {
                snake.changeDirection(direction);
            }
        });
        function Snake() {
            this.x = Math.floor(columns / 2) * scale;
            this.y = Math.floor(rows / 2) * scale;
            this.xSpeed = scale;
            this.ySpeed = 0;
            this.total = 0;
            this.tail = [];

            this.update = function () {
                for (let i = 0; i < this.tail.length - 1; i++) {
                    this.tail[i] = this.tail[i + 1];
                }

                if (this.total >= 1) {
                    this.tail[this.total - 1] = { x: this.x, y: this.y };
                }

                this.x += this.xSpeed;
                this.y += this.ySpeed;

                if (this.x >= canvas.width) {
                    this.x = 0;
                }

                if (this.y >= canvas.height) {
                    this.y = 0;
                }

                if (this.x < 0) {
                    this.x = canvas.width;
                }

                if (this.y < 0) {
                    this.y = canvas.height;
                }
            }

            this.draw = function () {
                ctx.fillStyle = "#00FF00"; // Green color for the snake.

                for (let i = 0; i < this.tail.length; i++) {
                    ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
                }

                ctx.fillRect(this.x, this.y, scale, scale);
            }

            this.changeDirection = function (direction) {
                switch (direction) {
                    case 'Up':
                        if (this.ySpeed !== scale) {
                            this.xSpeed = 0;
                            this.ySpeed = -scale;
                        }
                        break;
                    case 'Down':
                        if (this.ySpeed !== -scale) {
                            this.xSpeed = 0;
                            this.ySpeed = scale;
                        }
                        break;
                    case 'Left':
                        if (this.xSpeed !== scale) {
                            this.xSpeed = -scale;
                            this.ySpeed = 0;
                        }
                        break;
                    case 'Right':
                        if (this.xSpeed !== -scale) {
                            this.xSpeed = scale;
                            this.ySpeed = 0;
                        }
                        break;
                }
            }
            this.eat = function (fruit) {
                if (this.x === fruit.x && this.y === fruit.y) {
                    this.total++; // Increase the snake's length by 1.
                    return true;
                }
                return false;
            }
        }

        function Fruit() {
            this.x = 0;
            this.y = 0;

            this.pickLocation = function () {
                this.x = Math.floor(Math.random() * columns) * scale;
                this.y = Math.floor(Math.random() * rows) * scale;
            }

            this.draw = function () {
                ctx.fillStyle = "#FF0000";
                ctx.fillRect(this.x, this.y, scale, scale);
            }
        }

    }, []);

    return (
        <div>
            <canvas id="gameBoard" width="400" height="400" style={{ border: '1px solid #000' }}></canvas>
        </div>
    );
};

export default SnakeGame;
