# Modern Blog Application

A full-featured blog application built with Node.js, Express, MongoDB, EJS, and Tailwind CSS.

## Features

- Create, read, update, and delete blog posts
- Comment system for each post
- Modern and responsive UI with Tailwind CSS
- Smooth animations and transitions
- Character counter for text areas
- Auto-resizing text areas
- Loading animations for form submissions

## Prerequisites

- Node.js (v14 or higher)
- MongoDB

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd blog-project
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your MongoDB connection string:
```env
MONGODB_URI=mongodb://localhost/blog-app
PORT=3000
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
blog-project/
├── models/
│   ├── Post.js
│   └── Comment.js
├── views/
│   ├── layouts/
│   │   └── main.ejs
│   └── posts/
│       ├── index.ejs
│       ├── new.ejs
│       ├── edit.ejs
│       └── show.ejs
├── public/
│   ├── css/
│   └── js/
│       └── app.js
├── routes/
│   └── posts.js
├── server.js
└── package.json
```

## Features to Add

- User authentication
- Image upload for posts
- Rich text editor
- Tags/categories for posts
- Search functionality
- Pagination
- Social sharing buttons

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.
