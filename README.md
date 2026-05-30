This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

<<<<<<< Updated upstream
![Statements](https://img.shields.io/badge/statements-90.92%25-brightgreen.svg?style=flat) ![Branches](https://img.shields.io/badge/branches-92.44%25-brightgreen.svg?style=flat) ![Functions](https://img.shields.io/badge/functions-90%25-brightgreen.svg?style=flat) ![Lines](https://img.shields.io/badge/lines-90.92%25-brightgreen.svg?style=flat) [![CI](https://github.com/admclamb/algowars-ssr/actions/workflows/ci.yml/badge.svg)](https://github.com/admclamb/algowars-ssr/actions/workflows/ci.yml)

# Getting Started

---

- [Overview](#overview)
  - [Tech Stack](#tech-stack)
  - [Architecture](#architecture)
  - [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
  - [Setup Env File](#setup-env-file)
- [Setup](#setup)
  - [Setup Auth0](#setup-auth0)
- [Testing](#testing)
- [Development](#development)
- [References](#references)

## Overview

---

This repo is the client application for Algowars. This project was built with:

### Tech Stack

This project is built with:

- Next.js
- Tailwindcss
- Shadcn
- Auth0

Testing with this project was built with:

- Vitest (Unit Testing)
- Playwright (End to End)

### Architecture

The client application was heavily inspired by [Bulletproof React](https://github.com/alan2207/bulletproof-react). It was built with Tailwindcss and Shadcn so it makes a lot of architecture decisions based off these libraries.

### Project Structure

This solution is broken up into multiple important directories:

#### 1. App

**Purpose:** Contains the routing and related page components. This is required for Next.js.

---

#### 2. Common

**Purpose:** Directory containing common components and tools used throughout the application. This directory is meant to be small as a lot of common folders can become bloated.

---

#### 3. Components

**Purpose:** This folder contains reusable components throughout the application. All of the Shadcn components stay in the `ui` folder.

---

#### 4. Features

**Purpose:** This folder contains all the components and tools used for a specific feature in the product. These features should not interact with other features.

---

#### 5. Lib

**Purpose:** This folder contains all the components and tools that are used for external libraries.

---

## Prerequisites

You need node 24 to work on this.

Before you start, make sure you create a `.env` file and fill out the necessary information from Auth0.

### Setup Env File

Run the following command:

**Bash:**
=======
First, run the development server:
>>>>>>> Stashed changes

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
