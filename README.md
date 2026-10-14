# CoreNode Attend
### Smart Attendance. Simplified Workforce.

**CoreNode Attend** is a modern employee attendance and workforce management software demo developed by **CoreNode Software Solutions**. It is designed to simplify employee attendance tracking, shift management, leave administration, employee records, and workforce reporting for businesses of all sizes.

🌐 **Live Demo:** https://corenode-attend.vercel.app/

📦 **GitHub Repository:** https://github.com/gopaltiwari04/CoreNode-Attend-Employee-Attendance-Workforce-Management-Software

---

## Overview

Managing employee attendance manually can be time-consuming, error-prone, and difficult to scale. CoreNode Attend demonstrates how businesses can streamline workforce operations through a centralized, intuitive dashboard.

The platform is designed for small and medium-sized businesses, including restaurants, cafés, retail stores, gyms, offices, and other organizations that need a simple way to manage employees and attendance.

The project focuses on a clean user experience, accessible workforce insights, and streamlined administrative workflows.

## Features

### 📊 Workforce Dashboard
- Attendance overview and workforce statistics
- Employee attendance summaries
- Key performance indicators
- Visual analytics and reporting
- Quick access to common management actions

### 👥 Employee Management
- Centralized employee directory
- Employee profile management
- Department and designation information
- Employee search and filtering
- Employee status tracking

### 🕒 Attendance Tracking
- Employee check-in and check-out workflows
- Attendance status monitoring
- Daily attendance records
- Late arrival and absence tracking
- Working-hours summaries

### 📅 Shift Management
- Shift creation and configuration
- Employee shift assignments
- Shift schedules and roster management
- Shift-based attendance monitoring

### 🏖️ Leave Management
- Leave request submission
- Leave request review and approval workflows
- Leave status tracking
- Leave history management

### 📝 Attendance Regularization
- Attendance correction requests
- Review of requested attendance changes
- Approval and rejection workflows
- Attendance record correction tracking

### 📈 Reports and Analytics
- Attendance summaries
- Workforce activity insights
- Attendance trend visualization
- Employee-level reporting
- Filterable reports and data exports, where supported

### 💰 Payroll Summary
- Attendance-linked payroll summaries
- Working-day and absence information
- Illustrative salary calculations
- Payroll preparation support

### 🏢 Multi-Location Management
- Branch and department organization
- Location-based employee management
- Branch-level attendance visibility

### ⚙️ Settings and Administration
- Organization and attendance policy settings
- Workforce configuration
- Role-oriented navigation
- Demo data management

> **Note:** This is a demonstration application. Feature availability and behaviour depend on the current implementation. Integrations such as biometric devices, GPS verification, external messaging services, and production payroll processing should not be considered active unless explicitly implemented.

---

## Technology Stack

The project uses a modern web development stack:

| Technology | Purpose |
|---|---|
| React 19 | Component-based user interface |
| TypeScript | Type-safe application development |
| Vite 8 | Development server and production build |
| Tailwind CSS 4 | Utility-first styling |
| Lucide React | Interface icons |
| Motion | Interface animations |
| Google GenAI SDK | Available for AI-related functionality |
| Vercel | Hosting and deployment |
| GitHub | Source code management |

The application is built using a modular frontend architecture and can be extended as the product evolves.

## Live Demo

Explore the application:

**https://corenode-attend.vercel.app/**

The demo is intended to showcase the user experience and potential workflows of an employee attendance management platform.

Use fictional information when testing the application. Do not enter sensitive employee information or real payroll data.

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Install the following:

- Node.js with a version compatible with the project's Vite dependencies
- npm
- Git

### 1. Clone the repository

```bash
git clone https://github.com/gopaltiwari04/CoreNode-Attend-Employee-Attendance-Workforce-Management-Software.git
```

### 2. Navigate to the project directory

```bash
cd CoreNode-Attend-Employee-Attendance-Workforce-Management-Software
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal to access the application.

### 5. Create a production build

```bash
npm run build
```

### 6. Preview the production build

```bash
npm run preview
```

### 7. Run the TypeScript check

```bash
npm run lint
```

The lint script currently runs the TypeScript compiler without emitting files.

## Deployment

CoreNode Attend is hosted on Vercel and connected to its GitHub repository.

To deploy your own version:

1. Fork or import the repository into your GitHub account.
2. Open [Vercel](https://vercel.com/).
3. Import the repository as a new project.
4. Configure the required environment variables if the application uses any.
5. Use `npm run build` as the build command.
6. Use `dist` as the output directory for the Vite frontend.
7. Deploy the application.

Subsequent pushes to the configured GitHub branch can trigger automatic deployments.

For production deployments, ensure that dependency versions and the lockfile are consistent and that the production build succeeds locally.

## Project Structure

The repository follows a Vite-based React application structure.

```text
CoreNode-Attend/
├── src/                 # Application source code
├── index.html           # HTML entry point
├── package.json         # Dependencies and npm scripts
├── package-lock.json    # Locked dependency versions
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
├── vercel.json          # Vercel deployment configuration
├── .env.example         # Example environment configuration
├── .gitignore           # Git ignore rules
└── README.md            # Project documentation
```

Additional components, pages, and configuration files may be organized within the source directory.

## Demo Data and Security

CoreNode Attend is intended for product demonstrations and development.

- Use fictional employee records for testing.
- Do not store sensitive employee, salary, or personal information in an unsecured demo environment.
- Frontend role switching alone does not provide secure authorization.
- Browser-based storage, if used, should not be treated as a secure production database.
- Production deployments should use a secure backend, authenticated APIs, server-side authorization, appropriate database access controls, and audit logging.
- Real payment, biometric, GPS, email, and messaging integrations require separate implementation and configuration.

The demo should not be used as the sole source of truth for payroll, employee compliance, or official attendance records.

## Future Enhancements

Potential areas for further development include:

- Secure authentication and role-based authorization
- Multi-tenant business accounts
- Backend API and database integration
- QR code and biometric attendance integrations
- GPS-based attendance verification
- WhatsApp, email, and SMS notifications
- Automated attendance reports
- Advanced shift scheduling
- Payroll and accounting integrations
- Employee mobile application
- Cloud-based data synchronization
- Advanced workforce analytics

## About CoreNode Software Solutions

**CoreNode Software Solutions** develops software solutions designed to help businesses streamline operations, improve productivity, and adopt digital workflows.

CoreNode Attend demonstrates the company's approach to building practical, accessible business management software.

For software development enquiries, customization, or business collaboration, please contact CoreNode Software Solutions through its official channels.

## License

No open-source license is specified here. Unless a license is added to the repository, all rights are reserved by the respective copyright holder. Contact the project owner for permission to reuse or redistribute the software.

---

**Built by CoreNode Software Solutions**

*Smart Attendance. Simplified Workforce.*
