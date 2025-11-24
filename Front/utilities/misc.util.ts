import { isEmpty } from "lodash";

export const clean = <T extends object>(obj: T) => {
  for (const propName in obj) {
    if (
      obj[propName] === null ||
      obj[propName] === undefined ||
      (isEmpty(obj[propName]) &&
        typeof obj[propName] !== "number" &&
        typeof obj[propName] !== "function" &&
        typeof obj[propName] !== "boolean")
    ) {
      delete obj[propName];
    }
  }
  return obj as Partial<T>;
};

export function toQueryString(fields: Record<string, unknown>): string {
  const entries = Object.entries(fields);
  if (entries.length === 0) {
    return "";
  }
  const params = entries
    .filter(([, v]) => (typeof v === "boolean" ? true : !!v))
    .map(
      ([key, val]) =>
        `${key}=${encodeURIComponent(val as string | number | boolean)}`
    );

  return `?${params.join("&")}`;
}

export function toFormData(fields: Record<PropertyKey, unknown>): FormData {
  const formData = new FormData();
  Object.keys(fields).forEach((key) => {
    const value = fields[key];
    const isMultiple = value instanceof Array && Array.isArray(value);
    if (isMultiple) {
      for (const item of value) {
        if (item) {
          formData.append(key, item as string | Blob);
        }
      }
    } else {
      formData.append(key, value as string | Blob);
    }
  });
  return formData;
}

export function truncateString(str: string, maxLength = 20): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "...";
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "GHS",
  }).format(value);
}
