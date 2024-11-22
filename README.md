# Invoice Management System

> This project was developed as part of the Swipe assignment for "Automated Data Extraction and Invoice Management"

A modern web application for automated invoice processing and management, built with React, Redux, and Shadcn UI. The system uses Google's Gemini AI for intelligent data extraction from various document formats.

## Features

- 📄 Dark/Light theme support
- 📄 Automated invoice data extraction
- 📊 Manage invoices, products, and customers
- 📱 Responsive design
- 🔄 Real-time data updates
- 📁 Support for multiple file formats (PDF, Images, Excel, CSV)
- 🎨 Modern UI with Shadcn components

## Tech Stack

- **Frontend Framework**: React
- **State Management**: Redux Toolkit
- **UI Components**: Shadcn UI
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini AI
- **File Processing**: XLSX

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/omthakare16/automated-invoice-management.git
   cd invoice-management-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. **Upload Documents**: 
   - Drag and drop or click to upload invoices
   - Supported formats: PDF, Images, Excel files, CSV

2. **Manage Data**:
   - View and edit invoices
   - Track products
   - Manage customer information

3. **Theme Toggle**:
   - Switch between light and dark modes using the theme toggle button

## Project Structure

```
src/
├── components/          # React components
├── store/              # Redux store and slices
├── lib/                # Utility functions
└── styles/             # Global styles
```


## Key Components

1. **FileUpload**: Handles document upload and processing
2. **InvoicesTable**: Manages invoice data display and editing
3. **ProductsTable**: Handles product information
4. **CustomersTable**: Manages customer data
5. **ThemeToggle**: Controls application theme


## Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) for the beautiful components
- [Google Gemini AI](https://deepmind.google/technologies/gemini/) for document processing
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for the build tool

