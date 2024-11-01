# Stage 1: Build React client
FROM node:20 AS builder
WORKDIR /client

# Copy package.json and install dependencies
COPY client/package*.json ./
RUN npm install

# Copy the rest of the React app source code and build it
COPY client/ .
RUN npm run build

# Stage 2: Backend setup with client static files
FROM python:3.9
WORKDIR /backend

# Copy backend code
COPY backend/ .
COPY --from=builder /client/dist /client/dist 

# Install backend dependencies (Python example)
RUN pip install -r requirements.txt

# Run the backend service
CMD ["python", "main.py"]
