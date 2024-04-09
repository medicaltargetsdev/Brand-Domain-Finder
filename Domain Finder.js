const fs = require('fs');
const axios = require('axios');
const OpenAI = require('openai');
const csvParser = require('csv-parser');

const startTime = new Date();// Format the current date and time
const month = (startTime.getMonth() + 1).toString().padStart(2, '0'); // Pad with leading zero
const day = startTime.getDate().toString().padStart(2, '0'); // Pad with leading zero
const hour = startTime.getHours().toString().padStart(2, '0'); // Pad with leading zero
const minutes = startTime.getMinutes().toString().padStart(2, '0'); // Pad with leading zero

`
This script is meant to search for brand's URL's when all we have is just their brand names
It uses Google Search API and OpenAI API to accomplish the task.

Google Search API --> https://rapidapi.com/rphrp1985/api/google-api31 the Web Search option
OpenAI API --> https://openai.com/

Requirements: A CSV file with data in a column named 'Brands' 
`

// Constants
const OPENAI_API_KEY = 'YOUR-OPENAI_API_KEY';
const RAPIDAPI_KEY = 'YOUR-RAPIDAPI_KEY';
const CSV_FILE_PATH = 'brands.csv';
const outputFilePath = `results-${month}-${day}-${hour}-${minutes}.csv`;
const fileExists = fs.existsSync(outputFilePath);

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
let processing = 0;

function readUrlsFromCsv(filePath) {
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(filePath)
      .pipe(csvParser()) // Removed the array of headers to let csv-parser use the first line of the CSV as headers automatically.
      .on('data', (row) => {
        // Push an object containing both brand and email to the array
        data.push({ brand: row.Brands }); // Ensure the header 'Brands' match those in the CSV file exactly.
      })
      .on('end', () => {
        resolve(data);
      })
      .on('error', reject);
  });
}

// Function to append a brand and its domain to the CSV file
async function appendToCsv(brand, domain) {
  const line = `${brand},${domain}\n`; // Using quotes to ensure commas in values do not break CSV format
  fs.appendFile(outputFilePath, line, (err) => {
    if (err) throw err;
    //console.log(`Appended to CSV: Brand: ${brand}, Domain: ${domain}, Email: ${email}`);
  });
}

// Ensure to initialize your output CSV file with headers if it does not exist
if (!fileExists) {
  fs.writeFileSync(outputFilePath, 'Brand,Domain\n', (err) => {
    if (err) throw err;
  });
}

// Function to perform Google search
async function fetchSearchResults(query) {
  const options = {
    method: 'POST',
    url: 'https://google-api31.p.rapidapi.com/websearch',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'google-api31.p.rapidapi.com'
    },
    data: {
      text: query,
      safesearch: 'off',
      timelimit: '',
      region: 'wt-wt',
      max_results: 20
    }
  };

  try {
    const response = await axios.request(options);
    const searchResultItems = response.data.result.map((item) => {
      const title = item.title || '';
      const href = item.href || '';
      const body = item.body || '';
      return `title: ${title}\nhref: ${href}\nbody: ${body}`;
    });
    const combinedResults = searchResultItems.join('\n');
    return combinedResults.slice(0, 1000); // Truncate to 1000 characters
  } catch (error) {
    console.error('Error fetching search results:', error);
    return '';
  }
}

// Function to extract domain name using GPT
async function extractDomain(searchResults, query) {
  const prompt = `You are required to extract the URL of the company named ${query} from the provided text. ' +
  'It is imperative that you only return the exact URL, with no additional text or formatting. ' + 
  'Do not include any introductory phrases, explanations, or any other characters besides the URL itself. ' + 
  'The URL should be a standalone string. For example, if the company’s name is "Example Co" and the URL is found to be "example.com", ' +
  'your response should be exactly: \n\n example.com\n\n' +
  'It should not be: \n\nThe URL of Example Co is example.com\n\n' + 
  'or any other variation that includes extra text or more than one link for a brand. ' +
  'Also, you SHOULD NOT print any social media links like facebook, youtube, instagram, twitter, etc.' +
  'Here is the text from which you need to extract the URL of ${query}:\n\n' + 
${searchResults} + '\n\n' +
'Remember, only return the one exact URL as a standalone string, nothing else. If cant find the result, please print N/A. If you found a social link like facebook, instagram, please print N/A`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "You are a helpful assistant."
      }, {
        role: "user",
        content: prompt
      }],
    });

    // Assuming the completion is in the format expected, extract the text
    const extractedDomain = completion.choices[0].message.content.trim();
    return extractedDomain || 'N/A';
  } catch (error) {
    console.error('Error extracting domain:', error);
    return 'N/A';
  }
}


// Main script to read and write CSV file
async function main () {
  const urlsData = await readUrlsFromCsv(CSV_FILE_PATH); // this should return an array of objects with brand and email properties
    for (const data of urlsData) {
      let domain;
      processing++;
      const fullUrl = data.brand.startsWith('http://') || data.brand.startsWith('https://') ? data.brand : `http://${data.brand}`;
      console.log(`\x1b[33m${processing} Processing: ${fullUrl}\x1b[0m`);  
      const searchResults = await fetchSearchResults(fullUrl);
      domain = await extractDomain(searchResults, fullUrl) || fullUrl;
      console.log(`\x1b[32mWebsite found: ${domain}\x1b[0m`);
      await appendToCsv(data.brand, domain);
    }
    const endTime = new Date();    
    const duration = endTime - startTime;    
    const durationInMinutes = Math.floor(duration / 60000); // Convert milliseconds to whole minutes
    const durationInSeconds = (duration % 60000) / 1000; // Get remainder of milliseconds converted to seconds    
    console.log(`\x1b[32mTask Completed in ${durationInMinutes} minutes and ${durationInSeconds.toFixed(2)} seconds!\x1b[0m`); // Green
}

// Run the script
main();

async function testRapidApi(query) {
  const searchResults = await fetchSearchResults(query);
  console.log('Test Search Results:', searchResults);
}

//testRapidApi('Apple Inc');

async function testGPT(searchResults, query) {
  const gptAnswer = await extractDomain(searchResults, query);
  console.log(gptAnswer);
}
