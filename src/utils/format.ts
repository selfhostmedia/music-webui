export function formatDateToRelative(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  if (diff < 60_000) {
    const quantity = Math.floor(diff / 1000);
    return quantity > 1 ? `${quantity} seconds ago` : `${quantity} second ago`;
  }
  if (diff < 60 * 60_000) {
    const quantity = Math.floor(diff / 1000 / 60);
    return quantity > 1 ? `${quantity} minutes ago` : `${quantity} minute ago`;
  }
  if (diff < 24 * 60 * 60_000) {
    const quantity = Math.floor(diff / 1000 / 60 / 60);
    return quantity > 1 ? `${quantity} hours ago` : `${quantity} hour ago`;
  }
  const quantity = Math.floor(diff / 1000 / 60 / 60 / 24);
  return quantity > 1 ? `${quantity} days ago` : `yesterday`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

export function formatSize(size: number): string {
  if (size >= 1e9) {
    return `${(size / 1e9).toFixed(2)} GB`;
  }
  if (size >= 1e6) {
    return `${(size / 1e6).toFixed(2)} MB`;
  }
  if (size >= 1e3) {
    return `${(size / 1e3).toFixed(2)} KB`;
  }
  return `${size} B`;
}
