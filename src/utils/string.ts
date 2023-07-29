const encodeStringForSorting = (str: string) =>
  encodeURIComponent(str).replace(/%20/g, "_").toLowerCase();

export { encodeStringForSorting };
