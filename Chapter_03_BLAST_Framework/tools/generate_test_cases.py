import json
import re
from datetime import datetime

def generate_test_cases(jira_ticket, test_plan, mode='template'):
    """Generate Test Cases from JIRA ticket and Test Plan.
    
    Args:
        jira_ticket: dict with JIRA ticket fields
        test_plan: dict with test plan data
        mode: 'template' or 'llm'
    
    Returns:
        list: Array of test case objects
    """
    
    if mode == 'llm':
        return generate_test_cases_llm(jira_ticket, test_plan)
    
    return generate_test_cases_template(jira_ticket, test_plan)

def generate_test_cases_template(jira_ticket, test_plan):
    """Template-based deterministic test case generation"""
    
    jira_id = jira_ticket.get('key', 'UNKNOWN')
    summary = jira_ticket.get('summary', '')
    description = jira_ticket.get('description', '')
    acceptance_criteria = jira_ticket.get('acceptance_criteria', '')
    priority = jira_ticket.get('priority', 'Medium')
    
    feature = summary.strip()
    test_cases = []
    tc_counter = 1
    
    # Priority mapping
    priority_map = {
        'Highest': 'High',
        'High': 'High',
        'Medium': 'Medium',
        'Low': 'Low',
        'Lowest': 'Low'
    }
    base_priority = priority_map.get(priority, 'Medium')
    
    # === FUNCTIONAL (POSITIVE) TEST CASES ===
    # TC 1: Basic happy path
    test_cases.append(create_test_case(
        jira_id, tc_counter, 'Functional', base_priority, 'Positive',
        f'Verify basic {feature} functionality',
        f'Test the core happy path of {feature}',
        f'{feature} is accessible and configured',
        [
            {'step_no': 1, 'action': f'Navigate to {feature}', 'expected': f'{feature} page loads successfully'},
            {'step_no': 2, 'action': f'Perform standard {feature} action', 'expected': f'Action completes successfully'},
            {'step_no': 3, 'action': 'Verify result', 'expected': f'Expected outcome for {feature} is displayed'}
        ],
        f'{feature} works as expected without errors',
        'Yes' if base_priority == 'High' else 'Future'
    ))
    tc_counter += 1
    
    # TC 2: If there are acceptance criteria, create test case for each
    if acceptance_criteria:
        ac_lines = [line.strip() for line in acceptance_criteria.split('\n') if line.strip()]
        for i, ac in enumerate(ac_lines[:3]):  # Max 3 AC test cases
            test_cases.append(create_test_case(
                jira_id, tc_counter, 'Functional', base_priority, 'Positive',
                f'Verify acceptance criteria: {ac[:60]}',
                f'Validate that {ac[:80]}',
                f'Preconditions for {ac[:40]}',
                [
                    {'step_no': 1, 'action': 'Setup test conditions', 'expected': 'Test environment ready'},
                    {'step_no': 2, 'action': f'Execute {ac[:60]}', 'expected': f'Acceptance criteria met: {ac[:80]}'}
                ],
                f'Acceptance criteria satisfied: {ac[:80]}',
                'Yes'
            ))
            tc_counter += 1
    else:
        # TC 2b: Standard workflow
        test_cases.append(create_test_case(
            jira_id, tc_counter, 'Functional', 'Medium', 'Positive',
            f'Verify standard {feature} workflow',
            f'Test end-to-end workflow for {feature}',
            f'{feature} prerequisites are met',
            [
                {'step_no': 1, 'action': f'Initiate {feature}', 'expected': f'{feature} starts successfully'},
                {'step_no': 2, 'action': 'Complete workflow steps', 'expected': 'Each step completes correctly'},
                {'step_no': 3, 'action': 'Verify final state', 'expected': f'Final state matches expected outcome'}
            ],
            f'Complete workflow executes successfully',
            'Yes' if base_priority == 'High' else 'Future'
        ))
        tc_counter += 1
    
    # TC 3: Alternative path if applicable
    if 'alternative' in description.lower() or 'or' in description.lower():
        test_cases.append(create_test_case(
            jira_id, tc_counter, 'Functional', 'Medium', 'Positive',
            f'Verify alternative {feature} path',
            f'Test alternative workflow for {feature}',
            f'Alternative path is available',
            [
                {'step_no': 1, 'action': f'Access {feature} alternative path', 'expected': 'Alternative path accessible'},
                {'step_no': 2, 'action': 'Execute alternative workflow', 'expected': 'Alternative workflow completes'}
            ],
            f'Alternative path works correctly',
            'Future'
        ))
        tc_counter += 1
    
    # === BOUNDARY TEST CASES ===
    # TC: Boundary - Minimum values
    test_cases.append(create_test_case(
        jira_id, tc_counter, 'Boundary', 'Medium', 'Positive',
        f'Verify {feature} with minimum values',
        f'Test {feature} with minimum valid inputs',
        'Minimum valid data is available',
        [
            {'step_no': 1, 'action': f'Input minimum valid values for {feature}', 'expected': 'System accepts minimum values'},
            {'step_no': 2, 'action': 'Submit/Execute', 'expected': f'{feature} processes with minimum values'}
        ],
        f'{feature} works with minimum values',
        'Future'
    ))
    tc_counter += 1
    
    # TC: Boundary - Maximum values
    test_cases.append(create_test_case(
        jira_id, tc_counter, 'Boundary', 'Medium', 'Positive',
        f'Verify {feature} with maximum values',
        f'Test {feature} with maximum valid inputs',
        'Maximum valid data is available',
        [
            {'step_no': 1, 'action': f'Input maximum valid values for {feature}', 'expected': 'System accepts maximum values'},
            {'step_no': 2, 'action': 'Submit/Execute', 'expected': f'{feature} processes with maximum values'}
        ],
        f'{feature} works with maximum values',
        'Future'
    ))
    tc_counter += 1
    
    # TC: Boundary - Empty/Null
    if 'field' in description.lower() or 'input' in description.lower() or 'form' in description.lower():
        test_cases.append(create_test_case(
            jira_id, tc_counter, 'Boundary', 'Medium', 'Negative',
            f'Verify {feature} with empty/missing fields',
            f'Test {feature} with empty or null inputs',
            'Empty data is available for testing',
            [
                {'step_no': 1, 'action': 'Leave required fields empty', 'expected': 'Fields are empty or null'},
                {'step_no': 2, 'action': f'Attempt to submit {feature}', 'expected': 'System shows validation error'}
            ],
            'System validates empty fields correctly',
            'Yes'
        ))
        tc_counter += 1
    
    # === NEGATIVE TEST CASES ===
    # TC: Invalid data type
    test_cases.append(create_test_case(
        jira_id, tc_counter, 'Negative', 'Medium', 'Negative',
        f'Verify {feature} with invalid data type',
        f'Test {feature} with incorrect data format',
        'Invalid data samples are prepared',
        [
            {'step_no': 1, 'action': f'Input invalid data type for {feature}', 'expected': 'Invalid data is entered'},
            {'step_no': 2, 'action': 'Submit/Execute', 'expected': 'System rejects invalid data with error message'}
        ],
        'System handles invalid data gracefully',
        'Yes'
    ))
    tc_counter += 1
    
    # TC: Invalid format
    if 'email' in description.lower() or 'phone' in description.lower() or 'date' in description.lower():
        test_cases.append(create_test_case(
            jira_id, tc_counter, 'Negative', 'Medium', 'Negative',
            f'Verify {feature} with invalid format',
            f'Test {feature} with malformed format inputs',
            'Invalid format samples are prepared',
            [
                {'step_no': 1, 'action': f'Enter invalid format for {feature}', 'expected': 'Invalid format is entered'},
                {'step_no': 2, 'action': 'Submit', 'expected': 'System validates format and shows error'}
            ],
            'System validates format correctly',
            'Yes'
        ))
        tc_counter += 1
    
    # === SECURITY TEST CASES ===
    # TC: SQL Injection
    if 'database' in description.lower() or 'query' in description.lower() or 'search' in description.lower() or 'login' in description.lower() or 'auth' in description.lower():
        test_cases.append(create_test_case(
            jira_id, tc_counter, 'Security', 'High', 'Negative',
            f'Verify {feature} SQL injection protection',
            f'Test {feature} against SQL injection attacks',
            'SQL injection payloads are prepared',
            [
                {'step_no': 1, 'action': f'Enter SQL injection payload in {feature} input', 'expected': 'Payload is entered'},
                {'step_no': 2, 'action': 'Submit/Execute', 'expected': 'System sanitizes input and rejects attack'}
            ],
            'System is protected against SQL injection',
            'Yes'
        ))
        tc_counter += 1
    
    # TC: XSS
    if 'input' in description.lower() or 'text' in description.lower() or 'comment' in description.lower() or 'description' in description.lower():
        test_cases.append(create_test_case(
            jira_id, tc_counter, 'Security', 'High', 'Negative',
            f'Verify {feature} XSS protection',
            f'Test {feature} against cross-site scripting',
            'XSS payloads are prepared',
            [
                {'step_no': 1, 'action': f'Enter XSS payload in {feature} input field', 'expected': 'Payload is entered'},
                {'step_no': 2, 'action': 'Submit and view output', 'expected': 'Payload is sanitized/escaped, no script execution'}
            ],
            'System is protected against XSS',
            'Yes'
        ))
        tc_counter += 1
    
    # TC: Auth bypass
    if 'auth' in description.lower() or 'login' in description.lower() or 'permission' in description.lower() or 'role' in description.lower():
        test_cases.append(create_test_case(
            jira_id, tc_counter, 'Security', 'High', 'Negative',
            f'Verify {feature} unauthorized access protection',
            f'Test {feature} without proper authentication',
            'Unauthenticated user session is available',
            [
                {'step_no': 1, 'action': 'Attempt to access without authentication', 'expected': 'Access is attempted without credentials'},
                {'step_no': 2, 'action': 'Verify system response', 'expected': 'System redirects to login or shows access denied'}
            ],
            'Unauthorized access is blocked',
            'Yes'
        ))
        tc_counter += 1
    
    # === INTEGRATION TEST CASES ===
    # TC: Integration with other components
    if jira_ticket.get('components'):
        test_cases.append(create_test_case(
            jira_id, tc_counter, 'Integration', 'Medium', 'Positive',
            f'Verify {feature} integration with other components',
            f'Test {feature} interaction with related components',
            'Related components are available',
            [
                {'step_no': 1, 'action': f'Execute {feature}', 'expected': f'{feature} executes successfully'},
                {'step_no': 2, 'action': 'Verify data/state in related components', 'expected': 'Data consistency maintained across components'}
            ],
            f'{feature} integrates correctly with other components',
            'Future'
        ))
        tc_counter += 1
    
    # === REGRESSION TEST CASES ===
    # TC: Regression - verify existing functionality
    test_cases.append(create_test_case(
        jira_id, tc_counter, 'Regression', 'Medium', 'Positive',
        f'Verify existing functionality not broken by {feature}',
        f'Test related features still work after {feature} implementation',
        'Related features are identified and accessible',
        [
            {'step_no': 1, 'action': 'Execute related existing features', 'expected': 'Existing features execute successfully'},
            {'step_no': 2, 'action': 'Verify no regression issues', 'expected': 'Existing functionality unaffected'}
        ],
        'No regression in existing features',
        'Yes'
    ))
    tc_counter += 1
    
    # Validate counts
    high_count = sum(1 for tc in test_cases if tc['priority'] == 'High')
    low_count = sum(1 for tc in test_cases if tc['priority'] == 'Low')
    total = len(test_cases)
    
    # Quality check: Max 40% High, min 20% Low
    if high_count / total > 0.4:
        # Downgrade some High to Medium
        for tc in test_cases:
            if tc['priority'] == 'High' and high_count / total > 0.4:
                tc['priority'] = 'Medium'
                high_count -= 1
    
    if low_count / total < 0.2:
        # Upgrade some Medium to Low
        for tc in test_cases:
            if tc['priority'] == 'Medium' and low_count / total < 0.2:
                tc['priority'] = 'Low'
                low_count += 1
                if low_count / total >= 0.2:
                    break
    
    return {
        'jira_id': jira_id,
        'plan_id': test_plan.get('plan_id', f'TP-{jira_id}'),
        'total_test_cases': len(test_cases),
        'generated_at': datetime.now().isoformat(),
        'mode': 'template',
        'generated_by': 'BLAST Test Case Generator (Template Mode)',
        'test_cases': test_cases
    }

def create_test_case(jira_id, counter, category, priority, tc_type, title, description, pre_conditions, steps, expected_result, automation):
    """Helper to create a test case object"""
    return {
        'tc_id': f'{jira_id}_TC_{counter:03d}',
        'jira_id': jira_id,
        'category': category,
        'priority': priority,
        'type': tc_type,
        'title': title,
        'description': description,
        'pre_conditions': pre_conditions,
        'steps': steps,
        'expected_result': expected_result,
        'post_conditions': 'System returns to stable state',
        'traceability': jira_id,
        'automation': automation,
        'notes': f'Generated from JIRA ticket {jira_id}'
    }

def generate_test_cases_llm(jira_ticket, test_plan):
    """LLM-based test case generation (placeholder for GROQ integration)"""
    # Fallback to template for now
    return generate_test_cases_template(jira_ticket, test_plan)

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) < 3:
        print("Usage: python generate_test_cases.py <jira_ticket.json> <test_plan.json>")
        sys.exit(1)
    
    ticket = json.loads(sys.argv[1])
    plan = json.loads(sys.argv[2])
    
    result = generate_test_cases(ticket, plan)
    
    print(json.dumps(result, indent=2))
