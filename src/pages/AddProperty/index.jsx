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
  Empty,
  notification,
  InputNumber,
} from 'antd'

import Icon, {
  PlusOutlined,
  PictureOutlined,
  LoadingOutlined,
  ReloadOutlined,
  EditOutlined,
} from '@ant-design/icons'

import { Formik, Field, ErrorMessage, useFormik } from 'formik'
import * as Yup from 'yup'
import { useEffect } from 'react'
import propertiesService from 'src/apis/propertiesService'
import { CTAS, ScrollablePageContent } from 'src/global-styles/utils'
import { useForm } from 'antd/es/form/Form'
import dayjs from 'dayjs'
import { App } from 'antd'
import { Spin } from 'antd'

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
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false)

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

  const [form] = useForm()
  const [fileList, setFileList] = useState([])
  const { notification } = App.useApp()
  const [isLoading, setLoading] = useState(false)
  const [propertyListing, setPropertyListing] = useState([])
  const [initialValues, setInitailValues] = useState(null)
  const [isEdit, setIdEdit] = useState(false)

  const handleAddPropertyModalOpen = (isEdit, initialValues) => {
    setIdEdit(isEdit)
    form.resetFields()

    if (isEdit && initialValues) {
      const existingFileList = initialValues.images.map((item) => {
        return {
          uid: item.id,
          name: item.file_name,
          url: item.url,
          status: 'done',
        }
      })
      setFileList(existingFileList)
    } else {
      setFileList([])
    }
    setIsAddPropertyModalOpen(true)
  }

  const handleAddPropertyModalClose = () => {
    setAddProperyModalCurrentStep(0)
    setIsAddPropertyModalOpen(false)
  }

  useEffect(() => {
    getPropertyListings()
  }, [])

  useEffect(() => {
    console.log(fileList)
  }, [fileList])

  const getPropertyListings = async () => {
    const res = await propertiesService.getPropertyListings()
    if (res.data) {
      setPropertyListing(res.data.properties)
    }
  }

  const handleRemove = (file) => {
    setFileList((prevList) =>
      prevList.map((item) =>
        item.uid === file.uid
          ? { ...item, status: item.url ? 'removed' : 'ignored' }
          : item
      )
    )

    return false
  }

  const visibleFileList = fileList.filter((file) => file.status !== 'removed')

  const handleUploadChange = ({ file, fileList: newFileList }) => {
    // Ensure only new files from the device are added to the list
    const updatedList = newFileList.map((f) => {
      if (!f.url) {
        // Files from the device will not have a URL; mark them as new
        return { ...f, status: 'new' }
      }
      return f
    })
    setFileList(updatedList)
  }

  const onFinish = () => {
    form.validateFields().then(async () => {
      const formValues = form.getFieldsValue(true)
      const requestObj = {
        ...formValues,
        available_since: formValues.available_since.format('YYYY-MM-DD'),
      }
      const filesToDelete = fileList.filter((file) => file.status === 'removed')
      const filesToUpload = fileList.filter((file) => file.status === 'new')

      if (isEdit) {
        setLoading(true)
        const res = await propertiesService.updatePropertyApi({
          ...requestObj,
          property_id: initialValues.id,
        })
        if (res.success) {
          const propertyId = initialValues.id
          const formData = new FormData()
          formData.append('property_id', propertyId)
          filesToUpload.forEach((file) => {
            formData.append('new_images', file.originFileObj)
          })
          formData.append(
            'deleted_images',
            JSON.stringify(filesToDelete.map((file) => file.uid))
          )
          const uploadRes = await propertiesService.propertyUploadImage(
            formData
          )
          if (uploadRes.success) {
            notification.success({
              message: 'Property Updated',
              description: 'Successfully updated property to listing',
            })
            form.resetFields()
            handleAddPropertyModalClose()
            setAddProperyModalCurrentStep(0)
          }
        }
        setLoading(false)
      } else {
        setLoading(true)
        const res = await propertiesService.listPropertyApi(requestObj)
        if (res.success) {
          const propertyId = res.data.property_id
          const formData = new FormData()
          formData.append('property_id', propertyId)
          filesToUpload.forEach((file) => {
            formData.append('new_images', file.originFileObj)
          })
          formData.append(
            'deleted_images',
            JSON.stringify(filesToDelete.map((file) => file.url))
          )
          const uploadRes = await propertiesService.propertyUploadImage(
            formData
          )
          if (uploadRes.success) {
            notification.success({
              message: 'Property Added',
              description: 'Successfully added property to listing',
            })
            form.resetFields()
            handleAddPropertyModalClose()
            setAddProperyModalCurrentStep(0)
          }
        }
        setLoading(false)
      }
      getPropertyListings()
    })
  }

  const validateFields = () => {
    form.validateFields().then(async () => {
      setAddProperyModalCurrentStep(addProperyModalCurrentStep + 1)
    })
  }

  return (
    <>
      <Flex gap="middle" justify="space-between"></Flex>
      <Modal
        title={isEdit ? 'Modify your property' : `Adding your Property`}
        open={isAddPropertyModalOpen}
        onClose={handleAddPropertyModalClose}
        onCancel={handleAddPropertyModalClose}
        width={'150vh'}
        destroyOnClose={true}
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
            <Button key="next" type="primary" onClick={onFinish}>
              {isEdit ? 'Update' : `Save`}
            </Button>
          ) : (
            <Button
              key="next"
              type="primary"
              onClick={() => {
                validateFields()
              }}
            >
              {`Next`}
            </Button>
          ),
        ]}
      >
        <Spin spinning={isLoading} indicator={<LoadingOutlined spin />}>
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
              <Form layout="vertical" variant="filled" form={form}>
                {addProperyModalCurrentStep === 0 && (
                  <>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          label="Title"
                          name="title"
                          rules={[
                            { required: true, message: 'Please enter a title' },
                          ]}
                          initialValue={isEdit ? initialValues.title : ''}
                        >
                          <Input placeholder="Title" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item
                          label="Rent"
                          name="rent"
                          rules={[
                            { required: true, message: 'Please enter a rent' },
                          ]}
                          initialValue={isEdit ? initialValues.rent : ''}
                        >
                          {/* make this input a numerical field */}
                          <InputNumber
                            placeholder="Rent"
                            style={{ width: '100%' }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* Location Fields */}
                    <Row gutter={16}>
                      <Col span={24}>
                        <Form.Item
                          name="street_address"
                          label="Location"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter a street address',
                            },
                          ]}
                          initialValue={
                            isEdit ? initialValues.address.street_address : ''
                          }
                        >
                          <Input placeholder="Street Address" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Row gutter={16}>
                      <Col span={8}>
                        <Form.Item
                          name="city"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter city',
                            },
                          ]}
                          initialValue={
                            isEdit ? initialValues.address.city : ''
                          }
                        >
                          <Input placeholder="City" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name="state"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter state',
                            },
                          ]}
                          initialValue={
                            isEdit ? initialValues.address.state : ''
                          }
                        >
                          <Input placeholder="State" />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          name="zip_code"
                          rules={[
                            {
                              required: true,
                              message: 'Please enter a zipcode',
                            },
                          ]}
                          initialValue={
                            isEdit ? initialValues.address.zip_code : ''
                          }
                        >
                          <Input placeholder="Zip Code" />
                        </Form.Item>
                      </Col>
                    </Row>

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
                          initialValue={
                            isEdit ? initialValues.details.property_type : ''
                          }
                        >
                          <Select placeholder="Select type of property">
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
                          initialValue={
                            isEdit ? initialValues.details.bedrooms : ''
                          }
                        >
                          <Select placeholder="Select number of bedrooms">
                            {bedroom_list.map((bedroom) => (
                              <Option
                                key={bedroom?.value}
                                value={bedroom?.value}
                              >
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
                          initialValue={
                            isEdit ? initialValues.details.bathrooms : ''
                          }
                        >
                          <Select placeholder="Select number of bathrooms">
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
                        {
                          required: true,
                          message: 'Please enter a description',
                        },
                      ]}
                      initialValue={
                        isEdit ? initialValues.details.description : ''
                      }
                    >
                      <TextArea
                        rows={4}
                        placeholder="Describe the property, unique features, nearby attractions, etc."
                        maxLength={255}
                      />
                    </Form.Item>

                    <Form.Item
                      label="Amenities"
                      name="amenities"
                      initialValue={
                        isEdit
                          ? Object.entries(initialValues.amenities)
                              .filter(
                                ([key, value]) =>
                                  key !== 'property_id' && value === true
                              )
                              .map(([key]) => key)
                          : []
                      }
                    >
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
                      <Dragger
                        fileList={visibleFileList}
                        onRemove={handleRemove}
                        onChange={handleUploadChange}
                        beforeUpload={() => false}
                      >
                        <p className="ant-upload-drag-icon">
                          <PictureOutlined />
                        </p>
                        <p className="ant-upload-text">
                          Click or drag file to this area to upload
                        </p>
                        <p className="ant-upload-hint">
                          Support for a single or bulk upload. Strictly
                          prohibited from uploading company data or other banned
                          files.
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
                          name="available_since"
                          rules={[
                            { required: true, message: 'Please enter a date' },
                          ]}
                          initialValue={
                            isEdit ? dayjs(initialValues.available_since) : ''
                          }
                        >
                          <DatePicker
                            style={{ minWidth: '80%' }}
                            minDate={dayjs()}
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
                          initialValue={
                            isEdit
                              ? initialValues.details.guarantor_required
                              : null
                          }
                        >
                          <Select
                            style={{ minWidth: '80%' }}
                            options={[
                              {
                                value: true,
                                label: 'Yes',
                              },
                              {
                                value: false,
                                label: 'No',
                              },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <Form.Item
                          label="Any terms/conditions/additional notes?"
                          name="miscellaneous_text"
                          initialValue={
                            isEdit ? initialValues.addtional_notes : ''
                          }
                        >
                          <TextArea rows={4} placeholder="" maxLength={255} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </>
                )}
              </Form>
            </div>
          </ScrollablePageContent>
        </Spin>
      </Modal>
      <Card
        title="Your Properties"
        extra={
          <>
            <Button
              icon={<ReloadOutlined />}
              onClick={getPropertyListings}
              style={CTAS}
            >{`Refresh`}</Button>
            <Button
              type="primary"
              onClick={() => handleAddPropertyModalOpen(false)}
              icon={<PlusOutlined />}
            >{`Add a Property`}</Button>
          </>
        }
        style={{ minHeight: '40vh' }}
      >
        {propertyListing.length === 0 && (
          <Empty description="No properties found" />
        )}
        {propertyListing.length !== 0 &&
          propertyListing.map((item) => {
            return (
              <>
                <div style={CTAS}>{item.title}</div>
                <EditOutlined
                  onClick={() => {
                    setInitailValues(item)
                    handleAddPropertyModalOpen(true, item)
                  }}
                />
              </>
            )
          })}
      </Card>
    </>
  )
}

export default AddProperty
