import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Button, message, Table, Input } from 'antd';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const { Search } = Input;

const AdminDashboard = () => {
  const [role, setRole] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({ position_status: null, status: null });
  const history = useHistory();

  useEffect(() => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      message.error('You are not authorized to view this page');
      history.push('/adminlogin');
      return;
    }

    const decoded = jwtDecode(token);
    setRole(decoded.role);

    fetchApplications(token, pagination.current, pagination.pageSize, searchText, filters);
  }, [history, pagination.current, pagination.pageSize, searchText, filters]);

  const fetchApplications = (token, currentPage, pageSize, searchText, filters) => {
    setLoading(true);

    axios
      .get('/api/adminapplications', {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page: currentPage,
          pageSize,
          search: searchText,
          ...filters,
        },
      })
      .then((response) => {
        setApplications(response.data.applications);
        setPagination((prev) => ({
          ...prev,
          total: response.data.total,
        }));
        setLoading(false);
      })
      .catch(() => {
        message.error('Failed to load applications');
        setLoading(false);
      });
  };

  const handleTableChange = (newPagination, newFilters) => {
    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));

    setFilters(newFilters);

    fetchApplications(
      sessionStorage.getItem('token'),
      newPagination.current,
      newPagination.pageSize,
      searchText,
      newFilters
    );
  };

  const handleSearch = (value) => {
    setSearchText(value);

    // Reset to the first page on a new search
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));

    fetchApplications(
      sessionStorage.getItem('token'),
      1, // Reset to the first page
      pagination.pageSize,
      value,
      filters
    );
  };

  const handleFeedbackClick = (application) => {
    history.push(`/application-with-feedback/${application.id}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'rgba(255, 165, 0, 0.2)';
      case 'reviewed':
        return 'rgba(0, 123, 255, 0.2)';
      case 'finalized':
        return 'rgba(40, 167, 69, 0.2)';
      default:
        return '';
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'user_name',
      key: 'user_name',
      sorter: (a, b) => a.user_name.localeCompare(b.user_name),
    },
    {
      title: 'Position Name',
      dataIndex: 'position_title',
      key: 'position_title',
      sorter: (a, b) => a.position_title.localeCompare(b.position_title),
    },
    {
      title: 'Email',
      dataIndex: 'user_email',
      key: 'user_email',
    },
    {
      title: 'Division',
      dataIndex: 'position_division',
      key: 'position_division',
    },
    {
      title: 'Application Status',
      dataIndex: 'status',
      key: 'status',
      filters: [
        { text: 'Pending', value: 'Pending' },
        { text: 'Reviewed', value: 'Reviewed' },
        { text: 'Finalized', value: 'Finalized' },
      ],
      filterMultiple: false,
      onFilter: (value, record) => record.status === value,
      render: (text) => {
        const getText = (text) => {
          switch (text) {
            case 'pending':
              return 'Pending';
            case 'reviewed':
              return 'Reviewed';
            case 'finalized':
              return 'Finalized';
            default:
              return text;
          }
        };
        const color = getStatusColor(text);
        return (
          <span
            style={{
              backgroundColor: color,
              padding: '5px 10px',
              borderRadius: '4px',
              display: 'inline-block',
            }}
          >
            {getText(text)}
          </span>
        );
      },
    },
    {
      title: 'Position Status',
      dataIndex: 'position_status',
      key: 'position_status',
      filters: [
        { text: 'Active', value: 1 },
        { text: 'Passive', value: 0 },
      ],
      filterMultiple: false,
      onFilter: (value, record) => record.position_status === value,
      render: (text) => (text === 1 ? 'Active' : 'Passive'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <Button
          type="default"
          onClick={() => handleFeedbackClick(record)}
          style={{ backgroundColor: '#1890ff', color: '#fff' }}
        >
          Details
        </Button>
      ),
    },
  ];

  const expandedRowRender = (record) => {
    const detailColumns = [
      { title: 'Cover Letter', dataIndex: 'cover_letter', key: 'cover_letter' },
      { title: 'Created At', dataIndex: 'created_at', key: 'created_at', render: (text) => new Date(text).toLocaleString() },
      { title: 'Updated At', dataIndex: 'updated_at', key: 'updated_at', render: (text) => new Date(text).toLocaleString() },
    ];

    return (
      <>
        <Table
          columns={detailColumns}
          dataSource={[record]}
          pagination={false}
          showHeader={true}
          rowKey="id"
        />
      </>
    );
  };

  return (
    <div className="admin-dashboard">
      <Search
        placeholder="Search applications"
        onSearch={handleSearch}
        style={{ marginBottom: 20 }}
        className="search-input"
      />
      <Table
        columns={columns}
        dataSource={applications}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        expandable={{ expandedRowRender }}
        rowKey="id"
        className="custom-table"
      />
    </div>
  );
};

export default AdminDashboard;

/*
 * Copyright © 2024 Selin Sezer. All rights reserved.
 */