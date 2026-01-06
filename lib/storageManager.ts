export const calculateStorageSize = () => {
  let total = 0;
  for (const key in localStorage) {
    if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
      total += (localStorage[key].length + key.length) * 2; // Roughly 2 bytes per char (UTF-16)
    }
  }
  return total / (1024 * 1024); // Size in MB
};

export const pruneState = (state: any) => {
  const MAX_MB = 4.5;
  const currentSize = calculateStorageSize();

  if (currentSize < MAX_MB) return state;

  console.warn(`Storage limit approaching (${currentSize.toFixed(2)}MB). Pruning history...`);

  // Pruning Strategy: Oldest Chat and Algorithm Tests first
  const newState = { ...state };

  if (newState.chatHistory && newState.chatHistory.length > 20) {
    newState.chatHistory = newState.chatHistory.slice(-20); // Keep only last 20 messages
  }

  if (newState.algorithmTests && newState.algorithmTests.length > 10) {
    newState.algorithmTests = newState.algorithmTests.slice(-10); // Keep only last 10 tests
  }

  if (newState.decisionLogs && newState.decisionLogs.length > 10) {
    newState.decisionLogs = newState.decisionLogs.slice(-10); // Keep only last 10 logs
  }

  return newState;
};
