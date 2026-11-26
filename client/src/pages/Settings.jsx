import { useEffect, useState } from "react";
import "./Settings.css";

function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications");
    const savedDarkMode = localStorage.getItem("darkMode");

    if (savedNotifications !== null) {
      setNotifications(savedNotifications === "true");
    }

    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("notifications", notifications.toString());
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString());

    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const handleNotifications = () => {
    setNotifications((prev) => !prev);
  };

  const handleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className="settings-page">
      <h1>Settings</h1>
      <p className="settings-subtitle">
        Manage your SkillSwap preferences
      </p>

      <div className="settings-box">

        {/* Notifications */}
        <div className="setting-item">
          <div className="setting-info">
            <h3>Notifications</h3>
            <p>Receive notifications about SkillSwap</p>
          </div>

          <button
            type="button"
            className={`setting-toggle ${notifications ? "active" : ""
              }`}
            onClick={handleNotifications}
          >
            <span className="toggle-circle"></span>
          </button>
        </div>

        {/* Dark Mode */}
        <div className="setting-item">
          <div className="setting-info">
            <h3>Dark Mode</h3>
            <p>Change the appearance of the website</p>
          </div>

          <button
            type="button"
            className={`setting-toggle ${darkMode ? "active" : ""
              }`}
            onClick={handleDarkMode}
          >
            <span className="toggle-circle"></span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default Settings;