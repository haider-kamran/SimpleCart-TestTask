# SimpleCart-TestTask

A Laravel 12 project with **React + InertiaJS frontend**, featuring authentication, product listing, and a cart system.

---

## Features

* User authentication using **Laravel Fortify**
* Products listing with **pagination**
* **Cart functionality**: add, update quantity, remove items
* React + InertiaJS frontend with TypeScript
* API calls handled via **Axios**
* Toast notifications for actions
* Seeders to populate initial products and users

---

## Prerequisites

* PHP >= 8.1
* Composer
* Node.js >= 18
* npm or yarn
* MySQL or compatible database

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/haider-kamran/SimpleCart-TestTask.git
cd SimpleCart-TestTask
```

2. Install PHP dependencies:

```bash
composer install
```

3. Install Node dependencies:

```bash
npm install
```

4. Copy environment file:

```bash
cp .env.example .env
```

5. Configure your `.env` with your database credentials.

6. Generate application key:

```bash
php artisan key:generate
```

---

## Database Setup

1. Run migrations:

```bash
php artisan migrate
```

2. Run seeders:

```bash
php artisan db:seed
```

3. Reset and reseed database (optional):

```bash
php artisan migrate:fresh --seed
```

---

## Running the Project

1. Start Laravel server:

```bash
php artisan serve
```

2. Start Vite dev server:

```bash
npm run dev
```

> Laravel runs on `http://127.0.0.1:8000`
> Vite runs on `http://localhost:5173`

---

## Routes

**Authentication**

* `/login` → Login page
* `/register` → Registration page
* `/dashboard` → Protected dashboard

**Products & Cart**

* `/products` → Paginated products list
* `/cart` → Cart page (update quantity, remove items, shows totals)
