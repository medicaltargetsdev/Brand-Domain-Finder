import csv
import requests
import time
import os
from openai import OpenAI

# Constants
OPENAI_API_KEY = 'YOUR_OPENAI_KEY_HERE'
RAPIDAPI_KEY = 'YOPUR_RAPID_kEY_HERE'
CSV_FILE_PATH = 'brands.csv'
TEMP_FILE_PATH = 'brands_updated.csv'

# Initialize the OpenAI client
client = OpenAI(api_key=OPENAI_API_KEY)

# Function to perform Google search
def fetch_search_results(query):
    url = 'https://google-api31.p.rapidapi.com/websearch'
    headers = {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'google-api31.p.rapidapi.com'
    }
    payload = {
        'text': query,
        'safesearch': 'off',
        'timelimit': '',
        'region': 'wt-wt',
        'max_results': 20
    }
    response = requests.post(url, json=payload, headers=headers)
    response_data = response.json()
    
    # Extract title, href, and body from each search result and format them
    search_result_items = []
    for item in response_data.get('result', []):
        title = item.get('title', '')
        href = item.get('href', '')
        body = item.get('body', '')
        search_result_items.append(f"title: {title}\nhref: {href}\nbody: {body}")

    # Join all the formatted items into a single string
    combined_results = '\n'.join(search_result_items)
    return combined_results[:1000]  # Truncate to 1000 characters


# Function to extract domain name using GPT
def extract_domain(search_results, query):
    prompt = (f'You are required to extract the URL of the company named {query} from the provided text. ' +
                'It is imperative that you only return the exact URL, with no additional text or formatting. ' + 
                'Do not include any introductory phrases, explanations, or any other characters besides the URL itself. ' + 
                'The URL should be a standalone string. For example, if the company’s name is "Example Co" and the URL is found to be "example.com", ' +
                'your response should be exactly: \n\n example.com\n\n' +
                'It should not be: \n\nThe URL of Example Co is example.com\n\n' + 
                'or any other variation that includes extra text or more than one link for a brand. ' +
                'Also, you SHOULD NOT print any social media links like facebook, youtube, instagram, twitter, etc.' +
                'Here is the text from which you need to extract the URL of {query}:\n\n' + 
              search_results + '\n\n' +
              'Remember, only return the one exact URL as a standalone string, nothing else. If cant find the result, please print N/A. If you found a social link like facebook, instagram, please print N/A')
    response = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="gpt-3.5-turbo",
    )
    return response.choices[0].message.content.strip()

# Main script to read and write CSV file
def process_csv():
    with open(CSV_FILE_PATH, mode='r', newline='', encoding='utf-8') as infile, \
         open(TEMP_FILE_PATH, mode='w', newline='', encoding='utf-8') as outfile:
        reader = csv.DictReader(infile)
        writer = csv.DictWriter(outfile, fieldnames=reader.fieldnames)
        writer.writeheader()

        for row in reader:
            brand = row['Brand']
            print(f"Searching for: {brand}")
            search_results = fetch_search_results(brand)
            #print(f"Results: {search_results}")
            domain_name = extract_domain(search_results, brand)
            row['Domains'] = domain_name
            writer.writerow(row)
            time.sleep(1)  # Delay to avoid hitting API rate limits

    # Replace the old CSV with the updated one
    os.replace(TEMP_FILE_PATH, CSV_FILE_PATH)
    print("\033[92mTask Completed!\033[0m")

# Run the script
process_csv()
