export const parseRoles = (roles: string): Array<string> => {
  // backend return something like
  // `{"Analyze data","Use data","Create data"}`
  // so make array
  const toParse = roles.replaceAll('{', '[').replaceAll('}', ']');

  return JSON.parse(toParse);
};
