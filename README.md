# OCR Workflow Project

This project provides a simple and professional workflow for uploading images, performing OCR (Optical Character Recognition) using Azure Cognitive Services, and displaying the results in a user-friendly web interface.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Technologies Used](#technologies-used)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Overview

This project enables users to upload an image, send it to a backend server that interacts with the Azure OCR API, and display both the annotated image and the extracted text. The interface is simple yet professional, using a 3-step process:

1. **Upload Image**
2. **Perform OCR**
3. **View Results**

The user interface is built with **HTML**, **Bootstrap**, and custom CSS for a clean and modern experience, while the backend is powered by **Node.js** and **Express**.

## Features

- Image Upload: Drag-and-drop or click-to-select an image.
- Perform OCR: Communicates with Azure Cognitive Services to extract text.
- Annotated Results: Displays bounding boxes and recognized text.
- Smooth, professional user interface with intuitive navigation.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

- **Node.js** (v12 or later)
- **npm** (Node Package Manager)
- Azure Cognitive Services subscription for Computer Vision API

### Installation

1. **Clone the repository**:
   
   ```bash
   git clone <repository-url>
   cd ocr-workflow-project
   ```

2. **Install the required npm packages**:
   
   ```bash
   npm install dotenv express multer axios cors sharp
   ```

3. **Set up environment variables**:
   
   Create a `.env` file in the root directory with the following details:
   
   ```env
   AZURE_SUBSCRIPTION_KEY=your_azure_subscription_key
   AZURE_ENDPOINT=https://your_azure_endpoint
   PORT=3000
   ```

4. **Start the backend server**:
   
   ```bash
   npm start
   ```

5. **Serve the HTML file**:
   
   You can use a simple HTTP server to serve the UI on `http://localhost:3001`:
   
   ```bash
   npx http-server ./public -p 3001
   ```

## Usage

1. **Open the UI**:
   Open your web browser and navigate to `http://localhost:3001`.

2. **Upload Image**:
   Click the "Choose File" button in Step 1 to upload an image.

3. **Perform OCR**:
   Click the "Perform OCR" button to send the image to the backend for text recognition.

4. **View Results**:
   See the annotated image and recognized text displayed side by side in Step 3.

## File Structure

```plaintext
Frontend/
├── public/
│   ├── ui.html
│   ├── styles.css
│   ├── app.js
├── frontend.js

Backend/
│   ├── server.js
│   ├── .env
├── package.json
```

- **public/**: Contains front-end files such as HTML, CSS, and JavaScript.
- **server.js**: The main server file handling backend logic.
- **.env**: Environment variables for Azure credentials.

## Technologies Used

- **Node.js**: Backend server for processing requests.
- **Express**: Web framework for Node.js.
- **Multer**: Middleware for handling file uploads.
- **Axios**: HTTP client for making requests to Azure API.
- **Sharp**: Image manipulation library for adding OCR bounding boxes.
- **Bootstrap 5**: Front-end framework for creating a responsive UI.

## Environment Variables

The following environment variables are required:

- `AZURE_SUBSCRIPTION_KEY`: Your Azure Cognitive Services subscription key.
- `AZURE_ENDPOINT`: Your Azure endpoint for Computer Vision API.
- `PORT`: Port number for running the backend server.

## Troubleshooting

- **CORS Issues**: Ensure that the backend server allows requests from `http://localhost:3001`. Check the CORS configuration in `server.js`.
- **500 Errors**: Verify that the Azure credentials are correctly set in the `.env` file.
- **Missing Dependencies**: Make sure to run `npm install` to install all dependencies before starting the server.

Feel free to fork the repository and submit pull requests for improvements. Contributions are always welcome!

