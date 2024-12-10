FROM python:3.9
WORKDIR /backend

COPY . .

RUN pip install -r requirements.txt

# Run the backend service
CMD ["python", "main.py"]
