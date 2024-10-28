import { useLocation } from "react-router-dom";

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function getValue(item, keys) {
  if (keys.length === 1) {
    return item[keys[0]];
  }
  let value = item;

  keys.forEach((key) => {
    value = value[key];
  });

  return value;
}
