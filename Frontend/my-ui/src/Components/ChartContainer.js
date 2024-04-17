import React, { useState } from 'react';
import ChartData from './ChartData';
import jsonData from '../sample-data/sample-data.json'; // Assuming you have JSON data
import 'chartjs-adapter-date-fns'; // Import the date adapter

const ChartContainer = () => {
  const [timeRange, setTimeRange] = useState('1hr');
  const [filteredData, setFilteredData] = useState(jsonData);

  const handleFilter = range => {
    // Logic to filter data based on time range (1hr, 8hr, 24hr)
    // Update filteredData state accordingly
  };

  return (
    <div>
      <div className="filter-buttons">
        <button onClick={() => handleFilter('1hr')}>1 Hour</button>
        <button onClick={() => handleFilter('8hr')}>8 Hours</button>
        <button onClick={() => handleFilter('24hr')}>24 Hours</button>
      </div>
      <ChartData data={filteredData} />
    </div>
  );
};

export default ChartContainer;
