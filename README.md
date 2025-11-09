# SmartWallet (Hack-Cash)

A comprehensive digital wallet application designed exclusively for students. SmartWallet helps you manage your finances, track expenses, earn cashback, and achieve your financial goals with ease.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Security](#security)
- [Contributing](#contributing)

## 🎯 Overview

SmartWallet is a Spring Boot-based web application that provides students with a complete financial management solution. It offers multi-currency wallet support, transaction tracking, cashback rewards, subscription plans, interactive games, and an AI-powered chatbot assistant.

### Key Highlights

- **Multi-Currency Support**: Manage wallets in EUR, BGN, INR, and GBP
- **Cashback Rewards**: Earn 1.5% cashback on every withdrawal transaction
- **Subscription Plans**: Choose from Default, Premium, or Ultimate plans
- **Interactive Games**: Play Memory Match and SpendQuest to earn rewards
- **AI Chatbot**: Get instant help with Kate, your AI assistant
- **Secure & Safe**: Bank-level security with Spring Security

## ✨ Features

### 💳 Wallet Management
- Create and manage multiple wallets
- Support for multiple currencies (EUR, BGN, INR, GBP)
- Real-time balance tracking
- Wallet activation/deactivation
- Primary wallet designation

### 💰 Transactions
- **Deposits**: Add funds to your wallets
- **Withdrawals**: Transfer money out with automatic cashback
- **Transfers**: Move funds between your own wallets
- **Transaction History**: View all past transactions with detailed information
- **Multi-Currency**: Automatic currency conversion using exchange rates

### 🎁 Cashback System
- **1.5% Cashback Rate**: Earn cashback on every withdrawal
- **Automatic Calculation**: Cashback is automatically calculated and added to your balance
- **Multi-Currency Support**: Cashback is converted to your primary wallet currency for tracking
- **Real-time Tracking**: View your total cashback earnings on the dashboard

### 📊 Subscription Plans
- **Default Plan**: Free tier with basic features
- **Premium Plan**: Enhanced features and benefits
- **Ultimate Plan**: Full access to all premium features
- **Subscription History**: Track your subscription changes over time

### 🎮 Games
- **Memory Match**: Test your memory skills and earn rewards
- **SpendQuest**: An interactive spending game
- **Game Results**: Track your performance and achievements

### 🤖 AI Chatbot
- **Kate AI Assistant**: Get instant answers to your questions
- **Conversational Interface**: Natural language processing
- **Help & Support**: Ask about features, transactions, or general questions
- **Conversation History**: Maintain context throughout your chat session

### 🔔 Notifications
- **Email Notifications**: Receive updates about transactions and account activity
- **Notification Preferences**: Customize your notification settings
- **Notification History**: View all sent notifications
- **Status Tracking**: Monitor notification delivery status

### 👥 User Management (Admin)
- **User Administration**: Manage all users in the system
- **Role Management**: Assign admin or user roles
- **Account Activation**: Activate or deactivate user accounts
- **User Overview**: View user details and activity

### 📈 Reports & Analytics
- **Transaction Reports**: Detailed financial reports
- **Spending Insights**: Analyze your spending patterns
- **Dashboard Analytics**: Visual representation of your financial data

## 🛠 Technology Stack

- **Framework**: Spring Boot 3.5.7
- **Language**: Java 21
- **Database**: MySQL 8
- **Security**: Spring Security with OAuth2
- **Templating**: Thymeleaf
- **Build Tool**: Maven
- **ORM**: Hibernate/JPA
- **API Integration**: OpenFeign
- **Caching**: Spring Cache
- **Async Processing**: Spring Async & Scheduling

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Java 21** or higher
- **Maven 3.6+**
- **MySQL 8.0+**
- **IDE** (IntelliJ IDEA, Eclipse, or VS Code recommended)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Hack-Cash
```

### 2. Database Setup

1. Start your MySQL server
2. Create a database (or let the application create it automatically):
```sql
CREATE DATABASE IF NOT EXISTS Hack_Cash;
```

### 3. Configure Application

Edit `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/Hack_Cash?createDatabaseIfNotExist=true
spring.datasource.username=your_username
spring.datasource.password=your_password

# Default User (optional)
users.defaultUser.username=your_username
users.defaultUser.password=your_password
users.defaultUser.country=BULGARIA
```

### 4. Build and Run

Using Maven:

```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

Or using the Maven wrapper:

```bash
# On Unix/Mac
./mvnw spring-boot:run

# On Windows
mvnw.cmd spring-boot:run
```

The application will start on `http://localhost:8080`

## ⚙️ Configuration

### Database Configuration

The application uses MySQL with Hibernate's auto-update feature. Tables are created automatically on first run.

### Security Configuration

- Default authentication uses Spring Security
- OAuth2 client support is enabled
- Password encryption is handled by Spring Security

### Default User

A default user can be configured in `application.properties`:
- Username: Set via `users.defaultUser.username`
- Password: Set via `users.defaultUser.password`
- Country: Set via `users.defaultUser.country`

## 📖 Usage Guide

### Getting Started

1. **Register an Account**
   - Navigate to `/register`
   - Fill in your details (username, email, password, country)
   - Click "Start Free Today"

2. **Login**
   - Go to `/login`
   - Enter your credentials
   - Access your dashboard

3. **Dashboard Overview**
   - View your wallet balances
   - See cashback earnings
   - Quick access to all features

### Managing Wallets

1. **View Wallets**
   - Navigate to "Wallets" from the sidebar
   - See all your wallets with balances and currencies

2. **Create a Wallet**
   - Go to Wallets page
   - Click "Create New Wallet"
   - Choose currency and nickname
   - Set as primary if desired

3. **Activate/Deactivate Wallet**
   - Click on a wallet
   - Toggle activation status
   - Only active wallets can process transactions

### Making Transactions

1. **Deposit Funds**
   - Go to Wallets page
   - Select a wallet
   - Click "Deposit"
   - Enter amount and confirm

2. **Withdraw Funds**
   - Select a wallet
   - Click "Withdraw"
   - Enter amount
   - **Note**: You'll automatically earn 1.5% cashback on withdrawals!

3. **Transfer Between Wallets**
   - Go to "Transfer" page
   - Select source and destination wallets
   - Enter amount
   - Currency conversion is automatic

### Earning Cashback

- **Automatic**: Cashback is automatically calculated on every withdrawal
- **Rate**: 1.5% of the withdrawal amount
- **Tracking**: View total cashback on the dashboard
- **Multi-Currency**: Cashback is converted to your primary wallet currency for tracking

### Subscription Management

1. **View Plans**
   - Navigate to "Upgrade" page
   - See Default, Premium, and Ultimate plans
   - Compare features and pricing

2. **Upgrade Subscription**
   - Select your desired plan
   - Confirm the upgrade
   - View subscription history

### Playing Games

1. **Memory Match**
   - Click "Memory Match" in Quick Links
   - Play the memory card game
   - Track your results

2. **SpendQuest**
   - Click "SpendQuest" in Quick Links
   - Play the spending game
   - Earn rewards

### Using AI Chatbot

1. **Access Chatbot**
   - Click "AI Chatbot" in Quick Links
   - Or navigate to `/ai/chat`

2. **Chat with Kate**
   - Type your questions
   - Get instant responses
   - Use "clear" to reset conversation

### Managing Notifications

1. **Notification Preferences**
   - Go to "Notifications" page
   - Configure email notification settings
   - Enable/disable notifications

2. **View History**
   - See all sent notifications
   - Check delivery status
   - View notification details

### Admin Features

If you have admin privileges:

1. **User Management**
   - Navigate to "Users" page
   - View all users
   - Activate/deactivate accounts
   - Change user roles

2. **Toggle User Status**
   - Use the toggle switch to activate/deactivate users
   - Deactivated users cannot log in

3. **Change User Roles**
   - Toggle between USER and ADMIN roles
   - Admin users have access to admin features

## 📁 Project Structure

```
Hack-Cash/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── app/
│   │   │       ├── ai/              # AI Chatbot functionality
│   │   │       ├── config/           # Configuration classes
│   │   │       ├── email/           # Email service
│   │   │       ├── games/           # Game controllers and services
│   │   │       ├── notification/   # Notification system
│   │   │       ├── security/       # Security configuration
│   │   │       ├── subscription/   # Subscription management
│   │   │       ├── transaction/    # Transaction handling
│   │   │       ├── user/          # User management
│   │   │       ├── utils/         # Utility classes
│   │   │       ├── wallet/        # Wallet management
│   │   │       └── web/           # Web controllers and DTOs
│   │   └── resources/
│   │       ├── static/            # CSS, JS, images
│   │       ├── templates/         # Thymeleaf templates
│   │       └── application.properties
│   └── test/                      # Test files
├── pom.xml                        # Maven configuration
└── README.md                     # This file
```

## 🔌 API Endpoints

### Public Endpoints
- `GET /` - Landing page
- `GET /register` - Registration page
- `POST /register` - Register new user
- `GET /login` - Login page

### Authenticated Endpoints
- `GET /home` - Dashboard
- `GET /wallets` - Wallet management
- `POST /wallets/deposit` - Deposit funds
- `POST /wallets/withdraw` - Withdraw funds
- `GET /transactions` - Transaction history
- `GET /transfer` - Transfer page
- `POST /transfer` - Transfer between wallets
- `GET /upgrade` - Subscription plans
- `GET /subscriptions/history` - Subscription history
- `GET /notifications` - Notification preferences
- `GET /ai/chat` - AI Chatbot
- `POST /ai/chat` - Send message to AI
- `GET /memory` - Memory Match game
- `GET /spendquest` - SpendQuest game

### Admin Endpoints
- `GET /users` - User management
- `PATCH /users/{id}/status` - Toggle user status
- `PATCH /users/{id}/role` - Change user role
- `GET /reports` - Admin reports

### Game API Endpoints
- `POST /api/memory/start` - Start memory game
- `POST /api/memory/check` - Check memory match
- `GET /api/memory/results/{userId}` - Get game results

## 🔒 Security

- **Authentication**: Spring Security with form-based login
- **Authorization**: Role-based access control (USER, ADMIN)
- **Password Encryption**: BCrypt password encoding
- **Session Management**: HTTP session-based authentication
- **CSRF Protection**: Enabled by default
- **OAuth2**: Support for OAuth2 client authentication

## 🎨 Features in Detail

### Cashback System
- **Rate**: 1.5% on all withdrawal transactions
- **Automatic**: No manual claiming required
- **Multi-Currency**: Automatically converted to primary wallet currency
- **Real-time**: Added immediately to wallet balance

### Currency Support
- **EUR** (Euro)
- **BGN** (Bulgarian Lev)
- **INR** (Indian Rupee)
- **GBP** (British Pound)

Exchange rates are configured in `WalletService.java` and can be updated as needed.

### Wallet Status
- **ACTIVE**: Can process transactions
- **INACTIVE**: Cannot process transactions

### Transaction Status
- **SUCCEEDED**: Transaction completed successfully
- **FAILED**: Transaction failed (insufficient funds, inactive wallet, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is part of the Hack-Cash application.

## 📞 Support

For issues, questions, or contributions, please open an issue in the repository.

## 🙏 Acknowledgments

- Built with Spring Boot
- Designed for students, by students
- Special thanks to all contributors

---

**Happy Banking! 💰**

