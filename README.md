# ThreadWorks: Custom Clothing & Analytics Platform

ThreadWorks is a full-stack e-commerce and business intelligence platform for custom clothing. It allows users to browse products, upload custom designs, and provides administrators with real-time business insights through a deep Tableau integration.

## 🚀 Key Features

### For Customers
- **Product Catalog:** Browse and filter high-quality clothing items.
- **Custom Design Upload:** Submit unique design specifications and file attachments (PNG, PDF) for personalized orders.
- **Personalized Profile:** Track order history and design status (Pending Review, Approved, Rejected).
- **Secure Authentication:** JWT-based login and registration.

### For Administrators
- **Admin Dashboard:** Manage users, products, and custom design requests.
- **Advanced Analytics:** Embedded Tableau dashboards with interactive filtering (Category: Furniture, Technology, Office Supplies).
- **Dashboard Authoring:** Direct integration with Tableau's "Edit Mode" for on-the-fly business intelligence updates.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18 (Vite), Tailwind CSS 4.x, @tableau/embedding-api-react |
| **Backend** | Spring Boot 4.x (Java 21), Spring Security, Spring Data JPA |
| **Database** | PostgreSQL 15, H2 (for testing) |
| **DevOps** | Docker, Docker Compose, Maven |
| **BI Engine** | Tableau Online (Connected Apps via JWT) |

---

## 📁 Project Structure

```text
.
├── frontend/             # React application (Vite-powered)
│   ├── src/components/   # Specialized UI (Analytics, Catalog, Auth)
│   └── src/api/          # Axios configuration with JWT interceptors
├── src/main/java/        # Spring Boot backend
│   ├── config/           # Security and Web configuration
│   ├── controllers/      # REST API endpoints
│   ├── models/           # JPA Entities (User, Order, Product, CustomDesign)
│   ├── security/         # JWT service and authentication filters
│   └── services/         # Business logic (Tableau Auth, File Storage)
├── uploads/              # Local storage for custom design files
├── docker-compose.yml    # Infrastructure (Postgres, pgAdmin)
└── pom.xml               # Maven dependencies
```

---

## ⚙️ Getting Started

### Prerequisites
- Java 21 JDK
- Node.js (v18+)
- Docker and Docker Compose

### Backend Setup
1. Clone the repository.
2. Create a `.env` file based on `.env example`.
3. Configure your Tableau Connected App credentials in `src/main/resources/application.yaml` (or move them to `.env`).
4. Start the database:
   ```bash
   docker-compose up -d
   ```
5. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

---

## 📊 Tableau Integration
The project uses **Tableau Connected Apps** for secure embedding.
- **Backend:** `TableauAuthService.java` generates a JWT using `jjwt`.
- **Frontend:** `AnalyticsDashboard.jsx` fetches this token and uses the `@tableau/embedding-api-react` to render `TableauViz` (view mode) and `TableauAuthoringViz` (edit mode).

---

## 🔒 Security
- Authentication is handled via stateless JWT tokens.
- **Admin-only** access is enforced on the `/api/tableau/token` and `/api/custom-designs/all` endpoints.
- Role-based security (ROLE_ADMIN, ROLE_CUSTOMER) is managed via Spring Security.

---

## 📄 License
Internal Research Project - All Rights Reserved.
