# Описание проекта

Это приложение позволяет пользователям покупать токены, проверять их статус и получать базовую информацию о токенах.

**Ссылка на сайт:** [pump.black](https://pump.black)

Скриншот: [Главная страница](https://github.com/DimaWide/wp-themes/blob/main/assets-data/pump.black/screencapture-loc-pump-black.jpg) | [Мобильный вид](https://github.com/DimaWide/wp-themes/blob/main/assets-data/pump.black/screencapture-loc-pump-black-mobile.jpg)

# Notes App

A feature-rich, responsive Notes Management application built with React and integrated with a custom WordPress REST API. The app allows users to manage their notes efficiently with features like authentication, registration, CRUD operations, pagination, search, theme switching, a rich text editor, and user profile management.

![Notes App Screenshot](path-to-your-screenshot.png)

---

## Features

- **Authentication & Registration:**  
  - Secure login and registration using JWT tokens stored in `localStorage`.
  - Registration includes username, email, and password validation.
  - Error handling for invalid credentials and server issues during login or registration.
- **CRUD Operations:** Create, edit, update, and delete notes with a user-friendly interface.
- **Rich Text Editor:** Use **React-Quill** for a powerful, customizable text editor with rich formatting options.
- **Search with Debounce:** Search notes in real-time with optimized performance.
- **Pagination:** Seamless navigation between pages for large datasets.
- **Responsive Design:** Works perfectly on mobile, tablet, and desktop screens.
- **Notifications:** Real-time success and error messages.
- **Custom API Integration:** Communicates with a custom WordPress REST API for data handling.
- **Light and Dark Mode:** Toggle between light and dark themes for a comfortable user experience.
- **User Profile Management:** View and update user profile information, including name, email, and avatar.
- **UI with Semantic UI:** Leverages **Semantic UI React** for a modern, responsive, and accessible user interface.

---

## Tech Stack

- **Frontend:**  
  - React.js with functional components and hooks
  - React-Quill for rich text editing
  - Semantic UI React for UI components
  - Axios for API requests
  - React Router for client-side navigation
  - Tailwind CSS for styling, including light/dark mode support

- **Backend:**  
  - WordPress REST API
  - Custom endpoints for notes management, user profile handling, authentication, and registration

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/notes-app.git
