import { reduce } from "lodash";

export default function intersperse(separator) {
  return function (items) {
    return reduce(
      items,
      (acc, item, index) => (index === 0 ? [item] : [...acc, separator, item]),
      []
    );
  };
}
