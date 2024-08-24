import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaFileAlt } from "react-icons/fa"; 
import { set } from "mongoose";
require('dotenv').config();
const DocumentList = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [sharedDocuments, setSharedDocuments] = useState([]);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${process.env.SERVER_URI}/api/document/get-documents`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDocuments(response.data.documents);  
      setSharedDocuments(response.data.sharedDocuments);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleCreateNewDocument = async () => {
    try {
      const response = await axios.post(`${process.env.SERVER_URI}/api/document/create-document`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate(`/document/${response.data.documentId}`);
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

  const handleStarDocument = async (documentId) => {
    try {
      const response = await axios.post(`${process.env.SERVER_URI}/api/document/star-document/${documentId}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDocuments(docs =>
        docs.map(doc =>
          doc._id === documentId ? { ...doc, isStarred: response.data.isStarred } : doc
        )
      );
    } catch (error) {
      console.error("Error starring document:", error);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      await axios.delete(`${process.env.SERVER_URI}/api/document/delete-document/${documentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDocuments(docs => docs.filter(doc => doc._id !== documentId));
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Recent documents created by you:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Quick Action Card */}
        <div
          onClick={handleCreateNewDocument}
          className="flex items-center justify-center bg-gray-100 p-4 rounded-lg shadow cursor-pointer hover:bg-gray-200 transition-colors"
        >
          <div className="flex flex-col items-center">
            <span className="text-4xl text-blue-500">+</span>
            <span className="mt-2 text-sm text-gray-500">New Document</span>
          </div>
        </div>

        {/* Document Cards */}
        {documents.map((doc) => (
          <div
            key={doc._id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow relative"
          >
            <div className="mb-4 flex items-center justify-center">
            <FaFileAlt className="text-gray-500 text-4xl size-1/2" />
          </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{doc.title}</h3>
            </div>
            <p className="text-gray-500 text-sm">Last Modified: {new Date(doc.lastModified).toLocaleString()}</p>

              <button
                className="text-blue-500 hover:underline"
                onClick={() => navigate(`/document/${doc._id}`)}
              >
                Open
              </button>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-bold mt-4 mb-4">Shared with me:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">

        {/* Document Cards */}
        {sharedDocuments.map((doc) => (
          <div
            key={doc._id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow relative"
          >
            <div className="mb-4 flex items-center justify-center">
            <FaFileAlt className="text-gray-500 text-4xl size-1/2" />
          </div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{doc.title}</h3>
            </div>
            <p className="text-gray-500 text-sm">Last Modified: {new Date(doc.lastModified).toLocaleString()}</p>
            <p className="text-gray-700 text-sm">
            Created by: {doc.username}
          </p>
              <button
                className="text-blue-500 hover:underline"
                onClick={() => navigate(`/document/${doc._id}`)}
              >
                Open
              </button>
          </div>
        ))}
      </div>
    </div>
    
  );
};

export default DocumentList;
