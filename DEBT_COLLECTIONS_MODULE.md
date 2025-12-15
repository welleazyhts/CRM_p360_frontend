# PY360 - Debt Collections Module

## Module Overview
The Debt Collections Module provides comprehensive tools for managing debt recovery operations, including debtor management, payment tracking, settlement negotiations, skip tracing, compliance handling, and legal escalation workflows.

---

# TABLE OF CONTENTS

1. [Collections Dashboard](#1-collections-dashboard)
2. [Debtor Management](#2-debtor-management)
3. [PTP (Promise to Pay) Tracking](#3-ptp-promise-to-pay-tracking)
4. [Settlement Management](#4-settlement-management)
5. [Skip Tracing](#5-skip-tracing)
6. [Compliance & Disputes](#6-compliance--disputes)
7. [Legal Escalation](#7-legal-escalation)

---

# 1. COLLECTIONS DASHBOARD

## Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Portfolio Overview | Collections summary | Total outstanding, aging |
| Collection Metrics | Key KPIs | Recovery rate, PTP rate |
| Aging Buckets | Delinquency analysis | 30, 60, 90, 180+ days |
| Collector Performance | Agent metrics | Individual performance |
| Campaign Status | Active campaigns | Campaign progress |

## Dashboard Metrics
| Metric | Description |
|--------|-------------|
| Total Outstanding | Total debt value |
| Total Collected | Amount collected |
| Collection Rate | % collected |
| PTP Amount | Promised to pay |
| PTP Keep Rate | % promises kept |
| Average DPD | Average days past due |
| Settlement Rate | % settled |
| Skip Trace Rate | Contactable % |
| Legal Queue | Cases in legal |

---

# 2. DEBTOR MANAGEMENT

## Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Debtor List | All debtors view | Comprehensive list |
| Debtor Search | Find debtors | Search by any field |
| Status Filtering | Filter by status | Status-based filters |
| Bulk Assignment | Mass allocation | Assign to collectors |
| Priority Scoring | Collection priority | AI-based scoring |
| AI Propensity | Payment prediction | Likelihood to pay |
| Debtor Profile | Full debtor view | 360-degree view |
| Call/Message | Communication | Initiate contact |
| Payment Link | Collect payment | Send payment links |
| QRC Generation | Quick response code | Generate QR codes |

## Debtor List Table Columns
| Column | Field | Type | Description |
|--------|-------|------|-------------|
| Account ID | id | Text | Account identifier |
| Workflow ID | workflowId | Text | Workflow reference |
| Name | name | Text | Debtor name |
| Phone | phone | Phone | Contact number |
| Email | email | Email | Email address |
| Outstanding | outstandingBalance | Currency | Current balance |
| Original | originalBalance | Currency | Original debt |
| DPD | dpd | Number | Days past due |
| Status | status | Chip | Account status |
| Segment | segment | Chip | Debtor segment |
| Last Contact | lastContact | Date | Last interaction |
| PTP | ptp | Boolean | Has promise |
| PTP Amount | ptpAmount | Currency | Promised amount |
| PTP Date | ptpDate | Date | Promise date |
| Agent | assignedAgent | Text | Assigned collector |
| Debt Type | debtType | Text | Type of debt |
| Charge-off Date | chargeOffDate | Date | When charged off |
| Propensity Score | propensityScore | Number | Payment likelihood |
| Propensity Level | propensityLevel | Chip | High, Medium, Low |
| Best Contact Time | bestContactTime | Text | Optimal contact |
| Preferred Method | preferredContactMethod | Text | Contact preference |
| Payment Probability | paymentProbability | Number | % likely to pay |
| Settlement Probability | settlementProbability | Number | % likely to settle |

## Debtor Object Fields (Complete)
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| id | Text | Auto | Account ID |
| workflowId | Text | Auto | Workflow reference |
| skipTraceId | Text | No | Skip trace reference |
| name | Text | Yes | Debtor full name |
| phone | Phone | Yes | Primary phone |
| alternatePhones | Phone[] | No | Other phones |
| email | Email | No | Email address |
| outstandingBalance | Currency | Yes | Current outstanding |
| originalBalance | Currency | Yes | Original debt amount |
| dpd | Number | Auto | Days past due |
| status | Dropdown | Yes | Active, PTP, Disputed, Settled, Closed, Legal |
| segment | Dropdown | No | Ready-to-Pay, Contactable but Not Paying, Non-Contactable, Hardship |
| lastContact | Date | Auto | Last contact date |
| ptp | Boolean | No | Has active PTP |
| ptpAmount | Currency | No | Promised amount |
| ptpDate | Date | No | Promise date |
| assignedAgent | Dropdown | No | Assigned collector |
| debtType | Dropdown | Yes | Credit Card, Personal Loan, Auto Loan, Medical, Utility, Telecom |
| chargeOffDate | Date | No | Charge-off date |
| propensityScore | Number | Auto | AI propensity (0-100) |
| propensityLevel | Dropdown | Auto | High, Medium, Low |
| isInvalid | Boolean | No | Validation issues |
| validationIssues | Text[] | No | Issue list |
| bestContactTime | Text | Auto | AI-recommended |
| preferredContactMethod | Dropdown | Auto | Phone, Email, SMS |
| paymentProbability | Number | Auto | Payment likelihood % |
| settlementProbability | Number | Auto | Settlement likelihood % |
| address | Text | No | Street address |
| district | Text | No | District/area |
| zipCode | Text | No | Postal code |
| annualIncome | Currency | No | Annual income |
| dti | Number | No | Debt-to-income ratio |
| debtPayment | Currency | No | Monthly debt payment |
| empTitle | Text | No | Job title |
| empLength | Number | No | Employment years |
| jobCategory | Text | No | Job category |
| homeOwnership | Dropdown | No | Own, Rent, Mortgage |
| dependents | Number | No | Number of dependents |
| bankName | Text | No | Primary bank |
| bankAccount | Text | No | Account (masked) |
| loanAmount | Currency | No | Original loan |
| loanLimit | Currency | No | Credit limit |
| loanLength | Number | No | Loan term months |
| interestRate | Number | No | Interest rate % |
| creditGrade | Dropdown | No | A, B, C, D, E |
| creditScore | Number | No | Credit score |
| lastPaymentDate | Date | No | Last payment date |
| lastPaymentAmount | Currency | No | Last payment amount |
| nextPaymentDate | Date | No | Next due date |
| totalPaid | Currency | Auto | Total paid to date |
| applicationDate | Date | No | Loan application date |
| approvalDate | Date | No | Loan approval date |
| riskEconomic | Number | No | Economic risk score |
| riskMobile | Number | No | Mobile risk score |
| riskSocial | Number | No | Social risk score |
| socialContacts | Number | No | Social connections |
| socialFriendsDelinquent | Number | No | Delinquent connections |
| documents | Object[] | No | Debtor documents |
| paymentHistory | Object[] | Auto | Payment history |

## Filter Fields
| Field Name | Type | Options |
|------------|------|---------|
| status | Dropdown | all, Active, PTP, Disputed, Settled |
| segment | Dropdown | all, Ready-to-Pay, Contactable but Not Paying, Non-Contactable |
| dpdMin | Number | Minimum DPD |
| dpdMax | Number | Maximum DPD |
| balanceMin | Currency | Minimum balance |
| balanceMax | Currency | Maximum balance |
| agent | Dropdown | All agents |
| aiScoreMin | Number | Minimum propensity |
| aiScoreMax | Number | Maximum propensity |

## Call Dialog Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| callNotes | Textarea | No | Call notes |
| callOutcome | Dropdown | Yes | Disposition |
| followupDate | Date | No | Follow-up date |
| followupTime | Time | No | Follow-up time |
| postCommStatus | Dropdown | No | Post-call status |

## Message Dialog Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| messageText | Textarea | Yes | Message content |
| messageType | Dropdown | Yes | SMS, Email, WhatsApp, Line, Telegram |
| attachments | File[] | No | Attachments |
| postCommStatus | Dropdown | No | Post-message status |
| postCommFollowupDate | Date | No | Follow-up date |
| postCommFollowupTime | Time | No | Follow-up time |

## Payment Link Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| amount | Currency | Yes | Payment amount |
| description | Text | No | Payment description |
| expiryDays | Number | No | Link validity days |
| sendSMS | Boolean | No | Send via SMS |
| sendEmail | Boolean | No | Send via Email |
| sendWhatsApp | Boolean | No | Send via WhatsApp |

---

# 3. PTP (PROMISE TO PAY) TRACKING

## Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| PTP Dashboard | All promises overview | View all PTPs |
| PTP Creation | Record promises | Create new PTPs |
| PTP Status Tracking | Monitor fulfillment | Track status |
| PTP Reminders | Proactive follow-up | Reminder notifications |
| PTP Analytics | Promise metrics | PTP analysis |

## PTP Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| ptpId | Text | Auto | PTP ID |
| debtorId | Text | Yes | Debtor reference |
| debtorName | Text | Auto | Debtor name |
| promiseDate | Date | Yes | Promised payment date |
| promiseAmount | Currency | Yes | Promised amount |
| promiseType | Dropdown | Yes | Full, Partial, Settlement |
| status | Dropdown | Auto | Pending, Kept, Broken, Partial |
| paymentReceived | Currency | Auto | Amount received |
| receivedDate | Date | Auto | When received |
| source | Dropdown | No | How obtained |
| notes | Textarea | No | PTP notes |
| reminderSent | Boolean | Auto | Reminder sent |
| reminderDate | Date | Auto | Reminder date |
| createdBy | Text | Auto | Agent who recorded |
| createdAt | DateTime | Auto | Creation date |

---

# 4. SETTLEMENT MANAGEMENT

## Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Settlement Offers | Propose settlements | Create offers |
| Offer Configuration | Settlement terms | Configure terms |
| Settlement Approval | Authorization | Approval workflow |
| Settlement Tracking | Monitor agreements | Track status |
| Payment Plans | Installment setups | Multi-payment plans |

## Settlement Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| settlementId | Text | Auto | Settlement ID |
| debtorId | Text | Yes | Debtor reference |
| debtorName | Text | Auto | Debtor name |
| originalBalance | Currency | Auto | Original debt |
| settlementAmount | Currency | Yes | Offered amount |
| discountPercent | Number | Auto | Discount % |
| paymentType | Dropdown | Yes | Lump Sum, Installments |
| installments | Number | No | Number of payments |
| installmentAmount | Currency | Auto | Payment amount |
| firstPaymentDate | Date | Yes | First payment due |
| expiryDate | Date | Yes | Offer expiry |
| status | Dropdown | Yes | Proposed, Accepted, Rejected, In Progress, Completed, Failed |
| approvalRequired | Boolean | Auto | Needs approval |
| approvedBy | Text | No | Approver |
| approvalDate | Date | No | Approval date |
| acceptedAt | DateTime | No | When accepted |
| paymentsReceived | Number | Auto | Payments made |
| amountReceived | Currency | Auto | Total received |
| notes | Textarea | No | Settlement notes |
| createdBy | Text | Auto | Creator |
| createdAt | DateTime | Auto | Creation date |

## Settlement Plan Payment Fields
| Field Name | Type | Description |
|------------|------|-------------|
| paymentNumber | Number | Payment sequence |
| dueDate | Date | Payment due date |
| amount | Currency | Payment amount |
| status | Dropdown | Pending, Paid, Overdue, Missed |
| paidDate | Date | When paid |
| paidAmount | Currency | Amount paid |
| reference | Text | Payment reference |

---

# 5. SKIP TRACING

## Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Skip Search | Locate debtors | Search for contacts |
| Skip Data Sources | Information sources | Third-party integrations |
| Search History | Past searches | Search records |
| Data Update | Apply found data | Update debtor records |

## Skip Trace Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| skipTraceId | Text | Auto | Skip trace ID |
| debtorId | Text | Yes | Debtor reference |
| searchDate | DateTime | Auto | Search date |
| searchType | Dropdown | Yes | Phone, Email, Address, All |
| provider | Dropdown | No | Data provider |
| resultsFound | Boolean | Auto | Found results |
| newPhones | Phone[] | No | Found phones |
| newEmails | Email[] | No | Found emails |
| newAddresses | Text[] | No | Found addresses |
| newEmployment | Object | No | Found employment |
| confidence | Number | Auto | Data confidence |
| appliedToRecord | Boolean | No | Applied to debtor |
| appliedBy | Text | No | Who applied |
| appliedAt | DateTime | No | When applied |
| cost | Currency | Auto | Search cost |
| createdBy | Text | Auto | Requester |

---

# 6. COMPLIANCE & DISPUTES

## Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Dispute Management | Handle disputes | Record and manage |
| Compliance Tracking | Regulatory adherence | Track compliance |
| Cease Communication | Stop contact requests | Handle requests |
| Compliance Reports | Audit reports | Generate reports |

## Dispute Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| disputeId | Text | Auto | Dispute ID |
| debtorId | Text | Yes | Debtor reference |
| disputeType | Dropdown | Yes | Debt validity, Amount, Identity, Already paid, Statute |
| description | Textarea | Yes | Dispute details |
| status | Dropdown | Yes | Open, Investigating, Resolved, Rejected |
| resolution | Textarea | No | Resolution details |
| evidence | File[] | No | Supporting documents |
| receivedDate | Date | Auto | Dispute received |
| responseDeadline | Date | Auto | Response due |
| respondedAt | DateTime | No | When responded |
| resolvedAt | DateTime | No | When resolved |
| assignedTo | Dropdown | No | Assigned handler |
| createdAt | DateTime | Auto | Record created |

## Cease Communication Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| ceaseId | Text | Auto | Cease request ID |
| debtorId | Text | Yes | Debtor reference |
| ceaseType | Dropdown | Yes | All, Phone, Email, SMS |
| requestDate | Date | Auto | Request date |
| requestMethod | Dropdown | Yes | Written, Verbal |
| effectiveDate | Date | Auto | When effective |
| documentUrl | URL | No | Request document |
| status | Dropdown | Yes | Active, Expired, Revoked |
| notes | Textarea | No | Notes |

---

# 7. LEGAL ESCALATION

## Features
| Feature | Description | Explanation |
|---------|-------------|-------------|
| Legal Queue | Escalation candidates | View candidates |
| Legal Referral | Send to legal | Refer to legal team |
| Legal Status Tracking | Monitor cases | Track legal status |
| Legal Cost Tracking | Expense monitoring | Track costs |

## Legal Escalation Fields
| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| legalId | Text | Auto | Legal case ID |
| debtorId | Text | Yes | Debtor reference |
| debtorName | Text | Auto | Debtor name |
| outstandingAmount | Currency | Auto | Outstanding debt |
| escalationDate | Date | Auto | When escalated |
| escalationReason | Dropdown | Yes | Non-payment, Fraud, Other |
| legalFirm | Text | No | External law firm |
| attorney | Text | No | Assigned attorney |
| status | Dropdown | Yes | Pending, Filed, Judgment, Garnishment, Closed |
| courtName | Text | No | Court name |
| caseNumber | Text | No | Court case number |
| filingDate | Date | No | When filed |
| hearingDate | Date | No | Next hearing |
| judgmentDate | Date | No | Judgment date |
| judgmentAmount | Currency | No | Judgment amount |
| legalCosts | Currency | No | Legal expenses |
| recovered | Currency | Auto | Amount recovered |
| notes | Textarea | No | Case notes |
| documents | File[] | No | Legal documents |
| createdBy | Text | Auto | Escalated by |
| createdAt | DateTime | Auto | Creation date |

---

## Document Information

**Module**: Debt Collections
**Version**: 1.0
**Last Updated**: December 2025
**Total Features**: 35+
**Total Fields**: 150+

---

*This document can be converted to Microsoft Word format using any Markdown to Word converter or by copying into Microsoft Word directly.*
