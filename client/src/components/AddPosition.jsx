import React, { useState } from 'react';
import { Form, Input, Button, Collapse, Select, Space, notification } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;

const AddPosition = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    axios.post('/api/positions/bulk', { positions: values.positions })
      .then(response => {
        notification.success({
          message: 'Positions Added',
          description: `All positions were added successfully.`,
        });
        setLoading(false);
      })
      .catch(error => {
        notification.error({
          message: 'Error',
          description: 'There was an error adding the positions.',
        });
        setLoading(false);
      });
  };

  return (
    <Form
      name="add-multiple-positions"
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 800, margin: '0 auto' }}
      initialValues={{ positions: [{}] }}
    >
      <Form.List name="positions">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }, index) => (
              <Space key={key} direction="vertical" style={{ display: 'block', marginBottom: 24 }}>
                <Collapse defaultActiveKey={[key]}>
                  <Panel header={`Position ${index + 1}`} key={key}>
                    <Form.Item
                      {...restField}
                      name={[name, 'title']}
                      fieldKey={[fieldKey, 'title']}
                      label="Job Title"
                      rules={[{ required: true, message: 'Please enter the job title' }]}
                    >
                      <Input placeholder="e.g. Frontend Developer" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'division']}
                      fieldKey={[fieldKey, 'division']}
                      label="Division"
                      rules={[{ required: true, message: 'Please select the division' }]}
                    >
                      <Select placeholder="Select a division">
                        <Option value="Engineering">Engineering</Option>
                        <Option value="Marketing">Marketing</Option>
                        <Option value="HR">HR</Option>
                        <Option value="Others">Others</Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'location']}
                      fieldKey={[fieldKey, 'location']}
                      label="Location"
                      rules={[{ required: true, message: 'Please enter the location' }]}
                    >
                      <Input placeholder="e.g. New York, NY" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'summary']}
                      fieldKey={[fieldKey, 'summary']}
                      label="Job Summary"
                      rules={[{ required: true, message: 'Please enter the job summary' }]}
                    >
                      <TextArea rows={3} placeholder="Provide a brief summary of the job" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'description']}
                      fieldKey={[fieldKey, 'description']}
                      label="Job Description"
                      rules={[{ required: true, message: 'Please enter the job description' }]}
                    >
                      <TextArea rows={4} placeholder="Provide a detailed description of the job" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'requirements']}
                      fieldKey={[fieldKey, 'requirements']}
                      label="Requirements"
                      rules={[{ required: true, message: 'Please enter the job requirements' }]}
                    >
                      <TextArea rows={4} placeholder="List the qualifications and skills required" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'responsibilities']}
                      fieldKey={[fieldKey, 'responsibilities']}
                      label="Responsibilities"
                      rules={[{ required: true, message: 'Please enter the job responsibilities' }]}
                    >
                      <TextArea rows={4} placeholder="Describe the main responsibilities of the role" />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, 'image']}
                      fieldKey={[fieldKey, 'image']}
                      label="Image URL"
                      rules={[{ required: true, message: 'Please enter the image URL' }]}
                    >
                      <Input placeholder="URL of the image to be displayed with the job post" />
                    </Form.Item>
                  </Panel>
                </Collapse>

                <Button
                  type="danger"
                  onClick={() => remove(name)}
                  icon={<MinusCircleOutlined />}
                  style={{ marginBottom: 16 }}
                  block
                >
                  Remove Position
                </Button>
              </Space>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
                block
              >
                Add Another Position
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item style={{ marginTop: 16 }}>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Submit All Positions
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddPosition;

/*
 * Copyright © 2024 Selin Sezer. All rights reserved.
 */