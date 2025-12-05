# Deployment Guide for DevOps

## Project Overview
Summit Wealth Bank is a full-stack banking application:
- **Backend**: Java 21 + Spring Boot (Port 8080)
- **Frontend**: React + Vite (Port 3000 dev, Port 80 prod)
- **Database**: PostgreSQL 15+ (or H2 for dev)

## Build Verification

### Backend Build
```bash
mvn clean install
# Output: target/summitwealthbank-0.0.1-SNAPSHOT.jar
```

### Frontend Build
```bash
cd summit-frontend
npm install
npm run build
# Output: summit-frontend/dist/
```

## Environment Variables

### Required for Backend

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DB_URL` | Database JDBC URL | `jdbc:postgresql://localhost:5432/summitwealthbank` | Yes (Prod) |
| `DB_USERNAME` | Database username | `postgres` | Yes (Prod) |
| `DB_PASSWORD` | Database password | `your-password` | Yes (Prod) |
| `JWT_SECRET` | JWT signing secret (min 256 bits) | Generated with `openssl rand -base64 64` | **Yes** |
| `JWT_EXPIRATION` | Token expiration in milliseconds | `86400000` (24 hours) | No |
| `ADMIN_EMAIL` | Default admin email | `admin@summit.com` | No |
| `ADMIN_PASSWORD` | Default admin password | `admin123` | No |
| `CORS_ALLOWED_ORIGINS` | Allowed CORS origins | `https://yourdomain.com` | Yes (Prod) |

### Required for Frontend

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API URL | `https://api.yourdomain.com` | **Yes** |

## Application Startup

### Backend
```bash
java -jar target/summitwealthbank-0.0.1-SNAPSHOT.jar
```

**Startup Behavior:**
- Creates database tables automatically (JPA/Hibernate)
- Initializes 50 NASDAQ stocks on first run
- Creates default admin account if not exists
- Ready when you see: `Started SummitWealthBankApplication`

### Frontend
Serve the `summit-frontend/dist` folder with any static file server (nginx, Apache, etc.)

## Health Checks

### Backend Health Check
```bash
curl http://localhost:8080/actuator/health
# Expected: {"status":"UP"}
```

### Database Connection Check
Application will fail to start if database connection fails.

## Database Schema

### Auto-Migration
- Tables are created automatically by Hibernate
- Schema updates happen automatically on startup (dev mode)
- **Production**: Set `spring.jpa.hibernate.ddl-auto=validate` or use Flyway/Liquibase

### Tables Created
- `users` - User accounts and authentication
- `account` - Bank accounts (checking/savings)
- `transaction` - Money transfers between accounts
- `stock` - Available stocks for trading
- `stock_position` - User stock holdings
- `stock_transaction` - Stock buy/sell history

## Port Configuration

### Default Ports
- Backend: `8080`
- Frontend (dev): `3000`
- Frontend (prod): `80` (with nginx)
- Database: `5432` (PostgreSQL)

### Change Backend Port
```bash
java -jar app.jar --server.port=9090
```

Or set environment variable:
```bash
SERVER_PORT=9090
```

## Security Considerations

### Before Production Deployment

1. **Change Default Admin Credentials**
   - Default: `admin@summit.com` / `admin123`
   - Change via environment variables or database

2. **Generate Strong JWT Secret**
   ```bash
   openssl rand -base64 64
   ```

3. **Set Proper CORS Origins**
   - Do not use `*` in production
   - Set to your actual frontend domain

4. **Use HTTPS**
   - Required for production
   - Configure SSL certificates in reverse proxy

5. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Restrict network access

## Logs

### Application Logs
- Default: stdout
- Log level: `INFO`
- Change via: `LOGGING_LEVEL_ROOT=DEBUG`

### Important Log Patterns
- `Started SummitWealthBankApplication` - App is ready
- `Initializing stock data` - Stock initialization in progress
- `Successfully initialized 50 stocks` - Stocks loaded
- `Created default admin user` - Admin account created

## Common Issues

### Issue: Application fails to start
**Solution**: Check database connection and ensure PostgreSQL is running

### Issue: CORS errors in frontend
**Solution**: Verify `CORS_ALLOWED_ORIGINS` includes your frontend URL

### Issue: JWT token errors
**Solution**: Ensure `JWT_SECRET` is set and matches across instances

### Issue: Stocks not loading
**Solution**: Check `app.initialize-stocks=true` in application.properties

## Monitoring Recommendations

### Metrics to Monitor
- Application uptime
- Response times (especially stock trading endpoints)
- Database connection pool
- Memory usage
- CPU usage
- Failed login attempts

### Key Endpoints to Monitor
- `GET /api/stocks/available` - Stock inventory
- `POST /api/stocks/buy` - Stock purchases
- `POST /api/transfer` - Money transfers
- `GET /api/admin/users` - Admin dashboard

## Backup Strategy

### What to Backup
1. **Database** (Critical)
   - All tables
   - Frequency: Hourly incremental, Daily full

2. **Application Logs**
   - Retention: 30 days

### Not Required
- Application JAR (can be rebuilt)
- Frontend dist (can be rebuilt)

## Rollback Procedure

### Backend Rollback
```bash
# Stop current version
# Deploy previous JAR
java -jar summitwealthbank-0.0.1-SNAPSHOT.jar
```

### Frontend Rollback
- Deploy previous dist folder to static file server

### Database Rollback
- Restore from backup
- **Warning**: May lose recent transactions

## Scaling Considerations

### Horizontal Scaling
- Application is stateless (uses JWT)
- Can run multiple instances behind load balancer
- Database connection pool size: 10-20 per instance

### Database Scaling
- PostgreSQL read replicas for reporting
- Connection pooling is configured
- Stock trading uses `@Transactional` for consistency

## CI/CD Pipeline Suggestions

### Pipeline Stages

1. **Build**
   ```bash
   mvn clean install
   cd summit-frontend && npm install && npm run build
   ```

2. **Test** (if tests exist)
   ```bash
   mvn test
   cd summit-frontend && npm test
   ```

3. **Docker Build**
   - Build backend image
   - Build frontend image

4. **Deploy**
   - Deploy to staging
   - Run smoke tests
   - Deploy to production

### Suggested Tools
- Jenkins / GitHub Actions / GitLab CI
- Docker / Kubernetes
- PostgreSQL managed service (AWS RDS, Google Cloud SQL, etc.)
- Nginx for frontend static files
- Application Load Balancer

## Contact

For deployment issues, contact the development team:
- Pranav Habib - phabib1@stevens.edu
- Gunjan Rawat - grawat1@stevens.edu
- Sayan Seal - sseal1@stevens.edu

## Additional Notes

- Application uses in-memory H2 database by default (development only)
- Production must use PostgreSQL
- Stock prices are fixed (not real-time from external APIs)
- All monetary values use `BigDecimal` for precision
- Transaction references format: `TXN-YYYYMMDD-XXXXXX` and `STK-YYYYMMDD-XXXXXX`
