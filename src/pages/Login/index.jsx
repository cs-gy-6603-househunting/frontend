import { LoginContainer, LoginWrapper, TabPane, TitleContainer } from './styles'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import { Tabs } from 'antd'
import { useNavigate } from 'react-router-dom'
import './index.less'
import { useState } from 'react'

const Login = ({ newAccount = false }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState(newAccount ? 'register' : 'login')

  const getForm = () => {
    return (
      <Tabs
        centered
        activeKey={activeTab}
        onChange={onChange}
        items={[
          {
            key: 'login',
            label: 'Sign In',
            children: (
              <TabPane>
                <LoginForm />
              </TabPane>
            ),
          },
          {
            key: 'register',
            label: 'Register',
            children: (
              <TabPane>
                <RegisterForm onChange={onChange} />
              </TabPane>
            ),
          },
        ]}
      />
    )
  }

  const onChange = (key) => {
    navigate(`/${key}`)
    setActiveTab(key)
  }

  return (
    <LoginWrapper>
      <LoginContainer>
        <TitleContainer>
          {newAccount ? 'Welcome!' : 'Welcome Back!'}
        </TitleContainer>
        {getForm()}
      </LoginContainer>
    </LoginWrapper>
  )
}

export default Login
