// // src/Pages/admin/storeKeeper/StoreKeepers.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { 
//   Plus, Search, Eye, Edit, Trash2, CheckCircle, XCircle, 
//   Store, Users, ChevronLeft, ChevronRight, Menu, Grid, Filter, X 
// } from "lucide-react";
// import { fetchAllStoreKeepers, deleteStoreKeeper, fetchStoreKeeperStats } from "../../../features/storeKeeper/storeKeeperSlice";
// import showToast from "../../../utils/toast";

// export default function StoreKeepers() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { storeKeepers, stats, loading, pagination } = useSelector((state) => state.storeKeeper);
//   const { user } = useSelector((state) => state.auth);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [departmentFilter, setDepartmentFilter] = useState("all");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selected, setSelected] = useState(null);
  
//   // Mobile state
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
//   const [mobileView, setMobileView] = useState("grid"); // 'grid' or 'list'

//   const isAdmin = user?.role === "ADMIN";
//   const canAdd = isAdmin;
//   const canEdit = isAdmin;
//   const canDelete = isAdmin;

//   useEffect(() => {
//     dispatch(fetchAllStoreKeepers({ 
//       page: currentPage, 
//       limit: itemsPerPage, 
//       search: searchTerm, 
//       department: departmentFilter 
//     }));
//     dispatch(fetchStoreKeeperStats());
//   }, [dispatch, currentPage, itemsPerPage, searchTerm, departmentFilter]);

//   const handleAdd = () => navigate("/admin/store-keepers/add");
//   const handleView = (id) => navigate(`/admin/store-keepers/${id}`);
//   const handleEdit = (id) => navigate(`/admin/store-keepers/edit/${id}`);
//   const handleDeleteClick = (item) => { 
//     setSelected(item); 
//     setShowDeleteModal(true); 
//   };
  
//   const handleDeleteConfirm = async () => {
//     try { 
//       await dispatch(deleteStoreKeeper(selected._id)).unwrap(); 
//       showToast.success("Deleted successfully"); 
//       setShowDeleteModal(false); 
//     } catch (e) { 
//       showToast.error(e || "Failed to delete"); 
//     }
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= (pagination?.pages || 1)) {
//       setCurrentPage(newPage);
//     }
//   };

//   const departments = [
//     { value: "all", label: "All Departments" },
//     { value: "inventory", label: "Inventory" },
//     { value: "sales", label: "Sales" },
//     { value: "both", label: "Both" },
//   ];

//   const itemsPerPageOptions = [5, 10, 25, 50];

//   return (
//     <div className="min-h-screen bg-slate-50">
//       {/* ===== MOBILE HEADER ===== */}
//       <div className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-30">
//         <div className="flex items-center justify-between px-4 py-3">
//           <h1 className="text-lg font-black text-slate-800 flex items-center gap-2">
//             <Store size={20} className="text-green-600" />
//             Store Keepers
//           </h1>
//           <div className="flex items-center gap-2">
//             {canAdd && (
//               <button
//                 onClick={handleAdd}
//                 className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center"
//                 style={{ minWidth: '36px', minHeight: '36px' }}
//               >
//                 <Plus size={18} />
//               </button>
//             )}
//             <button
//               onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
//               className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition flex items-center justify-center"
//               style={{ minWidth: '36px', minHeight: '36px' }}
//             >
//               <Filter size={18} />
//             </button>
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition flex items-center justify-center"
//               style={{ minWidth: '36px', minHeight: '36px' }}
//             >
//               <Menu size={18} />
//             </button>
//           </div>
//         </div>

//         {/* Mobile Search Bar */}
//         <div className="px-4 pb-3">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
//             <input
//               type="text"
//               placeholder="Search store keepers..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
//             />
//           </div>
//         </div>

//         {/* Mobile Stats Row */}
//         <div className="grid grid-cols-2 gap-2 px-4 pb-3">
//           <div className="bg-white p-3 rounded-lg border border-slate-200">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-slate-500">Total</p>
//                 <p className="text-lg font-black text-slate-800">{stats?.total || 0}</p>
//               </div>
//               <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
//                 <Store size={16} className="text-green-600" />
//               </div>
//             </div>
//           </div>
//           <div className="bg-green-50 p-3 rounded-lg border border-green-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs text-green-600">Active</p>
//                 <p className="text-lg font-black text-green-700">
//                   {stats?.departmentStats?.reduce((a, b) => a + (b.count || 0), 0) || 0}
//                 </p>
//               </div>
//               <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
//                 <CheckCircle size={16} className="text-green-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Filters Dropdown */}
//         {mobileFiltersOpen && (
//           <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-40">
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="font-bold text-slate-800">Filters</h3>
//               <button
//                 onClick={() => setMobileFiltersOpen(false)}
//                 className="p-1 hover:bg-slate-100 rounded-lg flex items-center justify-center"
//                 style={{ minWidth: '28px', minHeight: '28px' }}
//               >
//                 <X size={16} />
//               </button>
//             </div>
//             <div className="space-y-3">
//               <div>
//                 <label className="block text-xs font-medium text-slate-500 mb-1">Department</label>
//                 <select
//                   value={departmentFilter}
//                   onChange={(e) => setDepartmentFilter(e.target.value)}
//                   className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
//                 >
//                   {departments.map(option => (
//                     <option key={option.value} value={option.value}>{option.label}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="flex gap-2 pt-2">
//                 <button
//                   onClick={() => {
//                     setDepartmentFilter("all");
//                   }}
//                   className="flex-1 px-3 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   onClick={() => setMobileFiltersOpen(false)}
//                   className="flex-1 px-3 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
//                 >
//                   Apply
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg p-4 z-40">
//             <div className="space-y-2">
//               <button
//                 onClick={() => {
//                   navigate("/admin/dashboard");
//                   setMobileMenuOpen(false);
//                 }}
//                 className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-xl font-medium"
//               >
//                 Dashboard
//               </button>
//               <button
//                 onClick={() => {
//                   navigate("/admin/store-keepers");
//                   setMobileMenuOpen(false);
//                 }}
//                 className="w-full text-left px-4 py-3 bg-green-50 text-green-600 rounded-xl font-medium"
//               >
//                 Store Keepers
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-8">
//         {/* ===== DESKTOP HEADER (Hidden on mobile) ===== */}
//         <div className="hidden lg:block space-y-8">
//           {/* Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-slate-500">Total Store Keepers</p>
//                   <p className="text-3xl font-black text-slate-800">{stats?.total || 0}</p>
//                 </div>
//                 <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
//                   <Store size={24} className="text-green-600" />
//                 </div>
//               </div>
//             </div>
//             <div className="bg-green-50 p-6 rounded-2xl shadow-sm border border-green-100">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-green-600">Active</p>
//                   <p className="text-3xl font-black text-green-700">
//                     {stats?.departmentStats?.reduce((a, b) => a + (b.count || 0), 0) || 0}
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
//                   <CheckCircle size={24} className="text-green-600" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Header */}
//           <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase flex items-center gap-3">
//                 <Store size={32} className="text-green-600" />
//                 Store Keepers
//               </h1>
//               <p className="text-slate-500 font-medium">Manage store keepers and their departments</p>
//             </div>
//             {canAdd && (
//               <button
//                 onClick={handleAdd}
//                 className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-green-500/25 flex items-center gap-2"
//               >
//                 <Plus size={20} />
//                 Add Store Keeper
//               </button>
//             )}
//           </div>

//           {/* Filters */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="relative md:col-span-2">
//               <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
//               <input
//                 type="text"
//                 placeholder="Search by name, phone, ID..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
//               />
//             </div>
//             <select
//               value={departmentFilter}
//               onChange={(e) => setDepartmentFilter(e.target.value)}
//               className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
//             >
//               {departments.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
//             </select>
//           </div>
//         </div>

//         {/* Mobile View Toggle */}
//         <div className="lg:hidden flex items-center justify-between mb-3">
//           <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
//             <button
//               onClick={() => setMobileView("grid")}
//               className={`p-2 rounded-lg transition flex items-center justify-center ${
//                 mobileView === "grid" ? "bg-white text-green-600 shadow-sm" : "text-slate-500"
//               }`}
//               style={{ minWidth: '36px', minHeight: '36px' }}
//             >
//               <Grid size={16} />
//             </button>
//             <button
//               onClick={() => setMobileView("list")}
//               className={`p-2 rounded-lg transition flex items-center justify-center ${
//                 mobileView === "list" ? "bg-white text-green-600 shadow-sm" : "text-slate-500"
//               }`}
//               style={{ minWidth: '36px', minHeight: '36px' }}
//             >
//               <Menu size={16} />
//             </button>
//           </div>
//           <span className="text-xs text-slate-500">
//             {storeKeepers?.length || 0} keepers
//           </span>
//         </div>

//         {/* Loading State */}
//         {loading ? (
//           <div className="bg-white rounded-xl p-8 text-center">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-green-600 border-t-transparent"></div>
//             <p className="mt-2 text-sm text-slate-500">Loading store keepers...</p>
//           </div>
//         ) : storeKeepers?.length > 0 ? (
//           <>
//             {/* ===== MOBILE GRID VIEW ===== */}
//             {mobileView === "grid" && (
//               <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 {storeKeepers.map((keeper) => (
//                   <div
//                     key={keeper._id}
//                     className="bg-white rounded-xl border border-slate-200 p-3 hover:shadow-md transition-all"
//                   >
//                     {/* Header with Avatar */}
//                     <div className="flex items-start justify-between mb-2">
//                       <div className="flex items-center gap-2">
//                         <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
//                           {keeper.name?.charAt(0)}
//                         </div>
//                         <div className="min-w-0">
//                           <p className="font-medium text-slate-800 text-sm truncate max-w-[100px]">{keeper.name}</p>
//                           <p className="text-[10px] text-slate-400 truncate">{keeper.storeKeeperId}</p>
//                         </div>
//                       </div>
//                       <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap ${
//                         keeper.isActive 
//                           ? 'bg-green-100 text-green-700' 
//                           : 'bg-red-100 text-red-700'
//                       }`}>
//                         {keeper.isActive ? 'Active' : 'Inactive'}
//                       </span>
//                     </div>

//                     {/* Contact Info */}
//                     <div className="space-y-1 mb-2">
//                       <p className="text-xs text-slate-600 truncate">{keeper.phone}</p>
//                       <p className="text-xs text-slate-600 truncate">{keeper.email}</p>
//                     </div>

//                     {/* Department */}
//                     <div className="bg-slate-50 rounded-lg p-2 mb-2">
//                       <p className="text-[10px] text-slate-500">Department</p>
//                       <p className="text-xs font-bold text-green-600 capitalize">{keeper.department}</p>
//                     </div>

//                     {/* Orders Stats */}
//                     <div className="bg-blue-50 p-2 rounded-lg mb-3">
//                       <p className="text-[10px] text-blue-600">Orders</p>
//                       <p className="text-sm font-bold text-blue-700">{keeper.stats?.total || 0}</p>
//                     </div>

//                     {/* Action Icons - Perfectly Centered */}
//                     <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-100">
//                       <button
//                         onClick={() => handleView(keeper._id)}
//                         className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all flex items-center justify-center"
//                         title="View"
//                       >
//                         <Eye size={14} />
//                       </button>
//                       {canEdit && (
//                         <button
//                           onClick={() => handleEdit(keeper._id)}
//                           className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all flex items-center justify-center"
//                           title="Edit"
//                         >
//                           <Edit size={14} />
//                         </button>
//                       )}
//                       {canDelete && (
//                         <button
//                           onClick={() => handleDeleteClick(keeper)}
//                           className="w-8 h-8 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all flex items-center justify-center"
//                           title="Delete"
//                         >
//                           <Trash2 size={14} />
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* ===== MOBILE LIST VIEW ===== */}
//             {mobileView === "list" && (
//               <div className="lg:hidden space-y-2">
//                 {storeKeepers.map((keeper) => (
//                   <div
//                     key={keeper._id}
//                     className="bg-white rounded-xl border border-slate-200 p-3 hover:shadow-md transition-all"
//                   >
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="flex items-center gap-2 flex-1 min-w-0">
//                         <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
//                           {keeper.name?.charAt(0)}
//                         </div>
//                         <div className="min-w-0">
//                           <p className="font-medium text-slate-800 text-sm truncate">{keeper.name}</p>
//                           <p className="text-xs text-slate-500 truncate">{keeper.storeKeeperId}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-1 flex-shrink-0">
//                         <span className={`px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap ${
//                           keeper.isActive 
//                             ? 'bg-green-100 text-green-700' 
//                             : 'bg-red-100 text-red-700'
//                         }`}>
//                           {keeper.isActive ? 'Active' : 'Inactive'}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-between text-xs">
//                       <div className="text-slate-500 truncate max-w-[100px]">{keeper.department}</div>
//                       <div className="flex items-center gap-2">
//                         <span className="text-green-600 font-medium">{keeper.stats?.total || 0} orders</span>
//                         <button
//                           onClick={() => handleView(keeper._id)}
//                           className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-all flex items-center justify-center"
//                           title="View"
//                         >
//                           <Eye size={12} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* ===== DESKTOP TABLE VIEW (Hidden on mobile) ===== */}
//             <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-slate-50 border-b border-slate-200">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">ID</th>
//                       <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Name</th>
//                       <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Phone</th>
//                       <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Email</th>
//                       <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Department</th>
//                       <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Status</th>
//                       <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Orders</th>
//                       <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100">
//                     {storeKeepers.map(keeper => (
//                       <tr key={keeper._id} className="hover:bg-slate-50 transition-all">
//                         <td className="px-6 py-4 font-mono font-bold text-green-600">{keeper.storeKeeperId}</td>
//                         <td className="px-6 py-4 font-medium">{keeper.name}</td>
//                         <td className="px-6 py-4">{keeper.phone}</td>
//                         <td className="px-6 py-4 text-sm text-slate-600">{keeper.email}</td>
//                         <td className="px-6 py-4 capitalize">{keeper.department}</td>
//                         <td className="px-6 py-4">
//                           {keeper.isActive ? (
//                             <span className="flex items-center gap-1 text-green-600">
//                               <CheckCircle size={14} /> Active
//                             </span>
//                           ) : (
//                             <span className="flex items-center gap-1 text-red-600">
//                               <XCircle size={14} /> Inactive
//                             </span>
//                           )}
//                         </td>
//                         <td className="px-6 py-4 text-sm">{keeper.stats?.total || 0} orders</td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-2">
//                             <button
//                               onClick={() => handleView(keeper._id)}
//                               className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-all flex items-center justify-center"
//                               title="View"
//                             >
//                               <Eye size={16} />
//                             </button>
//                             {canEdit && (
//                               <button
//                                 onClick={() => handleEdit(keeper._id)}
//                                 className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all flex items-center justify-center"
//                                 title="Edit"
//                               >
//                                 <Edit size={16} />
//                               </button>
//                             )}
//                             {canDelete && (
//                               <button
//                                 onClick={() => handleDeleteClick(keeper)}
//                                 className="w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all flex items-center justify-center"
//                                 title="Delete"
//                               >
//                                 <Trash2 size={16} />
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               {/* Desktop Pagination */}
//               {pagination?.pages > 1 && (
//                 <div className="px-6 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
//                   <div className="flex items-center gap-4">
//                     <select
//                       value={itemsPerPage}
//                       onChange={(e) => { 
//                         setItemsPerPage(Number(e.target.value)); 
//                         setCurrentPage(1); 
//                       }}
//                       className="px-2 py-1 bg-slate-50 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
//                     >
//                       {itemsPerPageOptions.map(n => (
//                         <option key={n} value={n}>{n} per page</option>
//                       ))}
//                     </select>
//                     <span className="text-sm text-slate-500">
//                       Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <button
//                       onClick={() => handlePageChange(currentPage - 1)}
//                       disabled={currentPage === 1}
//                       className="w-8 h-8 rounded-lg flex items-center justify-center disabled:text-slate-300 hover:bg-slate-100 transition-all"
//                     >
//                       <ChevronLeft size={20} />
//                     </button>
//                     <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-sm font-medium">
//                       {currentPage} / {pagination.pages}
//                     </span>
//                     <button
//                       onClick={() => handlePageChange(currentPage + 1)}
//                       disabled={currentPage === pagination.pages}
//                       className="w-8 h-8 rounded-lg flex items-center justify-center disabled:text-slate-300 hover:bg-slate-100 transition-all"
//                     >
//                       <ChevronRight size={20} />
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </>
//         ) : (
//           // Empty State
//           <div className="bg-white rounded-xl p-8 text-center">
//             <Store size={40} className="text-slate-300 mx-auto mb-4" />
//             <p className="text-slate-500 text-base">No store keepers found</p>
//             {canAdd && (
//               <button
//                 onClick={handleAdd}
//                 className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold inline-flex items-center justify-center gap-2 text-sm"
//               >
//                 <Plus size={16} />
//                 Add Your First Store Keeper
//               </button>
//             )}
//           </div>
//         )}

//         {/* Mobile Pagination */}
//         {pagination?.pages > 1 && (
//           <div className="lg:hidden mt-4 bg-white rounded-xl p-4">
//             <div className="flex flex-col items-center gap-3">
//               <div className="flex items-center justify-between w-full">
//                 <select
//                   value={itemsPerPage}
//                   onChange={(e) => { 
//                     setItemsPerPage(Number(e.target.value)); 
//                     setCurrentPage(1); 
//                   }}
//                   className="px-2 py-1 bg-slate-50 border rounded-lg text-xs focus:ring-2 focus:ring-green-500 outline-none"
//                 >
//                   {itemsPerPageOptions.map(n => (
//                     <option key={n} value={n}>{n}</option>
//                   ))}
//                 </select>
//                 <span className="text-xs text-slate-500">
//                   Page {currentPage}/{pagination.pages}
//                 </span>
//               </div>
              
//               <div className="flex items-center justify-center gap-2">
//                 <button
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="w-8 h-8 rounded-lg flex items-center justify-center disabled:text-slate-300 hover:bg-slate-100 transition-all"
//                 >
//                   <ChevronLeft size={16} />
//                 </button>
//                 <span className="px-4 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-medium">
//                   {currentPage} / {pagination.pages}
//                 </span>
//                 <button
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === pagination.pages}
//                   className="w-8 h-8 rounded-lg flex items-center justify-center disabled:text-slate-300 hover:bg-slate-100 transition-all"
//                 >
//                   <ChevronRight size={16} />
//                 </button>
//               </div>
              
//               <p className="text-xs text-slate-400 text-center">
//                 Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
//               </p>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Delete Confirmation Modal - Responsive */}
//       {showDeleteModal && selected && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
//           <div className="bg-white w-full max-w-md rounded-xl lg:rounded-2xl shadow-2xl animate-in zoom-in duration-300 mx-4">
//             <div className="p-4 sm:p-6">
//               <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
//                 <XCircle size={24} className="text-red-600 sm:w-8 sm:h-8" />
//               </div>
//               <h3 className="text-lg sm:text-xl font-black text-center text-slate-800 mb-2">Delete Store Keeper?</h3>
//               <p className="text-sm sm:text-base text-center text-slate-500 mb-4 sm:mb-6">
//                 Are you sure you want to delete <span className="font-black text-slate-700">{selected.name}</span>?
//                 This action cannot be undone.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
//                 <button
//                   onClick={() => setShowDeleteModal(false)}
//                   className="flex-1 px-4 py-3 sm:py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg sm:rounded-xl font-black transition-all text-sm sm:text-base order-2 sm:order-1"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDeleteConfirm}
//                   className="flex-1 px-4 py-3 sm:py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg sm:rounded-xl font-black transition-all text-sm sm:text-base order-1 sm:order-2"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }









// src/Pages/admin/storeKeeper/StoreKeepers.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  Plus, Search, Eye, Edit, Trash2, CheckCircle, XCircle, 
  Store, Users, ChevronLeft, ChevronRight, Menu, Grid, Filter, X 
} from "lucide-react";
import { fetchAllStoreKeepers, deleteStoreKeeper, fetchStoreKeeperStats } from "../../../features/storeKeeper/storeKeeperSlice";
import showToast from "../../../utils/toast";

// 🚀 OPTIMIZED: Skeleton Card Component
const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-slate-200 p-3 animate-pulse">
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-20"></div>
          <div className="h-3 bg-slate-200 rounded w-16"></div>
        </div>
      </div>
      <div className="w-14 h-5 bg-slate-200 rounded-full"></div>
    </div>
    <div className="space-y-2 mb-2">
      <div className="h-3 bg-slate-200 rounded w-32"></div>
      <div className="h-3 bg-slate-200 rounded w-40"></div>
    </div>
    <div className="h-10 bg-slate-200 rounded-lg mb-2"></div>
    <div className="flex justify-center gap-2 pt-2 border-t border-slate-100">
      <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
      <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
      <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
    </div>
  </div>
);

const SkeletonTableRow = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-28"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-36"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-20"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
    <td className="px-6 py-4"><div className="flex gap-2"><div className="w-8 h-8 bg-slate-200 rounded-lg"></div><div className="w-8 h-8 bg-slate-200 rounded-lg"></div></div></td>
  </tr>
);

export default function StoreKeepers() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { storeKeepers, stats, loading, pagination } = useSelector((state) => state.storeKeeper);
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selected, setSelected] = useState(null);
  
  // Mobile state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileView, setMobileView] = useState("grid");

  const isAdmin = user?.role === "ADMIN";
  const canAdd = isAdmin;
  const canEdit = isAdmin;
  const canDelete = isAdmin;

  // 🚀 OPTIMIZATION 1: Debounced search - prevents API calls on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400); // 400ms delay
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 🚀 OPTIMIZATION 2: Separate stats fetch - only once on mount
  useEffect(() => {
    dispatch(fetchStoreKeeperStats());
  }, [dispatch]);

  // 🚀 OPTIMIZATION 3: Debounced fetch for store keepers list
  useEffect(() => {
    dispatch(fetchAllStoreKeepers({ 
      page: currentPage, 
      limit: itemsPerPage, 
      search: debouncedSearchTerm, 
      department: departmentFilter 
    }));
  }, [dispatch, currentPage, itemsPerPage, debouncedSearchTerm, departmentFilter]);

  // 🚀 OPTIMIZATION 4: Memoized functions
  const handleAdd = useCallback(() => navigate("/admin/store-keepers/add"), [navigate]);
  const handleView = useCallback((id) => navigate(`/admin/store-keepers/${id}`), [navigate]);
  const handleEdit = useCallback((id) => navigate(`/admin/store-keepers/edit/${id}`), [navigate]);
  
  const handleDeleteClick = useCallback((item) => { 
    setSelected(item); 
    setShowDeleteModal(true); 
  }, []);
  
  const handleDeleteConfirm = useCallback(async () => {
    try { 
      await dispatch(deleteStoreKeeper(selected._id)).unwrap(); 
      showToast.success("Deleted successfully"); 
      setShowDeleteModal(false); 
    } catch (e) { 
      showToast.error(e || "Failed to delete"); 
    }
  }, [dispatch, selected]);

  const handlePageChange = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= (pagination?.pages || 1)) {
      setCurrentPage(newPage);
    }
  }, [pagination?.pages]);

  const handleItemsPerPageChange = useCallback((e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  }, []);

  // 🚀 OPTIMIZATION 5: Memoized options
  const departments = useMemo(() => [
    { value: "all", label: "All Departments" },
    { value: "inventory", label: "Inventory" },
    { value: "sales", label: "Sales" },
    { value: "both", label: "Both" },
  ], []);

  const itemsPerPageOptions = useMemo(() => [5, 10, 25, 50], []);

  // 🚀 OPTIMIZATION 6: Memoized stats calculations
  const activeCount = useMemo(() => 
    stats?.departmentStats?.reduce((a, b) => a + (b.count || 0), 0) || 0,
    [stats]
  );

  // 🚀 OPTIMIZATION 7: Check if this is initial load
  const isInitialLoading = loading && storeKeepers?.length === 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ===== MOBILE HEADER ===== */}
      <div className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Store size={20} className="text-green-600" />
            Store Keepers
          </h1>
          <div className="flex items-center gap-2">
            {canAdd && (
              <button
                onClick={handleAdd}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center"
                style={{ minWidth: '36px', minHeight: '36px' }}
              >
                <Plus size={18} />
              </button>
            )}
            <button
              onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
              className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition flex items-center justify-center"
              style={{ minWidth: '36px', minHeight: '36px' }}
            >
              <Filter size={18} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition flex items-center justify-center"
              style={{ minWidth: '36px', minHeight: '36px' }}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search store keepers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>
        </div>

        {/* Mobile Stats Row */}
        <div className="grid grid-cols-2 gap-2 px-4 pb-3">
          <div className="bg-white p-3 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">Total</p>
                <p className="text-lg font-black text-slate-800">{stats?.total || 0}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Store size={16} className="text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600">Active</p>
                <p className="text-lg font-black text-green-700">{activeCount}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle size={16} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filters Dropdown */}
        {mobileFiltersOpen && (
          <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-40">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-800">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1 hover:bg-slate-100 rounded-lg flex items-center justify-center"
                style={{ minWidth: '28px', minHeight: '28px' }}
              >
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Department</label>
                <select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                >
                  {departments.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setDepartmentFilter("all");
                  }}
                  className="flex-1 px-3 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 px-3 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg p-4 z-40">
            <div className="space-y-2">
              <button
                onClick={() => {
                  navigate("/admin/dashboard");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-xl font-medium"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  navigate("/admin/store-keepers");
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 bg-green-50 text-green-600 rounded-xl font-medium"
              >
                Store Keepers
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4 lg:py-8">
        {/* ===== DESKTOP HEADER (Hidden on mobile) ===== */}
        <div className="hidden lg:block space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Store Keepers</p>
                  <p className="text-3xl font-black text-slate-800">{stats?.total || 0}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Store size={24} className="text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-6 rounded-2xl shadow-sm border border-green-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">Active</p>
                  <p className="text-3xl font-black text-green-700">{activeCount}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase flex items-center gap-3">
                <Store size={32} className="text-green-600" />
                Store Keepers
              </h1>
              <p className="text-slate-500 font-medium">Manage store keepers and their departments</p>
            </div>
            {canAdd && (
              <button
                onClick={handleAdd}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-green-500/25 flex items-center gap-2"
              >
                <Plus size={20} />
                Add Store Keeper
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, phone, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
              />
            </div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all"
            >
              {departments.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div className="lg:hidden flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setMobileView("grid")}
              className={`p-2 rounded-lg transition flex items-center justify-center ${
                mobileView === "grid" ? "bg-white text-green-600 shadow-sm" : "text-slate-500"
              }`}
              style={{ minWidth: '36px', minHeight: '36px' }}
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => setMobileView("list")}
              className={`p-2 rounded-lg transition flex items-center justify-center ${
                mobileView === "list" ? "bg-white text-green-600 shadow-sm" : "text-slate-500"
              }`}
              style={{ minWidth: '36px', minHeight: '36px' }}
            >
              <Menu size={16} />
            </button>
          </div>
          <span className="text-xs text-slate-500">
            {storeKeepers?.length || 0} keepers
          </span>
        </div>

        {/* 🚀 OPTIMIZATION 8: Ghosting Effect during loading */}
        <div className={`transition-all duration-300 ${loading && !isInitialLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
          
          {/* Skeleton Loader for Initial Load */}
          {isInitialLoading ? (
            <>
              <div className="lg:hidden space-y-3">
                {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
              <div className="hidden lg:block">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">ID</th>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Phone</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Department</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Orders</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[...Array(5)].map((_, i) => <SkeletonTableRow key={i} />)}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : storeKeepers?.length > 0 ? (
            <>
              {/* ===== MOBILE GRID VIEW ===== */}
              {mobileView === "grid" && (
                <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {storeKeepers.map((keeper) => (
                    <div
                      key={keeper._id}
                      className="bg-white rounded-xl border border-slate-200 p-3 hover:shadow-md transition-all"
                    >
                      {/* Header with Avatar */}
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {keeper.name?.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-800 text-sm truncate max-w-[100px]">{keeper.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{keeper.storeKeeperId}</p>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap ${
                          keeper.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {keeper.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-1 mb-2">
                        <p className="text-xs text-slate-600 truncate">{keeper.phone}</p>
                        <p className="text-xs text-slate-600 truncate">{keeper.email}</p>
                      </div>

                      {/* Department */}
                      <div className="bg-slate-50 rounded-lg p-2 mb-2">
                        <p className="text-[10px] text-slate-500">Department</p>
                        <p className="text-xs font-bold text-green-600 capitalize">{keeper.department}</p>
                      </div>

                      {/* Orders Stats */}
                      <div className="bg-blue-50 p-2 rounded-lg mb-3">
                        <p className="text-[10px] text-blue-600">Orders</p>
                        <p className="text-sm font-bold text-blue-700">{keeper.stats?.total || 0}</p>
                      </div>

                      {/* Action Icons */}
                      <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => handleView(keeper._id)}
                          className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all flex items-center justify-center"
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => handleEdit(keeper._id)}
                            className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all flex items-center justify-center"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDeleteClick(keeper)}
                            className="w-8 h-8 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all flex items-center justify-center"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ===== MOBILE LIST VIEW ===== */}
              {mobileView === "list" && (
                <div className="lg:hidden space-y-2">
                  {storeKeepers.map((keeper) => (
                    <div
                      key={keeper._id}
                      className="bg-white rounded-xl border border-slate-200 p-3 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {keeper.name?.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-slate-800 text-sm truncate">{keeper.name}</p>
                            <p className="text-xs text-slate-500 truncate">{keeper.storeKeeperId}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap ${
                            keeper.isActive 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {keeper.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <div className="text-slate-500 truncate max-w-[100px]">{keeper.department}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 font-medium">{keeper.stats?.total || 0} orders</span>
                          <button
                            onClick={() => handleView(keeper._id)}
                            className="w-7 h-7 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-all flex items-center justify-center"
                            title="View"
                          >
                            <Eye size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ===== DESKTOP TABLE VIEW ===== */}
              <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">ID</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Name</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Phone</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Department</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Orders</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {storeKeepers.map(keeper => (
                        <tr key={keeper._id} className="hover:bg-slate-50 transition-all">
                          <td className="px-6 py-4 font-mono font-bold text-green-600">{keeper.storeKeeperId}</td>
                          <td className="px-6 py-4 font-medium">{keeper.name}</td>
                          <td className="px-6 py-4">{keeper.phone}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">{keeper.email}</td>
                          <td className="px-6 py-4 capitalize">{keeper.department}</td>
                          <td className="px-6 py-4">
                            {keeper.isActive ? (
                              <span className="flex items-center gap-1 text-green-600">
                                <CheckCircle size={14} /> Active
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-red-600">
                                <XCircle size={14} /> Inactive
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm">{keeper.stats?.total || 0} orders</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleView(keeper._id)}
                                className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-all flex items-center justify-center"
                                title="View"
                              >
                                <Eye size={16} />
                              </button>
                              {canEdit && (
                                <button
                                  onClick={() => handleEdit(keeper._id)}
                                  className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all flex items-center justify-center"
                                  title="Edit"
                                >
                                  <Edit size={16} />
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  onClick={() => handleDeleteClick(keeper)}
                                  className="w-8 h-8 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all flex items-center justify-center"
                                  title="Delete"
                                >
                                  <Trash2 size={16} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Desktop Pagination */}
                {pagination?.pages > 1 && (
                  <div className="px-6 py-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        className="px-2 py-1 bg-slate-50 border rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      >
                        {itemsPerPageOptions.map(n => (
                          <option key={n} value={n}>{n} per page</option>
                        ))}
                      </select>
                      <span className="text-sm text-slate-500">
                        Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-8 h-8 rounded-lg flex items-center justify-center disabled:text-slate-300 hover:bg-slate-100 transition-all"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-sm font-medium">
                        {currentPage} / {pagination.pages}
                      </span>
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pagination.pages}
                        className="w-8 h-8 rounded-lg flex items-center justify-center disabled:text-slate-300 hover:bg-slate-100 transition-all"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Empty State
            <div className="bg-white rounded-xl p-8 text-center">
              <Store size={40} className="text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-base">No store keepers found</p>
              {canAdd && (
                <button
                  onClick={handleAdd}
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold inline-flex items-center justify-center gap-2 text-sm"
                >
                  <Plus size={16} />
                  Add Your First Store Keeper
                </button>
              )}
            </div>
          )}
        </div>

        {/* Mobile Pagination */}
        {pagination?.pages > 1 && storeKeepers?.length > 0 && (
          <div className="lg:hidden mt-4 bg-white rounded-xl p-4">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center justify-between w-full">
                <select
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="px-2 py-1 bg-slate-50 border rounded-lg text-xs focus:ring-2 focus:ring-green-500 outline-none"
                >
                  {itemsPerPageOptions.map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <span className="text-xs text-slate-500">
                  Page {currentPage}/{pagination.pages}
                </span>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center disabled:text-slate-300 hover:bg-slate-100 transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="px-4 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-medium">
                  {currentPage} / {pagination.pages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                  className="w-8 h-8 rounded-lg flex items-center justify-center disabled:text-slate-300 hover:bg-slate-100 transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              
              <p className="text-xs text-slate-400 text-center">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-xl lg:rounded-2xl shadow-2xl animate-in zoom-in duration-300 mx-4">
            <div className="p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <XCircle size={24} className="text-red-600 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-center text-slate-800 mb-2">Delete Store Keeper?</h3>
              <p className="text-sm sm:text-base text-center text-slate-500 mb-4 sm:mb-6">
                Are you sure you want to delete <span className="font-black text-slate-700">{selected.name}</span>?
                This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 sm:py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg sm:rounded-xl font-black transition-all text-sm sm:text-base order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 py-3 sm:py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg sm:rounded-xl font-black transition-all text-sm sm:text-base order-1 sm:order-2"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}