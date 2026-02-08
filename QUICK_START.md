# Quick Start Guide - Get Running in 5 Minutes! ⚡

Follow these steps to test your Smart Attendance System RIGHT NOW.

## Step 1: Open VS Code (30 seconds)

1. Open VS Code
2. Click: File → Open Folder
3. Select the `smart-attendance-system` folder
4. You should see `backend` and `frontend` folders

## Step 2: Install MongoDB (2 minutes)

### If you DON'T have MongoDB:

**Option A: Use MongoDB Atlas (FREE Cloud - EASIEST)**
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free)
3. Create a FREE cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/...`)
6. **SAVE THIS** - you'll need it in Step 3

**Option B: Install Locally**
- Windows: Download from https://www.mongodb.com/try/download/community
- Mac: `brew install mongodb-community`
- Linux: `sudo apt-get install mongodb`

Then start MongoDB:
```bash
mongod
```

## Step 3: Setup Backend (1 minute)

1. **Open Terminal in VS Code** (View → Terminal)

2. **Navigate to backend:**
```bash
cd backend
```

3. **Install packages:**
```bash
npm install
```
(Wait for it to complete - about 30 seconds)

4. **Edit .env file:**
   - Open `backend/.env` in VS Code
   - Replace the `MONGODB_URI` line with:
   
   **If using MongoDB Atlas:**
   ```
   MONGODB_URI=your_connection_string_here
   ```
   
   **If using local MongoDB:**
   ```
   MONGODB_URI=mongodb://localhost:27017/attendance-system
   ```

5. **Start backend:**
```bash
npm start
```

You should see:
```
✅ MongoDB Connected Successfully
🚀 Server running on port 5000
```

**✅ Backend is ready!**

## Step 4: Setup Frontend (30 seconds)

1. **Open NEW terminal** (keep backend running!)
   - Click the "+" icon in terminal panel

2. **Navigate to frontend:**
```bash
cd frontend
```

3. **Start frontend:**

**If you have Python:**
```bash
python -m http.server 8000
```

**If you have Node.js only:**
```bash
npx http-server -p 8000
```

**OR just double-click:**
- Go to `frontend` folder
- Double-click `index.html`

**✅ Frontend is ready!**

## Step 5: Test It! (2 minutes)

1. **Open Browser:**
   - Go to: `http://localhost:8000`

2. **Create Student Account:**
   - Click "Register"
   - Fill in:
     - Name: John Student
     - Email: student@test.com
     - Password: test123
     - Role: Student
     - Roll Number: CS001
   - Click Register

3. **You're in!** 🎉
   - You should see the Student Dashboard

4. **Open another tab/window:**
   - Go to: `http://localhost:8000`
   - Click Register
   - Create Teacher account:
     - Name: Jane Teacher
     - Email: teacher@test.com
     - Password: test123
     - Role: Teacher

5. **Generate QR Code (Teacher):**
   - Enter Subject: "Data Structures"
   - Click "Generate QR Code"
   - **Allow location** when browser asks
   - Copy the "Session Code" shown

6. **Mark Attendance (Student):**
   - Go back to student tab
   - Paste the session code
   - Click "Mark Attendance"
   - **Allow location** when browser asks
   - You should see: "✅ Attendance marked successfully"

7. **Check Stats:**
   - Your attendance percentage should now show 100%!

**🎉 IT WORKS!**

## Troubleshooting

### MongoDB won't connect?
- Make sure MongoDB is running (if local)
- Check your connection string in `.env`
- Try using MongoDB Atlas (cloud - it's easier!)

### Location not working?
- Click "Allow" when browser asks for location
- Use Chrome or Edge (better location support)

### Port already in use?
- Change `PORT=5000` to `PORT=5001` in `backend/.env`
- Update `const API_URL = 'http://localhost:5001/api'` in `frontend/script.js`

### Can't install packages?
- Make sure you have Node.js installed: `node --version`
- Try: `npm install --legacy-peer-deps`

## What to Test Next?

✅ Login with different accounts  
✅ Try marking attendance twice (should fail)  
✅ Create admin account (role: Admin)  
✅ View all students in admin dashboard  
✅ Generate attendance report  
✅ Export CSV  

## Ready for GitHub?

Once everything works:

1. Create GitHub repository
2. Copy all files from `smart-attendance-system` folder
3. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit - Smart Attendance System"
git branch -M main
git remote add origin your-github-repo-url
git push -u origin main
```

---

**Need help?** Check `TESTING_GUIDE.md` for detailed troubleshooting!

**Ready to deploy?** Check the main `README.md` for deployment instructions!
