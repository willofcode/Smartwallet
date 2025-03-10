import React from 'react';
import './Dashboard.css'; 

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className='dashboard-main'>
        <div className="widget dashboard-header-widget">
          <h2>Your Financial Dashboard</h2>
          <p>Welcome back Daniel</p>
          <div className="time-filters">
            <button>12M</button>
            <button className="active">1M</button>
            <button>1W</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Left Section */}
        <div className="left-section">
          {/* Spending Overview */}
          <div className="widget spending-overview">
            <h3>My Spending on All Credit Cards for November</h3>
            <div className="spending-chart">
              {/* Placeholder for Pie Chart */}
              <div className="circle-chart">$6,000</div>
              <ul className="spending-breakdown">
                <li><span className="dot entertainment"></span>Entertainment - $1,500/$2,000</li>
                <li><span className="dot food"></span>Food - $1,000/$1,500</li>
                <li><span className="dot rent"></span>Rent - $2,500/$2,500</li>
              </ul>
            </div>
          </div>

          {/* Improving Financial Habits */}
          <div className="widget improving-habits">
            <h3>Improving Financial Habits</h3>
            <div className="habit-cards">
              <div className="habit-card">Food<br/>$100/200<br/><small>15 days left</small></div>
              <div className="habit-card">Food<br/>$100/200<br/><small>15 days left</small></div>
              <div className="habit-card">Food<br/>$100/200<br/><small>15 days left</small></div>
              <div className="habit-card">Food<br/>$100/200<br/><small>15 days left</small></div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section">
          {/* Upcoming Bills */}
          <div className="widget upcoming-bills">
            <h3>Upcoming Bills</h3>
            <div className="bills-list">
              <div>Dec 1 - Rent - $1,111.00</div>
              <div>Jan 18 - Insurance - $1,111.00</div>
              <div>Jun 1 - Water - $1,111.00</div>
            </div>
            <p>Total Bills Due in Next 30 Days: <strong>$1,980.55</strong></p>
          </div>

          {/* My Cards */}
          <div className="widget my-cards">
            <h3>My Cards</h3>
            <div className="cards-chart">
              {/* Placeholder for bar chart */}
              <img src="your-chart-placeholder.png" alt="Bar Chart" />
            </div>
          </div>

          {/* Spending Reduction Goals */}
          <div className="widget spending-goals">
            <h3>Spending Reduction Goals</h3>
            <p><strong>$3,000/$10,000</strong></p>
            <small>Overall spending increased by 20%.<br/>
              Weekly spending 2x more than last week.<br/>
              Decrease entertainment spending by $100/month.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
