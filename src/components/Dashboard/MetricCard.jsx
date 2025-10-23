import React from 'react';
import './MetricCard.css';

const MetricCard = ({ title, value, subtitle, icon, color }) => {
  return (
    <div className="metric-card" style={{ borderLeftColor: color }}>
      <div className="metric-header">
        <div className="metric-icon" style={{ boxShadow: `0 0 20px ${color}`, backgroundColor: color }}>
          {icon}
        </div>
        <h3 className="metric-title" style={{ color }}>{title}</h3>
      </div>

      <div className="metric-content">
        <h2 className="metric-value" style={{ color }}>{value}</h2>
        <p className="metric-subtitle">{subtitle}</p>
      </div>
    </div>
  );
};

export default MetricCard;
