let debounceTimer: NodeJS.Timeout | null = null;

export const validateSubdomain = (val: string): string | null => {
  if (!val) return "Subdomain is required";
  if (!/^[a-z0-9-]+$/.test(val))
    return "Only lowercase letters, numbers and hyphens are allowed";
  if (!/^[a-z]/.test(val)) return "Must start with a letter";
  if (val.length < 3) return "Must be at least 3 characters long";
  if (val.length > 30) return "Must not exceed 30 characters";
  if (/--/.test(val)) return "Cannot contain consecutive hyphens";
  return null;
};

export const debounceCheckDomain = (
  value: string,
  callback: (val: string) => void,
  delay = 500
) => {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    callback(value);
  }, delay);
};
