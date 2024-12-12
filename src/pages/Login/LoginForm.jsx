import { Button, Input, Modal } from 'antd'
import { Form } from 'antd'
import { TitleContainer } from './styles'
import { Link } from 'react-router-dom'
import { CTAS, FlexEnd, FlexLinear } from 'src/global-styles/utils'
import { useAuth } from 'src/components/AuthProvider'
import { useForm } from 'antd/es/form/Form'
import { useDispatch } from 'react-redux'
import { saveUserInfo } from 'src/utils/redux/authSlice'
import { authenticateUser } from 'src/apis/authenticate'
import { MOCK_USER_LOGIN } from './__test__/constants'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { verificationCodeValidation } from 'src/utils/regex'
import EmailVerification from 'src/components/Modals/EmailVerification'
import { CUSTOM_STATUS } from 'src/utils/enum'
import { App } from 'antd'

const LoginForm = () => {
  const [form] = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { login } = useAuth()
  const { notification } = App.useApp()

  const onFinish = () => {
    form.validateFields().then(async (values) => {
      const requestObj = {
        email: values.email.trim(),
        password: values.password,
      }
      const res = await authenticateUser(requestObj)

      if (res && res.error) {
        const error = res.error
        if (CUSTOM_STATUS.INVALID_EMAIL_PASSWORD === error.status)
          notification.error({
            message: 'Login Failed',
            description: error.message,
          })
      } else if (res && res.token) {
        const token = res.token
        const refreshToken = res.refreshToken
        const user = res.user

        dispatch(saveUserInfo({ user, token, refreshToken }))
        login({
          token: token,
          refreshToken: refreshToken,
          user: user,
        })
        navigate('/')
      }
    })
  }

  return (
    <>
      <Form form={form} layout="vertical" onFinish={onFinish}>
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
        {/* <Link>Forgot Password?</Link> */}
        <Form.Item>
          <FlexEnd>
            <Button type="primary" htmlType="submit">
              Sign In
            </Button>
          </FlexEnd>
        </Form.Item>
      </Form>
    </>
  )
}

export default LoginForm
