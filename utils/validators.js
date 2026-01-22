// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Validate collection point data
export const validateCollectionPoint = (data) => {
  const errors = [];

  if (!data.name || data.name.trim() === '') {
    errors.push('Name is required');
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email is required');
  }

  if (!data.address || data.address.trim() === '') {
    errors.push('Address is required');
  }

  if (!data.latitude || !data.longitude) {
    errors.push('Location coordinates are required');
  }

  if (!data.wasteType) {
    errors.push('Waste type is required');
  }

  if (!data.condition) {
    errors.push('Condition is required');
  }

  if (!data.yearsOfUse || isNaN(data.yearsOfUse)) {
    errors.push('Valid years of use is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
