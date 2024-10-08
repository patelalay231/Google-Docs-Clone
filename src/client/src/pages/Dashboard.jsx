import React from "react";
import { Header, DocumentList, Background } from "../components";

const Dashboard = () => {
    return (
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="p-4">
              <DocumentList />
          </div>
        </div>
    );
  };

export default Dashboard;
