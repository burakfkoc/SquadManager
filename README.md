# SquadManager

SquadManager is a team management system designed to help you organize and manage your squad effectively.

## Project Structure

The project is divided into two main parts:

- **frontend/**: A Next.js application handling the user interface.
- **backend/**: A Django application serving the API and business logic.

## Getting Started

### Prerequisites

- Node.js
- Python (3.8+)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Run migrations:
   ```bash
   python manage.py migrate
   ```
6. Start the server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## License

[MIT](https://choosealicense.com/licenses/mit/)
