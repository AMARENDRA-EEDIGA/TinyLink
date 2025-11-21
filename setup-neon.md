# Neon Database Setup

## 1. Create Neon Database
1. Go to https://neon.tech
2. Sign up/login with GitHub
3. Create new project
4. Copy the connection string

## 2. Set Vercel Environment Variables
1. Go to https://vercel.com/dashboard
2. Select your project: tiny-link-seven
3. Go to Settings → Environment Variables
4. Add these variables:

```
DATABASE_URL = postgresql://username:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
BASE_URL = https://tiny-link-seven.vercel.app
```

## 3. Deploy Database Schema
Run locally with Neon URL:
```powershell
# Temporarily update .env with Neon URL
npx prisma db push
```

## 4. Redeploy
Push any change to trigger redeploy or use Vercel dashboard.