## Overview

This Node.js script is designed to search for brand URLs given only their names. It utilizes the Google Search API and OpenAI's GPT to find the most accurate URL associated with a brand name. The script reads brand names from a CSV file, searches for each brand's official website, and then appends the results to a new CSV file, making it a useful tool for marketing, research, and data enrichment tasks.

## Features

- **CSV Input**: Reads a list of brand names from a CSV file.
- **Google Search API Integration**: Utilizes the Google Search API to find web pages associated with each brand.
- **OpenAI's GPT for Domain Extraction**: Leverages OpenAI's GPT to intelligently extract the main domain/URL for each brand from the search results.
- **CSV Output**: Outputs the results into a new CSV file, including the brand name and its associated domain.
- **Real-time Processing Feedback**: Provides console feedback on the processing status of each brand.

## How It Works

1. **Preparation**: The script starts by checking the existence of an output CSV file and creates one if it doesn't exist.
2. **Reading CSV**: It reads brand names from the specified CSV file, expecting a column named 'Brands'.
3. **Performing Searches**: For each brand, it performs a Google search to find associated web pages.
4. **Extracting URLs**: Using OpenAI's GPT, it processes the search results to extract the most relevant URL for each brand.
5. **Writing Results**: Each brand and its extracted URL are appended to the output CSV file.
6. **Completion**: Upon processing all brands, the script outputs the total processing time in the console.

## Usage

Before running the script, ensure you have Node.js installed and the required packages (`fs`, `axios`, `openai`, `csv-parser`) available in your project. You will also need valid API keys for both the Google Search API and OpenAI.

1. Prepare a CSV file named `brands.csv` with a single column named 'Brands', listing all the brands you wish to find URLs for.
2. Set your OpenAI and Google Search API keys in the script's constants.
3. Run the script with Node.js:

```bash
node '.\Domain Finder.js'
```

4. Check the output CSV file named `results-[current_date_time].csv` for the brands and their associated URLs.

Note: The script outputs real-time processing status in the console, including any errors encountered during the search or domain extraction process.
