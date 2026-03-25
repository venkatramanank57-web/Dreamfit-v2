// import React, { useState, useEffect, useCallback, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   Search,
//   Plus,
//   ChevronLeft,
//   ChevronRight,
//   Eye,
//   Edit,
//   Trash2,
//   Filter,
//   Calendar,
//   IndianRupee,
//   TrendingUp,
//   X,
//   Menu,
//   XCircle,
//   Grid,
//   List,
//   Clock,
//   Package,
//   User,
//   Phone,
//   DollarSign,
//   CheckCircle,
//   AlertCircle,
//   Truck
// } from "lucide-react";
// import {
//   fetchOrders,
//   deleteExistingOrder,
//   updateOrderStatusThunk,
//   clearOrderError,
//   setPagination
// } from "../../../features/order/orderSlice";  
// import showToast from "../../../utils/toast";

// export default function Orders() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
  
//   // Debug flag
//   const DEBUG = true;
  
//   // Debug logger
//   const logDebug = (message, data) => {
//     if (DEBUG) {
//       console.log(`[Orders Debug] ${message}`, data || '');
//     }
//   };

//   // Log component mount
//   useEffect(() => {
//     logDebug('Orders component mounted');
//     return () => logDebug('Orders component unmounted');
//   }, []);

//   // State selectors with fallbacks
//   const { orders, pagination, loading, error } = useSelector((state) => {
//     console.log("🔍 Available Redux keys:", Object.keys(state));
    
//     const ordersState = state.orders || state.order || {};
    
//     const result = {
//       orders: ordersState.orders || ordersState.items || [],
//       pagination: ordersState.pagination || { page: 1, pages: 1, total: 0 },
//       loading: ordersState.loading || false,
//       error: ordersState.error || null
//     };
    
//     logDebug('Redux state accessed', { 
//       ordersCount: result.orders?.length,
//       pagination: result.pagination,
//       loading: result.loading,
//       error: result.error
//     });
    
//     return result;
//   });
  
//   const { user } = useSelector((state) => {
//     logDebug('Auth state', { role: state.auth?.user?.role });
//     return { user: state.auth?.user };
//   });
  
//   // Mobile state
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
//   const [mobileView, setMobileView] = useState("grid");
  
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
//   const [timeFilter, setTimeFilter] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [debouncedSearch, setDebouncedSearch] = useState("");
//   const [showFilterMenu, setShowFilterMenu] = useState(false);
//   const [showPaymentFilterMenu, setShowPaymentFilterMenu] = useState(false);
//   const [deleteLoading, setDeleteLoading] = useState({});

//   const isAdmin = user?.role === "ADMIN";
//   const isStoreKeeper = user?.role === "STORE_KEEPER";
//   const canEdit = isAdmin || isStoreKeeper;

//   // Get base path based on user role
//   const basePath = useMemo(() => {
//     if (isAdmin) return "/admin";
//     if (isStoreKeeper) return "/storekeeper";
//     return "/cuttingmaster";
//   }, [isAdmin, isStoreKeeper]);

//   logDebug('User permissions', { isAdmin, isStoreKeeper, canEdit, basePath });

//   // Debounce search
//   useEffect(() => {
//     logDebug('Setting search debounce', { searchTerm });
//     const timer = setTimeout(() => {
//       logDebug('Debounced search updated', { debouncedSearch: searchTerm });
//       setDebouncedSearch(searchTerm);
//       setCurrentPage(1);
//     }, 500);
//     return () => {
//       logDebug('Clearing search debounce timer');
//       clearTimeout(timer);
//     };
//   }, [searchTerm]);

//   // Fetch orders with filters
//   useEffect(() => {
//     const fetchOrdersData = async () => {
//       const params = {
//         page: currentPage,
//         limit: pagination?.limit || 10,
//         search: debouncedSearch,
//         status: statusFilter !== "all" ? statusFilter : "",
//         paymentStatus: paymentStatusFilter !== "all" ? paymentStatusFilter : "",
//         timeFilter,
//       };
      
//       logDebug('Fetching orders with params', params);
      
//       try {
//         const result = await dispatch(fetchOrders(params)).unwrap();
//         logDebug('Orders fetched successfully', { 
//           count: result?.orders?.length,
//           pagination: result?.pagination 
//         });
//       } catch (error) {
//         logDebug('Error fetching orders', { error: error.message });
//         showToast.error(error?.message || "Failed to fetch orders");
//       }
//     };

//     fetchOrdersData();
//   }, [dispatch, currentPage, debouncedSearch, statusFilter, paymentStatusFilter, timeFilter, pagination?.limit]);

//   // Clear error on unmount
//   useEffect(() => {
//     return () => {
//       dispatch(clearOrderError());
//     };
//   }, [dispatch]);

//   const handleSearch = useCallback((e) => {
//     const value = e.target.value;
//     setSearchTerm(value);
//   }, []);

//   // Navigate to view order
//   const handleViewOrder = useCallback((id) => {
//     logDebug('View order', { id, basePath });
//     navigate(`${basePath}/orders/${id}`);
//   }, [navigate, basePath]);

//   // Navigate to edit order
//   const handleEditOrder = useCallback((id) => {
//     logDebug('Edit order', { id, canEdit, basePath });
//     if (canEdit) {
//       navigate(`${basePath}/orders/edit/${id}`);
//     } else {
//       showToast.error("You don't have permission to edit orders");
//     }
//   }, [canEdit, navigate, basePath]);

//   // Delete order
//   const handleDeleteOrder = useCallback(async (id, orderId) => {
//     logDebug('Delete order attempt', { id, orderId, canEdit });
    
//     if (!canEdit) {
//       showToast.error("You don't have permission to delete orders");
//       return;
//     }
    
//     if (window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
//       setDeleteLoading(prev => ({ ...prev, [id]: true }));
//       try {
//         logDebug('Dispatching deleteExistingOrder', { id });
//         await dispatch(deleteExistingOrder(id)).unwrap();
//         logDebug('Order deleted successfully', { id });
//         showToast.success("Order deleted successfully");
//       } catch (error) {
//         logDebug('Error deleting order', { id, error: error.message });
//         showToast.error(error?.message || "Failed to delete order");
//       } finally {
//         setDeleteLoading(prev => ({ ...prev, [id]: false }));
//       }
//     }
//   }, [dispatch, canEdit]);

//   // Handle mark as ready to delivery
//   const handleMarkReadyToDelivery = useCallback(async (id, orderId) => {
//     logDebug('Mark as ready to delivery', { id, orderId, canEdit });
    
//     if (!canEdit) {
//       showToast.error("You don't have permission to update orders");
//       return;
//     }
    
//     if (window.confirm(`Mark order ${orderId} as Ready to Delivery?`)) {
//       try {
//         await dispatch(updateOrderStatusThunk({ 
//           id, 
//           status: 'ready-to-delivery' 
//         })).unwrap();
//         showToast.success("Order marked as ready to delivery");
//       } catch (error) {
//         logDebug('Error updating status', { error: error.message });
//         showToast.error(error?.message || "Failed to update status");
//       }
//     }
//   }, [dispatch, canEdit]);

//   // Handle mark as delivered
//   const handleMarkDelivered = useCallback(async (id, orderId) => {
//     logDebug('Mark as delivered', { id, orderId, canEdit });
    
//     if (!canEdit) {
//       showToast.error("You don't have permission to update orders");
//       return;
//     }
    
//     if (window.confirm(`Mark order ${orderId} as Delivered?`)) {
//       try {
//         await dispatch(updateOrderStatusThunk({ 
//           id, 
//           status: 'delivered' 
//         })).unwrap();
//         showToast.success("Order marked as delivered");
//       } catch (error) {
//         logDebug('Error updating status', { error: error.message });
//         showToast.error(error?.message || "Failed to update status");
//       }
//     }
//   }, [dispatch, canEdit]);

//   // Navigate to new order
//   const handleNewOrder = useCallback(() => {
//     logDebug('Navigate to new order', { basePath });
//     navigate(`${basePath}/orders/new`);
//   }, [navigate, basePath]);

//   // Handle page change
//   const handlePageChange = useCallback((newPage) => {
//     logDebug('Page change requested', { newPage, currentPage, totalPages: pagination?.pages });
//     if (newPage >= 1 && newPage <= pagination?.pages) {
//       setCurrentPage(newPage);
//       dispatch(setPagination({ page: newPage }));
//     }
//   }, [pagination?.pages, dispatch]);

//   // Status badge generator
//   const getStatusBadge = useCallback((status) => {
//     const statusConfig = {
//       draft: { bg: "bg-gray-100", text: "text-gray-700", label: "Draft", icon: Clock },
//       confirmed: { bg: "bg-blue-100", text: "text-blue-700", label: "Confirmed", icon: CheckCircle },
//       "in-progress": { bg: "bg-yellow-100", text: "text-yellow-700", label: "In Progress", icon: AlertCircle },
//       "ready-to-delivery": { bg: "bg-purple-100", text: "text-purple-700", label: "Ready to Delivery", icon: Truck },
//       delivered: { bg: "bg-green-100", text: "text-green-700", label: "Delivered", icon: CheckCircle },
//       cancelled: { bg: "bg-red-100", text: "text-red-700", label: "Cancelled", icon: XCircle },
//     };
//     return statusConfig[status] || statusConfig.draft;
//   }, []);

//   // Payment status badge generator
//   const getPaymentStatusBadge = useCallback((status) => {
//     const statusConfig = {
//       pending: { bg: "bg-red-100", text: "text-red-700", label: "Pending" },
//       partial: { bg: "bg-orange-100", text: "text-orange-700", label: "Partial" },
//       paid: { bg: "bg-green-100", text: "text-green-700", label: "Paid" },
//       overpaid: { bg: "bg-purple-100", text: "text-purple-700", label: "Overpaid" },
//     };
//     return statusConfig[status] || statusConfig.pending;
//   }, []);

//   // Format currency
//   const formatCurrency = useCallback((amount) => {
//     if (!amount && amount !== 0) return "₹0";
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0
//     }).format(amount);
//   }, []);

//   // Format price range
//   const formatPriceRange = useCallback((min, max) => {
//     if (!min && !max) return "₹0";
//     if (min === max) return formatCurrency(min);
//     return `${formatCurrency(min)} - ${formatCurrency(max)}`;
//   }, [formatCurrency]);

//   // Status options
//   const statusOptions = useMemo(() => [
//     { value: "all", label: "All Status" },
//     { value: "draft", label: "Draft" },
//     { value: "confirmed", label: "Confirmed" },
//     { value: "in-progress", label: "In Progress" },
//     { value: "ready-to-delivery", label: "Ready to Delivery" },
//     { value: "delivered", label: "Delivered" },
//     { value: "cancelled", label: "Cancelled" },
//   ], []);

//   // Payment status options
//   const paymentStatusOptions = useMemo(() => [
//     { value: "all", label: "All Payments" },
//     { value: "pending", label: "Pending" },
//     { value: "partial", label: "Partial" },
//     { value: "paid", label: "Paid" },
//     { value: "overpaid", label: "Overpaid" },
//   ], []);

//   // Time filter options
//   const timeFilters = useMemo(() => [
//     { value: "all", label: "All Time" },
//     { value: "week", label: "This Week" },
//     { value: "month", label: "This Month" },
//     { value: "3m", label: "Last 3 Months" },
//     { value: "6m", label: "Last 6 Months" },
//     { value: "1y", label: "Last Year" },
//   ], []);

//   // Error display
//   if (error) {
//     return (
//       <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
//         <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm max-w-md w-full">
//           <h2 className="text-xl sm:text-2xl font-bold text-red-700 mb-2">Error Loading Orders</h2>
//           <p className="text-sm sm:text-base text-red-600 mb-4">{error}</p>
//           <button
//             onClick={() => {
//               logDebug('Retry fetching orders');
//               dispatch(fetchOrders({
//                 page: currentPage,
//                 limit: pagination?.limit || 10,
//                 search: debouncedSearch,
//                 status: statusFilter !== "all" ? statusFilter : "",
//                 paymentStatus: paymentStatusFilter !== "all" ? paymentStatusFilter : "",
//                 timeFilter,
//               }));
//               dispatch(clearOrderError());
//             }}
//             className="w-full px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Mobile Header */}
//       <div className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-30">
//         <div className="flex items-center justify-between px-4 py-3">
//           <h1 className="text-lg font-black text-slate-800 flex items-center gap-2">
//             <Package size={20} className="text-blue-600" />
//             <span>Orders</span>
//           </h1>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
//               className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all flex items-center justify-center"
//               style={{ minWidth: '36px', minHeight: '36px' }}
//             >
//               <Filter size={18} />
//             </button>
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all flex items-center justify-center"
//               style={{ minWidth: '36px', minHeight: '36px' }}
//             >
//               <Menu size={18} />
//             </button>
//           </div>
//         </div>

//         {/* Mobile Filters Dropdown */}
//         {mobileFiltersOpen && (
//           <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-40 animate-in slide-in-from-top-2 duration-200">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="font-bold text-slate-800">Filters</h3>
//               <button
//                 onClick={() => setMobileFiltersOpen(false)}
//                 className="p-1 hover:bg-slate-100 rounded-lg flex items-center justify-center"
//                 style={{ minWidth: '28px', minHeight: '28px' }}
//               >
//                 <X size={16} className="text-slate-500" />
//               </button>
//             </div>
            
//             <div className="mb-3">
//               <label className="block text-xs font-medium text-slate-500 mb-2">Order Status</label>
//               <select
//                 value={statusFilter}
//                 onChange={(e) => {
//                   setStatusFilter(e.target.value);
//                   setCurrentPage(1);
//                   setMobileFiltersOpen(false);
//                 }}
//                 className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
//               >
//                 {statusOptions.map(option => (
//                   <option key={option.value} value={option.value}>{option.label}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="mb-3">
//               <label className="block text-xs font-medium text-slate-500 mb-2">Payment Status</label>
//               <select
//                 value={paymentStatusFilter}
//                 onChange={(e) => {
//                   setPaymentStatusFilter(e.target.value);
//                   setCurrentPage(1);
//                   setMobileFiltersOpen(false);
//                 }}
//                 className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
//               >
//                 {paymentStatusOptions.map(option => (
//                   <option key={option.value} value={option.value}>{option.label}</option>
//                 ))}
//               </select>
//             </div>

//             <div className="mb-4">
//               <label className="block text-xs font-medium text-slate-500 mb-2">Time Period</label>
//               <select
//                 value={timeFilter}
//                 onChange={(e) => {
//                   setTimeFilter(e.target.value);
//                   setCurrentPage(1);
//                   setMobileFiltersOpen(false);
//                 }}
//                 className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
//               >
//                 {timeFilters.map(option => (
//                   <option key={option.value} value={option.value}>{option.label}</option>
//                 ))}
//               </select>
//             </div>

//             <button
//               onClick={() => {
//                 setStatusFilter("all");
//                 setPaymentStatusFilter("all");
//                 setTimeFilter("all");
//                 setCurrentPage(1);
//                 setMobileFiltersOpen(false);
//               }}
//               className="w-full px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200 transition-all"
//             >
//               Clear All Filters
//             </button>
//           </div>
//         )}

//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg p-4 z-40 animate-in slide-in-from-top-2 duration-200">
//             <div className="space-y-2">
//               <button
//                 onClick={() => {
//                   navigate(`${basePath}/dashboard`);
//                   setMobileMenuOpen(false);
//                 }}
//                 className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-xl font-medium"
//               >
//                 Dashboard
//               </button>
//               <button
//                 onClick={() => {
//                   navigate(`${basePath}/orders`);
//                   setMobileMenuOpen(false);
//                 }}
//                 className="w-full text-left px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-medium"
//               >
//                 Orders
//               </button>
//               <button
//                 onClick={() => {
//                   navigate(`${basePath}/customers`);
//                   setMobileMenuOpen(false);
//                 }}
//                 className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-xl font-medium"
//               >
//                 Customers
//               </button>
//               {isAdmin && (
//                 <button
//                   onClick={() => {
//                     navigate(`${basePath}/tailors`);
//                     setMobileMenuOpen(false);
//                   }}
//                   className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-xl font-medium"
//                 >
//                   Tailors
//                 </button>
//               )}
//               {canEdit && (
//                 <button
//                   onClick={() => {
//                     handleNewOrder();
//                     setMobileMenuOpen(false);
//                   }}
//                   className="w-full text-left px-4 py-3 bg-blue-600 text-white rounded-xl font-bold"
//                 >
//                   New Order
//                 </button>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
//         {/* Desktop Header */}
//         <div className="hidden lg:block mb-6">
//           <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//             <div>
//               <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tighter uppercase">
//                 Orders Management
//               </h1>
//               <p className="text-sm lg:text-base text-slate-500 font-medium mt-1">
//                 Manage and track all customer orders with payments
//               </p>
//             </div>
            
//             <div className="flex gap-3">
//               <div className="flex gap-2">
//                 <div className="relative">
//                   <button
//                     onClick={() => setShowFilterMenu(!showFilterMenu)}
//                     className="px-4 py-2 bg-white border border-slate-200 rounded-lg font-medium flex items-center gap-2 text-sm hover:bg-slate-50"
//                   >
//                     <Filter size={16} />
//                     {statusOptions.find(s => s.value === statusFilter)?.label || "Status"}
//                   </button>
                  
//                   {showFilterMenu && (
//                     <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
//                       {statusOptions.map((option) => (
//                         <button
//                           key={option.value}
//                           onClick={() => {
//                             setStatusFilter(option.value);
//                             setShowFilterMenu(false);
//                             setCurrentPage(1);
//                           }}
//                           className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
//                             statusFilter === option.value ? "bg-blue-50 text-blue-600 font-medium" : ""
//                           }`}
//                         >
//                           {option.label}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 <div className="relative">
//                   <button
//                     onClick={() => setShowPaymentFilterMenu(!showPaymentFilterMenu)}
//                     className="px-4 py-2 bg-white border border-slate-200 rounded-lg font-medium flex items-center gap-2 text-sm hover:bg-slate-50"
//                   >
//                     <IndianRupee size={16} />
//                     {paymentStatusOptions.find(s => s.value === paymentStatusFilter)?.label || "Payment"}
//                   </button>
                  
//                   {showPaymentFilterMenu && (
//                     <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
//                       {paymentStatusOptions.map((option) => (
//                         <button
//                           key={option.value}
//                           onClick={() => {
//                             setPaymentStatusFilter(option.value);
//                             setShowPaymentFilterMenu(false);
//                             setCurrentPage(1);
//                           }}
//                           className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
//                             paymentStatusFilter === option.value ? "bg-blue-50 text-blue-600 font-medium" : ""
//                           }`}
//                         >
//                           {option.label}
//                         </button>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {canEdit && (
//                 <button
//                   onClick={handleNewOrder}
//                   className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 text-sm"
//                 >
//                   <Plus size={16} />
//                   New Order
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="lg:hidden mb-3">
//           <p className="text-xs text-slate-500">
//             Total Orders: {pagination.total || 0}
//           </p>
//         </div>

//         {/* Mobile Search Bar */}
//         <div className="lg:hidden mb-3">
//           <div className="relative">
//             <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
//             <input
//               type="text"
//               placeholder="Search orders..."
//               value={searchTerm}
//               onChange={handleSearch}
//               className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//             />
//           </div>
//         </div>

//         {/* Desktop Search Bar */}
//         <div className="hidden lg:block mb-4">
//           <div className="relative w-96">
//             <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
//             <input
//               type="text"
//               placeholder="Search by Order ID or Customer..."
//               value={searchTerm}
//               onChange={handleSearch}
//               className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
//             />
//           </div>
//         </div>

//         {/* Time Filters */}
//         <div className="hidden lg:flex gap-2 overflow-x-auto pb-2 mb-4 lg:mb-6 scrollbar-hide">
//           {timeFilters.map((filter) => (
//             <button
//               key={filter.value}
//               onClick={() => {
//                 setTimeFilter(filter.value);
//                 setCurrentPage(1);
//               }}
//               className={`px-3 sm:px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all whitespace-nowrap flex items-center gap-1 ${
//                 timeFilter === filter.value
//                   ? "bg-blue-600 text-white shadow-md"
//                   : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
//               }`}
//             >
//               <Calendar size={12} className="sm:w-3 sm:h-3" />
//               {filter.label}
//             </button>
//           ))}
//         </div>

//         {/* Mobile View Toggle */}
//         <div className="lg:hidden flex items-center justify-between mb-3">
//           <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
//             <button
//               onClick={() => setMobileView("grid")}
//               className={`p-2 rounded-lg transition flex items-center justify-center ${
//                 mobileView === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
//               }`}
//               style={{ minWidth: '36px', minHeight: '36px' }}
//             >
//               <Grid size={16} />
//             </button>
//             <button
//               onClick={() => setMobileView("list")}
//               className={`p-2 rounded-lg transition flex items-center justify-center ${
//                 mobileView === "list" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
//               }`}
//               style={{ minWidth: '36px', minHeight: '36px' }}
//             >
//               <List size={16} />
//             </button>
//           </div>
//           <span className="text-xs text-slate-500">
//             {orders?.length || 0} orders
//           </span>
//         </div>

//         {/* Orders Display */}
//         <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//           {loading ? (
//             <div className="p-8 text-center">
//               <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
//               <p className="mt-2 text-sm text-slate-500">Loading orders...</p>
//             </div>
//           ) : orders?.length > 0 ? (
//             <>
//               {/* Mobile Grid View */}
//               {mobileView === "grid" && (
//                 <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 p-3">
//                   {orders.map((order) => {
//                     if (!order) return null;
                    
//                     const statusBadge = getStatusBadge(order.status);
//                     const StatusIcon = statusBadge.icon;
//                     const paymentStatusBadge = getPaymentStatusBadge(order.paymentSummary?.paymentStatus);
//                     const customer = order.customer || {};
//                     const isDeleting = deleteLoading[order._id];
                    
//                     const garments = order.garments || [];
//                     let minTotal = 0;
//                     let maxTotal = 0;
                    
//                     if (garments.length > 0) {
//                       garments.forEach(garment => {
//                         const priceRange = garment.priceRange || { min: 0, max: 0 };
//                         minTotal += priceRange.min || 0;
//                         maxTotal += priceRange.max || 0;
//                       });
//                     } else {
//                       minTotal = order.priceSummary?.totalMin || 0;
//                       maxTotal = order.priceSummary?.totalMax || 0;
//                     }
                    
//                     return (
//                       <div key={order._id} className={`bg-white rounded-xl border border-slate-200 p-3 hover:shadow-md transition-all ${isDeleting ? 'opacity-50' : ''}`}>
//                         <div className="flex items-start justify-between mb-2">
//                           <div className="flex items-center gap-2 flex-1 min-w-0">
//                             <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
//                               <Package size={14} />
//                             </div>
//                             <div className="min-w-0">
//                               <p className="font-mono font-bold text-blue-600 text-xs truncate">{order.orderId || 'N/A'}</p>
//                               <p className="font-medium text-slate-800 text-xs truncate">{customer.name || "N/A"}</p>
//                             </div>
//                           </div>
//                           <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${statusBadge.bg} ${statusBadge.text} whitespace-nowrap`}>
//                             <StatusIcon size={10} />
//                             <span>{statusBadge.label}</span>
//                           </span>
//                         </div>

//                         <div className="space-y-2 mb-2">
//                           <div className="flex items-center gap-1 text-[10px] text-slate-500">
//                             <Package size={10} />
//                             <span>{garments.length || 0} items</span>
//                           </div>
//                         </div>

//                         <div className="bg-slate-50 p-2 rounded-lg mb-2">
//                           <p className="text-[8px] text-slate-400">Price Range</p>
//                           <p className="text-xs font-bold text-indigo-600 truncate">{formatPriceRange(minTotal, maxTotal)}</p>
//                         </div>

//                         <div className="flex items-center justify-between mb-2">
//                           <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${paymentStatusBadge.bg} ${paymentStatusBadge.text} whitespace-nowrap`}>
//                             {paymentStatusBadge.label}
//                           </span>
//                         </div>

//                         <div className="flex items-center justify-center gap-1 pt-2 border-t border-slate-100">
//                           <button
//                             onClick={() => handleViewOrder(order._id)}
//                             disabled={isDeleting}
//                             className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-all flex items-center justify-center"
//                             title="View"
//                           >
//                             <Eye size={12} />
//                           </button>
                          
//                           {canEdit && order.status === 'in-progress' && (
//                             <button
//                               onClick={() => handleMarkReadyToDelivery(order._id, order.orderId)}
//                               disabled={isDeleting}
//                               className="w-7 h-7 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-all flex items-center justify-center"
//                               title="Mark Ready"
//                             >
//                               <Truck size={12} />
//                             </button>
//                           )}
                          
//                           {canEdit && order.status === 'ready-to-delivery' && (
//                             <button
//                               onClick={() => handleMarkDelivered(order._id, order.orderId)}
//                               disabled={isDeleting}
//                               className="w-7 h-7 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all flex items-center justify-center"
//                               title="Mark Delivered"
//                             >
//                               <CheckCircle size={12} />
//                             </button>
//                           )}
                          
//                           {canEdit && (
//                             <>
//                               <button
//                                 onClick={() => handleEditOrder(order._id)}
//                                 disabled={isDeleting}
//                                 className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all flex items-center justify-center"
//                                 title="Edit"
//                               >
//                                 <Edit size={12} />
//                               </button>
//                               {isAdmin && (
//                                 <button
//                                   onClick={() => handleDeleteOrder(order._id, order.orderId)}
//                                   disabled={isDeleting}
//                                   className="w-7 h-7 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all flex items-center justify-center"
//                                   title="Delete"
//                                 >
//                                   {isDeleting ? (
//                                     <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
//                                   ) : (
//                                     <Trash2 size={12} />
//                                   )}
//                                 </button>
//                               )}
//                             </>
//                           )}
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}

//               {/* Mobile List View */}
//               {mobileView === "list" && (
//                 <div className="lg:hidden space-y-2 p-3">
//                   {orders.map((order) => {
//                     if (!order) return null;
                    
//                     const statusBadge = getStatusBadge(order.status);
//                     const StatusIcon = statusBadge.icon;
//                     const customer = order.customer || {};
//                     const isDeleting = deleteLoading[order._id];
                    
//                     return (
//                       <div key={order._id} className={`bg-white rounded-xl border border-slate-200 p-3 hover:shadow-md transition-all ${isDeleting ? 'opacity-50' : ''}`}>
//                         <div className="flex items-center justify-between mb-2">
//                           <div className="flex items-center gap-2 flex-1 min-w-0">
//                             <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
//                               <Package size={14} />
//                             </div>
//                             <div className="min-w-0">
//                               <p className="font-mono font-bold text-blue-600 text-xs truncate">{order.orderId || 'N/A'}</p>
//                               <p className="font-medium text-slate-800 text-xs truncate">{customer.name || "N/A"}</p>
//                             </div>
//                           </div>
//                           <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${statusBadge.bg} ${statusBadge.text} whitespace-nowrap`}>
//                             <StatusIcon size={10} />
//                             <span>{statusBadge.label}</span>
//                           </span>
//                         </div>

//                         <div className="flex items-center justify-between text-xs">
//                           <div className="flex items-center gap-2">
//                             <span className="text-blue-600">{order.garments?.length || 0} items</span>
//                             <button
//                               onClick={() => handleViewOrder(order._id)}
//                               className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-all flex items-center justify-center"
//                             >
//                               <Eye size={12} />
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               )}

//               {/* Desktop Table View */}
//               <div className="hidden lg:block overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-slate-50 border-b border-slate-200">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Order ID</th>
//                       <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Customer</th>
//                       <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Order Date</th>
//                       <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Delivery</th>
//                       <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Garments</th>
//                       <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">
//                         <div className="flex items-center gap-1">
//                           <IndianRupee size={14} />
//                           Price Range
//                         </div>
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Payment Status</th>
//                       <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Order Status</th>
//                       <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100">
//                     {orders.map((order) => {
//                       if (!order) return null;
                      
//                       const statusBadge = getStatusBadge(order.status);
//                       const paymentStatusBadge = getPaymentStatusBadge(order.paymentSummary?.paymentStatus);
//                       const customer = order.customer || {};
//                       const isDeleting = deleteLoading[order._id];
                      
//                       const garments = order.garments || [];
//                       let minTotal = 0;
//                       let maxTotal = 0;
                      
//                       if (garments.length > 0) {
//                         garments.forEach(garment => {
//                           const priceRange = garment.priceRange || { min: 0, max: 0 };
//                           minTotal += priceRange.min || 0;
//                           maxTotal += priceRange.max || 0;
//                         });
//                       } else {
//                         minTotal = order.priceSummary?.totalMin || 0;
//                         maxTotal = order.priceSummary?.totalMax || 0;
//                       }
                      
//                       return (
//                         <tr key={order._id} className={`hover:bg-slate-50 transition-all ${isDeleting ? 'opacity-50' : ''}`}>
//                           <td className="px-6 py-4 font-mono font-bold text-blue-600 whitespace-nowrap">{order.orderId || 'N/A'}</td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div>
//                               <p className="font-medium text-slate-800">{customer.name || "N/A"}</p>
//                               <p className="text-xs text-slate-400">{customer.customerId || ""}</p>
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
//                             {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
//                           </td>
//                           <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
//                             {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap">
//                               {garments.length || 0} items
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 font-medium text-indigo-600 whitespace-nowrap">{formatPriceRange(minTotal, maxTotal)}</td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className={`px-3 py-1 rounded-full text-xs font-bold ${paymentStatusBadge.bg} ${paymentStatusBadge.text} whitespace-nowrap`}>
//                               {paymentStatusBadge.label}
//                             </span>
//                             {order.paymentSummary?.paymentCount > 0 && (
//                               <p className="text-xs text-slate-400 mt-1 whitespace-nowrap">{order.paymentSummary.paymentCount} payment(s)</p>
//                             )}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge.bg} ${statusBadge.text} whitespace-nowrap`}>
//                               {statusBadge.label}
//                             </span>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="flex items-center gap-2">
//                               <button
//                                 onClick={() => handleViewOrder(order._id)}
//                                 disabled={isDeleting}
//                                 className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-all flex items-center justify-center"
//                                 title="View Details"
//                               >
//                                 <Eye size={16} />
//                               </button>
                              
//                               {canEdit && order.status === 'in-progress' && (
//                                 <button
//                                   onClick={() => handleMarkReadyToDelivery(order._id, order.orderId)}
//                                   disabled={isDeleting}
//                                   className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-all flex items-center justify-center"
//                                   title="Mark as Ready to Delivery"
//                                 >
//                                   <Truck size={16} />
//                                 </button>
//                               )}
                              
//                               {canEdit && order.status === 'ready-to-delivery' && (
//                                 <button
//                                   onClick={() => handleMarkDelivered(order._id, order.orderId)}
//                                   disabled={isDeleting}
//                                   className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all flex items-center justify-center"
//                                   title="Mark as Delivered"
//                                 >
//                                   <CheckCircle size={16} />
//                                 </button>
//                               )}
                              
//                               {canEdit && (
//                                 <>
//                                   <button
//                                     onClick={() => handleEditOrder(order._id)}
//                                     disabled={isDeleting}
//                                     className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all flex items-center justify-center"
//                                     title="Edit"
//                                   >
//                                     <Edit size={16} />
//                                   </button>
//                                   {isAdmin && (
//                                     <button
//                                       onClick={() => handleDeleteOrder(order._id, order.orderId)}
//                                       disabled={isDeleting}
//                                       className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all flex items-center justify-center"
//                                       title="Delete"
//                                     >
//                                       {isDeleting ? (
//                                         <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
//                                       ) : (
//                                         <Trash2 size={16} />
//                                       )}
//                                     </button>
//                                   )}
//                                 </>
//                               )}
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </>
//           ) : (
//             <div className="p-8 text-center">
//               <Package size={40} className="text-slate-300 mx-auto mb-3" />
//               <p className="text-slate-500 text-sm sm:text-base">No orders found</p>
//               {canEdit && (
//                 <button
//                   onClick={handleNewOrder}
//                   className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto text-sm"
//                 >
//                   <Plus size={16} />
//                   Create First Order
//                 </button>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Pagination */}
//         {pagination?.pages > 1 && (
//           <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
//             <div className="text-xs sm:text-sm text-slate-500 order-2 sm:order-1">
//               Showing page {pagination.page} of {pagination.pages} (Total: {pagination.total} orders)
//             </div>
//             <div className="flex items-center gap-2 order-1 sm:order-2">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
//                   currentPage === 1
//                     ? "text-slate-300 cursor-not-allowed"
//                     : "text-slate-600 hover:bg-slate-100"
//                 }`}
//               >
//                 <ChevronLeft size={16} />
//               </button>
              
//               <div className="hidden sm:flex items-center gap-1">
//                 {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => {
//                   if (
//                     pageNum === 1 ||
//                     pageNum === pagination.pages ||
//                     (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
//                   ) {
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => handlePageChange(pageNum)}
//                         className={`w-8 h-8 rounded-lg font-bold text-sm transition-all flex items-center justify-center ${
//                           currentPage === pageNum
//                             ? "bg-blue-600 text-white"
//                             : "text-slate-600 hover:bg-slate-100"
//                         }`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   } else if (
//                     pageNum === currentPage - 2 ||
//                     pageNum === currentPage + 2
//                   ) {
//                     return <span key={pageNum} className="text-slate-400 px-1">...</span>;
//                   }
//                   return null;
//                 })}
//               </div>
              
//               <span className="sm:hidden text-sm font-bold text-blue-600">
//                 {currentPage}/{pagination.pages}
//               </span>
              
//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === pagination.pages}
//                 className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
//                   currentPage === pagination.pages
//                     ? "text-slate-300 cursor-not-allowed"
//                     : "text-slate-600 hover:bg-slate-100"
//                 }`}
//               >
//                 <ChevronRight size={16} />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }






import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  Filter,
  Calendar,
  IndianRupee,
  TrendingUp,
  X,
  Menu,
  XCircle,
  Grid,
  List,
  Clock,
  Package,
  User,
  Phone,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Truck
} from "lucide-react";
import {
  fetchOrders,
  deleteExistingOrder,
  updateOrderStatusThunk,
  clearOrderError,
  setPagination
} from "../../../features/order/orderSlice";  
import showToast from "../../../utils/toast";

// 🚀 OPTIMIZED: Memoized Order Row Component - Prevents re-renders
const OrderRow = React.memo(({ order, canEdit, isAdmin, isDeleting, onView, onEdit, onDelete, onMarkReady, onMarkDelivered, formatPriceRange, getStatusBadge, getPaymentStatusBadge }) => {
  const statusBadge = getStatusBadge(order.status);
  const paymentStatusBadge = getPaymentStatusBadge(order.paymentSummary?.paymentStatus);
  const customer = order.customer || {};
  
  // 🚀 OPTIMIZED: Price calculation moved to useMemo inside row
  const priceRange = useMemo(() => {
    const garments = order.garments || [];
    let minTotal = 0;
    let maxTotal = 0;
    
    if (garments.length > 0) {
      garments.forEach(garment => {
        const priceRange = garment.priceRange || { min: 0, max: 0 };
        minTotal += priceRange.min || 0;
        maxTotal += priceRange.max || 0;
      });
    } else {
      minTotal = order.priceSummary?.totalMin || 0;
      maxTotal = order.priceSummary?.totalMax || 0;
    }
    
    return { minTotal, maxTotal };
  }, [order.garments, order.priceSummary]);
  
  return (
    <tr className={`hover:bg-slate-50 transition-all ${isDeleting ? 'opacity-50' : ''}`}>
      <td className="px-6 py-4 font-mono font-bold text-blue-600 whitespace-nowrap">{order.orderId || 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <p className="font-medium text-slate-800">{customer.name || "N/A"}</p>
          <p className="text-xs text-slate-400">{customer.customerId || ""}</p>
        </div>
      </td>
      <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
        {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
      </td>
      <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
        {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap">
          {order.garments?.length || 0} items
        </span>
      </td>
      <td className="px-6 py-4 font-medium text-indigo-600 whitespace-nowrap">
        {formatPriceRange(priceRange.minTotal, priceRange.maxTotal)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${paymentStatusBadge.bg} ${paymentStatusBadge.text} whitespace-nowrap`}>
          {paymentStatusBadge.label}
        </span>
        {order.paymentSummary?.paymentCount > 0 && (
          <p className="text-xs text-slate-400 mt-1 whitespace-nowrap">{order.paymentSummary.paymentCount} payment(s)</p>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusBadge.bg} ${statusBadge.text} whitespace-nowrap`}>
          {statusBadge.label}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(order._id)}
            disabled={isDeleting}
            className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-all flex items-center justify-center"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          
          {canEdit && order.status === 'in-progress' && (
            <button
              onClick={() => onMarkReady(order._id, order.orderId)}
              disabled={isDeleting}
              className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-all flex items-center justify-center"
              title="Mark as Ready to Delivery"
            >
              <Truck size={16} />
            </button>
          )}
          
          {canEdit && order.status === 'ready-to-delivery' && (
            <button
              onClick={() => onMarkDelivered(order._id, order.orderId)}
              disabled={isDeleting}
              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all flex items-center justify-center"
              title="Mark as Delivered"
            >
              <CheckCircle size={16} />
            </button>
          )}
          
          {canEdit && (
            <>
              <button
                onClick={() => onEdit(order._id)}
                disabled={isDeleting}
                className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all flex items-center justify-center"
                title="Edit"
              >
                <Edit size={16} />
              </button>
              {isAdmin && (
                <button
                  onClick={() => onDelete(order._id, order.orderId)}
                  disabled={isDeleting}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all flex items-center justify-center"
                  title="Delete"
                >
                  {isDeleting ? (
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </td>
    </tr>
  );
});

// 🚀 OPTIMIZED: Mobile Card Component
const MobileOrderCard = React.memo(({ order, canEdit, isAdmin, isDeleting, onView, onEdit, onDelete, onMarkReady, onMarkDelivered, formatPriceRange, getStatusBadge, getPaymentStatusBadge }) => {
  const statusBadge = getStatusBadge(order.status);
  const StatusIcon = statusBadge.icon;
  const paymentStatusBadge = getPaymentStatusBadge(order.paymentSummary?.paymentStatus);
  const customer = order.customer || {};
  
  const priceRange = useMemo(() => {
    const garments = order.garments || [];
    let minTotal = 0;
    let maxTotal = 0;
    
    if (garments.length > 0) {
      garments.forEach(garment => {
        const priceRange = garment.priceRange || { min: 0, max: 0 };
        minTotal += priceRange.min || 0;
        maxTotal += priceRange.max || 0;
      });
    } else {
      minTotal = order.priceSummary?.totalMin || 0;
      maxTotal = order.priceSummary?.totalMax || 0;
    }
    
    return { minTotal, maxTotal };
  }, [order.garments, order.priceSummary]);
  
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-3 hover:shadow-md transition-all ${isDeleting ? 'opacity-50' : ''}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
            <Package size={14} />
          </div>
          <div className="min-w-0">
            <p className="font-mono font-bold text-blue-600 text-xs truncate">{order.orderId || 'N/A'}</p>
            <p className="font-medium text-slate-800 text-xs truncate">{customer.name || "N/A"}</p>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${statusBadge.bg} ${statusBadge.text} whitespace-nowrap`}>
          <StatusIcon size={10} />
          <span>{statusBadge.label}</span>
        </span>
      </div>

      <div className="space-y-2 mb-2">
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <Package size={10} />
          <span>{order.garments?.length || 0} items</span>
        </div>
      </div>

      <div className="bg-slate-50 p-2 rounded-lg mb-2">
        <p className="text-[8px] text-slate-400">Price Range</p>
        <p className="text-xs font-bold text-indigo-600 truncate">{formatPriceRange(priceRange.minTotal, priceRange.maxTotal)}</p>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className={`px-2 py-0.5 rounded-full text-[8px] font-bold ${paymentStatusBadge.bg} ${paymentStatusBadge.text} whitespace-nowrap`}>
          {paymentStatusBadge.label}
        </span>
      </div>

      <div className="flex items-center justify-center gap-1 pt-2 border-t border-slate-100">
        <button
          onClick={() => onView(order._id)}
          disabled={isDeleting}
          className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-all flex items-center justify-center"
          title="View"
        >
          <Eye size={12} />
        </button>
        
        {canEdit && order.status === 'in-progress' && (
          <button
            onClick={() => onMarkReady(order._id, order.orderId)}
            disabled={isDeleting}
            className="w-7 h-7 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-all flex items-center justify-center"
            title="Mark Ready"
          >
            <Truck size={12} />
          </button>
        )}
        
        {canEdit && order.status === 'ready-to-delivery' && (
          <button
            onClick={() => onMarkDelivered(order._id, order.orderId)}
            disabled={isDeleting}
            className="w-7 h-7 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all flex items-center justify-center"
            title="Mark Delivered"
          >
            <CheckCircle size={12} />
          </button>
        )}
        
        {canEdit && (
          <>
            <button
              onClick={() => onEdit(order._id)}
              disabled={isDeleting}
              className="w-7 h-7 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all flex items-center justify-center"
              title="Edit"
            >
              <Edit size={12} />
            </button>
            {isAdmin && (
              <button
                onClick={() => onDelete(order._id, order.orderId)}
                disabled={isDeleting}
                className="w-7 h-7 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all flex items-center justify-center"
                title="Delete"
              >
                {isDeleting ? (
                  <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Trash2 size={12} />
                )}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
});

// 🚀 OPTIMIZED: Mobile List Item Component
const MobileListItem = React.memo(({ order, canEdit, isDeleting, onView, getStatusBadge }) => {
  const statusBadge = getStatusBadge(order.status);
  const StatusIcon = statusBadge.icon;
  const customer = order.customer || {};
  
  return (
    <div className={`bg-white rounded-xl border border-slate-200 p-3 hover:shadow-md transition-all ${isDeleting ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
            <Package size={14} />
          </div>
          <div className="min-w-0">
            <p className="font-mono font-bold text-blue-600 text-xs truncate">{order.orderId || 'N/A'}</p>
            <p className="font-medium text-slate-800 text-xs truncate">{customer.name || "N/A"}</p>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${statusBadge.bg} ${statusBadge.text} whitespace-nowrap`}>
          <StatusIcon size={10} />
          <span>{statusBadge.label}</span>
        </span>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-blue-600">{order.garments?.length || 0} items</span>
          <button
            onClick={() => onView(order._id)}
            className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-all flex items-center justify-center"
          >
            <Eye size={12} />
          </button>
        </div>
      </div>
    </div>
  );
});

export default function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Debug flag
  const DEBUG = true;
  
  // Debug logger
  const logDebug = (message, data) => {
    if (DEBUG) {
      console.log(`[Orders Debug] ${message}`, data || '');
    }
  };

  // Log component mount
  useEffect(() => {
    logDebug('Orders component mounted');
    return () => logDebug('Orders component unmounted');
  }, []);

  // State selectors with fallbacks
  const { orders, pagination, loading, error } = useSelector((state) => {
    console.log("🔍 Available Redux keys:", Object.keys(state));
    
    const ordersState = state.orders || state.order || {};
    
    const result = {
      orders: ordersState.orders || ordersState.items || [],
      pagination: ordersState.pagination || { page: 1, pages: 1, total: 0 },
      loading: ordersState.loading || false,
      error: ordersState.error || null
    };
    
    logDebug('Redux state accessed', { 
      ordersCount: result.orders?.length,
      pagination: result.pagination,
      loading: result.loading,
      error: result.error
    });
    
    return result;
  });
  
  const { user } = useSelector((state) => {
    logDebug('Auth state', { role: state.auth?.user?.role });
    return { user: state.auth?.user };
  });
  
  // Mobile state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileView, setMobileView] = useState("grid");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showPaymentFilterMenu, setShowPaymentFilterMenu] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState({});

  const isAdmin = user?.role === "ADMIN";
  const isStoreKeeper = user?.role === "STORE_KEEPER";
  const canEdit = isAdmin || isStoreKeeper;

  // Get base path based on user role
  const basePath = useMemo(() => {
    if (isAdmin) return "/admin";
    if (isStoreKeeper) return "/storekeeper";
    return "/cuttingmaster";
  }, [isAdmin, isStoreKeeper]);

  logDebug('User permissions', { isAdmin, isStoreKeeper, canEdit, basePath });

  // 🚀 OPTIMIZED: Debounce search with cleanup
  useEffect(() => {
    logDebug('Setting search debounce', { searchTerm });
    const timer = setTimeout(() => {
      logDebug('Debounced search updated', { debouncedSearch: searchTerm });
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 400); // 🚀 Reduced from 500ms to 400ms for better responsiveness
    return () => {
      logDebug('Clearing search debounce timer');
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Fetch orders with filters
  useEffect(() => {
    const fetchOrdersData = async () => {
      const params = {
        page: currentPage,
        limit: pagination?.limit || 10,
        search: debouncedSearch,
        status: statusFilter !== "all" ? statusFilter : "",
        paymentStatus: paymentStatusFilter !== "all" ? paymentStatusFilter : "",
        timeFilter,
      };
      
      logDebug('Fetching orders with params', params);
      
      try {
        const result = await dispatch(fetchOrders(params)).unwrap();
        logDebug('Orders fetched successfully', { 
          count: result?.orders?.length,
          pagination: result?.pagination 
        });
      } catch (error) {
        logDebug('Error fetching orders', { error: error.message });
        showToast.error(error?.message || "Failed to fetch orders");
      }
    };

    fetchOrdersData();
  }, [dispatch, currentPage, debouncedSearch, statusFilter, paymentStatusFilter, timeFilter, pagination?.limit]);

  // Clear error on unmount
  useEffect(() => {
    return () => {
      dispatch(clearOrderError());
    };
  }, [dispatch]);

  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
  }, []);

  // Navigate to view order
  const handleViewOrder = useCallback((id) => {
    logDebug('View order', { id, basePath });
    navigate(`${basePath}/orders/${id}`);
  }, [navigate, basePath]);

  // Navigate to edit order
  const handleEditOrder = useCallback((id) => {
    logDebug('Edit order', { id, canEdit, basePath });
    if (canEdit) {
      navigate(`${basePath}/orders/edit/${id}`);
    } else {
      showToast.error("You don't have permission to edit orders");
    }
  }, [canEdit, navigate, basePath]);

  // Delete order
  const handleDeleteOrder = useCallback(async (id, orderId) => {
    logDebug('Delete order attempt', { id, orderId, canEdit });
    
    if (!canEdit) {
      showToast.error("You don't have permission to delete orders");
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
      setDeleteLoading(prev => ({ ...prev, [id]: true }));
      try {
        logDebug('Dispatching deleteExistingOrder', { id });
        await dispatch(deleteExistingOrder(id)).unwrap();
        logDebug('Order deleted successfully', { id });
        showToast.success("Order deleted successfully");
      } catch (error) {
        logDebug('Error deleting order', { id, error: error.message });
        showToast.error(error?.message || "Failed to delete order");
      } finally {
        setDeleteLoading(prev => ({ ...prev, [id]: false }));
      }
    }
  }, [dispatch, canEdit]);

  // Handle mark as ready to delivery
  const handleMarkReadyToDelivery = useCallback(async (id, orderId) => {
    logDebug('Mark as ready to delivery', { id, orderId, canEdit });
    
    if (!canEdit) {
      showToast.error("You don't have permission to update orders");
      return;
    }
    
    if (window.confirm(`Mark order ${orderId} as Ready to Delivery?`)) {
      try {
        await dispatch(updateOrderStatusThunk({ 
          id, 
          status: 'ready-to-delivery' 
        })).unwrap();
        showToast.success("Order marked as ready to delivery");
      } catch (error) {
        logDebug('Error updating status', { error: error.message });
        showToast.error(error?.message || "Failed to update status");
      }
    }
  }, [dispatch, canEdit]);

  // Handle mark as delivered
  const handleMarkDelivered = useCallback(async (id, orderId) => {
    logDebug('Mark as delivered', { id, orderId, canEdit });
    
    if (!canEdit) {
      showToast.error("You don't have permission to update orders");
      return;
    }
    
    if (window.confirm(`Mark order ${orderId} as Delivered?`)) {
      try {
        await dispatch(updateOrderStatusThunk({ 
          id, 
          status: 'delivered' 
        })).unwrap();
        showToast.success("Order marked as delivered");
      } catch (error) {
        logDebug('Error updating status', { error: error.message });
        showToast.error(error?.message || "Failed to update status");
      }
    }
  }, [dispatch, canEdit]);

  // Navigate to new order
  const handleNewOrder = useCallback(() => {
    logDebug('Navigate to new order', { basePath });
    navigate(`${basePath}/orders/new`);
  }, [navigate, basePath]);

  // Handle page change
  const handlePageChange = useCallback((newPage) => {
    logDebug('Page change requested', { newPage, currentPage, totalPages: pagination?.pages });
    if (newPage >= 1 && newPage <= pagination?.pages) {
      setCurrentPage(newPage);
      dispatch(setPagination({ page: newPage }));
    }
  }, [pagination?.pages, dispatch]);

  // Status badge generator - Memoized with useCallback
  const getStatusBadge = useCallback((status) => {
    const statusConfig = {
      draft: { bg: "bg-gray-100", text: "text-gray-700", label: "Draft", icon: Clock },
      confirmed: { bg: "bg-blue-100", text: "text-blue-700", label: "Confirmed", icon: CheckCircle },
      "in-progress": { bg: "bg-yellow-100", text: "text-yellow-700", label: "In Progress", icon: AlertCircle },
      "ready-to-delivery": { bg: "bg-purple-100", text: "text-purple-700", label: "Ready to Delivery", icon: Truck },
      delivered: { bg: "bg-green-100", text: "text-green-700", label: "Delivered", icon: CheckCircle },
      cancelled: { bg: "bg-red-100", text: "text-red-700", label: "Cancelled", icon: XCircle },
    };
    return statusConfig[status] || statusConfig.draft;
  }, []);

  // Payment status badge generator - Memoized with useCallback
  const getPaymentStatusBadge = useCallback((status) => {
    const statusConfig = {
      pending: { bg: "bg-red-100", text: "text-red-700", label: "Pending" },
      partial: { bg: "bg-orange-100", text: "text-orange-700", label: "Partial" },
      paid: { bg: "bg-green-100", text: "text-green-700", label: "Paid" },
      overpaid: { bg: "bg-purple-100", text: "text-purple-700", label: "Overpaid" },
    };
    return statusConfig[status] || statusConfig.pending;
  }, []);

  // Format currency - Memoized with useCallback
  const formatCurrency = useCallback((amount) => {
    if (!amount && amount !== 0) return "₹0";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  }, []);

  // Format price range - Memoized with useCallback
  const formatPriceRange = useCallback((min, max) => {
    if (!min && !max) return "₹0";
    if (min === max) return formatCurrency(min);
    return `${formatCurrency(min)} - ${formatCurrency(max)}`;
  }, [formatCurrency]);

  // Status options - Memoized with useMemo
  const statusOptions = useMemo(() => [
    { value: "all", label: "All Status" },
    { value: "draft", label: "Draft" },
    { value: "confirmed", label: "Confirmed" },
    { value: "in-progress", label: "In Progress" },
    { value: "ready-to-delivery", label: "Ready to Delivery" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ], []);

  // Payment status options - Memoized with useMemo
  const paymentStatusOptions = useMemo(() => [
    { value: "all", label: "All Payments" },
    { value: "pending", label: "Pending" },
    { value: "partial", label: "Partial" },
    { value: "paid", label: "Paid" },
    { value: "overpaid", label: "Overpaid" },
  ], []);

  // Time filter options - Memoized with useMemo
  const timeFilters = useMemo(() => [
    { value: "all", label: "All Time" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "3m", label: "Last 3 Months" },
    { value: "6m", label: "Last 6 Months" },
    { value: "1y", label: "Last Year" },
  ], []);

  // Error display
  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm max-w-md w-full">
          <h2 className="text-xl sm:text-2xl font-bold text-red-700 mb-2">Error Loading Orders</h2>
          <p className="text-sm sm:text-base text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              logDebug('Retry fetching orders');
              dispatch(fetchOrders({
                page: currentPage,
                limit: pagination?.limit || 10,
                search: debouncedSearch,
                status: statusFilter !== "all" ? statusFilter : "",
                paymentStatus: paymentStatusFilter !== "all" ? paymentStatusFilter : "",
                timeFilter,
              }));
              dispatch(clearOrderError());
            }}
            className="w-full px-4 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 font-bold"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Package size={20} className="text-blue-600" />
            <span>Orders</span>
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all flex items-center justify-center"
              style={{ minWidth: '36px', minHeight: '36px' }}
            >
              <Filter size={18} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-all flex items-center justify-center"
              style={{ minWidth: '36px', minHeight: '36px' }}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Filters Dropdown */}
        {mobileFiltersOpen && (
          <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-40 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg flex items-center justify-center"
                style={{ minWidth: '28px', minHeight: '28px' }}
              >
                <X size={16} className="text-slate-500" />
              </button>
            </div>
            
            <div className="mb-3">
              <label className="block text-xs font-medium text-slate-500 mb-2">Order Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                  setMobileFiltersOpen(false);
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="block text-xs font-medium text-slate-500 mb-2">Payment Status</label>
              <select
                value={paymentStatusFilter}
                onChange={(e) => {
                  setPaymentStatusFilter(e.target.value);
                  setCurrentPage(1);
                  setMobileFiltersOpen(false);
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                {paymentStatusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-500 mb-2">Time Period</label>
              <select
                value={timeFilter}
                onChange={(e) => {
                  setTimeFilter(e.target.value);
                  setCurrentPage(1);
                  setMobileFiltersOpen(false);
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                {timeFilters.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setStatusFilter("all");
                setPaymentStatusFilter("all");
                setTimeFilter("all");
                setCurrentPage(1);
                setMobileFiltersOpen(false);
              }}
              className="w-full px-3 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium hover:bg-slate-200 transition-all"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg p-4 z-40 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-2">
              <button
                onClick={() => {
                  navigate(`${basePath}/dashboard`);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-xl font-medium"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  navigate(`${basePath}/orders`);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-medium"
              >
                Orders
              </button>
              <button
                onClick={() => {
                  navigate(`${basePath}/customers`);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-xl font-medium"
              >
                Customers
              </button>
              {isAdmin && (
                <button
                  onClick={() => {
                    navigate(`${basePath}/tailors`);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-xl font-medium"
                >
                  Tailors
                </button>
              )}
              {canEdit && (
                <button
                  onClick={() => {
                    handleNewOrder();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 bg-blue-600 text-white rounded-xl font-bold"
                >
                  New Order
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Desktop Header */}
        <div className="hidden lg:block mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tighter uppercase">
                Orders Management
              </h1>
              <p className="text-sm lg:text-base text-slate-500 font-medium mt-1">
                Manage and track all customer orders with payments
              </p>
            </div>
            
            <div className="flex gap-3">
              <div className="flex gap-2">
                <div className="relative">
                  <button
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg font-medium flex items-center gap-2 text-sm hover:bg-slate-50"
                  >
                    <Filter size={16} />
                    {statusOptions.find(s => s.value === statusFilter)?.label || "Status"}
                  </button>
                  
                  {showFilterMenu && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                      {statusOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setStatusFilter(option.value);
                            setShowFilterMenu(false);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
                            statusFilter === option.value ? "bg-blue-50 text-blue-600 font-medium" : ""
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setShowPaymentFilterMenu(!showPaymentFilterMenu)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg font-medium flex items-center gap-2 text-sm hover:bg-slate-50"
                  >
                    <IndianRupee size={16} />
                    {paymentStatusOptions.find(s => s.value === paymentStatusFilter)?.label || "Payment"}
                  </button>
                  
                  {showPaymentFilterMenu && (
                    <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                      {paymentStatusOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setPaymentStatusFilter(option.value);
                            setShowPaymentFilterMenu(false);
                            setCurrentPage(1);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 ${
                            paymentStatusFilter === option.value ? "bg-blue-50 text-blue-600 font-medium" : ""
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {canEdit && (
                <button
                  onClick={handleNewOrder}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-2 text-sm"
                >
                  <Plus size={16} />
                  New Order
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:hidden mb-3">
          <p className="text-xs text-slate-500">
            Total Orders: {pagination.total || 0}
          </p>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden mb-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Desktop Search Bar */}
        <div className="hidden lg:block mb-4">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by Order ID or Customer..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Time Filters */}
        <div className="hidden lg:flex gap-2 overflow-x-auto pb-2 mb-4 lg:mb-6 scrollbar-hide">
          {timeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => {
                setTimeFilter(filter.value);
                setCurrentPage(1);
              }}
              className={`px-3 sm:px-4 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all whitespace-nowrap flex items-center gap-1 ${
                timeFilter === filter.value
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Calendar size={12} className="sm:w-3 sm:h-3" />
              {filter.label}
            </button>
          ))}
        </div>

        {/* Mobile View Toggle */}
        <div className="lg:hidden flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setMobileView("grid")}
              className={`p-2 rounded-lg transition flex items-center justify-center ${
                mobileView === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
              }`}
              style={{ minWidth: '36px', minHeight: '36px' }}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setMobileView("list")}
              className={`p-2 rounded-lg transition flex items-center justify-center ${
                mobileView === "list" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500"
              }`}
              style={{ minWidth: '36px', minHeight: '36px' }}
            >
              <List size={16} />
            </button>
          </div>
          <span className="text-xs text-slate-500">
            {orders?.length || 0} orders
          </span>
        </div>

        {/* Orders Display */}
        <div className="bg-white rounded-xl lg:rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
              <p className="mt-2 text-sm text-slate-500">Loading orders...</p>
            </div>
          ) : orders?.length > 0 ? (
            <>
              {/* Mobile Grid View */}
              {mobileView === "grid" && (
                <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3 p-3">
                  {orders.map((order) => {
                    if (!order) return null;
                    const isDeleting = deleteLoading[order._id];
                    
                    return (
                      <MobileOrderCard
                        key={order._id}
                        order={order}
                        canEdit={canEdit}
                        isAdmin={isAdmin}
                        isDeleting={isDeleting}
                        onView={handleViewOrder}
                        onEdit={handleEditOrder}
                        onDelete={handleDeleteOrder}
                        onMarkReady={handleMarkReadyToDelivery}
                        onMarkDelivered={handleMarkDelivered}
                        formatPriceRange={formatPriceRange}
                        getStatusBadge={getStatusBadge}
                        getPaymentStatusBadge={getPaymentStatusBadge}
                      />
                    );
                  })}
                </div>
              )}

              {/* Mobile List View */}
              {mobileView === "list" && (
                <div className="lg:hidden space-y-2 p-3">
                  {orders.map((order) => {
                    if (!order) return null;
                    const isDeleting = deleteLoading[order._id];
                    
                    return (
                      <MobileListItem
                        key={order._id}
                        order={order}
                        canEdit={canEdit}
                        isDeleting={isDeleting}
                        onView={handleViewOrder}
                        getStatusBadge={getStatusBadge}
                      />
                    );
                  })}
                </div>
              )}

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Order ID</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Order Date</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Delivery</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Garments</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <IndianRupee size={14} />
                          Price Range
                        </div>
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Payment Status</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Order Status</th>
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((order) => {
                      if (!order) return null;
                      const isDeleting = deleteLoading[order._id];
                      
                      return (
                        <OrderRow
                          key={order._id}
                          order={order}
                          canEdit={canEdit}
                          isAdmin={isAdmin}
                          isDeleting={isDeleting}
                          onView={handleViewOrder}
                          onEdit={handleEditOrder}
                          onDelete={handleDeleteOrder}
                          onMarkReady={handleMarkReadyToDelivery}
                          onMarkDelivered={handleMarkDelivered}
                          formatPriceRange={formatPriceRange}
                          getStatusBadge={getStatusBadge}
                          getPaymentStatusBadge={getPaymentStatusBadge}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <Package size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm sm:text-base">No orders found</p>
              {canEdit && (
                <button
                  onClick={handleNewOrder}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto text-sm"
                >
                  <Plus size={16} />
                  Create First Order
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination?.pages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
            <div className="text-xs sm:text-sm text-slate-500 order-2 sm:order-1">
              Showing page {pagination.page} of {pagination.pages} (Total: {pagination.total} orders)
            </div>
            <div className="flex items-center gap-2 order-1 sm:order-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  currentPage === 1
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="hidden sm:flex items-center gap-1">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((pageNum) => {
                  if (
                    pageNum === 1 ||
                    pageNum === pagination.pages ||
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-8 h-8 rounded-lg font-bold text-sm transition-all flex items-center justify-center ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  } else if (
                    pageNum === currentPage - 2 ||
                    pageNum === currentPage + 2
                  ) {
                    return <span key={pageNum} className="text-slate-400 px-1">...</span>;
                  }
                  return null;
                })}
              </div>
              
              <span className="sm:hidden text-sm font-bold text-blue-600">
                {currentPage}/{pagination.pages}
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.pages}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  currentPage === pagination.pages
                    ? "text-slate-300 cursor-not-allowed"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}