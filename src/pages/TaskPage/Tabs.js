import React from 'react';

const Tabs = ({ currentTab, changeTab }) => {
  return (
    <div className="tabs-container">
      {['all', 'watch', 'social', 'partnership', 'misc'].map(tab => (
        <div
          key={tab}
          className={`task-tab ${currentTab === tab ? 'active' : ''}`}
          onClick={() => changeTab(tab)}
        >
          {tab.toUpperCase()}
        </div>
      ))}
    </div>
  );
};

export default Tabs;
