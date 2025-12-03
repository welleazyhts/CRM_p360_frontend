// Quote Email Service - Generate and send formatted quote emails

/**
 * Generate professional HTML email template for quote
 * @param {Object} quote - Quote object with all details
 * @returns {string} HTML email content
 */
export const generateQuoteEmailHTML = (quote) => {
    const currentDate = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Insurance Quote - ${quote.id}</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 650px;
      margin: 0 auto;
      padding: 0;
      background-color: #f5f5f5;
    }
    .email-container {
      background-color: #ffffff;
      margin: 20px auto;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 30px 25px;
    }
    .greeting {
      font-size: 16px;
      margin-bottom: 20px;
      color: #333;
    }
    .section {
      margin-bottom: 25px;
      background-color: #f9f9f9;
      padding: 20px;
      border-radius: 6px;
      border-left: 4px solid #1976d2;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #1976d2;
      margin: 0 0 15px 0;
      display: flex;
      align-items: center;
    }
    .section-title::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 20px;
      background-color: #1976d2;
      margin-right: 10px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .info-label {
      font-weight: 600;
      color: #555;
      flex: 0 0 45%;
    }
    .info-value {
      color: #333;
      flex: 0 0 55%;
      text-align: right;
    }
    .highlight-box {
      background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
      padding: 20px;
      border-radius: 6px;
      margin: 20px 0;
      text-align: center;
      border: 2px solid #1976d2;
    }
    .highlight-label {
      font-size: 14px;
      color: #1565c0;
      font-weight: 600;
      margin-bottom: 5px;
    }
    .highlight-value {
      font-size: 32px;
      font-weight: 700;
      color: #1976d2;
      margin: 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      color: white;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
      box-shadow: 0 4px 6px rgba(25, 118, 210, 0.3);
      transition: all 0.3s ease;
    }
    .cta-button:hover {
      background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
      box-shadow: 0 6px 12px rgba(25, 118, 210, 0.4);
    }
    .validity-notice {
      background-color: #fff3e0;
      border-left: 4px solid #ff9800;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .validity-notice strong {
      color: #e65100;
    }
    .footer {
      background-color: #f5f5f5;
      padding: 25px;
      text-align: center;
      border-top: 3px solid #1976d2;
    }
    .footer-text {
      font-size: 13px;
      color: #666;
      margin: 5px 0;
    }
    .contact-info {
      margin: 15px 0;
      padding: 15px;
      background-color: white;
      border-radius: 6px;
    }
    .contact-item {
      display: inline-block;
      margin: 0 15px;
      color: #1976d2;
      text-decoration: none;
      font-size: 14px;
    }
    .divider {
      height: 2px;
      background: linear-gradient(to right, transparent, #1976d2, transparent);
      margin: 20px 0;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        margin: 0;
        border-radius: 0;
      }
      .content {
        padding: 20px 15px;
      }
      .info-row {
        flex-direction: column;
      }
      .info-label, .info-value {
        text-align: left;
        flex: 1;
      }
      .info-value {
        margin-top: 5px;
        font-weight: 600;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>📋 Insurance Quote</h1>
      <p>Your personalized insurance quote is ready</p>
    </div>

    <!-- Content -->
    <div class="content">
      <div class="greeting">
        Dear <strong>${quote.customerName || 'Valued Customer'}</strong>,
      </div>

      <p>Thank you for your interest in our insurance products. We are pleased to provide you with the following quote details:</p>

      <!-- Quote Reference -->
      <div class="section">
        <h2 class="section-title">Quote Reference</h2>
        <div class="info-row">
          <span class="info-label">Quote ID</span>
          <span class="info-value"><strong>${quote.id}</strong></span>
        </div>
        <div class="info-row">
          <span class="info-label">Quote Date</span>
          <span class="info-value">${quote.raisedDate || currentDate}</span>
        </div>
        ${quote.validUntil ? `
        <div class="info-row">
          <span class="info-label">Valid Until</span>
          <span class="info-value"><strong style="color: #f57c00;">${quote.validUntil}</strong></span>
        </div>
        ` : ''}
        <div class="info-row">
          <span class="info-label">Lead ID</span>
          <span class="info-value">${quote.leadId || 'N/A'}</span>
        </div>
      </div>

      <!-- Customer Information -->
      <div class="section">
        <h2 class="section-title">Customer Information</h2>
        <div class="info-row">
          <span class="info-label">Name</span>
          <span class="info-value">${quote.customerName || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Email</span>
          <span class="info-value">${quote.customerEmail || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Phone</span>
          <span class="info-value">${quote.customerPhone || 'N/A'}</span>
        </div>
      </div>

      <!-- Product Details -->
      <div class="section">
        <h2 class="section-title">Product Details</h2>
        <div class="info-row">
          <span class="info-label">Product Type</span>
          <span class="info-value"><strong>${quote.productType || 'N/A'}</strong></span>
        </div>
        <div class="info-row">
          <span class="info-label">Plan</span>
          <span class="info-value">${quote.productPlan || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Policy Tenure</span>
          <span class="info-value">${quote.tenure || 'N/A'}</span>
        </div>
      </div>

      <!-- Financial Details -->
      <div class="section">
        <h2 class="section-title">Financial Details</h2>
        <div class="info-row">
          <span class="info-label">Coverage Amount</span>
          <span class="info-value"><strong>${quote.coverageAmount || 'N/A'}</strong></span>
        </div>
        <div class="info-row">
          <span class="info-label">Sum Insured</span>
          <span class="info-value">${quote.sumInsured || 'N/A'}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Annual Premium</span>
          <span class="info-value"><strong style="color: #2e7d32;">${quote.premium || 'N/A'}</strong></span>
        </div>
      </div>

      <!-- Total Quote Amount Highlight -->
      <div class="highlight-box">
        <div class="highlight-label">TOTAL QUOTE AMOUNT</div>
        <div class="highlight-value">${quote.quoteAmount || 'N/A'}</div>
      </div>

      ${quote.validUntil ? `
      <!-- Validity Notice -->
      <div class="validity-notice">
        <strong>⏰ Important:</strong> This quote is valid until <strong>${quote.validUntil}</strong>. Please respond before this date to secure these rates.
      </div>
      ` : ''}

      <div class="divider"></div>

      <!-- Call to Action -->
      <div style="text-align: center; margin: 30px 0;">
        <p style="font-size: 16px; margin-bottom: 15px;">Ready to proceed with this quote?</p>
        <a href="mailto:${quote.customerEmail || 'support@py360.com'}?subject=Quote%20${quote.id}%20-%20Ready%20to%20Proceed" class="cta-button">
          Accept Quote & Proceed
        </a>
      </div>

      <p style="font-size: 14px; color: #666; margin-top: 30px;">
        If you have any questions or need clarification about this quote, please don't hesitate to contact us. Our team is here to help you make the best decision for your insurance needs.
      </p>

      <p style="font-size: 14px; color: #666; margin-top: 15px;">
        Best regards,<br>
        <strong>Py360 Insurance Team</strong><br>
        ${quote.raisedBy || 'Insurance Advisor'}
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="contact-info">
        <a href="mailto:support@py360.com" class="contact-item">📧 support@py360.com</a>
        <a href="tel:+911800123456" class="contact-item">📞 1800-123-456</a>
        <a href="https://www.py360.com" class="contact-item">🌐 www.py360.com</a>
      </div>
      <p class="footer-text">This is an automated quote generated by Py360 CRM System</p>
      <p class="footer-text">Quote ID: ${quote.id} | Generated on: ${currentDate}</p>
      <p class="footer-text" style="margin-top: 15px; font-size: 11px;">
        © ${new Date().getFullYear()} Py360 Insurance. All rights reserved.<br>
        This email and any attachments are confidential and intended solely for the addressee.
      </p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Generate plain text version of quote email
 * @param {Object} quote - Quote object with all details
 * @returns {string} Plain text email content
 */
export const generateQuoteEmailText = (quote) => {
    const currentDate = new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });

    return `
INSURANCE QUOTE - ${quote.id}
${'='.repeat(60)}

Dear ${quote.customerName || 'Valued Customer'},

Thank you for your interest in our insurance products. We are pleased to provide you with the following quote details:

QUOTE REFERENCE
----------------
Quote ID: ${quote.id}
Quote Date: ${quote.raisedDate || currentDate}
${quote.validUntil ? `Valid Until: ${quote.validUntil}` : ''}
Lead ID: ${quote.leadId || 'N/A'}

CUSTOMER INFORMATION
--------------------
Name: ${quote.customerName || 'N/A'}
Email: ${quote.customerEmail || 'N/A'}
Phone: ${quote.customerPhone || 'N/A'}

PRODUCT DETAILS
---------------
Product Type: ${quote.productType || 'N/A'}
Plan: ${quote.productPlan || 'N/A'}
Policy Tenure: ${quote.tenure || 'N/A'}

FINANCIAL DETAILS
-----------------
Coverage Amount: ${quote.coverageAmount || 'N/A'}
Sum Insured: ${quote.sumInsured || 'N/A'}
Annual Premium: ${quote.premium || 'N/A'}

TOTAL QUOTE AMOUNT: ${quote.quoteAmount || 'N/A'}
${'='.repeat(60)}

${quote.validUntil ? `⏰ IMPORTANT: This quote is valid until ${quote.validUntil}. Please respond before this date to secure these rates.\n` : ''}

If you have any questions or need clarification about this quote, please don't hesitate to contact us. Our team is here to help you make the best decision for your insurance needs.

To accept this quote and proceed, please reply to this email or contact us at:
📧 Email: support@py360.com
📞 Phone: 1800-123-456
🌐 Website: www.py360.com

Best regards,
Py360 Insurance Team
${quote.raisedBy || 'Insurance Advisor'}

${'='.repeat(60)}
This is an automated quote generated by Py360 CRM System
Quote ID: ${quote.id} | Generated on: ${currentDate}
© ${new Date().getFullYear()} Py360 Insurance. All rights reserved.
  `.trim();
};

/**
 * Simulate sending quote email
 * @param {string} quoteId - Quote ID
 * @param {Object} quote - Quote object
 * @param {string} recipientEmail - Recipient email address
 * @returns {Promise<Object>} Send result
 */
export const sendQuoteEmail = async (quoteId, quote, recipientEmail) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                // Validate inputs
                if (!quote) {
                    reject(new Error('Quote data is required'));
                    return;
                }

                if (!recipientEmail) {
                    reject(new Error('Recipient email is required'));
                    return;
                }

                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(recipientEmail)) {
                    reject(new Error('Invalid email address format'));
                    return;
                }

                // Generate email content
                const htmlContent = generateQuoteEmailHTML(quote);
                const textContent = generateQuoteEmailText(quote);

                // Simulate successful email send
                resolve({
                    success: true,
                    message: `Quote email sent successfully to ${recipientEmail}`,
                    quoteId: quoteId,
                    recipientEmail: recipientEmail,
                    sentAt: new Date().toISOString(),
                    emailPreview: {
                        html: htmlContent,
                        text: textContent,
                        subject: `Insurance Quote ${quoteId} - ${quote.productType || 'Your Quote'}`,
                        from: 'Py360 Insurance <noreply@py360.com>',
                        to: recipientEmail
                    }
                });
            } catch (error) {
                reject(error);
            }
        }, 800); // Simulate network delay
    });
};

const quoteEmailService = {
    generateQuoteEmailHTML,
    generateQuoteEmailText,
    sendQuoteEmail
};

export default quoteEmailService;
