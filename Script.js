const devices = document.querySelectorAll(".device");
const totalPowerEl = document.getElementById("totalPower");
const energyUsedEl = document.getElementById("energyUsed");
const costEl = document.getElementById("cost");

let totalPower = 0;
let energyUsed = 0; // in Wh
let cost = 0;
let lastUpdate = Date.now();
const costPerKWh = 7; // ₹7 per kWh

// Chart.js setup
const ctx = document.getElementById("energyChart");
const energyChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Energy (Wh)",
        data: [],
        borderColor: "#38bdf8",
        tension: 0.3,
      },
    ],
  },
  options: {
    scales: {
      x: { display: false },
      y: { beginAtZero: true },
    },
  },
});

devices.forEach((device) => {
  const button = device.querySelector(".toggle");
  const watt = parseFloat(device.getAttribute("data-watt"));
  let active = false;

  button.addEventListener("click", () => {
    active = !active;
    if (active) {
      totalPower += watt;
      device.classList.add("active");
      button.textContent = "Turn OFF";
    } else {
      totalPower -= watt;
      device.classList.remove("active");
      button.textContent = "Turn ON";
    }
    totalPowerEl.textContent = totalPower;
  });
});

function updateEnergy() {
  const now = Date.now();
  const elapsedHours = (now - lastUpdate) / (1000 * 60 * 60);
  lastUpdate = now;

  energyUsed += totalPower * elapsedHours;
  cost = (energyUsed / 1000) * costPerKWh;

  energyUsedEl.textContent = energyUsed.toFixed(2);
  costEl.textContent = cost.toFixed(2);

  // update chart
  energyChart.data.labels.push("");
  energyChart.data.datasets[0].data.push(energyUsed.toFixed(2));
  if (energyChart.data.labels.length > 20) {
    energyChart.data.labels.shift();
    energyChart.data.datasets[0].data.shift();
  }
  energyChart.update();
}

setInterval(updateEnergy, 2000);
