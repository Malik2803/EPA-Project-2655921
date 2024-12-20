# Project for EPA

This project is designed to manage tasks, notifications, and reports for the EPA system. It includes a backend built with Flask and a frontend built with React.

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Python 3.x
- Node.js and npm (Node Package Manager)
- Flask
- Virtualenv (optional but recommended)

## Backend Setup

1. **Clone the Repository (or download the code)**:
    ```sh
    git clone <repository-url>
    cd <repository-directory>
    ```

2. **Set Up Virtual Environment**:
    ```sh
    python -m venv venv
    ```

3. **Activate Virtual Environment**:
    - **Windows**:
        ```sh
        venv\Scripts\activate
        ```
    - **Mac/Linux**:
        ```sh
        source venv/bin/activate
        ```

4. **Install Backend Dependencies**:
    ```sh
    pip install -r requirements.txt
    ```

5. **Set Up Environment Variables**:
    Create a `.env` file in the root directory and add the following environment variables:
    ```sh
    FLASK_APP=app.py
    FLASK_ENV=development
    ```

6. **Run Database Migrations**:
    ```sh
    flask db upgrade
    ```

7. **Run the Backend Server**:
    ```sh
    flask run
    ```

## Frontend Setup

1. **Navigate to the Frontend Directory**:
    ```sh
    cd frontend
    ```

2. **Install Frontend Dependencies**:
    ```sh
    npm install
    ```

3. **Run the Frontend Server**:
    ```sh
    npm start
    ```

## Access the Application

- Open your web browser and navigate to `http://localhost:3000` to access the frontend.
- The backend API will be running at `http://localhost:5000`.

## Additional Information

- **Environment Variables**: Ensure all necessary environment variables are set in the `.env` file for both backend and frontend configurations.
- **Database Configuration**: Ensure the database is properly configured and accessible.

## Troubleshooting

- If you encounter any issues, check the terminal output for error messages.
- Ensure all dependencies are installed correctly.
- Verify that the virtual environment is activated when running backend commands.
