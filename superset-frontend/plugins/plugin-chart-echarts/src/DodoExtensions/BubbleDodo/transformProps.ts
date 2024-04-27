export default function transformProps(chartProps: any) {
  const { height, width } = chartProps;

  console.log(`chartProps`, chartProps);
  return {
    height,
    width,
  };
}
