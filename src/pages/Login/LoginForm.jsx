import { Button, Input } from "antd";
import { Form } from "antd";
import { TitleContainer } from "./styles";
import { Link } from "react-router-dom";
import { CTAS, FlexEnd, FlexLinear } from "src/global-styles/utils";
import { useAuth } from "src/components/AuthProvider";
import { useForm } from "antd/es/form/Form";
import { useDispatch } from "react-redux";
import { saveUserInfo } from "src/utils/redux/authSlice";
import { authenticateUser } from "src/apis/authenticate";
import { MOCK_USER_LOGIN } from "./__test__/constants";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [form] = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = () => {
    form.validateFields().then(async (values) => {
      const requestObj = {
        email: values.email.trim(),
        password: values.password,
      };
      //   const res = await authenticateUser(requestObj);
      const res = MOCK_USER_LOGIN;

      if (res) {
        const token = res.token;
        const refreshToken = res.refreshToken;
        const user = res.user;
        dispatch(saveUserInfo({ token, refreshToken, user }));
        login({
          token: token,
          refreshToken: refreshToken,
          user: user,
        });
        navigate("/");
      }
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark="optional"
      style={{ width: "70%" }}
    >
      <TitleContainer>Login</TitleContainer>
      <Form.Item
        label="Email"
        name="email"
        labelAlign={"right"}
        rules={[
          {
            type: "email",
            message: "Please enter a valid email!",
          },
          { required: true, message: "Please enter email address" },
        ]}
      >
        <Input placeholder="Enter your email" />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        labelAlign={"left"}
        rules={[{ required: true, message: "Please enter your password" }]}
      >
        <Input.Password placeholder="Your Password" />
      </Form.Item>
      <FlexEnd>
        <Link>Forgot Password?</Link>
      </FlexEnd>
      <Form.Item>
        <FlexEnd>
          <Button type="primary" htmlType="submit">
            Sign In
          </Button>
        </FlexEnd>
      </Form.Item>
      <FlexEnd>
        <FlexLinear>
          <span style={CTAS}>Don't have an account?</span>
          <Link to={"/register"}>Register</Link>
        </FlexLinear>
      </FlexEnd>
    </Form>
  );
};

export default LoginForm;
