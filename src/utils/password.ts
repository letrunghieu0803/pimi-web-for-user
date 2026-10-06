// Khớp CHÍNH XÁC yêu cầu `@IsStrongPassword()` mặc định phía BE (8+ ký tự, chữ hoa, chữ thường,
// số, ký tự đặc biệt) — cùng bộ quy tắc trang Quên mật khẩu (ForgotPassword.tsx) đang dùng, nên
// dùng lại luôn các key i18n `forgotPassword.toastPassword*`. Trả về key i18n của lỗi đầu tiên
// gặp phải, hoặc null nếu mật khẩu hợp lệ.
export const getPasswordErrorKey = (password: string): string | null => {
  if (!password || password.length < 8) return 'forgotPassword.toastPasswordTooShort';
  if (!/[a-z]/.test(password)) return 'forgotPassword.toastPasswordLowercase';
  if (!/[A-Z]/.test(password)) return 'forgotPassword.toastPasswordUppercase';
  if (!/[0-9]/.test(password)) return 'forgotPassword.toastPasswordNumber';
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'forgotPassword.toastPasswordSpecial';
  return null;
};
