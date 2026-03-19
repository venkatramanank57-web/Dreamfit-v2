// // Pages/works/WorksPage.jsx
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import {
//   Briefcase,
//   RefreshCw,
//   Plus,
//   Search,
//   Filter,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   Eye,
//   Trash2,
//   Clock,
//   Calendar,
//   AlertCircle,
//   CheckCircle,
//   Scissors,
//   Ruler,
//   Truck
// } from 'lucide-react';
// import { 
//   fetchWorks, 
//   fetchWorkStats,
//   deleteWorkById,
//   setFilters,
//   resetFilters,
//   selectAllWorks,
//   selectWorkStats,
//   selectWorkPagination,
//   selectWorkFilters,
//   selectWorkLoading
// } from '../../features/work/workSlice';
// import WorkFilters from '../../components/works/WorkFilters';
// import showToast from '../../utils/toast';

// export default function WorksPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
  
//   const works = useSelector(selectAllWorks);
//   const stats = useSelector(selectWorkStats);
//   const pagination = useSelector(selectWorkPagination);
//   const filters = useSelector(selectWorkFilters);
//   const loading = useSelector(selectWorkLoading);
//   const { user } = useSelector((state) => state.auth);

//   const [searchQuery, setSearchQuery] = useState('');
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedStatus, setSelectedStatus] = useState('all');

//   const isAdmin = user?.role === 'ADMIN';
//   const canDelete = isAdmin;

//   useEffect(() => {
//     loadData();
//   }, [filters, dispatch]);

//   const loadData = () => {
//     dispatch(fetchWorks());
//     dispatch(fetchWorkStats());
//   };

//   const handleRefresh = () => {
//     loadData();
//     showToast.success('Data refreshed');
//   };

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);
//     dispatch(setFilters({ search: e.target.value, page: 1 }));
//   };

//   const handleStatusFilter = (status) => {
//     setSelectedStatus(status);
//     if (status === 'all') {
//       dispatch(setFilters({ status: '' }));
//     } else {
//       dispatch(setFilters({ status }));
//     }
//   };

//   const handlePageChange = (newPage) => {
//     dispatch(setFilters({ page: newPage }));
//   };

//   const handleViewWork = (id) => {
//     navigate(`/admin/works/${id}`);
//   };

//   const handleDeleteWork = async (id) => {
//     if (window.confirm('Are you sure you want to delete this work?')) {
//       dispatch(deleteWorkById(id));
//     }
//   };

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
//       'accepted': 'bg-blue-100 text-blue-700 border-blue-200',
//       'cutting-started': 'bg-purple-100 text-purple-700 border-purple-200',
//       'cutting-completed': 'bg-indigo-100 text-indigo-700 border-indigo-200',
//       'sewing-started': 'bg-pink-100 text-pink-700 border-pink-200',
//       'sewing-completed': 'bg-teal-100 text-teal-700 border-teal-200',
//       'ironing': 'bg-orange-100 text-orange-700 border-orange-200',
//       'ready-to-deliver': 'bg-green-100 text-green-700 border-green-200'
//     };
//     return colors[status] || 'bg-slate-100 text-slate-700 border-slate-200';
//   };

//   const getStatusIcon = (status) => {
//     switch(status) {
//       case 'pending': return <Clock size={16} />;
//       case 'accepted': return <CheckCircle size={16} />;
//       case 'cutting-started': return <Scissors size={16} />;
//       case 'cutting-completed': return <Scissors size={16} />;
//       case 'sewing-started': return <Ruler size={16} />;
//       case 'sewing-completed': return <Ruler size={16} />;
//       case 'ironing': return <Truck size={16} />;
//       case 'ready-to-deliver': return <CheckCircle size={16} />;
//       default: return <Briefcase size={16} />;
//     }
//   };

//   const isOverdue = (date) => {
//     return new Date(date) < new Date();
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-6">
//       {/* Header */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-black text-slate-800 mb-2">Work Management</h1>
//             <p className="text-slate-600">Track and manage all production works</p>
//           </div>
//           <button
//             onClick={handleRefresh}
//             className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
//             title="Refresh"
//           >
//             <RefreshCw size={20} className={loading ? 'animate-spin text-blue-600' : 'text-slate-600'} />
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
//           <p className="text-sm text-slate-500">Total Works</p>
//           <p className="text-2xl font-bold text-slate-800">{stats.totalWorks || 0}</p>
//         </div>
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-yellow-500">
//           <p className="text-sm text-slate-500">Pending</p>
//           <p className="text-2xl font-bold text-yellow-600">{stats.pendingWorks || 0}</p>
//         </div>
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
//           <p className="text-sm text-slate-500">Ready to Deliver</p>
//           <p className="text-2xl font-bold text-green-600">{stats.readyToDeliver || 0}</p>
//         </div>
//         <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-500">
//           <p className="text-sm text-slate-500">Overdue</p>
//           <p className="text-2xl font-bold text-red-600">{stats.overdueWorks || 0}</p>
//         </div>
//       </div>

//       {/* Filters Bar */}
//       <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
//         <div className="flex flex-wrap gap-4 items-center justify-between">
//           {/* Status Tabs */}
//           <div className="flex gap-2 bg-slate-100 p-1 rounded-lg overflow-x-auto">
//             <button
//               onClick={() => handleStatusFilter('all')}
//               className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
//                 selectedStatus === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
//               }`}
//             >
//               All
//             </button>
//             <button
//               onClick={() => handleStatusFilter('pending')}
//               className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
//                 selectedStatus === 'pending' ? 'bg-white text-yellow-600 shadow-sm' : 'text-slate-600'
//               }`}
//             >
//               Pending
//             </button>
//             <button
//               onClick={() => handleStatusFilter('accepted')}
//               className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
//                 selectedStatus === 'accepted' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
//               }`}
//             >
//               Accepted
//             </button>
//             <button
//               onClick={() => handleStatusFilter('cutting-started')}
//               className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
//                 selectedStatus === 'cutting-started' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-600'
//               }`}
//             >
//               Cutting
//             </button>
//             <button
//               onClick={() => handleStatusFilter('sewing-started')}
//               className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
//                 selectedStatus === 'sewing-started' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-600'
//               }`}
//             >
//               Sewing
//             </button>
//             <button
//               onClick={() => handleStatusFilter('ready-to-deliver')}
//               className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
//                 selectedStatus === 'ready-to-deliver' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-600'
//               }`}
//             >
//               Ready
//             </button>
//           </div>

//           {/* Search and Filter */}
//           <div className="flex gap-3">
//             <div className="relative">
//               <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={handleSearch}
//                 placeholder="Search by Work ID..."
//                 className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64"
//               />
//             </div>
//             <button
//               onClick={() => setShowFilters(!showFilters)}
//               className={`p-2 rounded-lg border transition-all ${
//                 showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-slate-200 text-slate-600'
//               }`}
//             >
//               <Filter size={18} />
//             </button>
//           </div>
//         </div>

//         {/* Advanced Filters */}
//         {showFilters && (
//           <div className="mt-4 pt-4 border-t border-slate-100">
//             <WorkFilters />
//           </div>
//         )}
//       </div>

//       {/* Works Table */}
//       <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-slate-50 border-b border-slate-200">
//               <tr>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Work ID</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Garment</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Customer</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Cutting Master</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Tailor</th>
//                 <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Est. Delivery</th>
//                 <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {works.map((work) => (
//                 <tr key={work._id} className="hover:bg-slate-50 transition-all">
//                   <td className="px-6 py-4">
//                     <span className="font-mono text-sm font-medium text-blue-600">{work.workId}</span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div>
//                       <p className="font-medium text-slate-800">{work.garment?.name}</p>
//                       <p className="text-xs text-slate-500">ID: {work.garment?.garmentId}</p>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <p className="text-sm text-slate-800">{work.order?.customer?.name || 'N/A'}</p>
//                   </td>
//                   <td className="px-6 py-4">
//                     <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
//                       {getStatusIcon(work.status)}
//                       {work.status?.replace(/-/g, ' ')}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4">
//                     <p className="text-sm text-slate-800">{work.cuttingMaster?.name || 'Not assigned'}</p>
//                   </td>
//                   <td className="px-6 py-4">
//                     <p className="text-sm text-slate-800">{work.tailor?.name || 'Not assigned'}</p>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center gap-2">
//                       <Calendar size={14} className="text-slate-400" />
//                       <span className={`text-sm ${isOverdue(work.estimatedDelivery) && work.status !== 'ready-to-deliver' ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
//                         {formatDate(work.estimatedDelivery)}
//                       </span>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="flex items-center justify-center gap-2">
//                       <button
//                         onClick={() => handleViewWork(work._id)}
//                         className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//                         title="View Details"
//                       >
//                         <Eye size={18} />
//                       </button>
//                       {canDelete && (
//                         <button
//                           onClick={() => handleDeleteWork(work._id)}
//                           className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
//                           title="Delete"
//                         >
//                           <Trash2 size={18} />
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}

//               {works.length === 0 && (
//                 <tr>
//                   <td colSpan="8" className="px-6 py-12 text-center">
//                     <div className="flex flex-col items-center">
//                       <Briefcase size={48} className="text-slate-300 mb-3" />
//                       <p className="text-slate-500 font-medium">No works found</p>
//                       <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {pagination.pages > 1 && (
//           <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
//             <p className="text-sm text-slate-600">
//               Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
//               {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
//             </p>
//             <div className="flex gap-2">
//               <button
//                 onClick={() => handlePageChange(pagination.page - 1)}
//                 disabled={pagination.page === 1}
//                 className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
//               >
//                 <ChevronLeft size={18} />
//               </button>
//               <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium">
//                 Page {pagination.page} of {pagination.pages}
//               </span>
//               <button
//                 onClick={() => handlePageChange(pagination.page + 1)}
//                 disabled={pagination.page === pagination.pages}
//                 className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
//               >
//                 <ChevronRight size={18} />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }















// // Pages/works/WorksPage.jsx
// import React, { useState, useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import {
//   Briefcase,
//   RefreshCw,
//   Plus,
//   Search,
//   Filter,
//   X,
//   ChevronLeft,
//   ChevronRight,
//   Eye,
//   Trash2,
//   Clock,
//   Calendar,
//   AlertCircle,
//   CheckCircle,
//   Scissors,
//   Ruler,
//   Truck,
//   Menu
// } from 'lucide-react';
// import { 
//   fetchWorks, 
//   fetchWorkStats,
//   deleteWorkById,
//   setFilters,
//   resetFilters,
//   selectAllWorks,
//   selectWorkStats,
//   selectWorkPagination,
//   selectWorkFilters,
//   selectWorkLoading
// } from '../../features/work/workSlice';
// import WorkFilters from '../../components/works/WorkFilters';
// import showToast from '../../utils/toast';

// export default function WorksPage() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
  
//   const works = useSelector(selectAllWorks);
//   const stats = useSelector(selectWorkStats);
//   const pagination = useSelector(selectWorkPagination);
//   const filters = useSelector(selectWorkFilters);
//   const loading = useSelector(selectWorkLoading);
//   const { user } = useSelector((state) => state.auth);

//   const [searchQuery, setSearchQuery] = useState('');
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedStatus, setSelectedStatus] = useState('all');
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

//   const isAdmin = user?.role === 'ADMIN';
//   const canDelete = isAdmin;

//   useEffect(() => {
//     loadData();
//   }, [filters, dispatch]);

//   const loadData = () => {
//     dispatch(fetchWorks());
//     dispatch(fetchWorkStats());
//   };

//   const handleRefresh = () => {
//     loadData();
//     showToast.success('Data refreshed');
//   };

//   const handleSearch = (e) => {
//     setSearchQuery(e.target.value);
//     dispatch(setFilters({ search: e.target.value, page: 1 }));
//   };

//   const handleStatusFilter = (status) => {
//     setSelectedStatus(status);
//     if (status === 'all') {
//       dispatch(setFilters({ status: '' }));
//     } else {
//       dispatch(setFilters({ status }));
//     }
//     setMobileFiltersOpen(false);
//   };

//   const handlePageChange = (newPage) => {
//     dispatch(setFilters({ page: newPage }));
//   };

//   const handleViewWork = (id) => {
//     navigate(`/admin/works/${id}`);
//   };

//   const handleDeleteWork = async (id) => {
//     if (window.confirm('Are you sure you want to delete this work?')) {
//       dispatch(deleteWorkById(id));
//     }
//   };

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
//       'accepted': 'bg-blue-100 text-blue-700 border-blue-200',
//       'cutting-started': 'bg-purple-100 text-purple-700 border-purple-200',
//       'cutting-completed': 'bg-indigo-100 text-indigo-700 border-indigo-200',
//       'sewing-started': 'bg-pink-100 text-pink-700 border-pink-200',
//       'sewing-completed': 'bg-teal-100 text-teal-700 border-teal-200',
//       'ironing': 'bg-orange-100 text-orange-700 border-orange-200',
//       'ready-to-deliver': 'bg-green-100 text-green-700 border-green-200'
//     };
//     return colors[status] || 'bg-slate-100 text-slate-700 border-slate-200';
//   };

//   const getStatusIcon = (status) => {
//     switch(status) {
//       case 'pending': return <Clock size={14} />;
//       case 'accepted': return <CheckCircle size={14} />;
//       case 'cutting-started': return <Scissors size={14} />;
//       case 'cutting-completed': return <Scissors size={14} />;
//       case 'sewing-started': return <Ruler size={14} />;
//       case 'sewing-completed': return <Ruler size={14} />;
//       case 'ironing': return <Truck size={14} />;
//       case 'ready-to-deliver': return <CheckCircle size={14} />;
//       default: return <Briefcase size={14} />;
//     }
//   };

//   const isOverdue = (date) => {
//     return new Date(date) < new Date();
//   };

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* Mobile Header */}
//       <div className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-30">
//         <div className="flex items-center justify-between px-4 py-3">
//           <h1 className="text-xl font-black text-slate-800">Works</h1>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
//               className="p-2 hover:bg-slate-100 rounded-xl transition-all"
//             >
//               <Filter size={20} />
//             </button>
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="p-2 hover:bg-slate-100 rounded-xl transition-all"
//             >
//               <Menu size={20} />
//             </button>
//           </div>
//         </div>
        
//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg p-4 z-40">
//             <div className="space-y-2">
//               <button
//                 onClick={handleRefresh}
//                 className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100 rounded-xl font-medium"
//               >
//                 <RefreshCw size={18} className={loading ? 'animate-spin text-blue-600' : ''} />
//                 Refresh Data
//               </button>
//               <button
//                 onClick={() => {
//                   navigate('/admin/dashboard');
//                   setMobileMenuOpen(false);
//                 }}
//                 className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-xl font-medium"
//               >
//                 Dashboard
//               </button>
//               <button
//                 onClick={() => {
//                   navigate('/admin/orders');
//                   setMobileMenuOpen(false);
//                 }}
//                 className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-xl font-medium"
//               >
//                 Orders
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Mobile Filters Panel */}
//         {mobileFiltersOpen && (
//           <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg p-4 z-40 max-h-[80vh] overflow-y-auto">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="font-bold text-slate-800">Filter Works</h3>
//               <button
//                 onClick={() => setMobileFiltersOpen(false)}
//                 className="p-1 hover:bg-slate-100 rounded-lg"
//               >
//                 <X size={18} />
//               </button>
//             </div>
            
//             <div className="space-y-3">
//               <div>
//                 <label className="text-xs font-bold text-slate-500 mb-1 block">Search</label>
//                 <div className="relative">
//                   <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
//                   <input
//                     type="text"
//                     value={searchQuery}
//                     onChange={handleSearch}
//                     placeholder="Search by Work ID..."
//                     className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="text-xs font-bold text-slate-500 mb-1 block">Status</label>
//                 <div className="grid grid-cols-2 gap-2">
//                   {['all', 'pending', 'accepted', 'cutting-started', 'sewing-started', 'ready-to-deliver'].map((status) => (
//                     <button
//                       key={status}
//                       onClick={() => handleStatusFilter(status)}
//                       className={`px-3 py-2 rounded-lg text-xs font-medium ${
//                         selectedStatus === status 
//                           ? 'bg-blue-600 text-white' 
//                           : 'bg-slate-100 text-slate-600'
//                       }`}
//                     >
//                       {status === 'all' ? 'All' : status.replace(/-/g, ' ')}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="pt-2">
//                 <WorkFilters />
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
//         {/* Desktop Header - Hidden on Mobile */}
//         <div className="hidden lg:flex items-center justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-black text-slate-800 mb-2">Work Management</h1>
//             <p className="text-slate-600">Track and manage all production works</p>
//           </div>
//           <button
//             onClick={handleRefresh}
//             className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
//             title="Refresh"
//           >
//             <RefreshCw size={20} className={loading ? 'animate-spin text-blue-600' : 'text-slate-600'} />
//           </button>
//         </div>

//         {/* Stats Cards - Responsive Grid */}
//         <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
//           <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border-l-4 border-blue-500">
//             <p className="text-xs sm:text-sm text-slate-500">Total Works</p>
//             <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">{stats.totalWorks || 0}</p>
//           </div>
//           <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border-l-4 border-yellow-500">
//             <p className="text-xs sm:text-sm text-slate-500">Pending</p>
//             <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600">{stats.pendingWorks || 0}</p>
//           </div>
//           <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border-l-4 border-green-500">
//             <p className="text-xs sm:text-sm text-slate-500">Ready to Deliver</p>
//             <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{stats.readyToDeliver || 0}</p>
//           </div>
//           <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border-l-4 border-red-500">
//             <p className="text-xs sm:text-sm text-slate-500">Overdue</p>
//             <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">{stats.overdueWorks || 0}</p>
//           </div>
//         </div>

//         {/* Desktop Filters Bar - Hidden on Mobile */}
//         <div className="hidden lg:block bg-white rounded-xl p-4 mb-6 shadow-sm">
//           <div className="flex flex-wrap gap-4 items-center justify-between">
//             {/* Status Tabs */}
//             <div className="flex gap-2 bg-slate-100 p-1 rounded-lg overflow-x-auto">
//               <button
//                 onClick={() => handleStatusFilter('all')}
//                 className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
//                   selectedStatus === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
//                 }`}
//               >
//                 All
//               </button>
//               <button
//                 onClick={() => handleStatusFilter('pending')}
//                 className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
//                   selectedStatus === 'pending' ? 'bg-white text-yellow-600 shadow-sm' : 'text-slate-600'
//                 }`}
//               >
//                 Pending
//               </button>
//               <button
//                 onClick={() => handleStatusFilter('accepted')}
//                 className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
//                   selectedStatus === 'accepted' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
//                 }`}
//               >
//                 Accepted
//               </button>
//               <button
//                 onClick={() => handleStatusFilter('cutting-started')}
//                 className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
//                   selectedStatus === 'cutting-started' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-600'
//                 }`}
//               >
//                 Cutting
//               </button>
//               <button
//                 onClick={() => handleStatusFilter('sewing-started')}
//                 className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
//                   selectedStatus === 'sewing-started' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-600'
//                 }`}
//               >
//                 Sewing
//               </button>
//               <button
//                 onClick={() => handleStatusFilter('ready-to-deliver')}
//                 className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
//                   selectedStatus === 'ready-to-deliver' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-600'
//                 }`}
//               >
//                 Ready
//               </button>
//             </div>

//             {/* Search and Filter */}
//             <div className="flex gap-3">
//               <div className="relative">
//                 <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={handleSearch}
//                   placeholder="Search by Work ID..."
//                   className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64"
//                 />
//               </div>
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className={`p-2 rounded-lg border transition-all ${
//                   showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-slate-200 text-slate-600'
//                 }`}
//               >
//                 <Filter size={18} />
//               </button>
//             </div>
//           </div>

//           {/* Advanced Filters */}
//           {showFilters && (
//             <div className="mt-4 pt-4 border-t border-slate-100">
//               <WorkFilters />
//             </div>
//           )}
//         </div>

//         {/* Mobile View - Cards */}
//         <div className="lg:hidden space-y-3">
//           {works.length === 0 ? (
//             <div className="bg-white rounded-xl p-8 text-center">
//               <Briefcase size={40} className="text-slate-300 mx-auto mb-3" />
//               <p className="text-slate-500 font-medium">No works found</p>
//               <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
//             </div>
//           ) : (
//             works.map((work) => (
//               <div key={work._id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
//                 <div className="flex items-start justify-between mb-3">
//                   <div>
//                     <span className="font-mono text-sm font-bold text-blue-600">{work.workId}</span>
//                     <h3 className="font-medium text-slate-800 mt-1">{work.garment?.name}</h3>
//                   </div>
//                   <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
//                     {getStatusIcon(work.status)}
//                     <span className="capitalize">{work.status?.replace(/-/g, ' ')}</span>
//                   </span>
//                 </div>

//                 <div className="grid grid-cols-2 gap-3 text-sm mb-3">
//                   <div>
//                     <p className="text-xs text-slate-400">Customer</p>
//                     <p className="font-medium truncate">{work.order?.customer?.name || 'N/A'}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-400">Garment ID</p>
//                     <p className="font-mono text-xs">{work.garment?.garmentId}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-400">Cutting Master</p>
//                     <p className="text-sm truncate">{work.cuttingMaster?.name || 'Not assigned'}</p>
//                   </div>
//                   <div>
//                     <p className="text-xs text-slate-400">Tailor</p>
//                     <p className="text-sm truncate">{work.tailor?.name || 'Not assigned'}</p>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-between pt-3 border-t border-slate-100">
//                   <div className="flex items-center gap-2">
//                     <Calendar size={14} className="text-slate-400" />
//                     <span className={`text-xs ${isOverdue(work.estimatedDelivery) && work.status !== 'ready-to-deliver' ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
//                       {formatDate(work.estimatedDelivery)}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => handleViewWork(work._id)}
//                       className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//                       title="View Details"
//                     >
//                       <Eye size={16} />
//                     </button>
//                     {canDelete && (
//                       <button
//                         onClick={() => handleDeleteWork(work._id)}
//                         className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
//                         title="Delete"
//                       >
//                         <Trash2 size={16} />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>

//         {/* Desktop Works Table - Hidden on Mobile */}
//         <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-slate-50 border-b border-slate-200">
//                 <tr>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Work ID</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Garment</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Customer</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Cutting Master</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Tailor</th>
//                   <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Est. Delivery</th>
//                   <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {works.map((work) => (
//                   <tr key={work._id} className="hover:bg-slate-50 transition-all">
//                     <td className="px-6 py-4">
//                       <span className="font-mono text-sm font-medium text-blue-600">{work.workId}</span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div>
//                         <p className="font-medium text-slate-800">{work.garment?.name}</p>
//                         <p className="text-xs text-slate-500">ID: {work.garment?.garmentId}</p>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <p className="text-sm text-slate-800">{work.order?.customer?.name || 'N/A'}</p>
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
//                         {getStatusIcon(work.status)}
//                         {work.status?.replace(/-/g, ' ')}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                       <p className="text-sm text-slate-800">{work.cuttingMaster?.name || 'Not assigned'}</p>
//                     </td>
//                     <td className="px-6 py-4">
//                       <p className="text-sm text-slate-800">{work.tailor?.name || 'Not assigned'}</p>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-2">
//                         <Calendar size={14} className="text-slate-400" />
//                         <span className={`text-sm ${isOverdue(work.estimatedDelivery) && work.status !== 'ready-to-deliver' ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
//                           {formatDate(work.estimatedDelivery)}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="flex items-center justify-center gap-2">
//                         <button
//                           onClick={() => handleViewWork(work._id)}
//                           className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
//                           title="View Details"
//                         >
//                           <Eye size={18} />
//                         </button>
//                         {canDelete && (
//                           <button
//                             onClick={() => handleDeleteWork(work._id)}
//                             className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
//                             title="Delete"
//                           >
//                             <Trash2 size={18} />
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}

//                 {works.length === 0 && (
//                   <tr>
//                     <td colSpan="8" className="px-6 py-12 text-center">
//                       <div className="flex flex-col items-center">
//                         <Briefcase size={48} className="text-slate-300 mb-3" />
//                         <p className="text-slate-500 font-medium">No works found</p>
//                         <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Pagination - Responsive */}
//         {pagination.pages > 1 && (
//           <div className="mt-4 sm:mt-6 bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-slate-100">
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
//               <p className="text-xs sm:text-sm text-slate-600 order-2 sm:order-1">
//                 Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
//                 {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
//               </p>
//               <div className="flex gap-2 order-1 sm:order-2">
//                 <button
//                   onClick={() => handlePageChange(pagination.page - 1)}
//                   disabled={pagination.page === 1}
//                   className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
//                 >
//                   <ChevronLeft size={16} />
//                 </button>
//                 <span className="hidden sm:block px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium text-sm">
//                   Page {pagination.page} of {pagination.pages}
//                 </span>
//                 <span className="sm:hidden px-3 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium text-xs">
//                   {pagination.page}/{pagination.pages}
//                 </span>
//                 <button
//                   onClick={() => handlePageChange(pagination.page + 1)}
//                   disabled={pagination.page === pagination.pages}
//                   className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
//                 >
//                   <ChevronRight size={16} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




// Pages/works/WorksPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  RefreshCw,
  Plus,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle,
  Scissors,
  Ruler,
  Truck,
  Menu
} from 'lucide-react';
import { 
  fetchWorks, 
  fetchWorkStats,
  deleteWorkById,
  setFilters,
  resetFilters,
  selectAllWorks,
  selectWorkStats,
  selectWorkPagination,
  selectWorkFilters,
  selectWorkLoading
} from '../../features/work/workSlice';
import WorkFilters from '../../components/works/WorkFilters';
import showToast from '../../utils/toast';

export default function WorksPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const works = useSelector(selectAllWorks);
  const stats = useSelector(selectWorkStats);
  const pagination = useSelector(selectWorkPagination);
  const filters = useSelector(selectWorkFilters);
  const loading = useSelector(selectWorkLoading);
  const { user } = useSelector((state) => state.auth);

  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Get base path based on user role
  const getBasePath = () => {
    if (user?.role === 'ADMIN') return '/admin';
    if (user?.role === 'STORE_KEEPER') return '/storekeeper';
    if (user?.role === 'CUTTING_MASTER') return '/cuttingmaster';
    return '';
  };

  const isAdmin = user?.role === 'ADMIN';
  const isStoreKeeper = user?.role === 'STORE_KEEPER';
  const isCuttingMaster = user?.role === 'CUTTING_MASTER';
  const canDelete = isAdmin;

  useEffect(() => {
    loadData();
  }, [filters, dispatch]);

  const loadData = () => {
    dispatch(fetchWorks());
    dispatch(fetchWorkStats());
  };

  const handleRefresh = () => {
    loadData();
    showToast.success('Data refreshed');
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    dispatch(setFilters({ search: e.target.value, page: 1 }));
  };

  const handleStatusFilter = (status) => {
    setSelectedStatus(status);
    if (status === 'all') {
      dispatch(setFilters({ status: '' }));
    } else {
      dispatch(setFilters({ status }));
    }
    setMobileFiltersOpen(false);
  };

  const handlePageChange = (newPage) => {
    dispatch(setFilters({ page: newPage }));
  };

  // ✅ FIXED: Use role-based navigation
  const handleViewWork = (id) => {
    const basePath = getBasePath();
    navigate(`${basePath}/works/${id}`);
  };

  const handleDeleteWork = async (id) => {
    if (window.confirm('Are you sure you want to delete this work?')) {
      dispatch(deleteWorkById(id));
    }
  };

  // ✅ FIXED: Navigation for dashboard based on role
  const handleNavigateToDashboard = () => {
    const basePath = getBasePath();
    navigate(`${basePath}/dashboard`);
    setMobileMenuOpen(false);
  };

  // ✅ FIXED: Navigation for orders based on role
  const handleNavigateToOrders = () => {
    const basePath = getBasePath();
    navigate(`${basePath}/orders`);
    setMobileMenuOpen(false);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'accepted': 'bg-blue-100 text-blue-700 border-blue-200',
      'cutting-started': 'bg-purple-100 text-purple-700 border-purple-200',
      'cutting-completed': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'sewing-started': 'bg-pink-100 text-pink-700 border-pink-200',
      'sewing-completed': 'bg-teal-100 text-teal-700 border-teal-200',
      'ironing': 'bg-orange-100 text-orange-700 border-orange-200',
      'ready-to-deliver': 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[status] || 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock size={14} />;
      case 'accepted': return <CheckCircle size={14} />;
      case 'cutting-started': return <Scissors size={14} />;
      case 'cutting-completed': return <Scissors size={14} />;
      case 'sewing-started': return <Ruler size={14} />;
      case 'sewing-completed': return <Ruler size={14} />;
      case 'ironing': return <Truck size={14} />;
      case 'ready-to-deliver': return <CheckCircle size={14} />;
      default: return <Briefcase size={14} />;
    }
  };

  const isOverdue = (date) => {
    return new Date(date) < new Date();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-black text-slate-800">Works</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all"
            >
              <Filter size={20} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg p-4 z-40">
            <div className="space-y-2">
              <button
                onClick={handleRefresh}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-100 rounded-xl font-medium"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin text-blue-600' : ''} />
                Refresh Data
              </button>
              <button
                onClick={handleNavigateToDashboard}
                className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-xl font-medium"
              >
                Dashboard
              </button>
              <button
                onClick={handleNavigateToOrders}
                className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-xl font-medium"
              >
                Orders
              </button>
            </div>
          </div>
        )}

        {/* Mobile Filters Panel */}
        {mobileFiltersOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg p-4 z-40 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Filter Works</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearch}
                    placeholder="Search by Work ID..."
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {['all', 'pending', 'accepted', 'cutting-started', 'sewing-started', 'ready-to-deliver'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusFilter(status)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium ${
                        selectedStatus === status 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {status === 'all' ? 'All' : status.replace(/-/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <WorkFilters />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        {/* Desktop Header - Hidden on Mobile */}
        <div className="hidden lg:flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 mb-2">Work Management</h1>
            <p className="text-slate-600">Track and manage all production works</p>
          </div>
          <button
            onClick={handleRefresh}
            className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
            title="Refresh"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin text-blue-600' : 'text-slate-600'} />
          </button>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border-l-4 border-blue-500">
            <p className="text-xs sm:text-sm text-slate-500">Total Works</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800">{stats.totalWorks || 0}</p>
          </div>
          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border-l-4 border-yellow-500">
            <p className="text-xs sm:text-sm text-slate-500">Pending</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600">{stats.pendingWorks || 0}</p>
          </div>
          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border-l-4 border-green-500">
            <p className="text-xs sm:text-sm text-slate-500">Ready to Deliver</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{stats.readyToDeliver || 0}</p>
          </div>
          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border-l-4 border-red-500">
            <p className="text-xs sm:text-sm text-slate-500">Overdue</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600">{stats.overdueWorks || 0}</p>
          </div>
        </div>

        {/* Desktop Filters Bar - Hidden on Mobile */}
        <div className="hidden lg:block bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            {/* Status Tabs */}
            <div className="flex gap-2 bg-slate-100 p-1 rounded-lg overflow-x-auto">
              <button
                onClick={() => handleStatusFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                  selectedStatus === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleStatusFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                  selectedStatus === 'pending' ? 'bg-white text-yellow-600 shadow-sm' : 'text-slate-600'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => handleStatusFilter('accepted')}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                  selectedStatus === 'accepted' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
                }`}
              >
                Accepted
              </button>
              <button
                onClick={() => handleStatusFilter('cutting-started')}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                  selectedStatus === 'cutting-started' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-600'
                }`}
              >
                Cutting
              </button>
              <button
                onClick={() => handleStatusFilter('sewing-started')}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                  selectedStatus === 'sewing-started' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-600'
                }`}
              >
                Sewing
              </button>
              <button
                onClick={() => handleStatusFilter('ready-to-deliver')}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                  selectedStatus === 'ready-to-deliver' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-600'
                }`}
              >
                Ready
              </button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearch}
                  placeholder="Search by Work ID..."
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-64"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-lg border transition-all ${
                  showFilters ? 'bg-blue-50 border-blue-200 text-blue-600' : 'border-slate-200 text-slate-600'
                }`}
              >
                <Filter size={18} />
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <WorkFilters />
            </div>
          )}
        </div>

        {/* Mobile View - Cards */}
        <div className="lg:hidden space-y-3">
          {works.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <Briefcase size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No works found</p>
              <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            works.map((work) => (
              <div key={work._id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-mono text-sm font-bold text-blue-600">{work.workId}</span>
                    <h3 className="font-medium text-slate-800 mt-1">{work.garment?.name}</h3>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
                    {getStatusIcon(work.status)}
                    <span className="capitalize">{work.status?.replace(/-/g, ' ')}</span>
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <p className="text-xs text-slate-400">Customer</p>
                    <p className="font-medium truncate">{work.order?.customer?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Garment ID</p>
                    <p className="font-mono text-xs">{work.garment?.garmentId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Cutting Master</p>
                    <p className="text-sm truncate">{work.cuttingMaster?.name || 'Not assigned'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Tailor</p>
                    <p className="text-sm truncate">{work.tailor?.name || 'Not assigned'}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400" />
                    <span className={`text-xs ${isOverdue(work.estimatedDelivery) && work.status !== 'ready-to-deliver' ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                      {formatDate(work.estimatedDelivery)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewWork(work._id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                    {canDelete && (
                      <button
                        onClick={() => handleDeleteWork(work._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Works Table - Hidden on Mobile */}
        <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Work ID</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Garment</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Cutting Master</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Tailor</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase">Est. Delivery</th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {works.map((work) => (
                  <tr key={work._id} className="hover:bg-slate-50 transition-all">
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-medium text-blue-600">{work.workId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-800">{work.garment?.name}</p>
                        <p className="text-xs text-slate-500">ID: {work.garment?.garmentId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-800">{work.order?.customer?.name || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}>
                        {getStatusIcon(work.status)}
                        {work.status?.replace(/-/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-800">{work.cuttingMaster?.name || 'Not assigned'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-800">{work.tailor?.name || 'Not assigned'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-400" />
                        <span className={`text-sm ${isOverdue(work.estimatedDelivery) && work.status !== 'ready-to-deliver' ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                          {formatDate(work.estimatedDelivery)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleViewWork(work._id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        {canDelete && (
                          <button
                            onClick={() => handleDeleteWork(work._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {works.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Briefcase size={48} className="text-slate-300 mb-3" />
                        <p className="text-slate-500 font-medium">No works found</p>
                        <p className="text-sm text-slate-400 mt-1">Try adjusting your filters</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination - Responsive */}
        {pagination.pages > 1 && (
          <div className="mt-4 sm:mt-6 bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm border border-slate-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs sm:text-sm text-slate-600 order-2 sm:order-1">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
              </p>
              <div className="flex gap-2 order-1 sm:order-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="hidden sm:block px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium text-sm">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <span className="sm:hidden px-3 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium text-xs">
                  {pagination.page}/{pagination.pages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}