import { Button, Input, Radio } from 'antd'
import { Form } from 'antd'
import { FlexEnd } from 'src/global-styles/utils'
import { Select } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { registerUser } from 'src/apis/newUser'
import { MOCK_USER_SIGNUP } from './__test__/constants'
import { phoneNumberValidation } from 'src/utils/regex'
import { UserRoles } from 'src/utils/enum'
import { notification } from 'antd'

const RegisterForm = ({ onChange }) => {
  const [form] = useForm()
  const [api, contextHolder] = notification.useNotification()

  const openNotification = (description) => {
    api.error({
      message: 'Registration Failed',
      description: description,
    })
  }

  const onFinish = () => {
    form.validateFields().then(async (values) => {
      const requestObj = {
        email: values.email.trim(),
        password: values.password,
        phone_number: values.phone,
        phone_code: values.code,
        role: values.role,
      }

      const res = await registerUser(requestObj)
      // const res = MOCK_USER_SIGNUP

      if (res && res.error) {
        //handle error
        const { error } = res
        if (error.email) {
          console.log('Email Error:', error.email[0])
          openNotification(error.email[0])
        } else if (error.non_field_errors) {
          console.log(`${error.non_field_errors[0]}`)
          openNotification(error.non_field_errors[0])
        }
      } else if (res) {
        onChange('login')
        form.resetFields()
      }
    })
  }

  const initialValues = {
    code: '1',
  }

  const prefixSelector = (
    <Form.Item name="code" noStyle>
      <Select>
        <Select.Option value="1">+1</Select.Option>
        <Select.Option value="91">+91</Select.Option>
      </Select>
    </Form.Item>
  )
  return (
    <>
      {contextHolder}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              type: 'email',
              message: 'Please enter a valid email!',
            },
            { required: true, message: 'Please enter email address' },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password' }]}
        >
          <Input.Password placeholder="Your Password" />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[
            {
              pattern: phoneNumberValidation,
              message: 'PLease enter valid number!',
            },
            { required: true, message: 'Please input your phone number!' },
          ]}
        >
          <Input addonBefore={prefixSelector} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="role"
          label="I am a"
          layout="horizontal"
          rules={[{ required: true, message: 'Please select a Choice!' }]}
        >
          <Radio.Group>
            <Radio value={UserRoles.Lessee}>Lessee</Radio>
            <Radio value={UserRoles.Lessor}>Lessor</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <FlexEnd>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </FlexEnd>
        </Form.Item>
      </Form>
    </>
  )
}

export default RegisterForm
