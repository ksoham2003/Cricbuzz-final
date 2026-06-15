# 🔐 Roles & Permissions

## Overview

The CricBuzz platform uses **Role-Based Access Control (RBAC)** to secure resources and ensure users can only perform actions permitted by their role.

There are three primary roles:

1. **SUPER_ADMIN**
2. **ADMIN**
3. **SCORER**

Each role has a different level of access and responsibility within the system.

---

# Role Hierarchy

```text
SUPER_ADMIN
      │
      ▼
ADMIN
      │
      ▼
SCORER
```

Higher roles inherit access to lower-level operations where applicable.

---

# 👑 SUPER_ADMIN

## Description

The SUPER_ADMIN is the highest authority in the system and has unrestricted access to all platform features.

This role is responsible for:

* Platform administration
* User management
* Role assignment
* Tournament oversight
* System monitoring

---

## Responsibilities

### User Management

* Create Users
* Update Users
* Delete Users
* Activate/Deactivate Users
* Assign Roles

### Tournament Management

* Create Series
* Update Series
* Delete Series

### Team Management

* Create Teams
* Update Teams
* Delete Teams

### Player Management

* Create Players
* Update Players
* Delete Players

### Match Operations

* Create Matches
* Manage Playing XI
* Manage Scores
* Manage Commentary

### System Operations

* View Dashboard Analytics
* Monitor Activity Logs
* Manage Platform Settings

---

## Example

```text
SUPER_ADMIN
├── Create Admin
├── Create Scorer
├── Manage All Series
├── Manage All Teams
├── Manage All Players
├── Manage All Matches
└── Full Platform Access
```

---

# 🛠️ ADMIN

## Description

The ADMIN is responsible for tournament and match preparation.

An ADMIN manages the cricket operations but cannot manage users or system settings.

---

## Responsibilities

### Series Management

* Create Series
* Update Series
* View Series

### Team Management

* Create Teams
* Update Teams
* Delete Teams

### Player Management

* Create Players
* Update Players
* Delete Players

### Squad Management

* Create Squad
* Add Players To Squad
* Remove Players From Squad

### Match Management

* Create Match
* Schedule Match
* Update Match

### Playing XI Management

* Select Playing XI
* Update Playing XI

---

## Restrictions

An ADMIN cannot:

* Create Users
* Delete Users
* Assign Roles
* Access System Settings
* View Platform Administration Data

---

## Example

```text
ADMIN
├── Create Tournament
├── Create Teams
├── Add Players
├── Manage Squad
├── Schedule Matches
└── Select Playing XI
```

---

# 🎯 SCORER

## Description

The SCORER is responsible for live match operations.

This role operates during an active match and manages scoring activities.

---

## Responsibilities

### Match Operations

* Conduct Toss
* Start Match
* Manage Innings

### Scoring

* Update Ball-by-Ball Scores
* Record Extras
* Record Wickets
* Record Boundaries

### Commentary

* Add Commentary
* Update Commentary

### Match Completion

* End Match
* Declare Result

---

## Restrictions

A SCORER cannot:

* Create Series
* Create Teams
* Create Players
* Create Squad
* Create Match
* Manage Users

---

## Example

```text
SCORER
├── Conduct Toss
├── Start Match
├── Update Score
├── Add Commentary
├── End Match
└── Publish Result
```

---

# Permissions Matrix

| Module           | SUPER_ADMIN | ADMIN   | SCORER  |
| ---------------- | ----------- | ------- | ------- |
| Authentication   | ✅           | ✅       | ✅       |
| User Management  | ✅           | ❌       | ❌       |
| Dashboard        | ✅           | ✅       | Limited |
| Series           | ✅           | ✅       | ❌       |
| Teams            | ✅           | ✅       | ❌       |
| Players          | ✅           | ✅       | ❌       |
| Squad            | ✅           | ✅       | ❌       |
| Playing XI       | ✅           | ✅       | ❌       |
| Match Creation   | ✅           | ✅       | ❌       |
| Match Update     | ✅           | ✅       | ❌       |
| Toss Management  | ✅           | ✅       | ✅       |
| Live Scoring     | ✅           | ✅       | ✅       |
| Commentary       | ✅           | ✅       | ✅       |
| Match Completion | ✅           | ✅       | ✅       |
| Analytics        | ✅           | Limited | ❌       |
| Settings         | ✅           | ❌       | ❌       |

---

# Real World Workflow

## Step 1: Platform Setup

```text
SUPER_ADMIN
    │
    ├── Create Admin
    └── Create Scorer
```

---

## Step 2: Tournament Setup

```text
ADMIN
    │
    ├── Create Series
    ├── Create Teams
    ├── Add Players
    ├── Create Squad
    ├── Create Matches
    └── Select Playing XI
```

---

## Step 3: Match Day

```text
SCORER
    │
    ├── Conduct Toss
    ├── Start Match
    ├── Update Score
    ├── Add Commentary
    ├── End Match
    └── Publish Result
```

---

# Authorization Middleware Examples

## SUPER_ADMIN Only

```javascript
authorize("SUPER_ADMIN");
```

---

## SUPER_ADMIN & ADMIN

```javascript
authorize(
  "SUPER_ADMIN",
  "ADMIN"
);
```

---

## All Match Officials

```javascript
authorize(
  "SUPER_ADMIN",
  "ADMIN",
  "SCORER"
);
```

---

# Security Guidelines

* Every protected route must verify JWT.
* Every protected route must validate user role.
* Unauthorized access should return HTTP 403.
* Invalid tokens should return HTTP 401.
* Sensitive actions must be logged.
* User passwords must always be hashed.

---

# Future Roles

Potential future roles:

* Tournament Manager
* Umpire
* Analyst
* Commentator
* Team Manager
* Viewer

---

# Definition of Done

✅ RBAC Implemented

✅ Role Validation Middleware Added

✅ Protected Routes Configured

✅ JWT Authentication Integrated

✅ User Permissions Tested

✅ Access Control Verified

✅ Security Review Completed
