import os
import sys
import base64
import requests
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

def fetch_jira_ticket(ticket_id, email=None, token=None, base_url=None):
    """Fetch a JIRA ticket by ID.
    
    Args:
        ticket_id: Ticket ID (e.g., 'TES-1')
        email: JIRA email (optional, uses .env if not provided)
        token: JIRA API token (optional, uses .env if not provided)
        base_url: JIRA base URL (optional, uses .env if not provided)
    
    Returns:
        dict: {success: bool, data: dict, error: str}
    """
    
    # Use .env values if not provided
    jira_email = email or os.getenv('JIRA_EMAIL')
    jira_token = token or os.getenv('JIRA_API_TOKEN')
    jira_base_url = base_url or os.getenv('JIRA_BASE_URL')
    
    # Validate
    if not jira_email or not jira_token or not jira_base_url:
        return {
            'success': False,
            'error': 'Missing JIRA credentials',
            'details': 'Provide email, token, and base_url or set them in .env'
        }
    
    # Normalize base URL
    if not jira_base_url.endswith('/'):
        jira_base_url += '/'
    
    # Construct endpoint
    endpoint = f"{jira_base_url}rest/api/2/issue/{ticket_id}"
    
    # Basic Auth
    credentials = base64.b64encode(f"{jira_email}:{jira_token}".encode()).decode()
    
    headers = {
        'Authorization': f'Basic {credentials}',
        'Accept': 'application/json'
    }
    
    try:
        response = requests.get(endpoint, headers=headers, timeout=15)
        
        if response.status_code == 200:
            raw_data = response.json()
            
            # Extract relevant fields
            fields = raw_data.get('fields', {})
            
            # Get description (can be plain text or Atlassian Document Format)
            description = fields.get('description')
            if isinstance(description, dict):
                # ADF format - extract text
                description = extract_text_from_adf(description)
            elif description is None:
                description = ""
            
            # Get acceptance criteria (custom field or from description)
            acceptance_criteria = fields.get('customfield_10016', '')
            if not acceptance_criteria and description:
                # Try to extract from description
                acceptance_criteria = extract_acceptance_criteria(description)
            
            ticket = {
                'id': raw_data.get('id'),
                'key': raw_data.get('key'),
                'summary': fields.get('summary', ''),
                'description': description,
                'priority': fields.get('priority', {}).get('name', 'Medium'),
                'status': fields.get('status', {}).get('name', 'Unknown'),
                'type': fields.get('issuetype', {}).get('name', 'Unknown'),
                'assignee': fields.get('assignee', {}).get('displayName', 'Unassigned'),
                'created': fields.get('created'),
                'updated': fields.get('updated'),
                'labels': fields.get('labels', []),
                'components': [c.get('name') for c in fields.get('components', [])],
                'acceptance_criteria': acceptance_criteria,
                'url': f"{jira_base_url}browse/{ticket_id}"
            }
            
            return {
                'success': True,
                'data': ticket
            }
            
        elif response.status_code == 401:
            return {
                'success': False,
                'error': 'Authentication failed',
                'details': 'Invalid JIRA email or API token. Check your credentials.'
            }
        elif response.status_code == 404:
            return {
                'success': False,
                'error': 'Ticket not found',
                'details': f'Ticket {ticket_id} does not exist or you do not have permission.'
            }
        else:
            return {
                'success': False,
                'error': f'JIRA API error ({response.status_code})',
                'details': response.text
            }
            
    except requests.exceptions.ConnectionError as e:
        return {
            'success': False,
            'error': 'Connection failed',
            'details': str(e)
        }
    except requests.exceptions.Timeout:
        return {
            'success': False,
            'error': 'Request timed out',
            'details': 'JIRA API did not respond in time'
        }
    except Exception as e:
        return {
            'success': False,
            'error': 'Unexpected error',
            'details': str(e)
        }

def extract_text_from_adf(adf):
    """Extract plain text from Atlassian Document Format"""
    texts = []
    
    def extract_content(content):
        if isinstance(content, list):
            for item in content:
                extract_content(item)
        elif isinstance(content, dict):
            if 'text' in content:
                texts.append(content['text'])
            if 'content' in content:
                extract_content(content['content'])
    
    extract_content(adf)
    return ' '.join(texts)

def extract_acceptance_criteria(description):
    """Extract acceptance criteria from description text"""
    # Common patterns
    patterns = [
        'acceptance criteria',
        'acceptance criteria:',
        'ac:',
        'given when then',
        'scenario:',
        'criteria:'
    ]
    
    desc_lower = description.lower()
    
    for pattern in patterns:
        if pattern in desc_lower:
            idx = desc_lower.find(pattern)
            if idx != -1:
                return description[idx:].strip()
    
    return ""

if __name__ == '__main__':
    import json
    
    if len(sys.argv) < 2:
        print("Usage: python fetch_jira.py <ticket_id>")
        print("Example: python fetch_jira.py TES-1")
        sys.exit(1)
    
    ticket_id = sys.argv[1]
    result = fetch_jira_ticket(ticket_id)
    
    print(json.dumps(result, indent=2))
