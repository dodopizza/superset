// DODO created 44136746
export const formatDurationHMMSS = (milliSeconds: number): string => {
  const totalSeconds = Math.floor(milliSeconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
};
