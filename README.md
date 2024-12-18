# AniAtlas

Welcome to the AniAtlas project! This repository is designed to help you find and share anime recommendations.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation and Usage](#installation-and-usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

AniAtlas is a community-driven platform where users can suggest and discover new anime series. Whether you're a seasoned otaku or new to the world of anime, this project aims to provide a diverse range of recommendations.

## Features

- **Search Functionality**: Easily find anime based on genres, ratings, keywords and more.

## Installation and usage

To get started with AniAtlas, follow these steps:

Note: MongoDB is required on port 27017.

1. Clone the repository:
   ```bash
   git clone https://github.com/ogidevs/AniAtlas.git
   ```
2. Navigate to the project directory:
   ```bash
   cd AniAtlas
   ```
3. Install the necessary dependencies on client:
   ```bash
   cd client
   npm install
   npm run build
   ```
4. Run backend:
   ```bash
   cd backend
   python -m venv .venv
   pip install -r requirements.txt
   python main.py
   ```

Open your browser and navigate to `http://127.0.0.1:8081` to start exploring AniAtlas.
Open your browser and navigate to `http://localhost:8081/docs` to explore swagger docs.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

Happy anime exploring!
