/**
 * Format a date string to a readable format
 * @param {string} dateString - Date string to format
 * @param {boolean} includeTime - Whether to include time in the formatted string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString, includeTime = true) => {
    if (!dateString) return '';
    
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  /**
   * Get relative time (e.g., "2 days ago", "in 3 hours")
   * @param {string} dateString - Date string to format
   * @returns {string} Relative time string
   */
  export const getRelativeTime = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((date - now) / 1000);
    
    if (Math.abs(diffInSeconds) < 60) {
      return diffInSeconds >= 0 ? 'in a few seconds' : 'a few seconds ago';
    }
    
    const diffInMinutes = Math.floor(Math.abs(diffInSeconds) / 60);
    if (diffInMinutes < 60) {
      return diffInSeconds >= 0 
        ? `in ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}` 
        : `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return diffInSeconds >= 0 
        ? `in ${diffInHours} hour${diffInHours > 1 ? 's' : ''}` 
        : `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return diffInSeconds >= 0 
        ? `in ${diffInDays} day${diffInDays > 1 ? 's' : ''}` 
        : `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    // For older dates, return the formatted date
    return formatDate(dateString);
  };
  
  export default {
    formatDate,
    getRelativeTime
  };

  //dateFormatter