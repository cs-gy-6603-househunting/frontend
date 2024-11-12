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

const LoginForm = () => {
  const [form] = useForm()
  const [showVerifyDialog, setShowVerifyDialog] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { login } = useAuth()

  const onFinish = () => {
    form.validateFields().then(async (values) => {
      const requestObj = {
        email: values.email.trim(),
        password: values.password,
      }
      const res = await authenticateUser(requestObj)
      // const res = MOCK_USER_LOGIN

      if (res && res.error && res.error === 'Email Unverified') {
        setShowVerifyDialog(true)
      } else if (res && res.token) {
        const token = res.token
        const refreshToken = res.refreshToken
        const user = { role: 1 }
        dispatch(saveUserInfo({ token, refreshToken }))
        login({
          token: token,
          refreshToken: refreshToken,
          user: user,
        })
        navigate('/')
      }
    })
  }

  const onVerificationDialogClose = () => () => {
    setShowVerifyDialog(false)
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
        <Link>Forgot Password?</Link>
        <Form.Item>
          <FlexEnd>
            <Button type="primary" htmlType="submit">
              Sign In
            </Button>
          </FlexEnd>
        </Form.Item>
      </Form>
      <EmailVerification
        showVerificationDialog={showVerifyDialog}
        onClose={onVerificationDialogClose}
      />
    </>
  )
}

export default LoginForm
