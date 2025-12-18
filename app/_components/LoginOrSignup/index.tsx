import { LoginOrSignupForm } from "./LoginOrSignupForm";

type LoginOrSignupFormProps = {
  type: "login" | "signup";
};

const LoginOrSignup = ({ type }: LoginOrSignupFormProps) => {
  return (
    <div className="w-screen">
      <LoginOrSignupForm type={type} />
    </div>
  );
};

export default LoginOrSignup;
