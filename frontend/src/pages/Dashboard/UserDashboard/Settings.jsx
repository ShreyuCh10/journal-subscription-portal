import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLock,
  FaBell,
  FaMoon,
  FaSun,
  FaCreditCard
} from "react-icons/fa";

const Settings = ({ toggleTheme, mode }) => {

  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);
  const [autoRenew, setAutoRenew] = useState(true);




  return (

    <div className="max-w-5xl mx-auto space-y-8">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>

          <p className="text-gray-500">
            Manage your preferences and account security
          </p>

        </div>

      </div>


      {/* Account Security */}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border">

        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <FaLock />
          Account Security
        </h2>

        <p className="text-sm text-gray-500 mb-4">
          Change your account password securely.
        </p>

        <button
          onClick={() => navigate("/reset-password")}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
        >
          Change Password
        </button>

      </div>





      {/* Notification Settings */}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border">

        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <FaBell />
          Notifications
        </h2>

        <div className="flex justify-between items-center">

          <div>

            <p className="font-medium">Journal Alerts</p>
            <p className="text-sm text-gray-500">
              Receive updates for new journals
            </p>

          </div>

          <input
            type="checkbox"
            checked={emailNotif}
            onChange={() => setEmailNotif(!emailNotif)}
            className="w-5 h-5"
          />

        </div>

      </div>

    </div>

  );

};

export default Settings;