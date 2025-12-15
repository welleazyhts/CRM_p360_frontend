import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Grid, Chip, Button, IconButton, Alert, Card, CardContent,
  Stack, Avatar, Tooltip, TextField, Fade, Zoom, alpha, Dialog, DialogTitle,
  DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem,
  CircularProgress, Snackbar, Tabs, Tab, Paper, Divider, List, ListItem,
  ListItemText, ListItemIcon, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, LinearProgress, FormControlLabel, Checkbox, InputAdornment
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon, Edit as EditIcon, History as HistoryIcon,
  Person as PersonIcon, Phone as PhoneIcon, Email as EmailIcon,
  Description as DescriptionIcon, Assignment as AssignmentIcon,
  Timeline as TimelineIcon, AccessTime as AccessTimeIcon,
  PriorityHigh as PriorityHighIcon, LocalOffer as LocalOfferIcon,
  Settings as SettingsIcon, WhatsApp as WhatsAppIcon,
  CreditCard as CreditCardIcon, Home as HomeIcon, Verified as VerifiedIcon,
  Sms as SmsIcon, SmartToy as SmartToyIcon, CalendarToday as CalendarTodayIcon,
  Event as EventIcon, Send as SendIcon, Notifications as NotificationsIcon,
  ViewList as ViewListIcon, ViewModule as ViewModuleIcon, Info as InfoIcon,
  Assessment as AssessmentIcon, Lightbulb as LightbulbIcon,
  CheckCircle as CheckCircleIcon, MonetizationOn as MonetizationOnIcon,
  Receipt as ReceiptIcon, Warning as WarningIcon, TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon, Close as CloseIcon, Gavel as GavelIcon,
  AccountBalance as AccountBalanceIcon, Work as WorkIcon,
  Security as SecurityIcon, TrackChanges as TrackChangesIcon,
  Handshake as HandshakeIcon, AttachMoney as AttachMoneyIcon,
  CallMade as CallMadeIcon, Message as MessageIcon,
  Business as BusinessIcon, LocationOn as LocationOnIcon,
  Save as SaveIcon, Cancel as CancelIcon, ContactPhone as ContactPhoneIcon,
  Add as AddIcon, Delete as DeleteIcon, VolunteerActivism as VolunteerActivismIcon,
  Search as SearchIcon, Visibility as VisibilityIcon, Pending as PendingIcon,
  Link as LinkIcon, Payment as PaymentIcon, AttachFile as AttachFileIcon
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

// TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`debtor-tabpanel-${index}`}
      aria-labelledby={`debtor-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// Mock debtors data - same as DebtorManagement.jsx
const mockDebtors = [
  { id: 'ACC-2024-001', name: 'Rajesh Kumar', phone: '+91-98765-43210', email: 'rajesh.kumar@email.com', address: '123 MG Road, Bangalore', district: 'Bangalore Urban', zipCode: '560001' },
  { id: 'ACC-2024-003', name: 'Amit Singh', phone: '+91-98765-43211', email: 'amit.singh@email.com', address: '456 Park Street, Mumbai', district: 'Mumbai Suburban', zipCode: '400001' },
  { id: 'ACC-2024-005', name: 'Neha Gupta', phone: '+91-98765-43212', email: 'neha.gupta@email.com', address: '789 Ring Road, Delhi', district: 'New Delhi', zipCode: '110001' },
  { id: 'ACC-2024-002', name: 'Priya Mehta', phone: '+91-98765-43213', email: 'priya.mehta@email.com', address: '321 Lake View, Pune', district: 'Pune', zipCode: '411001' },
  { id: 'ACC-2024-008', name: 'Rahul Verma', phone: '+91-98765-43214', email: 'rahul.verma@email.com', address: '654 Beach Road, Chennai', district: 'Chennai', zipCode: '600001' },
  { id: 'ACC-2024-012', name: 'Sneha Patel', phone: '+91-98765-43215', email: 'sneha.patel@email.com', address: '987 SG Highway, Ahmedabad', district: 'Ahmedabad', zipCode: '380001' },
  { id: 'ACC-10007', name: 'Thomas Anderson', phone: '+1-555-0134', email: 'thomas.a@email.com', address: '654 Cedar Lane', district: 'North Side', zipCode: '10005' },
  { id: 'ACC-10008', name: 'Susan Clark', phone: '+1-555-0135', email: 'susan.c@email.com', address: '987 Maple Drive', district: 'South End', zipCode: '10006' }
];

const DebtorDetails = () => {
  const { debtorId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  // State management
  const [debtorData, setDebtorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState(0);
  const [isConsolidatedView, setIsConsolidatedView] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [expandedMessages, setExpandedMessages] = useState(new Set());

  // Contact Numbers Management
  const [contactNumbersDialog, setContactNumbersDialog] = useState(false);
  const [contactNumbers, setContactNumbers] = useState([]);
  const [newContact, setNewContact] = useState({
    contactPerson: '',
    relationship: 'self',
    contactNumber: '',
    numberType: 'secondary'
  });
  const [editingContactIndex, setEditingContactIndex] = useState(null);

  // Family Details Management
  const [familyDetailsDialog, setFamilyDetailsDialog] = useState(false);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [newFamilyMember, setNewFamilyMember] = useState({
    name: '',
    relationship: 'spouse',
    age: '',
    occupation: '',
    phone: '',
    income: ''
  });
  const [editingFamilyIndex, setEditingFamilyIndex] = useState(null);

  // Case Remarks Management
  const [caseRemarks, setCaseRemarks] = useState([]);
  const [remarksDialog, setRemarksDialog] = useState(false);
  const [newRemark, setNewRemark] = useState({
    remark: '',
    category: 'General'
  });

  // Quick Actions Management
  const [quickActionDialog, setQuickActionDialog] = useState('');

  // Payment Reconciliation Management
  const [paymentReconciliationDialog, setPaymentReconciliationDialog] = useState(false);
  const [paymentReconciliationData, setPaymentReconciliationData] = useState({
    amount: '',
    paymentDate: '',
    paymentMethod: 'UPI',
    transactionRef: '',
    bankName: '',
    remarks: '',
    proofDocument: null
  });
  const [reconciliationRequests, setReconciliationRequests] = useState([]);

  // Payment Link Management
  const [paymentLinkDialog, setPaymentLinkDialog] = useState(false);
  const [paymentLinkData, setPaymentLinkData] = useState({
    amount: '',
    description: '',
    expiryDays: 7,
    sendSMS: true,
    sendEmail: true,
    sendWhatsApp: false
  });

  // Activity Details Dialog
  const [activityDetailsDialog, setActivityDetailsDialog] = useState({ open: false, type: null, data: null }); // 'communication', 'ptp', 'settlement', 'hardship', 'paymentPlan', 'legal', 'dispute', 'skipTrace'
  const [actionFormData, setActionFormData] = useState({
    // Communication
    commType: 'Call',
    commOutcome: '',
    commNotes: '',
    // PTP - matches PTPTracking.jsx
    ptpAmount: '',
    ptpDate: '',
    ptpNotes: '',
    // Settlement - comprehensive from SettlementAutomation.jsx
    settlementType: 'lump_sum', // lump_sum, payment_plan
    settlementAmount: '',
    settlementDiscount: '',
    offerValidUntil: '',
    paymentTerms: '',
    settlementNotes: '',
    // Hardship - matches HardshipPrograms.jsx
    monthlyIncome: '',
    monthlyExpenses: '',
    hardshipReason: '',
    hardshipDetails: '',
    supportingDocuments: '',
    // Payment Plan
    planAmount: '',
    planInstallments: '',
    planFrequency: 'Monthly',
    planStartDate: '',
    planNotes: '',
    // Legal - matches LegalEscalation.jsx
    legalActionType: 'notice', // notice, summons, filing
    escalationReason: '',
    attorneyAssigned: '',
    courtName: '',
    legalNotes: '',
    // Dispute - matches ComplianceDisputes.jsx
    disputeReason: '', // not_recognized, amount_incorrect, already_paid, identity_theft, statute_limitations, other
    disputeDetails: '',
    disputedAmount: '',
    // Skip Trace
    skipTraceReason: '',
    lastKnownAddress: '',
    lastKnownPhone: '',
    skipTraceNotes: ''
  });

  // Mock data - In production, fetch from API
  useEffect(() => {
    const fetchDebtorData = async () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        // Find the debtor by ID from mockDebtors array
        const foundDebtor = mockDebtors.find(d => d.id === debtorId) || mockDebtors[0];

        setDebtorData({
          // Basic Info - use found debtor's data
          id: foundDebtor.id,
          name: foundDebtor.name,
          email: foundDebtor.email,
          phone: foundDebtor.phone,
          alternatePhone: foundDebtor.phone, // Use same phone as alternate for now
          status: 'Active',
          segment: 'Ready-to-Pay',
          assignedAgent: 'Priya Patel',
          lastContact: '2025-01-20',

          // Financial Info
          outstandingBalance: 45000,
          originalBalance: 60000,
          debtType: 'Personal Loan',
          dpd: 45,
          chargeOffDate: '2024-11-15',
          interestRate: 12.5,
          creditGrade: 'B',
          loanLength: 36,
          loanLimit: 60000,
          annualIncome: 720000,
          dti: 0.35,
          debtPayment: 15000,
          creditScore: 680,

          // Employment & Address - use found debtor's data
          address: foundDebtor.address,
          district: foundDebtor.district,
          zipCode: foundDebtor.zipCode,
          homeOwnership: 'Rented',
          dependents: 2,
          employerName: 'Tech Solutions Pvt Ltd',
          jobTitle: 'Software Engineer',
          employmentStatus: 'Employed',
          yearsEmployed: 5,

          // Bank Details
          bankName: 'HDFC Bank',
          accountNumber: '****1234',
          routingNumber: 'HDFC0001234',

          // AI Scores
          propensityScore: 72,
          propensityLevel: 'High',
          paymentProbability: 65,
          settlementProbability: 45,
          bestContactTime: '10:00 AM - 12:00 PM',
          preferredContactMethod: 'Phone Call',

          // Cross-Module Data
          skipTracing: {
            status: 'Not Required',
            lastUpdated: null,
            newAddresses: []
          },
          settlements: [
            {
              id: 'SET-001',
              amount: 30000,
              status: 'Pending Approval',
              requestDate: '2025-01-15',
              discountPercent: 33.3,
              approvalLevel: 'Manager'
            }
          ],
          paymentPlans: [
            {
              id: 'PLAN-001',
              type: 'Monthly EMI',
              amount: 5000,
              installments: 9,
              status: 'Active',
              startDate: '2025-01-01',
              nextDueDate: '2025-02-01'
            }
          ],
          disputes: [],
          hardshipRequests: [
            {
              id: 'HARD-001',
              reason: 'Job Loss',
              status: 'Under Review',
              requestDate: '2025-01-10',
              supportingDocs: 2
            }
          ],
          legalEscalation: {
            status: 'Not Escalated',
            lastAction: null
          },
          ptpRecords: [
            {
              id: 'PTP-001',
              amount: 10000,
              date: '2025-01-25',
              status: 'Active',
              createdDate: '2025-01-18'
            }
          ],

          // Loan Originated Details
          loanOriginatedDate: '2023-08-15',
          loanOriginatedBank: 'HDFC Bank',
          loanOriginatedChannel: 'Branch',
          loanOriginatedBranch: 'MG Road Branch, Bangalore',
          loanOriginatedProduct: 'Personal Loan',

          // Other Products from Bank/Agency
          otherProducts: [
            {
              id: 'PROD-001',
              productType: 'Credit Card',
              productName: 'HDFC MoneyBack Credit Card',
              accountNumber: '****5678',
              status: 'Active',
              openedDate: '2022-05-10',
              creditLimit: 200000,
              outstandingAmount: 25000
            },
            {
              id: 'PROD-002',
              productType: 'Savings Account',
              productName: 'HDFC Savings Account',
              accountNumber: '****9012',
              status: 'Active',
              openedDate: '2020-03-15',
              currentBalance: 45000
            },
            {
              id: 'PROD-003',
              productType: 'Fixed Deposit',
              productName: 'HDFC Fixed Deposit',
              accountNumber: '****3456',
              status: 'Active',
              openedDate: '2023-01-20',
              depositAmount: 100000,
              maturityDate: '2026-01-20',
              interestRate: 7.5
            }
          ],

          // Payment History
          payments: [
            { date: '2024-12-20', amount: 5000, method: 'UPI', status: 'Success' },
            { date: '2024-11-18', amount: 5000, method: 'Net Banking', status: 'Success' },
            { date: '2024-10-15', amount: 5000, method: 'Cheque', status: 'Success' },
            { date: '2024-09-12', amount: 5000, method: 'UPI', status: 'Success' },
            { date: '2024-08-10', amount: 5000, method: 'Net Banking', status: 'Success' }
          ],

          // Communication Logs
          communications: [
            { id: 1, type: 'Call', date: '2025-01-20', outcome: 'Connected', duration: '4:32', agent: 'Priya Patel' },
            { id: 2, type: 'SMS', date: '2025-01-19', message: 'Payment reminder sent', status: 'Delivered' },
            { id: 3, type: 'Email', date: '2025-01-18', subject: 'Payment Notice', status: 'Opened' },
            { id: 4, type: 'WhatsApp', date: '2025-01-17', message: 'Settlement offer shared', status: 'Read' }
          ],

          // Payment Reconciliation Requests
          paymentReconciliationRequests: [
            {
              id: 'REC-001',
              requestDate: '2025-01-18',
              requestedBy: 'Priya Patel',
              amount: 5000,
              paymentDate: '2025-01-17',
              paymentMethod: 'UPI',
              transactionRef: 'UPI2025011712345',
              bankName: 'HDFC Bank',
              remarks: 'Payment received via PhonePe',
              status: 'Approved',
              approvedBy: 'Manager - Suresh Kumar',
              approvalDate: '2025-01-19',
              proofAttached: true
            },
            {
              id: 'REC-002',
              requestDate: '2025-01-15',
              requestedBy: 'Priya Patel',
              amount: 3000,
              paymentDate: '2025-01-14',
              paymentMethod: 'Cash',
              transactionRef: 'CASH-20250114',
              bankName: 'N/A',
              remarks: 'Cash payment collected at branch',
              status: 'Pending',
              approvedBy: null,
              approvalDate: null,
              proofAttached: true
            },
            {
              id: 'REC-003',
              requestDate: '2025-01-10',
              requestedBy: 'Priya Patel',
              amount: 2000,
              paymentDate: '2025-01-09',
              paymentMethod: 'Cheque',
              transactionRef: 'CHQ-123456',
              bankName: 'ICICI Bank',
              remarks: 'Cheque payment - pending clearance',
              status: 'Rejected',
              approvedBy: 'Manager - Suresh Kumar',
              approvalDate: '2025-01-11',
              rejectionReason: 'Cheque bounced - insufficient funds',
              proofAttached: false
            }
          ],

          // Consolidated Activity Timeline from ALL Modules
          timeline: [
            // Settlement email with customer acceptance
            {
              id: 'email-2025-01-21-09:30',
              date: '2025-01-21',
              time: '09:30',
              module: 'Communication',
              action: 'Settlement Email Sent',
              user: 'System',
              recipient: 'rajesh.kumar@example.com',
              subject: 'Settlement Offer - SET-789',
              emailContent: `Dear Rajesh Kumar,

We are pleased to offer you a settlement opportunity for your outstanding debt.

SETTLEMENT OFFER DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Original Amount Due: ₹60,000.00
Settlement Amount: ₹42,000
Discount Offered: 30% (₹18,000.00)
Settlement Type: Lump Sum Payment
Payment Terms: Payment within 15 days
Offer Valid Until: 2025-02-05

Additional Notes:
This is a one-time settlement offer. Payment must be completed within the validity period.

TO ACCEPT THIS OFFER:
Please reply to this email with "ACCEPT" or click the acceptance link below.

TO DISCUSS THIS OFFER:
Contact us at +91-9999999999 or reply to this email.

This is a limited-time offer. Please respond by 2025-02-05 to take advantage of this settlement opportunity.

Best regards,
Collections Team`,
              details: 'Settlement offer email sent to rajesh.kumar@example.com',
              status: 'success',
              category: 'contact',
              settlementId: 'SET-789',
              customerReply: `ACCEPTED

I accept the settlement offer of ₹42,000 with 30% discount. Please send me the payment instructions.

Thank you,
Rajesh Kumar`,
              replyDate: '2025-01-21',
              replyTime: '15:45',
              replyStatus: 'Accepted'
            },
            // Settlement creation entry
            {
              date: '2025-01-21',
              time: '09:30',
              module: 'Settlement',
              action: 'Settlement Offer Created',
              user: 'Priya Patel',
              details: 'Settlement offer SET-789 created: ₹42,000 (30% discount). Email sent and awaiting customer response.',
              status: 'success',
              category: 'settlement',
              settlementId: 'SET-789'
            },
            // PTP email with payment confirmation
            {
              id: 'email-2025-01-20-16:00',
              date: '2025-01-20',
              time: '16:00',
              module: 'Communication',
              action: 'PTP Reminder Email Sent',
              user: 'System',
              recipient: 'rajesh.kumar@example.com',
              subject: 'Payment Reminder - PTP Confirmation',
              emailContent: `Dear Rajesh Kumar,

This is a confirmation of your Promise to Pay agreement.

PAYMENT PROMISE DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Promise Amount: ₹10,000
Payment Due Date: 2025-01-25
Account ID: ACC-10001

Additional Notes:
Promised to pay after salary deposit on 25th January

IMPORTANT REMINDERS:
- Please ensure payment is made by the promised date
- Contact us immediately if you anticipate any issues
- Payment confirmation will be sent once received

TO MAKE YOUR PAYMENT:
Please use one of our available payment methods and reference your Account ID.

QUESTIONS OR CONCERNS:
Contact us at +91-9999999999 or reply to this email.

Thank you for your commitment to resolving your account.

Best regards,
Collections Team`,
              details: 'PTP reminder email sent to customer',
              status: 'success',
              category: 'contact',
              ptpId: 'PTP-456',
              customerReply: null,
              replyDate: null,
              replyTime: null
            },
            // Pending settlement email (no reply yet)
            {
              id: 'email-2025-01-19-11:15',
              date: '2025-01-19',
              time: '11:15',
              module: 'Communication',
              action: 'Settlement Email Sent',
              user: 'System',
              recipient: 'rajesh.kumar@example.com',
              subject: 'Settlement Offer - SET-456',
              emailContent: `Dear Rajesh Kumar,

We are pleased to offer you a settlement opportunity for your outstanding debt.

SETTLEMENT OFFER DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Original Amount Due: ₹45,000.00
Settlement Amount: ₹30,000
Discount Offered: 33% (₹15,000.00)
Settlement Type: Installment Plan
Payment Terms: 3 monthly installments of ₹10,000
Offer Valid Until: 2025-02-01

Additional Notes:
Flexible installment plan available to ease your financial burden.

TO ACCEPT THIS OFFER:
Please reply to this email with "ACCEPT" or click the acceptance link below.

TO DISCUSS THIS OFFER:
Contact us at +91-9999999999 or reply to this email.

This is a limited-time offer. Please respond by 2025-02-01 to take advantage of this settlement opportunity.

Best regards,
Collections Team`,
              details: 'Settlement offer email sent to rajesh.kumar@example.com - Awaiting response',
              status: 'success',
              category: 'contact',
              settlementId: 'SET-456',
              customerReply: null,
              replyDate: null,
              replyTime: null
            },
            { date: '2025-01-20', time: '14:30', module: 'Communication', action: 'Call Made', user: 'Priya Patel', details: 'Connected with debtor. Discussed payment plan options', status: 'success', category: 'contact' },
            { date: '2025-01-20', time: '10:15', module: 'Payment', action: 'Payment Received', user: 'System', details: 'Payment of ₹5,000 received via UPI', status: 'success', category: 'payment' },
            { date: '2025-01-19', time: '16:45', module: 'Communication', action: 'SMS Sent', user: 'System', details: 'Payment reminder SMS delivered', status: 'success', category: 'contact' },
            { date: '2025-01-18', time: '11:20', module: 'PTP', action: 'PTP Created', user: 'Priya Patel', details: 'Promise to pay ₹10,000 by Jan 25, 2025', status: 'pending', category: 'ptp' },
            { date: '2025-01-18', time: '09:30', module: 'Communication', action: 'Email Sent', user: 'System', details: 'Payment notice email opened by debtor', status: 'success', category: 'contact' },
            // WhatsApp message with customer reply
            {
              id: 'whatsapp-2025-01-17-15:10',
              date: '2025-01-17',
              time: '15:10',
              module: 'Communication',
              action: 'WhatsApp Message Sent',
              user: 'Priya Patel',
              recipient: '+91-9876543210',
              messageContent: `Hi Rajesh,

This is Priya from the Collections Team.

We have a special settlement offer for you on your account (ACC-2024-001):

💰 Original Amount: ₹45,000
💰 Settlement Offer: ₹30,000
💰 You Save: ₹15,000 (33% discount!)

✅ Flexible 3-month installment plan available
✅ No additional charges
✅ Offer valid until Feb 1st, 2025

This is a great opportunity to resolve your account with significant savings.

Would you like to proceed with this offer? Please reply YES to accept or call us to discuss.

Thank you,
Priya Patel
Collections Team`,
              details: 'Settlement offer shared via WhatsApp. Message read by customer',
              status: 'success',
              category: 'contact',
              readStatus: 'Read',
              readTime: '15:12',
              customerReply: `Yes, I'm interested in the settlement offer. Can I pay ₹10,000 per month for 3 months? Please send me the payment details.`,
              replyDate: '2025-01-17',
              replyTime: '16:30',
              replyStatus: 'Positive'
            },
            // Line message with payment reminder
            {
              id: 'line-2025-01-16-10:00',
              date: '2025-01-16',
              time: '10:00',
              module: 'Communication',
              action: 'Line Message Sent',
              user: 'System',
              recipient: '+91-9876543210',
              messageContent: `🔔 Payment Reminder

Dear Rajesh Kumar,

This is a friendly reminder about your pending payment:

Account Number: ACC-2024-001
Outstanding Amount: ₹45,000
Days Past Due: 75 days

⚠️ Please make a payment at your earliest convenience to avoid further action.

💳 Payment Options Available:
• UPI
• Net Banking
• Debit/Credit Card
• Cash Deposit

📞 Need help? Contact us:
Phone: +91-9999999999
Email: collections@example.com

Thank you for your cooperation.`,
              details: 'Payment reminder sent via Line',
              status: 'success',
              category: 'contact',
              readStatus: 'Read',
              readTime: '10:15',
              customerReply: null,
              replyDate: null,
              replyTime: null
            },
            // WhatsApp message without reply
            {
              id: 'whatsapp-2025-01-16-09:00',
              date: '2025-01-16',
              time: '09:00',
              module: 'Communication',
              action: 'WhatsApp Message Sent',
              user: 'Priya Patel',
              recipient: '+91-9876543210',
              messageContent: `Good morning Rajesh,

Hope you're doing well!

Just following up on your account payment. We understand that financial situations can be challenging, and we're here to help.

Our team can work with you to create a payment plan that fits your budget.

Please let us know when would be a good time to discuss this.

Best regards,
Priya Patel`,
              details: 'Follow-up message sent via WhatsApp',
              status: 'success',
              category: 'contact',
              readStatus: 'Delivered',
              deliveredTime: '09:01',
              customerReply: null,
              replyDate: null,
              replyTime: null
            },
            { date: '2025-01-15', time: '13:45', module: 'Settlement', action: 'Settlement Requested', user: 'Rajesh Kumar', details: 'Requested 33% settlement discount (₹30,000 settlement on ₹45,000)', status: 'pending', category: 'settlement' },
            { date: '2025-01-12', time: '10:00', module: 'Payment Plan', action: 'Payment Plan Activated', user: 'Priya Patel', details: 'Monthly EMI plan of ₹5,000 for 9 months activated', status: 'success', category: 'payment' },
            { date: '2025-01-10', time: '14:25', module: 'Hardship', action: 'Hardship Request Filed', user: 'Rajesh Kumar', details: 'Hardship request due to job loss. Supporting documents submitted', status: 'pending', category: 'hardship' },
            // Skip Tracing Activities
            {
              date: '2025-01-09',
              time: '15:45',
              module: 'Skip Tracing',
              action: 'Skip Trace Social Media Located',
              user: 'Skip Trace Team',
              details: 'Added social media: LinkedIn - linkedin.com/in/rajeshkumar',
              status: 'success',
              category: 'update',
              skipTraceId: 'SKP-2025-001',
              accountNumber: 'ACC-2024-001'
            },
            {
              date: '2025-01-09',
              time: '14:20',
              module: 'Skip Tracing',
              action: 'Skip Trace Asset Added',
              user: 'Skip Trace Team',
              details: 'Added asset: Honda City 2020 (Vehicle) - Estimated value: ₹8,00,000',
              status: 'success',
              category: 'update',
              skipTraceId: 'SKP-2025-001',
              accountNumber: 'ACC-2024-001'
            },
            {
              date: '2025-01-09',
              time: '11:30',
              module: 'Skip Tracing',
              action: 'Skip Trace Employment Updated',
              user: 'Skip Trace Team',
              details: 'Updated employment: Tech Solutions Pvt Ltd - Software Engineer',
              status: 'success',
              category: 'update',
              skipTraceId: 'SKP-2025-001',
              accountNumber: 'ACC-2024-001'
            },
            {
              date: '2025-01-08',
              time: '16:10',
              module: 'Skip Tracing',
              action: 'Skip Trace Address Added',
              user: 'Skip Trace Team',
              details: 'Added address: 123, MG Road, Bangalore, Karnataka - 560001 (Current) - Verified: Yes',
              status: 'success',
              category: 'update',
              skipTraceId: 'SKP-2025-001',
              accountNumber: 'ACC-2024-001'
            },
            {
              date: '2025-01-08',
              time: '14:50',
              module: 'Skip Tracing',
              action: 'Skip Trace Email Added',
              user: 'Skip Trace Team',
              details: 'Added email: rajesh.kumar@email.com (Personal) - Verified: Yes',
              status: 'success',
              category: 'update',
              skipTraceId: 'SKP-2025-001',
              accountNumber: 'ACC-2024-001'
            },
            {
              date: '2025-01-08',
              time: '11:15',
              module: 'Skip Tracing',
              action: 'Skip Trace Phone Added',
              user: 'Skip Trace Team',
              details: 'Added phone: +91 98765 43210 (Mobile) - Verified: Yes',
              status: 'success',
              category: 'update',
              skipTraceId: 'SKP-2025-001',
              accountNumber: 'ACC-2024-001'
            },
            {
              date: '2025-01-08',
              time: '09:00',
              module: 'Skip Tracing',
              action: 'Skip Trace Search Completed',
              user: 'Skip Trace Team',
              details: 'Skip trace search completed successfully. Found 2 phone numbers, 2 email addresses, 2 addresses, employment info, and 2 assets. Confidence: 92%',
              status: 'success',
              category: 'update',
              skipTraceId: 'SKP-2025-001',
              accountNumber: 'ACC-2024-001'
            },
            {
              date: '2025-01-07',
              time: '16:30',
              module: 'Skip Tracing',
              action: 'Skip Trace Search Initiated',
              user: 'Skip Trace Team',
              details: 'Skip trace search initiated for debtor: Rajesh Kumar (ACC-2024-001). Previous contact attempts failed.',
              status: 'success',
              category: 'update',
              skipTraceId: 'SKP-2025-001',
              accountNumber: 'ACC-2024-001'
            },
            { date: '2025-01-05', time: '16:30', module: 'Communication', action: 'Call Attempted', user: 'Priya Patel', details: 'Call not answered. Left voicemail', status: 'failed', category: 'contact' },
            // Legal Notice with document attachments
            {
              date: '2025-01-03',
              time: '09:45',
              module: 'Legal',
              action: 'Legal Notice Issued',
              user: 'Legal Team',
              details: 'Pre-legal notice sent to debtor address with supporting documents',
              status: 'success',
              category: 'legal',
              attachments: [
                {
                  id: 'doc-001',
                  name: 'Legal_Notice_ACC-2024-001.pdf',
                  type: 'application/pdf',
                  size: '245 KB',
                  uploadDate: '2025-01-03',
                  uploadTime: '09:40',
                  description: 'Pre-legal notice document'
                },
                {
                  id: 'doc-002',
                  name: 'Account_Statement_Dec2024.pdf',
                  type: 'application/pdf',
                  size: '156 KB',
                  uploadDate: '2025-01-03',
                  uploadTime: '09:42',
                  description: 'Account statement showing outstanding balance'
                },
                {
                  id: 'doc-003',
                  name: 'Payment_History.xlsx',
                  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                  size: '89 KB',
                  uploadDate: '2025-01-03',
                  uploadTime: '09:43',
                  description: 'Complete payment history record'
                }
              ]
            },
            // Earlier legal action with attachments
            {
              date: '2024-12-28',
              time: '14:30',
              module: 'Legal',
              action: 'Legal Documents Filed',
              user: 'Legal Team',
              details: 'Initial legal documentation prepared and filed',
              status: 'success',
              category: 'legal',
              attachments: [
                {
                  id: 'doc-004',
                  name: 'Case_Filing_ACC-2024-001.pdf',
                  type: 'application/pdf',
                  size: '512 KB',
                  uploadDate: '2024-12-28',
                  uploadTime: '14:25',
                  description: 'Legal case filing documents'
                },
                {
                  id: 'doc-005',
                  name: 'Debtor_Agreement_Original.pdf',
                  type: 'application/pdf',
                  size: '1.2 MB',
                  uploadDate: '2024-12-28',
                  uploadTime: '14:28',
                  description: 'Original signed agreement with debtor'
                }
              ]
            },
            { date: '2024-12-28', time: '12:00', module: 'Dispute', action: 'Dispute Resolved', user: 'Dispute Team', details: 'Payment amount dispute resolved in favor of creditor', status: 'success', category: 'dispute' },
            { date: '2024-12-20', time: '15:20', module: 'Payment', action: 'Payment Received', user: 'System', details: 'Payment of ₹5,000 received via Net Banking', status: 'success', category: 'payment' },
            { date: '2024-12-15', time: '10:30', module: 'Case Assignment', action: 'Agent Assigned', user: 'Manager', details: 'Case assigned to collector Priya Patel', status: 'success', category: 'update' }
          ],

          // Case Remarks
          remarks: [
            { id: 1, date: '2025-01-20', time: '14:35', user: 'Priya Patel', remark: 'Debtor is cooperative and willing to pay. Prefers EMI option. Will follow up on Jan 25 for PTP', category: 'General' },
            { id: 2, date: '2025-01-15', time: '14:00', user: 'Priya Patel', remark: 'Debtor mentioned recent job loss. Provided hardship documentation. Settlement discussion ongoing', category: 'Important' },
            { id: 3, date: '2025-01-10', time: '11:00', user: 'Priya Patel', remark: 'Initial contact established. Debtor acknowledges debt. Requested time to arrange payment', category: 'General' }
          ]
        });

        // Set initial contact numbers
        setContactNumbers([
          { contactPerson: 'Rajesh Kumar', relationship: 'self', contactNumber: '+91-9876543210', numberType: 'primary' },
          { contactPerson: 'Priya Kumar', relationship: 'spouse', contactNumber: '+91-9876543211', numberType: 'secondary' }
        ]);

        // Set initial family members
        setFamilyMembers([
          {
            name: 'Priya Kumar',
            relationship: 'spouse',
            age: 32,
            occupation: 'Teacher',
            phone: '+91-9876543211',
            income: 480000
          },
          {
            name: 'Amit Kumar',
            relationship: 'son',
            age: 8,
            occupation: 'Student',
            phone: '',
            income: 0
          },
          {
            name: 'Sunita Kumar',
            relationship: 'mother',
            age: 58,
            occupation: 'Retired',
            phone: '+91-9876543212',
            income: 120000
          }
        ]);

        // Set initial case remarks
        setCaseRemarks([
          { id: 1, date: '2025-01-20', time: '14:35', user: 'Priya Patel', remark: 'Debtor is cooperative and willing to pay. Prefers EMI option. Will follow up on Jan 25 for PTP', category: 'General' },
          { id: 2, date: '2025-01-15', time: '14:00', user: 'Priya Patel', remark: 'Debtor mentioned recent job loss. Provided hardship documentation. Settlement discussion ongoing', category: 'Important' },
          { id: 3, date: '2025-01-10', time: '11:00', user: 'Priya Patel', remark: 'Initial contact established. Debtor acknowledges debt. Requested time to arrange payment', category: 'General' }
        ]);

        setEditedData({
          name: 'Rajesh Kumar',
          email: 'rajesh.kumar@email.com',
          phone: '+91-9876543210',
          alternatePhone: '+91-9876543211',
          address: '123 MG Road, Bangalore',
          district: 'Bangalore Urban',
          zipCode: '560001'
        });
        setLoading(false);
      }, 500);
    };

    fetchDebtorData();
  }, [debtorId]);

  const handleSaveEdit = () => {
    setDebtorData({ ...debtorData, ...editedData });
    setEditMode(false);
    setSnackbar({ open: true, message: 'Customer details updated successfully!', severity: 'success' });
  };

  // Contact Numbers Management Handlers
  const handleOpenContactDialog = () => {
    setNewContact({
      contactPerson: '',
      relationship: 'self',
      contactNumber: '',
      numberType: 'secondary'
    });
    setEditingContactIndex(null);
    setContactNumbersDialog(true);
  };

  const handleEditContact = (index) => {
    setNewContact(contactNumbers[index]);
    setEditingContactIndex(index);
    setContactNumbersDialog(true);
  };

  const handleSaveContact = () => {
    if (!newContact.contactPerson || !newContact.contactNumber) {
      setSnackbar({ open: true, message: 'Please fill all required fields', severity: 'error' });
      return;
    }

    if (editingContactIndex !== null) {
      // Update existing contact
      const updatedContacts = [...contactNumbers];
      updatedContacts[editingContactIndex] = newContact;
      setContactNumbers(updatedContacts);
      setSnackbar({ open: true, message: 'Contact updated successfully!', severity: 'success' });
    } else {
      // Add new contact
      setContactNumbers([...contactNumbers, newContact]);
      setSnackbar({ open: true, message: 'Contact added successfully!', severity: 'success' });
    }

    setContactNumbersDialog(false);
    setNewContact({
      contactPerson: '',
      relationship: 'self',
      contactNumber: '',
      numberType: 'secondary'
    });
    setEditingContactIndex(null);
  };

  const handleDeleteContact = (index) => {
    const updatedContacts = contactNumbers.filter((_, i) => i !== index);
    setContactNumbers(updatedContacts);
    setSnackbar({ open: true, message: 'Contact deleted successfully!', severity: 'success' });
  };

  // Family Details Management Handlers
  const handleOpenFamilyDialog = () => {
    setNewFamilyMember({
      name: '',
      relationship: 'spouse',
      age: '',
      occupation: '',
      phone: '',
      income: ''
    });
    setEditingFamilyIndex(null);
    setFamilyDetailsDialog(true);
  };

  const handleEditFamilyMember = (index) => {
    setNewFamilyMember(familyMembers[index]);
    setEditingFamilyIndex(index);
    setFamilyDetailsDialog(true);
  };

  const handleSaveFamilyMember = () => {
    if (!newFamilyMember.name || !newFamilyMember.relationship) {
      setSnackbar({ open: true, message: 'Please fill all required fields', severity: 'error' });
      return;
    }

    if (editingFamilyIndex !== null) {
      // Update existing family member
      const updatedFamily = [...familyMembers];
      updatedFamily[editingFamilyIndex] = newFamilyMember;
      setFamilyMembers(updatedFamily);
      setSnackbar({ open: true, message: 'Family member updated successfully!', severity: 'success' });
    } else {
      // Add new family member
      setFamilyMembers([...familyMembers, newFamilyMember]);
      setSnackbar({ open: true, message: 'Family member added successfully!', severity: 'success' });
    }

    setFamilyDetailsDialog(false);
    setNewFamilyMember({
      name: '',
      relationship: 'spouse',
      age: '',
      occupation: '',
      phone: '',
      income: ''
    });
    setEditingFamilyIndex(null);
  };

  const handleDeleteFamilyMember = (index) => {
    const updatedFamily = familyMembers.filter((_, i) => i !== index);
    setFamilyMembers(updatedFamily);
    setSnackbar({ open: true, message: 'Family member deleted successfully!', severity: 'success' });
  };

  // Case Remarks Handlers
  const handleOpenRemarksDialog = () => {
    setNewRemark({ remark: '', category: 'General' });
    setRemarksDialog(true);
  };

  const handleAddRemark = () => {
    if (!newRemark.remark.trim()) {
      setSnackbar({ open: true, message: 'Please enter a remark', severity: 'error' });
      return;
    }

    const remarkToAdd = {
      id: caseRemarks.length + 1,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      user: 'Current User', // In production, get from auth context
      remark: newRemark.remark,
      category: newRemark.category
    };

    setCaseRemarks([remarkToAdd, ...caseRemarks]);
    setSnackbar({ open: true, message: 'Remark added successfully!', severity: 'success' });
    setRemarksDialog(false);
    setNewRemark({ remark: '', category: 'General' });
  };

  // Quick Action Handlers
  const handleSubmitQuickAction = () => {
    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    let newActivity = null;
    let successMessage = '';

    switch (quickActionDialog) {
      case 'communication':
        if (!actionFormData.commOutcome.trim()) {
          setSnackbar({ open: true, message: 'Please enter communication outcome', severity: 'error' });
          return;
        }
        newActivity = {
          date: currentDate,
          time: currentTime,
          module: 'Communication',
          action: `${actionFormData.commType} ${actionFormData.commOutcome === 'Connected' ? 'Made' : 'Attempted'}`,
          user: 'Current User',
          details: actionFormData.commNotes || `${actionFormData.commType} ${actionFormData.commOutcome}`,
          status: actionFormData.commOutcome === 'Connected' ? 'success' : 'failed',
          category: 'contact'
        };
        successMessage = 'Communication logged successfully!';
        break;

      case 'ptp':
        if (!actionFormData.ptpAmount || !actionFormData.ptpDate) {
          setSnackbar({ open: true, message: 'Please enter PTP amount and date', severity: 'error' });
          return;
        }
        newActivity = {
          date: currentDate,
          time: currentTime,
          module: 'PTP',
          action: 'PTP Created',
          user: 'Current User',
          details: `Promise to pay ₹${actionFormData.ptpAmount} by ${actionFormData.ptpDate}. ${actionFormData.ptpNotes || ''}`,
          status: 'pending',
          category: 'ptp'
        };
        successMessage = 'Promise to Pay created successfully!';
        break;

      case 'settlement':
        if (!actionFormData.settlementAmount) {
          setSnackbar({ open: true, message: 'Please enter settlement amount', severity: 'error' });
          return;
        }

        // Create email content for settlement
        const originalDebt = parseInt(actionFormData.settlementAmount) / (1 - (parseFloat(actionFormData.settlementDiscount) || 0) / 100);
        const discountAmount = originalDebt - parseInt(actionFormData.settlementAmount);
        const emailContent = `
Dear ${debtorData?.name || 'Valued Customer'},

We are pleased to offer you a settlement opportunity for your outstanding debt.

SETTLEMENT OFFER DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━
Original Amount Due: ₹${originalDebt.toFixed(2)}
Settlement Amount: ₹${actionFormData.settlementAmount}
Discount Offered: ${actionFormData.settlementDiscount}% (₹${discountAmount.toFixed(2)})
Settlement Type: ${actionFormData.settlementType === 'lump_sum' ? 'Lump Sum Payment' : 'Installment Plan'}
Payment Terms: ${actionFormData.paymentTerms || 'Payment within 15 days'}
Offer Valid Until: ${actionFormData.offerValidUntil || 'N/A'}

${actionFormData.settlementNotes ? `\nAdditional Notes:\n${actionFormData.settlementNotes}` : ''}

TO ACCEPT THIS OFFER:
Please reply to this email with "ACCEPT" or click the acceptance link below.

TO DISCUSS THIS OFFER:
Contact us at [phone number] or reply to this email.

This is a limited-time offer. Please respond by ${actionFormData.offerValidUntil || '[date]'} to take advantage of this settlement opportunity.

Best regards,
Collections Team
        `.trim();

        // Create new settlement entry
        const settlementId = `SET-${String(Date.now()).slice(-3)}`;
        const newSettlement = {
          id: settlementId,
          amount: parseInt(actionFormData.settlementAmount),
          status: 'Pending Approval',
          requestDate: currentDate,
          discountPercent: parseFloat(actionFormData.settlementDiscount) || 0,
          settlementType: actionFormData.settlementType || 'lump_sum',
          offerValidUntil: actionFormData.offerValidUntil || '',
          paymentTerms: actionFormData.paymentTerms || 'Payment within 15 days',
          notes: actionFormData.settlementNotes || '',
          createdBy: 'Current User',
          emailSent: true,
          emailSentDate: `${currentDate} ${currentTime}`,
          emailContent: emailContent,
          customerResponse: null,
          timelineEmailId: `email-${currentDate}-${currentTime}` // Link to timeline entry
        };

        // Add settlement to debtor data
        if (debtorData) {
          const emailTimelineId = `email-${currentDate}-${currentTime}`;
          setDebtorData({
            ...debtorData,
            settlements: [newSettlement, ...(debtorData.settlements || [])],
            timeline: [
              // Email notification entry with full content
              {
                id: emailTimelineId,
                date: currentDate,
                time: currentTime,
                module: 'Communication',
                action: 'Settlement Email Sent',
                user: 'System',
                recipient: debtorData.email || debtorData.phone || 'Customer',
                subject: `Settlement Offer - ${settlementId}`,
                emailContent: emailContent,
                details: `Settlement offer email sent to ${debtorData.email || 'customer'}`,
                status: 'success',
                category: 'contact',
                settlementId: settlementId,
                customerReply: null, // Will be updated when customer responds
                replyDate: null,
                replyTime: null
              },
              // Settlement creation entry
              {
                date: currentDate,
                time: currentTime,
                module: 'Settlement',
                action: 'Settlement Offer Created',
                user: 'Current User',
                details: `Settlement offer ${settlementId} created: ₹${actionFormData.settlementAmount} (${actionFormData.settlementDiscount}% discount). Email sent and awaiting customer response.`,
                status: 'pending',
                category: 'settlement',
                settlementId: settlementId
              },
              ...(debtorData.timeline || [])
            ]
          });
        }

        successMessage = 'Settlement offer created and email sent to customer!';
        break;

      case 'hardship':
        if (!actionFormData.hardshipReason.trim()) {
          setSnackbar({ open: true, message: 'Please enter hardship reason', severity: 'error' });
          return;
        }
        newActivity = {
          date: currentDate,
          time: currentTime,
          module: 'Hardship',
          action: 'Hardship Request Filed',
          user: 'Current User',
          details: `Hardship request: ${actionFormData.hardshipReason}. ${actionFormData.hardshipNotes || ''}`,
          status: 'pending',
          category: 'hardship'
        };
        successMessage = 'Hardship request filed successfully!';
        break;

      case 'paymentPlan':
        if (!actionFormData.planAmount || !actionFormData.planInstallments) {
          setSnackbar({ open: true, message: 'Please enter plan amount and installments', severity: 'error' });
          return;
        }
        newActivity = {
          date: currentDate,
          time: currentTime,
          module: 'Payment Plan',
          action: 'Payment Plan Created',
          user: 'Current User',
          details: `${actionFormData.planFrequency} plan of ₹${actionFormData.planAmount} for ${actionFormData.planInstallments} installments. ${actionFormData.planNotes || ''}`,
          status: 'pending',
          category: 'payment'
        };
        successMessage = 'Payment plan created successfully!';
        break;

      case 'legal':
        if (!actionFormData.legalNotes.trim()) {
          setSnackbar({ open: true, message: 'Please enter legal action details', severity: 'error' });
          return;
        }
        newActivity = {
          date: currentDate,
          time: currentTime,
          module: 'Legal',
          action: `Legal ${actionFormData.legalAction} Issued`,
          user: 'Current User',
          details: actionFormData.legalNotes,
          status: 'success',
          category: 'legal'
        };
        successMessage = 'Legal action initiated successfully!';
        break;

      case 'dispute':
        if (!actionFormData.disputeReason.trim()) {
          setSnackbar({ open: true, message: 'Please enter dispute reason', severity: 'error' });
          return;
        }
        newActivity = {
          date: currentDate,
          time: currentTime,
          module: 'Dispute',
          action: 'Dispute Filed',
          user: 'Current User',
          details: `Dispute reason: ${actionFormData.disputeReason}${actionFormData.disputeAmount ? ` (Amount: ₹${actionFormData.disputeAmount})` : ''}. ${actionFormData.disputeNotes || ''}`,
          status: 'pending',
          category: 'dispute'
        };
        successMessage = 'Dispute filed successfully!';
        break;

      case 'skipTrace':
        if (!actionFormData.skipTraceReason.trim()) {
          setSnackbar({ open: true, message: 'Please enter skip trace reason', severity: 'error' });
          return;
        }
        newActivity = {
          date: currentDate,
          time: currentTime,
          module: 'Skip Tracing',
          action: 'Skip Trace Requested',
          user: 'Current User',
          details: `Skip trace reason: ${actionFormData.skipTraceReason}. ${actionFormData.skipTraceNotes || ''}`,
          status: 'pending',
          category: 'update'
        };
        successMessage = 'Skip trace request submitted successfully!';
        break;

      default:
        return;
    }

    // Add activity to timeline
    if (newActivity && debtorData) {
      setDebtorData({
        ...debtorData,
        timeline: [newActivity, ...debtorData.timeline]
      });
    }

    // Reset form and close dialog
    setQuickActionDialog('');
    setActionFormData({
      commType: 'Call',
      commOutcome: '',
      commNotes: '',
      ptpAmount: '',
      ptpDate: '',
      ptpNotes: '',
      settlementType: 'lump_sum',
      settlementAmount: '',
      settlementDiscount: '',
      offerValidUntil: '',
      paymentTerms: '',
      settlementNotes: '',
      monthlyIncome: '',
      monthlyExpenses: '',
      hardshipReason: '',
      hardshipDetails: '',
      supportingDocuments: '',
      planAmount: '',
      planInstallments: '',
      planFrequency: 'Monthly',
      planStartDate: '',
      planNotes: '',
      legalActionType: 'notice',
      escalationReason: '',
      attorneyAssigned: '',
      courtName: '',
      legalNotes: '',
      disputeReason: '',
      disputeDetails: '',
      disputedAmount: '',
      skipTraceReason: '',
      lastKnownAddress: '',
      lastKnownPhone: '',
      skipTraceNotes: ''
    });

    setSnackbar({ open: true, message: successMessage, severity: 'success' });
  };

  // Settlement Acceptance/Rejection Handlers
  const handleSettlementAcceptance = (settlementId, accepted) => {
    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

    setDebtorData(prevData => {
      // Find the settlement
      const settlement = prevData.settlements.find(s => s.id === settlementId);

      // Create customer reply message
      const customerReplyMessage = accepted
        ? `ACCEPTED\n\nI accept the settlement offer of ₹${settlement?.amount.toLocaleString()} with ${settlement?.discountPercent}% discount. Please send me the payment instructions.\n\nThank you,\n${prevData.name || 'Customer'}`
        : `REJECTED\n\nI am unable to accept the settlement offer at this time. ${accepted === false ? 'The terms do not work for my current situation.' : ''}\n\nThank you,\n${prevData.name || 'Customer'}`;

      return {
        ...prevData,
        settlements: prevData.settlements.map(s =>
          s.id === settlementId
            ? {
                ...s,
                status: accepted ? 'Accepted' : 'Rejected',
                customerResponse: accepted ? 'Accepted' : 'Rejected',
                responseDate: currentDate,
                acceptedDate: accepted ? currentDate : null,
                rejectedDate: accepted ? null : currentDate
              }
            : s
        ),
        timeline: prevData.timeline.map(entry => {
          // Update the email timeline entry that sent this settlement offer
          if (entry.settlementId === settlementId && entry.action === 'Settlement Email Sent') {
            return {
              ...entry,
              customerReply: customerReplyMessage,
              replyDate: currentDate,
              replyTime: currentTime,
              replyStatus: accepted ? 'Accepted' : 'Rejected'
            };
          }
          return entry;
        })
      };
    });

    setSnackbar({
      open: true,
      message: accepted ? 'Settlement accepted by customer! Response added to timeline.' : 'Settlement rejected by customer. Response added to timeline.',
      severity: accepted ? 'success' : 'warning'
    });
  };

  // Toggle message content expansion (for email, WhatsApp, Line)
  const toggleMessageExpansion = (messageId) => {
    setExpandedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'Active': 'success',
      'Contacted': 'info',
      'PTP': 'warning',
      'Legal': 'error',
      'Closed': 'default'
    };
    return colors[status] || 'default';
  };

  const getSegmentColor = (segment) => {
    const colors = {
      'Ready-to-Pay': 'success',
      'Contactable': 'info',
      'Hard-to-Contact': 'warning',
      'Skip-trace': 'error',
      'Legal': 'error'
    };
    return colors[segment] || 'default';
  };

  // Contact Numbers Display Component
  const ContactNumbersCard = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ContactPhoneIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>Contact Numbers</Typography>
          </Box>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleOpenContactDialog}
          >
            Add Number
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {contactNumbers.length === 0 ? (
          <Alert severity="info">No contact numbers added yet.</Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Contact Person</TableCell>
                  <TableCell>Relationship</TableCell>
                  <TableCell>Contact Number</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contactNumbers.map((contact, index) => (
                  <TableRow key={index}>
                    <TableCell>{contact.contactPerson}</TableCell>
                    <TableCell>
                      <Chip
                        label={contact.relationship.charAt(0).toUpperCase() + contact.relationship.slice(1)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{contact.contactNumber}</TableCell>
                    <TableCell>
                      <Chip
                        label={contact.numberType.charAt(0).toUpperCase() + contact.numberType.slice(1)}
                        color={contact.numberType === 'primary' ? 'primary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditContact(index)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteContact(index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );

  // Family Details Display Component
  const FamilyDetailsCard = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>Family Details</Typography>
          </Box>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleOpenFamilyDialog}
          >
            Add Family Member
          </Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {familyMembers.length === 0 ? (
          <Alert severity="info">No family members added yet.</Alert>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Relationship</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell>Occupation</TableCell>
                  <TableCell>Contact Number</TableCell>
                  <TableCell align="right">Income (₹)</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {familyMembers.map((member, index) => (
                  <TableRow key={index}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={member.relationship.charAt(0).toUpperCase() + member.relationship.slice(1)}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>{member.age || 'N/A'}</TableCell>
                    <TableCell>{member.occupation || 'N/A'}</TableCell>
                    <TableCell>{member.phone || '-'}</TableCell>
                    <TableCell align="right">
                      {member.income ? `₹${member.income.toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditFamilyMember(index)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteFamilyMember(index)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Zoom in={true}>
            <IconButton
              onClick={() => navigate('/collections/debtor-management')}
              sx={{
                bgcolor: 'background.paper',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
                }
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Zoom>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="600">
              Debtor Details - {debtorData.id}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              <Chip
                label={debtorData.status}
                color={getStatusColor(debtorData.status)}
                sx={{ fontWeight: 500, borderRadius: 5 }}
              />
              <Chip
                label={debtorData.segment}
                color={getSegmentColor(debtorData.segment)}
                variant="outlined"
                sx={{ fontWeight: 500, borderRadius: 5 }}
              />
              {debtorData.settlements && debtorData.settlements.length > 0 && (
                <Chip
                  icon={<HandshakeIcon />}
                  label={`${debtorData.settlements.length} Settlement${debtorData.settlements.length > 1 ? 's' : ''}`}
                  color="warning"
                  variant="outlined"
                  sx={{ fontWeight: 500, borderRadius: 5 }}
                />
              )}
              <Typography variant="body2" color="text.secondary">
                Last Contact: {debtorData.lastContact}
              </Typography>
            </Stack>
          </Box>

          <Stack direction="row" spacing={2}>
            {/* Payment Reconciliation Button */}
            <Tooltip title="Raise Payment Reconciliation Request">
              <Button
                variant="contained"
                color="success"
                startIcon={<AttachMoneyIcon />}
                onClick={() => setPaymentReconciliationDialog(true)}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Payment Reconciliation
              </Button>
            </Tooltip>

            {/* Send Payment Link Button */}
            <Tooltip title="Send Payment Link to Debtor">
              <Button
                variant="contained"
                color="primary"
                startIcon={<PaymentIcon />}
                onClick={() => {
                  setPaymentLinkData({
                    amount: debtorData.outstandingBalance?.toString() || '',
                    description: `Payment for Account ${debtorData.id}`,
                    expiryDays: 7,
                    sendSMS: !!debtorData.phone,
                    sendEmail: !!debtorData.email,
                    sendWhatsApp: false
                  });
                  setPaymentLinkDialog(true);
                }}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Send Payment Link
              </Button>
            </Tooltip>

            {/* Edit Customer Details Button */}
            <Tooltip title="Edit Customer Details">
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setEditMode(true)}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Edit Details
              </Button>
            </Tooltip>

            {/* View Toggle Button */}
            <Tooltip title={isConsolidatedView ? "Switch to Tab View" : "Switch to Consolidated View"}>
              <Button
                variant={isConsolidatedView ? "contained" : "outlined"}
                startIcon={isConsolidatedView ? <ViewModuleIcon /> : <ViewListIcon />}
                onClick={() => setIsConsolidatedView(!isConsolidatedView)}
                sx={{
                  borderRadius: 3,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                {isConsolidatedView ? "Consolidated" : "Tabs"}
              </Button>
            </Tooltip>
          </Stack>
        </Box>

        {/* Edit Customer Details Dialog */}
        <Dialog open={editMode} onClose={() => setEditMode(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EditIcon color="primary" />
              <Typography variant="h6">Edit Customer Details</Typography>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={editedData.name}
                  onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={editedData.email}
                  onChange={(e) => setEditedData({ ...editedData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={editedData.phone}
                  onChange={(e) => setEditedData({ ...editedData, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Alternate Phone"
                  value={editedData.alternatePhone}
                  onChange={(e) => setEditedData({ ...editedData, alternatePhone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  value={editedData.address}
                  onChange={(e) => setEditedData({ ...editedData, address: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="District"
                  value={editedData.district}
                  onChange={(e) => setEditedData({ ...editedData, district: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="ZIP Code"
                  value={editedData.zipCode}
                  onChange={(e) => setEditedData({ ...editedData, zipCode: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setEditMode(false)} startIcon={<CancelIcon />}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSaveEdit} startIcon={<SaveIcon />}>
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Payment Reconciliation Dialog */}
        <Dialog
          open={paymentReconciliationDialog}
          onClose={() => setPaymentReconciliationDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AttachMoneyIcon color="success" />
              <Typography variant="h6">Raise Payment Reconciliation Request</Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Submit payment details for manager approval and payment update
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Payment Amount"
                  type="number"
                  value={paymentReconciliationData.amount}
                  onChange={(e) => setPaymentReconciliationData({ ...paymentReconciliationData, amount: e.target.value })}
                  placeholder="Enter amount received"
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography>
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Payment Date"
                  type="date"
                  value={paymentReconciliationData.paymentDate}
                  onChange={(e) => setPaymentReconciliationData({ ...paymentReconciliationData, paymentDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Payment Method</InputLabel>
                  <Select
                    value={paymentReconciliationData.paymentMethod}
                    label="Payment Method"
                    onChange={(e) => setPaymentReconciliationData({ ...paymentReconciliationData, paymentMethod: e.target.value })}
                  >
                    <MenuItem value="UPI">UPI</MenuItem>
                    <MenuItem value="Net Banking">Net Banking</MenuItem>
                    <MenuItem value="Cheque">Cheque</MenuItem>
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Credit Card">Credit Card</MenuItem>
                    <MenuItem value="Debit Card">Debit Card</MenuItem>
                    <MenuItem value="NEFT/RTGS">NEFT/RTGS</MenuItem>
                    <MenuItem value="IMPS">IMPS</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Transaction Reference Number"
                  value={paymentReconciliationData.transactionRef}
                  onChange={(e) => setPaymentReconciliationData({ ...paymentReconciliationData, transactionRef: e.target.value })}
                  placeholder="UTR/Transaction ID/Cheque No"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Bank Name"
                  value={paymentReconciliationData.bankName}
                  onChange={(e) => setPaymentReconciliationData({ ...paymentReconciliationData, bankName: e.target.value })}
                  placeholder="Enter bank name"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Button
                  variant="outlined"
                  component="label"
                  fullWidth
                  sx={{ height: '56px' }}
                  startIcon={<DescriptionIcon />}
                >
                  {paymentReconciliationData.proofDocument ? paymentReconciliationData.proofDocument.name : 'Upload Payment Proof'}
                  <input
                    type="file"
                    hidden
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setPaymentReconciliationData({ ...paymentReconciliationData, proofDocument: e.target.files[0] });
                      }
                    }}
                  />
                </Button>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Remarks / Additional Notes"
                  multiline
                  rows={3}
                  value={paymentReconciliationData.remarks}
                  onChange={(e) => setPaymentReconciliationData({ ...paymentReconciliationData, remarks: e.target.value })}
                  placeholder="Add any additional information about this payment"
                />
              </Grid>
              <Grid item xs={12}>
                <Alert severity="info">
                  <Typography variant="body2">
                    <strong>Note:</strong> This request will be sent to the manager for approval.
                    Once approved, the payment will be updated in the system automatically.
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button
              onClick={() => {
                setPaymentReconciliationDialog(false);
                setPaymentReconciliationData({
                  amount: '',
                  paymentDate: '',
                  paymentMethod: 'UPI',
                  transactionRef: '',
                  bankName: '',
                  remarks: '',
                  proofDocument: null
                });
              }}
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                // In production, this would submit to API
                setSnackbar({
                  open: true,
                  message: 'Payment reconciliation request submitted successfully! Request sent to manager for approval.',
                  severity: 'success'
                });
                setPaymentReconciliationDialog(false);
                setPaymentReconciliationData({
                  amount: '',
                  paymentDate: '',
                  paymentMethod: 'UPI',
                  transactionRef: '',
                  bankName: '',
                  remarks: '',
                  proofDocument: null
                });
              }}
              startIcon={<SendIcon />}
            >
              Submit for Approval
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add/Edit Contact Number Dialog */}
        <Dialog open={contactNumbersDialog} onClose={() => setContactNumbersDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PhoneIcon color="primary" />
              <Typography variant="h6">
                {editingContactIndex !== null ? 'Edit Contact Number' : 'Add Contact Number'}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Contact Person Name"
                  value={newContact.contactPerson}
                  onChange={(e) => setNewContact({ ...newContact, contactPerson: e.target.value })}
                  placeholder="Enter full name"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Relationship</InputLabel>
                  <Select
                    value={newContact.relationship}
                    label="Relationship"
                    onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                  >
                    <MenuItem value="self">Self</MenuItem>
                    <MenuItem value="spouse">Spouse</MenuItem>
                    <MenuItem value="father">Father</MenuItem>
                    <MenuItem value="mother">Mother</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Contact Number"
                  value={newContact.contactNumber}
                  onChange={(e) => setNewContact({ ...newContact, contactNumber: e.target.value })}
                  placeholder="+91-XXXXXXXXXX"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Number Type</InputLabel>
                  <Select
                    value={newContact.numberType}
                    label="Number Type"
                    onChange={(e) => setNewContact({ ...newContact, numberType: e.target.value })}
                  >
                    <MenuItem value="primary">Primary</MenuItem>
                    <MenuItem value="secondary">Secondary</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setContactNumbersDialog(false)} startIcon={<CancelIcon />}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSaveContact} startIcon={<SaveIcon />}>
              {editingContactIndex !== null ? 'Update' : 'Add'} Contact
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add/Edit Family Member Dialog */}
        <Dialog open={familyDetailsDialog} onClose={() => setFamilyDetailsDialog(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon color="primary" />
              <Typography variant="h6">
                {editingFamilyIndex !== null ? 'Edit Family Member' : 'Add Family Member'}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Full Name"
                  value={newFamilyMember.name}
                  onChange={(e) => setNewFamilyMember({ ...newFamilyMember, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Relationship</InputLabel>
                  <Select
                    value={newFamilyMember.relationship}
                    label="Relationship"
                    onChange={(e) => setNewFamilyMember({ ...newFamilyMember, relationship: e.target.value })}
                  >
                    <MenuItem value="spouse">Spouse</MenuItem>
                    <MenuItem value="father">Father</MenuItem>
                    <MenuItem value="mother">Mother</MenuItem>
                    <MenuItem value="son">Son</MenuItem>
                    <MenuItem value="daughter">Daughter</MenuItem>
                    <MenuItem value="brother">Brother</MenuItem>
                    <MenuItem value="sister">Sister</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  value={newFamilyMember.age}
                  onChange={(e) => setNewFamilyMember({ ...newFamilyMember, age: e.target.value })}
                  placeholder="Enter age"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Occupation"
                  value={newFamilyMember.occupation}
                  onChange={(e) => setNewFamilyMember({ ...newFamilyMember, occupation: e.target.value })}
                  placeholder="Enter occupation"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contact Number"
                  value={newFamilyMember.phone}
                  onChange={(e) => setNewFamilyMember({ ...newFamilyMember, phone: e.target.value })}
                  placeholder="+91-XXXXXXXXXX"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Annual Income (₹)"
                  type="number"
                  value={newFamilyMember.income}
                  onChange={(e) => setNewFamilyMember({ ...newFamilyMember, income: e.target.value })}
                  placeholder="Enter annual income"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setFamilyDetailsDialog(false)} startIcon={<CancelIcon />}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSaveFamilyMember} startIcon={<SaveIcon />}>
              {editingFamilyIndex !== null ? 'Update' : 'Add'} Family Member
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Case Remark Dialog */}
        <Dialog open={remarksDialog} onClose={() => setRemarksDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DescriptionIcon color="primary" />
              <Typography variant="h6">Add Case Remark</Typography>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={4}
                  label="Remark"
                  value={newRemark.remark}
                  onChange={(e) => setNewRemark({ ...newRemark, remark: e.target.value })}
                  placeholder="Enter case remark..."
                  helperText="Provide detailed information about the case interaction or observation"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newRemark.category}
                    label="Category"
                    onChange={(e) => setNewRemark({ ...newRemark, category: e.target.value })}
                  >
                    <MenuItem value="General">General</MenuItem>
                    <MenuItem value="Important">Important</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setRemarksDialog(false)} startIcon={<CancelIcon />}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleAddRemark} startIcon={<SaveIcon />}>
              Add Remark
            </Button>
          </DialogActions>
        </Dialog>

        {/* Quick Actions Dialog - Unified for all action types */}
        <Dialog open={!!quickActionDialog} onClose={() => setQuickActionDialog('')} maxWidth="md" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {quickActionDialog === 'communication' && <PhoneIcon color="primary" />}
              {quickActionDialog === 'ptp' && <ScheduleIcon color="primary" />}
              {quickActionDialog === 'settlement' && <HandshakeIcon color="primary" />}
              {quickActionDialog === 'hardship' && <VolunteerActivismIcon color="primary" />}
              {quickActionDialog === 'paymentPlan' && <MonetizationOnIcon color="primary" />}
              {quickActionDialog === 'legal' && <GavelIcon color="primary" />}
              {quickActionDialog === 'dispute' && <InfoIcon color="primary" />}
              {quickActionDialog === 'skipTrace' && <SearchIcon color="primary" />}
              <Typography variant="h6">
                {quickActionDialog === 'communication' && 'Log Communication'}
                {quickActionDialog === 'ptp' && 'Create Promise to Pay'}
                {quickActionDialog === 'settlement' && 'Create Settlement Request'}
                {quickActionDialog === 'hardship' && 'File Hardship Request'}
                {quickActionDialog === 'paymentPlan' && 'Create Payment Plan'}
                {quickActionDialog === 'legal' && 'Initiate Legal Action'}
                {quickActionDialog === 'dispute' && 'File Dispute'}
                {quickActionDialog === 'skipTrace' && 'Request Skip Trace'}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              {/* Communication Fields */}
              {quickActionDialog === 'communication' && (
                <>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Type</InputLabel>
                      <Select value={actionFormData.commType} label="Type" onChange={(e) => setActionFormData({...actionFormData, commType: e.target.value})}>
                        <MenuItem value="Call">Call</MenuItem>
                        <MenuItem value="SMS">SMS</MenuItem>
                        <MenuItem value="Email">Email</MenuItem>
                        <MenuItem value="WhatsApp">WhatsApp</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth required label="Outcome" value={actionFormData.commOutcome} onChange={(e) => setActionFormData({...actionFormData, commOutcome: e.target.value})} placeholder="e.g., Connected, No Answer, Voicemail" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth multiline rows={3} label="Notes" value={actionFormData.commNotes} onChange={(e) => setActionFormData({...actionFormData, commNotes: e.target.value})} placeholder="Enter communication details..." />
                  </Grid>
                </>
              )}

              {/* PTP Fields */}
              {quickActionDialog === 'ptp' && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth required type="number" label="Amount (₹)" value={actionFormData.ptpAmount} onChange={(e) => setActionFormData({...actionFormData, ptpAmount: e.target.value})} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth required type="date" label="Promise Date" value={actionFormData.ptpDate} onChange={(e) => setActionFormData({...actionFormData, ptpDate: e.target.value})} InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth multiline rows={3} label="Notes" value={actionFormData.ptpNotes} onChange={(e) => setActionFormData({...actionFormData, ptpNotes: e.target.value})} />
                  </Grid>
                </>
              )}

              {/* Settlement Fields */}
              {quickActionDialog === 'settlement' && (
                <>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Settlement Type</InputLabel>
                      <Select value={actionFormData.settlementType} label="Settlement Type" onChange={(e) => setActionFormData({...actionFormData, settlementType: e.target.value})}>
                        <MenuItem value="lump_sum">Lump Sum</MenuItem>
                        <MenuItem value="structured">Structured Payment</MenuItem>
                        <MenuItem value="partial">Partial Settlement</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth required type="number" label="Settlement Amount (₹)" value={actionFormData.settlementAmount} onChange={(e) => setActionFormData({...actionFormData, settlementAmount: e.target.value})} InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography> }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth type="number" label="Discount (%)" value={actionFormData.settlementDiscount} onChange={(e) => setActionFormData({...actionFormData, settlementDiscount: e.target.value})} InputProps={{ endAdornment: <Typography sx={{ ml: 1 }}>%</Typography> }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth type="date" label="Offer Valid Until" value={actionFormData.offerValidUntil} onChange={(e) => setActionFormData({...actionFormData, offerValidUntil: e.target.value})} InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Payment Terms" value={actionFormData.paymentTerms} onChange={(e) => setActionFormData({...actionFormData, paymentTerms: e.target.value})} placeholder="e.g., Payment within 15 days, Wire transfer required" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth multiline rows={3} label="Notes" value={actionFormData.settlementNotes} onChange={(e) => setActionFormData({...actionFormData, settlementNotes: e.target.value})} placeholder="Additional settlement details..." />
                  </Grid>
                </>
              )}

              {/* Hardship Fields */}
              {quickActionDialog === 'hardship' && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth type="number" label="Monthly Income (₹)" value={actionFormData.monthlyIncome} onChange={(e) => setActionFormData({...actionFormData, monthlyIncome: e.target.value})} InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography> }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth type="number" label="Monthly Expenses (₹)" value={actionFormData.monthlyExpenses} onChange={(e) => setActionFormData({...actionFormData, monthlyExpenses: e.target.value})} InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography> }} />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Hardship Reason</InputLabel>
                      <Select value={actionFormData.hardshipReason} label="Hardship Reason" onChange={(e) => setActionFormData({...actionFormData, hardshipReason: e.target.value})}>
                        <MenuItem value="Job Loss">Job Loss</MenuItem>
                        <MenuItem value="Medical Emergency">Medical Emergency</MenuItem>
                        <MenuItem value="Reduced Income">Reduced Income</MenuItem>
                        <MenuItem value="Family Crisis">Family Crisis</MenuItem>
                        <MenuItem value="Natural Disaster">Natural Disaster</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth multiline rows={3} label="Hardship Details" value={actionFormData.hardshipDetails} onChange={(e) => setActionFormData({...actionFormData, hardshipDetails: e.target.value})} placeholder="Provide detailed explanation of the hardship situation..." />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Supporting Documents" value={actionFormData.supportingDocuments} onChange={(e) => setActionFormData({...actionFormData, supportingDocuments: e.target.value})} placeholder="List of documents provided (e.g., Medical bills, Termination letter)" />
                  </Grid>
                </>
              )}

              {/* Payment Plan Fields */}
              {quickActionDialog === 'paymentPlan' && (
                <>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth required type="number" label="Total Amount (₹)" value={actionFormData.planAmount} onChange={(e) => setActionFormData({...actionFormData, planAmount: e.target.value})} InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography> }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth required type="number" label="Number of Installments" value={actionFormData.planInstallments} onChange={(e) => setActionFormData({...actionFormData, planInstallments: e.target.value})} inputProps={{ min: 1 }} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Payment Frequency</InputLabel>
                      <Select value={actionFormData.planFrequency} label="Payment Frequency" onChange={(e) => setActionFormData({...actionFormData, planFrequency: e.target.value})}>
                        <MenuItem value="Weekly">Weekly</MenuItem>
                        <MenuItem value="Biweekly">Biweekly</MenuItem>
                        <MenuItem value="Monthly">Monthly</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth required type="date" label="Plan Start Date" value={actionFormData.planStartDate} onChange={(e) => setActionFormData({...actionFormData, planStartDate: e.target.value})} InputLabelProps={{ shrink: true }} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth multiline rows={2} label="Notes" value={actionFormData.planNotes} onChange={(e) => setActionFormData({...actionFormData, planNotes: e.target.value})} placeholder="Additional payment plan details..." />
                  </Grid>
                </>
              )}

              {/* Legal Fields */}
              {quickActionDialog === 'legal' && (
                <>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Legal Action Type</InputLabel>
                      <Select value={actionFormData.legalActionType} label="Legal Action Type" onChange={(e) => setActionFormData({...actionFormData, legalActionType: e.target.value})}>
                        <MenuItem value="notice">Legal Notice</MenuItem>
                        <MenuItem value="summons">Summons</MenuItem>
                        <MenuItem value="filing">Court Filing</MenuItem>
                        <MenuItem value="judgment">Judgment Execution</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Attorney Assigned" value={actionFormData.attorneyAssigned} onChange={(e) => setActionFormData({...actionFormData, attorneyAssigned: e.target.value})} placeholder="Attorney name or firm" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth required label="Escalation Reason" value={actionFormData.escalationReason} onChange={(e) => setActionFormData({...actionFormData, escalationReason: e.target.value})} placeholder="Why is legal action being taken?" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Court Name" value={actionFormData.courtName} onChange={(e) => setActionFormData({...actionFormData, courtName: e.target.value})} placeholder="Court jurisdiction if applicable" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth multiline rows={3} label="Legal Action Details" value={actionFormData.legalNotes} onChange={(e) => setActionFormData({...actionFormData, legalNotes: e.target.value})} placeholder="Additional legal action details and case notes..." />
                  </Grid>
                </>
              )}

              {/* Dispute Fields */}
              {quickActionDialog === 'dispute' && (
                <>
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Dispute Reason</InputLabel>
                      <Select value={actionFormData.disputeReason} label="Dispute Reason" onChange={(e) => setActionFormData({...actionFormData, disputeReason: e.target.value})}>
                        <MenuItem value="not_recognized">Debt Not Recognized</MenuItem>
                        <MenuItem value="amount_incorrect">Amount Incorrect</MenuItem>
                        <MenuItem value="already_paid">Already Paid</MenuItem>
                        <MenuItem value="identity_theft">Identity Theft</MenuItem>
                        <MenuItem value="statute_limitations">Statute of Limitations</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth type="number" label="Disputed Amount (₹)" value={actionFormData.disputedAmount} onChange={(e) => setActionFormData({...actionFormData, disputedAmount: e.target.value})} InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>₹</Typography> }} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth multiline rows={4} required label="Dispute Details" value={actionFormData.disputeDetails} onChange={(e) => setActionFormData({...actionFormData, disputeDetails: e.target.value})} placeholder="Provide detailed explanation of the dispute and supporting evidence..." />
                  </Grid>
                </>
              )}

              {/* Skip Trace Fields */}
              {quickActionDialog === 'skipTrace' && (
                <>
                  <Grid item xs={12}>
                    <TextField fullWidth required label="Skip Trace Reason" value={actionFormData.skipTraceReason} onChange={(e) => setActionFormData({...actionFormData, skipTraceReason: e.target.value})} placeholder="e.g., Phone disconnected, Address invalid, Debtor relocated" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Last Known Address" value={actionFormData.lastKnownAddress} onChange={(e) => setActionFormData({...actionFormData, lastKnownAddress: e.target.value})} placeholder="Enter last known address if available" />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField fullWidth label="Last Known Phone" value={actionFormData.lastKnownPhone} onChange={(e) => setActionFormData({...actionFormData, lastKnownPhone: e.target.value})} placeholder="Enter last known phone number" />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth multiline rows={3} label="Additional Information" value={actionFormData.skipTraceNotes} onChange={(e) => setActionFormData({...actionFormData, skipTraceNotes: e.target.value})} placeholder="Any other relevant information for skip tracing..." />
                  </Grid>
                </>
              )}
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setQuickActionDialog('')} startIcon={<CancelIcon />}>Cancel</Button>
            <Button variant="contained" onClick={handleSubmitQuickAction} startIcon={<SaveIcon />}>Submit Request</Button>
          </DialogActions>
        </Dialog>

        {/* Activity Details Dialog - View comprehensive details of any activity */}
        <Dialog
          open={activityDetailsDialog.open}
          onClose={() => setActivityDetailsDialog({ open: false, type: null, data: null })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {activityDetailsDialog.type === 'settlement' && <HandshakeIcon color="primary" />}
              {activityDetailsDialog.type === 'ptp' && <ScheduleIcon color="primary" />}
              {activityDetailsDialog.type === 'hardship' && <VolunteerActivismIcon color="primary" />}
              {activityDetailsDialog.type === 'legal' && <GavelIcon color="primary" />}
              {activityDetailsDialog.type === 'dispute' && <InfoIcon color="primary" />}
              <Typography variant="h6">
                {activityDetailsDialog.type === 'settlement' && 'Settlement Details'}
                {activityDetailsDialog.type === 'ptp' && 'Promise to Pay Details'}
                {activityDetailsDialog.type === 'hardship' && 'Hardship Request Details'}
                {activityDetailsDialog.type === 'legal' && 'Legal Action Details'}
                {activityDetailsDialog.type === 'dispute' && 'Dispute Details'}
              </Typography>
            </Box>
          </DialogTitle>
          <DialogContent dividers sx={{ minHeight: '400px' }}>
            {activityDetailsDialog.data && (
              <Box>
                {/* Settlement Details */}
                {activityDetailsDialog.type === 'settlement' && (
                  <Grid container spacing={3}>
                    {/* Status Alert */}
                    <Grid item xs={12}>
                      {activityDetailsDialog.data.status === 'Accepted' && (
                        <Alert severity="success" icon={<CheckCircleIcon />}>
                          Settlement accepted on {activityDetailsDialog.data.acceptedDate || 'N/A'}. Payment due by {activityDetailsDialog.data.paymentDueDate || 'N/A'}.
                        </Alert>
                      )}
                      {activityDetailsDialog.data.status === 'Pending Approval' && (
                        <Alert severity="warning" icon={<PendingIcon />}>
                          Settlement offer created on {activityDetailsDialog.data.requestDate}. Awaiting debtor response.
                        </Alert>
                      )}
                      {activityDetailsDialog.data.status === 'Rejected' && (
                        <Alert severity="error" icon={<CancelIcon />}>
                          Settlement rejected on {activityDetailsDialog.data.rejectedDate || 'N/A'}. Consider alternative arrangements.
                        </Alert>
                      )}
                    </Grid>

                    {/* Settlement Summary Card */}
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Settlement Summary
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">Settlement ID</Typography>
                              <Typography variant="body2" fontWeight={500}>{activityDetailsDialog.data.id}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">Type</Typography>
                              <Typography variant="body2" fontWeight={500}>{activityDetailsDialog.data.settlementType || 'Lump Sum'}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Divider sx={{ my: 1 }} />
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="caption" color="text.secondary">Settlement Amount</Typography>
                              <Typography variant="h5" fontWeight={600} color="primary.main">
                                ₹{activityDetailsDialog.data.amount?.toLocaleString('en-IN') || 0}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">Discount Offered</Typography>
                              <Chip label={`${activityDetailsDialog.data.discountPercent}% OFF`} size="small" color="success" />
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">Status</Typography>
                              <Chip
                                label={activityDetailsDialog.data.status}
                                size="small"
                                color={activityDetailsDialog.data.status === 'Accepted' ? 'success' : 'warning'}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Financial Breakdown Card */}
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Financial Breakdown
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          <Grid container spacing={1}>
                            <Grid item xs={12}>
                              <Typography variant="caption" color="text.secondary">Original Debt</Typography>
                              <Typography variant="h6" fontWeight={600} sx={{ textDecoration: 'line-through' }}>
                                ₹{(activityDetailsDialog.data.amount / (1 - activityDetailsDialog.data.discountPercent / 100))?.toLocaleString('en-IN') || 0}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Divider sx={{ my: 1 }} />
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">Discount Amount</Typography>
                              <Typography variant="body2" fontWeight={600} color="error.main">
                                -₹{((activityDetailsDialog.data.amount / (1 - activityDetailsDialog.data.discountPercent / 100)) - activityDetailsDialog.data.amount)?.toLocaleString('en-IN') || 0}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">Debtor Savings</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">
                                ₹{((activityDetailsDialog.data.amount / (1 - activityDetailsDialog.data.discountPercent / 100)) - activityDetailsDialog.data.amount)?.toLocaleString('en-IN') || 0}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Divider sx={{ my: 1 }} />
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="caption" color="text.secondary">Payment Terms</Typography>
                              <Typography variant="body2" fontWeight={500}>
                                {activityDetailsDialog.data.paymentTerms || 'Payment within 15 days'}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Timeline & Terms Card */}
                    <Grid item xs={12}>
                      <Card variant="outlined" sx={{ bgcolor: alpha(theme.palette.info.main, 0.02) }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Timeline & Terms
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <Typography variant="caption" color="text.secondary">Offer Created</Typography>
                              <Typography variant="body2" fontWeight={500}>{activityDetailsDialog.data.requestDate}</Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Typography variant="caption" color="text.secondary">Offer Valid Until</Typography>
                              <Typography variant="body2" fontWeight={500}>{activityDetailsDialog.data.expiryDate || activityDetailsDialog.data.offerValidUntil || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Typography variant="caption" color="text.secondary">Last Updated</Typography>
                              <Typography variant="body2" fontWeight={500}>{activityDetailsDialog.data.lastUpdated || activityDetailsDialog.data.requestDate}</Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Notes & Assignment Card */}
                    <Grid item xs={12}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Additional Details
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Typography variant="caption" color="text.secondary">Notes</Typography>
                              <Paper elevation={0} sx={{ p: 2, mt: 1, bgcolor: alpha(theme.palette.grey[500], 0.05) }}>
                                <Typography variant="body2">{activityDetailsDialog.data.notes || activityDetailsDialog.data.settlementNotes || 'No additional notes'}</Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="caption" color="text.secondary">Created By</Typography>
                              <Typography variant="body2" fontWeight={500}>{activityDetailsDialog.data.createdBy || 'System'}</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <Typography variant="caption" color="text.secondary">Assigned To</Typography>
                              <Typography variant="body2" fontWeight={500}>{activityDetailsDialog.data.assignedTo || 'Collections Team'}</Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                )}

                {/* PTP Details */}
                {activityDetailsDialog.type === 'ptp' && (
                  <Grid container spacing={3}>
                    {/* Status Alert */}
                    <Grid item xs={12}>
                      {activityDetailsDialog.data.status === 'Honored' && (
                        <Alert severity="success" icon={<CheckCircleIcon />}>
                          Payment promise honored! Amount of ₹{activityDetailsDialog.data.amount?.toLocaleString('en-IN')} received on {activityDetailsDialog.data.promiseDate}.
                        </Alert>
                      )}
                      {activityDetailsDialog.data.status === 'Pending' && (
                        <Alert severity="warning" icon={<PendingIcon />}>
                          Payment of ₹{activityDetailsDialog.data.amount?.toLocaleString('en-IN')} promised for {activityDetailsDialog.data.promiseDate}.
                          {activityDetailsDialog.data.daysUntilDue !== undefined && ` ${activityDetailsDialog.data.daysUntilDue} day(s) remaining.`}
                        </Alert>
                      )}
                      {activityDetailsDialog.data.status === 'Broken' && (
                        <Alert severity="error" icon={<CancelIcon />}>
                          Payment promise broken. Expected ₹{activityDetailsDialog.data.amount?.toLocaleString('en-IN')} on {activityDetailsDialog.data.promiseDate}. Follow-up required.
                        </Alert>
                      )}
                    </Grid>

                    {/* Promise Summary Card */}
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Promise Summary
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">PTP ID</Typography>
                              <Typography variant="body2" fontWeight={500}>{activityDetailsDialog.data.id}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">Status</Typography>
                              <Chip
                                label={activityDetailsDialog.data.status}
                                size="small"
                                color={activityDetailsDialog.data.status === 'Honored' ? 'success' : activityDetailsDialog.data.status === 'Broken' ? 'error' : 'warning'}
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <Divider sx={{ my: 1 }} />
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="caption" color="text.secondary">Promised Amount</Typography>
                              <Typography variant="h5" fontWeight={600} color="primary.main">
                                ₹{activityDetailsDialog.data.amount?.toLocaleString('en-IN') || 0}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="caption" color="text.secondary">Promise Date</Typography>
                              <Typography variant="h6" fontWeight={600}>
                                {activityDetailsDialog.data.promiseDate}
                              </Typography>
                            </Grid>
                            {activityDetailsDialog.data.daysUntilDue !== undefined && (
                              <Grid item xs={12}>
                                <Typography variant="caption" color="text.secondary">Days Until Due</Typography>
                                <Box sx={{ mt: 0.5 }}>
                                  <Chip
                                    label={`${activityDetailsDialog.data.daysUntilDue} days remaining`}
                                    color={activityDetailsDialog.data.daysUntilDue <= 2 ? 'error' : activityDetailsDialog.data.daysUntilDue <= 5 ? 'warning' : 'success'}
                                    size="small"
                                  />
                                </Box>
                              </Grid>
                            )}
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Account Information Card */}
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Account Information
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          <Grid container spacing={1}>
                            <Grid item xs={12}>
                              <Typography variant="caption" color="text.secondary">Debtor Name</Typography>
                              <Typography variant="body2" fontWeight={500}>{activityDetailsDialog.data.debtorName || debtorData?.name || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Divider sx={{ my: 1 }} />
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="caption" color="text.secondary">Outstanding Balance</Typography>
                              <Typography variant="h6" fontWeight={600}>
                                ₹{activityDetailsDialog.data.outstandingBalance?.toLocaleString('en-IN') || 0}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="caption" color="text.secondary">Assigned Agent</Typography>
                              <Typography variant="body2" fontWeight={500}>
                                {activityDetailsDialog.data.agent || 'Not Assigned'}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="caption" color="text.secondary">Contact</Typography>
                              <Typography variant="body2">{activityDetailsDialog.data.phone || debtorData?.phone || 'N/A'}</Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Timeline Card */}
                    <Grid item xs={12}>
                      <Card variant="outlined" sx={{ bgcolor: alpha(theme.palette.info.main, 0.02) }}>
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Timeline
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <Typography variant="caption" color="text.secondary">PTP Created</Typography>
                              <Typography variant="body2" fontWeight={500}>{activityDetailsDialog.data.createdDate}</Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Typography variant="caption" color="text.secondary">Promise Date</Typography>
                              <Typography variant="body2" fontWeight={500} color="primary.main">{activityDetailsDialog.data.promiseDate}</Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                              <Typography variant="caption" color="text.secondary">Follow-up Date</Typography>
                              <Typography variant="body2" fontWeight={500}>{activityDetailsDialog.data.followUpDate || 'Not scheduled'}</Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Notes Card */}
                    <Grid item xs={12}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Notes & Comments
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          <Paper elevation={0} sx={{ p: 2, bgcolor: alpha(theme.palette.grey[500], 0.05) }}>
                            <Typography variant="body2">{activityDetailsDialog.data.notes || 'No additional notes'}</Typography>
                          </Paper>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                )}

                {/* Hardship Details */}
                {activityDetailsDialog.type === 'hardship' && (
                  <Grid container spacing={3}>
                    {/* Status Alert */}
                    <Grid item xs={12}>
                      {activityDetailsDialog.data.status === 'Approved' && (
                        <Alert severity="success" icon={<CheckCircleIcon />}>
                          Application approved on {activityDetailsDialog.data.approvalDate || 'N/A'} by {activityDetailsDialog.data.approvedBy || 'System'}.
                          Program active from {activityDetailsDialog.data.startDate || 'N/A'} to {activityDetailsDialog.data.endDate || 'N/A'}.
                        </Alert>
                      )}
                      {activityDetailsDialog.data.status === 'Under Review' && (
                        <Alert severity="warning" icon={<PendingIcon />}>
                          Application submitted on {activityDetailsDialog.data.submittedDate || activityDetailsDialog.data.requestDate || 'N/A'}. Under review by compliance team.
                        </Alert>
                      )}
                      {activityDetailsDialog.data.status === 'Rejected' && (
                        <Alert severity="error" icon={<CancelIcon />}>
                          Application rejected on {activityDetailsDialog.data.rejectedDate || 'N/A'}. Reason: {activityDetailsDialog.data.rejectedReason || 'Not specified'}
                        </Alert>
                      )}
                    </Grid>

                    {/* Debtor Information */}
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Debtor Information
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">Name</Typography>
                              <Typography variant="body2" fontWeight={500}>{activityDetailsDialog.data.debtorName || debtorData?.name || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">Account</Typography>
                              <Typography variant="body2" fontWeight={500}>{activityDetailsDialog.data.accountNumber || debtorData?.accountId || 'N/A'}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Divider sx={{ my: 1 }} />
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">Current Debt</Typography>
                              <Typography variant="h6" fontWeight={600}>
                                ₹{(activityDetailsDialog.data.currentDebt || debtorData?.outstandingAmount)?.toLocaleString('en-IN') || 0}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">Hardship Reason</Typography>
                              <Chip label={activityDetailsDialog.data.reason || activityDetailsDialog.data.hardshipReason || 'N/A'} size="small" color="warning" />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Financial Profile */}
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Financial Profile
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">Monthly Income</Typography>
                              <Typography variant="body2" fontWeight={600} color="success.main">
                                ₹{activityDetailsDialog.data.monthlyIncome?.toLocaleString('en-IN') || 0}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="caption" color="text.secondary">Monthly Expenses</Typography>
                              <Typography variant="body2" fontWeight={600} color="error.main">
                                ₹{activityDetailsDialog.data.monthlyExpenses?.toLocaleString('en-IN') || 0}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Divider sx={{ my: 1 }} />
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="caption" color="text.secondary">Disposable Income</Typography>
                              <Typography variant="h6" fontWeight={600} color="primary.main">
                                ₹{(activityDetailsDialog.data.disposableIncome || (activityDetailsDialog.data.monthlyIncome - activityDetailsDialog.data.monthlyExpenses))?.toLocaleString('en-IN') || 0}
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={activityDetailsDialog.data.monthlyIncome ? (((activityDetailsDialog.data.disposableIncome || (activityDetailsDialog.data.monthlyIncome - activityDetailsDialog.data.monthlyExpenses)) || 0) / activityDetailsDialog.data.monthlyIncome) * 100 : 0}
                                sx={{ mt: 1, height: 8, borderRadius: 4 }}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Program Details */}
                    {(activityDetailsDialog.data.status === 'Approved' || activityDetailsDialog.data.status === 'Active') && (
                      <Grid item xs={12}>
                        <Card variant="outlined" sx={{ bgcolor: alpha(theme.palette.success.main, 0.05) }}>
                          <CardContent>
                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                              Program Details
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={3}>
                                <Typography variant="caption" color="text.secondary">Program Type</Typography>
                                <Typography variant="body2" fontWeight={600}>{activityDetailsDialog.data.programType || 'Payment Reduction'}</Typography>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Typography variant="caption" color="text.secondary">Original Payment</Typography>
                                <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                                  ₹{activityDetailsDialog.data.originalPayment?.toLocaleString('en-IN') || 0}/mo
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Typography variant="caption" color="text.secondary">New Payment</Typography>
                                <Typography variant="h6" fontWeight={600} color="success.main">
                                  ₹{((activityDetailsDialog.data.reducedPayment || activityDetailsDialog.data.currentPayment || 0)).toLocaleString('en-IN')}/mo
                                </Typography>
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Typography variant="caption" color="text.secondary">Duration</Typography>
                                <Typography variant="body2" fontWeight={600}>
                                  {activityDetailsDialog.data.duration || 0} months
                                </Typography>
                              </Grid>
                              {activityDetailsDialog.data.status === 'Active' && activityDetailsDialog.data.paymentSchedule && (
                                <Grid item xs={12}>
                                  <Divider sx={{ my: 1 }} />
                                  <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                                    Graduated Payment Schedule
                                  </Typography>
                                  <List dense>
                                    {activityDetailsDialog.data.paymentSchedule.map((schedule, index) => (
                                      <ListItem key={index} sx={{ py: 0.5 }}>
                                        <ListItemText
                                          primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                              <Typography variant="body2">
                                                Month {schedule.month}
                                                {index < (activityDetailsDialog.data.monthsCompleted || 0) && (
                                                  <Chip label="Paid" size="small" color="success" sx={{ ml: 1, height: 20 }} />
                                                )}
                                              </Typography>
                                              <Typography variant="body2" fontWeight={600}>
                                                ₹{schedule.payment?.toLocaleString('en-IN') || 0}
                                              </Typography>
                                            </Box>
                                          }
                                        />
                                      </ListItem>
                                    ))}
                                  </List>
                                </Grid>
                              )}
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    )}

                    {/* Submitted Documents */}
                    <Grid item xs={12}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                            Submitted Documents ({activityDetailsDialog.data.documentsSubmitted || 0})
                          </Typography>
                          <Divider sx={{ mb: 2 }} />
                          <List dense>
                            <ListItem>
                              <ListItemIcon><DescriptionIcon color="primary" /></ListItemIcon>
                              <ListItemText
                                primary="Income Proof"
                                secondary="salary_slips.pdf • 1.2 MB"
                              />
                              <IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton>
                            </ListItem>
                            <ListItem>
                              <ListItemIcon><DescriptionIcon color="primary" /></ListItemIcon>
                              <ListItemText
                                primary="Expense Documentation"
                                secondary="bills_expenses.pdf • 856 KB"
                              />
                              <IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton>
                            </ListItem>
                            {activityDetailsDialog.data.documentsSubmitted > 2 && (
                              <>
                                <ListItem>
                                  <ListItemIcon><DescriptionIcon color="primary" /></ListItemIcon>
                                  <ListItemText
                                    primary="Medical Bills"
                                    secondary="medical_bills.pdf • 2.1 MB"
                                  />
                                  <IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton>
                                </ListItem>
                                <ListItem>
                                  <ListItemIcon><DescriptionIcon color="primary" /></ListItemIcon>
                                  <ListItemText
                                    primary="Hardship Letter"
                                    secondary="hardship_letter.pdf • 245 KB"
                                  />
                                  <IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton>
                                </ListItem>
                              </>
                            )}
                          </List>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={() => setActivityDetailsDialog({ open: false, type: null, data: null })} startIcon={<CloseIcon />}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Tab Navigation */}
        {!isConsolidatedView && (
          <Box sx={{ mb: 3 }}>
            <Tabs
              value={currentTab}
              onChange={(e, newValue) => setCurrentTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  minHeight: 48,
                  borderRadius: 2,
                  mr: 1,
                  '&.Mui-selected': {
                    color: 'primary.main',
                    bgcolor: alpha(theme.palette.primary.main, 0.08)
                  }
                },
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: 2
                }
              }}
            >
              <Tab icon={<InfoIcon />} iconPosition="start" label="Overview" />
              <Tab icon={<MonetizationOnIcon />} iconPosition="start" label="Financial Details" />
              <Tab icon={<WorkIcon />} iconPosition="start" label="Employment & Address" />
              <Tab icon={<SecurityIcon />} iconPosition="start" label="Risk & Compliance" />
              <Tab icon={<TrackChangesIcon />} iconPosition="start" label="Cross-Module Activities" />
              <Tab icon={<ReceiptIcon />} iconPosition="start" label="Payment History" />
              <Tab icon={<MessageIcon />} iconPosition="start" label="Communication Logs" />
              <Tab icon={<TimelineIcon />} iconPosition="start" label="Activity Timeline" />
            </Tabs>
          </Box>
        )}

        {/* Tab Content */}
        {!isConsolidatedView ? (
          <>
            {/* Tab 0: Overview */}
            <TabPanel value={currentTab} index={0}>
              <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <PersonIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>Personal Information</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">Account Number</Typography>
                          <Typography variant="body1" fontWeight={600}>{debtorData.id}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">Full Name</Typography>
                          <Typography variant="body1" fontWeight={600}>{debtorData.name}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">Phone</Typography>
                          <Typography variant="body2">{debtorData.phone}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">Email</Typography>
                          <Typography variant="body2">{debtorData.email}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">Assigned Agent</Typography>
                          <Typography variant="body2">{debtorData.assignedAgent}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Account Status */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <AssignmentIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>Account Status</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">Status</Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip label={debtorData.status} color={getStatusColor(debtorData.status)} />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">Segment</Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip label={debtorData.segment} color={getSegmentColor(debtorData.segment)} />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">Days Past Due</Typography>
                          <Typography variant="h6">{debtorData.dpd} days</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">Charge-off Date</Typography>
                          <Typography variant="body2">{debtorData.chargeOffDate}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* AI Propensity Score */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <SmartToyIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>AI Payment Propensity Score</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                          <Card variant="outlined" sx={{ bgcolor: 'background.default', p: 2, textAlign: 'center' }}>
                            <Chip label={debtorData.propensityLevel} color="success" size="small" sx={{ mb: 2 }} />
                            <Typography variant="h3" fontWeight="bold" color="success.main">
                              {debtorData.propensityScore}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">/ 100</Typography>
                            <LinearProgress
                              variant="determinate"
                              value={debtorData.propensityScore}
                              color="success"
                              sx={{ mt: 2, height: 8, borderRadius: 4 }}
                            />
                          </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Card variant="outlined" sx={{ bgcolor: 'background.default', p: 2, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">Payment Likelihood</Typography>
                            <Typography variant="h4" fontWeight="bold" color="primary.main" sx={{ my: 2 }}>
                              {debtorData.paymentProbability}%
                            </Typography>
                            <Typography variant="body2">
                              High probability of payment
                            </Typography>
                          </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Card variant="outlined" sx={{ bgcolor: 'background.default', p: 2, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">Settlement Likelihood</Typography>
                            <Typography variant="h4" fontWeight="bold" color="warning.main" sx={{ my: 2 }}>
                              {debtorData.settlementProbability}%
                            </Typography>
                            <Typography variant="body2">
                              Moderate settlement chance
                            </Typography>
                          </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Card variant="outlined" sx={{ p: 2, border: '2px solid', borderColor: 'info.main' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <AccessTimeIcon color="info" />
                              <Typography variant="subtitle2" fontWeight="bold">Best Contact Time</Typography>
                            </Box>
                            <Typography>{debtorData.bestContactTime}</Typography>
                          </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Card variant="outlined" sx={{ p: 2, border: '2px solid', borderColor: 'success.main' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <PhoneIcon color="success" />
                              <Typography variant="subtitle2" fontWeight="bold">Preferred Contact Method</Typography>
                            </Box>
                            <Typography>{debtorData.preferredContactMethod}</Typography>
                          </Card>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Contact Numbers */}
                <Grid item xs={12}>
                  <ContactNumbersCard />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Tab 1: Financial Details */}
            <TabPanel value={currentTab} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <MonetizationOnIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>Financial Overview</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" color="text.secondary">Outstanding Balance</Typography>
                          <Typography variant="h6" color="error.main">
                            ₹{debtorData.outstandingBalance.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" color="text.secondary">Original Balance</Typography>
                          <Typography variant="h6">
                            ₹{debtorData.originalBalance.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" color="text.secondary">Debt Type</Typography>
                          <Typography variant="body1">{debtorData.debtType}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" color="text.secondary">Annual Income</Typography>
                          <Typography variant="h6" color="success.main">
                            ₹{debtorData.annualIncome.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" color="text.secondary">Credit Score</Typography>
                          <Chip
                            label={debtorData.creditScore}
                            color={debtorData.creditScore >= 700 ? 'success' : debtorData.creditScore >= 600 ? 'warning' : 'error'}
                            sx={{ mt: 1 }}
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" color="text.secondary">DTI Ratio</Typography>
                          <Typography variant="h6">
                            {(debtorData.dti * 100).toFixed(1)}%
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" color="text.secondary">Interest Rate</Typography>
                          <Typography variant="h6" color="error.main">
                            {debtorData.interestRate}%
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" color="text.secondary">Credit Grade</Typography>
                          <Chip label={debtorData.creditGrade} size="large" />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Collection Progress */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <TrendingUpIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>Collection Progress</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">Amount Recovered</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {((debtorData.originalBalance - debtorData.outstandingBalance) / debtorData.originalBalance * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(debtorData.originalBalance - debtorData.outstandingBalance) / debtorData.originalBalance * 100}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Recovered: ₹{(debtorData.originalBalance - debtorData.outstandingBalance).toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Remaining: ₹{debtorData.outstandingBalance.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Loan Originated Details */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <BusinessIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>Loan Originated Details</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" color="text.secondary">Bank/Institution</Typography>
                          <Typography variant="body1" fontWeight={500}>{debtorData.loanOriginatedBank}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" color="text.secondary">Channel</Typography>
                          <Typography variant="body1">{debtorData.loanOriginatedChannel}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" color="text.secondary">Originated Date</Typography>
                          <Typography variant="body1">{debtorData.loanOriginatedDate}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" color="text.secondary">Product Type</Typography>
                          <Typography variant="body1">{debtorData.loanOriginatedProduct}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">Branch</Typography>
                          <Typography variant="body1">{debtorData.loanOriginatedBranch}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Past Payment History */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <ReceiptIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>Past Payment History</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell><strong>Date</strong></TableCell>
                              <TableCell><strong>Amount</strong></TableCell>
                              <TableCell><strong>Method</strong></TableCell>
                              <TableCell><strong>Status</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {debtorData.payments.map((payment, index) => (
                              <TableRow key={index}>
                                <TableCell>{payment.date}</TableCell>
                                <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                                <TableCell>{payment.method}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={payment.status}
                                    color={payment.status === 'Success' ? 'success' : 'error'}
                                    size="small"
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Past Communication History */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <MessageIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>Past Communication History</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell><strong>Date</strong></TableCell>
                              <TableCell><strong>Type</strong></TableCell>
                              <TableCell><strong>Details</strong></TableCell>
                              <TableCell><strong>Agent/Status</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {debtorData.communications.map((comm) => (
                              <TableRow key={comm.id}>
                                <TableCell>{comm.date}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={comm.type}
                                    size="small"
                                    color={
                                      comm.type === 'Call' ? 'primary' :
                                      comm.type === 'Email' ? 'secondary' :
                                      comm.type === 'SMS' ? 'info' : 'default'
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  {comm.outcome && `Outcome: ${comm.outcome}`}
                                  {comm.duration && ` (${comm.duration})`}
                                  {comm.message && comm.message}
                                  {comm.subject && comm.subject}
                                </TableCell>
                                <TableCell>
                                  {comm.agent || comm.status}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Other Products from Bank/Agency */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <CreditCardIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>Other Products from Bank/Agency</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell><strong>Product Type</strong></TableCell>
                              <TableCell><strong>Product Name</strong></TableCell>
                              <TableCell><strong>Account Number</strong></TableCell>
                              <TableCell><strong>Status</strong></TableCell>
                              <TableCell><strong>Opened Date</strong></TableCell>
                              <TableCell align="right"><strong>Details</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {debtorData.otherProducts.map((product) => (
                              <TableRow key={product.id}>
                                <TableCell>
                                  <Chip label={product.productType} size="small" variant="outlined" />
                                </TableCell>
                                <TableCell>{product.productName}</TableCell>
                                <TableCell>{product.accountNumber}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={product.status}
                                    color={product.status === 'Active' ? 'success' : 'default'}
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>{product.openedDate}</TableCell>
                                <TableCell align="right">
                                  {product.creditLimit && (
                                    <Typography variant="caption" display="block">
                                      Limit: ₹{product.creditLimit.toLocaleString()}
                                    </Typography>
                                  )}
                                  {product.outstandingAmount && (
                                    <Typography variant="caption" display="block" color="error.main">
                                      Outstanding: ₹{product.outstandingAmount.toLocaleString()}
                                    </Typography>
                                  )}
                                  {product.currentBalance && (
                                    <Typography variant="caption" display="block" color="success.main">
                                      Balance: ₹{product.currentBalance.toLocaleString()}
                                    </Typography>
                                  )}
                                  {product.depositAmount && (
                                    <Typography variant="caption" display="block">
                                      Deposit: ₹{product.depositAmount.toLocaleString()}
                                    </Typography>
                                  )}
                                  {product.maturityDate && (
                                    <Typography variant="caption" display="block">
                                      Maturity: {product.maturityDate}
                                    </Typography>
                                  )}
                                  {product.interestRate && (
                                    <Typography variant="caption" display="block">
                                      Interest: {product.interestRate}%
                                    </Typography>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Payment Reconciliation History */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AttachMoneyIcon color="success" />
                          <Typography variant="h6" fontWeight={600}>Payment Reconciliation History</Typography>
                        </Box>
                        <Chip
                          label={`${debtorData.paymentReconciliationRequests.filter(r => r.status === 'Pending').length} Pending`}
                          color="warning"
                          size="small"
                        />
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      {debtorData.paymentReconciliationRequests.length > 0 ? (
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell><strong>Request ID</strong></TableCell>
                                <TableCell><strong>Request Date</strong></TableCell>
                                <TableCell><strong>Payment Date</strong></TableCell>
                                <TableCell><strong>Amount</strong></TableCell>
                                <TableCell><strong>Method</strong></TableCell>
                                <TableCell><strong>Transaction Ref</strong></TableCell>
                                <TableCell><strong>Requested By</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Approval Details</strong></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {debtorData.paymentReconciliationRequests.map((request) => (
                                <TableRow key={request.id}>
                                  <TableCell>
                                    <Typography variant="body2" fontWeight={500}>
                                      {request.id}
                                    </Typography>
                                    {request.proofAttached && (
                                      <Chip
                                        label="Proof Attached"
                                        size="small"
                                        variant="outlined"
                                        color="info"
                                        sx={{ mt: 0.5 }}
                                      />
                                    )}
                                  </TableCell>
                                  <TableCell>{request.requestDate}</TableCell>
                                  <TableCell>{request.paymentDate}</TableCell>
                                  <TableCell>
                                    <Typography variant="body2" fontWeight={600} color="success.main">
                                      ₹{request.amount.toLocaleString()}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip label={request.paymentMethod} size="small" variant="outlined" />
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                      {request.transactionRef}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>{request.requestedBy}</TableCell>
                                  <TableCell>
                                    <Chip
                                      label={request.status}
                                      size="small"
                                      color={
                                        request.status === 'Approved' ? 'success' :
                                        request.status === 'Pending' ? 'warning' : 'error'
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    {request.status === 'Approved' && (
                                      <Box>
                                        <Typography variant="caption" display="block">
                                          Approved by: {request.approvedBy}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          Date: {request.approvalDate}
                                        </Typography>
                                      </Box>
                                    )}
                                    {request.status === 'Pending' && (
                                      <Typography variant="caption" color="warning.main">
                                        Awaiting manager approval
                                      </Typography>
                                    )}
                                    {request.status === 'Rejected' && (
                                      <Box>
                                        <Typography variant="caption" display="block">
                                          Rejected by: {request.approvedBy}
                                        </Typography>
                                        <Typography variant="caption" color="error.main">
                                          Reason: {request.rejectionReason}
                                        </Typography>
                                      </Box>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            No payment reconciliation requests found
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Tab 2: Employment & Address */}
            <TabPanel value={currentTab} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <HomeIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>Address & Household</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">Address</Typography>
                          <Typography variant="body1">{debtorData.address}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">District</Typography>
                          <Typography variant="body1">{debtorData.district}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">ZIP Code</Typography>
                          <Typography variant="body1">{debtorData.zipCode}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">Home Ownership</Typography>
                          <Typography variant="body1">{debtorData.homeOwnership}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">Dependents</Typography>
                          <Typography variant="body1">{debtorData.dependents}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <WorkIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>Employment Information</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">Employer</Typography>
                          <Typography variant="body1">{debtorData.employerName}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">Job Title</Typography>
                          <Typography variant="body1">{debtorData.jobTitle}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">Employment Status</Typography>
                          <Typography variant="body1">{debtorData.employmentStatus}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">Years Employed</Typography>
                          <Typography variant="body1">{debtorData.yearsEmployed} years</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <AccountBalanceIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>Bank Account Details</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Typography variant="caption" color="text.secondary">Bank Name</Typography>
                          <Typography variant="body1">{debtorData.bankName}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="caption" color="text.secondary">Account Number</Typography>
                          <Typography variant="body1">{debtorData.accountNumber}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="caption" color="text.secondary">Routing Number</Typography>
                          <Typography variant="body1">{debtorData.routingNumber}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Family Details */}
                <Grid item xs={12}>
                  <FamilyDetailsCard />
                </Grid>
              </Grid>
            </TabPanel>

            {/* Tab 3: Risk & Compliance */}
            <TabPanel value={currentTab} index={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <SecurityIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>Risk Assessment</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                          <Card variant="outlined" sx={{ p: 2, textAlign: 'center', border: '2px solid', borderColor: 'success.main' }}>
                            <Typography variant="caption">Credit Score</Typography>
                            <Typography variant="h4" fontWeight="bold">{debtorData.creditScore}</Typography>
                            <Chip label="Good" color="success" size="small" sx={{ mt: 1 }} />
                          </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Card variant="outlined" sx={{ p: 2, textAlign: 'center', border: '2px solid', borderColor: 'warning.main' }}>
                            <Typography variant="caption">Days Past Due</Typography>
                            <Typography variant="h4" fontWeight="bold">{debtorData.dpd}</Typography>
                            <Chip label="Moderate Risk" color="warning" size="small" sx={{ mt: 1 }} />
                          </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Card variant="outlined" sx={{ p: 2, textAlign: 'center', border: '2px solid', borderColor: 'info.main' }}>
                            <Typography variant="caption">Debt-to-Income</Typography>
                            <Typography variant="h4" fontWeight="bold">{(debtorData.dti * 100).toFixed(0)}%</Typography>
                            <Chip label="Manageable" color="info" size="small" sx={{ mt: 1 }} />
                          </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Card variant="outlined" sx={{ p: 2, textAlign: 'center', border: '2px solid', borderColor: 'success.main' }}>
                            <Typography variant="caption">Recovery Risk</Typography>
                            <Typography variant="h4" fontWeight="bold">Low</Typography>
                            <Chip label="Favorable" color="success" size="small" sx={{ mt: 1 }} />
                          </Card>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <VerifiedIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>Compliance Status</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleIcon color="success" />
                          </ListItemIcon>
                          <ListItemText
                            primary="KYC Verification"
                            secondary="Completed - All documents verified"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleIcon color="success" />
                          </ListItemIcon>
                          <ListItemText
                            primary="CIBIL Check"
                            secondary="Last updated: 2025-01-01"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleIcon color="success" />
                          </ListItemIcon>
                          <ListItemText
                            primary="FDCPA Compliance"
                            secondary="No violations reported"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <WarningIcon color="warning" />
                          </ListItemIcon>
                          <ListItemText
                            primary="DNC Status"
                            secondary="Not registered on Do Not Call list"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Tab 4: Cross-Module Activities - THE KEY TAB */}
            <TabPanel value={currentTab} index={4}>
              <Grid container spacing={3}>
                {/* Skip Tracing */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOnIcon color="primary" />
                          <Typography variant="h6" fontWeight={600}>Skip Tracing</Typography>
                        </Box>
                        <Chip
                          label={debtorData.skipTracing.status}
                          color={debtorData.skipTracing.status === 'Not Required' ? 'success' : 'warning'}
                          size="small"
                        />
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      {debtorData.skipTracing.status === 'Not Required' ? (
                        <Alert severity="success">No skip tracing required. Contact information is up-to-date.</Alert>
                      ) : (
                        <Typography variant="body2">Skip tracing records would appear here...</Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Contact Numbers for Skip Tracing */}
                <Grid item xs={12}>
                  <ContactNumbersCard />
                </Grid>

                {/* Settlements */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <HandshakeIcon color="primary" />
                          <Typography variant="h6" fontWeight={600}>Settlement Offers</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={`${debtorData.settlements.length} Active`}
                            color="success"
                            size="small"
                          />
                          <Chip
                            label={`Total: ${debtorData.settlements.length}`}
                            color="info"
                            size="small"
                            variant="outlined"
                          />
                          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setQuickActionDialog('settlement')}>
                            Create Settlement
                          </Button>
                        </Box>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Settlement ID</TableCell>
                              <TableCell>Amount</TableCell>
                              <TableCell>Discount</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Email Sent</TableCell>
                              <TableCell>Customer Response</TableCell>
                              <TableCell>Request Date</TableCell>
                              <TableCell align="right">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {debtorData.settlements.map((settlement) => (
                              <TableRow key={settlement.id}>
                                <TableCell>{settlement.id}</TableCell>
                                <TableCell>₹{settlement.amount.toLocaleString()}</TableCell>
                                <TableCell>{settlement.discountPercent}%</TableCell>
                                <TableCell>
                                  <Chip
                                    label={settlement.status}
                                    color={
                                      settlement.status === 'Accepted' ? 'success' :
                                      settlement.status === 'Rejected' ? 'error' :
                                      'warning'
                                    }
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>
                                  {settlement.emailSent ? (
                                    <Tooltip title={`Sent on ${settlement.emailSentDate || settlement.requestDate}`}>
                                      <Chip
                                        icon={<EmailIcon />}
                                        label="Sent"
                                        color="success"
                                        size="small"
                                        variant="outlined"
                                      />
                                    </Tooltip>
                                  ) : (
                                    <Chip label="Not Sent" color="default" size="small" variant="outlined" />
                                  )}
                                </TableCell>
                                <TableCell>
                                  {settlement.customerResponse ? (
                                    <Chip
                                      label={settlement.customerResponse}
                                      color={settlement.customerResponse === 'Accepted' ? 'success' : 'error'}
                                      size="small"
                                    />
                                  ) : settlement.status === 'Pending Approval' ? (
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                      <Tooltip title="Mark as Accepted">
                                        <IconButton
                                          size="small"
                                          color="success"
                                          onClick={() => handleSettlementAcceptance(settlement.id, true)}
                                        >
                                          <CheckCircleIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Mark as Rejected">
                                        <IconButton
                                          size="small"
                                          color="error"
                                          onClick={() => handleSettlementAcceptance(settlement.id, false)}
                                        >
                                          <CancelIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  ) : (
                                    <Typography variant="body2" color="text.secondary">-</Typography>
                                  )}
                                </TableCell>
                                <TableCell>{settlement.requestDate}</TableCell>
                                <TableCell align="right">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => setActivityDetailsDialog({ open: true, type: 'settlement', data: settlement })}
                                    title="View Details"
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Payment Plans */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarTodayIcon color="primary" />
                          <Typography variant="h6" fontWeight={600}>Payment Plans</Typography>
                        </Box>
                        <Chip label={`${debtorData.paymentPlans.length} Active`} color="success" size="small" />
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Plan ID</TableCell>
                              <TableCell>Type</TableCell>
                              <TableCell>EMI Amount</TableCell>
                              <TableCell>Installments</TableCell>
                              <TableCell>Next Due</TableCell>
                              <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {debtorData.paymentPlans.map((plan) => (
                              <TableRow key={plan.id}>
                                <TableCell>{plan.id}</TableCell>
                                <TableCell>{plan.type}</TableCell>
                                <TableCell>₹{plan.amount.toLocaleString()}</TableCell>
                                <TableCell>{plan.installments}</TableCell>
                                <TableCell>{plan.nextDueDate}</TableCell>
                                <TableCell>
                                  <Chip label={plan.status} color="success" size="small" />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* PTP Records */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EventIcon color="primary" />
                          <Typography variant="h6" fontWeight={600}>Promise to Pay (PTP)</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label={`${debtorData.ptpRecords.length} Active`} color="warning" size="small" />
                          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setQuickActionDialog('ptp')}>
                            Create PTP
                          </Button>
                        </Box>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>PTP ID</TableCell>
                              <TableCell>Amount</TableCell>
                              <TableCell>Promise Date</TableCell>
                              <TableCell>Created On</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell align="right">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {debtorData.ptpRecords.map((ptp) => (
                              <TableRow key={ptp.id}>
                                <TableCell>{ptp.id}</TableCell>
                                <TableCell>₹{ptp.amount.toLocaleString()}</TableCell>
                                <TableCell>{ptp.date}</TableCell>
                                <TableCell>{ptp.createdDate}</TableCell>
                                <TableCell>
                                  <Chip label={ptp.status} color="warning" size="small" />
                                </TableCell>
                                <TableCell align="right">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => setActivityDetailsDialog({ open: true, type: 'ptp', data: { ...ptp, promiseDate: ptp.date } })}
                                    title="View Details"
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Hardship Requests */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <VolunteerActivismIcon color="primary" />
                          <Typography variant="h6" fontWeight={600}>Hardship Requests</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label={`${debtorData.hardshipRequests.length} Pending`} color="info" size="small" />
                          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setQuickActionDialog('hardship')}>
                            File Hardship
                          </Button>
                        </Box>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Request ID</TableCell>
                              <TableCell>Reason</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Request Date</TableCell>
                              <TableCell>Documents</TableCell>
                              <TableCell align="right">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {debtorData.hardshipRequests.map((request) => (
                              <TableRow key={request.id}>
                                <TableCell>{request.id}</TableCell>
                                <TableCell>{request.reason}</TableCell>
                                <TableCell>
                                  <Chip label={request.status} color="info" size="small" />
                                </TableCell>
                                <TableCell>{request.requestDate}</TableCell>
                                <TableCell>{request.supportingDocs} files</TableCell>
                                <TableCell align="right">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => setActivityDetailsDialog({ open: true, type: 'hardship', data: { ...request, documents: `${request.supportingDocs} files` } })}
                                    title="View Details"
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Legal Escalation */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <GavelIcon color="primary" />
                          <Typography variant="h6" fontWeight={600}>Legal Escalation</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={debtorData.legalEscalation.status}
                            color={debtorData.legalEscalation.status === 'Not Escalated' ? 'success' : 'error'}
                            size="small"
                          />
                          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setQuickActionDialog('legal')}>
                            Initiate Legal
                          </Button>
                        </Box>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      {debtorData.legalEscalation.status === 'Not Escalated' ? (
                        <Alert severity="success">No legal action initiated. Account is in regular recovery process.</Alert>
                      ) : (
                        <Typography variant="body2">Legal escalation details would appear here...</Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Disputes */}
                {debtorData.disputes.length > 0 && (
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DescriptionIcon color="primary" />
                            <Typography variant="h6" fontWeight={600}>Disputes & Complaints</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip label={`${debtorData.disputes.length} Open`} color="error" size="small" />
                            <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setQuickActionDialog('dispute')}>
                              File Dispute
                            </Button>
                          </Box>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Alert severity="info">No active disputes on record.</Alert>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </TabPanel>

            {/* Tab 5: Payment History */}
            <TabPanel value={currentTab} index={5}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <ReceiptIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>Payment History</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Method</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {debtorData.payments.map((payment, index) => (
                          <TableRow key={index}>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                            <TableCell>{payment.method}</TableCell>
                            <TableCell>
                              <Chip label={payment.status} color="success" size="small" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </TabPanel>

            {/* Tab 6: Communication Logs */}
            <TabPanel value={currentTab} index={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MessageIcon color="primary" />
                      <Typography variant="h6" fontWeight={600}>Communication Logs</Typography>
                    </Box>
                    <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setQuickActionDialog('communication')}>
                      Log Communication
                    </Button>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Details</TableCell>
                          <TableCell>Agent</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {debtorData.communications.map((comm) => (
                          <TableRow key={comm.id}>
                            <TableCell>{comm.date}</TableCell>
                            <TableCell>
                              <Chip
                                icon={
                                  comm.type === 'Call' ? <PhoneIcon /> :
                                  comm.type === 'SMS' ? <SmsIcon /> :
                                  comm.type === 'Email' ? <EmailIcon /> :
                                  <WhatsAppIcon />
                                }
                                label={comm.type}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              {comm.outcome || comm.message || comm.subject}
                              {comm.duration && ` (${comm.duration})`}
                            </TableCell>
                            <TableCell>{comm.agent}</TableCell>
                            <TableCell>
                              <Chip label={comm.status || comm.outcome} color="success" size="small" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </TabPanel>

            {/* Tab 7: Consolidated Activity Timeline & Case Remarks */}
            <TabPanel value={currentTab} index={7}>
              <Grid container spacing={3}>
                {/* Case Remarks Section */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DescriptionIcon color="primary" />
                          <Typography variant="h6" fontWeight={600}>Case Remarks</Typography>
                        </Box>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<AddIcon />}
                          onClick={handleOpenRemarksDialog}
                        >
                          Add Remark
                        </Button>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      {caseRemarks.length === 0 ? (
                        <Alert severity="info">No remarks added yet.</Alert>
                      ) : (
                        <List>
                          {caseRemarks.map((remark) => (
                            <ListItem key={remark.id} alignItems="flex-start" sx={{ bgcolor: remark.category === 'Important' ? alpha(theme.palette.warning.main, 0.05) : 'transparent', borderRadius: 1, mb: 1 }}>
                              <ListItemIcon>
                                <Avatar sx={{ width: 36, height: 36, bgcolor: remark.category === 'Important' ? 'warning.main' : 'primary.main' }}>
                                  <DescriptionIcon fontSize="small" />
                                </Avatar>
                              </ListItemIcon>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                      <Chip label={remark.category} size="small" color={remark.category === 'Important' ? 'warning' : 'default'} />
                                      <Typography variant="caption" color="text.secondary">
                                        {remark.date} at {remark.time}
                                      </Typography>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                      by {remark.user}
                                    </Typography>
                                  </Box>
                                }
                                secondary={
                                  <Typography variant="body2" color="text.primary" sx={{ mt: 0.5 }}>
                                    {remark.remark}
                                  </Typography>
                                }
                              />
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Consolidated Activity Timeline */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <TimelineIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>Consolidated Activity Timeline</Typography>
                        <Chip label={`${debtorData.timeline.length} Activities`} size="small" variant="outlined" />
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <List>
                        {debtorData.timeline.map((activity, index) => (
                          <ListItem key={index} alignItems="flex-start" sx={{ borderLeft: '3px solid', borderColor: activity.status === 'success' ? 'success.main' : activity.status === 'failed' ? 'error.main' : 'warning.main', pl: 2, mb: 2, bgcolor: alpha(theme.palette.primary.main, 0.02), borderRadius: 1 }}>
                            <ListItemIcon>
                              <Avatar sx={{ width: 36, height: 36, bgcolor: activity.status === 'success' ? 'success.main' : activity.status === 'failed' ? 'error.main' : 'warning.main' }}>
                                {activity.category === 'contact' && <PhoneIcon fontSize="small" />}
                                {activity.category === 'payment' && <MonetizationOnIcon fontSize="small" />}
                                {activity.category === 'ptp' && <ScheduleIcon fontSize="small" />}
                                {activity.category === 'settlement' && <HandshakeIcon fontSize="small" />}
                                {activity.category === 'hardship' && <VolunteerActivismIcon fontSize="small" />}
                                {activity.category === 'legal' && <GavelIcon fontSize="small" />}
                                {activity.category === 'dispute' && <InfoIcon fontSize="small" />}
                                {activity.category === 'update' && <TimelineIcon fontSize="small" />}
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                                    <Typography variant="body1" fontWeight={600}>
                                      {activity.action}
                                    </Typography>
                                    <Chip label={activity.module} size="small" color="primary" variant="outlined" />
                                    <Chip
                                      label={activity.status}
                                      size="small"
                                      color={activity.status === 'success' ? 'success' : activity.status === 'failed' ? 'error' : 'warning'}
                                      sx={{ textTransform: 'capitalize' }}
                                    />
                                    {activity.emailContent && (
                                      <Tooltip title={expandedMessages.has(activity.id) ? "Hide email content" : "View email content"}>
                                        <IconButton
                                          size="small"
                                          color="primary"
                                          onClick={() => toggleMessageExpansion(activity.id)}
                                        >
                                          <EmailIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                    {activity.messageContent && activity.action.includes('WhatsApp') && (
                                      <Tooltip title={expandedMessages.has(activity.id) ? "Hide WhatsApp message" : "View WhatsApp message"}>
                                        <IconButton
                                          size="small"
                                          color="success"
                                          onClick={() => toggleMessageExpansion(activity.id)}
                                        >
                                          <WhatsAppIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                    {activity.messageContent && activity.action.includes('Line') && (
                                      <Tooltip title={expandedMessages.has(activity.id) ? "Hide Line message" : "View Line message"}>
                                        <IconButton
                                          size="small"
                                          color="info"
                                          onClick={() => toggleMessageExpansion(activity.id)}
                                        >
                                          <MessageIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    )}
                                    {activity.attachments && activity.attachments.length > 0 && (
                                      <Chip
                                        icon={<AttachFileIcon />}
                                        label={`${activity.attachments.length} ${activity.attachments.length === 1 ? 'file' : 'files'}`}
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                      />
                                    )}
                                  </Box>
                                  <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                    {activity.date} {activity.time}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <>
                                  <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
                                    {activity.details}
                                  </Typography>

                                  {/* Email Content Display */}
                                  {activity.emailContent && expandedMessages.has(activity.id) && (
                                    <Paper elevation={0} sx={{ p: 2, mt: 1, mb: 1, bgcolor: alpha(theme.palette.grey[500], 0.05), border: '1px solid', borderColor: 'divider' }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <EmailIcon fontSize="small" color="primary" />
                                        <Typography variant="subtitle2" fontWeight={600}>
                                          {activity.subject || 'Email Content'}
                                        </Typography>
                                      </Box>
                                      {activity.recipient && (
                                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                          To: {activity.recipient}
                                        </Typography>
                                      )}
                                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line', fontFamily: 'monospace', fontSize: '0.85rem', color: 'text.secondary' }}>
                                        {activity.emailContent}
                                      </Typography>
                                    </Paper>
                                  )}

                                  {/* WhatsApp Message Content Display */}
                                  {activity.messageContent && activity.action.includes('WhatsApp') && expandedMessages.has(activity.id) && (
                                    <Paper elevation={0} sx={{ p: 2, mt: 1, mb: 1, bgcolor: alpha(theme.palette.success.main, 0.03), border: '1px solid', borderColor: 'success.light' }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <WhatsAppIcon fontSize="small" color="success" />
                                        <Typography variant="subtitle2" fontWeight={600}>
                                          WhatsApp Message
                                        </Typography>
                                      </Box>
                                      {activity.recipient && (
                                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                          To: {activity.recipient}
                                        </Typography>
                                      )}
                                      {activity.readStatus && (
                                        <Box sx={{ mb: 1 }}>
                                          <Chip
                                            label={`${activity.readStatus}${activity.readTime ? ` at ${activity.readTime}` : activity.deliveredTime ? ` at ${activity.deliveredTime}` : ''}`}
                                            size="small"
                                            color={activity.readStatus === 'Read' ? 'success' : 'default'}
                                            variant="outlined"
                                          />
                                        </Box>
                                      )}
                                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line', fontFamily: 'monospace', fontSize: '0.85rem', color: 'text.secondary' }}>
                                        {activity.messageContent}
                                      </Typography>
                                    </Paper>
                                  )}

                                  {/* Line Message Content Display */}
                                  {activity.messageContent && activity.action.includes('Line') && expandedMessages.has(activity.id) && (
                                    <Paper elevation={0} sx={{ p: 2, mt: 1, mb: 1, bgcolor: alpha(theme.palette.info.main, 0.03), border: '1px solid', borderColor: 'info.light' }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                        <MessageIcon fontSize="small" color="info" />
                                        <Typography variant="subtitle2" fontWeight={600}>
                                          Line Message
                                        </Typography>
                                      </Box>
                                      {activity.recipient && (
                                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                          To: {activity.recipient}
                                        </Typography>
                                      )}
                                      {activity.readStatus && (
                                        <Box sx={{ mb: 1 }}>
                                          <Chip
                                            label={`${activity.readStatus}${activity.readTime ? ` at ${activity.readTime}` : ''}`}
                                            size="small"
                                            color={activity.readStatus === 'Read' ? 'info' : 'default'}
                                            variant="outlined"
                                          />
                                        </Box>
                                      )}
                                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line', fontFamily: 'monospace', fontSize: '0.85rem', color: 'text.secondary' }}>
                                        {activity.messageContent}
                                      </Typography>
                                    </Paper>
                                  )}

                                  {/* Legal Document Attachments Display */}
                                  {activity.attachments && activity.attachments.length > 0 && (
                                    <Paper elevation={0} sx={{ p: 2, mt: 1, mb: 1, bgcolor: alpha(theme.palette.secondary.main, 0.03), border: '1px solid', borderColor: 'secondary.light' }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                        <AttachFileIcon fontSize="small" color="secondary" />
                                        <Typography variant="subtitle2" fontWeight={600}>
                                          Attached Documents ({activity.attachments.length})
                                        </Typography>
                                      </Box>
                                      <Stack spacing={1}>
                                        {activity.attachments.map((doc) => (
                                          <Paper key={doc.id} elevation={0} sx={{ p: 1.5, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                                                <DescriptionIcon fontSize="small" color="action" />
                                                <Box>
                                                  <Typography variant="body2" fontWeight={600}>
                                                    {doc.name}
                                                  </Typography>
                                                  <Typography variant="caption" color="text.secondary">
                                                    {doc.description} • {doc.size} • Uploaded: {doc.uploadDate} {doc.uploadTime}
                                                  </Typography>
                                                </Box>
                                              </Box>
                                              <Button
                                                size="small"
                                                startIcon={<VisibilityIcon />}
                                                sx={{ minWidth: 'auto', whiteSpace: 'nowrap' }}
                                              >
                                                View
                                              </Button>
                                            </Box>
                                          </Paper>
                                        ))}
                                      </Stack>
                                    </Paper>
                                  )}

                                  {/* Customer Reply for Email/WhatsApp/Line */}
                                  {activity.customerReply && (
                                    <Paper elevation={0} sx={{ p: 2, mt: 1, mb: 1, bgcolor: alpha(theme.palette.success.main, 0.05), border: '2px solid', borderColor: activity.replyStatus === 'Accepted' ? 'success.main' : 'error.main' }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <CallMadeIcon fontSize="small" color={activity.replyStatus === 'Accepted' ? 'success' : 'error'} />
                                          <Typography variant="subtitle2" fontWeight={600}>
                                            Customer Response
                                          </Typography>
                                        </Box>
                                        <Chip
                                          label={activity.replyStatus}
                                          size="small"
                                          color={activity.replyStatus === 'Accepted' ? 'success' : 'error'}
                                        />
                                      </Box>
                                      <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                                        Replied on: {activity.replyDate} {activity.replyTime}
                                      </Typography>
                                      <Typography variant="body2" sx={{ whiteSpace: 'pre-line', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                        {activity.customerReply}
                                      </Typography>
                                    </Paper>
                                  )}
                                  <Typography variant="caption" color="text.secondary" fontWeight={500}>
                                    by {activity.user}
                                  </Typography>
                                </>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
          </>
        ) : (
          // Consolidated View - Show all content at once
          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                <strong>Consolidated View:</strong> All debtor information displayed in a single scrollable view
              </Typography>
            </Alert>

            {/* SECTION 1: OVERVIEW */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <InfoIcon color="primary" />
                Overview
              </Typography>

              <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <PersonIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>Personal Information</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">Account Number</Typography>
                          <Typography variant="body1" fontWeight={600}>{debtorData.id}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">Full Name</Typography>
                          <Typography variant="body1" fontWeight={600}>{debtorData.name}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">Phone</Typography>
                          <Typography variant="body2">{debtorData.phone}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">Email</Typography>
                          <Typography variant="body2">{debtorData.email}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">Assigned Agent</Typography>
                          <Typography variant="body2">{debtorData.assignedAgent}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Account Status */}
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <AssignmentIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>Account Status</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">Status</Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip label={debtorData.status} color={getStatusColor(debtorData.status)} />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">Segment</Typography>
                          <Box sx={{ mt: 1 }}>
                            <Chip label={debtorData.segment} color={getSegmentColor(debtorData.segment)} />
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">Days Past Due</Typography>
                          <Typography variant="h6">{debtorData.dpd} days</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">Charge-off Date</Typography>
                          <Typography variant="body2">{debtorData.chargeOffDate}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* AI Propensity Score */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <SmartToyIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>AI Payment Propensity Score</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                          <Card variant="outlined" sx={{ bgcolor: 'background.default', p: 2, textAlign: 'center' }}>
                            <Chip label={debtorData.propensityLevel} color="success" size="small" sx={{ mb: 2 }} />
                            <Typography variant="h3" fontWeight="bold" color="success.main">
                              {debtorData.propensityScore}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">/ 100</Typography>
                            <LinearProgress
                              variant="determinate"
                              value={debtorData.propensityScore}
                              color="success"
                              sx={{ mt: 2, height: 8, borderRadius: 4 }}
                            />
                          </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Card variant="outlined" sx={{ bgcolor: 'background.default', p: 2, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">Payment Likelihood</Typography>
                            <Typography variant="h4" fontWeight="bold" color="primary.main" sx={{ my: 2 }}>
                              {debtorData.paymentProbability}%
                            </Typography>
                            <Typography variant="body2">High probability of payment</Typography>
                          </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Card variant="outlined" sx={{ bgcolor: 'background.default', p: 2, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary">Settlement Likelihood</Typography>
                            <Typography variant="h4" fontWeight="bold" color="warning.main" sx={{ my: 2 }}>
                              {debtorData.settlementProbability}%
                            </Typography>
                            <Typography variant="body2">Moderate settlement chance</Typography>
                          </Card>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Contact Numbers */}
                <Grid item xs={12}>
                  <ContactNumbersCard />
                </Grid>
              </Grid>
            </Paper>

            {/* SECTION 2: FINANCIAL DETAILS */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <MonetizationOnIcon color="primary" />
                Financial Details
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} gutterBottom>Financial Overview</Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" color="text.secondary">Outstanding Balance</Typography>
                          <Typography variant="h6" color="error.main">
                            ₹{debtorData.outstandingBalance.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" color="text.secondary">Original Balance</Typography>
                          <Typography variant="h6">
                            ₹{debtorData.originalBalance.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" color="text.secondary">Debt Type</Typography>
                          <Typography variant="body1">{debtorData.debtType}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" color="text.secondary">Annual Income</Typography>
                          <Typography variant="h6" color="success.main">
                            ₹{debtorData.annualIncome.toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" color="text.secondary">Credit Score</Typography>
                          <Chip
                            label={debtorData.creditScore}
                            color={debtorData.creditScore >= 700 ? 'success' : debtorData.creditScore >= 600 ? 'warning' : 'error'}
                            sx={{ mt: 1 }}
                          />
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" color="text.secondary">DTI Ratio</Typography>
                          <Typography variant="h6">
                            {(debtorData.dti * 100).toFixed(1)}%
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" color="text.secondary">Interest Rate</Typography>
                          <Typography variant="h6" color="error.main">
                            {debtorData.interestRate}%
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" color="text.secondary">Credit Grade</Typography>
                          <Chip label={debtorData.creditGrade} size="large" />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} gutterBottom>Collection Progress</Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">Amount Recovered</Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {((debtorData.originalBalance - debtorData.outstandingBalance) / debtorData.originalBalance * 100).toFixed(1)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(debtorData.originalBalance - debtorData.outstandingBalance) / debtorData.originalBalance * 100}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Recovered: ₹{(debtorData.originalBalance - debtorData.outstandingBalance).toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Remaining: ₹{debtorData.outstandingBalance.toLocaleString()}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Loan Originated Details */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <BusinessIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>Loan Originated Details</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" color="text.secondary">Bank/Institution</Typography>
                          <Typography variant="body1" fontWeight={500}>{debtorData.loanOriginatedBank}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" color="text.secondary">Channel</Typography>
                          <Typography variant="body1">{debtorData.loanOriginatedChannel}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" color="text.secondary">Originated Date</Typography>
                          <Typography variant="body1">{debtorData.loanOriginatedDate}</Typography>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Typography variant="caption" color="text.secondary">Product Type</Typography>
                          <Typography variant="body1">{debtorData.loanOriginatedProduct}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">Branch</Typography>
                          <Typography variant="body1">{debtorData.loanOriginatedBranch}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Past Payment History */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <ReceiptIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>Past Payment History</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell><strong>Date</strong></TableCell>
                              <TableCell><strong>Amount</strong></TableCell>
                              <TableCell><strong>Method</strong></TableCell>
                              <TableCell><strong>Status</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {debtorData.payments.map((payment, index) => (
                              <TableRow key={index}>
                                <TableCell>{payment.date}</TableCell>
                                <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                                <TableCell>{payment.method}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={payment.status}
                                    color={payment.status === 'Success' ? 'success' : 'error'}
                                    size="small"
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Past Communication History */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <MessageIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>Past Communication History</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell><strong>Date</strong></TableCell>
                              <TableCell><strong>Type</strong></TableCell>
                              <TableCell><strong>Details</strong></TableCell>
                              <TableCell><strong>Agent/Status</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {debtorData.communications.map((comm) => (
                              <TableRow key={comm.id}>
                                <TableCell>{comm.date}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={comm.type}
                                    size="small"
                                    color={
                                      comm.type === 'Call' ? 'primary' :
                                      comm.type === 'Email' ? 'secondary' :
                                      comm.type === 'SMS' ? 'info' : 'default'
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  {comm.outcome && `Outcome: ${comm.outcome}`}
                                  {comm.duration && ` (${comm.duration})`}
                                  {comm.message && comm.message}
                                  {comm.subject && comm.subject}
                                </TableCell>
                                <TableCell>
                                  {comm.agent || comm.status}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Other Products from Bank/Agency */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <CreditCardIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>Other Products from Bank/Agency</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell><strong>Product Type</strong></TableCell>
                              <TableCell><strong>Product Name</strong></TableCell>
                              <TableCell><strong>Account Number</strong></TableCell>
                              <TableCell><strong>Status</strong></TableCell>
                              <TableCell><strong>Opened Date</strong></TableCell>
                              <TableCell align="right"><strong>Details</strong></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {debtorData.otherProducts.map((product) => (
                              <TableRow key={product.id}>
                                <TableCell>
                                  <Chip label={product.productType} size="small" variant="outlined" />
                                </TableCell>
                                <TableCell>{product.productName}</TableCell>
                                <TableCell>{product.accountNumber}</TableCell>
                                <TableCell>
                                  <Chip
                                    label={product.status}
                                    color={product.status === 'Active' ? 'success' : 'default'}
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>{product.openedDate}</TableCell>
                                <TableCell align="right">
                                  {product.creditLimit && (
                                    <Typography variant="caption" display="block">
                                      Limit: ₹{product.creditLimit.toLocaleString()}
                                    </Typography>
                                  )}
                                  {product.outstandingAmount && (
                                    <Typography variant="caption" display="block" color="error.main">
                                      Outstanding: ₹{product.outstandingAmount.toLocaleString()}
                                    </Typography>
                                  )}
                                  {product.currentBalance && (
                                    <Typography variant="caption" display="block" color="success.main">
                                      Balance: ₹{product.currentBalance.toLocaleString()}
                                    </Typography>
                                  )}
                                  {product.depositAmount && (
                                    <Typography variant="caption" display="block">
                                      Deposit: ₹{product.depositAmount.toLocaleString()}
                                    </Typography>
                                  )}
                                  {product.maturityDate && (
                                    <Typography variant="caption" display="block">
                                      Maturity: {product.maturityDate}
                                    </Typography>
                                  )}
                                  {product.interestRate && (
                                    <Typography variant="caption" display="block">
                                      Interest: {product.interestRate}%
                                    </Typography>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Payment Reconciliation History */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AttachMoneyIcon color="success" />
                          <Typography variant="h6" fontWeight={600}>Payment Reconciliation History</Typography>
                        </Box>
                        <Chip
                          label={`${debtorData.paymentReconciliationRequests.filter(r => r.status === 'Pending').length} Pending`}
                          color="warning"
                          size="small"
                        />
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      {debtorData.paymentReconciliationRequests.length > 0 ? (
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell><strong>Request ID</strong></TableCell>
                                <TableCell><strong>Request Date</strong></TableCell>
                                <TableCell><strong>Payment Date</strong></TableCell>
                                <TableCell><strong>Amount</strong></TableCell>
                                <TableCell><strong>Method</strong></TableCell>
                                <TableCell><strong>Transaction Ref</strong></TableCell>
                                <TableCell><strong>Requested By</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Approval Details</strong></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {debtorData.paymentReconciliationRequests.map((request) => (
                                <TableRow key={request.id}>
                                  <TableCell>
                                    <Typography variant="body2" fontWeight={500}>
                                      {request.id}
                                    </Typography>
                                    {request.proofAttached && (
                                      <Chip
                                        label="Proof Attached"
                                        size="small"
                                        variant="outlined"
                                        color="info"
                                        sx={{ mt: 0.5 }}
                                      />
                                    )}
                                  </TableCell>
                                  <TableCell>{request.requestDate}</TableCell>
                                  <TableCell>{request.paymentDate}</TableCell>
                                  <TableCell>
                                    <Typography variant="body2" fontWeight={600} color="success.main">
                                      ₹{request.amount.toLocaleString()}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip label={request.paymentMethod} size="small" variant="outlined" />
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                      {request.transactionRef}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>{request.requestedBy}</TableCell>
                                  <TableCell>
                                    <Chip
                                      label={request.status}
                                      size="small"
                                      color={
                                        request.status === 'Approved' ? 'success' :
                                        request.status === 'Pending' ? 'warning' : 'error'
                                      }
                                    />
                                  </TableCell>
                                  <TableCell>
                                    {request.status === 'Approved' && (
                                      <Box>
                                        <Typography variant="caption" display="block">
                                          Approved by: {request.approvedBy}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          Date: {request.approvalDate}
                                        </Typography>
                                      </Box>
                                    )}
                                    {request.status === 'Pending' && (
                                      <Typography variant="caption" color="warning.main">
                                        Awaiting manager approval
                                      </Typography>
                                    )}
                                    {request.status === 'Rejected' && (
                                      <Box>
                                        <Typography variant="caption" display="block">
                                          Rejected by: {request.approvedBy}
                                        </Typography>
                                        <Typography variant="caption" color="error.main">
                                          Reason: {request.rejectionReason}
                                        </Typography>
                                      </Box>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body2" color="text.secondary">
                            No payment reconciliation requests found
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>

            {/* SECTION 3: EMPLOYMENT & ADDRESS */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <WorkIcon color="primary" />
                Employment & Address
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <HomeIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>Address & Household</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">Address</Typography>
                          <Typography variant="body1">{debtorData.address}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">District</Typography>
                          <Typography variant="body1">{debtorData.district}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">ZIP Code</Typography>
                          <Typography variant="body1">{debtorData.zipCode}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">Home Ownership</Typography>
                          <Typography variant="body1">{debtorData.homeOwnership}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">Dependents</Typography>
                          <Typography variant="body1">{debtorData.dependents}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <WorkIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>Employment Information</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">Employer</Typography>
                          <Typography variant="body1">{debtorData.employerName}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">Job Title</Typography>
                          <Typography variant="body1">{debtorData.jobTitle}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">Employment Status</Typography>
                          <Typography variant="body1">{debtorData.employmentStatus}</Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="caption" color="text.secondary">Years Employed</Typography>
                          <Typography variant="body1">{debtorData.yearsEmployed} years</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <AccountBalanceIcon color="primary" />
                        <Typography variant="h6" fontWeight={600}>Bank Account Details</Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                          <Typography variant="caption" color="text.secondary">Bank Name</Typography>
                          <Typography variant="body1">{debtorData.bankName}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="caption" color="text.secondary">Account Number</Typography>
                          <Typography variant="body1">{debtorData.accountNumber}</Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                          <Typography variant="caption" color="text.secondary">Routing Number</Typography>
                          <Typography variant="body1">{debtorData.routingNumber}</Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Family Details */}
                <Grid item xs={12}>
                  <FamilyDetailsCard />
                </Grid>
              </Grid>
            </Paper>

            {/* SECTION 4: RISK & COMPLIANCE */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <SecurityIcon color="primary" />
                Risk & Compliance
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} gutterBottom>Risk Assessment</Typography>
                      <Divider sx={{ mb: 2 }} />
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                          <Card variant="outlined" sx={{ p: 2, textAlign: 'center', border: '2px solid', borderColor: 'success.main' }}>
                            <Typography variant="caption">Credit Score</Typography>
                            <Typography variant="h4" fontWeight="bold">{debtorData.creditScore}</Typography>
                            <Chip label="Good" color="success" size="small" sx={{ mt: 1 }} />
                          </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Card variant="outlined" sx={{ p: 2, textAlign: 'center', border: '2px solid', borderColor: 'warning.main' }}>
                            <Typography variant="caption">Days Past Due</Typography>
                            <Typography variant="h4" fontWeight="bold">{debtorData.dpd}</Typography>
                            <Chip label="Moderate Risk" color="warning" size="small" sx={{ mt: 1 }} />
                          </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Card variant="outlined" sx={{ p: 2, textAlign: 'center', border: '2px solid', borderColor: 'info.main' }}>
                            <Typography variant="caption">Debt-to-Income</Typography>
                            <Typography variant="h4" fontWeight="bold">{(debtorData.dti * 100).toFixed(0)}%</Typography>
                            <Chip label="Manageable" color="info" size="small" sx={{ mt: 1 }} />
                          </Card>
                        </Grid>
                        <Grid item xs={12} md={3}>
                          <Card variant="outlined" sx={{ p: 2, textAlign: 'center', border: '2px solid', borderColor: 'success.main' }}>
                            <Typography variant="caption">Recovery Risk</Typography>
                            <Typography variant="h4" fontWeight="bold">Low</Typography>
                            <Chip label="Favorable" color="success" size="small" sx={{ mt: 1 }} />
                          </Card>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight={600} gutterBottom>Compliance Status</Typography>
                      <Divider sx={{ mb: 2 }} />
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleIcon color="success" />
                          </ListItemIcon>
                          <ListItemText
                            primary="KYC Verification"
                            secondary="Completed - All documents verified"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleIcon color="success" />
                          </ListItemIcon>
                          <ListItemText
                            primary="CIBIL Check"
                            secondary="Last updated: 2025-01-01"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircleIcon color="success" />
                          </ListItemIcon>
                          <ListItemText
                            primary="FDCPA Compliance"
                            secondary="No violations reported"
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <WarningIcon color="warning" />
                          </ListItemIcon>
                          <ListItemText
                            primary="DNC Status"
                            secondary="Not registered on Do Not Call list"
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Paper>

            {/* SECTION 5: CROSS-MODULE ACTIVITIES - THE KEY SECTION */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <TrackChangesIcon color="primary" />
                Cross-Module Activities
              </Typography>

              <Grid container spacing={3}>
                {/* Skip Tracing */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationOnIcon color="primary" />
                          <Typography variant="h6" fontWeight={600}>Skip Tracing</Typography>
                        </Box>
                        <Chip
                          label={debtorData.skipTracing.status}
                          color={debtorData.skipTracing.status === 'Not Required' ? 'success' : 'warning'}
                          size="small"
                        />
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      {debtorData.skipTracing.status === 'Not Required' ? (
                        <Alert severity="success">No skip tracing required. Contact information is up-to-date.</Alert>
                      ) : (
                        <Typography variant="body2">Skip tracing records would appear here...</Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Contact Numbers for Skip Tracing */}
                <Grid item xs={12}>
                  <ContactNumbersCard />
                </Grid>

                {/* Settlements */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <HandshakeIcon color="primary" />
                          <Typography variant="h6" fontWeight={600}>Settlement Offers</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={`${debtorData.settlements.length} Active`}
                            color="success"
                            size="small"
                          />
                          <Chip
                            label={`Total: ${debtorData.settlements.length}`}
                            color="info"
                            size="small"
                            variant="outlined"
                          />
                          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setQuickActionDialog('settlement')}>
                            Create Settlement
                          </Button>
                        </Box>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Settlement ID</TableCell>
                              <TableCell>Amount</TableCell>
                              <TableCell>Discount</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Email Sent</TableCell>
                              <TableCell>Customer Response</TableCell>
                              <TableCell>Request Date</TableCell>
                              <TableCell align="right">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {debtorData.settlements.map((settlement) => (
                              <TableRow key={settlement.id}>
                                <TableCell>{settlement.id}</TableCell>
                                <TableCell>₹{settlement.amount.toLocaleString()}</TableCell>
                                <TableCell>{settlement.discountPercent}%</TableCell>
                                <TableCell>
                                  <Chip
                                    label={settlement.status}
                                    color={
                                      settlement.status === 'Accepted' ? 'success' :
                                      settlement.status === 'Rejected' ? 'error' :
                                      'warning'
                                    }
                                    size="small"
                                  />
                                </TableCell>
                                <TableCell>
                                  {settlement.emailSent ? (
                                    <Tooltip title={`Sent on ${settlement.emailSentDate || settlement.requestDate}`}>
                                      <Chip
                                        icon={<EmailIcon />}
                                        label="Sent"
                                        color="success"
                                        size="small"
                                        variant="outlined"
                                      />
                                    </Tooltip>
                                  ) : (
                                    <Chip label="Not Sent" color="default" size="small" variant="outlined" />
                                  )}
                                </TableCell>
                                <TableCell>
                                  {settlement.customerResponse ? (
                                    <Chip
                                      label={settlement.customerResponse}
                                      color={settlement.customerResponse === 'Accepted' ? 'success' : 'error'}
                                      size="small"
                                    />
                                  ) : settlement.status === 'Pending Approval' ? (
                                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                                      <Tooltip title="Mark as Accepted">
                                        <IconButton
                                          size="small"
                                          color="success"
                                          onClick={() => handleSettlementAcceptance(settlement.id, true)}
                                        >
                                          <CheckCircleIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                      <Tooltip title="Mark as Rejected">
                                        <IconButton
                                          size="small"
                                          color="error"
                                          onClick={() => handleSettlementAcceptance(settlement.id, false)}
                                        >
                                          <CancelIcon fontSize="small" />
                                        </IconButton>
                                      </Tooltip>
                                    </Box>
                                  ) : (
                                    <Typography variant="body2" color="text.secondary">-</Typography>
                                  )}
                                </TableCell>
                                <TableCell>{settlement.requestDate}</TableCell>
                                <TableCell align="right">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => setActivityDetailsDialog({ open: true, type: 'settlement', data: settlement })}
                                    title="View Details"
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Payment Plans */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarTodayIcon color="primary" />
                          <Typography variant="h6" fontWeight={600}>Payment Plans</Typography>
                        </Box>
                        <Chip label={`${debtorData.paymentPlans.length} Active`} color="success" size="small" />
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Plan ID</TableCell>
                              <TableCell>Type</TableCell>
                              <TableCell>EMI Amount</TableCell>
                              <TableCell>Installments</TableCell>
                              <TableCell>Next Due</TableCell>
                              <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {debtorData.paymentPlans.map((plan) => (
                              <TableRow key={plan.id}>
                                <TableCell>{plan.id}</TableCell>
                                <TableCell>{plan.type}</TableCell>
                                <TableCell>₹{plan.amount.toLocaleString()}</TableCell>
                                <TableCell>{plan.installments}</TableCell>
                                <TableCell>{plan.nextDueDate}</TableCell>
                                <TableCell>
                                  <Chip label={plan.status} color="success" size="small" />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* PTP Records */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EventIcon color="primary" />
                          <Typography variant="h6" fontWeight={600}>Promise to Pay (PTP)</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label={`${debtorData.ptpRecords.length} Active`} color="warning" size="small" />
                          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setQuickActionDialog('ptp')}>
                            Create PTP
                          </Button>
                        </Box>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>PTP ID</TableCell>
                              <TableCell>Amount</TableCell>
                              <TableCell>Promise Date</TableCell>
                              <TableCell>Created On</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell align="right">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {debtorData.ptpRecords.map((ptp) => (
                              <TableRow key={ptp.id}>
                                <TableCell>{ptp.id}</TableCell>
                                <TableCell>₹{ptp.amount.toLocaleString()}</TableCell>
                                <TableCell>{ptp.date}</TableCell>
                                <TableCell>{ptp.createdDate}</TableCell>
                                <TableCell>
                                  <Chip label={ptp.status} color="warning" size="small" />
                                </TableCell>
                                <TableCell align="right">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => setActivityDetailsDialog({ open: true, type: 'ptp', data: { ...ptp, promiseDate: ptp.date } })}
                                    title="View Details"
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Hardship Requests */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <VolunteerActivismIcon color="primary" />
                          <Typography variant="h6" fontWeight={600}>Hardship Requests</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip label={`${debtorData.hardshipRequests.length} Pending`} color="info" size="small" />
                          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setQuickActionDialog('hardship')}>
                            File Hardship
                          </Button>
                        </Box>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Request ID</TableCell>
                              <TableCell>Reason</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell>Request Date</TableCell>
                              <TableCell>Documents</TableCell>
                              <TableCell align="right">Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {debtorData.hardshipRequests.map((request) => (
                              <TableRow key={request.id}>
                                <TableCell>{request.id}</TableCell>
                                <TableCell>{request.reason}</TableCell>
                                <TableCell>
                                  <Chip label={request.status} color="info" size="small" />
                                </TableCell>
                                <TableCell>{request.requestDate}</TableCell>
                                <TableCell>{request.supportingDocs} files</TableCell>
                                <TableCell align="right">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => setActivityDetailsDialog({ open: true, type: 'hardship', data: { ...request, documents: `${request.supportingDocs} files` } })}
                                    title="View Details"
                                  >
                                    <VisibilityIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Legal Escalation */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <GavelIcon color="primary" />
                          <Typography variant="h6" fontWeight={600}>Legal Escalation</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={debtorData.legalEscalation.status}
                            color={debtorData.legalEscalation.status === 'Not Escalated' ? 'success' : 'error'}
                            size="small"
                          />
                          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setQuickActionDialog('legal')}>
                            Initiate Legal
                          </Button>
                        </Box>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      {debtorData.legalEscalation.status === 'Not Escalated' ? (
                        <Alert severity="success">No legal action initiated. Account is in regular recovery process.</Alert>
                      ) : (
                        <Typography variant="body2">Legal escalation details would appear here...</Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Disputes */}
                {debtorData.disputes.length === 0 && (
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <DescriptionIcon color="primary" />
                          <Typography variant="h6" fontWeight={600}>Disputes & Complaints</Typography>
                        </Box>
                        <Divider sx={{ mb: 2 }} />
                        <Alert severity="info">No active disputes on record.</Alert>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </Paper>

            {/* SECTION 6: PAYMENT HISTORY */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <ReceiptIcon color="primary" />
                Payment History
              </Typography>

              <Card>
                <CardContent>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Method</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {debtorData.payments.map((payment, index) => (
                          <TableRow key={index}>
                            <TableCell>{payment.date}</TableCell>
                            <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                            <TableCell>{payment.method}</TableCell>
                            <TableCell>
                              <Chip label={payment.status} color="success" size="small" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Paper>

            {/* SECTION 7: COMMUNICATION LOGS */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <MessageIcon color="primary" />
                Communication Logs
              </Typography>

              <Card>
                <CardContent>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Details</TableCell>
                          <TableCell>Agent</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {debtorData.communications.map((comm) => (
                          <TableRow key={comm.id}>
                            <TableCell>{comm.date}</TableCell>
                            <TableCell>
                              <Chip
                                icon={
                                  comm.type === 'Call' ? <PhoneIcon /> :
                                  comm.type === 'SMS' ? <SmsIcon /> :
                                  comm.type === 'Email' ? <EmailIcon /> :
                                  <WhatsAppIcon />
                                }
                                label={comm.type}
                                size="small"
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell>
                              {comm.outcome || comm.message || comm.subject}
                              {comm.duration && ` (${comm.duration})`}
                            </TableCell>
                            <TableCell>{comm.agent}</TableCell>
                            <TableCell>
                              <Chip label={comm.status || comm.outcome} color="success" size="small" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Paper>

            {/* SECTION 8: CASE REMARKS */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DescriptionIcon color="primary" />
                  Case Remarks
                </Typography>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={handleOpenRemarksDialog}
                >
                  Add Remark
                </Button>
              </Box>

              {caseRemarks.length === 0 ? (
                <Alert severity="info">No remarks added yet.</Alert>
              ) : (
                <List>
                  {caseRemarks.map((remark) => (
                    <ListItem key={remark.id} alignItems="flex-start" sx={{ bgcolor: remark.category === 'Important' ? alpha(theme.palette.warning.main, 0.05) : 'transparent', borderRadius: 1, mb: 1, border: '1px solid', borderColor: 'divider' }}>
                      <ListItemIcon>
                        <Avatar sx={{ width: 36, height: 36, bgcolor: remark.category === 'Important' ? 'warning.main' : 'primary.main' }}>
                          <DescriptionIcon fontSize="small" />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                              <Chip label={remark.category} size="small" color={remark.category === 'Important' ? 'warning' : 'default'} />
                              <Typography variant="caption" color="text.secondary">
                                {remark.date} at {remark.time}
                              </Typography>
                            </Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                              by {remark.user}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.primary" sx={{ mt: 0.5 }}>
                            {remark.remark}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>

            {/* SECTION 9: CONSOLIDATED ACTIVITY TIMELINE */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <TimelineIcon color="primary" />
                <Typography variant="h5" fontWeight="bold">Consolidated Activity Timeline</Typography>
                <Chip label={`${debtorData.timeline.length} Activities`} size="small" variant="outlined" color="primary" />
              </Box>

              <List>
                {debtorData.timeline.map((activity, index) => (
                  <ListItem key={index} alignItems="flex-start" sx={{ borderLeft: '3px solid', borderColor: activity.status === 'success' ? 'success.main' : activity.status === 'failed' ? 'error.main' : 'warning.main', pl: 2, mb: 2, bgcolor: alpha(theme.palette.primary.main, 0.02), borderRadius: 1, border: '1px solid', borderTop: 'none', borderRight: 'none', borderBottom: 'none' }}>
                    <ListItemIcon>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: activity.status === 'success' ? 'success.main' : activity.status === 'failed' ? 'error.main' : 'warning.main' }}>
                        {activity.category === 'contact' && <PhoneIcon fontSize="small" />}
                        {activity.category === 'payment' && <MonetizationOnIcon fontSize="small" />}
                        {activity.category === 'ptp' && <ScheduleIcon fontSize="small" />}
                        {activity.category === 'settlement' && <HandshakeIcon fontSize="small" />}
                        {activity.category === 'hardship' && <VolunteerActivismIcon fontSize="small" />}
                        {activity.category === 'legal' && <GavelIcon fontSize="small" />}
                        {activity.category === 'dispute' && <InfoIcon fontSize="small" />}
                        {activity.category === 'update' && <TimelineIcon fontSize="small" />}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                            <Typography variant="body1" fontWeight={600}>
                              {activity.action}
                            </Typography>
                            <Chip label={activity.module} size="small" color="primary" variant="outlined" />
                            <Chip
                              label={activity.status}
                              size="small"
                              color={activity.status === 'success' ? 'success' : activity.status === 'failed' ? 'error' : 'warning'}
                              sx={{ textTransform: 'capitalize' }}
                            />
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                            {activity.date} {activity.time}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.primary" sx={{ mb: 0.5 }}>
                            {activity.details}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight={500}>
                            by {activity.user}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        )}

        {/* Payment Link Dialog */}
        <Dialog open={paymentLinkDialog} onClose={() => setPaymentLinkDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PaymentIcon color="primary" />
              <Typography variant="h6">Send Payment Link</Typography>
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={3}>
              {/* Debtor Info */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: 'success.50', border: '1px solid', borderColor: 'success.200' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Account Number</Typography>
                      <Typography variant="body2" fontWeight={600}>{debtorData?.id}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Debtor Name</Typography>
                      <Typography variant="body2" fontWeight={600}>{debtorData?.name}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Outstanding Balance</Typography>
                      <Typography variant="body2" fontWeight={600} color="error">
                        ₹{debtorData?.outstandingBalance?.toLocaleString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption" color="text.secondary">Contact</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {debtorData?.phone}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Payment Amount */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Payment Amount"
                  type="number"
                  value={paymentLinkData.amount}
                  onChange={(e) => setPaymentLinkData({ ...paymentLinkData, amount: e.target.value })}
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>
                  }}
                />
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  value={paymentLinkData.description}
                  onChange={(e) => setPaymentLinkData({ ...paymentLinkData, description: e.target.value })}
                  placeholder="Enter payment description..."
                />
              </Grid>

              {/* Expiry Days */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Link Expiry</InputLabel>
                  <Select
                    value={paymentLinkData.expiryDays}
                    label="Link Expiry"
                    onChange={(e) => setPaymentLinkData({ ...paymentLinkData, expiryDays: e.target.value })}
                  >
                    <MenuItem value={1}>1 Day</MenuItem>
                    <MenuItem value={3}>3 Days</MenuItem>
                    <MenuItem value={7}>7 Days</MenuItem>
                    <MenuItem value={15}>15 Days</MenuItem>
                    <MenuItem value={30}>30 Days</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Send Options */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: 'info.50', border: '1px solid', borderColor: 'info.200' }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom color="info.main">
                    Send Payment Link Via
                  </Typography>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={paymentLinkData.sendSMS}
                        onChange={(e) => setPaymentLinkData({ ...paymentLinkData, sendSMS: e.target.checked })}
                        disabled={!debtorData?.phone}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SmsIcon fontSize="small" />
                        <Typography variant="body2">SMS {!debtorData?.phone && '(No phone number)'}</Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={paymentLinkData.sendEmail}
                        onChange={(e) => setPaymentLinkData({ ...paymentLinkData, sendEmail: e.target.checked })}
                        disabled={!debtorData?.email}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon fontSize="small" />
                        <Typography variant="body2">Email {!debtorData?.email && '(No email)'}</Typography>
                      </Box>
                    }
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={paymentLinkData.sendWhatsApp}
                        onChange={(e) => setPaymentLinkData({ ...paymentLinkData, sendWhatsApp: e.target.checked })}
                        disabled={!debtorData?.phone}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <WhatsAppIcon fontSize="small" />
                        <Typography variant="body2">WhatsApp {!debtorData?.phone && '(No phone number)'}</Typography>
                      </Box>
                    }
                  />
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button
              onClick={() => {
                setPaymentLinkDialog(false);
                setPaymentLinkData({
                  amount: '',
                  description: '',
                  expiryDays: 7,
                  sendSMS: true,
                  sendEmail: true,
                  sendWhatsApp: false
                });
              }}
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="success"
              disabled={!paymentLinkData.amount || (!paymentLinkData.sendSMS && !paymentLinkData.sendEmail && !paymentLinkData.sendWhatsApp)}
              startIcon={<SendIcon />}
              onClick={() => {
                const channels = [];
                if (paymentLinkData.sendSMS) channels.push('SMS');
                if (paymentLinkData.sendEmail) channels.push('Email');
                if (paymentLinkData.sendWhatsApp) channels.push('WhatsApp');

                setSnackbar({
                  open: true,
                  message: `Payment link created and sent to ${debtorData.name} via ${channels.join(', ')}`,
                  severity: 'success'
                });

                setPaymentLinkDialog(false);
                setPaymentLinkData({
                  amount: '',
                  description: '',
                  expiryDays: 7,
                  sendSMS: true,
                  sendEmail: true,
                  sendWhatsApp: false
                });
              }}
            >
              Create & Send Link
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Fade>
  );
};

export default DebtorDetails;
