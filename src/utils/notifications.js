export const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
        console.log("Browser does not support notifications");
        return false;
    }

    if (Notification.permission === "granted") return true;

    if (Notification.permission !== "denied") {
        const permission = await Notification.permission;
        if (permission === "granted") return true;

        // Use the modern promise-based request
        const result = await Notification.requestPermission();
        return result === "granted";
    }

    return false;
};

export const sendBrowserNotification = (title, options = {}) => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
        return;
    }

    const defaultOptions = {
        icon: '/favicon.ico', // Adjust path if needed
        badge: '/favicon.ico',
        silent: false,
        ...options
    };

    return new Notification(title, defaultOptions);
};
