// ─── Field Validators ──────────────────────────────────────────

export const required = (val) =>
  !val || !String(val).trim() ? 'This field is required.' : '';

export const minLength = (min) => (val) =>
  val && val.length < min ? `Must be at least ${min} characters.` : '';

export const maxLength = (max) => (val) =>
  val && val.length > max ? `Must be at most ${max} characters.` : '';

export const isEmail = (val) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? '' : 'Enter a valid email address.';

export const isPhone = (val) =>
  /^[6-9]\d{9}$/.test(val) ? '' : 'Enter a valid 10-digit Indian mobile number.';

export const isStrongPassword = (val) => {
  if (!val || val.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Z]/.test(val))     return 'Include at least one uppercase letter.';
  if (!/[a-z]/.test(val))     return 'Include at least one lowercase letter.';
  if (!/\d/.test(val))        return 'Include at least one number.';
  return '';
};

export const isPositiveNumber = (val) =>
  val === '' || val === undefined ? '' : Number(val) > 0 ? '' : 'Must be a positive number.';

export const isPincode = (val) =>
  /^\d{6}$/.test(val) ? '' : 'Enter a valid 6-digit pincode.';

// ─── Form-level Validators ─────────────────────────────────────

export const validateLogin = ({ email, password }) => {
  const errors = {};
  errors.email    = required(email)    || isEmail(email);
  errors.password = required(password) || minLength(8)(password);
  return errors;
};

export const validateSignup = ({ name, email, password, confirmPassword }) => {
  const errors = {};
  errors.name     = required(name) || minLength(2)(name);
  errors.email    = required(email) || isEmail(email);
  errors.password = required(password) || isStrongPassword(password);
  errors.confirmPassword = !confirmPassword
    ? 'Please confirm your password.'
    : password !== confirmPassword
    ? 'Passwords do not match.'
    : '';
  return errors;
};

export const validateProductForm = ({ name, price, stock, category, description }) => {
  const errors = {};
  errors.name        = required(name) || minLength(3)(name);
  errors.price       = required(price) || isPositiveNumber(price);
  errors.stock       = required(stock) || isPositiveNumber(stock);
  errors.category    = required(category);
  errors.description = required(description) || minLength(20)(description);
  return errors;
};

export const validateCheckout = ({ fullName, email, phone, address, city, pincode }) => {
  const errors = {};
  errors.fullName = required(fullName) || minLength(2)(fullName);
  errors.email    = required(email) || isEmail(email);
  errors.phone    = required(phone) || isPhone(phone);
  errors.address  = required(address) || minLength(10)(address);
  errors.city     = required(city);
  errors.pincode  = required(pincode) || isPincode(pincode);
  return errors;
};

// ─── Helper ────────────────────────────────────────────────────

export const hasErrors = (errors) =>
  Object.values(errors).some(e => e && e.length > 0);
