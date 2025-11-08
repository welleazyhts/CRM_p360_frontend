# Tab Organization Guide for CaseDetails.jsx

## Current Issue
The tab structure exists but contains only placeholder content. Here's how to organize the consolidated view content into appropriate tabs:

## Tab 0: Overview (Customer Info, Policy Info, Case Flow, Add Comment)
Replace the placeholder with:
- Customer Information card
- Policy Information card  
- Case Flow card
- Add Comment card

## Tab 1: Policy & Coverage (Policy Features, Coverage Details)
Replace the placeholder with:
- Policy Features card
- Coverage Details card

## Tab 2: Policy Members (Health Insurance Policy Members)
Replace the placeholder with:
- Policy Members Details card (only for Health insurance)

## Tab 3: Preferences (Customer Communication and Payment Preferences)
Replace the placeholder with:
- Customer Preferences card

## Tab 4: Analytics (Payment Schedules, Customer Profiling)
Replace the placeholder with:
- Customer Payment Schedule card
- Customer Profiling card

## Tab 5: Offers (Available Offers and Recommendations)
Replace the placeholder with:
- Available Offers card

## Tab 6: History & Timeline (Case History and Journey Summary)
Replace the placeholder with:
- Case History card
- Journey Summary card

## Instructions:
1. Find each `<TabPanel value={currentTab} index={X}>` section
2. Replace the placeholder `<Typography variant="h6">X Tab - Content will be organized here</Typography>` 
3. Add the appropriate content from the consolidated view
4. Maintain all existing functionality, styling, and animations
5. Ensure proper Grid container structure for each tab

This will give you a fully functional tab-based layout with all the existing content properly organized. 