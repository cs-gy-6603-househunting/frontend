import {
  LoginContainer,
  LoginFormWrapper,
  LoginWrapper,
  LogoWrapper,
} from "./styles";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const Login = ({ newAccount = false }) => {
  const getForm = () => {
    if (newAccount) {
      return <RegisterForm />;
    } else {
      return <LoginForm />;
    }
  };

  return (
    <LoginWrapper>
      <LoginContainer>
        <LogoWrapper>House Hunt</LogoWrapper>
        <LoginFormWrapper>{getForm()}</LoginFormWrapper>
      </LoginContainer>
    </LoginWrapper>
  );
};

export default Login;
