import json
import re
from datetime import datetime

def generate_test_plan(jira_ticket, mode='template'):
    """Generate a Test Plan from JIRA ticket data.
    
    Args:
        jira_ticket: dict with JIRA ticket fields
        mode: 'template' (deterministic) or 'llm'
    
    Returns:
        dict: Test Plan object
    """
    
    if mode == 'llm':
        return generate_test_plan_llm(jira_ticket)
    
    return generate_test_plan_template(jira_ticket)

def generate_test_plan_template(jira_ticket):
    """Template-based deterministic test plan generation"""
    
    summary = jira_ticket.get('summary', '')
    description = jira_ticket.get('description', '')
    priority = jira_ticket.get('priority', 'Medium')
    status = jira_ticket.get('status', 'Unknown')
    labels = jira_ticket.get('labels', [])
    components = jira_ticket.get('components', [])
    acceptance_criteria = jira_ticket.get('acceptance_criteria', '')
    jira_id = jira_ticket.get('key', 'UNKNOWN')
    
    # Feature name from summary
    feature = summary.strip()
    
    # Map priority to strategy
    priority_map = {
        'Highest': 'High',
        'High': 'High',
        'Medium': 'Medium',
        'Low': 'Low',
        'Lowest': 'Low'
    }
    test_priority = priority_map.get(priority, 'Medium')
    
    # Determine scope
    scope_in = []
    scope_out = []
    
    # Extract functional areas from description
    functional_areas = extract_functional_areas(description)
    if functional_areas:
        scope_in.extend(functional_areas)
    else:
        scope_in.append(f"Core functionality of {feature}")
    
    scope_out.append("Non-functional testing (performance, load) unless explicitly specified")
    scope_out.append("Testing outside of {feature} scope")
    
    # Test strategy
    strategy = f"Risk-based testing with {test_priority} priority focus."
    if test_priority == 'High':
        strategy += " Comprehensive testing including regression and edge cases."
    elif test_priority == 'Low':
        strategy += " Smoke testing and basic functional validation."
    else:
        strategy += " Standard functional, boundary, and negative testing."
    
    # Test levels
    test_levels = ['Unit', 'Integration', 'System']
    if 'acceptance' in description.lower() or 'user' in description.lower():
        test_levels.append('Acceptance')
    
    # Test types
    test_types = ['Functional']
    if 'security' in description.lower() or 'auth' in description.lower() or 'login' in description.lower():
        test_types.append('Security')
    if 'performance' in description.lower() or 'speed' in description.lower() or 'load' in description.lower():
        test_types.append('Performance')
    if 'ui' in description.lower() or 'interface' in description.lower() or 'user' in description.lower():
        test_types.append('Usability')
    if 'api' in description.lower() or 'endpoint' in description.lower() or 'rest' in description.lower():
        test_types.append('API')
    
    # Entry criteria
    entry_criteria = [
        f"JIRA ticket {jira_id} is in 'Ready for Testing' or equivalent status",
        "Test environment is available and configured",
        "Test data is prepared and validated",
        "Requirements are clear and approved"
    ]
    
    # Exit criteria
    exit_criteria = [
        "All High priority test cases executed and passed",
        "All critical defects are resolved and retested",
        "Test coverage meets minimum threshold (80%)",
        "Test summary report is reviewed and approved"
    ]
    
    if test_priority == 'High':
        exit_criteria.append("All Medium priority test cases executed and passed")
    
    # Risks
    risks = []
    if not description or len(description) < 50:
        risks.append("Limited ticket description - potential gaps in test coverage")
    if not acceptance_criteria:
        risks.append("No explicit acceptance criteria - may miss key validation points")
    if test_priority == 'High':
        risks.append("High priority feature - defects may have significant business impact")
    if not components:
        risks.append("No component specified - integration scope unclear")
    if not risks:
        risks.append("Standard risk level - no significant concerns identified")
    
    # Assumptions
    assumptions = [
        "Test environment mirrors production configuration",
        "Test data is representative of production scenarios",
        "All dependencies are available during testing"
    ]
    
    # Dependencies
    dependencies = []
    if components:
        dependencies.append(f"Dependencies on {', '.join(components)} components")
    if labels:
        dependencies.append(f"Related to: {', '.join(labels)}")
    if not dependencies:
        dependencies.append("No specific dependencies identified")
    
    # Environment
    environment = "Staging / QA environment"
    if 'production' in description.lower():
        environment = "Production-like environment"
    
    # Schedule
    schedule = "2-3 days"
    if test_priority == 'High':
        schedule = "3-5 days"
    elif test_priority == 'Low':
        schedule = "1-2 days"
    
    # Resources
    resources = [
        "QA Engineer (Functional Testing)",
        "Test Data Manager"
    ]
    if 'Security' in test_types:
        resources.append("Security QA Engineer")
    
    test_plan = {
        'plan_id': f'TP-{jira_id}',
        'jira_id': jira_id,
        'feature': feature,
        'scope': {
            'in_scope': scope_in,
            'out_of_scope': scope_out
        },
        'test_strategy': strategy,
        'environment': environment,
        'test_levels': test_levels,
        'test_types': test_types,
        'entry_criteria': entry_criteria,
        'exit_criteria': exit_criteria,
        'risks': risks,
        'assumptions': assumptions,
        'dependencies': dependencies,
        'schedule': schedule,
        'resources': resources,
        'created_at': datetime.now().isoformat(),
        'generated_by': 'BLAST Test Plan Generator (Template Mode)',
        'mode': 'template'
    }
    
    return test_plan

def generate_test_plan_llm(jira_ticket):
    """LLM-based test plan generation (placeholder for GROQ integration)"""
    # This would call the GROQ API
    # For now, fallback to template
    return generate_test_plan_template(jira_ticket)

def extract_functional_areas(description):
    """Extract functional areas from description"""
    areas = []
    
    # Common functional keywords
    keywords = [
        'authentication', 'login', 'logout', 'registration',
        'search', 'filter', 'sort', 'pagination',
        'create', 'read', 'update', 'delete', 'crud',
        'payment', 'checkout', 'cart', 'order',
        'profile', 'settings', 'dashboard',
        'notification', 'email', 'alert',
        'upload', 'download', 'file',
        'report', 'analytics', 'export',
        'integration', 'api', 'webhook'
    ]
    
    desc_lower = description.lower()
    
    for keyword in keywords:
        if keyword in desc_lower:
            areas.append(keyword.capitalize())
    
    return areas

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) < 2:
        print("Usage: python generate_test_plan.py <jira_ticket.json>")
        print("Example: python generate_test_plan.py '{\"key\":\"TES-1\",\"summary\":\"Login Feature\"}'")
        sys.exit(1)
    
    ticket = json.loads(sys.argv[1])
    plan = generate_test_plan(ticket)
    
    print(json.dumps(plan, indent=2))
