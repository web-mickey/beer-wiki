interface Sortable {
  [key: string]: any;
}

const sortArray = <T extends Sortable>(arr: T[], key: string) => {
  return arr.sort((a, b) => (a[key] > b[key] ? 1 : b[key] > a[key] ? -1 : 0));
};

export { sortArray };
