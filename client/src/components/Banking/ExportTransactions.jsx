// src/components/banking/ExportTransactions.jsx
import React, { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import showToast from '../../utils/toast';

const ExportTransactions = ({ transactions, period, onExportStart, onExportEnd }) => {
  const [exporting, setExporting] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getCategoryLabel = (category, customCategory, type) => {
    const incomeCategories = {
      'customer-advance': 'Advance Payment',
      'full-payment': 'Full Payment',
      'fabric-sale': 'Fabric Sale',
      'project-payment': 'Project Payment',
      'other-income': customCategory || 'Other Income'
    };
    
    const expenseCategories = {
      'salary': 'Employee Salary',
      'electricity': 'Electricity Bill',
      'travel': 'Travel',
      'material-purchase': 'Material Purchase',
      'rent': 'Rent',
      'maintenance': 'Maintenance',
      'other-expense': customCategory || 'Other Expense'
    };

    if (type === 'income') {
      return incomeCategories[category] || category;
    } else {
      return expenseCategories[category] || category;
    }
  };

  const safeToLocale = (value) => {
    return (value || 0).toLocaleString('en-IN');
  };

  const handleExport = () => {
    if (!transactions || transactions.length === 0) {
      showToast.warning('No transactions to export');
      return;
    }

    setExporting(true);
    if (onExportStart) onExportStart();

    try {
      // Prepare data for Excel
      const exportData = transactions.map(t => ({
        'Transaction ID': t.transactionId || t._id?.slice(-8) || 'N/A',
        'Date': formatDate(t.transactionDate),
        'Time': formatTime(t.transactionDate),
        'Type': t.type === 'income' ? 'Income' : 'Expense',
        'Category': getCategoryLabel(t.category, t.customCategory, t.type),
        'Amount (₹)': t.amount || 0,
        'Account Type': t.accountType === 'hand-cash' ? 'Hand Cash' : 'Bank',
        'Order ID': t.order?.orderId || 'N/A',
        'Customer': t.customerDetails?.name || t.customerName || 'N/A',
        'Description': t.description || '',
        'Reference': t.reference || '',
        'Status': t.status || 'Completed'
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      // Auto-size columns
      const colWidths = Object.keys(exportData[0] || {}).map(() => ({ wch: 15 }));
      worksheet['!cols'] = colWidths;
      
      // Create workbook
      const workbook = XLSX.utils.book_new();
      const periodLabel = period === 'today' ? 'Today' :
                          period === 'week' ? 'This_Week' :
                          period === 'month' ? 'This_Month' :
                          period === 'year' ? 'This_Year' : 'All_Time';
      
      XLSX.utils.book_append_sheet(workbook, worksheet, `Transactions_${periodLabel}`);
      
      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
      
      // Create download link
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Banking_Transactions_${periodLabel}_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      showToast.success(`Exported ${exportData.length} transactions successfully!`);
      
    } catch (error) {
      console.error('Export failed:', error);
      showToast.error('Failed to export transactions');
    } finally {
      setExporting(false);
      if (onExportEnd) onExportEnd();
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className={`px-4 py-2 bg-white border border-slate-200 rounded-xl font-medium transition-all flex items-center gap-2 ${
        exporting 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:bg-slate-50 text-slate-600'
      }`}
    >
      {exporting ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          <span>Exporting...</span>
        </>
      ) : (
        <>
          <Download size={18} />
          <span>Export</span>
        </>
      )}
    </button>
  );
};

export default ExportTransactions;