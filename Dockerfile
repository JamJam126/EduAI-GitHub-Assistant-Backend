FROM python:3.11-slim

# Set working directory inside the container
WORKDIR /code

# Copy everything from your current folder into /code
COPY . /code

# Keep container alive (so Node.js can connect and run commands)
CMD ["sleep", "infinity"]
