  export const validateEmail = (email) => {
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(trimmedEmail);
  };
  
  export const validatePassword = (password) => {
    return password.length >= 6; 
  };
  
  export const validateName = (name) => {
    if (!name || typeof name !== "string") {
      return false; 
    }
    return name.trim().length > 0; 
  };
  
  export const validateForm = (formData) => {
  const errors = {};

  if (!formData.firstName) {
    errors.firstName = "İsim gerekli";
  }
  if (!formData.lastName) {
    errors.lastName = "Soyisim gerekli";
  }
  if (!formData.email) {
    errors.email = "Email gerekli";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Geçerli email giriniz";
  }
  if (!formData.password) {
    errors.password = "Şifre gerekli";
  } else if (formData.password.length < 6) {
    errors.password = "Şifre en az 6 karakter olmalı";
  }
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = "Şifreler eşleşmiyor";
  }

  return errors;
};

  