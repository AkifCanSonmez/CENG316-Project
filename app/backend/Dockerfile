# 1. Temel imaj
FROM python:3.12-slim

# 2. Ortam değişkenleri
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# 3. Çalışma dizini
WORKDIR /app

# 4. Bağımlılıkları yükle
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# 5. Projeyi kopyala
COPY ./src /app

# 6. Uvicorn ile başlat
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
