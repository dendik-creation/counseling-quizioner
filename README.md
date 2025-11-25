# Laravel Dashboard Boilerplate

A lightweight and modern starter boilerplate for building dashboard applications using **Laravel** as the backend, **Inertia.js** as the server–client bridge, and **React with Shadcn UI** for a consistent and customizable user interface.  
Perfect for **admin panels**, **internal tools**, or **SaaS boilerplates**, focusing on:

- Developer productivity  
- Consistent UI design  
- Easy feature expansion  

## Pre Requisites
- PHP >= 8.2
- Composer
- Node.js >= 22.x
- NPM or Yarn
- A database (MySQL, PostgreSQL, SQLite, etc.)

## Tech Stack

### Backend
- **Laravel 12**

### Frontend Bridge
- **Inertia.js | React**

### UI Library
- **Shadcn UI** (React + Tailwind + Radix)

### Styling
- **Tailwind CSS**

### Build Tool
- **Vite**

### State & Data Handling
- Inertia props  
- UseForm Inertia

### Authentication
*(Customize according to your setup — Breeze, Fortify, Sanctum, Passport, etc.)*

### Testing
- **PHPUnit**  
- *(Optional: Jest / Vitest)*

### Included Tools & Libraries
- Database (MySQL, PostgreSQL, SQLite, etc.)
- Auth (Default)
- Laravel Excel
- DateFns
- ApexCharts
- Filepond
- Quill
- React Hot Toast
- etc...

## Installation

1. **Clone the repository**
   ```bash
   git clone <repo-url> && cd <project-folder>
2. **Install PHP dependencies**
   ```bash
   composer install
3. **Install Frontend dependencies**
   ```bash
   npm i
4. **Set up environment variables**
   ```bash
   cp .env.example .env
5. **Generate application key**
   ```bash
   php artisan key:generate
6. **Run Server**
    ```bash
    php artisan serve && npm run dev
