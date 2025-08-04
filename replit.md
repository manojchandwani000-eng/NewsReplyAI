# Overview

AutoReply Pro is a comprehensive automated customer support system designed for newsletter management. The application provides intelligent email categorization, multilingual template management, and automated response generation to streamline customer service operations. Built as a full-stack TypeScript application, it enables businesses to efficiently handle customer inquiries with automated responses while maintaining high-quality support standards.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React 18 using TypeScript, leveraging modern React patterns with function components and hooks. The UI is constructed using shadcn/ui components built on top of Radix UI primitives, providing accessible and customizable interface elements. TailwindCSS handles styling with a custom design system featuring CSS variables for theming. The application uses Wouter for lightweight client-side routing and TanStack Query for efficient server state management and caching.

## Backend Architecture
The server is implemented using Express.js with TypeScript, following RESTful API conventions. The application uses an in-memory storage implementation that can be easily swapped for database persistence. The backend provides comprehensive CRUD operations for categories, languages, templates, inquiries, and analytics. A modular service layer handles natural language processing for inquiry categorization and Google Translate API integration for multilingual support.

## Data Storage Solutions
The application uses Drizzle ORM with PostgreSQL as the primary database, specifically configured with Neon Database serverless. The database schema defines five main entities: categories, languages, templates, inquiries, and analytics. All tables use UUID primary keys with proper relationships established between entities. The storage layer implements a clean interface pattern, allowing for easy testing with in-memory implementations while maintaining production database capabilities.

## Authentication and Authorization
Currently, the application does not implement user authentication, operating as a single-tenant system. All API endpoints are publicly accessible, which is suitable for internal tooling or demo environments but would require authentication implementation for production use.

## Build and Development Infrastructure
The project uses Vite for fast development and optimized production builds. The build process compiles both frontend React code and backend Node.js code using esbuild for efficient bundling. Development includes hot module replacement through Vite's development server with middleware integration for the Express backend. The application is configured for deployment on Replit with specific plugins for development tooling and error handling.

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL database hosting with connection pooling and automatic scaling
- **Drizzle ORM**: Type-safe database queries and migrations with PostgreSQL dialect support

## UI and Design System
- **Radix UI**: Headless, accessible React components for building the interface
- **shadcn/ui**: Pre-built component library using Radix UI primitives with TailwindCSS styling
- **TailwindCSS**: Utility-first CSS framework with custom design tokens and responsive design
- **Lucide React**: Icon library providing consistent iconography throughout the application

## Third-Party APIs
- **Google Translate API**: Machine translation service for automatic template translation and multilingual support
- **Optional Translation Services**: Configurable translation service integration with fallback to original text

## Development and Build Tools
- **Vite**: Fast build tool and development server with React plugin support
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **Replit Integration**: Platform-specific tooling for development environment and deployment