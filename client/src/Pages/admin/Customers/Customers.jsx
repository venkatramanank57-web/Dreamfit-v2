// import { useState, useEffect } from "react";
// import { Search, UserPlus, ShoppingBag, User, MapPin, Phone, Mail, Calendar, PlusCircle, Eye, Hash, IndianRupee, CreditCard, TrendingUp, Package } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { 
//   searchCustomerByPhone, 
//   searchCustomerByCustomerId,
//   clearCustomerState, 
//   fetchAllCustomers,
//   fetchCustomersWithPayments
// } from "../../../features/customer/customerSlice";
// import { fetchOrdersByCustomer } from "../../../features/order/orderSlice";
// import { useNavigate } from "react-router-dom";
// import showToast from "../../../utils/toast";

// export default function Customers() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchType, setSearchType] = useState("phone");
//   const [showPaymentInfo, setShowPaymentInfo] = useState({});
//   const [customerOrders, setCustomerOrders] = useState({});
//   const [ordersLoading, setOrdersLoading] = useState({});
  
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { customers, loading, error } = useSelector((state) => state.customer);
//   const { user } = useSelector((state) => state.auth);
  
//   // ✅ Get orders from Redux
//   const ordersState = useSelector((state) => {
//     // Try different possible paths
//     const state1 = state.order?.customerOrders;
//     const state2 = state.orders?.customerOrders;
//     console.log("🔍 ordersState from order:", state1);
//     console.log("🔍 ordersState from orders:", state2);
//     return state1 || state2 || {};
//   });

//   // Get base path based on user role
//   const rolePath = user?.role === "ADMIN" ? "/admin" : 
//                    user?.role === "STORE_KEEPER" ? "/storekeeper" : 
//                    "/cuttingmaster";

//   // Fetch all customers with payment data on component mount
//   useEffect(() => {
//     console.log("📋 Fetching customers with payments");
//     dispatch(fetchCustomersWithPayments());
//   }, [dispatch]);

//   // ✅ Fetch orders for each customer with loading states
//   useEffect(() => {
//     if (customers && customers.length > 0) {
//       console.log("👥 Customers loaded:", customers);
//       customers.forEach(customer => {
//         if (customer._id) {
//           console.log(`🔍 Fetching orders for customer ${customer._id} (${customer.customerId})`);
//           setOrdersLoading(prev => ({ ...prev, [customer._id]: true }));
          
//           dispatch(fetchOrdersByCustomer(customer._id))
//             .unwrap()
//             .then((result) => {
//               console.log(`✅ Orders fetched for ${customer.customerId}:`, result);
//               setOrdersLoading(prev => ({ ...prev, [customer._id]: false }));
//             })
//             .catch((error) => {
//               console.error(`❌ Error fetching orders for ${customer.customerId}:`, error);
//               setOrdersLoading(prev => ({ ...prev, [customer._id]: false }));
//             });
//         }
//       });
//     }
//   }, [customers, dispatch]);

//   // ✅ Process orders data when ordersState changes
//   useEffect(() => {
//     if (ordersState && Object.keys(ordersState).length > 0) {
//       console.log("🔄 Processing ordersState:", ordersState);
//       const ordersMap = {};
      
//       Object.keys(ordersState).forEach(customerId => {
//         let customerOrderData = [];
        
//         // Handle different possible data structures
//         if (Array.isArray(ordersState[customerId])) {
//           customerOrderData = ordersState[customerId];
//         } else if (ordersState[customerId]?.orders) {
//           customerOrderData = ordersState[customerId].orders;
//         }
        
//         console.log(`📊 Customer ${customerId} has ${customerOrderData.length} orders`);
        
//         ordersMap[customerId] = {
//           count: customerOrderData.length || 0,
//           orders: customerOrderData,
//           totalValue: customerOrderData.reduce((sum, order) => 
//             sum + (order.priceSummary?.totalMax || 0), 0
//           ),
//           completedOrders: customerOrderData.filter(o => o?.status === 'delivered').length,
//           pendingOrders: customerOrderData.filter(o => 
//             ['draft', 'confirmed', 'in-progress'].includes(o?.status)
//           ).length
//         };
//       });
      
//       console.log("✅ Final ordersMap:", ordersMap);
//       setCustomerOrders(prev => ({ ...prev, ...ordersMap }));
//     }
//   }, [ordersState]);

//   // Handle errors
//   useEffect(() => {
//     if (error) {
//       showToast.error(error);
//     }
//   }, [error]);

//   // 🔍 Search Logic
//   const handleSearch = (e) => {
//     e.preventDefault();
    
//     if (searchType === "phone") {
//       const cleanPhone = searchTerm.replace(/\D/g, '');
      
//       if (cleanPhone.length > 0 && cleanPhone.length !== 10) {
//         return showToast.error("Enter valid 10-digit number");
//       }
      
//       if (cleanPhone.length === 10) {
//         dispatch(searchCustomerByPhone(cleanPhone));
//       } else {
//         dispatch(clearCustomerState());
//         dispatch(fetchCustomersWithPayments());
//       }
//     } else {
//       if (searchTerm.trim()) {
//         dispatch(searchCustomerByCustomerId(searchTerm.trim()));
//       } else {
//         dispatch(clearCustomerState());
//         dispatch(fetchCustomersWithPayments());
//       }
//     }
//   };

//   // Handle input change
//   const handleInputChange = (e) => {
//     const value = e.target.value;
    
//     if (searchType === "phone") {
//       const cleaned = value.replace(/\D/g, '').slice(0, 10);
//       setSearchTerm(cleaned);
      
//       if (cleaned.length === 0) {
//         dispatch(clearCustomerState());
//         dispatch(fetchCustomersWithPayments());
//       }
//     } else {
//       setSearchTerm(value);
      
//       if (value.length === 0) {
//         dispatch(clearCustomerState());
//         dispatch(fetchCustomersWithPayments());
//       }
//     }
//   };

//   // Filter customers based on search
//   const filteredCustomers = searchTerm && customers?.length > 0
//     ? customers.filter(c => 
//         searchType === "phone" 
//           ? c.phone?.includes(searchTerm)
//           : c.customerId?.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     : customers;

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
//   };

//   // Get customer full name
//   const getCustomerName = (customer) => {
//     if (customer.name) return customer.name;
//     return `${customer.salutation || ''} ${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unknown';
//   };

//   // Navigate to customer details
//   const viewCustomerDetails = (customerId) => {
//     navigate(`${rolePath}/customers/${customerId}`);
//   };

//   // Navigate to add customer page
//   const goToAddCustomer = () => {
//     navigate(`${rolePath}/add-customer`);
//   };

//   // Navigate to create order
//   const goToCreateOrder = (customer) => {
//     navigate(`${rolePath}/orders/new`, { state: { customer } });
//   };

//   // Toggle payment info display
//   const togglePaymentInfo = (customerId, e) => {
//     e.stopPropagation();
//     setShowPaymentInfo(prev => ({
//       ...prev,
//       [customerId]: !prev[customerId]
//     }));
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0
//     }).format(amount || 0);
//   };

//   // Get payment data from customer.paymentSummary
//   const getPaymentData = (customer) => {
//     if (customer.paymentSummary) {
//       return {
//         totalPaid: customer.paymentSummary.totalPaid || 0,
//         lastPayment: customer.paymentSummary.lastPayment?.amount || 0,
//         paymentCount: customer.paymentSummary.paymentCount || 0,
//         pendingAmount: customer.paymentSummary.pendingOrders || 0,
//         byMethod: customer.paymentSummary.byMethod || {}
//       };
//     }
//     return {
//       totalPaid: 0,
//       lastPayment: 0,
//       paymentCount: 0,
//       pendingAmount: 0,
//       byMethod: {}
//     };
//   };

//   // Get order data for a customer
//   const getOrderData = (customerId) => {
//     return customerOrders[customerId] || {
//       count: 0,
//       orders: [],
//       totalValue: 0,
//       completedOrders: 0,
//       pendingOrders: 0
//     };
//   };

//   // Check if orders are loading for a customer
//   const isOrdersLoading = (customerId) => {
//     return ordersLoading[customerId] || false;
//   };

//   return (
//     <div className="space-y-8 animate-in fade-in duration-500">
//       {/* HEADER & SEARCH */}
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
//         <div>
//           <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Customers</h1>
//           <p className="text-slate-500 font-medium">Search, view, and manage your customers with payment and order details.</p>
//         </div>

//         <div className="flex gap-3">
//           {/* Search Type Toggle */}
//           <div className="flex bg-slate-100 p-1 rounded-2xl">
//             <button
//               onClick={() => setSearchType("phone")}
//               className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
//                 searchType === "phone" 
//                   ? "bg-white text-blue-600 shadow-sm" 
//                   : "text-slate-500 hover:text-slate-700"
//               }`}
//             >
//               <Phone size={16} className="inline mr-1" />
//               Phone
//             </button>
//             <button
//               onClick={() => setSearchType("id")}
//               className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
//                 searchType === "id" 
//                   ? "bg-white text-blue-600 shadow-sm" 
//                   : "text-slate-500 hover:text-slate-700"
//               }`}
//             >
//               <Hash size={16} className="inline mr-1" />
//               ID
//             </button>
//           </div>

//           <form onSubmit={handleSearch} className="flex gap-2">
//             <div className="relative">
//               {searchType === "phone" ? (
//                 <Phone className="absolute left-4 top-3.5 text-slate-400" size={20} />
//               ) : (
//                 <Hash className="absolute left-4 top-3.5 text-slate-400" size={20} />
//               )}
//               <input 
//                 type="text" 
//                 placeholder={searchType === "phone" ? "Search by Phone..." : "Search by Customer ID..."}
//                 className="pl-12 pr-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-500/10 w-80 font-bold transition-all"
//                 value={searchTerm} 
//                 onChange={handleInputChange}
//                 maxLength={searchType === "phone" ? 10 : undefined}
//               />
//             </div>
//             <button 
//               type="submit" 
//               className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={loading}
//             >
//               {loading ? "Searching..." : "Search"}
//             </button>
//           </form>
          
//           {/* Add Customer Button */}
//           <button
//             onClick={goToAddCustomer}
//             className="bg-green-600 hover:bg-green-700 text-white px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-green-500/25 flex items-center gap-2"
//           >
//             <PlusCircle size={20} />
//             <span className="hidden lg:inline">Add New</span>
//           </button>
//         </div>
//       </div>

//       {/* SEARCH RESULT INFO */}
//       {searchTerm && (
//         <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             {searchType === "phone" ? <Phone size={18} className="text-blue-600" /> : <Hash size={18} className="text-blue-600" />}
//             <span className="text-sm font-medium text-slate-700">
//               Search results for <span className="font-black text-blue-600">{searchTerm}</span>
//             </span>
//           </div>
//           <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">
//             {filteredCustomers?.length || 0} found
//           </span>
//         </div>
//       )}

//       {/* CUSTOMERS LIST */}
//       <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
//         <div className="p-6 border-b border-slate-100 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <User size={24} className="text-blue-600" />
//             <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">All Customers</h2>
//           </div>
//           <span className="bg-slate-100 text-slate-600 px-4 py-2 rounded-full text-sm font-bold">
//             {filteredCustomers?.length || 0} Total
//           </span>
//         </div>

//         {loading ? (
//           <div className="flex flex-col items-center justify-center py-16">
//             <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
//             <p className="text-slate-500 font-medium">Loading customers...</p>
//           </div>
//         ) : filteredCustomers?.length > 0 ? (
//           <div className="divide-y divide-slate-100">
//             {filteredCustomers.map((customer) => {
//               const customerName = getCustomerName(customer);
//               const showPayment = showPaymentInfo[customer._id];
//               const paymentData = getPaymentData(customer);
//               const orderData = getOrderData(customer._id);
//               const loadingOrders = isOrdersLoading(customer._id);
              
//               return (
//                 <div 
//                   key={customer._id} 
//                   className="p-5 hover:bg-slate-50 transition-all cursor-pointer"
//                   onClick={() => viewCustomerDetails(customer._id)}
//                 >
//                   <div className="flex flex-col gap-4">
//                     {/* Main row */}
//                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                       <div className="flex items-start gap-4">
//                         <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
//                           <span className="text-xl font-black">
//                             {customerName?.charAt(0) || 'C'}
//                           </span>
//                         </div>
//                         <div className="flex-1">
//                           {/* Customer Name */}
//                           <h3 className="font-black text-slate-800 text-lg mb-1">{customerName}</h3>
                          
//                           {/* Customer ID */}
//                           {customer.customerId && (
//                             <div className="flex items-center gap-1.5 mb-2">
//                               <Hash size={12} className="text-blue-500" />
//                               <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
//                                 {customer.customerId}
//                               </span>
//                             </div>
//                           )}
                          
//                           <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
//                             <span className="flex items-center gap-1.5 text-sm bg-slate-100 px-3 py-1 rounded-full">
//                               <Phone size={12} className="text-blue-600" /> 
//                               <span className="font-medium text-slate-700">{customer.phone}</span>
//                             </span>
                            
//                             {customer.email && (
//                               <span className="flex items-center gap-1.5 text-xs text-slate-400">
//                                 <Mail size={10} /> {customer.email}
//                               </span>
//                             )}
                            
//                             {/* ORDER COUNT BADGE */}
//                             <span className="flex items-center gap-1.5 text-sm bg-purple-50 px-3 py-1 rounded-full">
//                               <Package size={12} className="text-purple-600" /> 
//                               <span className="font-medium text-purple-700">
//                                 {loadingOrders ? (
//                                   <span className="flex items-center gap-1">
//                                     <span className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></span>
//                                     Loading...
//                                   </span>
//                                 ) : (
//                                   `${orderData.count} ${orderData.count === 1 ? 'order' : 'orders'}`
//                                 )}
//                               </span>
//                               {!loadingOrders && orderData.pendingOrders > 0 && (
//                                 <span className="ml-1 text-xs bg-purple-200 text-purple-700 px-1.5 rounded-full">
//                                   {orderData.pendingOrders} pending
//                                 </span>
//                               )}
//                             </span>
                            
//                             {/* Payment Summary Badge */}
//                             <button
//                               onClick={(e) => togglePaymentInfo(customer._id, e)}
//                               className="flex items-center gap-1.5 text-sm bg-green-50 px-3 py-1 rounded-full hover:bg-green-100 transition-all"
//                             >
//                               <IndianRupee size={12} className="text-green-600" /> 
//                               <span className="font-medium text-green-700">
//                                 {formatCurrency(paymentData.totalPaid)}
//                               </span>
//                               <TrendingUp size={12} className="text-green-600 ml-1" />
//                             </button>
                            
//                             <span className="flex items-center gap-1.5 text-xs text-slate-400">
//                               <Calendar size={10} /> {formatDate(customer.createdAt)}
//                             </span>
//                           </div>
                          
//                           {customer.address && (
//                             <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
//                               <MapPin size={10} className="text-slate-400" />
//                               {customer.address}
//                             </p>
//                           )}

//                           {/* Quick Order Stats */}
//                           {!loadingOrders && orderData.count > 0 && (
//                             <div className="flex items-center gap-3 mt-2 text-xs">
//                               <span className="text-green-600">
//                                 ✓ {orderData.completedOrders} completed
//                               </span>
//                               <span className="text-blue-600">
//                                 ₹{(orderData.totalValue).toLocaleString('en-IN')} total
//                               </span>
//                             </div>
//                           )}
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center gap-2 md:ml-4">
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             goToCreateOrder(customer);
//                           }}
//                           className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-sm"
//                         >
//                           <ShoppingBag size={14} /> New Order
//                         </button>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             viewCustomerDetails(customer._id);
//                           }}
//                           className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-sm"
//                         >
//                           <Eye size={14} /> View
//                         </button>
//                       </div>
//                     </div>

//                     {/* Payment Details Dropdown */}
//                     {showPayment && (
//                       <div className="mt-3 pt-3 border-t border-slate-100">
//                         {/* Payment Method Breakdown */}
//                         {Object.keys(paymentData.byMethod).length > 0 && (
//                           <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
//                             {Object.entries(paymentData.byMethod).map(([method, amount]) => (
//                               amount > 0 && (
//                                 <div key={method} className="bg-slate-50 p-2 rounded-lg">
//                                   <p className="text-xs text-slate-500 capitalize">{method}</p>
//                                   <p className="text-sm font-bold text-slate-700">{formatCurrency(amount)}</p>
//                                 </div>
//                               )
//                             ))}
//                           </div>
//                         )}
                        
//                         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                           <div className="bg-blue-50 p-3 rounded-xl">
//                             <p className="text-xs text-blue-600 font-bold mb-1">Total Paid</p>
//                             <p className="text-lg font-black text-blue-700">{formatCurrency(paymentData.totalPaid)}</p>
//                           </div>
//                           <div className="bg-green-50 p-3 rounded-xl">
//                             <p className="text-xs text-green-600 font-bold mb-1">Last Payment</p>
//                             <p className="text-lg font-black text-green-700">{formatCurrency(paymentData.lastPayment)}</p>
//                           </div>
//                           <div className="bg-purple-50 p-3 rounded-xl">
//                             <p className="text-xs text-purple-600 font-bold mb-1">Total Payments</p>
//                             <p className="text-lg font-black text-purple-700">{paymentData.paymentCount}</p>
//                           </div>
//                           <div className="bg-orange-50 p-3 rounded-xl">
//                             <p className="text-xs text-orange-600 font-bold mb-1">Pending Orders</p>
//                             <p className="text-lg font-black text-orange-700">{orderData.pendingOrders}</p>
//                           </div>
//                         </div>

//                         {/* Order List Preview */}
//                         {!loadingOrders && orderData.orders.length > 0 && (
//                           <div className="mt-4">
//                             <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1">
//                               <Package size={12} />
//                               Recent Orders
//                             </p>
//                             <div className="space-y-2">
//                               {orderData.orders.slice(0, 3).map(order => (
//                                 <div key={order._id} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg text-xs">
//                                   <div className="flex items-center gap-2">
//                                     <span className="font-mono font-bold text-indigo-600">{order.orderId}</span>
//                                     <span className={`px-1.5 py-0.5 rounded-full ${
//                                       order.status === 'delivered' ? 'bg-green-100 text-green-700' :
//                                       order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
//                                       order.status === 'in-progress' ? 'bg-orange-100 text-orange-700' :
//                                       'bg-slate-100 text-slate-700'
//                                     }`}>
//                                       {order.status}
//                                     </span>
//                                   </div>
//                                   <span className="font-bold text-blue-600">
//                                     ₹{(order.priceSummary?.totalMax || 0).toLocaleString('en-IN')}
//                                   </span>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         ) : (
//           <div className="text-center py-16">
//             <User size={48} className="text-slate-300 mx-auto mb-4" />
//             <p className="text-slate-400 font-black text-xl">No Customers Found</p>
//             <p className="text-slate-300 mt-2">
//               {searchTerm ? `No customer with ${searchType === "phone" ? "phone" : "ID"} ${searchTerm}` : 'Register your first customer to get started'}
//             </p>
//             <button
//               onClick={goToAddCustomer}
//               className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-500/30 transition-all"
//             >
//               Add New Customer
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


















// import { useState, useEffect } from "react";
// import { 
//   Search, UserPlus, ShoppingBag, User, MapPin, Phone, Mail, 
//   Calendar, PlusCircle, Eye, Hash, IndianRupee, CreditCard, 
//   TrendingUp, Package 
// } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { 
//   searchCustomerByPhone, 
//   searchCustomerByCustomerId,
//   clearCustomerState, 
//   fetchAllCustomers,
//   fetchCustomersWithPayments
// } from "../../../features/customer/customerSlice";
// import { fetchOrdersByCustomer } from "../../../features/order/orderSlice";
// import { useNavigate } from "react-router-dom";
// import showToast from "../../../utils/toast";

// export default function Customers() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchType, setSearchType] = useState("phone");
//   const [showPaymentInfo, setShowPaymentInfo] = useState({});
//   const [customerOrders, setCustomerOrders] = useState({});
//   const [ordersLoading, setOrdersLoading] = useState({});
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { customers, loading, error } = useSelector((state) => state.customer);
//   const { user } = useSelector((state) => state.auth);
  
//   // Get orders from Redux
//   const ordersState = useSelector((state) => {
//     const state1 = state.order?.customerOrders;
//     const state2 = state.orders?.customerOrders;
//     return state1 || state2 || {};
//   });

//   // Get base path based on user role
//   const rolePath = user?.role === "ADMIN" ? "/admin" : 
//                    user?.role === "STORE_KEEPER" ? "/storekeeper" : 
//                    "/cuttingmaster";

//   // Fetch all customers with payment data on component mount
//   useEffect(() => {
//     dispatch(fetchCustomersWithPayments());
//   }, [dispatch]);

//   // Fetch orders for each customer with loading states
//   useEffect(() => {
//     if (customers && customers.length > 0) {
//       customers.forEach(customer => {
//         if (customer._id) {
//           setOrdersLoading(prev => ({ ...prev, [customer._id]: true }));
          
//           dispatch(fetchOrdersByCustomer(customer._id))
//             .unwrap()
//             .then(() => {
//               setOrdersLoading(prev => ({ ...prev, [customer._id]: false }));
//             })
//             .catch(() => {
//               setOrdersLoading(prev => ({ ...prev, [customer._id]: false }));
//             });
//         }
//       });
//     }
//   }, [customers, dispatch]);

//   // Process orders data when ordersState changes
//   useEffect(() => {
//     if (ordersState && Object.keys(ordersState).length > 0) {
//       const ordersMap = {};
      
//       Object.keys(ordersState).forEach(customerId => {
//         let customerOrderData = [];
        
//         if (Array.isArray(ordersState[customerId])) {
//           customerOrderData = ordersState[customerId];
//         } else if (ordersState[customerId]?.orders) {
//           customerOrderData = ordersState[customerId].orders;
//         }
        
//         ordersMap[customerId] = {
//           count: customerOrderData.length || 0,
//           orders: customerOrderData,
//           totalValue: customerOrderData.reduce((sum, order) => 
//             sum + (order.priceSummary?.totalMax || 0), 0
//           ),
//           completedOrders: customerOrderData.filter(o => o?.status === 'delivered').length,
//           pendingOrders: customerOrderData.filter(o => 
//             ['draft', 'confirmed', 'in-progress'].includes(o?.status)
//           ).length
//         };
//       });
      
//       setCustomerOrders(prev => ({ ...prev, ...ordersMap }));
//     }
//   }, [ordersState]);

//   // Handle errors
//   useEffect(() => {
//     if (error) {
//       showToast.error(error);
//     }
//   }, [error]);

//   // Search Logic
//   const handleSearch = (e) => {
//     e.preventDefault();
    
//     if (searchType === "phone") {
//       const cleanPhone = searchTerm.replace(/\D/g, '');
      
//       if (cleanPhone.length > 0 && cleanPhone.length !== 10) {
//         return showToast.error("Enter valid 10-digit number");
//       }
      
//       if (cleanPhone.length === 10) {
//         dispatch(searchCustomerByPhone(cleanPhone));
//       } else {
//         dispatch(clearCustomerState());
//         dispatch(fetchCustomersWithPayments());
//       }
//     } else {
//       if (searchTerm.trim()) {
//         dispatch(searchCustomerByCustomerId(searchTerm.trim()));
//       } else {
//         dispatch(clearCustomerState());
//         dispatch(fetchCustomersWithPayments());
//       }
//     }
//   };

//   // Handle input change
//   const handleInputChange = (e) => {
//     const value = e.target.value;
    
//     if (searchType === "phone") {
//       const cleaned = value.replace(/\D/g, '').slice(0, 10);
//       setSearchTerm(cleaned);
      
//       if (cleaned.length === 0) {
//         dispatch(clearCustomerState());
//         dispatch(fetchCustomersWithPayments());
//       }
//     } else {
//       setSearchTerm(value);
      
//       if (value.length === 0) {
//         dispatch(clearCustomerState());
//         dispatch(fetchCustomersWithPayments());
//       }
//     }
//   };

//   // Filter customers based on search
//   const filteredCustomers = searchTerm && customers?.length > 0
//     ? customers.filter(c => 
//         searchType === "phone" 
//           ? c.phone?.includes(searchTerm)
//           : c.customerId?.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     : customers;

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
//   };

//   // Get customer full name
//   const getCustomerName = (customer) => {
//     if (customer.name) return customer.name;
//     return `${customer.salutation || ''} ${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unknown';
//   };

//   // Navigate to customer details
//   const viewCustomerDetails = (customerId) => {
//     navigate(`${rolePath}/customers/${customerId}`);
//   };

//   // Navigate to add customer page
//   const goToAddCustomer = () => {
//     navigate(`${rolePath}/add-customer`);
//   };

//   // Navigate to create order
//   const goToCreateOrder = (customer) => {
//     navigate(`${rolePath}/orders/new`, { state: { customer } });
//   };

//   // Toggle payment info display
//   const togglePaymentInfo = (customerId, e) => {
//     e.stopPropagation();
//     setShowPaymentInfo(prev => ({
//       ...prev,
//       [customerId]: !prev[customerId]
//     }));
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0
//     }).format(amount || 0);
//   };

//   // Get payment data from customer.paymentSummary
//   const getPaymentData = (customer) => {
//     if (customer.paymentSummary) {
//       return {
//         totalPaid: customer.paymentSummary.totalPaid || 0,
//         lastPayment: customer.paymentSummary.lastPayment?.amount || 0,
//         paymentCount: customer.paymentSummary.paymentCount || 0,
//         pendingAmount: customer.paymentSummary.pendingOrders || 0,
//         byMethod: customer.paymentSummary.byMethod || {}
//       };
//     }
//     return {
//       totalPaid: 0,
//       lastPayment: 0,
//       paymentCount: 0,
//       pendingAmount: 0,
//       byMethod: {}
//     };
//   };

//   // Get order data for a customer
//   const getOrderData = (customerId) => {
//     return customerOrders[customerId] || {
//       count: 0,
//       orders: [],
//       totalValue: 0,
//       completedOrders: 0,
//       pendingOrders: 0
//     };
//   };

//   // Check if orders are loading for a customer
//   const isOrdersLoading = (customerId) => {
//     return ordersLoading[customerId] || false;
//   };

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Mobile Header */}
//       <div className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-30">
//         <div className="flex items-center justify-between px-4 py-3">
//           <h1 className="text-xl font-black text-slate-800 tracking-tighter">Customers</h1>
//           <button
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="p-2 hover:bg-slate-100 rounded-xl transition-all"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </button>
//         </div>
        
//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg p-4">
//             <div className="space-y-2">
//               <button
//                 onClick={() => {
//                   navigate(rolePath);
//                   setMobileMenuOpen(false);
//                 }}
//                 className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-xl font-medium"
//               >
//                 Dashboard
//               </button>
//               <button
//                 onClick={() => {
//                   navigate(`${rolePath}/orders`);
//                   setMobileMenuOpen(false);
//                 }}
//                 className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-xl font-medium"
//               >
//                 Orders
//               </button>
//               <button
//                 onClick={() => {
//                   navigate(`${rolePath}/payments`);
//                   setMobileMenuOpen(false);
//                 }}
//                 className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-xl font-medium"
//               >
//                 Payments
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
//         {/* Header Section - Fully Responsive */}
//         <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8">
//           <div className="space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
//             {/* Title */}
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tighter uppercase">
//                 Customers
//               </h1>
//               <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
//                 Search, view, and manage your customers
//               </p>
//             </div>

//             {/* Search and Actions - Mobile Stacked, Desktop Row */}
//             <div className="space-y-3 sm:space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-3">
//               {/* Search Type Toggle */}
//               <div className="flex bg-slate-100 p-1 rounded-xl sm:rounded-2xl w-full lg:w-auto">
//                 <button
//                   onClick={() => setSearchType("phone")}
//                   className={`flex-1 lg:flex-none px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all ${
//                     searchType === "phone" 
//                       ? "bg-white text-blue-600 shadow-sm" 
//                       : "text-slate-500 hover:text-slate-700"
//                   }`}
//                 >
//                   <Phone size={14} className="inline mr-1 sm:mr-1.5" />
//                   <span className="hidden xs:inline">Phone</span>
//                 </button>
//                 <button
//                   onClick={() => setSearchType("id")}
//                   className={`flex-1 lg:flex-none px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all ${
//                     searchType === "id" 
//                       ? "bg-white text-blue-600 shadow-sm" 
//                       : "text-slate-500 hover:text-slate-700"
//                   }`}
//                 >
//                   <Hash size={14} className="inline mr-1 sm:mr-1.5" />
//                   <span className="hidden xs:inline">ID</span>
//                 </button>
//               </div>

//               {/* Search Form */}
//               <form onSubmit={handleSearch} className="flex gap-2 w-full lg:w-auto">
//                 <div className="relative flex-1 lg:w-80">
//                   {searchType === "phone" ? (
//                     <Phone className="absolute left-3 sm:left-4 top-2.5 sm:top-3.5 text-slate-400" size={16} />
//                   ) : (
//                     <Hash className="absolute left-3 sm:left-4 top-2.5 sm:top-3.5 text-slate-400" size={16} />
//                   )}
//                   <input 
//                     type="text" 
//                     placeholder={searchType === "phone" ? "Phone number..." : "Customer ID..."}
//                     className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
//                     value={searchTerm} 
//                     onChange={handleInputChange}
//                     maxLength={searchType === "phone" ? 10 : undefined}
//                   />
//                 </div>
//                 <button 
//                   type="submit" 
//                   className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 whitespace-nowrap"
//                   disabled={loading}
//                 >
//                   {loading ? "..." : "Search"}
//                 </button>
//               </form>
              
//               {/* Add Customer Button */}
//               <button
//                 onClick={goToAddCustomer}
//                 className="w-full lg:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all shadow-lg shadow-green-500/25"
//               >
//                 <PlusCircle size={18} />
//                 <span>Add New</span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Search Result Info - Responsive */}
//         {searchTerm && (
//           <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
//             <div className="flex items-center gap-2">
//               {searchType === "phone" ? (
//                 <Phone size={16} className="text-blue-600" />
//               ) : (
//                 <Hash size={16} className="text-blue-600" />
//               )}
//               <span className="text-xs sm:text-sm font-medium text-slate-700">
//                 Search results for <span className="font-black text-blue-600">{searchTerm}</span>
//               </span>
//             </div>
//             <span className="text-xs bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full font-bold self-start sm:self-auto">
//               {filteredCustomers?.length || 0} found
//             </span>
//           </div>
//         )}

//         {/* Customers List - Fully Responsive */}
//         <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
//           {/* Header */}
//           <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
//             <div className="flex items-center gap-2 sm:gap-3">
//               <User size={20} className="text-blue-600" />
//               <h2 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-tight">
//                 All Customers
//               </h2>
//             </div>
//             <span className="bg-slate-100 text-slate-600 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold">
//               {filteredCustomers?.length || 0} Total
//             </span>
//           </div>

//           {/* Loading State */}
//           {loading ? (
//             <div className="flex flex-col items-center justify-center py-12 sm:py-16">
//               <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3 sm:mb-4"></div>
//               <p className="text-sm sm:text-base text-slate-500 font-medium">Loading customers...</p>
//             </div>
//           ) : filteredCustomers?.length > 0 ? (
//             <div className="divide-y divide-slate-100">
//               {filteredCustomers.map((customer) => {
//                 const customerName = getCustomerName(customer);
//                 const showPayment = showPaymentInfo[customer._id];
//                 const paymentData = getPaymentData(customer);
//                 const orderData = getOrderData(customer._id);
//                 const loadingOrders = isOrdersLoading(customer._id);
                
//                 return (
//                   <div 
//                     key={customer._id} 
//                     className="p-3 sm:p-4 lg:p-5 hover:bg-slate-50 transition-all cursor-pointer"
//                     onClick={() => viewCustomerDetails(customer._id)}
//                   >
//                     <div className="space-y-3 sm:space-y-4">
//                       {/* Main Row - Responsive */}
//                       <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
//                         <div className="flex items-start gap-3 sm:gap-4 w-full">
//                           {/* Avatar */}
//                           <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
//                             <span className="text-base sm:text-lg lg:text-xl font-black">
//                               {customerName?.charAt(0) || 'C'}
//                             </span>
//                           </div>
                          
//                           {/* Customer Info */}
//                           <div className="flex-1 min-w-0">
//                             <h3 className="font-black text-slate-800 text-sm sm:text-base lg:text-lg mb-1 truncate">
//                               {customerName}
//                             </h3>
                            
//                             {/* Customer ID */}
//                             {customer.customerId && (
//                               <div className="flex items-center gap-1 mb-2">
//                                 <Hash size={10} className="text-blue-500" />
//                                 <span className="text-[10px] sm:text-xs font-mono text-blue-600 bg-blue-50 px-1.5 sm:px-2 py-0.5 rounded-full truncate max-w-[150px] sm:max-w-none">
//                                   {customer.customerId}
//                                 </span>
//                               </div>
//                             )}
                            
//                             {/* Badges - Responsive Wrap */}
//                             <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
//                               {/* Phone */}
//                               <span className="inline-flex items-center gap-1 bg-slate-100 px-2 sm:px-3 py-1 rounded-full">
//                                 <Phone size={10} className="text-blue-600" />
//                                 <span className="text-[10px] sm:text-xs font-medium text-slate-700">
//                                   {customer.phone}
//                                 </span>
//                               </span>
                              
//                               {/* Order Count */}
//                               <span className="inline-flex items-center gap-1 bg-purple-50 px-2 sm:px-3 py-1 rounded-full">
//                                 <Package size={10} className="text-purple-600" />
//                                 <span className="text-[10px] sm:text-xs font-medium text-purple-700">
//                                   {loadingOrders ? (
//                                     <span className="flex items-center gap-1">
//                                       <span className="w-2 h-2 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></span>
//                                     </span>
//                                   ) : (
//                                     `${orderData.count}`
//                                   )}
//                                 </span>
//                               </span>
                              
//                               {/* Payment Badge */}
//                               <button
//                                 onClick={(e) => togglePaymentInfo(customer._id, e)}
//                                 className="inline-flex items-center gap-1 bg-green-50 px-2 sm:px-3 py-1 rounded-full hover:bg-green-100"
//                               >
//                                 <IndianRupee size={10} className="text-green-600" />
//                                 <span className="text-[10px] sm:text-xs font-medium text-green-700">
//                                   {formatCurrency(paymentData.totalPaid)}
//                                 </span>
//                               </button>
                              
//                               {/* Date - Hide on very small screens */}
//                               <span className="hidden xs:flex items-center gap-1 text-[10px] sm:text-xs text-slate-400">
//                                 <Calendar size={10} />
//                                 {formatDate(customer.createdAt)}
//                               </span>
//                             </div>
                            
//                             {/* Address - Hide on mobile */}
//                             {customer.address && (
//                               <p className="hidden sm:flex text-[10px] sm:text-xs text-slate-400 mt-2 items-center gap-1 truncate">
//                                 <MapPin size={10} className="flex-shrink-0" />
//                                 <span className="truncate">{customer.address}</span>
//                               </p>
//                             )}
//                           </div>
//                         </div>
                        
//                         {/* Action Buttons - Responsive */}
//                         <div className="flex items-center gap-2 sm:self-center">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               goToCreateOrder(customer);
//                             }}
//                             className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold transition-all shadow-lg text-xs sm:text-sm whitespace-nowrap"
//                           >
//                             <ShoppingBag size={12} />
//                             <span className="hidden xs:inline">New</span>
//                           </button>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               viewCustomerDetails(customer._id);
//                             }}
//                             className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold transition-all shadow-lg text-xs sm:text-sm"
//                           >
//                             <Eye size={12} />
//                             <span className="hidden xs:inline">View</span>
//                           </button>
//                         </div>
//                       </div>

//                       {/* Payment Details Dropdown - Responsive Grid */}
//                       {showPayment && (
//                         <div className="mt-3 pt-3 border-t border-slate-100">
//                           {/* Payment Method Breakdown */}
//                           {Object.keys(paymentData.byMethod).length > 0 && (
//                             <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mb-3">
//                               {Object.entries(paymentData.byMethod).map(([method, amount]) => (
//                                 amount > 0 && (
//                                   <div key={method} className="bg-slate-50 p-1.5 sm:p-2 rounded-lg">
//                                     <p className="text-[10px] text-slate-500 capitalize">{method}</p>
//                                     <p className="text-xs sm:text-sm font-bold text-slate-700">{formatCurrency(amount)}</p>
//                                   </div>
//                                 )
//                               ))}
//                             </div>
//                           )}
                          
//                           {/* Stats Grid */}
//                           <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
//                             <div className="bg-blue-50 p-2 sm:p-3 rounded-lg sm:rounded-xl">
//                               <p className="text-[10px] text-blue-600 font-bold mb-0.5">Total Paid</p>
//                               <p className="text-sm sm:text-base font-black text-blue-700">{formatCurrency(paymentData.totalPaid)}</p>
//                             </div>
//                             <div className="bg-green-50 p-2 sm:p-3 rounded-lg sm:rounded-xl">
//                               <p className="text-[10px] text-green-600 font-bold mb-0.5">Last Payment</p>
//                               <p className="text-sm sm:text-base font-black text-green-700">{formatCurrency(paymentData.lastPayment)}</p>
//                             </div>
//                             <div className="bg-purple-50 p-2 sm:p-3 rounded-lg sm:rounded-xl">
//                               <p className="text-[10px] text-purple-600 font-bold mb-0.5">Payments</p>
//                               <p className="text-sm sm:text-base font-black text-purple-700">{paymentData.paymentCount}</p>
//                             </div>
//                             <div className="bg-orange-50 p-2 sm:p-3 rounded-lg sm:rounded-xl">
//                               <p className="text-[10px] text-orange-600 font-bold mb-0.5">Pending</p>
//                               <p className="text-sm sm:text-base font-black text-orange-700">{orderData.pendingOrders}</p>
//                             </div>
//                           </div>

//                           {/* Recent Orders - Hide on mobile */}
//                           {!loadingOrders && orderData.orders.length > 0 && (
//                             <div className="hidden sm:block mt-4">
//                               <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1">
//                                 <Package size={12} />
//                                 Recent Orders
//                               </p>
//                               <div className="space-y-2">
//                                 {orderData.orders.slice(0, 2).map(order => (
//                                   <div key={order._id} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg text-xs">
//                                     <div className="flex items-center gap-2">
//                                       <span className="font-mono font-bold text-indigo-600">{order.orderId}</span>
//                                       <span className={`px-1.5 py-0.5 rounded-full ${
//                                         order.status === 'delivered' ? 'bg-green-100 text-green-700' :
//                                         order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
//                                         order.status === 'in-progress' ? 'bg-orange-100 text-orange-700' :
//                                         'bg-slate-100 text-slate-700'
//                                       }`}>
//                                         {order.status}
//                                       </span>
//                                     </div>
//                                     <span className="font-bold text-blue-600">
//                                       ₹{(order.priceSummary?.totalMax || 0).toLocaleString('en-IN')}
//                                     </span>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             /* Empty State - Responsive */
//             <div className="text-center py-12 sm:py-16 px-4">
//               <User size={40} className="text-slate-300 mx-auto mb-3 sm:mb-4" />
//               <p className="text-lg sm:text-xl font-black text-slate-400">No Customers Found</p>
//               <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-sm mx-auto">
//                 {searchTerm 
//                   ? `No customer with ${searchType === "phone" ? "phone" : "ID"} ${searchTerm}` 
//                   : 'Register your first customer to get started'}
//               </p>
//               <button
//                 onClick={goToAddCustomer}
//                 className="mt-4 sm:mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold uppercase tracking-wider shadow-lg shadow-blue-500/30 transition-all text-sm sm:text-base"
//               >
//                 Add New Customer
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }












// import { useState, useEffect, useRef } from "react";
// import { 
//   Search, UserPlus, ShoppingBag, User, MapPin, Phone, Mail, 
//   Calendar, PlusCircle, Eye, Hash, IndianRupee, CreditCard, 
//   TrendingUp, Package, Download, Upload, FileSpreadsheet 
// } from "lucide-react";
// import { useDispatch, useSelector } from "react-redux";
// import { 
//   searchCustomerByPhone, 
//   searchCustomerByCustomerId,
//   clearCustomerState, 
//   fetchAllCustomers,
//   fetchCustomersWithPayments,
//   importCustomers,
//   exportCustomers
// } from "../../../features/customer/customerSlice";
// import { fetchOrdersByCustomer } from "../../../features/order/orderSlice";
// import { useNavigate } from "react-router-dom";
// import showToast from "../../../utils/toast";

// export default function Customers() {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchType, setSearchType] = useState("phone");
//   const [showPaymentInfo, setShowPaymentInfo] = useState({});
//   const [customerOrders, setCustomerOrders] = useState({});
//   const [ordersLoading, setOrdersLoading] = useState({});
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [importing, setImporting] = useState(false);
//   const fileInputRef = useRef(null);
  
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { customers, loading, error, importExportLoading } = useSelector((state) => state.customer);
//   const { user } = useSelector((state) => state.auth);
  
//   // Get orders from Redux
//   const ordersState = useSelector((state) => {
//     const state1 = state.order?.customerOrders;
//     const state2 = state.orders?.customerOrders;
//     return state1 || state2 || {};
//   });

//   // Get base path based on user role
//   const rolePath = user?.role === "ADMIN" ? "/admin" : 
//                    user?.role === "STORE_KEEPER" ? "/storekeeper" : 
//                    "/cuttingmaster";

//   // Fetch all customers with payment data on component mount
//   useEffect(() => {
//     dispatch(fetchCustomersWithPayments());
//   }, [dispatch]);

//   // Fetch orders for each customer with loading states
//   useEffect(() => {
//     if (customers && customers.length > 0) {
//       customers.forEach(customer => {
//         if (customer._id) {
//           setOrdersLoading(prev => ({ ...prev, [customer._id]: true }));
          
//           dispatch(fetchOrdersByCustomer(customer._id))
//             .unwrap()
//             .then(() => {
//               setOrdersLoading(prev => ({ ...prev, [customer._id]: false }));
//             })
//             .catch(() => {
//               setOrdersLoading(prev => ({ ...prev, [customer._id]: false }));
//             });
//         }
//       });
//     }
//   }, [customers, dispatch]);

//   // Process orders data when ordersState changes
//   useEffect(() => {
//     if (ordersState && Object.keys(ordersState).length > 0) {
//       const ordersMap = {};
      
//       Object.keys(ordersState).forEach(customerId => {
//         let customerOrderData = [];
        
//         if (Array.isArray(ordersState[customerId])) {
//           customerOrderData = ordersState[customerId];
//         } else if (ordersState[customerId]?.orders) {
//           customerOrderData = ordersState[customerId].orders;
//         }
        
//         ordersMap[customerId] = {
//           count: customerOrderData.length || 0,
//           orders: customerOrderData,
//           totalValue: customerOrderData.reduce((sum, order) => 
//             sum + (order.priceSummary?.totalMax || 0), 0
//           ),
//           completedOrders: customerOrderData.filter(o => o?.status === 'delivered').length,
//           pendingOrders: customerOrderData.filter(o => 
//             ['draft', 'confirmed', 'in-progress'].includes(o?.status)
//           ).length
//         };
//       });
      
//       setCustomerOrders(prev => ({ ...prev, ...ordersMap }));
//     }
//   }, [ordersState]);

//   // Handle errors
//   useEffect(() => {
//     if (error) {
//       showToast.error(error);
//     }
//   }, [error]);

//   // Search Logic
//   const handleSearch = (e) => {
//     e.preventDefault();
    
//     if (searchType === "phone") {
//       const cleanPhone = searchTerm.replace(/\D/g, '');
      
//       if (cleanPhone.length > 0 && cleanPhone.length !== 10) {
//         return showToast.error("Enter valid 10-digit number");
//       }
      
//       if (cleanPhone.length === 10) {
//         dispatch(searchCustomerByPhone(cleanPhone));
//       } else {
//         dispatch(clearCustomerState());
//         dispatch(fetchCustomersWithPayments());
//       }
//     } else {
//       if (searchTerm.trim()) {
//         dispatch(searchCustomerByCustomerId(searchTerm.trim()));
//       } else {
//         dispatch(clearCustomerState());
//         dispatch(fetchCustomersWithPayments());
//       }
//     }
//   };

//   // Handle input change
//   const handleInputChange = (e) => {
//     const value = e.target.value;
    
//     if (searchType === "phone") {
//       const cleaned = value.replace(/\D/g, '').slice(0, 10);
//       setSearchTerm(cleaned);
      
//       if (cleaned.length === 0) {
//         dispatch(clearCustomerState());
//         dispatch(fetchCustomersWithPayments());
//       }
//     } else {
//       setSearchTerm(value);
      
//       if (value.length === 0) {
//         dispatch(clearCustomerState());
//         dispatch(fetchCustomersWithPayments());
//       }
//     }
//   };

//   // Filter customers based on search
//   const filteredCustomers = searchTerm && customers?.length > 0
//     ? customers.filter(c => 
//         searchType === "phone" 
//           ? c.phone?.includes(searchTerm)
//           : c.customerId?.toLowerCase().includes(searchTerm.toLowerCase())
//       )
//     : customers;

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
//   };

//   // Get customer full name
//   const getCustomerName = (customer) => {
//     if (customer.name) return customer.name;
//     return `${customer.salutation || ''} ${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unknown';
//   };

//   // Navigate to customer details
//   const viewCustomerDetails = (customerId) => {
//     navigate(`${rolePath}/customers/${customerId}`);
//   };

//   // Navigate to add customer page
//   const goToAddCustomer = () => {
//     navigate(`${rolePath}/add-customer`);
//   };

//   // Navigate to create order
//   const goToCreateOrder = (customer) => {
//     navigate(`${rolePath}/orders/new`, { state: { customer } });
//   };

//   // Toggle payment info display
//   const togglePaymentInfo = (customerId, e) => {
//     e.stopPropagation();
//     setShowPaymentInfo(prev => ({
//       ...prev,
//       [customerId]: !prev[customerId]
//     }));
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0
//     }).format(amount || 0);
//   };

//   // ✅ NEW: Handle Export Customers
//   const handleExport = async () => {
//     try {
//       await dispatch(exportCustomers()).unwrap();
//     } catch (error) {
//       console.error("Export failed:", error);
//     }
//   };

//   // ✅ NEW: Handle Import Customers
//   const handleImport = async (event) => {
//     const file = event.target.files[0];
//     if (!file) return;
    
//     // Validate file type
//     const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
//     if (!validTypes.includes(file.type)) {
//       showToast.error('Please upload a valid Excel file (.xlsx or .xls)');
//       return;
//     }
    
//     // Validate file size (max 5MB)
//     if (file.size > 5 * 1024 * 1024) {
//       showToast.error('File size should be less than 5MB');
//       return;
//     }
    
//     setImporting(true);
//     try {
//       await dispatch(importCustomers(file)).unwrap();
//       // Refresh the customer list after import
//       dispatch(fetchCustomersWithPayments());
//       // Clear file input
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//     } catch (error) {
//       console.error("Import failed:", error);
//     } finally {
//       setImporting(false);
//     }
//   };

//   // Get payment data from customer.paymentSummary
//   const getPaymentData = (customer) => {
//     if (customer.paymentSummary) {
//       return {
//         totalPaid: customer.paymentSummary.totalPaid || 0,
//         lastPayment: customer.paymentSummary.lastPayment?.amount || 0,
//         paymentCount: customer.paymentSummary.paymentCount || 0,
//         pendingAmount: customer.paymentSummary.pendingOrders || 0,
//         byMethod: customer.paymentSummary.byMethod || {}
//       };
//     }
//     return {
//       totalPaid: 0,
//       lastPayment: 0,
//       paymentCount: 0,
//       pendingAmount: 0,
//       byMethod: {}
//     };
//   };

//   // Get order data for a customer
//   const getOrderData = (customerId) => {
//     return customerOrders[customerId] || {
//       count: 0,
//       orders: [],
//       totalValue: 0,
//       completedOrders: 0,
//       pendingOrders: 0
//     };
//   };

//   // Check if orders are loading for a customer
//   const isOrdersLoading = (customerId) => {
//     return ordersLoading[customerId] || false;
//   };

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Mobile Header */}
//       <div className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-30">
//         <div className="flex items-center justify-between px-4 py-3">
//           <h1 className="text-xl font-black text-slate-800 tracking-tighter">Customers</h1>
//           <button
//             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             className="p-2 hover:bg-slate-100 rounded-xl transition-all"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//             </svg>
//           </button>
//         </div>
        
//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg p-4">
//             <div className="space-y-2">
//               <button
//                 onClick={() => {
//                   navigate(rolePath);
//                   setMobileMenuOpen(false);
//                 }}
//                 className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-xl font-medium"
//               >
//                 Dashboard
//               </button>
//               <button
//                 onClick={() => {
//                   navigate(`${rolePath}/orders`);
//                   setMobileMenuOpen(false);
//                 }}
//                 className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-xl font-medium"
//               >
//                 Orders
//               </button>
//               <button
//                 onClick={() => {
//                   navigate(`${rolePath}/payments`);
//                   setMobileMenuOpen(false);
//                 }}
//                 className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-xl font-medium"
//               >
//                 Payments
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
//         {/* Header Section - Fully Responsive */}
//         <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8">
//           <div className="space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
//             {/* Title */}
//             <div>
//               <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tighter uppercase">
//                 Customers
//               </h1>
//               <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
//                 Search, view, and manage your customers
//               </p>
//             </div>

//             {/* Search and Actions - Mobile Stacked, Desktop Row */}
//             <div className="space-y-3 sm:space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-3">
//               {/* Search Type Toggle */}
//               <div className="flex bg-slate-100 p-1 rounded-xl sm:rounded-2xl w-full lg:w-auto">
//                 <button
//                   onClick={() => setSearchType("phone")}
//                   className={`flex-1 lg:flex-none px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all ${
//                     searchType === "phone" 
//                       ? "bg-white text-blue-600 shadow-sm" 
//                       : "text-slate-500 hover:text-slate-700"
//                   }`}
//                 >
//                   <Phone size={14} className="inline mr-1 sm:mr-1.5" />
//                   <span className="hidden xs:inline">Phone</span>
//                 </button>
//                 <button
//                   onClick={() => setSearchType("id")}
//                   className={`flex-1 lg:flex-none px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all ${
//                     searchType === "id" 
//                       ? "bg-white text-blue-600 shadow-sm" 
//                       : "text-slate-500 hover:text-slate-700"
//                   }`}
//                 >
//                   <Hash size={14} className="inline mr-1 sm:mr-1.5" />
//                   <span className="hidden xs:inline">ID</span>
//                 </button>
//               </div>

//               {/* Search Form */}
//               <form onSubmit={handleSearch} className="flex gap-2 w-full lg:w-auto">
//                 <div className="relative flex-1 lg:w-80">
//                   {searchType === "phone" ? (
//                     <Phone className="absolute left-3 sm:left-4 top-2.5 sm:top-3.5 text-slate-400" size={16} />
//                   ) : (
//                     <Hash className="absolute left-3 sm:left-4 top-2.5 sm:top-3.5 text-slate-400" size={16} />
//                   )}
//                   <input 
//                     type="text" 
//                     placeholder={searchType === "phone" ? "Phone number..." : "Customer ID..."}
//                     className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
//                     value={searchTerm} 
//                     onChange={handleInputChange}
//                     maxLength={searchType === "phone" ? 10 : undefined}
//                   />
//                 </div>
//                 <button 
//                   type="submit" 
//                   className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 whitespace-nowrap"
//                   disabled={loading}
//                 >
//                   {loading ? "..." : "Search"}
//                 </button>
//               </form>
              
//               {/* Action Buttons - Import/Export and Add */}
//               <div className="flex gap-2 w-full lg:w-auto">
//                 {/* Export Button */}
//                 <button
//                   onClick={handleExport}
//                   disabled={importExportLoading}
//                   className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all shadow-lg shadow-green-500/25 disabled:opacity-50"
//                   title="Export customers to Excel"
//                 >
//                   <Download size={18} />
//                   <span className="hidden xs:inline">Export</span>
//                 </button>
                
//                 {/* Import Button */}
//                 <label
//                   className={`flex-1 lg:flex-none flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all shadow-lg shadow-purple-500/25 cursor-pointer ${importing ? 'opacity-50' : ''}`}
//                   title="Import customers from Excel"
//                 >
//                   <Upload size={18} />
//                   <span className="hidden xs:inline">Import</span>
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept=".xlsx,.xls"
//                     onChange={handleImport}
//                     className="hidden"
//                     disabled={importing}
//                   />
//                 </label>
                
//                 {/* Add Customer Button */}
//                 <button
//                   onClick={goToAddCustomer}
//                   className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all shadow-lg shadow-blue-500/25"
//                 >
//                   <PlusCircle size={18} />
//                   <span className="hidden xs:inline">Add New</span>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search Result Info - Responsive */}
//         {searchTerm && (
//           <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
//             <div className="flex items-center gap-2">
//               {searchType === "phone" ? (
//                 <Phone size={16} className="text-blue-600" />
//               ) : (
//                 <Hash size={16} className="text-blue-600" />
//               )}
//               <span className="text-xs sm:text-sm font-medium text-slate-700">
//                 Search results for <span className="font-black text-blue-600">{searchTerm}</span>
//               </span>
//             </div>
//             <span className="text-xs bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full font-bold self-start sm:self-auto">
//               {filteredCustomers?.length || 0} found
//             </span>
//           </div>
//         )}

//         {/* Customers List - Fully Responsive */}
//         <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
//           {/* Header */}
//           <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
//             <div className="flex items-center gap-2 sm:gap-3">
//               <User size={20} className="text-blue-600" />
//               <h2 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-tight">
//                 All Customers
//               </h2>
//             </div>
//             <span className="bg-slate-100 text-slate-600 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold">
//               {filteredCustomers?.length || 0} Total
//             </span>
//           </div>

//           {/* Loading State */}
//           {loading ? (
//             <div className="flex flex-col items-center justify-center py-12 sm:py-16">
//               <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3 sm:mb-4"></div>
//               <p className="text-sm sm:text-base text-slate-500 font-medium">Loading customers...</p>
//             </div>
//           ) : filteredCustomers?.length > 0 ? (
//             <div className="divide-y divide-slate-100">
//               {filteredCustomers.map((customer) => {
//                 const customerName = getCustomerName(customer);
//                 const showPayment = showPaymentInfo[customer._id];
//                 const paymentData = getPaymentData(customer);
//                 const orderData = getOrderData(customer._id);
//                 const loadingOrders = isOrdersLoading(customer._id);
                
//                 return (
//                   <div 
//                     key={customer._id} 
//                     className="p-3 sm:p-4 lg:p-5 hover:bg-slate-50 transition-all cursor-pointer"
//                     onClick={() => viewCustomerDetails(customer._id)}
//                   >
//                     <div className="space-y-3 sm:space-y-4">
//                       {/* Main Row - Responsive */}
//                       <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
//                         <div className="flex items-start gap-3 sm:gap-4 w-full">
//                           {/* Avatar */}
//                           <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
//                             <span className="text-base sm:text-lg lg:text-xl font-black">
//                               {customerName?.charAt(0) || 'C'}
//                             </span>
//                           </div>
                          
//                           {/* Customer Info */}
//                           <div className="flex-1 min-w-0">
//                             <h3 className="font-black text-slate-800 text-sm sm:text-base lg:text-lg mb-1 truncate">
//                               {customerName}
//                             </h3>
                            
//                             {/* Customer ID */}
//                             {customer.customerId && (
//                               <div className="flex items-center gap-1 mb-2">
//                                 <Hash size={10} className="text-blue-500" />
//                                 <span className="text-[10px] sm:text-xs font-mono text-blue-600 bg-blue-50 px-1.5 sm:px-2 py-0.5 rounded-full truncate max-w-[150px] sm:max-w-none">
//                                   {customer.customerId}
//                                 </span>
//                               </div>
//                             )}
                            
//                             {/* Badges - Responsive Wrap */}
//                             <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
//                               {/* Phone */}
//                               <span className="inline-flex items-center gap-1 bg-slate-100 px-2 sm:px-3 py-1 rounded-full">
//                                 <Phone size={10} className="text-blue-600" />
//                                 <span className="text-[10px] sm:text-xs font-medium text-slate-700">
//                                   {customer.phone}
//                                 </span>
//                               </span>
                              
//                               {/* Order Count */}
//                               <span className="inline-flex items-center gap-1 bg-purple-50 px-2 sm:px-3 py-1 rounded-full">
//                                 <Package size={10} className="text-purple-600" />
//                                 <span className="text-[10px] sm:text-xs font-medium text-purple-700">
//                                   {loadingOrders ? (
//                                     <span className="flex items-center gap-1">
//                                       <span className="w-2 h-2 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></span>
//                                     </span>
//                                   ) : (
//                                     `${orderData.count}`
//                                   )}
//                                 </span>
//                               </span>
                              
//                               {/* Payment Badge */}
//                               <button
//                                 onClick={(e) => togglePaymentInfo(customer._id, e)}
//                                 className="inline-flex items-center gap-1 bg-green-50 px-2 sm:px-3 py-1 rounded-full hover:bg-green-100"
//                               >
//                                 <IndianRupee size={10} className="text-green-600" />
//                                 <span className="text-[10px] sm:text-xs font-medium text-green-700">
//                                   {formatCurrency(paymentData.totalPaid)}
//                                 </span>
//                               </button>
                              
//                               {/* Date - Hide on very small screens */}
//                               <span className="hidden xs:flex items-center gap-1 text-[10px] sm:text-xs text-slate-400">
//                                 <Calendar size={10} />
//                                 {formatDate(customer.createdAt)}
//                               </span>
//                             </div>
                            
//                             {/* Address - Hide on mobile */}
//                             {customer.address && (
//                               <p className="hidden sm:flex text-[10px] sm:text-xs text-slate-400 mt-2 items-center gap-1 truncate">
//                                 <MapPin size={10} className="flex-shrink-0" />
//                                 <span className="truncate">{customer.address}</span>
//                               </p>
//                             )}
//                           </div>
//                         </div>
                        
//                         {/* Action Buttons - Responsive */}
//                         <div className="flex items-center gap-2 sm:self-center">
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               goToCreateOrder(customer);
//                             }}
//                             className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold transition-all shadow-lg text-xs sm:text-sm whitespace-nowrap"
//                           >
//                             <ShoppingBag size={12} />
//                             <span className="hidden xs:inline">New</span>
//                           </button>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               viewCustomerDetails(customer._id);
//                             }}
//                             className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold transition-all shadow-lg text-xs sm:text-sm"
//                           >
//                             <Eye size={12} />
//                             <span className="hidden xs:inline">View</span>
//                           </button>
//                         </div>
//                       </div>

//                       {/* Payment Details Dropdown - Responsive Grid */}
//                       {showPayment && (
//                         <div className="mt-3 pt-3 border-t border-slate-100">
//                           {/* Payment Method Breakdown */}
//                           {Object.keys(paymentData.byMethod).length > 0 && (
//                             <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mb-3">
//                               {Object.entries(paymentData.byMethod).map(([method, amount]) => (
//                                 amount > 0 && (
//                                   <div key={method} className="bg-slate-50 p-1.5 sm:p-2 rounded-lg">
//                                     <p className="text-[10px] text-slate-500 capitalize">{method}</p>
//                                     <p className="text-xs sm:text-sm font-bold text-slate-700">{formatCurrency(amount)}</p>
//                                   </div>
//                                 )
//                               ))}
//                             </div>
//                           )}
                          
//                           {/* Stats Grid */}
//                           <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
//                             <div className="bg-blue-50 p-2 sm:p-3 rounded-lg sm:rounded-xl">
//                               <p className="text-[10px] text-blue-600 font-bold mb-0.5">Total Paid</p>
//                               <p className="text-sm sm:text-base font-black text-blue-700">{formatCurrency(paymentData.totalPaid)}</p>
//                             </div>
//                             <div className="bg-green-50 p-2 sm:p-3 rounded-lg sm:rounded-xl">
//                               <p className="text-[10px] text-green-600 font-bold mb-0.5">Last Payment</p>
//                               <p className="text-sm sm:text-base font-black text-green-700">{formatCurrency(paymentData.lastPayment)}</p>
//                             </div>
//                             <div className="bg-purple-50 p-2 sm:p-3 rounded-lg sm:rounded-xl">
//                               <p className="text-[10px] text-purple-600 font-bold mb-0.5">Payments</p>
//                               <p className="text-sm sm:text-base font-black text-purple-700">{paymentData.paymentCount}</p>
//                             </div>
//                             <div className="bg-orange-50 p-2 sm:p-3 rounded-lg sm:rounded-xl">
//                               <p className="text-[10px] text-orange-600 font-bold mb-0.5">Pending</p>
//                               <p className="text-sm sm:text-base font-black text-orange-700">{orderData.pendingOrders}</p>
//                             </div>
//                           </div>

//                           {/* Recent Orders - Hide on mobile */}
//                           {!loadingOrders && orderData.orders.length > 0 && (
//                             <div className="hidden sm:block mt-4">
//                               <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1">
//                                 <Package size={12} />
//                                 Recent Orders
//                               </p>
//                               <div className="space-y-2">
//                                 {orderData.orders.slice(0, 2).map(order => (
//                                   <div key={order._id} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg text-xs">
//                                     <div className="flex items-center gap-2">
//                                       <span className="font-mono font-bold text-indigo-600">{order.orderId}</span>
//                                       <span className={`px-1.5 py-0.5 rounded-full ${
//                                         order.status === 'delivered' ? 'bg-green-100 text-green-700' :
//                                         order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
//                                         order.status === 'in-progress' ? 'bg-orange-100 text-orange-700' :
//                                         'bg-slate-100 text-slate-700'
//                                       }`}>
//                                         {order.status}
//                                       </span>
//                                     </div>
//                                     <span className="font-bold text-blue-600">
//                                       ₹{(order.priceSummary?.totalMax || 0).toLocaleString('en-IN')}
//                                     </span>
//                                   </div>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           ) : (
//             /* Empty State - Responsive */
//             <div className="text-center py-12 sm:py-16 px-4">
//               <User size={40} className="text-slate-300 mx-auto mb-3 sm:mb-4" />
//               <p className="text-lg sm:text-xl font-black text-slate-400">No Customers Found</p>
//               <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-sm mx-auto">
//                 {searchTerm 
//                   ? `No customer with ${searchType === "phone" ? "phone" : "ID"} ${searchTerm}` 
//                   : 'Register your first customer to get started'}
//               </p>
//               <button
//                 onClick={goToAddCustomer}
//                 className="mt-4 sm:mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold uppercase tracking-wider shadow-lg shadow-blue-500/30 transition-all text-sm sm:text-base"
//               >
//                 Add New Customer
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
























import { useState, useEffect, useRef } from "react";
import { 
  Search, UserPlus, ShoppingBag, User, MapPin, Phone, Mail, 
  Calendar, PlusCircle, Eye, Hash, IndianRupee, CreditCard, 
  TrendingUp, Package, Download, Upload, FileSpreadsheet,
  ChevronLeft, ChevronRight 
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { 
  searchCustomerByPhone, 
  searchCustomerByCustomerId,
  clearCustomerState, 
  fetchAllCustomers,
  fetchCustomersWithPayments,
  importCustomers,
  exportCustomers
} from "../../../features/customer/customerSlice";
import { fetchOrdersByCustomer } from "../../../features/order/orderSlice";
import { useNavigate } from "react-router-dom";
import showToast from "../../../utils/toast";

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("phone");
  const [showPaymentInfo, setShowPaymentInfo] = useState({});
  const [customerOrders, setCustomerOrders] = useState({});
  const [ordersLoading, setOrdersLoading] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { customers, loading, error, importExportLoading } = useSelector((state) => state.customer);
  const { user } = useSelector((state) => state.auth);
  
  // Get orders from Redux
  const ordersState = useSelector((state) => {
    const state1 = state.order?.customerOrders;
    const state2 = state.orders?.customerOrders;
    return state1 || state2 || {};
  });

  // Get base path based on user role
  const rolePath = user?.role === "ADMIN" ? "/admin" : 
                   user?.role === "STORE_KEEPER" ? "/storekeeper" : 
                   "/cuttingmaster";

  // Fetch all customers with payment data on component mount
  useEffect(() => {
    dispatch(fetchCustomersWithPayments());
  }, [dispatch]);

  // Fetch orders for each customer with loading states
  useEffect(() => {
    if (customers && customers.length > 0) {
      customers.forEach(customer => {
        if (customer._id) {
          setOrdersLoading(prev => ({ ...prev, [customer._id]: true }));
          
          dispatch(fetchOrdersByCustomer(customer._id))
            .unwrap()
            .then(() => {
              setOrdersLoading(prev => ({ ...prev, [customer._id]: false }));
            })
            .catch(() => {
              setOrdersLoading(prev => ({ ...prev, [customer._id]: false }));
            });
        }
      });
    }
  }, [customers, dispatch]);

  // Process orders data when ordersState changes
  useEffect(() => {
    if (ordersState && Object.keys(ordersState).length > 0) {
      const ordersMap = {};
      
      Object.keys(ordersState).forEach(customerId => {
        let customerOrderData = [];
        
        if (Array.isArray(ordersState[customerId])) {
          customerOrderData = ordersState[customerId];
        } else if (ordersState[customerId]?.orders) {
          customerOrderData = ordersState[customerId].orders;
        }
        
        ordersMap[customerId] = {
          count: customerOrderData.length || 0,
          orders: customerOrderData,
          totalValue: customerOrderData.reduce((sum, order) => 
            sum + (order.priceSummary?.totalMax || 0), 0
          ),
          completedOrders: customerOrderData.filter(o => o?.status === 'delivered').length,
          pendingOrders: customerOrderData.filter(o => 
            ['draft', 'confirmed', 'in-progress'].includes(o?.status)
          ).length
        };
      });
      
      setCustomerOrders(prev => ({ ...prev, ...ordersMap }));
    }
  }, [ordersState]);

  // Handle errors
  useEffect(() => {
    if (error) {
      showToast.error(error);
    }
  }, [error]);

  // Reset to first page when search results change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, customers]);

  // Search Logic
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchType === "phone") {
      const cleanPhone = searchTerm.replace(/\D/g, '');
      
      if (cleanPhone.length > 0 && cleanPhone.length !== 10) {
        return showToast.error("Enter valid 10-digit number");
      }
      
      if (cleanPhone.length === 10) {
        dispatch(searchCustomerByPhone(cleanPhone));
      } else {
        dispatch(clearCustomerState());
        dispatch(fetchCustomersWithPayments());
      }
    } else {
      if (searchTerm.trim()) {
        dispatch(searchCustomerByCustomerId(searchTerm.trim()));
      } else {
        dispatch(clearCustomerState());
        dispatch(fetchCustomersWithPayments());
      }
    }
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    
    if (searchType === "phone") {
      const cleaned = value.replace(/\D/g, '').slice(0, 10);
      setSearchTerm(cleaned);
      
      if (cleaned.length === 0) {
        dispatch(clearCustomerState());
        dispatch(fetchCustomersWithPayments());
      }
    } else {
      setSearchTerm(value);
      
      if (value.length === 0) {
        dispatch(clearCustomerState());
        dispatch(fetchCustomersWithPayments());
      }
    }
  };

  // Filter customers based on search
  const filteredCustomers = searchTerm && customers?.length > 0
    ? customers.filter(c => 
        searchType === "phone" 
          ? c.phone?.includes(searchTerm)
          : c.customerId?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : customers;

  // Pagination calculations
  const totalItems = filteredCustomers?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers?.slice(startIndex, endIndex) || [];

  // Pagination handlers
  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Get customer full name
  const getCustomerName = (customer) => {
    if (customer.name) return customer.name;
    return `${customer.salutation || ''} ${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Unknown';
  };

  // Navigate to customer details
  const viewCustomerDetails = (customerId) => {
    navigate(`${rolePath}/customers/${customerId}`);
  };

  // Navigate to add customer page
  const goToAddCustomer = () => {
    navigate(`${rolePath}/add-customer`);
  };

  // Navigate to create order
  const goToCreateOrder = (customer) => {
    navigate(`${rolePath}/orders/new`, { state: { customer } });
  };

  // Toggle payment info display
  const togglePaymentInfo = (customerId, e) => {
    e.stopPropagation();
    setShowPaymentInfo(prev => ({
      ...prev,
      [customerId]: !prev[customerId]
    }));
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Handle Export Customers
  const handleExport = async () => {
    try {
      await dispatch(exportCustomers()).unwrap();
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  // Handle Import Customers
  const handleImport = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (!validTypes.includes(file.type)) {
      showToast.error('Please upload a valid Excel file (.xlsx or .xls)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      showToast.error('File size should be less than 5MB');
      return;
    }
    
    setImporting(true);
    try {
      await dispatch(importCustomers(file)).unwrap();
      dispatch(fetchCustomersWithPayments());
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error("Import failed:", error);
    } finally {
      setImporting(false);
    }
  };

  // Get payment data from customer.paymentSummary
  const getPaymentData = (customer) => {
    if (customer.paymentSummary) {
      return {
        totalPaid: customer.paymentSummary.totalPaid || 0,
        lastPayment: customer.paymentSummary.lastPayment?.amount || 0,
        paymentCount: customer.paymentSummary.paymentCount || 0,
        pendingAmount: customer.paymentSummary.pendingOrders || 0,
        byMethod: customer.paymentSummary.byMethod || {}
      };
    }
    return {
      totalPaid: 0,
      lastPayment: 0,
      paymentCount: 0,
      pendingAmount: 0,
      byMethod: {}
    };
  };

  // Get order data for a customer
  const getOrderData = (customerId) => {
    return customerOrders[customerId] || {
      count: 0,
      orders: [],
      totalValue: 0,
      completedOrders: 0,
      pendingOrders: 0
    };
  };

  // Check if orders are loading for a customer
  const isOrdersLoading = (customerId) => {
    return ordersLoading[customerId] || false;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-black text-slate-800 tracking-tighter">Customers</h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg p-4">
            <div className="space-y-2">
              <button
                onClick={() => {
                  navigate(rolePath);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-xl font-medium"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  navigate(`${rolePath}/orders`);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-xl font-medium"
              >
                Orders
              </button>
              <button
                onClick={() => {
                  navigate(`${rolePath}/payments`);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-xl font-medium"
              >
                Payments
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header Section */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 p-4 sm:p-6 lg:p-8 mb-4 sm:mb-6 lg:mb-8">
          <div className="space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tighter uppercase">
                Customers
              </h1>
              <p className="text-sm sm:text-base text-slate-500 font-medium mt-1">
                Search, view, and manage your customers
              </p>
            </div>

            <div className="space-y-3 sm:space-y-4 lg:space-y-0 lg:flex lg:items-center lg:gap-3">
              {/* Search Type Toggle */}
              <div className="flex bg-slate-100 p-1 rounded-xl sm:rounded-2xl w-full lg:w-auto">
                <button
                  onClick={() => setSearchType("phone")}
                  className={`flex-1 lg:flex-none px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all ${
                    searchType === "phone" 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Phone size={14} className="inline mr-1 sm:mr-1.5" />
                  <span className="hidden xs:inline">Phone</span>
                </button>
                <button
                  onClick={() => setSearchType("id")}
                  className={`flex-1 lg:flex-none px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all ${
                    searchType === "id" 
                      ? "bg-white text-blue-600 shadow-sm" 
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Hash size={14} className="inline mr-1 sm:mr-1.5" />
                  <span className="hidden xs:inline">ID</span>
                </button>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="flex gap-2 w-full lg:w-auto">
                <div className="relative flex-1 lg:w-80">
                  {searchType === "phone" ? (
                    <Phone className="absolute left-3 sm:left-4 top-2.5 sm:top-3.5 text-slate-400" size={16} />
                  ) : (
                    <Hash className="absolute left-3 sm:left-4 top-2.5 sm:top-3.5 text-slate-400" size={16} />
                  )}
                  <input 
                    type="text" 
                    placeholder={searchType === "phone" ? "Phone number..." : "Customer ID..."}
                    className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl sm:rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm sm:text-base"
                    value={searchTerm} 
                    onChange={handleInputChange}
                    maxLength={searchType === "phone" ? 10 : undefined}
                  />
                </div>
                <button 
                  type="submit" 
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 whitespace-nowrap"
                  disabled={loading}
                >
                  {loading ? "..." : "Search"}
                </button>
              </form>
              
              {/* Action Buttons */}
              <div className="flex gap-2 w-full lg:w-auto">
                <button
                  onClick={handleExport}
                  disabled={importExportLoading}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all shadow-lg shadow-green-500/25 disabled:opacity-50"
                  title="Export customers to Excel"
                >
                  <Download size={18} />
                  <span className="hidden xs:inline">Export</span>
                </button>
                
                <label
                  className={`flex-1 lg:flex-none flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all shadow-lg shadow-purple-500/25 cursor-pointer ${importing ? 'opacity-50' : ''}`}
                  title="Import customers from Excel"
                >
                  <Upload size={18} />
                  <span className="hidden xs:inline">Import</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleImport}
                    className="hidden"
                    disabled={importing}
                  />
                </label>
                
                <button
                  onClick={goToAddCustomer}
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base transition-all shadow-lg shadow-blue-500/25"
                >
                  <PlusCircle size={18} />
                  <span className="hidden xs:inline">Add New</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search Result Info */}
        {searchTerm && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              {searchType === "phone" ? (
                <Phone size={16} className="text-blue-600" />
              ) : (
                <Hash size={16} className="text-blue-600" />
              )}
              <span className="text-xs sm:text-sm font-medium text-slate-700">
                Search results for <span className="font-black text-blue-600">{searchTerm}</span>
              </span>
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full font-bold self-start sm:self-auto">
              {filteredCustomers?.length || 0} found
            </span>
          </div>
        )}

        {/* Customers List */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <User size={20} className="text-blue-600" />
              <h2 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-tight">
                All Customers
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-slate-100 text-slate-600 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold">
                {totalItems} Total
              </span>
              {/* Items per page selector */}
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="bg-slate-100 text-slate-700 px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-xs sm:text-sm font-medium border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-16">
              <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3 sm:mb-4"></div>
              <p className="text-sm sm:text-base text-slate-500 font-medium">Loading customers...</p>
            </div>
          ) : currentCustomers.length > 0 ? (
            <>
              <div className="divide-y divide-slate-100">
                {currentCustomers.map((customer) => {
                  const customerName = getCustomerName(customer);
                  const showPayment = showPaymentInfo[customer._id];
                  const paymentData = getPaymentData(customer);
                  const orderData = getOrderData(customer._id);
                  const loadingOrders = isOrdersLoading(customer._id);
                  
                  return (
                    <div 
                      key={customer._id} 
                      className="p-3 sm:p-4 lg:p-5 hover:bg-slate-50 transition-all cursor-pointer"
                      onClick={() => viewCustomerDetails(customer._id)}
                    >
                      <div className="space-y-3 sm:space-y-4">
                        {/* Main Row */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                          <div className="flex items-start gap-3 sm:gap-4 w-full">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
                              <span className="text-base sm:text-lg lg:text-xl font-black">
                                {customerName?.charAt(0) || 'C'}
                              </span>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className="font-black text-slate-800 text-sm sm:text-base lg:text-lg mb-1 truncate">
                                {customerName}
                              </h3>
                              
                              {customer.customerId && (
                                <div className="flex items-center gap-1 mb-2">
                                  <Hash size={10} className="text-blue-500" />
                                  <span className="text-[10px] sm:text-xs font-mono text-blue-600 bg-blue-50 px-1.5 sm:px-2 py-0.5 rounded-full truncate max-w-[150px] sm:max-w-none">
                                    {customer.customerId}
                                  </span>
                                </div>
                              )}
                              
                              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                <span className="inline-flex items-center gap-1 bg-slate-100 px-2 sm:px-3 py-1 rounded-full">
                                  <Phone size={10} className="text-blue-600" />
                                  <span className="text-[10px] sm:text-xs font-medium text-slate-700">
                                    {customer.phone}
                                  </span>
                                </span>
                                
                                <span className="inline-flex items-center gap-1 bg-purple-50 px-2 sm:px-3 py-1 rounded-full">
                                  <Package size={10} className="text-purple-600" />
                                  <span className="text-[10px] sm:text-xs font-medium text-purple-700">
                                    {loadingOrders ? (
                                      <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></span>
                                      </span>
                                    ) : (
                                      `${orderData.count}`
                                    )}
                                  </span>
                                </span>
                                
                                <button
                                  onClick={(e) => togglePaymentInfo(customer._id, e)}
                                  className="inline-flex items-center gap-1 bg-green-50 px-2 sm:px-3 py-1 rounded-full hover:bg-green-100"
                                >
                                  <IndianRupee size={10} className="text-green-600" />
                                  <span className="text-[10px] sm:text-xs font-medium text-green-700">
                                    {formatCurrency(paymentData.totalPaid)}
                                  </span>
                                </button>
                                
                                <span className="hidden xs:flex items-center gap-1 text-[10px] sm:text-xs text-slate-400">
                                  <Calendar size={10} />
                                  {formatDate(customer.createdAt)}
                                </span>
                              </div>
                              
                              {customer.address && (
                                <p className="hidden sm:flex text-[10px] sm:text-xs text-slate-400 mt-2 items-center gap-1 truncate">
                                  <MapPin size={10} className="flex-shrink-0" />
                                  <span className="truncate">{customer.address}</span>
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 sm:self-center">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                goToCreateOrder(customer);
                              }}
                              className="flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold transition-all shadow-lg text-xs sm:text-sm whitespace-nowrap"
                            >
                              <ShoppingBag size={12} />
                              <span className="hidden xs:inline">New</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                viewCustomerDetails(customer._id);
                              }}
                              className="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold transition-all shadow-lg text-xs sm:text-sm"
                            >
                              <Eye size={12} />
                              <span className="hidden xs:inline">View</span>
                            </button>
                          </div>
                        </div>

                        {/* Payment Details Dropdown */}
                        {showPayment && (
                          <div className="mt-3 pt-3 border-t border-slate-100">
                            {Object.keys(paymentData.byMethod).length > 0 && (
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mb-3">
                                {Object.entries(paymentData.byMethod).map(([method, amount]) => (
                                  amount > 0 && (
                                    <div key={method} className="bg-slate-50 p-1.5 sm:p-2 rounded-lg">
                                      <p className="text-[10px] text-slate-500 capitalize">{method}</p>
                                      <p className="text-xs sm:text-sm font-bold text-slate-700">{formatCurrency(amount)}</p>
                                    </div>
                                  )
                                ))}
                              </div>
                            )}
                            
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                              <div className="bg-blue-50 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                                <p className="text-[10px] text-blue-600 font-bold mb-0.5">Total Paid</p>
                                <p className="text-sm sm:text-base font-black text-blue-700">{formatCurrency(paymentData.totalPaid)}</p>
                              </div>
                              <div className="bg-green-50 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                                <p className="text-[10px] text-green-600 font-bold mb-0.5">Last Payment</p>
                                <p className="text-sm sm:text-base font-black text-green-700">{formatCurrency(paymentData.lastPayment)}</p>
                              </div>
                              <div className="bg-purple-50 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                                <p className="text-[10px] text-purple-600 font-bold mb-0.5">Payments</p>
                                <p className="text-sm sm:text-base font-black text-purple-700">{paymentData.paymentCount}</p>
                              </div>
                              <div className="bg-orange-50 p-2 sm:p-3 rounded-lg sm:rounded-xl">
                                <p className="text-[10px] text-orange-600 font-bold mb-0.5">Pending</p>
                                <p className="text-sm sm:text-base font-black text-orange-700">{orderData.pendingOrders}</p>
                              </div>
                            </div>

                            {!loadingOrders && orderData.orders.length > 0 && (
                              <div className="hidden sm:block mt-4">
                                <p className="text-xs font-bold text-slate-500 mb-2 flex items-center gap-1">
                                  <Package size={12} />
                                  Recent Orders
                                </p>
                                <div className="space-y-2">
                                  {orderData.orders.slice(0, 2).map(order => (
                                    <div key={order._id} className="flex items-center justify-between bg-slate-50 p-2 rounded-lg text-xs">
                                      <div className="flex items-center gap-2">
                                        <span className="font-mono font-bold text-indigo-600">{order.orderId}</span>
                                        <span className={`px-1.5 py-0.5 rounded-full ${
                                          order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                          order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                                          order.status === 'in-progress' ? 'bg-orange-100 text-orange-700' :
                                          'bg-slate-100 text-slate-700'
                                        }`}>
                                          {order.status}
                                        </span>
                                      </div>
                                      <span className="font-bold text-blue-600">
                                        ₹{(order.priceSummary?.totalMax || 0).toLocaleString('en-IN')}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-4 sm:px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs sm:text-sm text-slate-500">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(endIndex, totalItems)}</span> of{" "}
                    <span className="font-medium">{totalItems}</span> customers
                  </div>
                  
                  <div className="flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-1.5 sm:p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg font-medium text-sm transition-all ${
                              currentPage === pageNum
                                ? "bg-blue-600 text-white shadow-md"
                                : "hover:bg-slate-100 text-slate-600"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-1.5 sm:p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-12 sm:py-16 px-4">
              <User size={40} className="text-slate-300 mx-auto mb-3 sm:mb-4" />
              <p className="text-lg sm:text-xl font-black text-slate-400">No Customers Found</p>
              <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-sm mx-auto">
                {searchTerm 
                  ? `No customer with ${searchType === "phone" ? "phone" : "ID"} ${searchTerm}` 
                  : 'Register your first customer to get started'}
              </p>
              <button
                onClick={goToAddCustomer}
                className="mt-4 sm:mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold uppercase tracking-wider shadow-lg shadow-blue-500/30 transition-all text-sm sm:text-base"
              >
                Add New Customer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}