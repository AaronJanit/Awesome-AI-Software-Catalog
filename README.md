# Lume AI Software Catalog

A web-based catalog for discovering and exploring AI software tools. Built as part of a HackClub project.

## Description

This application provides an easy-to-use interface to browse thousands of AI software tools across various categories. Users can search for specific tools, explore by category, get random recommendations via the "Wildcard" feature, or ask an AI assistant for personalized recommendations.

## Features

- **Search Functionality**: Search through thousands of AI tools by name or description
- **Category Browsing**: Explore tools organized by categories like Productivity Tools, Writing, Image Generation, etc.
- **Wildcard Mode**: Discover random AI tools for inspiration
- **AI Recommendations**: Ask an AI assistant for tool recommendations based on your needs
- **Responsive Design**: Works on desktop and mobile devices
- **Fast and Lightweight**: Built with vanilla HTML, CSS, and JavaScript

## Installation

1. Ensure you have Node.js installed on your system
2. Install dependencies:
   ```bash
   npm install express
   ```
3. Start the server:
   ```bash
   node server.js
   ```
4. Open your browser and navigate to `http://localhost:3000`

   or

Go to 
## Usage

- **Home Page**: Search for tools or browse categories
- **All Softwares**: View all available tools in a list
- **Wildcard**: Get a random tool recommendation
- **Ask AI**: Describe your needs and get AI-powered recommendations

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js with Express.js
- **AI Integration**: Ollama for local AI recommendations
- **Data**: JSON files containing software catalog data

## Data Sources

The catalog data is sourced from:
- `software.json`: Main software catalog
- `awesome-ai.json`: Additional AI tools data

## Contributing

This is a HackClub project. Feel free to contribute by:
- Adding new software entries to the JSON files
- Improving the UI/UX
- Enhancing the search functionality
- Adding new features

## Links

- [HackClub Project Page](https://flavortown.hackclub.com/projects/4782)
- [GitHub Repository](https://flavortown.hackclub.com/projects/4782) (via HackClub)

## License

This project is open-source and available under the MIT License.
