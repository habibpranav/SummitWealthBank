# Summit Wealth Bank

Summit Wealth Bank is a full-stack retail banking application built with Java Spring Boot and React. The application provides comprehensive banking services including account management, internal transfers, stock trading, and wealth management with role-based access control.

## Table of Contents

- [Team Members](#team-members)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [API Architecture](#api-architecture)
- [Database Schema](#database-schema)
- [Setup & Installation](#setup--installation)
- [Running Locally](#running-locally-quick-start)
- [Configuration](#configuration)
- [Security Features](#security-features)
- [Key Business Logic](#key-business-logic)
- [Project Structure](#project-structure)
- [Development Notes](#development-notes)
- [Support](#support)

## Team Members

- **Pranav Habib** - phabib1@stevens.edu
- **Gunjan Rawat** - grawat1@stevens.edu
- **Sayan Seal** - sseal1@stevens.edu

## Features

### Authentication & Authorization
- JWT-based authentication with secure token management
- Role-based access control (USER, ADMIN)
- Protected routes and API endpoints
- Session persistence with automatic token refresh

### Account Management
- **Open Accounts**: Create checking and savings accounts with initial deposits
- **View Accounts**: Dashboard showing all user accounts with balances and status
- **Account Status**: Real-time frozen/active status indicators
- **Add Money**: Deposit funds into savings accounts
- **Account Numbers**: Unique account number generation for each account

### Transfers & Transactions
- **Internal Transfers**: Transfer funds between user accounts
- **Transaction History**: Complete transaction log with reference IDs (TXN-YYYYMMDD-XXXXXX)
- **Transaction Search**: Search transactions by reference ID
- **Validation**: Automatic checks for frozen accounts and sufficient balance
- **Account Flow Display**: Visual representation of money flow (From → To)

### Stock Trading System
- **Live Stock Market**: 50 pre-loaded NASDAQ companies with realistic pricing
- **Buy/Sell Stocks**: Purchase and sell stocks from limited inventory pool
- **Limited Shares**: Each stock has finite availability (e.g., 10,000 shares)
- **Average Cost Basis**: Automatic calculation for profit/loss tracking
- **Portfolio Management**: Real-time portfolio value and P/L calculation
- **Stock Transactions**: Separate transaction history for stock trades (STK-YYYYMMDD-XXXXXX)
- **Transaction Types**: Distinct BUY and SELL operations with visual indicators

### Wealth Management
- **Total Wealth Tracking**: Aggregated view of Checking + Savings + Stock Portfolio
- **Portfolio Overview**: Real-time market value of stock holdings
- **Performance Metrics**: Individual stock profit/loss tracking

### Admin Dashboard
- **User Management**: View all registered users with roles and contact information
- **Account Control**: Freeze/unfreeze individual user accounts
- **Transaction Monitoring**: System-wide view of all account transfers
- **Stock Transaction Oversight**: Monitor all buy/sell activities across the platform
- **Stock Inventory Management**:
  - Create new stocks with pricing and share limits
  - Update stock prices
  - Delete stocks (with safeguards for active positions)
- **User Statistics**: Total users and active user counts
- **Operational Dashboard**: Real-time system monitoring and metrics
  - System health status (application, database, disk space, network)
  - JVM metrics (memory usage, CPU usage, application uptime)
  - Business metrics (total users, accounts, transactions, stock trades)
  - Financial overview (total system balance, active accounts)
  - Auto-refresh every 30 seconds

## Technology Stack

### Backend
- **Java 21**
- **Spring Boot 3.x** - REST API framework
- **Spring Security** - JWT authentication and authorization
- **Spring Data JPA** - ORM with Hibernate
- **PostgreSQL** - Production database
- **H2** - Development/testing database
- **Maven** - Dependency management and build tool
- **Lombok** - Boilerplate code reduction

### Frontend
- **React 18** - UI framework
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API communication
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Vite** - Build tool and development server

## API Architecture

### Public Endpoints
```
POST /api/auth/register          - User registration
POST /api/auth/login             - User authentication
```

### User Endpoints (Requires Authentication)
```
GET  /api/accounts               - Get user accounts
POST /api/accounts/open          - Open new account
POST /api/accounts/deposit       - Add money to savings account
POST /api/transfer               - Transfer between accounts
GET  /api/transactions/recent    - Get transaction history
GET  /api/transactions/search    - Search by reference ID
GET  /api/wealth/total           - Get total wealth breakdown
GET  /api/stocks/available       - Get tradeable stocks
GET  /api/stocks/portfolio       - Get stock holdings
POST /api/stocks/buy             - Buy stocks
POST /api/stocks/sell            - Sell stocks
GET  /api/stocks/transactions    - Get stock trade history
```

### Admin Endpoints (Requires ADMIN Role)
```
GET    /api/admin/users                  - Get all users
GET    /api/admin/accounts               - Get all accounts
POST   /api/admin/freeze                 - Freeze account
POST   /api/admin/unfreeze               - Unfreeze account
GET    /api/admin/transactions/all       - Get all transactions
GET    /api/admin/stock-transactions/all - Get all stock trades
POST   /api/admin/stocks/create          - Create new stock
POST   /api/admin/stocks/update-price    - Update stock price
GET    /api/admin/stocks                 - Get all stocks
DELETE /api/admin/stocks/{symbol}        - Delete stock
```

## Database Schema

### Core Entities
- **User**: User credentials, profile information, and role
- **Account**: Bank accounts (Checking/Savings) with balance and frozen status
- **Transaction**: Internal transfers with reference IDs
- **Stock**: Available stocks with pricing and inventory
- **StockPosition**: User's stock holdings with average cost basis
- **StockTransaction**: Buy/sell stock trade history

## Setup & Installation

### Prerequisites
- Java 21 or higher
- Maven 3.6+
- Node.js 16+ and npm
- PostgreSQL (for production) or H2 (auto-configured for development)

### Backend Setup
```bash
# Navigate to project root
cd SummitWealthBank

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The backend server will start on `http://localhost:8080`

### Frontend Setup
```bash
# Navigate to frontend directory
cd summit-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:3000`

## Running Locally (Quick Start)

### Prerequisites Check
```bash
java -version    # Should be Java 21+
mvn -version     # Should be Maven 3.6+
node -version    # Should be Node 16+
```

### 1. Start Backend
```bash
# From project root
mvn spring-boot:run
```
✅ Backend running on: **http://localhost:8080**

### 2. Start Frontend
```bash
# Open new terminal, from project root
cd summit-frontend
npm install      # First time only
npm run dev
```
✅ Frontend running on: **http://localhost:3000**

### 3. Login with Default Admin
- **Email**: `admin@summit.com`
- **Password**: `admin123`

### Common Issues

**Port 8080 already in use?**
```bash
lsof -ti:8080 | xargs kill -9
```

**Port 3000 already in use?**
```bash
lsof -ti:3000 | xargs kill -9
```

**Database connection error?**
- H2 database is used by default (in-memory)
- No PostgreSQL setup needed for local development
- Data resets on each restart

## Configuration

Update `src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/summitwealthbank
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT Configuration
jwt.secret=your-secret-key-here
jwt.expiration=86400000

# Stock Initialization
app.initialize-stocks=true
```

### Default Admin Account

An admin account is automatically created on first run:
- **Email**: admin@summit.com
- **Password**: admin123

**⚠️ Important**: Change this password immediately in production!

## Security Features

- **Password Encryption**: BCrypt password hashing
- **JWT Tokens**: Secure token-based authentication
- **Authorization Guards**: Role-based endpoint protection
- **CORS Configuration**: Configured for secure cross-origin requests
- **Input Validation**: Server-side validation for all inputs
- **Frozen Account Protection**: Automatic blocking of transactions for frozen accounts

## Key Business Logic

### Stock Trading
- **Inventory Management**: When users buy stocks, available shares decrease; when they sell, shares return to the pool
- **Average Cost Basis**: Calculated as: `(existing_value + new_purchase) / total_shares`
- **Profit/Loss Calculation**: `(current_price - avg_cost_basis) * quantity`
- **Concurrency Control**: `@Transactional` ensures atomic operations

### Transaction References
- **Account Transfers**: Format `TXN-YYYYMMDD-XXXXXX`
- **Stock Trades**: Format `STK-YYYYMMDD-XXXXXX`
- Unique references for auditing and dispute resolution

### Account Types
- **Checking**: Used for transfers and stock trading
- **Savings**: Can receive deposits, used for transfers and stock trading

## Project Structure

```
SummitWealthBank/
├── src/
│   ├── main/
│   │   ├── java/com/summitwealth/bank/
│   │   │   ├── controller/          # REST API endpoints
│   │   │   ├── service/             # Business logic
│   │   │   ├── repository/          # Data access layer
│   │   │   ├── model/               # Entity classes
│   │   │   ├── dto/                 # Data transfer objects
│   │   │   ├── config/              # Security & app configuration
│   │   │   └── util/                # Utility classes
│   │   └── resources/
│   │       └── application.properties
│   └── test/                        # Unit and integration tests
├── summit-frontend/
│   ├── src/
│   │   ├── components/              # React components
│   │   ├── pages/                   # Page components
│   │   ├── services/                # API service layer
│   │   └── App.jsx                  # Main app component
│   ├── package.json
│   └── vite.config.js
├── pom.xml                          # Maven configuration
└── README.md
```

## Development Notes

### Testing
- The application uses H2 in-memory database for development
- 50 NASDAQ stocks are automatically populated on startup
- Admin account is created automatically

### Environment Configuration
- Development uses H2 database (in-memory)
- Production requires PostgreSQL setup
- JWT secret should be changed for production deployment

### Future Enhancements
- External bank transfers (ACH)
- Bill payment system
- Loan applications
- Mobile app integration
- Real-time notifications
- Two-factor authentication

## Support

For questions or issues, please contact:
- **Pranav Habib** - phabib1@stevens.edu
- **Gunjan Rawat** - grawat1@stevens.edu
- **Sayan Seal** - sseal1@stevens.edu