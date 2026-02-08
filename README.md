# Smart Attendance System 📚

A Full-Stack web application for managing student attendance using QR codes and geolocation verification.

## 🎯 Project Overview

The Smart Attendance System is a modern solution for educational institutions to track student attendance efficiently. Teachers can generate QR codes with geolocation data, and students can mark their attendance by scanning these codes while being physically present in the classroom.

## ✨ Key Features

### For Students
- 📊 View real-time attendance statistics
- 📱 Mark attendance via QR code scanning
- 📍 Geolocation-based attendance verification
- 📜 View attendance history

### For Teachers
- 🔲 Generate QR codes for attendance sessions
- ⏱️ Set custom session durations
- 📍 Location-based session creation
- 👁️ View active sessions

### For Admins
- 📈 Comprehensive dashboard with analytics
- 👥 View all students with attendance stats
- ⚠️ Track defaulters (below 75% attendance)
- 📊 Generate and export attendance reports (CSV)
- 📉 Subject-wise attendance analytics

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication & authorization
- **bcryptjs** - Password encryption
- **qrcode** - QR code generation

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with modern design
- **Vanilla JavaScript** - No frameworks
- **Fetch API** - API communication

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)
- Modern web browser

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/smart-attendance-system.git
cd smart-attendance-system
```

2. **Setup Backend**
```bash
cd backend
npm install
# Configure .env file with your MongoDB URI and JWT secret
npm start
```

3. **Setup Frontend**
```bash
cd ../frontend
# Open index.html in browser or use a local server
python -m http.server 8000
```

4. **Access the Application**
- Frontend: `http://localhost:8000`
- Backend API: `http://localhost:5000`

## 📁 Project Structure

```
smart-attendance-system/
├── backend/
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Auth middleware
│   ├── server.js         # Entry point
│   ├── .env              # Environment variables
│   └── package.json
├── frontend/
│   ├── index.html        # Main HTML
│   ├── styles.css        # Styling
│   ├── script.js         # JavaScript logic
│   └── README.md
└── README.md
```

## 🔐 User Roles & Permissions

| Feature | Student | Teacher | Admin |
|---------|---------|---------|-------|
| Mark Attendance | ✅ | ❌ | ❌ |
| Generate QR Code | ❌ | ✅ | ✅ |
| View Own Stats | ✅ | ✅ | ✅ |
| View All Students | ❌ | ✅ | ✅ |
| Generate Reports | ❌ | ✅ | ✅ |
| View Defaulters | ❌ | ✅ | ✅ |

## 🎨 Screenshots

### Student Dashboard
- View attendance percentage
- Mark attendance with session code
- See recent attendance records

### Teacher Dashboard
- Generate QR codes for classes
- View active sessions
- Track attendance in real-time

### Admin Dashboard
- Overall statistics
- Student management
- Attendance reports and analytics

## 🔧 Configuration

### Backend Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/attendance-system
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

### Frontend API Configuration
Update `script.js`:
```javascript
const API_URL = 'http://localhost:5000/api';
```

## 📊 How It Works

1. **Teacher generates QR code**
   - Selects subject and duration
   - System captures teacher's location
   - QR code contains session details

2. **Student scans QR code**
   - Enters session code from QR
   - System captures student's location
   - Verifies student is within 100m radius

3. **Attendance is marked**
   - If location is valid, attendance is recorded
   - Student can't mark duplicate attendance
   - Records stored in database

4. **Analytics & Reports**
   - Real-time statistics
   - Attendance percentage calculations
   - Exportable CSV reports

## 🌐 Deployment

### Backend (Render/Heroku)
1. Create account on Render/Heroku
2. Connect GitHub repository
3. Set environment variables
4. Deploy

### Frontend (Netlify/Vercel)
1. Create account on Netlify/Vercel
2. Connect GitHub repository
3. Update API_URL to production backend
4. Deploy

## 🧪 Testing

### Test User Accounts

**Student:**
- Email: student@example.com
- Password: student123
- Roll Number: CS001

**Teacher:**
- Email: teacher@example.com
- Password: teacher123

**Admin:**
- Email: admin@example.com
- Password: admin123

(Create these accounts after starting the application)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Attendance Endpoints
- `POST /api/attendance/generate-qr` - Generate QR code
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/my-attendance` - Get student attendance

### Admin Endpoints
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/students` - All students
- `GET /api/admin/defaulters` - Students below 75%
- `GET /api/admin/attendance-report` - Generate report

## 🐛 Known Issues

- Geolocation may not work on HTTP (use HTTPS in production)
- QR code scanning requires manual code entry (camera scanning not implemented)

## 🔮 Future Enhancements

- [ ] Camera-based QR code scanning
- [ ] Email notifications for low attendance
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Attendance predictions using ML
- [ ] Face recognition integration

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Nandeesha B**
- Email: bnandeesh92@gmail.com
- GitHub: [Your GitHub Profile]
- LinkedIn: [Your LinkedIn Profile]

## 🙏 Acknowledgments

- FastAPI documentation
- MongoDB documentation
- MDN Web Docs for geolocation API
- QRCode.js library

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Email: bnandeesh92@gmail.com

---

⭐ If you find this project useful, please give it a star on GitHub!
