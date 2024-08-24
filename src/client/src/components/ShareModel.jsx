// components/ShareModal.js
import React, { useState } from 'react';

const ShareModel = ({ isOpen, onClose, shareLink }) => {
  const [copySuccess, setCopySuccess] = useState('');

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink)
      .then(() => setCopySuccess('Copied!'))
      .catch(() => setCopySuccess('Failed to copy!'));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Share This Document</h2>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden mb-4">
          <input
            type="text"
            readOnly
            value={shareLink}
            className="w-full p-3 text-gray-700 border-none focus:outline-none"
          />
          <button
            onClick={copyToClipboard}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r-lg"
          >
            Copy
          </button>
        </div>
        {copySuccess && <p className="text-green-500 mb-4">{copySuccess}</p>}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModel;
