const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 5000;

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client')));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Database connection
const pool = mysql.createPool({
  host: 'db',
  user: 'user',
  password: 'password',
  database: 'job_application_system'
});
const JWT_SECRET = 'your_jwt_secret_key';

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // or any other directory
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Set up multer for file uploads
// const upload = multer({ dest: 'uploads/' });


const upload = multer({ storage: storage });


// API Endpoints

// Admin login route
app.post('/api/admin/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password } = req.body;

  pool.query('SELECT * FROM admins WHERE username = ?', [username], async (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
 
    const admin = results[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: admin.id, role: admin.role, division: admin.division },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  });
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, admin) => {
    if (err) {
      res.setHeader('X-Auth-Error', 'Unauthorized');
      return res.sendStatus(401);
      // return authenticateToken(req, res, next);
    }
    req.admin = admin;
    next();
  });
};

// Get all positions
app.get('/api/positions', (req, res) => {
  pool.query('SELECT * FROM positions', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// Get position by ID
app.get('/api/positions/:id', (req, res) => {
  const id = req.params.id;
  pool.query('SELECT * FROM positions WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'Position not found' });
    }
    res.json(results[0]);
  });
});

// POST multiple positions
app.post('/api/positions/bulk', (req, res) => {
  const positions = req.body.positions;

  const query = 'INSERT INTO positions (title, summary, division, location, description, requirements, responsibilities, image) VALUES ?';
  const values = positions.map(pos => [
    pos.title, pos.summary, pos.division, pos.location, pos.description, pos.requirements, pos.responsibilities, pos.image
  ]);

  pool.query(query, [values], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Positions added successfully', insertIds: results.insertId });
  });
});

// Post application
app.post('/api/applications', upload.single('file'), (req, res) => {
  const { position_id, user_name, user_email, cover_letter, profile_links = [] } = req.body;

  // Insert application into the database
  pool.query(
    'INSERT INTO applications (position_id, user_name, user_email, cover_letter) VALUES (?, ?, ?, ?)',
    [position_id, user_name, user_email, cover_letter],
    (err, results) => {
      if (err) {
        console.log('Error:', err);
        return res.status(500).json({ error: err.message });
      }

      const applicationId = results.insertId;

      // Insert profile links into the database
      profile_links.forEach((link) => {
        if (link) {
          pool.query(
            'INSERT INTO profile_links (application_id, link) VALUES (?, ?)',
            [applicationId, link],
            (err) => {
              if (err) {
                console.log('Error inserting profile link:', err);
              }
            }
          );
        }
      });

      // Handle file upload
      if (req.file) {
        const tempPath = req.file.path; // Temporary path provided by multer
        const newFileName = req.file.originalname;
        const fileType = req.file.mimetype;
        fs.readFile(tempPath, (err, fileData) => {
          if (err) {
            console.log('Error reading file:', err);
            return res.status(500).json({ error: 'Error reading file' });
          } else {
            // Insert file reference into the database
            pool.query(
              'INSERT INTO files (application_id, file_name, file_data, file_type) VALUES (?, ?, ?, ?)',
              [applicationId, newFileName, fileData.toString('base64'), fileType],
              (err) => {
                if (err) {
                  console.log('Error inserting file reference:', err);
                  return res.status(500).json({ error: 'Error inserting file reference' });
                } else {
                  res.status(201).json({ id: applicationId });
                }
              }
            );
          }
        });
      } else {
        res.status(201).json({ id: applicationId });
      }
    }
  );
});

// List applications in admin page for AdminDashboard
app.get('/api/adminapplications', authenticateToken, (req, res) => {
  const { role, division } = req.admin;
  const { page = 1, pageSize = 10, search = '' } = req.query;

  let query = `
    SELECT 
      applications.*, 
      positions.title AS position_title,
      positions.division AS position_division, 
      positions.status AS position_status 
    FROM applications 
    JOIN positions ON applications.position_id = positions.id
  `;

  let queryParams = [];

  // Conditionally add where clause based on role
  if (role === 'Owner') {
    // Owners can see all applications across all divisions
  } else if (role === 'Viewer' || role === 'Editor') {
    // Viewer and Editors can only see applications in their division
    query += ` WHERE division = ?`;
    queryParams.push(division);
  } else {
    // If the role doesn't match any known role, deny access
    return res.status(403).json({ error: 'Access denied' });
  }

  // Add search functionality
  if (search) {
    const searchQuery = `
      (applications.user_name LIKE ? OR
       applications.user_email LIKE ? OR
       positions.title LIKE ? OR
       positions.status LIKE ? OR
       positions.division LIKE ?)
    `;
    if (query.includes('WHERE')) {
      query += ` AND ${searchQuery}`;
    } else {
      query += ` WHERE ${searchQuery}`;
    }
    queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
  }

  // Pagination
  const offset = (page - 1) * pageSize;
  query += ` LIMIT ? OFFSET ?`;
  queryParams.push(Number(pageSize), Number(offset));

  // Count total results (without pagination)
  let countQuery = `
    SELECT COUNT(*) as total
    FROM applications 
    JOIN positions ON applications.position_id = positions.id
  `;
  if (role !== 'Owner') {
    countQuery += ` WHERE positions.division = ?`;
    queryParams.push(division);
  }
  pool.query(countQuery, queryParams, (err, countResult) => {
    if (err) {
      console.log(err.message)
      return res.status(500).json({ error: 'Database error' });
    }

    pool.query(query, queryParams, (err, results) => {
      if (err) {
        console.log(err.message)
      }

      res.json({
        applications: results,
        total: countResult[0].total,
        currentPage: Number(page),
        pageSize: Number(pageSize),
      });
    });
  });
});


// Post a new position
app.post('/api/positions', (req, res) => {
  const { title, summary, division, location, description, requirements, responsibilities, image, status } = req.body;

  // Validate the required fields
  if (!title || !summary || !division || !location || !description || !requirements || !responsibilities || !image) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Insert the new position into the database
  pool.query(
    'INSERT INTO positions (title, summary, division, location, description, requirements, responsibilities, image, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [title, summary, division, location, description, requirements, responsibilities, image, status || 'active'],
    (err, results) => {
      if (err) {
        console.log('Error inserting position:', err);
        return res.status(500).json({ error: err.message });
      }

      // Respond with the ID of the newly created position
      res.status(201).json({ id: results.insertId });
    }
  );
});

// Add or Update Feedback
app.post('/api/feedback', authenticateToken, (req, res) => {
  const { applicationId, type, description } = req.body;
  const adminId = req.admin.id;

  if (!applicationId || !type || !description) {
    return res.status(400).json({ error: 'Application ID, type, and description are required' });
  }

  // Check if feedback already exists for this admin and application
  pool.query('SELECT * FROM feedback WHERE application_id = ? AND admin_id = ?', [applicationId, adminId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length > 0) {
      // Update existing feedback
      pool.query(
        'UPDATE feedback SET type = ?, description = ? WHERE application_id = ? AND admin_id = ?',
        [type, description, applicationId, adminId],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to update feedback' });
          }
          res.json({ message: 'Feedback updated successfully' });
        }
      );
    } else {
      // Create new feedback
      pool.query(
        'INSERT INTO feedback (application_id, type, description, admin_id) VALUES (?, ?, ?, ?)',
        [applicationId, type, description, adminId],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to submit feedback' });
          }
          // Update the application's status to 'reviewed'
          pool.query(
            'UPDATE applications SET status = ? WHERE id = ? AND status = ?',
            ['reviewed', applicationId, 'pending'],
            (err) => {
              if (err) {
                return res.status(500).json({ error: 'Failed to update application status' });
              }
              res.status(201).json({ message: 'Feedback submitted and application status updated to reviewed' });
            }
          );
        }
      );
    }
  });
});

// Get Feedback for an Application
app.get('/api/feedback/:applicationId', authenticateToken, (req, res) => {
  const { applicationId } = req.params;

  pool.query('SELECT * FROM feedback WHERE application_id = ?', [applicationId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({ feedback: results });
  });
});

// Get Application Details with Feedback
app.get('/api/application-with-feedback/:applicationId', authenticateToken, (req, res) => {
  const { applicationId } = req.params;

  // Query for application details
  pool.query('SELECT * FROM applications WHERE id = ?', applicationId, (err, applicationResults) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (applicationResults.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const application = applicationResults[0];

    // Query for feedback
    pool.query('SELECT feedback.*, admins.username AS admin_username FROM feedback JOIN admins ON feedback.admin_id = admins.id WHERE application_id = ?', [applicationId], (err, feedbackResults) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({
        application,
        feedback: feedbackResults
      });
    });
  });
});

// Update application status
app.put('/api/applications/:id/status', authenticateToken, [
  body('status').notEmpty().withMessage('Status is required').isIn(['pending', 'reviewed', 'finalized']).withMessage('Invalid status')
], (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const { role } = req.admin;

  // Only allow role 'Owner' to update status
  if (role !== 'Owner') {
    return res.status(403).json({ error: 'Access denied' });
  }

  pool.query('SELECT status FROM applications WHERE id = ?', [id], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Application not found' });
    }

    const currentStatus = results[0].status;

    // Check if the status can be updated
    if (currentStatus === 'finalized') {
      return res.status(400).json({ message: 'Application is already finalized' });
    }

    // Update the status
    pool.query('UPDATE applications SET status = ? WHERE id = ?', [status, id], (err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: 'Application status updated successfully' });
    });
  });
});


// Get Profile Links for an Application
app.get('/api/application-profile-links/:applicationId', authenticateToken, (req, res) => {
  const { applicationId } = req.params;

  pool.query('SELECT * FROM profile_links WHERE application_id = ?', applicationId, (err, results) => {
    if (err) { 

      return res.status(500).json({ error: 'Database error' });
    }
    if (results.length === 0) {
      return res.json({ profile_links: [] });
    }

    res.json({ profile_links: results });
  });
});

// Get application files
app.get('/api/application-files/:id', (req, res) => {
  const { id } = req.params;

  pool.query(
    'SELECT * FROM files WHERE application_id = ?',
    [id],
    (err, results) => {
      if (err) {
        console.log('Error:', err);
        return res.status(500).json({ error: err.message });
      }

      // Send files data
      res.json({ files: results });
    }
  );
});

// Endpoint to download a file
app.get('/api/download-file/:id', (req, res) => {
  const { id } = req.params;

  pool.query(
    'SELECT file_name, file_type, file_data FROM files WHERE id = ?',
    [id],
    (err, results) => {
      if (err) {
        console.log('Error:', err);
        return res.status(500).json({ error: err.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'File not found' });
      }

      const file = results[0];
      res.setHeader('Content-Disposition', `attachment; filename=${file.file_name}`);
      res.setHeader('Content-Type', file.file_type);
      res.send(Buffer.from(file.file_data, 'base64'));
    }
  );
});


// Serve the React frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404;
  next(err)
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

/*
 * Copyright © 2024 Selin Sezer. All rights reserved.
 */
