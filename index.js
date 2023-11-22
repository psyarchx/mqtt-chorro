const broker = 'wss://test.mosquitto.org:8081';
    const topic = 'chorro';

    const canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = 'Annoying_Dog_sprite.webp';
    const doggoSize = {
      width: 10,
      height: 10
    };

    const safezone = {
      x: canvas.width / 2 - 50,
      y: canvas.height / 2 - 50,
      width: 100,
      height: 100
    };

    // Set the initial position to the middle of the safezone but offset by -20
    const initialX = safezone.x + safezone.width / 2 - doggoSize.width / 2 - 20;
    const initialY = safezone.y + safezone.height / 2 - doggoSize.height / 2 - 20;

    img.onload = () => {
      // Draw the image on the canvas at the new initial coordinates
      ctx.drawImage(img, initialX, initialY, doggoSize.width, doggoSize.height);
    };

    // Draw green safe zone
    ctx.fillStyle = 'green';
    ctx.fillRect(safezone.x, safezone.y, safezone.width, safezone.height);

    // Connect to the broker
    const client = mqtt.connect(broker);

    // Subscribe to the topic
    client.on('connect', () => {
      client.subscribe(topic, (err) => {
        if (err) {
          console.error('Error subscribing to topic:', err);
        } else {
          console.log('Subscribed to topic:', topic);
        }
      });
    });

    client.on('message', (receivedTopic, message) => {
      console.log('Received message:', message.toString());

      // Parse the message JSON
      try {
        const parsedMsg = JSON.parse(message.toString());

        // Check if the message object contains 'msg' property
        if (parsedMsg.msg && (parsedMsg.msg.startsWith('n') || parsedMsg.msg.startsWith('r'))) {
          const msg = parsedMsg.msg;

          // Extract x and y coordinates from the message
          const match = msg.match(/nx(-?\d+\.\d+)y(-?\d+\.\d+)/);
          if (match && match.length === 3) {
            const x = parseFloat(match[1]);
            const y = parseFloat(match[2]);

            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Redraw the green safe zone
            ctx.fillStyle = 'green';
            ctx.fillRect(safezone.x, safezone.y, safezone.width, safezone.height);

            // Check if the dog is inside the safe zone
            ctx.drawImage(img, x, y, doggoSize.width, doggoSize.height);
            if (x >= safezone.x && x <= safezone.x + safezone.width && y >= safezone.y && y <= safezone.y + safezone.height) {
              // Draw the image at the new coordinates (x, y) within the safe zone
            } else {
              // Draw an arrow pointing towards the outside of the safe zone
              const arrowLength = 20;
              const arrowAngle = Math.atan2(y - (safezone.y + safezone.height / 2), x - (safezone.x + safezone.width / 2));

              ctx.fillStyle = 'red';
              ctx.beginPath();
              ctx.moveTo(safezone.x + safezone.width / 2 + Math.cos(arrowAngle) * (safezone.width / 2 + arrowLength),
                         safezone.y + safezone.height / 2 + Math.sin(arrowAngle) * (safezone.height / 2 + arrowLength));
              ctx.lineTo(safezone.x + safezone.width / 2 + Math.cos(arrowAngle - Math.PI * 0.75) * arrowLength,
                         safezone.y + safezone.height / 2 + Math.sin(arrowAngle - Math.PI * 0.75) * arrowLength);
              ctx.lineTo(safezone.x + safezone.width / 2 + Math.cos(arrowAngle + Math.PI * 0.75) * arrowLength,
                         safezone.y + safezone.height / 2 + Math.sin(arrowAngle + Math.PI * 0.75) * arrowLength);
              ctx.fill();
            }
          }
        } else {
          // Clear the canvas
          ctx.clearRect();

          // Redraw the image at the adjusted initial coordinates
          ctx.drawImage(img, initialX + 20, initialY + 20, doggoSize.width, doggoSize.height);
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });