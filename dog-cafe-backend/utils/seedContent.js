const mongoose = require('mongoose');
const Content = require('../models/Content');
const config = require('../config/config');

const dummyContent = [
    {
        type: 'terms',
        content: {
            en: `# Terms of Service

## 1. Acceptance of Terms
By accessing and using OnDogDog Cafe services, you agree to these terms.

## 2. Services
- Cafe visits with dogs
- Dog adoption services
- Dog swimming pool
- Special events

## 3. Reservations
- 24-hour advance booking required
- Cancellation policy applies
- Maximum group size: 5 people

## 4. Safety Rules
- All dogs must be vaccinated
- Dogs must be leashed when required
- Owners are responsible for their dogs

## 5. Changes to Terms
We reserve the right to modify these terms at any time.`,
            zh: `# 服務條款

## 1. 接受條款
使用OnDogDog咖啡館服務即表示您同意這些條款。

## 2. 服務項目
- 與狗狗一起的咖啡時光
- 狗狗領養服務
- 狗狗游泳池
- 特別活動

## 3. 預約規定
- 需提前24小時預約
- 取消政策適用
- 最大團體人數：5人

## 4. 安全規則
- 所有狗狗必須接種疫苗
- 必要時狗狗需繫繩
- 主人需為狗狗負責

## 5. 條款修改
我們保留隨時修改這些條款的權利。`
        }
    },
    {
        type: 'privacy',
        content: {
            en: `# Privacy Policy

## 1. Information We Collect
- Personal information
- Reservation details
- Pet information

## 2. How We Use Your Information
- Process reservations
- Send notifications
- Improve our services

## 3. Data Security
We implement security measures to protect your information.

## 4. Information Sharing
We do not sell your personal information to third parties.

## 5. Cookies
We use cookies to enhance your experience.

## 6. Your Rights
You have the right to access and control your data.`,
            zh: `# 隱私政策

## 1. 我們收集的信息
- 個人信息
- 預約詳情
- 寵物信息

## 2. 如何使用您的信息
- 處理預約
- 發送通知
- 改善服務

## 3. 數據安全
我們實施安全措施保護您的信息。

## 4. 信息共享
我們不會將您的個人信息出售給第三方。

## 5. Cookies
我們使用cookies來提升您的體驗。

## 6. 您的權利
您有權訪問和控制您的數據。`
        }
    }
];

const seedContent = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(config.database.url, config.database.options);
        console.log('Connected to MongoDB');

        // Clear existing content
        await Content.deleteMany({});
        console.log('Cleared existing content');

        // Insert new content
        await Content.insertMany(dummyContent);
        console.log('Successfully seeded content');

        // Disconnect
        await mongoose.disconnect();
        console.log('Database connection closed');

    } catch (error) {
        console.error('Error seeding content:', error);
        process.exit(1);
    }
};

// Run the seeding
seedContent();
