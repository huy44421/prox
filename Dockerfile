# استخدم Node.js الرسمي (خفيف)
FROM node:18-slim

# أنشئ مجلد العمل
WORKDIR /app

# انسخ ملفات التعريف
COPY package*.json ./

# ثبّت المكتبات (ما عندناش مكتبات كثيرة هنا)
RUN npm install --production

# انسخ باقي الملفات
COPY . .

# المنفذ اللي Cloud Run يتوقعه
EXPOSE 8080

# شغل التطبيق
CMD ["npm", "start"]
