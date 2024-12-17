import { Alert, Button } from 'antd'
import { brokerLicenseTypes, LessorProfileInfoMessage } from './constants'
import { useState } from 'react'
import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import { Form } from 'antd'
import { Radio } from 'antd'
import { Input } from 'antd'
import { Select } from 'antd'
import { FlexEnd } from 'src/global-styles/utils'
import {
  brokerLicenseNumberValidation,
  landlordCRFNValidation,
} from 'src/utils/regex'
import { Tag } from 'antd'
import { useForm } from 'antd/es/form/Form'
import { getLessorProfile, saveLessorProfile } from 'src/apis/profileSetup'
import { App } from 'antd'
import { useEffect } from 'react'
const { Option } = Select

const LessorView = ({ user }) => {
  const [isLoading, setLoading] = useState(false)
  const [isLandlord, setLandLord] = useState(true)
  const [isDisabled, setDisabled] = useState(false)
  const [formValues, setFormValues] = useState(null)
  const [form] = useForm()
  const { notification } = App.useApp()

  const getInitialData = async () => {
    setLoading(true)
    const res = await getLessorProfile(user.userId)
    if (res.success) {
      setLandLord(res.data.is_landlord)
      form.setFieldsValue({
        document_id: res.data.document_id,
        license_type_id: res.data.license_type_id,
        license_number: res.data.license_number,
      })
      setFormValues({
        isVerified: res.data.is_verified,
      })
      setDisabled(true)
    }
    setLoading(false)
  }

  const onFinish = () => {
    form.validateFields().then(async (values) => {
      let requestObj = {
        name: values.name,
        is_landlord: isLandlord,
      }
      if (isLandlord) {
        requestObj = { ...requestObj, document_id: values.document_id }
      } else {
        requestObj = {
          ...requestObj,
          license_type_id: values.license_type_id,
          license_number: values.license_number,
        }
      }
      setLoading(true)
      const response = await saveLessorProfile(user.userId, requestObj)
      getInitialData()
      setLoading(false)

      if (response.success) {
        notification.success({
          message: 'Profile Info Saved',
          description: 'Your information has been saved successfully',
        })
      } else if (response.error) {
        notification.error({
          message: 'Request Failed',
          description: response.message,
        })
      }
    })
  }

  useEffect(() => {
    getInitialData()
  }, [])

  return (
    <Spin
      spinning={isLoading}
      indicator={<LoadingOutlined spin />}
      size="large"
    >
      <Alert description={LessorProfileInfoMessage} type="info" />
      <br />
      <Form form={form} onFinish={onFinish} disabled={isDisabled}>
        <Form.Item label={'I am a '}>
          <Radio.Group
            onChange={(e) => setLandLord(e.target.value)}
            value={isLandlord}
          >
            <Radio value={true}>Landlord</Radio>
            <Radio value={false}>Broker</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name="name"
          initialValue={user && user.name}
          rules={[{ required: true, message: 'Please enter your full name' }]}
        >
          <Input placeholder="Enter your full name" />
        </Form.Item>
        <Form.Item name="email" initialValue={user && user.email}>
          <Input
            placeholder="Enter your email"
            disabled={true}
            suffix={
              user && (
                <Tag color={user.isVerified ? 'success' : 'warning'}>
                  {user.isVerified
                    ? 'Email Verified'
                    : 'Email Verification Pending'}
                </Tag>
              )
            }
          />
        </Form.Item>
        {isLandlord && (
          <Form.Item
            name="document_id"
            rules={[
              {
                required: true,
                message: 'Please enter Document ID number',
              },
              {
                pattern: landlordCRFNValidation,
                message: 'Please enter valid Document ID Number/CRFN',
              },
            ]}
          >
            <Input
              placeholder="Enter your Document ID Number/CRFN"
              suffix={
                formValues && (
                  <Tag color={formValues.isVerified ? 'success' : 'warning'}>
                    {formValues.isVerified
                      ? 'Document ID Verified'
                      : 'Document Verification Pending'}
                  </Tag>
                )
              }
            />
          </Form.Item>
        )}
        {!isLandlord && (
          <>
            <Form.Item
              name="license_type_id"
              rules={[
                {
                  required: true,
                  message: 'Please select a License Type',
                },
              ]}
            >
              <Select placeholder="Select License Type">
                {brokerLicenseTypes.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="license_number"
              rules={[
                {
                  required: true,
                  message: 'Please enter your License number',
                },
                {
                  pattern: brokerLicenseNumberValidation,
                  message: 'Please enter a valid license number',
                },
              ]}
            >
              <Input
                placeholder="Enter your License Reference number"
                suffix={
                  formValues && (
                    <Tag color={formValues.isVerified ? 'success' : 'warning'}>
                      {formValues.isVerified
                        ? 'License Verified'
                        : 'License Verification Pending'}
                    </Tag>
                  )
                }
              />
            </Form.Item>
          </>
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

export default LessorView
