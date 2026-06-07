import json
import os
from fetch_jira import fetch_jira_ticket
from generate_test_plan import generate_test_plan
from generate_test_cases import generate_test_cases

def process_batch_jira_ids(jira_ids, email=None, token=None, base_url=None, generate_test_cases_flag=False):
    """Process multiple JIRA IDs and generate test plans for each.
    
    Args:
        jira_ids: List of JIRA ticket IDs (e.g., ['TES-1', 'TES-2'])
        email: JIRA email
        token: JIRA API token
        base_url: JIRA base URL
        generate_test_cases_flag: Whether to also generate test cases
    
    Returns:
        dict: Batch processing results
    """
    results = {
        'batch_id': f'BATCH_{os.urandom(4).hex().upper()}',
        'total': len(jira_ids),
        'successful': 0,
        'failed': 0,
        'processed_at': __import__('datetime').datetime.now().isoformat(),
        'items': []
    }
    
    for ticket_id in jira_ids:
        item = {
            'ticket_id': ticket_id,
            'success': False,
            'ticket': None,
            'test_plan': None,
            'test_cases': None,
            'error': None
        }
        
        try:
            # Fetch JIRA ticket
            ticket_result = fetch_jira_ticket(ticket_id, email, token, base_url)
            
            if not ticket_result['success']:
                item['error'] = ticket_result.get('error', 'Failed to fetch ticket')
                results['failed'] += 1
                results['items'].append(item)
                continue
            
            item['ticket'] = ticket_result['data']
            
            # Generate test plan
            test_plan = generate_test_plan(ticket_result['data'])
            item['test_plan'] = test_plan
            
            # Generate test cases if requested
            if generate_test_cases_flag:
                test_cases_result = generate_test_cases(ticket_result['data'], test_plan)
                item['test_cases'] = test_cases_result
            
            item['success'] = True
            results['successful'] += 1
            
        except Exception as e:
            item['error'] = str(e)
            results['failed'] += 1
        
        results['items'].append(item)
    
    return results

if __name__ == '__main__':
    import sys
    import argparse
    
    parser = argparse.ArgumentParser(description='Batch process JIRA IDs and generate test plans')
    parser.add_argument('jira_ids', nargs='+', help='JIRA ticket IDs (e.g., TES-1 TES-2)')
    parser.add_argument('--test-cases', action='store_true', help='Also generate test cases')
    parser.add_argument('--output', '-o', help='Output file path')
    
    args = parser.parse_args()
    
    results = process_batch_jira_ids(
        args.jira_ids,
        generate_test_cases_flag=args.test_cases
    )
    
    output_json = json.dumps(results, indent=2)
    
    if args.output:
        with open(args.output, 'w') as f:
            f.write(output_json)
        print(f"Results saved to {args.output}")
    else:
        print(output_json)
