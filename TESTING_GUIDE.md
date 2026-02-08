# Testing Guide - Smart Attendance System

This guide will help you test the Smart Attendance System locally before deploying.

## Prerequisites Checklist

✅ Node.js installed (check: `node --version`)  
✅ MongoDB installed or MongoDB Atlas account  
✅ Modern web browser (Chrome recommended)  
✅ Code editor (VS Code recommended)

## Step 1: Setup MongoDB

### Option A: Local MongoDB
```bash
# Install MongoDB (if not already installed)
# For Ubuntu/Linux:
sudo apt-get install mongodb

# Start MongoDB
mongod

# Or if using MongoDB as a service:
sudo systemctl start mongodb
```

### Option B: MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a new cluster (free tier)
4. Get connection string (something like: `mongodb+srv://username:password@cluster.mongodb.net/attendance`)

## Step 2: Setup Backend

1. **Open Terminal/Command Prompt**
```bash
cd path/to/smart-attendance-system/backend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Configure Environment Variables**
   - Open `backend/.env` file
   - Update these values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/attendance-system
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/attendance
   JWT_SECRET=my_super_secret_key_12345
   NODE_ENV=development
   ```

4. **Start Backend Server**
```bash
npm start
```

**Expected Output:**
```
🚀 Server running on port 5000
✅ MongoDB Connected Successfully
```

**Troubleshooting:**
- If MongoDB connection fails, check if MongoDB is running
- If port 5000 is busy, change PORT in .env
- Check MongoDB URI is correct

## Step 3: Setup Frontend

1. **Open New Terminal Window** (keep backend running)
```bash
cd path/to/smart-attendance-system/frontend
```

2. **Update API URL (if needed)**
   - Open `frontend/script.js`
   - Check first line: `const API_URL = 'http://localhost:5000/api';`
   - If backend is on different port, update this

3. **Start Frontend Server**

**Option A: Using Python**
```bash
python -m http.server 8000
```

**Option B: Using Node.js http-server**
```bash
npx http-server -p 8000
```

**Option C: Just open in browser**
```bash
# Simply open frontend/index.html in your browser
```

4. **Access Application**
   - Open browser
   - Go to: `http://localhost:8000`

## Step 4: Test the Application

### Test 1: Register Student Account

1. Click on "Register" tab
2. Fill in details:
   - Name: Test Student
   - Email: student@test.com
   - Password: student123
   - Role: Student
   - Roll Number: CS001
   - Department: Computer Science
   - Semester: 6
3. Click "Register"
4. Should automatically log you in
5. You should see "Student Dashboard"

**Expected Result:** ✅ Login successful, student dashboard visible

### Test 2: Register Teacher Account

1. Click "Logout"
2. Click "Register" tab
3. Fill in details:
   - Name: Test Teacher
   - Email: teacher@test.com
   - Password: teacher123
   - Role: Teacher
   - Department: Computer Science
4. Click "Register"
5. Should see "Teacher Dashboard"

**Expected Result:** ✅ Teacher dashboard with "Generate QR Code" section

### Test 3: Generate QR Code (Teacher)

1. In teacher dashboard
2. Fill in:
   - Subject: Data Structures
   - Duration: 15 minutes
3. Click "Generate QR Code"
4. **IMPORTANT:** Allow location access when browser asks
5. Should see QR code with session details

**Expected Result:** ✅ QR code displayed with session code

**Note the Session Code** - You'll need it for next test!

### Test 4: Mark Attendance (Student)

1. **Open new browser window/tab** (or use incognito)
2. Go to `http://localhost:8000`
3. Login as student:
   - Email: student@test.com
   - Password: student123
4. In "Mark Attendance" section:
   - Enter the session code from QR (from teacher dashboard)
5. Click "Mark Attendance"
6. **IMPORTANT:** Allow location access
7. Should see success message

**Expected Result:** ✅ "Attendance marked successfully"

**Troubleshooting:**
- If error about distance: Both teacher and student need same/similar location (or adjust radius in code)
- If "session expired": Generate new QR code
- If "already marked": This is correct behavior for duplicate attempts

### Test 5: View Student Stats

1. Still logged in as student
2. Check top stats cards:
   - Total Classes: Should show 1
   - Present: Should show 1
   - Attendance: Should show 100%
3. Scroll to "Recent Attendance"
4. Should see the attendance record you just marked

**Expected Result:** ✅ Stats updated, attendance record visible

### Test 6: Register Admin & View Dashboard

1. Logout
2. Register admin account:
   - Name: Test Admin
   - Email: admin@test.com
   - Password: admin123
   - Role: Admin
3. Should see admin dashboard with:
   - Total Students: 1
   - Total Teachers: 1
   - Today's Attendance: 1
   - Overall %: 100%

**Expected Result:** ✅ Admin dashboard with correct statistics

### Test 7: View All Students (Admin)

1. In admin dashboard
2. Click "All Students" tab
3. Should see table with student info:
   - Roll No: CS001
   - Name: Test Student
   - Attendance: 100%

**Expected Result:** ✅ Student list displayed

### Test 8: Test Defaulters (Admin)

1. Click "Defaulters" tab
2. Should show: "🎉 No defaulters! All students have good attendance."
3. (This is correct since student has 100% attendance)

**Expected Result:** ✅ No defaulters shown

### Test 9: Generate Report (Admin)

1. Click "Reports" tab
2. Leave date fields empty (to get all records)
3. Click "Generate Report"
4. Should see table with attendance records
5. Click "Export as CSV"
6. Should download CSV file

**Expected Result:** ✅ Report generated and CSV downloaded

### Test 10: Test Teacher Login

1. Logout
2. Login as teacher:
   - Email: teacher@test.com
   - Password: teacher123
3. Should see your previously generated QR sessions

**Expected Result:** ✅ Active sessions visible

## Step 5: Test Edge Cases

### Test A: Duplicate Attendance
1. Login as student
2. Try marking attendance with same session code again
3. Should show error: "Attendance already marked"

**Expected Result:** ✅ Error shown, no duplicate attendance

### Test B: Expired Session
1. Wait 15+ minutes after generating QR
2. Try marking attendance with that code
3. Should show error: "Session has expired"

**Expected Result:** ✅ Expired session rejected

### Test C: Wrong Password
1. Try logging in with wrong password
2. Should show error: "Invalid credentials"

**Expected Result:** ✅ Login failed with error

## Step 6: Check Database

### View Data in MongoDB

**Using MongoDB Compass (GUI):**
1. Download MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Database: `attendance-system`
4. Check collections:
   - users (should have 3 users)
   - attendances (should have attendance records)
   - sessions (should have QR sessions)

**Using Mongo Shell:**
```bash
mongo
use attendance-system
db.users.find().pretty()
db.attendances.find().pretty()
db.sessions.find().pretty()
```

**Expected Result:** ✅ Data properly stored in database

## Common Issues & Solutions

### Issue 1: MongoDB Connection Error
```
❌ MongoDB Connection Error
```
**Solution:**
- Check if MongoDB is running: `sudo systemctl status mongodb`
- Start MongoDB: `sudo systemctl start mongodb`
- Or use MongoDB Atlas cloud URL

### Issue 2: Location Not Working
```
Unable to get your location
```
**Solution:**
- Click browser location permission popup
- Use Chrome/Edge (better geolocation support)
- In production, must use HTTPS

### Issue 3: Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
- Change PORT in backend/.env to 5001 or another port
- Update API_URL in frontend/script.js

### Issue 4: CORS Error
```
Access to fetch blocked by CORS policy
```
**Solution:**
- Backend already has CORS enabled
- Check API_URL in frontend matches backend URL

### Issue 5: Session Code Invalid
```
Invalid or expired session
```
**Solution:**
- Generate new QR code
- Make sure you copied full session code
- Check session hasn't expired (15 min default)

## Testing Checklist

Use this checklist to ensure everything works:

- [ ] Backend starts without errors
- [ ] MongoDB connection successful
- [ ] Frontend loads in browser
- [ ] Student registration works
- [ ] Teacher registration works
- [ ] Admin registration works
- [ ] Student can login
- [ ] Teacher can generate QR code
- [ ] Student can mark attendance
- [ ] Attendance stats update correctly
- [ ] Admin can view all students
- [ ] Report generation works
- [ ] CSV export works
- [ ] Duplicate attendance prevented
- [ ] Location verification works
- [ ] Session expiry works

## Next Steps

After successful testing:

1. ✅ Push code to GitHub
2. ✅ Deploy backend (Render/Heroku)
3. ✅ Deploy frontend (Netlify/Vercel)
4. ✅ Update API_URL for production
5. ✅ Test production deployment

## Need Help?

If you encounter issues:

1. Check browser console (F12) for errors
2. Check backend terminal for errors
3. Verify MongoDB is running
4. Check all environment variables
5. Ensure ports are not blocked by firewall

---

**Good luck with testing! 🚀**
