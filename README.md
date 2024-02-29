## Overview

This Python script is designed to automate the process of finding the primary web domain of brands listed in a CSV file. It leverages the capabilities of Google Search through a third-party API and utilizes OpenAI's GPT model for intelligent text analysis and URL extraction. The script reads brand names from a CSV, performs web searches to gather relevant information, and uses a trained model to identify and extract the exact domain name for each brand.

## Features

- **Automated Google Search**: Uses a third-party Google Search API to fetch search results related to brand names listed in a CSV file.
- **Intelligent Domain Extraction**: Employs OpenAI's GPT model to analyze search results and extract the precise domain name for each brand.
- **CSV File Processing**: Reads brand names from a CSV file and appends the extracted domain names to a new column, updating the original file.
- **Rate Limiting**: Incorporates a delay between API requests to avoid exceeding rate limits and ensure compliance with API usage policies.
- **Social Media Filter**: Specifically designed to ignore social media links, focusing solely on the brand's primary web domain.

## How It Works

1. **Initialization**: Set up by specifying your OpenAI and RapidAPI keys within the script.
2. **Input CSV File**: The script expects a CSV file named `brands.csv` with at least one column named 'Brand', listing brand names for which domains are to be found.
3. **Search and Analysis**: For each brand, the script fetches search results using the Google Search API, then analyzes these results with OpenAI's GPT to find the most likely web domain.
4. **CSV File Update**: Extracted domains are added to a new column in the CSV file named 'Domains', updating each brand's entry with its identified domain.
5. **Output**: The original CSV file is updated to include the domains, facilitating easy access to the extracted data.

## Usage

1. **Prerequisites**: Ensure you have Python installed on your system, along with the `requests`, `csv`, and `openai` libraries.
2. **API Keys**: Obtain your API keys from OpenAI (https://platform.openai.com/api-keys) and RapidAPI Google Search Result API (https://rapidapi.com/rphrp1985/api/google-api31) and insert them into the script in place of `YOUR_OPENAI_KEY_HERE` and `YOUR_RAPIDAPI_KEY_HERE`.
3. **CSV File Preparation**: Prepare your `brands.csv` file with brand names listed under the 'Brand' column.
4. **Script Execution**: Run the script with Python to begin the domain extraction process.

### Example Command

```sh
python domain_extractor.py
```

## Customization

- **CSV File Path**: Modify `CSV_FILE_PATH` to point to a different input file if needed.
- **Delay Configuration**: Adjust the `time.sleep(1)` value to change the delay between API requests based on the rate limit of the APIs you're using.
- **API Endpoint and Headers**: Update the Google Search API endpoint and headers if you switch to a different API provider or if API requirements change.

## Ethical Use and Compliance

- **Rate Limits**: Adhere to the rate limits imposed by the APIs to avoid service disruptions.
- **Data Usage**: Ensure that the use of scraped domain data complies with legal regulations and respects privacy considerations.

## Disclaimer

This script is provided for educational and development purposes. Users are responsible for using the tool ethically and in accordance with the terms of service of the APIs and data sources involved.
