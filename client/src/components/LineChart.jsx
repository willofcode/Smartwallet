import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Helper function to format dates
const formatDate = (dateString) => {
  const options = { month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const LineChart = ({ transactions }) => {
  if (!transactions || transactions.length === 0) return <p>No transactions available.</p>;

  const data = {
    labels: transactions.map((t) => formatDate(t.date)),
    datasets: [
      {
        label: "Transaction Amount ($)",
        data: transactions.map((t) => t.amount),
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        borderWidth: 2,
        pointRadius: 3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { title: { display: true, text: "Amount ($)" }, beginAtZero: true },
    },
    plugins: {
      legend: { display: true, position: "top" },
      tooltip: { enabled: true },
    },
  };

  return (
    <div className="w-full h-[400px] p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-semibold text-center mb-4">Transaction History</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
