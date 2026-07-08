FROM python:3.11-slim

# Set working directory
WORKDIR /code

# Copy requirements from backend
COPY backend/requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY backend/ .

# Hugging Face Spaces listens on port 7860
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]