# K+S Love Story Website

A beautiful, modern website showcasing Kystar and Snickers' love story with an interactive timeline and comment system.

## Features

### 🎥 Immersive Experience
- Background video with custom volume controls
- Smooth animations and transitions
- Responsive design for all devices

### 📝 Interactive Comment System
- Real-time form validation
- Profanity filtering and spam protection
- Infinite scroll pagination
- Rate limiting (5 comments per hour per IP)
- Like and report functionality

### 🛡️ Security Features
- Input sanitization and validation
- Rate limiting for API endpoints
- Profanity filtering
- XSS protection

### ♿ Accessibility
- WCAG 2.1 compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support

## Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Custom CSS with design system
- Responsive design (mobile-first)
- Progressive Web App features

### Backend
- Node.js with Express
- Supabase for database
- Rate limiting and security middleware
- RESTful API design

### Database
- PostgreSQL (via Supabase)
- Row Level Security (RLS)
- Automated timestamps and triggers

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Supabase
1. Create a new project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key
3. Create a `.env` file based on `.env.example`
4. Run the database migration:
   - Go to your Supabase dashboard
   - Navigate to SQL Editor
   - Copy and paste the contents of `supabase/migrations/create_comments_table.sql`
   - Execute the query

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
SUPABASE_URL=your-supabase-project-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
PORT=8000
```

### 4. Start the Server
```bash
npm start
```

The website will be available at `http://localhost:8000`

## API Endpoints

### GET /api/comments
Retrieve comments with pagination
- Query parameters: `page`, `limit`
- Returns: comments array, pagination info

### POST /api/comments
Create a new comment
- Body: `{ username, comment_text }`
- Rate limited: 5 requests per hour per IP
- Validates and sanitizes input

### DELETE /api/comments/:id
Delete a comment (moderation)
- Requires authentication (future enhancement)

## Database Schema

### Comments Table
- `id`: UUID (Primary Key)
- `username`: TEXT (2-50 characters)
- `comment_text`: TEXT (10-500 characters)
- `timestamp`: TIMESTAMPTZ (auto-generated)
- `ip_address`: INET (for moderation)
- `likes`: INTEGER (default 0)
- `reported`: BOOLEAN (default false)

## Security Features

### Input Validation
- Username: 2-50 characters, alphanumeric + spaces only
- Comment: 10-500 characters
- Server-side validation with express-validator

### Rate Limiting
- 5 comments per IP address per hour
- Configurable time windows and limits

### Content Filtering
- Profanity filtering using bad-words library
- Automatic content cleaning
- Report functionality for user moderation

### Database Security
- Row Level Security (RLS) enabled
- Proper access policies
- Parameterized queries prevent SQL injection

## Performance Optimizations

### Frontend
- Lazy loading and infinite scroll
- Image and font preloading
- CSS and JavaScript minification
- Service worker for offline functionality

### Backend
- Database indexing for performance
- Efficient pagination queries
- Response caching headers

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is private and proprietary.

## Support

For issues or questions, please contact the development team.