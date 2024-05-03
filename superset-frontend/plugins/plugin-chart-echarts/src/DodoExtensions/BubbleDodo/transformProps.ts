// Regexp for the label added to time shifted series
// (1 hour offset, 2 days offset, etc.)
const TIME_SHIFT_PATTERN = /\d+ \w+ offset/;

export function formatLabel(input, verboseMap = {}) {
  // The input for label may be a string or an array of string
  // When using the time shift feature, the label contains a '---' in the array
  const verboseLookup = s => verboseMap[s] || s;

  return Array.isArray(input) && input.length > 0
    ? input
        .map(l => (TIME_SHIFT_PATTERN.test(l) ? l : verboseLookup(l)))
        .join(', ')
    : verboseLookup(input);
}

export default function transformProps(chartProps: any) {
  const { height, width, queriesData, datasource } = chartProps;

  console.log(`transformProps chartProps`, chartProps);

  const rawData = queriesData[0].data || [];
  try {
    const data = Array.isArray(rawData)
      ? rawData.map(row => ({
          ...row,
          values: row.values.map(value => ({ ...value })),
          key: formatLabel(row.key, datasource.verboseMap),
        }))
      : rawData;

    console.log(`transformProps data`, data);
  } catch (error) {}

  console.log(`chartProps`, chartProps);

  return {
    height,
    width,
  };
}
