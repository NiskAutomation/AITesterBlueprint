import os
import sys
import base64
import requests
from dotenv import load_dotenv

# Load .env from parent directory
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

def verify_jira_connection():
    """Verify JIRA API connection using credentials from .env"""
    
    jira_email = os.getenv('JIRA_EMAIL')
    jira_token = os.getenv('JIRA_API_TOKEN')
    jira_base_url = os.getenv('JIRA_BASE_URL')
    
    print("=" * 60)
    print("JIRA API Connection Verification (BLAST Phase 2: Link)")
    print("=" * 60)
    
    # Validate inputs
    if not jira_email:
        print("[FAIL] JIRA_EMAIL not found in .env")
        return False
    
    if not jira_token:
        print("[FAIL] JIRA_API_TOKEN not found in .env")
        return False
    
    if not jira_base_url:
        print("[FAIL] JIRA_BASE_URL not found in .env")
        return False
    
    print(f"[OK] JIRA_EMAIL: {jira_email}")
    print(f"[OK] JIRA_BASE_URL: {jira_base_url}")
    print(f"[OK] JIRA_API_TOKEN: {'*' * 20} (hidden)")
    
    # Normalize base URL
    if not jira_base_url.endswith('/'):
        jira_base_url += '/'
    
    # Construct endpoint
    endpoint = f"{jira_base_url}rest/api/2/myself"
    
    # Create Basic Auth
    credentials = base64.b64encode(f"{jira_email}:{jira_token}".encode()).decode()
    
    headers = {
        'Authorization': f'Basic {credentials}',
        'Accept': 'application/json'
    }
    
    print(f"\n[TEST] Connecting to: {endpoint}")
    
    try:
        response = requests.get(endpoint, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print(f"[PASS] JIRA API connection successful!")
            print(f"[INFO] Account: {data.get('displayName', 'N/A')}")
            print(f"[INFO] Email: {data.get('emailAddress', 'N/A')}")
            print(f"[INFO] Account ID: {data.get('accountId', 'N/A')}")
            return True
        elif response.status_code == 401:
            print(f"[FAIL] Authentication failed (401). Check email and API token.")
            print(f"[INFO] Response: {response.text}")
            return False
        elif response.status_code == 403:
            print(f"[FAIL] Forbidden (403). Check permissions.")
            return False
        else:
            print(f"[FAIL] Unexpected status: {response.status_code}")
            print(f"[INFO] Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError as e:
        print(f"[FAIL] Connection error: {e}")
        return False
    except requests.exceptions.Timeout:
        print(f"[FAIL] Request timed out")
        return False
    except Exception as e:
        print(f"[FAIL] Unexpected error: {e}")
        return False

if __name__ == '__main__':
    success = verify_jira_connection()
    sys.exit(0 if success else 1)
