import React, { useEffect, useRef } from "react";

const Pong = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const paddleWidth = 10;
    const paddleHeight = 75;
    let gameInterval;

    const player = {
      x: 0,
      y: (canvas.height - paddleHeight) / 2,
      width: paddleWidth,
      height: paddleHeight,
      dy: 5,
    };

    const computer = {
      x: canvas.width - paddleWidth,
      y: (canvas.height - paddleHeight) / 2,
      width: paddleWidth,
      height: paddleHeight,
      dy: 5,
    };

    const ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      radius: 5,
      dx: 4,
      dy: 4,
    };

    function drawPaddle(x, y, width, height) {
      ctx.fillStyle = "#fff";
      ctx.fillRect(x, y, width, height);
    }

    function drawBall(x, y, radius) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#fff";
      ctx.fill();
      ctx.closePath();
    }

    function movePaddle() {
      if (player.y + player.dy > 0 && player.y + player.dy + player.height < canvas.height) {
        player.y += player.dy;
      }
    }

    function moveComputerPaddle() {
      if (ball.y < computer.y + computer.height / 2) {
        computer.y -= computer.dy;
      } else {
        computer.y += computer.dy;
      }
    }

    function moveBall() {
      ball.x += ball.dx;
      ball.y += ball.dy;

      if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
      }

      if (ball.x + ball.radius > canvas.width) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
      }

      if (ball.x - ball.radius < 0) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
      }

      if (ball.y + ball.radius > player.y && ball.y - ball.radius < player.y + player.height) {
        if (ball.x - ball.radius < player.x + player.width) {
          ball.dx *= -1;
        }
      }

      if (ball.y + ball.radius > computer.y && ball.y - ball.radius < computer.y + computer.height) {
        if (ball.x + ball.radius > computer.x) {
          ball.dx *= -1;
        }
      }
    }

    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      movePaddle();
      moveComputerPaddle();
      moveBall();

      drawPaddle(player.x, player.y, player.width, player.height);
      drawPaddle(computer.x, computer.y, computer.width, computer.height);
      drawBall(ball.x, ball.y, ball.radius);
    }

    function onKeyDown(e) {
        if (e.key === "w" || e.key === "W") {
          player.dy = -5;
        } else if (e.key === "s" || e.key === "S") {
          player.dy = 5;
        }
      }
  
      function onKeyUp(e) {
        if (e.key === "w" || e.key === "W" || e.key === "s" || e.key === "S") {
          player.dy = 0;
        }
      }
  
      document.addEventListener("keydown", onKeyDown);
      document.addEventListener("keyup", onKeyUp);
  
      gameInterval = setInterval(gameLoop, 1000 / 60);
  
      return () => {
        clearInterval(gameInterval);
        document.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("keyup", onKeyUp);
      };
    }, []);
  
    return (
      <div>
        <canvas ref={canvasRef} width={640} height={480} style={{ backgroundColor: "#000" }}></canvas>
      </div>
    );
  };
  
  export default Pong;
  
