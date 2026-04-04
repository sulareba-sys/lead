# Lead Superstore E-Commerce Website

## Overview

Full-featured e-commerce website for Lead Superstore — a multi-branch premium supermarket, restaurant, bakery, and spa chain in Osogbo, Nigeria. Built with React + Vite frontend, Express 5 API backend, and PostgreSQL database.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + TailwindCSS + Wouter routing
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Features

### Customer-Facing
- **Homepage**: Animated hero, services showcase, "Why Choose Us", 3 branch locations with Google Maps links, delivery banner
- **Shop**: Product catalog with category filter (All, Food, Drinks, Household, Bakery, Restaurant, Pastries), live search, stock badges, add-to-cart
- **Cart**: Persistent cart (localStorage), unique serial code (format: Ls_xxxxxx), quantity management
- **Checkout**: Branch selector, delivery type (Pickup ₦450 / Delivery ₦1,650), customer location, WhatsApp ordering, order saved to DB

### Admin Portal (Hidden)
- **Access**: Double-click the footer logo to navigate to /admin
- **Password**: lead@99
- **Dashboard**: Today's orders, revenue, pending orders, total products, low stock alerts
- **Products**: Add, delete, toggle stock status (In Stock / Low Stock / Out of Stock), discount product support
- **Orders**: View all orders with serial codes, filter by status/branch, search by code, update order status (pending/processing/delivered/returned/cancelled)

### Key Design Decisions
- Serial code starts as Ls_ + 6 random alphanumeric chars, stored in localStorage, never regenerates unless cart is cleared
- Footer logo double-click = navigate to /admin, single click = homepage
- WhatsApp message auto-generated with full order details including serial code
- Admin login stored in sessionStorage (cleared on browser close)
- No login required for customers

## Branches
- Ilesha Garage (ilesha_garage) — 0913-404-7214
- Omobolanle Branch (omobolanle) — 0703-994-5498
- Ilesha Branch (ilesha) — 0706-653-4360

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Project Structure

```
artifacts/
  api-server/src/routes/
    products.ts   — CRUD for products + stock toggle
    orders.ts     — CRUD for orders + code lookup
    admin.ts      — Admin verify, dashboard stats, low stock alerts
  lead-superstore/src/
    pages/
      home.tsx      — Homepage
      shop.tsx      — Product catalog
      checkout.tsx  — Checkout + WhatsApp
      admin.tsx     — Admin portal (login + dashboard + products + orders)
    components/
      Navbar.tsx    — Sticky navigation with cart button
      CartDrawer.tsx — Slide-in cart panel
      ProductCard.tsx — Product display card
      Footer.tsx    — Footer with hidden admin access logo
    lib/
      cart.ts       — Cart state management (localStorage)
      utils.ts      — Utilities (cn, formatPrice)
lib/
  api-spec/openapi.yaml  — OpenAPI contract
  api-client-react/      — Generated React Query hooks
  api-zod/               — Generated Zod schemas
  db/src/schema/
    products.ts    — Products table
    orders.ts      — Orders table
```

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
