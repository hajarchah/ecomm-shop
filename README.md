# E-Commerce Platform

A comprehensive e-commerce platform with product management, shopping cart, wishlist, and user authentication.

## Table of Contents

- [Project Overview](#project-overview)
- [Requirements](#requirements)
  - [Front-end Requirements](#front-end-requirements)
  - [Back-end Requirements](#back-end-requirements)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Installation](#backend-installation)
  - [Frontend Installation](#frontend-installation)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Testing](#testing)

## Project Overview

This project is a complete e-commerce application with both frontend and backend components. It allows users to browse products, add them to cart or wishlist, manage their account, and contact support. Admin users have additional abilities to manage the product inventory.

## Requirements

### Front-end Requirements

#### Part 1: Shop
- ✅ Display all relevant product information in the list
- ✅ Allow adding products to cart from the list
- ✅ Allow removing products from the cart
- ✅ Display a badge showing the quantity of products in the cart
- ✅ Allow viewing the list of products in the cart

#### Part 2: Contact
- ✅ Create a new "Contact" menu item in the sidebar
- ✅ Create a Contact page with a form
- ✅ Form must allow entering email and message with "Send" button
- ✅ Email and message fields are required, message must be under 300 characters
- ✅ Display "Contact request sent successfully" message after submission

#### Bonus Features
- ✅ Add filtering system for product list
- ✅ Allow viewing and adjusting product quantity from both list and cart

### Back-end Requirements

#### Part 1: Product Management
- ✅ Develop backend with Node.js/Express
- ✅ Implement the following API endpoints:

| Resource           | POST                  | GET                            | PATCH                                    | PUT | DELETE           |
| ------------------ | --------------------- | ------------------------------ | ---------------------------------------- | --- | ---------------- |
| **/products**      | Create a new product  | Retrieve all products          | X                                        | X   |     X            |
| **/products/:id**  | X                     | Retrieve details for product 1 | Update details of product 1 if it exists | X   | Remove product 1 |

- ✅ Use SQLite for data storage (database is available for viewing at /back/data/database.sqlite)

#### Part 2: Authentication & Features
- ✅ Implement JWT authentication
- ✅ Create `/account` endpoint for user registration
- ✅ Create `/token` endpoint for user login
- ✅ Allow only admin@admin.com to add, modify, or delete products
- ✅ Implement shopping cart management
- ✅ Implement wishlist management

## Technologies Used

### Frontend
- **Angular 17** - Framework for front-end development
- **PrimeNG** - UI component library for Angular
- **RxJS** - Reactive programming library
- **TypeScript** - Typed programming language based on JavaScript

### Backend
- **Node.js** - Server-side JavaScript runtime
- **Express** - Web framework for Node.js
- **TypeORM** - Object-Relational Mapping for TypeScript
- **SQLite** - Relational database management system
- **JWT** - Authentication and authorization using JSON Web Tokens
- **Swagger** - Interactive API documentation

## Getting Started

### Prerequisites
- Node.js (version 18 or higher)
- npm (version 9 or higher)

### Backend Installation
```bash
# Navigate to backend directory
cd back

# Install dependencies
npm install

# Start development server
npm run dev