import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${process.env.SERVER_URI}/api/user/data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.user.username);
      setProfileImage(response.data.user.profileImage);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login"); // Redirect to login page after logout
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="flex items-center justify-between p-4 bg-gray-100 border-b">
      <h1 className=" font-bold text-blue-500 text-sm md:text-xl lg:text-2xl">Google Docs Clone</h1>
      <div className="flex items-center space-x-4">
        {profileImage && (
          <img
            src={profileImage}
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
        )}
        <span className="text-gray-700">{user}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
