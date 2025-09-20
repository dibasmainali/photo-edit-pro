// Global loading state management utility

export const showGlobalLoading = (message: string = "Loading...") => {
  const event = new CustomEvent('globalLoading', {
    detail: { isLoading: true, message }
  });
  window.dispatchEvent(event);
};

export const hideGlobalLoading = () => {
  const event = new CustomEvent('globalLoading', {
    detail: { isLoading: false, message: "" }
  });
  window.dispatchEvent(event);
};

// Hook for easy usage in components
export const useGlobalLoading = () => {
  return {
    showLoading: showGlobalLoading,
    hideLoading: hideGlobalLoading
  };
};
