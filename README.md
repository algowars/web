<div align="center">

# Algowars Client

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs) ![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=222) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript) ![Vitest](https://img.shields.io/badge/Vitest-3-6E9F18?logo=vitest)

</div>

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

Before you start, make sure you create a `.env` file and fill out the necessary information from Auth0.

### Setup Env File

Run the following command:

**Bash:**

```bash
cp .env.example .env
```
