import requests

# Replace this with the actual API URL for your Flipkart Scraper
BASE_URL = "https://api.flipkart-scraper.com"

def get_product_info(query):
    try:
        # Make the API request with the query
        response = requests.get(f"{BASE_URL}/products", params={"query": query})
        response.raise_for_status()  # Check if the request was successful
        return response.json()  # Return the JSON response with product data
    except requests.exceptions.RequestException as e:
        return f"Error fetching product info: {e}"
