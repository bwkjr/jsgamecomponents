import { useEffect, useRef } from "react";

const SpaceInvaders = () => {
  const canvasRef = useRef(null);
  const invadersRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let gameInterval;
  
    const player = {
      x: canvas.width / 2,
      y: canvas.height - 30,
      width: 50,
      height: 10,
      dx: 0,
      speed: 3,
    };
  
    const bullet = {
      x: 0,
      y: 0,
      width: 2,
      height: 10,
      speed: 5,
      active: false,
    };
    function onKeyDown(e) {
        if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
          player.dx = -player.speed;
        } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
          player.dx = player.speed;
        } else if ((e.key === "ArrowUp" || e.key === "w" || e.key === "W") && !bullet.active) {
          bullet.active = true;
          bullet.x = player.x + player.width / 2 - bullet.width / 2;
          bullet.y = player.y - bullet.height;
        }
      }
      
      function onKeyUp(e) {
        if (
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight" ||
          e.key === "a" ||
          e.key === "A" ||
          e.key === "d" ||
          e.key === "D"
        ) {
          player.dx = 0;
        }
      }
      
      const invaderRowCount = 5;
      const invaderColumnCount = 7;
      const invaderWidth = 40;
      const invaderHeight = 20;
      const invaderPadding = 10;
      const invaderOffsetTop = 30;
      const invaderOffsetLeft = 30;
      let invaderSpeed = 2;

    for (let c = 0; c < invaderColumnCount; c++) {
      invadersRef.current[c] = [];
      for (let r = 0; r < invaderRowCount; r++) {
        let invaderX = c * (invaderWidth + invaderPadding) + invaderOffsetLeft;
        let invaderY = r * (invaderHeight + invaderPadding) + invaderOffsetTop;
        invadersRef.current[c][r] = { x: invaderX, y: invaderY, status: 1 };
      }
    }

    function drawPlayer() {
      ctx.beginPath();
      ctx.rect(player.x, player.y, player.width, player.height);
      ctx.fillStyle = "green";
      ctx.fill();
      ctx.closePath();
    }

    function drawBullet() {
      if (bullet.active) {
        ctx.beginPath();
        ctx.rect(bullet.x, bullet.y, bullet.width, bullet.height);
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.closePath();
      }
    }

    function drawInvaders() {
      for (let c = 0; c < invaderColumnCount; c++) {
        for (let r = 0; r < invaderRowCount; r++) {
          if (invadersRef.current[c][r].status === 1) {
            let invaderX = invadersRef.current[c][r].x;
            let invaderY = invadersRef.current[c][r].y;
            ctx.beginPath();
            ctx.rect(invaderX, invaderY, invaderWidth, invaderHeight);
            ctx.fillStyle = "purple";
            ctx.fill();
            ctx.closePath();
          }
        }
      }
    }

    function movePlayer() {
      player.x += player.dx;
      if (player.x < 0) {
        player.x = 0;
      } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
      }
    }

    function moveBullet() {
      if (bullet.active) {
        bullet.y -= bullet.speed;
        if (bullet.y < 0) {
          bullet.active = false;
        }
      }
    }

    function moveInvaders() {
        let moveDown = false;
        for (let c = 0; c < invaderColumnCount; c++) {
          for (let r = 0; r < invaderRowCount; r++) {
            let invader = invadersRef.current[c][r];
            if (invader.status === 1) {
              invader.x += invaderSpeed;
      
              if (invader.x + invaderWidth > canvas.width || invader.x < 0) {
                moveDown = true;
              }
            }
          }
        }
      
        if (moveDown) {
          invaderSpeed = -invaderSpeed;
          for (let c = 0; c < invaderColumnCount; c++) {
            for (let r = 0; r < invaderRowCount; r++) {
              let invader = invadersRef.current[c][r];
              if (invader.status === 1) {
                invader.y += invaderHeight;
              }
            }
          }
        }
      }
      
      function detectCollision() {
        for (let c = 0; c < invaderColumnCount; c++) {
          for (let r = 0; r < invaderRowCount; r++) {
            let i = invadersRef.current[c][r];
            if (i.status === 1) {
              if (
                bullet.x > i.x &&
                bullet.x < i.x + invaderWidth &&
                bullet.y > i.y &&
                bullet.y < i.y + invaderHeight
              ) {
                i.status = 0;
                bullet.active = false;
              }
            }
          }
        }
      }
      
      function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      
        drawPlayer();
        drawBullet();
        drawInvaders();
      
        movePlayer();
        moveBullet();
        moveInvaders();
        detectCollision();
      }
      
      gameInterval = setInterval(gameLoop, 10);
      
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
      
      return () => {
        clearInterval(gameInterval);
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("keyup", onKeyUp);
      };
      }, []);
      
      return (
        <div>
          <canvas ref={canvasRef} width={800} height={600} style={{ background: "black" }}></canvas>
        </div>
      );
      };
      
      export default SpaceInvaders;
      