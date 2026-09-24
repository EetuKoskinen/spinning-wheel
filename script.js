const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spinButton');
const resultText = document.getElementById('result');

const segments = 8;
const colors = ['#FF0000', '#0000FF', '#008000', '#FFFF00', '#FFA500', '#800080', '#00FFFF', '#FF00FF'];
const segmentLabels = ['1', '2', '3', '4', '5', '6', '7', '8'];

let currentAngle = 0;
let targetAngle = 0;
let spinning = false;
let spinSpeed = 0;

function drawWheel(angle) {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    const segmentAngle = (2 * Math.PI) / segments;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw segments
    for (let i = 0; i < segments; i++) {
        const startAngle = angle + i * segmentAngle;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, startAngle, startAngle + segmentAngle);
        ctx.fillStyle = colors[i % colors.length];
        ctx.fill();
        ctx.stroke();

        // Draw labels
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(startAngle + segmentAngle / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#000';
        ctx.font = '20px Arial';
        ctx.fillText(segmentLabels[i], radius - 10, 10);
        ctx.restore();
    }

    // Draw pointer
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY - radius - 20);
    ctx.lineTo(centerX - 15, centerY - radius + 10);
    ctx.lineTo(centerX + 15, centerY - radius + 10);
    ctx.closePath();
    ctx.fill();
}

function spin() {
    if (spinning) return;

    spinning = true;
    spinButton.disabled = true;
    resultText.textContent = '';

    currentAngle = 0; // Reset current angle before spin

    spinSpeed = 0.3 + Math.random() * 0.3; // initial speed
    const spins = 5 + Math.floor(Math.random() * 5); // full spins
    const chosenSegment = Math.floor(Math.random() * segments);
    targetAngle = (2 * Math.PI) * spins + (2 * Math.PI / segments) * chosenSegment;

    function animate() {
        if (currentAngle < targetAngle && spinSpeed > 0.002) {
            currentAngle += spinSpeed;
            spinSpeed *= 0.97; // slow down
            drawWheel(currentAngle);
            requestAnimationFrame(animate);
        } else {
            spinning = false;
            spinButton.disabled = false;

            currentAngle = targetAngle % (2 * Math.PI);
            drawWheel(currentAngle);

            let normalizedAngle = currentAngle % (2 * Math.PI);
            let pointerAngle = (2 * Math.PI - normalizedAngle + (Math.PI / segments)) % (2 * Math.PI);
            let segmentSize = (2 * Math.PI) / segments;
            let landedSegment = Math.floor(pointerAngle / segmentSize);

            resultText.textContent = `You landed on segment ${landedSegment + 1}!`;

        }
    }

    animate();
}

drawWheel(currentAngle);
spinButton.addEventListener('click', spin);
