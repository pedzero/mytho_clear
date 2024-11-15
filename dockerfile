FROM python:3.10-slim

RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app
WORKDIR /app

CMD ["python", "-m", "flask", "run", "--host=0.0.0.0"]
