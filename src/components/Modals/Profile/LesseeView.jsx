import { Button, Form } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { Input } from 'antd'
import { Alert } from 'antd'
import { LesseProfileInfoMessage } from './constants'
import { educationEmailValidation } from 'src/utils/regex'
import { Upload } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { FlexEnd } from 'src/global-styles/utils'
import { getLesseeProfile, saveLesseeProfile } from 'src/apis/profileSetup'
import { useSelector } from 'react-redux'
import { Spin } from 'antd'
import { useState } from 'react'
import { useEffect } from 'react'
import { Tag } from 'antd'
const { Dragger } = Upload

const LesseeView = () => {
  const [form] = useForm()
  const user = useSelector((state) => state.auth.user)
  const [loading, setLoading] = useState(false)
  const [isDisabled, setDisabled] = useState(false)
  const [formValues, setFormValues] = useState(null)

  useEffect(() => {
    getInitialData()
  }, [])

  const getInitialData = async () => {
    const res = await getLesseeProfile(user.userId)
    if (res && res.data) {
      form.setFieldsValue({
        name: res.data.name,
        email: res.data.email,
        idCardName: res.data.document.file_name,
      })
      setFormValues({
        isEmailVerified: res.data.is_email_verified,
        isDocumentVerified: res.data.is_document_verified,
      })
      setDisabled(true)
    }
  }

  const onFinish = () => {
    form.validateFields().then(async (values) => {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('email', values.email)
      formData.append('document', values.idCard.file.originFileObj)
      setLoading(true)
      const response = await saveLesseeProfile(user.userId, formData)
      getInitialData()
      setLoading(false)
    })
  }

  return (
    <Spin indicator={<LoadingOutlined spin />} spinning={loading} size="large">
      <Alert description={LesseProfileInfoMessage} type="info" />
      <br />
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        disabled={isDisabled}
      >
        <Form.Item
          name="name"
          rules={[{ required: true, message: 'Please enter your full name' }]}
        >
          <Input placeholder="Enter your full name" />
        </Form.Item>
        <Form.Item
          name="email"
          rules={[
            {
              pattern: educationEmailValidation,
              message: 'Please enter a valid university email!',
            },
            { required: true, message: 'Please enter email address' },
          ]}
        >
          <Input
            placeholder="Enter your University email"
            suffix={
              formValues && (
                <Tag color={formValues.isEmailVerified ? 'success' : 'warning'}>
                  {formValues.isEmailVerified
                    ? 'Email Verified'
                    : 'Email Verification Pending'}
                </Tag>
              )
            }
          />
        </Form.Item>
        {!isDisabled && (
          <Form.Item
            name="idCard"
            rules={[
              {
                message: 'Please upload a file',
                validator: (_, value) => {
                  if (value && value.fileList.length === 1) {
                    return Promise.resolve()
                  }
                  return Promise.reject()
                },
              },
            ]}
          >
            <Dragger maxCount={1}>Upload your university ID Card</Dragger>
          </Form.Item>
        )}
        {isDisabled && (
          <Form.Item name="idCardName">
            <Input
              placeholder="University Id"
              suffix={
                <Tag
                  color={formValues.isDocumentVerified ? 'success' : 'warning'}
                >
                  {formValues.isDocumentVerified
                    ? 'Document Verified'
                    : 'Document verification Pending'}
                </Tag>
              }
            />
          </Form.Item>
        )}
        <Form.Item>
          <FlexEnd>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </FlexEnd>
        </Form.Item>
      </Form>
    </Spin>
  )
}

export default LesseeView
