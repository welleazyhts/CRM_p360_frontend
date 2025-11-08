# Integration Guide for New Features

This guide explains how to integrate the newly implemented features into your CRM application.

## Table of Contents
1. [SLA Tracking System](#sla-tracking-system)
2. [Lead Scoring & Prioritization](#lead-scoring--prioritization)
3. [Auto-Assignment Engine](#auto-assignment-engine)
4. [Setup Instructions](#setup-instructions)

---

## SLA Tracking System

### Features Implemented
- ✅ Automatic SLA tracking for leads, cases, tasks, emails, and claims
- ✅ Configurable SLA templates and rules
- ✅ Real-time SLA status monitoring
- ✅ SLA violation alerts
- ✅ Escalation rules
- ✅ Compliance reporting
- ✅ SLA monitoring dashboard

### Files Created
1. `/src/services/slaService.js` - Core SLA business logic
2. `/src/context/SLAContext.jsx` - SLA state management
3. `/src/components/settings/SLASettings.jsx` - Configuration UI
4. `/src/pages/SLAMonitoring.jsx` - Monitoring dashboard

### Integration Steps

#### Step 1: Add SLA Provider to App.js

```javascript
// src/App.js
import { SLAProvider } from './context/SLAContext';

function App() {
  return (
    <AuthProvider>
      <PermissionsProvider>
        <NotificationsProvider>
          <DedupeProvider>
            <SLAProvider>  {/* Add this */}
              <LeadProvider>
                {/* Rest of your app */}
              </LeadProvider>
            </SLAProvider>
          </DedupeProvider>
        </NotificationsProvider>
      </PermissionsProvider>
    </AuthProvider>
  );
}
```

#### Step 2: Add SLA Routes

```javascript
// src/App.js or your routing file
import SLASettings from './components/settings/SLASettings';
import SLAMonitoring from './pages/SLAMonitoring';

// Add these routes:
<Route path="/settings/sla" element={<SLASettings />} />
<Route path="/sla-monitoring" element={<SLAMonitoring />} />
```

#### Step 3: Add to Settings Navigation

```javascript
// src/components/common/Layout.jsx
// In your Settings submenu, add:
{
  path: '/settings/sla',
  label: 'SLA Settings',
  icon: <Timer />,
  permission: 'settings'
}
```

#### Step 4: Integrate with Lead Management

```javascript
// src/pages/LeadManagement.jsx or LeadDetails.jsx
import { useSLA } from '../context/SLAContext';

function LeadManagement() {
  const { trackSLA, completeSLATracking } = useSLA();

  // Track SLA when creating a new lead
  const handleSaveLead = () => {
    const newLead = {
      /* lead data */
    };

    // Create the lead
    setLeads([...leads, newLead]);

    // Start SLA tracking
    trackSLA('lead', newLead.id, 'firstResponse', newLead.priority);
  };

  // Complete SLA when lead is qualified
  const handleLeadQualified = (leadId) => {
    const slaTackings = getSLATrackingsForEntity('lead', leadId);
    const qualificationSLA = slaTrackings.find(t => t.slaType === 'qualification');

    if (qualificationSLA) {
      completeSLATracking(qualificationSLA.id);
    }
  };

  return (
    // Your component
  );
}
```

#### Step 5: Display SLA Status in Lead List

```javascript
// Add SLA status column to your lead table
import { useSLA } from '../context/SLAContext';
import { getSLAStatus, calculateTimeRemaining } from '../services/slaService';

function LeadRow({ lead }) {
  const { getSLATrackingsForEntity } = useSLA();

  const slaTrackings = getSLATrackingsForEntity('lead', lead.id);
  const activeSLA = slaTrackings.find(t => t.status === 'active');

  if (!activeSLA) return null;

  const slaStatus = getSLAStatus(activeSLA.deadline);
  const timeRemaining = calculateTimeRemaining(activeSLA.deadline);

  return (
    <TableCell>
      <Chip
        label={timeRemaining.formatted}
        size="small"
        style={{ backgroundColor: slaStatus.color }}
      />
    </TableCell>
  );
}
```

### Usage Examples

#### Example 1: Track SLA for New Case
```javascript
// When a case is created
trackSLA('case', caseId, 'assignment', 'high');
```

#### Example 2: Complete SLA
```javascript
// When case is assigned
completeSLATracking(slaTrackingId);
```

#### Example 3: Get Violations
```javascript
const { violations } = useSLA();

// Show alert if violations exist
if (violations.length > 0) {
  alert(`${violations.length} SLA violations detected!`);
}
```

---

## Lead Scoring & Prioritization

### Features Implemented
- ✅ Automatic lead scoring algorithm
- ✅ Multiple scoring factors (demographic, engagement, behavior, fit)
- ✅ Configurable scoring rules and weights
- ✅ Lead grading (A, B, C, D, F)
- ✅ Recommended actions based on score
- ✅ Batch scoring capabilities
- ✅ Score decay over time
- ✅ Analytics and reporting

### Files Created
1. `/src/services/leadScoringService.js` - Scoring algorithms
2. `/src/context/LeadScoringContext.jsx` - Scoring state management

### Integration Steps

#### Step 1: Add Lead Scoring Provider

```javascript
// src/App.js
import { LeadScoringProvider } from './context/LeadScoringContext';

function App() {
  return (
    <AuthProvider>
      <PermissionsProvider>
        <NotificationsProvider>
          <DedupeProvider>
            <SLAProvider>
              <LeadScoringProvider>  {/* Add this */}
                <LeadProvider>
                  {/* Rest of your app */}
                </LeadProvider>
              </LeadScoringProvider>
            </SLAProvider>
          </DedupeProvider>
        </NotificationsProvider>
      </PermissionsProvider>
    </AuthProvider>
  );
}
```

#### Step 2: Auto-Score New Leads

```javascript
// src/pages/LeadManagement.jsx
import { useLeadScoring } from '../context/LeadScoringContext';

function LeadManagement() {
  const { scoreLead, scoreMultipleLeads } = useLeadScoring();

  // Score a single lead
  const handleSaveLead = () => {
    const newLead = {
      /* lead data */
    };

    setLeads([...leads, newLead]);

    // Auto-score the lead
    const scoreData = scoreLead(newLead);
    console.log('Lead Score:', scoreData);
  };

  // Score all leads at once
  useEffect(() => {
    if (leads.length > 0) {
      const scoredLeads = scoreMultipleLeads(leads);
      console.log('All leads scored:', scoredLeads);
    }
  }, [leads]);

  return (
    // Your component
  );
}
```

#### Step 3: Display Score in Lead List

```javascript
// Add score column to your table
import { useLeadScoring } from '../context/LeadScoringContext';
import { getLeadGrade } from '../services/leadScoringService';

function LeadRow({ lead }) {
  const { getLeadScore } = useLeadScoring();

  const scoreData = getLeadScore(lead.id);

  if (!scoreData) return null;

  const gradeInfo = getLeadGrade(scoreData.score);

  return (
    <>
      <TableCell>
        <Chip
          label={`${scoreData.score} (${scoreData.grade})`}
          size="small"
          style={{
            backgroundColor: gradeInfo.color,
            color: 'white'
          }}
        />
      </TableCell>
      <TableCell>
        <Chip
          label={scoreData.priority}
          size="small"
          color={getPriorityColor(scoreData.priority)}
        />
      </TableCell>
    </>
  );
}
```

#### Step 4: Track Engagement for Scoring

```javascript
// Track email opens
const handleEmailOpened = (leadId) => {
  incrementEngagement(leadId, 'emailOpens');
};

// Track email clicks
const handleEmailClicked = (leadId) => {
  incrementEngagement(leadId, 'emailClicks');
};

// Track website visits
const handleWebsiteVisit = (leadId) => {
  incrementEngagement(leadId, 'websiteVisits');
};

// Track calls
const handleCallAnswered = (leadId) => {
  incrementEngagement(leadId, 'callsAnswered');
};
```

#### Step 5: Show Recommended Actions

```javascript
function LeadActions({ lead }) {
  const { getLeadScore } = useLeadScoring();

  const scoreData = getLeadScore(lead.id);

  if (!scoreData) return null;

  const action = scoreData.recommendedAction;

  return (
    <Alert severity={action.urgency === 'critical' ? 'error' : 'info'}>
      <strong>{action.action.replace(/_/g, ' ').toUpperCase()}</strong>
      <br />
      {action.description}
      <br />
      <small>Timeline: {action.timeline}</small>
    </Alert>
  );
}
```

### Usage Examples

#### Example 1: Score New Lead
```javascript
const lead = {
  firstName: 'John',
  lastName: 'Doe',
  position: 'CEO',
  company: 'Acme Corp',
  companySize: 'enterprise',
  industry: 'technology',
  source: 'referral'
};

const scoreData = scoreLead(lead);
// Returns: { score: 75, grade: 'B', label: 'Warm Lead', priority: 'high', ... }
```

#### Example 2: Update Engagement Data
```javascript
// Track that lead opened 3 emails
updateLeadAdditionalData(leadId, 'engagement', {
  emailOpens: 3,
  emailClicks: 1,
  websiteVisits: 5
});
```

#### Example 3: Get Top Scored Leads
```javascript
const { getTopScoredLeads } = useLeadScoring();
const topLeads = getTopScoredLeads(10); // Get top 10 leads
```

#### Example 4: Get Score Distribution
```javascript
const { getScoreDistribution } = useLeadScoring();
const distribution = getScoreDistribution();
// Returns: { A: 5, B: 15, C: 30, D: 20, F: 10 }
```

---

## Auto-Assignment Engine

### Features Implemented
- ✅ Six assignment strategies (round-robin, load-based, skill-based, geographic, score-based, hybrid)
- ✅ Agent capacity and workload tracking
- ✅ Skill matching for insurance types
- ✅ Territory-based geographic assignment
- ✅ Performance tier matching for high-value leads
- ✅ Assignment history and audit trail
- ✅ Auto-assignment configuration UI
- ✅ Agent workload monitoring dashboard
- ✅ Reassignment rules and triggers

### Files Created
1. `/src/services/autoAssignmentService.js` - Assignment algorithms and strategies
2. `/src/context/AutoAssignmentContext.jsx` - Auto-assignment state management
3. `/src/components/settings/AutoAssignmentSettings.jsx` - Configuration UI
4. `/src/pages/AutoAssignmentMonitoring.jsx` - Monitoring dashboard

### Integration Steps

#### Step 1: Add Auto-Assignment Provider to App.js

```javascript
// src/App.js
import { AutoAssignmentProvider } from './context/AutoAssignmentContext';

function App() {
  return (
    <AuthProvider>
      <PermissionsProvider>
        <NotificationsProvider>
          <DedupeProvider>
            <SLAProvider>
              <LeadScoringProvider>
                <AutoAssignmentProvider>  {/* Add this */}
                  <LeadProvider>
                    {/* Rest of your app */}
                  </LeadProvider>
                </AutoAssignmentProvider>
              </LeadScoringProvider>
            </SLAProvider>
          </DedupeProvider>
        </NotificationsProvider>
      </PermissionsProvider>
    </AuthProvider>
  );
}
```

#### Step 2: Add Auto-Assignment Routes

```javascript
// src/App.js or your routing file
import AutoAssignmentSettings from './components/settings/AutoAssignmentSettings';
import AutoAssignmentMonitoring from './pages/AutoAssignmentMonitoring';

// Add these routes:
<Route path="/settings/auto-assignment" element={<AutoAssignmentSettings />} />
<Route path="/auto-assignment" element={<AutoAssignmentMonitoring />} />
```

#### Step 3: Add to Navigation

```javascript
// src/components/common/Layout.jsx
// In your main navigation:
{
  path: '/auto-assignment',
  label: 'Auto-Assignment',
  icon: <Assignment />,
  permission: 'auto_assignment'
}

// In your Settings submenu:
{
  path: '/settings/auto-assignment',
  label: 'Auto-Assignment',
  icon: <Settings />,
  permission: 'settings'
}
```

#### Step 4: Integrate with Lead Management

```javascript
// src/pages/LeadManagement.jsx
import { useAutoAssignment } from '../context/AutoAssignmentContext';
import { useLeadScoring } from '../context/LeadScoringContext';

function LeadManagement() {
  const { assignEntity, config } = useAutoAssignment();
  const { leadScores } = useLeadScoring();

  // Auto-assign when creating a new lead
  const handleSaveLead = (newLead) => {
    // Create the lead
    setLeads([...leads, newLead]);

    // Auto-assign if enabled
    if (config.enabled && config.autoAssignOnCreate) {
      const result = assignEntity(
        { ...newLead, type: 'lead' },
        leads, // existing leads for workload calculation
        leadScores // lead scores for score-based assignment
      );

      if (result.success) {
        console.log(`Lead assigned to ${result.agent.name} using ${result.strategy}`);

        // Update the lead with the assigned agent
        setLeads(prev => prev.map(l =>
          l.id === newLead.id
            ? { ...l, assignedTo: result.agent.id, assignedAgent: result.agent.name }
            : l
        ));
      } else {
        console.error('Auto-assignment failed:', result.error);
      }
    }
  };

  return (
    // Your component
  );
}
```

#### Step 5: Display Assignment Info in Lead Details

```javascript
// src/pages/LeadDetails.jsx
import { useAutoAssignment } from '../context/AutoAssignmentContext';

function LeadDetails({ leadId }) {
  const { assignmentHistory, agents } = useAutoAssignment();

  // Find assignment history for this lead
  const leadAssignments = assignmentHistory.filter(
    h => h.entityId === leadId && h.entityType === 'lead'
  );

  const currentAssignment = leadAssignments[0]; // Most recent

  return (
    <Box>
      {/* Lead details */}

      {currentAssignment && (
        <Card sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h6">Assignment Info</Typography>
            <Typography variant="body2">
              Assigned to: {currentAssignment.agentName}
            </Typography>
            <Typography variant="body2">
              Strategy: {currentAssignment.strategy.replace(/_/g, ' ')}
            </Typography>
            <Typography variant="body2">
              Reason: {currentAssignment.reason}
            </Typography>
            <Typography variant="body2">
              Date: {new Date(currentAssignment.assignedAt).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
```

#### Step 6: Manual Assignment Override

```javascript
// Allow manual override of auto-assignment
function ManualAssignmentDialog({ entity, onAssign }) {
  const { agents, assignEntity } = useAutoAssignment();
  const [selectedAgent, setSelectedAgent] = useState('');

  const handleManualAssign = () => {
    const agent = agents.find(a => a.id === selectedAgent);
    if (agent) {
      // Manually create assignment record
      onAssign(agent);
    }
  };

  return (
    <Dialog open>
      <DialogTitle>Assign to Agent</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel>Select Agent</InputLabel>
          <Select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
          >
            {agents.filter(a => a.active).map(agent => (
              <MenuItem key={agent.id} value={agent.id}>
                {agent.name} - {agent.skills.join(', ')}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleManualAssign}>Assign</Button>
      </DialogActions>
    </Dialog>
  );
}
```

### Usage Examples

#### Example 1: Auto-Assign New Lead
```javascript
const result = assignEntity(
  { id: 'L123', name: 'John Doe', type: 'lead', priority: 'high' },
  existingLeads,
  leadScores
);

if (result.success) {
  console.log(`Assigned to: ${result.agent.name}`);
  console.log(`Strategy: ${result.strategy}`);
  console.log(`Reason: ${result.reason}`);
}
```

#### Example 2: Batch Assign Multiple Leads
```javascript
const { assignMultipleEntities } = useAutoAssignment();

const newLeads = [
  { id: 'L1', name: 'Lead 1', type: 'lead' },
  { id: 'L2', name: 'Lead 2', type: 'lead' },
  { id: 'L3', name: 'Lead 3', type: 'lead' }
];

const result = assignMultipleEntities(newLeads, existingLeads, leadScores);
console.log(`Assigned: ${result.assigned.length}`);
console.log(`Failed: ${result.failed.length}`);
```

#### Example 3: Get Agent Workload
```javascript
const { getAgentWorkload } = useAutoAssignment();

const workload = getAgentWorkload('agent_123', allLeads);
console.log(`Assigned: ${workload.assigned}/${workload.capacity}`);
console.log(`Utilization: ${workload.utilizationPercent}%`);
console.log(`Available: ${workload.available ? 'Yes' : 'No'}`);
```

#### Example 4: Get Available Agents
```javascript
const { getAvailableAgentsList } = useAutoAssignment();

const availableAgents = getAvailableAgentsList(existingLeads);
console.log(`${availableAgents.length} agents available for assignment`);
```

#### Example 5: Configure Strategy by Entity Type
```javascript
const { updateStrategyForType } = useAutoAssignment();

// Use skill-based for leads
updateStrategyForType('lead', ASSIGNMENT_STRATEGIES.SKILL_BASED);

// Use load-based for cases
updateStrategyForType('case', ASSIGNMENT_STRATEGIES.LOAD_BASED);

// Use hybrid for high-value items
updateStrategyForType('claim', ASSIGNMENT_STRATEGIES.HYBRID);
```

### Assignment Strategies Explained

#### 1. Round Robin
- **Best for:** Equal distribution across team
- **How it works:** Rotates through agents in sequence
- **Use case:** Standard lead distribution with no special requirements

#### 2. Load Based
- **Best for:** Balancing workload
- **How it works:** Assigns to agent with lowest current workload
- **Use case:** When agents have different speeds/capacities

#### 3. Skill Based
- **Best for:** Specialized requirements
- **How it works:** Matches entity requirements to agent skills
- **Use case:** Motor insurance leads go to motor specialists

#### 4. Geographic
- **Best for:** Territory-based teams
- **How it works:** Matches location/territory between entity and agent
- **Use case:** Regional sales teams with specific territories

#### 5. Score Based
- **Best for:** Performance-driven teams
- **How it works:** High-value leads to top performers
- **Use case:** Enterprise leads to senior agents

#### 6. Hybrid (Recommended)
- **Best for:** Most scenarios
- **How it works:** Scores agents on: workload (30%), skills (25%), performance (20%), lead match (15%), geography (10%)
- **Use case:** When you want the best overall match

---

## Setup Instructions

### 1. Install Dependencies (if any new ones needed)

```bash
# No new dependencies needed - uses existing MUI and React libraries
```

### 2. Update App.js

Add all providers in the correct order:

```javascript
import { SLAProvider } from './context/SLAContext';
import { LeadScoringProvider } from './context/LeadScoringContext';
import { AutoAssignmentProvider } from './context/AutoAssignmentContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PermissionsProvider>
          <NotificationsProvider>
            <SettingsProvider>
              <DedupeProvider>
                <SLAProvider>
                  <LeadScoringProvider>
                    <AutoAssignmentProvider>
                      <LeadProvider>
                        <Routes>
                          {/* Your routes */}
                          <Route path="/sla-monitoring" element={<SLAMonitoring />} />
                          <Route path="/settings/sla" element={<SLASettings />} />
                          <Route path="/auto-assignment" element={<AutoAssignmentMonitoring />} />
                          <Route path="/settings/auto-assignment" element={<AutoAssignmentSettings />} />
                        </Routes>
                      </LeadProvider>
                    </AutoAssignmentProvider>
                  </LeadScoringProvider>
                </SLAProvider>
              </DedupeProvider>
            </SettingsProvider>
          </NotificationsProvider>
        </PermissionsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

### 3. Update Navigation Menu

Add new menu items to your Layout.jsx:

```javascript
// In your navigation configuration
{
  path: '/sla-monitoring',
  label: 'SLA Monitoring',
  icon: <Timer />,
  permission: 'sla_monitoring'
},
{
  path: '/auto-assignment',
  label: 'Auto-Assignment',
  icon: <Assignment />,
  permission: 'auto_assignment'
},
{
  group: 'Settings',
  items: [
    {
      path: '/settings/sla',
      label: 'SLA Settings',
      icon: <Settings />,
      permission: 'settings'
    },
    {
      path: '/settings/auto-assignment',
      label: 'Auto-Assignment',
      icon: <Settings />,
      permission: 'settings'
    }
  ]
}
```

### 4. Configure Permissions

Add new permissions to PermissionsContext.jsx:

```javascript
const rolePermissions = {
  admin: ['*'], // All permissions
  manager: [
    'dashboard',
    'cases',
    'leads',
    'sla_monitoring',
    'auto_assignment',
    'settings'
  ],
  agent: [
    'dashboard',
    'cases',
    'leads'
    // No SLA monitoring or auto-assignment for agents
  ]
};
```

---

## Testing

### Test SLA Tracking
1. Go to Settings > SLA Settings
2. Ensure SLA tracking is enabled
3. Create a new lead
4. Go to SLA Monitoring dashboard
5. Verify the lead appears with active SLA

### Test Lead Scoring
1. Create a new lead with detailed information
2. Check the lead's score in the lead list
3. Verify the grade (A, B, C, D, F) is displayed
4. Check that priority is auto-set based on score

### Test Auto-Assignment
1. Go to Settings > Auto-Assignment
2. Ensure auto-assignment is enabled
3. Configure agents with different skills and territories
4. Select a strategy (e.g., Hybrid)
5. Create a new lead
6. Verify the lead is automatically assigned to an agent
7. Go to Auto-Assignment Monitoring dashboard
8. Check the assignment appears in history with reason
9. Verify agent workload increases accordingly

---

## Troubleshooting

### SLA Not Tracking
- Verify SLA tracking is enabled in settings
- Check that SLAProvider is in App.js
- Ensure trackSLA() is called when creating entities

### Lead Scores Not Showing
- Verify LeadScoringProvider is in App.js
- Check that scoreLead() or scoreMultipleLeads() is called
- Ensure lead has required fields (position, company, source, etc.)

### Auto-Assignment Not Working
- Verify auto-assignment is enabled in settings
- Check that AutoAssignmentProvider is in App.js
- Ensure at least one agent is active and has available capacity
- Verify assignEntity() is called when creating entities
- Check that entity has a 'type' field (lead, case, task, etc.)

### No Agents Available
- Check that agents are marked as active
- Verify agents have available capacity (not overloaded)
- Ensure agents have appropriate skills for the entity
- Check territory matching if using geographic strategy

### Context Not Available Error
- Make sure providers are in correct order in App.js
- Verify you're using hooks inside component tree
- Check import statements are correct

---

## Next Steps

After integrating these three features, consider implementing:

1. **Task Management & Calendar** - Track SLAs for tasks with calendar integration
2. **Commission Calculation** - Track commissions based on closed deals
3. **Workflow Engine** - Create approval workflows for high-value leads

See `IMPLEMENTATION_SUMMARY.md` for the full list of pending features.

---

## Support

For issues or questions:
1. Check the console for error messages
2. Verify all providers are properly installed
3. Review the usage examples above
4. Check that all imports are correct

---

**Last Updated:** 2025-10-17
**Version:** 1.0.0
