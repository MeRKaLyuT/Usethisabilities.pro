## Overview

**UseThisAbilities** is a web application inspired by roadmap.sh, with a shift towards a skill marketplace format.
Users can create and publish their own courses or share specific skills with others.

The project aims to provide a more structured and focused learning experience compared to platforms like YouTube, while remaining simpler and more accessible than traditional marketplaces.

## Tech Stack

The system is built using the following technologies:

**Frontend**: React, MUI, React Query, Redux

**Backend**: Django, Django REST Framework (REST API)

**Database**: PostgreSQL

## Authentication & Security

User authentication is implemented using JWT tokens stored in HttpOnly cookies.
This approach was chosen to:
* reduce the risk of XSS attacks
* prevent token theft via malicious scripts

CSRF protection is used for all unsafe HTTP requests.

## Business Logic

At the current stage, most of the business logic is located on the frontend side and is openly available in the codebase.

**Frontend logic**: features/ directory

**Backend business logic**: minimal at the moment, planned to be expanded in future iterations

This decision allows faster iteration during the MVP phase.

## System Goals & Scope
#### Goals

Help users efficiently find and learn specific skills.
Provide a simpler and more structured alternative to YouTube.
Allow users to share knowledge in a marketplace-like format

#### Inspirations

The project is inspired by YouTube (content accessibility), Amazon (marketplace concept), roadmap.sh (structured learning paths)

#### Out of Scope (for now)

1. Paid transactions
2. Mobile applications
These features are planned for later stages of development.

## System Components

* **Frontend**: _React_ application responsible for UI, state management, and user interaction
* **Backend**: _REST API_ handling authentication, data access, and validation
* **Database**: _PostgreSQL_ for persistent data storage
* **Auth**: JWT (HttpOnly cookies) + CSRF protection
* **Storage**: User profiles, avatars, personal notes
* **Infrastructure**: _Nginx_ and _Docker_ (planned)

## Future Plans

1. Introduce paid private courses
2. Implement transaction system
3. Develop a mobile application
4. Move more business logic to the backend
5. Add role-based access control
6. Add AI to exhance the user expirience 

<hr>

### My contacts:
* **Telegram**: @MeRKaLyuT
