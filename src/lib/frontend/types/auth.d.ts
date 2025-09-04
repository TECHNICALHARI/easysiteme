type LoginWith = "email" | "mobile";

interface AuthFormData {
  email: string;
  mobile: string;
  password: string;
  otp: string;
  showPass: boolean;
  useOtp: boolean;
  otpSent: boolean;
  loginWith: LoginWith;
}

interface AuthSignupData {
  subdomain: string;
  email: string;
  mobile: string;
  password: string;
  showPass: boolean;
  emailVerified: boolean;
  mobileVerified: boolean;
  emailOtp: string;
  mobileOtp: string;
}
