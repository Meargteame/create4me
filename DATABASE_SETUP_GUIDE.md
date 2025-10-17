# Database Setup Guide - Create4Me Platform

## 🗄️ MongoDB Configuration & Data Seeding

This guide will help you set up MongoDB and populate your database with test data for the Create4Me platform.

---

## 📋 Prerequisites

- MongoDB installed on your system
- Node.js and npm installed
- Terminal access

---

## 🚀 Quick Start

### 1. Start MongoDB Service

```bash
# On Ubuntu/Debian
sudo systemctl start mongod
sudo systemctl enable mongod  # Start on boot

# Check status
sudo systemctl status mongod
```

### 2. Seed the Database

From the project root directory:

```bash
cd backend
npx ts-node src/database/seed.ts
```

You should see output like:
```
✅ MongoDB Connected: localhost
📍 Database: create4me
🌱 Starting database seed...
🗑️ Clearing existing data...
✅ Cleared existing data
👤 Creating users...
✅ Created 7 users
✨ Creating creator profiles...
✅ Created 4 creator profiles
🚀 Creating campaigns...
✅ Created 2 campaigns
🎉 Database seeded successfully!
```

### 3. Verify Data

```bash
# Test the API
curl http://localhost:3001/api/creators

# Or use MongoDB shell
mongosh create4me --eval "db.creator_profiles.countDocuments()"
```

---

## 📊 Seeded Test Data

### Users (7 total)

#### Brands (3)
1. **Ethio Coffee Co.**
   - Email: `ethiocoffee@example.com`
   - Password: `password123`
   - Role: `brand`

2. **Addis Fashion**
   - Email: `addisfashion@example.com`
   - Password: `password123`
   - Role: `brand`

3. **Innovate Tech Hub**
   - Email: `techhub@example.com`
   - Password: `password123`
   - Role: `brand`

#### Creators (4)
1. **Hanan Yusuf** (@hanan_y)
   - Email: `hanan@example.com`
   - Password: `password123`
   - Category: Lifestyle
   - Location: Addis Ababa
   - Followers: 15,200
   - Platforms: Instagram, TikTok

2. **Dawit Getachew** (@dawit_codes)
   - Email: `dawit@example.com`
   - Password: `password123`
   - Category: Technology
   - Location: Addis Ababa
   - Followers: 8,500
   - Platforms: YouTube, Twitter

3. **Meron Tesfaye** (@meron_styles)
   - Email: `meron@example.com`
   - Password: `password123`
   - Category: Fashion
   - Location: Hawassa
   - Followers: 25,000
   - Platforms: Instagram, Pinterest

4. **Yohannes Abebe** (@yohannes_fit)
   - Email: `yohannes@example.com`
   - Password: `password123`
   - Category: Fitness
   - Location: Addis Ababa
   - Followers: 12,000
   - Platforms: Instagram, YouTube

### Campaigns (2 total)

1. **Morning Brew Coffee Launch**
   - Brand: Ethio Coffee Co.
   - Description: Launch campaign for single-origin coffee beans
   
2. **Summer Collection Showcase**
   - Brand: Addis Fashion
   - Description: Promote new summer fashion line

### Campaign Applications (3 total)

- Hanan → Morning Brew Coffee (Pending)
- Meron → Summer Collection (Approved)
- Hanan → Summer Collection (Rejected)

### Connections (3 total)

- Hanan ↔ Dawit (Accepted)
- Meron ↔ Hanan (Accepted)
- Yohannes → Hanan (Pending)

---

## 🔧 Database Configuration

### Environment Variables

The backend uses the following environment variable for database connection:

```env
# .env file location: backend/.env
DATABASE_URL="mongodb://localhost:27017/create4me"
```

### Replica Set Configuration (Optional)

If you're running MongoDB as a replica set:

```env
DATABASE_URL="mongodb://localhost:27017/create4me?replicaSet=rs0"
```

---

## 🗃️ Database Schema

### Collections

1. **users**
   - Stores all user accounts (brands, creators, admins)
   - Fields: email, passwordHash, role, name

2. **creator_profiles**
   - Extended profile data for creators
   - Fields: userId, username, displayName, avatar, bio, category, location, followers, engagement, platforms, tags

3. **campaigns**
   - Campaign postings by brands
   - Fields: userId, title, description, status, budget, deadline

4. **campaign_applications**
   - Applications from creators to campaigns
   - Fields: campaignId, creatorId, coverLetter, status

5. **connections**
   - Network connections between users
   - Fields: requesterId, receiverId, status

6. **creator_likes**
   - Track which brands liked which creators
   - Fields: brandId, creatorId

7. **creator_bookmarks**
   - Saved/bookmarked creators
   - Fields: brandId, creatorId

8. **tasks**
   - Campaign tasks and deliverables
   - Fields: campaignId, title, description, status, dueDate

9. **pages**
   - Landing pages for campaigns
   - Fields: projectId, content, published

---

## 🛠️ Common Database Operations

### Reset Database

```bash
# Drop the database
mongosh create4me --eval "db.dropDatabase()"

# Reseed
cd backend
npx ts-node src/database/seed.ts
```

### Add More Test Data

Edit the seed file at `backend/src/database/seed.ts` and add your data to the arrays, then run:

```bash
cd backend
npx ts-node src/database/seed.ts
```

### Check Database Statistics

```bash
mongosh create4me --eval "
  print('Users: ' + db.users.countDocuments());
  print('Creators: ' + db.creator_profiles.countDocuments());
  print('Campaigns: ' + db.campaigns.countDocuments());
  print('Applications: ' + db.campaign_applications.countDocuments());
"
```

### View Sample Data

```bash
# View all creators
mongosh create4me --eval "db.creator_profiles.find().pretty()"

# View all campaigns
mongosh create4me --eval "db.campaigns.find().pretty()"

# View all users
mongosh create4me --eval "db.users.find({}, {passwordHash: 0}).pretty()"
```

---

## ⚠️ Troubleshooting

### MongoDB Connection Refused

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**

1. Check if MongoDB is running:
   ```bash
   sudo systemctl status mongod
   ```

2. Start MongoDB:
   ```bash
   sudo systemctl start mongod
   ```

3. Check MongoDB logs:
   ```bash
   sudo journalctl -u mongod -f
   ```

### Duplicate Key Error

**Error:** `E11000 duplicate key error`

**Solution:** Drop the database and reseed:
```bash
mongosh create4me --eval "db.dropDatabase()"
cd backend && npx ts-node src/database/seed.ts
```

### Port Already in Use

**Error:** MongoDB can't start because port 27017 is in use

**Solution:** Find and kill the process:
```bash
lsof -i :27017
kill -9 <PID>
sudo systemctl start mongod
```

### Backend Can't Connect to Database

**Check:**

1. MongoDB is running: `sudo systemctl status mongod`
2. DATABASE_URL in `.env` is correct
3. No firewall blocking port 27017
4. Try connecting with mongosh: `mongosh create4me`

---

## 🔐 Security Notes

### Default Password

⚠️ **IMPORTANT:** All test users have the password `password123`

**For Production:**
- Change all passwords
- Use strong, unique passwords
- Enable MongoDB authentication
- Use environment variables for sensitive data

### Enable MongoDB Authentication (Production)

```bash
# Create admin user
mongosh admin --eval "
  db.createUser({
    user: 'admin',
    pwd: 'your-strong-password',
    roles: ['userAdminAnyDatabase', 'dbAdminAnyDatabase']
  })
"

# Update mongod.conf
sudo nano /etc/mongod.conf
# Add:
# security:
#   authorization: enabled

# Restart MongoDB
sudo systemctl restart mongod

# Update DATABASE_URL
DATABASE_URL="mongodb://admin:your-strong-password@localhost:27017/create4me?authSource=admin"
```

---

## 📚 Additional Resources

- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Compass](https://www.mongodb.com/products/compass) - GUI for MongoDB

---

## 🆘 Need Help?

If you encounter issues:

1. Check MongoDB status: `sudo systemctl status mongod`
2. View backend logs: `tail -f logs/backend.log`
3. Test database connection: `mongosh create4me`
4. Verify environment variables: `cat backend/.env`

---

**Last Updated:** 2024
**Database Version:** MongoDB 6.0+
**Status:** ✅ Production Ready