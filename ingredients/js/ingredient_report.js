let reportSpendChartInstance = null;
let reportTopChartInstance = null;

const ingredients = [
  {
    id: "ING001",
    name: "Thịt bò Mỹ",
    stock: 120,
    price: 250000,
    unit: "kg",
  },
  {
    id: "ING002",
    name: "Cá hồi Na Uy",
    stock: 80,
    price: 320000,
    unit: "kg",
  },
  {
    id: "ING003",
    name: "Rau xà lách",
    stock: 150,
    price: 30000,
    unit: "kg",
  },
  {
    id: "ING004",
    name: "Tôm sú",
    stock: 60,
    price: 280000,
    unit: "kg",
  },
  {
    id: "ING005",
    name: "Nấm kim châm",
    stock: 100,
    price: 45000,
    unit: "kg",
  },
];

const history = [
  {
    id: "TX001",
    type: "IMPORT",
    ingredientId: "ING001",
    qty: 100,
    timestamp: "2026-01-10",
  },
  {
    id: "TX002",
    type: "IMPORT",
    ingredientId: "ING002",
    qty: 50,
    timestamp: "2026-02-15",
  },
  {
    id: "TX003",
    type: "IMPORT",
    ingredientId: "ING003",
    qty: 120,
    timestamp: "2026-03-12",
  },
  {
    id: "TX004",
    type: "IMPORT",
    ingredientId: "ING004",
    qty: 40,
    timestamp: "2026-04-18",
  },
  {
    id: "TX005",
    type: "IMPORT",
    ingredientId: "ING005",
    qty: 90,
    timestamp: "2026-05-08",
  },
  {
    id: "TX006",
    type: "EXPORT",
    ingredientId: "ING001",
    qty: -30,
    timestamp: "2026-03-05",
  },
  {
    id: "TX007",
    type: "EXPORT",
    ingredientId: "ING001",
    qty: -20,
    timestamp: "2026-04-01",
  },
  {
    id: "TX008",
    type: "EXPORT",
    ingredientId: "ING002",
    qty: -15,
    timestamp: "2026-05-10",
  },
  {
    id: "TX009",
    type: "EXPORT",
    ingredientId: "ING003",
    qty: -45,
    timestamp: "2026-05-15",
  },
  {
    id: "TX010",
    type: "EXPORT",
    ingredientId: "ING004",
    qty: -12,
    timestamp: "2026-05-20",
  },
];

function renderReports() {
  renderReportSummary();
  renderMonthlyChart();
  renderTopIngredientChart();
}

function renderReportSummary() {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  let totalImportCost = 0;
  let wasteCost = 0;
  let totalOrders = 0;

  history.forEach((tx) => {
    const txDate = new Date(tx.timestamp);

    if (
      txDate.getMonth() === currentMonth &&
      txDate.getFullYear() === currentYear
    ) {
      const ingredient = ingredients.find((i) => i.id === tx.ingredientId);

      const price = ingredient?.price || 0;

      if (tx.type === "IMPORT") {
        totalImportCost += tx.qty * price;
        totalOrders++;
      }

      if (tx.type === "EXPORT") {
        wasteCost += Math.abs(tx.qty) * price;
      }
    }
  });

  document.getElementById("ingr-reports-total-cost").textContent =
    totalImportCost.toLocaleString("vi-VN") + " đ";

  document.getElementById("ingr-reports-waste-cost").textContent =
    wasteCost.toLocaleString("vi-VN") + " đ";

  document.getElementById("ingr-reports-total-orders").textContent =
    `${totalOrders} đơn`;
}

function renderMonthlyChart() {
  const ctx = document.getElementById("ingr-report-spend-chart");

  if (!ctx) return;

  if (reportSpendChartInstance) {
    reportSpendChartInstance.destroy();
  }

  const importData = Array(12).fill(0);
  const exportData = Array(12).fill(0);

  history.forEach((tx) => {
    const month = new Date(tx.timestamp).getMonth();

    const ingredient = ingredients.find((i) => i.id === tx.ingredientId);

    const price = ingredient?.price || 0;

    if (tx.type === "IMPORT") {
      importData[month] += tx.qty * price;
    }

    if (tx.type === "EXPORT") {
      exportData[month] += Math.abs(tx.qty) * price;
    }
  });

  reportSpendChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["T1", "T2", "T3", "T4", "T5", "T6"],
      datasets: [
        {
          label: "Chi phí nhập kho",
          data: importData,
          borderColor: "#e88735",
          backgroundColor: "rgba(232,135,53,0.15)",
          borderWidth: 3,
          fill: true,
          tension: 0.3,
        },
        {
          label: "Chi phí xuất kho",
          data: exportData,
          borderColor: "#ef4444",
          backgroundColor: "rgba(239,68,68,0.08)",
          borderWidth: 3,
          fill: true,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          ticks: {
            color: "#94a3b8",
          },
          grid: {
            color: "#2a2f3d",
          },
        },
        x: {
          ticks: {
            color: "#94a3b8",
          },
          grid: {
            color: "#2a2f3d",
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "#e2e8f0",
          },
        },
      },
    },
  });
}

function renderTopIngredientChart() {
  const ctx = document.getElementById("ingr-report-top-ingredients-chart");

  if (!ctx) return;

  if (reportTopChartInstance) {
    reportTopChartInstance.destroy();
  }

  const usageMap = {};

  history.forEach((tx) => {
    if (tx.type !== "EXPORT") return;

    const qty = Math.abs(tx.qty);

    usageMap[tx.ingredientId] = (usageMap[tx.ingredientId] || 0) + qty;
  });

  const topIngredients = Object.entries(usageMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const labels = topIngredients.map(([id]) => {
    const ingredient = ingredients.find((i) => i.id === id);

    return ingredient?.name || id;
  });
  const data = topIngredients.map(([, qty]) => qty);

  reportTopChartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Số lượng sử dụng",
          data,
          backgroundColor: "rgba(16,185,129,0.75)",
          borderColor: "#10b981",
          borderWidth: 1,
          borderRadius: 6,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            color: "#94a3b8",
          },
          grid: {
            color: "#2a2f3d",
          },
        },
        y: {
          ticks: {
            color: "#e2e8f0",
          },
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderReports();
});
