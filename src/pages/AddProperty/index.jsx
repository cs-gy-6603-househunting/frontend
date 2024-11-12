import { useState } from 'react'
import {
  Layout,
  Menu,
  Input,
  Button,
  Row,
  Col,
  Card,
  Form,
  Select,
  Typography,
  Flex,
  Modal,
  Alert,
  Progress,
  Steps,
  Checkbox,
  Upload,
  DatePicker,
} from 'antd'

import { PlusOutlined, PictureOutlined } from '@ant-design/icons'

import { Formik, Field, ErrorMessage, useFormik } from 'formik'
import * as Yup from 'yup'
import { useEffect } from 'react'
import propertiesService from 'src/apis/propertiesService'
import { ScrollablePageContent } from 'src/global-styles/utils'

const { Header, Content, Footer } = Layout
const { Title } = Typography
const { Option } = Select
const { Search, TextArea } = Input
const { Dragger } = Upload

const properties = [
  {
    id: 1,
    title: 'Cozy Apartment in City Center',
    price: 1200,
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 2,
    title: 'Modern Studio in Suburb',
    price: 900,
    image: 'https://via.placeholder.com/300x200',
  },
  {
    id: 3,
    title: 'Spacious House Near Park',
    price: 1500,
    image: 'https://via.placeholder.com/300x200',
  },
]

const AddProperty = () => {
  const onSearch = (value) => console.log('Search value:', value)

  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false)

  const handleAddPropertyModalOpen = () => {
    setIsAddPropertyModalOpen(true)
  }

  const handleAddPropertyModalClose = () => {
    setIsAddPropertyModalOpen(false)
  }

  const addPropertyModalDescription = `We're here to make listing your property easy and flexible. You can complete the forms in any order you prefer. Each form covers a key section. Make sure to save a form when you've filled it. Once you've filled out and saved a form, you can always go back and edit it as long as the listing hasn't been submitted. After completing all sections, review your listing and submit it for verification. Once our team verifies it, your property will go live on the Listings page, and you'll be notified!`

  const [addProperyModalCurrentStep, setAddProperyModalCurrentStep] =
    useState(0)

  const steps = [
    {
      title: 'Property Overview',
      content: 'First-content',
    },
    {
      title: 'Amentities',
      content: 'Second-content',
    },
    {
      title: 'Media',
      content: 'Last-content',
    },
    {
      title: 'Final Details',
      content: 'Last-content',
    },
  ]

  const items = steps.map((item) => ({ key: item.title, title: item.title }))

  const amenities_list = [
    {
      label: 'Air Conditioning',
      value: 'air_conditioning',
    },
    {
      label: 'Parking',
      value: 'parking',
    },
    {
      label: 'Dishwasher',
      value: 'dishwasher',
    },
    {
      label: 'Heating',
      value: 'heating',
    },
    {
      label: 'Gym Access',
      value: 'gym',
    },
    {
      label: 'Refrigerator',
      value: 'refrigerator',
    },
    {
      label: 'Laundry',
      value: 'laundry',
    },
    {
      label: 'Swimming Pool',
      value: 'swimming_pool',
    },
    {
      label: 'Microwave',
      value: 'microwave',
    },
  ]

  const property_types = [
    {
      label: 'Apartment',
      value: 'apartment',
    },
    {
      label: 'House',
      value: 'house',
    },
    {
      label: 'Condo',
      value: 'condo',
    },
  ]

  const bedroom_list = [
    {
      label: '1',
      value: '1',
    },
    {
      label: '2',
      value: '2',
    },
    {
      label: '3',
      value: '3',
    },

    {
      label: '4',
      value: '4',
    },
    {
      label: '5',
      value: '5',
    },
  ]

  const bathroom_list = [
    {
      label: '1',
      value: '1',
    },
    {
      label: '2',
      value: '2',
    },
    {
      label: '3',
      value: '3',
    },

    {
      label: '4',
      value: '4',
    },
    {
      label: '5',
      value: '5',
    },
  ]

  const onAvailableDateChange = (date, dateString) => {
    console.log(date, dateString)
  }

  const formik = useFormik({
    initialValues: {
      title: '',
      street_address: '',
      city: '',
      state: '',
      zipCode: '',
      property_type: '',
      bedrooms: '',
      bathrooms: '',
      description: '',
      amenities: [],
      media: '',
      available_date: '',
      guarantor_required: '',
      miscellaneous_text: '',
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
    }),
    onSubmit: (values) => {
      console.log('Form values:', values)
      propertiesService.listPropertyApi(values).then((response) => {
        console.log('Response:', response)
      })
    },
  })

  useEffect(() => {
    console.log(formik.values)
  }, [formik.values])

  const onFinish = (values) => {
    console.log('Form values:', values)
  }

  return (
    <>
      <Flex gap="middle" justify="space-between"></Flex>
      <Modal
        title={`Adding your Property`}
        open={isAddPropertyModalOpen}
        onClose={handleAddPropertyModalClose}
        onCancel={handleAddPropertyModalClose}
        width={'150vh'}
        centered
        footer={[
          addProperyModalCurrentStep !== 0 ? (
            <Button
              key="back"
              onClick={() => {
                setAddProperyModalCurrentStep(addProperyModalCurrentStep - 1)
              }}
            >{`Previous`}</Button>
          ) : (
            <></>
          ),
          addProperyModalCurrentStep === 3 ? (
            <Button key="next" type="primary" onClick={formik.handleSubmit}>
              {`Submit`}
            </Button>
          ) : (
            <Button
              key="next"
              type="primary"
              onClick={() => {
                setAddProperyModalCurrentStep(addProperyModalCurrentStep + 1)
              }}
            >
              {`Next`}
            </Button>
          ),
        ]}
      >
        <ScrollablePageContent>
          <br />
          <Alert message={addPropertyModalDescription} type="warning" />
          <br />

          <Steps
            current={addProperyModalCurrentStep}
            items={items}
            progressDot
            style={{ marginTop: '5vh', marginBottom: '2vh' }}
          />

          <div
            style={{
              padding: '20px',
              minHeight: '45vh',
            }}
          >
            <Form layout="vertical" onFinish={onFinish} variant="filled">
              {addProperyModalCurrentStep === 0 && (
                <>
                  <Form.Item
                    label="Title"
                    name="title"
                    rules={[
                      { required: true, message: 'Please enter a title' },
                    ]}
                  >
                    <Input
                      placeholder="Title"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                    />
                  </Form.Item>

                  {/* Location Fields */}
                  <Form.Item
                    label="Location"
                    name="location"
                    rules={[
                      {
                        required: true,
                        message: 'Please provide complete location details',
                      },
                    ]}
                  >
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item name="street_address" noStyle>
                          <Input
                            placeholder="Street Address"
                            value={formik.values.street_address}
                            onChange={formik.handleChange}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <br />
                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item name="city" noStyle>
                          <Input
                            placeholder="City"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="state" noStyle>
                          <Input
                            placeholder="State"
                            value={formik.values.state}
                            onChange={formik.handleChange}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item name="zipCode" noStyle>
                          <Input
                            placeholder="Zip Code"
                            value={formik.values.zipCode}
                            onChange={formik.handleChange}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form.Item>

                  {/* Property Type and Room Information */}
                  <Row gutter={16}>
                    <Col span={8}>
                      <Form.Item
                        label="Property Type"
                        name="property_type"
                        rules={[
                          {
                            required: true,
                            message: 'Please select a property type',
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select type of property"
                          value={formik.values.property_type}
                          onChange={(e) => {
                            formik.setFieldValue('property_type', e)
                          }}
                        >
                          {property_types.map((property_type) => (
                            <Option
                              key={property_type?.value}
                              value={property_type?.value}
                            >
                              {property_type?.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Number of Bedrooms"
                        name="bedrooms"
                        rules={[
                          {
                            required: true,
                            message: 'Please select the number of bedrooms',
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select number of bedrooms"
                          value={formik.values.bedrooms}
                          onChange={(e) => {
                            formik.setFieldValue('bedrooms', e)
                          }}
                        >
                          {bedroom_list.map((bedroom) => (
                            <Option key={bedroom?.value} value={bedroom?.value}>
                              {bedroom?.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item
                        label="Number of Bathrooms"
                        name="bathrooms"
                        rules={[
                          {
                            required: true,
                            message: 'Please select the number of bathrooms',
                          },
                        ]}
                      >
                        <Select
                          placeholder="Select number of bathrooms"
                          value={formik.values.bathrooms}
                          onChange={(e) => {
                            formik.setFieldValue('bathrooms', e)
                          }}
                        >
                          {bathroom_list.map((bathroom) => (
                            <Option
                              key={bathroom?.value}
                              value={bathroom?.value}
                            >
                              {bathroom?.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
              {addProperyModalCurrentStep === 1 && (
                <>
                  <Form.Item
                    label="Property Description"
                    name="description"
                    rules={[
                      { required: true, message: 'Please enter a description' },
                    ]}
                  >
                    <TextArea
                      rows={4}
                      placeholder="Describe the property, unique features, nearby attractions, etc."
                      maxLength={255}
                      onChange={formik.handleChange}
                      value={formik.values.description}
                    />
                  </Form.Item>

                  <Form.Item label="Amenities" name="amenities">
                    <Checkbox.Group style={{ width: '100%' }}>
                      <Row gutter={16}>
                        {amenities_list.map((amenity) => (
                          <Col span={8}>
                            <Checkbox
                              key={amenity?.value}
                              value={amenity?.value}
                            >
                              {amenity?.label}
                            </Checkbox>
                          </Col>
                        ))}
                      </Row>
                    </Checkbox.Group>
                  </Form.Item>
                </>
              )}
              {addProperyModalCurrentStep === 2 && (
                <>
                  <Form.Item label="Media Upload" name="media">
                    <Dragger>
                      <p className="ant-upload-drag-icon">
                        <PictureOutlined />
                      </p>
                      <p className="ant-upload-text">
                        Click or drag file to this area to upload
                      </p>
                      <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibited
                        from uploading company data or other banned files.
                      </p>
                    </Dragger>
                  </Form.Item>
                </>
              )}
              {addProperyModalCurrentStep === 3 && (
                <>
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        label="Available Since"
                        name="available_date"
                        rules={[
                          { required: true, message: 'Please enter a date' },
                        ]}
                      >
                        <DatePicker
                          onChange={(date, dateString) => {
                            formik.setFieldValue('available_date', dateString)
                          }}
                          style={{ minWidth: '80%' }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Is Guarantor Required?"
                        name="guarantor_required"
                        rules={[
                          {
                            required: true,
                            message: 'Please provide a response',
                          },
                        ]}
                      >
                        <Select
                          style={{ minWidth: '80%' }}
                          options={[
                            {
                              value: 1,
                              label: 'Yes',
                            },
                            {
                              value: 0,
                              label: 'No',
                            },
                          ]}
                          onChange={(e) => {
                            formik.setFieldValue('guarantor_required', e)
                          }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Form.Item
                        label="Any terms/conditions/additional notes?"
                        name="miscellaneous_text"
                      >
                        <TextArea
                          rows={4}
                          placeholder=""
                          maxLength={255}
                          value={formik.values.miscellaneous_text}
                          onChange={formik.handleChange}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                </>
              )}
            </Form>
          </div>
        </ScrollablePageContent>
      </Modal>
      <Card
        title="Your Properties"
        extra={
          <Button
            type="primary"
            onClick={handleAddPropertyModalOpen}
            icon={<PlusOutlined />}
          >{`Add a Property`}</Button>
        }
      ></Card>
    </>
  )
}

export default AddProperty
