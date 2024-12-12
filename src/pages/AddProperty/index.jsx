import { useState } from 'react'
import {
  Input,
  Button,
  Row,
  Col,
  Card,
  Form,
  Select,
  Flex,
  Modal,
  Alert,
  Steps,
  Checkbox,
  Upload,
  DatePicker,
  Empty,
  InputNumber,
} from 'antd'

import Icon, {
  PlusOutlined,
  PictureOutlined,
  LoadingOutlined,
  ReloadOutlined,
  EditOutlined,
} from '@ant-design/icons'

import { useEffect } from 'react'
import propertiesService from 'src/apis/propertiesService'
import { CTAS, ScrollablePageContent } from 'src/global-styles/utils'
import { useForm } from 'antd/es/form/Form'
import dayjs from 'dayjs'
import { App } from 'antd'
import { Spin } from 'antd'
import { Image } from 'antd'
import { range } from 'src/utils/utils'
import {
  addPropertyModalDescription,
  amenitiesList,
  propertyTypes,
  states,
  steps,
} from './constants'

const { Option } = Select
const { TextArea } = Input
const { Dragger } = Upload

const AddProperty = () => {
  const [isAddPropertyModalOpen, setIsAddPropertyModalOpen] = useState(false)

  const [addProperyModalCurrentStep, setAddProperyModalCurrentStep] =
    useState(0)

  const items = steps.map((item) => ({ key: item.title, title: item.title }))

  const [form] = useForm()
  const [fileList, setFileList] = useState([])
  const { notification } = App.useApp()
  const [isLoading, setLoading] = useState(false)
  const [propertyListing, setPropertyListing] = useState([])
  const [initialValues, setInitailValues] = useState(null)
  const [isEdit, setIdEdit] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

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

    form.validateFields(['media'])
    return false
  }

  const visibleFileList = fileList.filter(
    (file) => file.status !== 'removed' && file.status !== 'ignored'
  )

  const handleUploadChange = ({ file }) => {
    setFileList([
      ...fileList,
      { uid: file.uid, status: 'new', originFileObj: file, name: file.name },
    ])
  }

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewOpen(true)
  }

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })

  const onFinish = () => {
    form.validateFields().then(async () => {
      const formValues = form.getFieldsValue(true)
      const requestObj = {
        ...formValues,
        available_since: formValues.available_since.format('YYYY-MM-DD'),
        amenities: amenitiesList.reduce((acc, amenity) => {
          acc[amenity.value] = formValues.amenities.includes(amenity.value)
          return acc
        }, {}),
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
    form.validateFields().then(async (values) => {
      if (!isEdit && addProperyModalCurrentStep === 0) {
        const requestObj = {
          street_address: values.street_address,
          city: values.city,
          state: values.state,
          zip_code: values.zip_code,
        }
        setLoading(true)
        const response = await propertiesService.validateAddress(requestObj)
        setLoading(false)
        if (response.success && response.data.legit) {
          setAddProperyModalCurrentStep(addProperyModalCurrentStep + 1)
        } else {
          notification.error({
            message: 'Invalid Address',
            description: 'Please provide a valid address',
          })
          return
        }
      }
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
                          <Input placeholder="Street Address" disabled={isEdit}/>
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
                          <Input placeholder="City" disabled={isEdit}/>
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
                          initialValue={'NY'}
                        >
                          <Select disabled={true}>
                            {states.map((item) => (
                              <Option key={item.value} value={item.value}>
                                {item.label}
                              </Option>
                            ))}
                          </Select>
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
                            {
                              pattern: /^[0-9]\d{4}$/,
                              message: 'Please enter valid zipcode',
                            },
                          ]}
                          initialValue={
                            isEdit ? initialValues.address.zip_code : ''
                          }
                        >
                          <Input placeholder="Zip Code" disabled={isEdit}/>
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
                          <Select placeholder="Select type of property" disabled={isEdit}>
                            {propertyTypes.map((property_type) => (
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
                          <Select placeholder="Select number of bedrooms" disabled={isEdit}>
                            {range(5).map((item) => (
                              <Option key={item} value={item}>
                                {item}
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
                          <Select placeholder="Select number of bathrooms" disabled={isEdit}>
                            {range(5).map((item) => (
                              <Option key={item} value={item}>
                                {item}
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
                        disabled={isEdit}
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
                          {amenitiesList.map((amenity) => (
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
                    <Form.Item
                      label="Media Upload"
                      name="media"
                      rules={[
                        {
                          message: 'Maximum 3 images can only be uploaded',
                          validator: () => {
                            if (visibleFileList.length < 4)
                              return Promise.resolve()
                            return Promise.reject()
                          },
                        },
                      ]}
                    >
                      <Dragger
                        fileList={visibleFileList}
                        onRemove={handleRemove}
                        onChange={handleUploadChange}
                        beforeUpload={() => false}
                        listType="picture-card"
                        onPreview={handlePreview}
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
                    {previewImage && (
                      <Image
                        wrapperStyle={{
                          display: 'none',
                        }}
                        preview={{
                          visible: previewOpen,
                          onVisibleChange: (visible) => setPreviewOpen(visible),
                          afterOpenChange: (visible) =>
                            !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                      />
                    )}
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
