import { useEffect, useState } from "react";
import "./NotificationToast.css";

function NotificationToast() {
    const [notification, setNotification] = useState(null);
    const [knownNotifications, setKnownNotifications] = useState([]);

    const userEmail =
        localStorage.getItem("userEmail") || "";

    useEffect(() => {
        if (!userEmail) return;

        const fetchNotifications = async () => {
            try {
                const response = await fetch(
                    `http://localhost:5000/api/notifications/${encodeURIComponent(
                        userEmail
                    )}`
                );

                if (!response.ok) return;

                const data = await response.json();

                if (!Array.isArray(data) || data.length === 0) {
                    return;
                }

                // First load: don't show old notifications
                if (knownNotifications.length === 0) {
                    setKnownNotifications(
                        data.map((item) => item._id)
                    );
                    return;
                }

                // Find newly created notification
                const newNotification = data.find(
                    (item) =>
                        !knownNotifications.includes(item._id)
                );

                if (newNotification) {
                    setNotification(newNotification);

                    setKnownNotifications(
                        data.map((item) => item._id)
                    );

                    // Mark notification as read
                    await fetch(
                        `http://localhost:5000/api/notifications/${newNotification._id}/read`,
                        {
                            method: "PATCH",
                        }
                    );
                }
            } catch (error) {
                console.error(
                    "Notification fetch error:",
                    error
                );
            }
        };

        fetchNotifications();

        // Check every 3 seconds
        const interval = setInterval(
            fetchNotifications,
            3000
        );

        return () => clearInterval(interval);
    }, [userEmail, knownNotifications]);

    // Auto close after 5 seconds
    useEffect(() => {
        if (!notification) return;

        const timer = setTimeout(() => {
            setNotification(null);
        }, 5000);

        return () => clearTimeout(timer);
    }, [notification]);

    if (!notification) {
        return null;
    }

    return (
        <div className="notification-toast">

            <button
                className="notification-close"
                onClick={() => setNotification(null)}
            >
                ×
            </button>

            <div className="notification-icon">
                🔔
            </div>

            <div className="notification-content">

                <h4>
                    {notification.title}
                </h4>

                <p>
                    {notification.message}
                </p>

            </div>

        </div>
    );
}

export default NotificationToast;
