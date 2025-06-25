const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const Filter = require('bad-words');
const { body, validationResult } = require('express-validator');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

// Initialize profanity filter
const filter = new Filter();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-supabase-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rate limiting for comment submissions
const commentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many comments submitted. Please try again later.',
    retryAfter: 3600
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Serve static files from the current directory
app.use(express.static('.'));

// Input validation middleware
const validateComment = [
  body('username')
    .trim()
    .isLength({ min: 2, max: 50 })
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage('Username must be 2-50 characters and contain only letters, numbers, and spaces'),
  body('comment_text')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Comment must be 10-500 characters long'),
];

// API Routes

// GET /api/comments - Retrieve comments with pagination
app.get('/api/comments', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const { data, error, count } = await supabase
      .from('comments')
      .select('*', { count: 'exact' })
      .order('timestamp', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch comments' });
    }

    res.json({
      comments: data || [],
      totalCount: count || 0,
      currentPage: page,
      totalPages: Math.ceil((count || 0) / limit),
      hasMore: offset + limit < (count || 0)
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/comments - Create a new comment
app.post('/api/comments', commentLimiter, validateComment, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { username, comment_text } = req.body;
    const ip_address = req.ip || req.connection.remoteAddress;

    // Check for profanity
    if (filter.isProfane(username) || filter.isProfane(comment_text)) {
      return res.status(400).json({
        error: 'Comment contains inappropriate content'
      });
    }

    // Clean the content
    const cleanUsername = filter.clean(username);
    const cleanComment = filter.clean(comment_text);

    // Insert comment into database
    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          username: cleanUsername,
          comment_text: cleanComment,
          ip_address: ip_address,
          timestamp: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return res.status(500).json({ error: 'Failed to save comment' });
    }

    res.status(201).json({
      message: 'Comment added successfully',
      comment: data
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/comments/:id - Delete a comment (for moderation)
app.delete('/api/comments/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase delete error:', error);
      return res.status(500).json({ error: 'Failed to delete comment' });
    }

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle routes for your HTML files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/comments', (req, res) => {
  res.sendFile(path.join(__dirname, 'comments.html'));
});

app.get('/timeline', (req, res) => {
  res.sendFile(path.join(__dirname, 'timeline.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Make sure to set SUPABASE_URL and SUPABASE_ANON_KEY environment variables');
});