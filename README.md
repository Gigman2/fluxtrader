# SignalFlux

A minimalist, high-performance dashboard for aggregating, parsing, and analyzing trading signals from Telegram channels.

## 🚀 Features

- **Account Management**: Secure user authentication with JWT tokens
- **Channel Management**: Connect and manage Telegram trading channels
- **Signal Processing**: Parse and extract trading signals from messages
- **Real-time Dashboard**: Monitor signals, channels, and analytics
- **Template Builder**: Create custom extraction templates for different signal formats
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## 🏗️ Architecture

SignalFlux follows a clean architecture with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│           API Layer (routes/)            │
│  - HTTP request/response handling       │
│  - Input validation                     │
│  - Error response formatting            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│        Service Layer (services/)        │
│  - Business logic                       │
│  - Database operations                  │
│  - Data validation                      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Model Layer (models/)            │
│  - SQLAlchemy models                    │
│  - Database schema                      │
└─────────────────────────────────────────┘
```

## 🛠️ Tech Stack

### Backend

- **Python 3.9+**
- **Flask** - Web framework
- **SQLAlchemy 2.0** - ORM
- **PostgreSQL** - Database
- **Alembic** - Database migrations
- **PyJWT** - JWT authentication
- **Flask-CORS** - Cross-origin resource sharing

### Frontend

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TanStack Query (React Query)** - Data fetching & caching
- **Axios** - HTTP client
- **React Router** - Routing
- **Tailwind CSS v4** - Styling
- **Zustand** - State management
- **Recharts** - Data visualization

## 📁 Project Structure

```
 SignalFlux/
 ├── Back/                    # Backend API
 │   ├── api/                 # API routes and validations
 │   ├── config/              # Configuration handlers
 │   ├── models/               # SQLAlchemy models
 │   ├── services/             # Business logic
 │   ├── utils/                # Utilities (JWT, password, etc.)
 │   ├── alembic/             # Database migrations
 │   ├── main.py              # Application entry point
 │   ├── requirements.txt     # Python dependencies
 │   └── run.sh               # Run script
 │
 └── Front/                    # Frontend application
     ├── api/                  # API client & hooks
     ├── components/           # React components
     ├── pages/                # Page components
     ├── store/                # State management
     ├── utilities/            # Utility functions
     ├── package.json         # Node dependencies
     └── vite.config.ts       # Vite configuration
```

## 🚀 Getting Started

### Prerequisites

- **Python 3.9+**
- **PostgreSQL 12+**
- **Git**

### Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd SignalFlux/Back
   ```

2. **Create and activate virtual environment:**

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

3. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables:**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Configure database:**

   - Update PostgreSQL connection details in `.env`
   - Run migrations:
     ```bash
     alembic upgrade head
     ```

6. **Run the backend:**

   ```bash
   ./run.sh
   # Or manually:
   python main.py
   ```

   The API will be available at `http://localhost:5033` (or your configured port).

### Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd SignalFlux/Front
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file:

   ```env
   VITE_BASE_API_URL=http://localhost:5033/api/v1
   VITE_ENVIRONMENT=development
   ```

4. **Start development server:**

   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5034` (or your configured port).

## ⚙️ Environment Variables

### Backend (.env)

```env
# Application
APP_ENV=development
DEBUG=True
PORT=5033

# Database
POSTGRES_DB=signalflex_db
POSTGRES_USER=signalflex_user
POSTGRES_PASSWORD=signalflex_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# JWT
JWT_SECRET_KEY=your-secret-key-change-in-production
JWT_EXPIRATION_HOURS=24

# CORS
FRONTEND_URL=http://localhost:5034,http://localhost:3000

# Logging
LOG_FORMAT=text
LOG_LEVEL=INFO

# Market Data API (Optional - for real-time market data)
# Get your free API key from https://twelvedata.com
TWELVE_DATA_API_KEY=your-twelve-data-api-key-here
```

### Frontend (.env)

```env
VITE_BASE_API_URL=http://localhost:5033/api/v1
VITE_ENVIRONMENT=development
```

## 📚 API Documentation

The API follows RESTful conventions and returns JSON responses.

### Base URL

```
http://localhost:5033/api/v1
```

### Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Endpoints

#### Authentication

- `POST /login` - Login and get JWT token
- `POST /accounts` - Create new account (signup)

#### Accounts

- `GET /accounts` - List all accounts
- `GET /accounts/{id}` - Get account by ID
- `PUT /accounts/{id}` - Update account
- `DELETE /accounts/{id}` - Delete account

#### Channels

- `GET /channels` - List all channels
- `GET /channels/{id}` - Get channel by ID
- `POST /channels` - Create channel
- `PUT /channels/{id}` - Update channel
- `DELETE /channels/{id}` - Delete channel

For detailed API documentation, see [FluxTrader-Docs/API_DOCUMENTATION.md](./FluxTrader-Docs/API_DOCUMENTATION.md).

## 🗄️ Database

### Running Migrations

```bash
cd SignalFlux/Back

# Create a new migration
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1
```

For more details, see [FluxTrader-Docs/MIGRATIONS_GUIDE.md](./FluxTrader-Docs/MIGRATIONS_GUIDE.md).

## 🧪 Development

### Backend Development

- **Code Style**: Follow PEP 8
- **Type Hints**: Use type hints for better code clarity
- **Logging**: Use the logging handler from `config.logging_handler`
- **Error Handling**: Use custom exceptions from `config.exceptions_handler`

### Frontend Development

- **Code Style**: Follow ESLint and Prettier configurations
- **TypeScript**: Use TypeScript for type safety
- **Components**: Keep components small and focused
- **State Management**: Use Zustand for global state, React Query for server state

### Running Tests

**Backend:**

```bash
cd SignalFlux/Back
pytest
```

**Frontend:**

```bash
cd SignalFlux/Front
npm test
```

## 🐳 Docker (Optional)

The backend includes Docker configuration:

```bash
cd SignalFlux/Back
docker-compose up -d
```

## 📝 Scripts

### Backend

- `./run.sh` - Run the Flask application (handles venv activation)

### Frontend

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🔒 Security

- Passwords are hashed using PBKDF2-SHA256
- JWT tokens for authentication
- CORS configured for allowed origins
- Input validation on all endpoints
- SQL injection protection via SQLAlchemy ORM

## 📖 Documentation

- [Architecture](./FluxTrader-Docs/ARCHITECTURE.md)
- [API Documentation](./FluxTrader-Docs/API_DOCUMENTATION.md)
- [Database Architecture](./FluxTrader-Docs/DATABASE_ARCHITECTURE.md)
- [Migrations Guide](./FluxTrader-Docs/MIGRATIONS_GUIDE.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For issues and questions, please open an issue in the repository.

## 🙏 Acknowledgments

Built with modern web technologies and best practices for scalability and maintainability.
