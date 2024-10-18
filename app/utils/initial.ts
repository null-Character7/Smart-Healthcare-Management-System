export const getInitials = (username: string) => {
    const nameParts = username.split(' '); // Split the username by spaces
    const initials = nameParts.map(part => part.charAt(0).toUpperCase()); // Get the first letter of each part
    return initials.slice(0, 2).join(''); // Join the first two initials
};