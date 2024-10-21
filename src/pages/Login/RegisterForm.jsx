import { Button, Input } from "antd";
import { Form } from "antd";
import { TitleContainer } from "./styles";
import { FlexEnd } from "src/global-styles/utils";
import { Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "src/apis/newUser";
import { MOCK_USER_SIGNUP } from "./__test__/constants";
import { phoneNumberValidation } from "src/utils/regex";

const RegisterForm = () => {
  const [form] = useForm();
  const navigate = useNavigate();

  const onFinish = () => {
    form.validateFields().then(async (values) => {
      const requestObj = {
        email: values.email.trim(),
        password: values.password,
        phoneNumber: {
          code: values.code,
          number: values.phone,
        },
      };

      //   const res = registerUser(requestObj);
      const res = MOCK_USER_SIGNUP;

      if (res.success) {
        navigate("/login");
      }
    });
  };

  const initialValues = {
    code: "1",
  };

  const prefixSelector = (
    <Form.Item name="code" noStyle>
      <Select style={{ width: 70 }}>
        <Select.Option value="1">+1</Select.Option>
        <Select.Option value="91">+91</Select.Option>
      </Select>
    </Form.Item>
  );
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark="optional"
      style={{ width: "70%" }}
      initialValues={initialValues}
    >
      <TitleContainer>Register</TitleContainer>
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
      <Form.Item
        name="phone"
        label="Phone Number"
        rules={[
          {
            pattern: phoneNumberValidation,
            message: "PLease enter valid number!",
          },
          { required: true, message: "Please input your phone number!" },
        ]}
      >
        <Input addonBefore={prefixSelector} style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item>
        <FlexEnd>
          <Button type="primary" htmlType="submit">
            Sign Up
          </Button>
        </FlexEnd>
      </Form.Item>
    </Form>
  );
};

export default RegisterForm;
