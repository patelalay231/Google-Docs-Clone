import React from "react";


const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-gray-800 text-white flex flex-col p-4">
      <h2 className="text-xl font-bold mb-4">Navigation</h2>
      <ul>
        <li className="py-2">All Documents</li>
        <li className="py-2">Recent</li>
        <li className="py-2">Favorites</li>
        <li className="py-2">Trash</li>
      </ul>
    </div>
  );
};

export default Sidebar;
