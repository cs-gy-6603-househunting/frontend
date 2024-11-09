import {
  LoginContainer,
  LoginWrapper,
  TabPane,
  TitleContainer,
} from "./styles";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import "./index.less";

const Login = ({ newAccount = false }) => {
  const navigate = useNavigate();
  const getForm = () => {
    return (
      <Tabs
        centered
        defaultActiveKey={newAccount ? "register" : "login"}
        onChange={onChange}
        items={[
          {
            key: "login",
            label: "Sign In",
            children: (
              <TabPane>
                <LoginForm />
              </TabPane>
            ),
          },
          {
            key: "register",
            label: "Register",
            children: (
              <TabPane>
                <RegisterForm />
              </TabPane>
            ),
          },
        ]}
      />
    );
  };

  const onChange = (key) => {
    navigate(`/${key}`);
  };

  return (
    <LoginWrapper>
      <LoginContainer>
        <TitleContainer>
          {newAccount ? "Welcome!" : "Welcome Back!"}
        </TitleContainer>
        {getForm()}
      </LoginContainer>
    </LoginWrapper>
  );
};

export default Login;
