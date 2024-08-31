import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import { useParams, useHistory } from 'react-router-dom';
import { Card, Button, List, Spin, Typography, Select, Input, Form, Alert, notification, Popover, Tooltip, Modal, message } from 'antd';
import { UserOutlined, MailOutlined, LinkOutlined, CommentOutlined, DownloadOutlined, ArrowLeftOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const ApplicationDetails = () => {
    const token = sessionStorage.getItem('token');
    const { id } = useParams();
    const history = useHistory();
    const [application, setApplication] = useState(null);
    const [profileLinks, setProfileLinks] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [newFeedback, setNewFeedback] = useState({ type: '', description: '' });
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitMessage, setSubmitMessage] = useState('');
    const [role, setRole] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false); // For confirmation dialog

    useEffect(() => {
        if (!token) {
            message.error('You are not authorized to view this page');
            history.push('/adminlogin');
            return;
        }

        // Decode the token to get role
        const decoded = jwtDecode(token);
        setRole(decoded.role);

        const fetchApplicationDetails = async () => {
            try {
                const response = await axios.get(`/api/application-with-feedback/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setApplication(response.data.application);
                setFeedback(response.data.feedback);
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchProfileLinks = async () => {
            try {
                const response = await axios.get(`/api/application-profile-links/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfileLinks(response.data.profile_links);
            } catch (err) {
                setError(err.message);
            }
        };

        const fetchFiles = async () => {
            try {
                const response = await axios.get(`/api/application-files/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFiles(response.data.files);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchApplicationDetails();
        fetchProfileLinks();
        fetchFiles();
        setLoading(false);
    }, [id, token, history]);

    const handleFeedbackChange = (value, fieldName) => {
        setNewFeedback({
            ...newFeedback,
            [fieldName]: value
        });
    };

    const handleFeedbackSubmit = async (values) => {
        try {
            const response = await axios.post('/api/feedback', {
                applicationId: id,
                type: values.type,
                description: values.description,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            setSubmitMessage(response.data.message);
            const updatedFeedbackResponse = await axios.get(`/api/application-with-feedback/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFeedback(updatedFeedbackResponse.data.feedback);
            setNewFeedback({ type: '', description: '' });
        } catch (err) {
            setSubmitMessage(`Error: ${err.response?.data?.error || err.message}`);
        }
    };

    const handleGoBack = () => {
        // Show modal only if feedback is not empty
        if (newFeedback.type || newFeedback.description) {
            setIsModalVisible(true);
        } else {
            history.goBack();
        }
    };

    const handleConfirmGoBack = () => {
        history.goBack();
        setIsModalVisible(false);
    };

    const handleCancelGoBack = () => {
        setIsModalVisible(false);
    };

    const handleDownloadFile = (fileId, fileName) => {
        window.location.href = `/api/download-file/${fileId}`;
    };

    const handleHireClick = async () => {
        try {
            const response = await axios.put(`/api/applications/${id}/status`, {
                status: 'finalized'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            notification.success({
                message: response.data.message,
                placement: 'topRight'
            });
            const updatedApplicationResponse = await axios.get(`/api/application-with-feedback/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setApplication(updatedApplicationResponse.data.application);
        } catch (err) {
            notification.error({
                message: `Error: ${err.response?.data?.error || err.message}`,
                placement: 'topRight'
            });
        }
    };

    if (loading) return <Spin size="large" tip="Loading..." />;
    if (error) return <p>Error: {error}</p>;

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px' }}>
            <div style={{ flex: 2, marginRight: '20px' }}>
                <Tooltip title="Return to the previous page without making any changes">
                    <Button 
                        icon={<ArrowLeftOutlined />} 
                        onClick={handleGoBack} 
                        style={{ marginBottom: '20px' }}
                    >
                        Go Back
                    </Button>
                </Tooltip>

                <Title level={2}>Application Details</Title>
                
                {application ? (
                    <Card
                        title={<Title level={3}>Application Info</Title>}
                        extra={
                            role === 'Owner' && application.status === 'finalized' ? (
                                <Button type="primary" disabled onClick={handleHireClick}>
                                    Hired
                                </Button>
                            ) : role === 'Owner' ? (
                                <Button type="primary" onClick={handleHireClick}>
                                    Hire
                                </Button>
                            ) : null
                        }
                        style={{ marginBottom: '20px' }}
                    >
                        <Paragraph>
                            <UserOutlined /> <strong>Name:</strong> {application.user_name}
                        </Paragraph>
                        <Paragraph>
                            <MailOutlined /> <strong>Email:</strong> {application.user_email}
                        </Paragraph>
                        <Paragraph>
                            <CommentOutlined /> <strong>Cover Letter:</strong> {application.cover_letter}
                        </Paragraph>
                    </Card>
                ) : (
                    <p>No application details available</p>
                )}

                {profileLinks.length > 0 ? (
                    <Card title={<Title level={3}>Profile Links</Title>} style={{ marginBottom: '20px' }}>
                        <List
                            itemLayout="horizontal"
                            dataSource={profileLinks}
                            renderItem={link => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<LinkOutlined />}
                                        title={<a href={link.link} target="_blank" rel="noopener noreferrer">{link.link}</a>}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                ) : (
                    <Card title={<Title level={3}>Profile Links</Title>} style={{ marginBottom: '20px' }}>
                        <Paragraph>No profile links available.</Paragraph>
                    </Card>
                )}

                <Card title={<Title level={3}>Files</Title>} style={{ height: '100%', marginTop: '20px' }}>
                    {files.length > 0 ? (
                        <List
                            itemLayout="vertical"
                            dataSource={files}
                            renderItem={file => (
                                <List.Item key={file.id}>
                                    <Title level={4}>{file.file_name}</Title>
                                    <Button
                                        icon={<DownloadOutlined />}
                                        onClick={() => handleDownloadFile(file.id, file.file_name)}
                                    >
                                        Download
                                    </Button>
                                </List.Item>
                            )}
                        />
                    ) : (
                        <p>No files available</p>
                    )}
                </Card>

                <Card title={<Title level={3}>Submit Feedback</Title>} style={{ marginTop: '20px' }}>
                    <Form onFinish={handleFeedbackSubmit}>
                        <Form.Item label="Feedback Type" name="type" rules={[{ required: true, message: 'Please select a feedback type!' }]}>
                            <Select
                                placeholder="Select feedback type"
                                value={newFeedback.type}
                                onChange={(value) => handleFeedbackChange(value, 'type')}
                                disabled={role === 'Viewer' ? true : false}
                            >
                                <Option value="positive">Positive</Option>
                                <Option value="negative">Negative</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please enter feedback description!' }]}>
                            <Input.TextArea
                                value={newFeedback.description}
                                onChange={(e) => handleFeedbackChange(e.target.value, 'description')}
                                rows={4}
                                disabled={role === 'Viewer' ? true : false}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" disabled={role === 'Viewer' ? true : false}>
                                Submit
                            </Button>
                        </Form.Item>
                    </Form>
                    {submitMessage && <Alert message={submitMessage} type="info" />}
                </Card>
            </div>

            <div style={{ flex: 1, marginTop:50}}>
                <Card title={<Title level={3}>Feedback</Title>} style={{ height: '100%', marginTop: '80px' }}>
                    {feedback.length > 0 ? (
                        <List
                            itemLayout="vertical"
                            dataSource={feedback}
                            renderItem={fb => (
                                <List.Item key={fb.id}>
                                    <Title level={4}>{fb.admin_username}</Title>
                                    <Paragraph><strong>Feedback Type:</strong> {fb.type}</Paragraph>
                                    <Paragraph><strong>Comments:</strong> {fb.description}</Paragraph>
                                    <Paragraph><strong>Created At:</strong> {new Date(fb.created_at).toLocaleString()}</Paragraph>
                                </List.Item>
                            )}
                        />
                    ) : (
                        <p>No feedback available</p>
                    )}
                </Card>
            </div>
            <Modal
                title="Confirm Navigation"
                visible={isModalVisible}
                onOk={handleConfirmGoBack}
                onCancel={handleCancelGoBack}
                okText="Yes"
                cancelText="No"
            >
                <p>Are you sure you want to go back? Unsaved changes might be lost.</p>
            </Modal>
        </div>
    );
};

export default ApplicationDetails;
