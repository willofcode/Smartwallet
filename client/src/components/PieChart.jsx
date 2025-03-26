import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ transactions }) => {
  // Aggregate total spending by category
  const grouped = useMemo(() => {
    const groupedData = {};
    transactions.forEach((transaction) => {
      const category = Array.isArray(transaction.category) ? transaction.category[0] : transaction.category || 'Uncategorized';
      if (!groupedData[category]) {
        groupedData[category] = [];
      }
      groupedData[category].push(transaction);
    });
    return Object.entries(groupedData);
  }, [transactions]);

  /* // Alternative method to group categories
    const categorySpendings = useMemo(() => {
    const spending = {};
    transactions.forEach(({ category, amount }) => {
      if (!category) return;
      const key = Array.isArray(category) ? category.join(", ") : category;
      if (!spending[key]) spending[key] = 0;
      spending[key] += Math.abs(amount); // use absolute to avoid negative spending
    });
    return spending;
  }, [transactions]);
  */

  const labels = grouped.map(([category]) => category);
  const values = grouped.map(([_, trans]) =>
    trans.reduce((sum, t) => sum + Math.abs(t.amount), 0)
  );
  const totalSum = values.reduce((acc, val) => acc + val, 0);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
          "#9966FF", "#FF9F40", "#E7E9ED", "#FF6384"
        ],
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: "#333",
          padding: 16,
        },
      },
      datalabels: {
        color: "#fff",
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: (value) => {
          const percentage = (value / totalSum) * 100;
          return `${percentage.toFixed(1)}%`;
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || '';
            const value = context.raw;
            const percentage = ((value / totalSum) * 100).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold text-center mb-6">Spending by Category</h2>
      <div className="flex justify-center items-center">
        {labels.length > 0 ? (
          <div className="w-full max-w-xl h-[500px]">
            <Pie data={data} options={options} />
          </div>):(<p>No transactions available.</p>)
        }
      </div>
    </div>
  );
};

export default PieChart;
