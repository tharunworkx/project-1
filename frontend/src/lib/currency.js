/**
 * Currency and Number Formatting Utilities
 * Optimized for Indian Rupee (INR) and easily extensible for USD, EUR, GBP.
 */

export const formatCurrency = (amount, currency = 'INR', showDecimals = true) => {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return currency === 'INR' ? '₹0' : '$0';
  }

  const num = Number(amount);

  if (currency === 'INR') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
    }).format(num);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(num);
};

export const formatCompactNumber = (amount, currency = 'INR') => {
  if (amount === undefined || amount === null || isNaN(Number(amount))) return '0';
  const num = Number(amount);
  const prefix = currency === 'INR' ? '₹' : '$';

  if (currency === 'INR') {
    if (num >= 10000000) {
      return `${prefix}${(num / 10000000).toFixed(2)} Cr`;
    }
    if (num >= 100000) {
      return `${prefix}${(num / 100000).toFixed(2)} L`;
    }
    if (num >= 1000) {
      return `${prefix}${(num / 1000).toFixed(1)}k`;
    }
  }

  return `${prefix}${num.toLocaleString()}`;
};

export const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return dateInput;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return dateInput;
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

