import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * WhatsApp Report Service
 * Handles PDF generation, Excel export, and CRM sync for WhatsApp flow analytics
 */

class WhatsAppReportService {
    /**
     * Generate PDF Report for WhatsApp Flow Analytics
     * @param {Array} flows - Array of flow data
     * @param {Object} options - Report options (title, filters, etc.)
     */
    generatePDFReport(flows, options = {}) {
        try {
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // Header
            doc.setFontSize(20);
            doc.setTextColor(37, 211, 102); // WhatsApp green
            doc.text('WhatsApp Flow Analytics Report', pageWidth / 2, 20, { align: 'center' });

            // Date
            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 28, { align: 'center' });

            // Summary Statistics
            const totalRecipients = flows.reduce((sum, flow) => sum + (flow.recipients || 0), 0);
            const totalDelivered = flows.reduce((sum, flow) => sum + (flow.delivered || 0), 0);
            const totalOpened = flows.reduce((sum, flow) => sum + (flow.opened || 0), 0);
            const totalReplied = flows.reduce((sum, flow) => sum + (flow.replied || 0), 0);

            const avgDeliveryRate = totalRecipients > 0 ? ((totalDelivered / totalRecipients) * 100).toFixed(1) : 0;
            const avgOpenRate = totalDelivered > 0 ? ((totalOpened / totalDelivered) * 100).toFixed(1) : 0;
            const avgReplyRate = totalOpened > 0 ? ((totalReplied / totalOpened) * 100).toFixed(1) : 0;

            doc.setFontSize(12);
            doc.setTextColor(0);
            doc.text('Summary Statistics', 14, 40);

            const summaryData = [
                ['Total Flows', flows.length],
                ['Total Recipients', totalRecipients.toLocaleString()],
                ['Total Delivered', totalDelivered.toLocaleString()],
                ['Total Opened', totalOpened.toLocaleString()],
                ['Total Replied', totalReplied.toLocaleString()],
                ['Avg Delivery Rate', `${avgDeliveryRate}%`],
                ['Avg Open Rate', `${avgOpenRate}%`],
                ['Avg Reply Rate', `${avgReplyRate}%`]
            ];

            autoTable(doc, {
                startY: 45,
                head: [['Metric', 'Value']],
                body: summaryData,
                theme: 'grid',
                headStyles: { fillColor: [37, 211, 102] },
                margin: { left: 14, right: 14 }
            });

            // Flow Details Table
            let finalY = doc.lastAutoTable.finalY + 10;

            doc.setFontSize(12);
            doc.text('Flow Performance Details', 14, finalY);

            const flowData = flows.map(flow => [
                flow.name,
                flow.type,
                flow.status,
                (flow.recipients || 0).toLocaleString(),
                `${flow.performance?.deliveryRate?.toFixed(1) || 0}%`,
                `${flow.performance?.openRate?.toFixed(1) || 0}%`,
                `${flow.performance?.replyRate?.toFixed(1) || 0}%`
            ]);

            autoTable(doc, {
                startY: finalY + 5,
                head: [['Flow Name', 'Type', 'Status', 'Recipients', 'Delivery %', 'Open %', 'Reply %']],
                body: flowData,
                theme: 'striped',
                headStyles: { fillColor: [37, 211, 102] },
                margin: { left: 14, right: 14 },
                styles: { fontSize: 8 }
            });

            // Footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text(
                    `Page ${i} of ${pageCount}`,
                    pageWidth / 2,
                    pageHeight - 10,
                    { align: 'center' }
                );
            }

            // Save the PDF
            const fileName = `whatsapp-flow-report-${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(fileName);

            return {
                success: true,
                fileName,
                message: 'PDF report generated successfully'
            };
        } catch (error) {
            console.error('PDF generation error:', error);
            return {
                success: false,
                error: error.message,
                message: `Failed to generate PDF report: ${error.message}`
            };
        }
    }

    /**
     * Export WhatsApp Flow Data to Excel
     * @param {Array} flows - Array of flow data
     * @param {Object} options - Export options
     */
    exportToExcel(flows, options = {}) {
        try {
            // Create a new workbook
            const wb = XLSX.utils.book_new();

            // Sheet 1: Summary Statistics
            const summaryData = this._prepareSummaryData(flows);
            const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
            XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

            // Sheet 2: Flow Details
            const flowDetailsData = this._prepareFlowDetailsData(flows);
            const flowDetailsWs = XLSX.utils.json_to_sheet(flowDetailsData);
            XLSX.utils.book_append_sheet(wb, flowDetailsWs, 'Flow Details');

            // Sheet 3: Performance Metrics
            const performanceData = this._preparePerformanceData(flows);
            const performanceWs = XLSX.utils.json_to_sheet(performanceData);
            XLSX.utils.book_append_sheet(wb, performanceWs, 'Performance');

            // Sheet 4: Raw Data
            const rawData = flows.map(flow => ({
                'Flow ID': flow.id,
                'Flow Name': flow.name,
                'Description': flow.description,
                'Type': flow.type,
                'Status': flow.status,
                'Target Audience': flow.targetAudience,
                'Schedule': flow.schedule,
                'Messages': flow.messages,
                'Recipients': flow.recipients,
                'Delivered': flow.delivered,
                'Opened': flow.opened,
                'Replied': flow.replied,
                'Delivery Rate': `${flow.performance?.deliveryRate?.toFixed(2) || 0}%`,
                'Open Rate': `${flow.performance?.openRate?.toFixed(2) || 0}%`,
                'Reply Rate': `${flow.performance?.replyRate?.toFixed(2) || 0}%`,
                'Last Run': flow.lastRun ? new Date(flow.lastRun).toLocaleString() : 'Never',
                'Created At': new Date(flow.createdAt).toLocaleString()
            }));
            const rawWs = XLSX.utils.json_to_sheet(rawData);
            XLSX.utils.book_append_sheet(wb, rawWs, 'Raw Data');

            // Generate Excel file
            const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            const fileName = `whatsapp-flow-export-${new Date().toISOString().split('T')[0]}.xlsx`;
            saveAs(blob, fileName);

            return {
                success: true,
                fileName,
                message: 'Excel export completed successfully'
            };
        } catch (error) {
            console.error('Excel export error:', error);
            return {
                success: false,
                error: error.message,
                message: 'Failed to export to Excel'
            };
        }
    }

    /**
     * Sync WhatsApp Flow Data with CRM
     * @param {Array} flows - Array of flow data to sync
     * @param {Object} options - Sync options
     */
    async syncWithCRM(flows, options = {}) {
        try {
            // Prepare data for CRM sync
            const syncData = flows.map(flow => ({
                flowId: flow.id,
                flowName: flow.name,
                flowType: flow.type,
                status: flow.status,
                metrics: {
                    recipients: flow.recipients,
                    delivered: flow.delivered,
                    opened: flow.opened,
                    replied: flow.replied,
                    deliveryRate: flow.performance?.deliveryRate,
                    openRate: flow.performance?.openRate,
                    replyRate: flow.performance?.replyRate
                },
                lastRun: flow.lastRun,
                createdAt: flow.createdAt,
                syncedAt: new Date().toISOString()
            }));

            // Simulate API call to CRM
            // In production, replace this with actual API endpoint
            console.log('Syncing data to CRM:', syncData);

            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Mock successful response
            return {
                success: true,
                syncedCount: flows.length,
                syncedAt: new Date().toISOString(),
                message: `Successfully synced ${flows.length} flow(s) to CRM`
            };
        } catch (error) {
            console.error('CRM sync error:', error);
            return {
                success: false,
                error: error.message,
                message: 'Failed to sync with CRM'
            };
        }
    }

    /**
     * Prepare summary data for Excel export
     * @private
     */
    _prepareSummaryData(flows) {
        const totalRecipients = flows.reduce((sum, flow) => sum + (flow.recipients || 0), 0);
        const totalDelivered = flows.reduce((sum, flow) => sum + (flow.delivered || 0), 0);
        const totalOpened = flows.reduce((sum, flow) => sum + (flow.opened || 0), 0);
        const totalReplied = flows.reduce((sum, flow) => sum + (flow.replied || 0), 0);

        const avgDeliveryRate = totalRecipients > 0 ? ((totalDelivered / totalRecipients) * 100).toFixed(2) : 0;
        const avgOpenRate = totalDelivered > 0 ? ((totalOpened / totalDelivered) * 100).toFixed(2) : 0;
        const avgReplyRate = totalOpened > 0 ? ((totalReplied / totalOpened) * 100).toFixed(2) : 0;

        return [
            ['WhatsApp Flow Analytics Summary'],
            ['Generated', new Date().toLocaleString()],
            [''],
            ['Metric', 'Value'],
            ['Total Flows', flows.length],
            ['Total Recipients', totalRecipients],
            ['Total Delivered', totalDelivered],
            ['Total Opened', totalOpened],
            ['Total Replied', totalReplied],
            ['Average Delivery Rate', `${avgDeliveryRate}%`],
            ['Average Open Rate', `${avgOpenRate}%`],
            ['Average Reply Rate', `${avgReplyRate}%`]
        ];
    }

    /**
     * Prepare flow details data for Excel export
     * @private
     */
    _prepareFlowDetailsData(flows) {
        return flows.map(flow => ({
            'Flow Name': flow.name,
            'Type': flow.type,
            'Status': flow.status,
            'Target Audience': flow.targetAudience,
            'Recipients': flow.recipients || 0,
            'Delivered': flow.delivered || 0,
            'Opened': flow.opened || 0,
            'Replied': flow.replied || 0,
            'Last Run': flow.lastRun ? new Date(flow.lastRun).toLocaleString() : 'Never'
        }));
    }

    /**
     * Prepare performance data for Excel export
     * @private
     */
    _preparePerformanceData(flows) {
        return flows.map(flow => ({
            'Flow Name': flow.name,
            'Delivery Rate (%)': flow.performance?.deliveryRate?.toFixed(2) || 0,
            'Open Rate (%)': flow.performance?.openRate?.toFixed(2) || 0,
            'Reply Rate (%)': flow.performance?.replyRate?.toFixed(2) || 0,
            'Recipients': flow.recipients || 0,
            'Delivered': flow.delivered || 0,
            'Opened': flow.opened || 0,
            'Replied': flow.replied || 0
        }));
    }
}

// Export singleton instance
const whatsappReportService = new WhatsAppReportService();
export default whatsappReportService;
