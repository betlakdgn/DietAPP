  export const validateEmail = (email) => {
    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(trimmedEmail);
  };
  
  export const validatePassword = (password) => {
    return password.length >= 6; // Minimum 6 karakter uzunluğunda olmalı
  };
  
  export const validateName = (name) => {
    if (!name || typeof name !== "string") {
      return false; // Eğer name yoksa veya string değilse false döner
    }
    return name.trim().length > 0; // String için trim uygulayıp uzunluğunu kontrol eder
  };
  
  export const validateForm = (formData) => {
    const { firstName, lastName, email, password, confirmPassword } = formData;
  
    if (!validateName(firstName)) return "Lütfen adınızı girin.";
    if (!validateName(lastName)) return "Lütfen soyadınızı girin.";
    if (!validateEmail(email)) return "Geçerli bir e-posta adresi girin.";
    if (!validatePassword(password)) return "Şifre en az 6 karakter uzunluğunda olmalıdır.";
    if (password !== confirmPassword) return "Şifreler eşleşmiyor.";
    
    return null; // Tüm doğrulamalar geçti
  };
  