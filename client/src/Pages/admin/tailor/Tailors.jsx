// // pages/tailors/Tailors.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Plus,
//   Search,
//   Filter,
//   Eye,
//   Edit,
//   Trash2,
//   Calendar,
//   CheckCircle,
//   XCircle,
//   AlertCircle,
//   Clock,
//   Users,
//   Scissors,
//   UserCheck,
//   UserX,
//   Coffee,
//   ChevronLeft,
//   ChevronRight,
//   Menu,
//   Grid
// } from "lucide-react";
// import { fetchAllTailors, deleteTailor, fetchTailorStats } from "../../../features/tailor/tailorSlice";
// import showToast from "../../../utils/toast";
// import StatusBadge from "../../../components/common/StatusBadge";
// import LeaveStatusModal from "../../../components/modals/LeaveStatusModal";

// export default function Tailors() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
  
//   const { tailors, tailorStats, loading, pagination } = useSelector((state) => state.tailor);
//   const { user } = useSelector((state) => state.auth);

//   // ✅ Get base path based on user role
//   const basePath = user?.role === "ADMIN" ? "/admin" : 
//                    user?.role === "STORE_KEEPER" ? "/storekeeper" : 
//                    "/cuttingmaster";

//   // ✅ Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
  
//   // Filter states
//   const [searchTerm, setSearchTerm] = useState("");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [availabilityFilter, setAvailabilityFilter] = useState("all");
  
//   // Modal states
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedTailor, setSelectedTailor] = useState(null);
//   const [showLeaveModal, setShowLeaveModal] = useState(false);
  
//   // Mobile state
//   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
//   const [mobileView, setMobileView] = useState("grid"); // 'grid' or 'list'

//   const isAdmin = user?.role === "ADMIN";
//   const isStoreKeeper = user?.role === "STORE_KEEPER";
//   const isCuttingMaster = user?.role === "CUTTING_MASTER";
//   const canEdit = isAdmin || isStoreKeeper;
//   const canDelete = isAdmin;
//   const canAdd = isAdmin || isStoreKeeper;

//   // ✅ Fetch tailors with pagination
//   useEffect(() => {
//     dispatch(fetchAllTailors({ 
//       page: currentPage,
//       limit: itemsPerPage,
//       search: searchTerm, 
//       status: statusFilter,
//       availability: availabilityFilter 
//     }));
//     dispatch(fetchTailorStats());
//   }, [dispatch, currentPage, itemsPerPage, searchTerm, statusFilter, availabilityFilter]);

//   // ✅ Handle Add Tailor - with basePath
//   const handleAddTailor = () => {
//     navigate(`${basePath}/tailors/add`);
//   };

//   // ✅ Handle View Tailor - with basePath
//   const handleViewTailor = (id) => {
//     navigate(`${basePath}/tailors/${id}`);
//   };

//   // ✅ Handle Edit Tailor - with basePath
//   const handleEditTailor = (id) => {
//     if (canEdit) {
//       navigate(`${basePath}/tailors/edit/${id}`);
//     } else {
//       showToast.error("You don't have permission to edit tailors");
//     }
//   };

//   const handleDeleteClick = (tailor) => {
//     setSelectedTailor(tailor);
//     setShowDeleteModal(true);
//   };

//   const handleDeleteConfirm = async () => {
//     try {
//       await dispatch(deleteTailor(selectedTailor._id)).unwrap();
//       showToast.success("Tailor deleted successfully");
//       setShowDeleteModal(false);
//       setSelectedTailor(null);
//     } catch (error) {
//       showToast.error(error || "Failed to delete tailor");
//     }
//   };

//   const handleLeaveUpdate = (tailor) => {
//     setSelectedTailor(tailor);
//     setShowLeaveModal(true);
//   };

//   const handleLeaveStatusUpdated = () => {
//     dispatch(fetchAllTailors({ 
//       page: currentPage,
//       limit: itemsPerPage,
//       search: searchTerm, 
//       status: statusFilter,
//       availability: availabilityFilter 
//     }));
//   };

//   // ✅ Handle page change
//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= (pagination?.pages || 1)) {
//       setCurrentPage(newPage);
//     }
//   };

//   // ✅ Handle items per page change
//   const handleItemsPerPageChange = (e) => {
//     setItemsPerPage(Number(e.target.value));
//     setCurrentPage(1); // Reset to first page
//   };

//   const getLeaveStatusIcon = (status) => {
//     switch(status) {
//       case "present": return <UserCheck size={16} className="text-green-600" />;
//       case "leave": return <UserX size={16} className="text-red-600" />;
//       case "half-day": return <Coffee size={16} className="text-orange-600" />;
//       case "holiday": return <Calendar size={16} className="text-purple-600" />;
//       default: return <UserCheck size={16} className="text-green-600" />;
//     }
//   };

//   const getLeaveStatusColor = (status) => {
//     switch(status) {
//       case "present": return "bg-green-100 text-green-800 border-green-200";
//       case "leave": return "bg-red-100 text-red-800 border-red-200";
//       case "half-day": return "bg-orange-100 text-orange-800 border-orange-200";
//       case "holiday": return "bg-purple-100 text-purple-800 border-purple-200";
//       default: return "bg-green-100 text-green-800 border-green-200";
//     }
//   };

//   const statusOptions = [
//     { value: "all", label: "All Status" },
//     { value: "present", label: "Present" },
//     { value: "leave", label: "On Leave" },
//     { value: "half-day", label: "Half Day" },
//     { value: "holiday", label: "Holiday" },
//   ];

//   const availabilityOptions = [
//     { value: "all", label: "All" },
//     { value: "available", label: "Available" },
//     { value: "unavailable", label: "Unavailable" },
//   ];

//   // ✅ Items per page options
//   const itemsPerPageOptions = [5, 10, 25, 50, 100];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* ===== MOBILE HEADER ===== */}
//       <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-lg font-bold text-gray-800">Tailors Management</h1>
//             <p className="text-xs text-gray-500 mt-0.5">Manage all tailors</p>
//           </div>
//           <div className="flex items-center gap-2">
//             {canAdd && (
//               <button
//                 onClick={handleAddTailor}
//                 className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//               >
//                 <Plus size={20} />
//               </button>
//             )}
//             <button
//               onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
//               className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
//             >
//               <Filter size={20} />
//             </button>
//           </div>
//         </div>

//         {/* Mobile Search Bar */}
//         <div className="relative mt-3">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//           <input
//             type="text"
//             placeholder="Search tailors..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//           />
//         </div>

//         {/* Mobile Stats Row */}
//         <div className="grid grid-cols-5 gap-1 mt-3">
//           <div className="text-center">
//             <div className="text-xs font-bold text-blue-600">{tailorStats?.total || 0}</div>
//             <div className="text-[10px] text-gray-500 truncate">Total</div>
//           </div>
//           <div className="text-center">
//             <div className="text-xs font-bold text-green-600">{tailorStats?.present || 0}</div>
//             <div className="text-[10px] text-gray-500 truncate">Present</div>
//           </div>
//           <div className="text-center">
//             <div className="text-xs font-bold text-red-600">{tailorStats?.onLeave || 0}</div>
//             <div className="text-[10px] text-gray-500 truncate">Leave</div>
//           </div>
//           <div className="text-center">
//             <div className="text-xs font-bold text-orange-600">{tailorStats?.halfDay || 0}</div>
//             <div className="text-[10px] text-gray-500 truncate">Half Day</div>
//           </div>
//           <div className="text-center">
//             <div className="text-xs font-bold text-purple-600">{tailorStats?.available || 0}</div>
//             <div className="text-[10px] text-gray-500 truncate">Available</div>
//           </div>
//         </div>

//         {/* Mobile Filters Dropdown */}
//         {mobileFiltersOpen && (
//           <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-30">
//             <div className="space-y-3">
//               <div>
//                 <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//                 >
//                   {statusOptions.map(option => (
//                     <option key={option.value} value={option.value}>{option.label}</option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-xs font-medium text-gray-500 mb-1">Availability</label>
//                 <select
//                   value={availabilityFilter}
//                   onChange={(e) => setAvailabilityFilter(e.target.value)}
//                   className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//                 >
//                   {availabilityOptions.map(option => (
//                     <option key={option.value} value={option.value}>{option.label}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="flex gap-2 pt-2">
//                 <button
//                   onClick={() => {
//                     setStatusFilter("all");
//                     setAvailabilityFilter("all");
//                   }}
//                   className="flex-1 px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium"
//                 >
//                   Reset
//                 </button>
//                 <button
//                   onClick={() => setMobileFiltersOpen(false)}
//                   className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
//                 >
//                   Apply
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ===== DESKTOP HEADER (Hidden on mobile) ===== */}
//       <div className="hidden md:block p-8">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
//           <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-slate-500">Total Tailors</p>
//                 <p className="text-3xl font-black text-slate-800">{tailorStats?.total || 0}</p>
//               </div>
//               <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
//                 <Scissors size={24} className="text-blue-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-green-50 p-6 rounded-2xl shadow-sm border border-green-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-green-600">Present</p>
//                 <p className="text-3xl font-black text-green-700">{tailorStats?.present || 0}</p>
//               </div>
//               <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
//                 <UserCheck size={24} className="text-green-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-red-50 p-6 rounded-2xl shadow-sm border border-red-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-red-600">On Leave</p>
//                 <p className="text-3xl font-black text-red-700">{tailorStats?.onLeave || 0}</p>
//               </div>
//               <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
//                 <UserX size={24} className="text-red-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-orange-50 p-6 rounded-2xl shadow-sm border border-orange-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-orange-600">Half Day</p>
//                 <p className="text-3xl font-black text-orange-700">{tailorStats?.halfDay || 0}</p>
//               </div>
//               <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
//                 <Coffee size={24} className="text-orange-600" />
//               </div>
//             </div>
//           </div>

//           <div className="bg-purple-50 p-6 rounded-2xl shadow-sm border border-purple-100">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-purple-600">Available</p>
//                 <p className="text-3xl font-black text-purple-700">{tailorStats?.available || 0}</p>
//               </div>
//               <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
//                 <CheckCircle size={24} className="text-purple-600" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Header */}
//         <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">
//               Tailors Management
//             </h1>
//             <p className="text-slate-500 font-medium">Manage all tailors and their work assignments</p>
//           </div>
//           {canAdd && (
//             <button
//               onClick={handleAddTailor}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
//             >
//               <Plus size={20} />
//               Add Tailor
//             </button>
//           )}
//         </div>

//         {/* Filters */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//           <div className="relative md:col-span-2">
//             <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
//             <input
//               type="text"
//               placeholder="Search by name, phone, ID..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
//             />
//           </div>

//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
//           >
//             {statusOptions.map(option => (
//               <option key={option.value} value={option.value}>{option.label}</option>
//             ))}
//           </select>

//           <select
//             value={availabilityFilter}
//             onChange={(e) => setAvailabilityFilter(e.target.value)}
//             className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
//           >
//             {availabilityOptions.map(option => (
//               <option key={option.value} value={option.value}>{option.label}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* ===== MAIN CONTENT ===== */}
//       <div className="p-4 md:p-0 md:px-8 md:pb-8">
//         {/* Mobile View Toggle */}
//         <div className="md:hidden flex items-center justify-between mb-3">
//           <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
//             <button
//               onClick={() => setMobileView("grid")}
//               className={`p-2 rounded-lg transition ${
//                 mobileView === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"
//               }`}
//             >
//               <Grid size={18} />
//             </button>
//             <button
//               onClick={() => setMobileView("list")}
//               className={`p-2 rounded-lg transition ${
//                 mobileView === "list" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500"
//               }`}
//             >
//               <Menu size={18} />
//             </button>
//           </div>
//           <span className="text-sm text-gray-500">
//             {tailors?.length || 0} tailors
//           </span>
//         </div>

//         {/* Loading State */}
//         {loading ? (
//           <div className="bg-white rounded-xl p-8 text-center">
//             <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
//             <p className="mt-2 text-slate-500">Loading tailors...</p>
//           </div>
//         ) : tailors?.length > 0 ? (
//           <>
//             {/* ===== MOBILE GRID VIEW ===== */}
//             {mobileView === "grid" && (
//               <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
//                 {tailors.map((tailor) => (
//                   <div
//                     key={tailor._id}
//                     className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-md transition-all"
//                   >
//                     <div className="flex items-start justify-between mb-2">
//                       <div className="flex items-center gap-2">
//                         <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
//                           {tailor.name?.charAt(0)}
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-800 text-sm">{tailor.name}</p>
//                           <p className="text-[10px] text-gray-400">{tailor.tailorId}</p>
//                         </div>
//                       </div>
//                       <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${getLeaveStatusColor(tailor.leaveStatus)}`}>
//                         {tailor.leaveStatus}
//                       </span>
//                     </div>

//                     <div className="space-y-1 mb-2">
//                       <p className="text-xs text-gray-600">{tailor.phone}</p>
//                       <div className="flex flex-wrap gap-1">
//                         {tailor.specialization?.slice(0, 2).map((spec, idx) => (
//                           <span key={idx} className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[8px]">
//                             {spec}
//                           </span>
//                         ))}
//                         {tailor.specialization?.length > 2 && (
//                           <span className="text-[8px] text-gray-400">+{tailor.specialization.length - 2}</span>
//                         )}
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-3 gap-1 text-center mb-2 text-[10px]">
//                       <div>
//                         <div className="font-bold text-blue-600">{tailor.workStats?.totalAssigned || 0}</div>
//                         <div className="text-gray-500">Total</div>
//                       </div>
//                       <div>
//                         <div className="font-bold text-green-600">{tailor.workStats?.completed || 0}</div>
//                         <div className="text-gray-500">Done</div>
//                       </div>
//                       <div>
//                         <div className="font-bold text-orange-600">{tailor.workStats?.inProgress || 0}</div>
//                         <div className="text-gray-500">Progress</div>
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-end gap-1 pt-1 border-t border-gray-100">
//                       <button
//                         onClick={() => handleViewTailor(tailor._id)}
//                         className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
//                         title="View"
//                       >
//                         <Eye size={14} />
//                       </button>
//                       {canEdit && (
//                         <button
//                           onClick={() => handleLeaveUpdate(tailor)}
//                           className="p-1.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100"
//                           title="Leave"
//                         >
//                           <Calendar size={14} />
//                         </button>
//                       )}
//                       {canEdit && (
//                         <button
//                           onClick={() => handleEditTailor(tailor._id)}
//                           className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
//                           title="Edit"
//                         >
//                           <Edit size={14} />
//                         </button>
//                       )}
//                       {canDelete && (
//                         <button
//                           onClick={() => handleDeleteClick(tailor)}
//                           className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
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
//               <div className="md:hidden space-y-2">
//                 {tailors.map((tailor) => (
//                   <div
//                     key={tailor._id}
//                     className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-md transition-all"
//                   >
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="flex items-center gap-2">
//                         <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
//                           {tailor.name?.charAt(0)}
//                         </div>
//                         <div>
//                           <p className="font-medium text-gray-800 text-sm">{tailor.name}</p>
//                           <p className="text-xs text-gray-500">{tailor.phone}</p>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-1">
//                         <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${getLeaveStatusColor(tailor.leaveStatus)}`}>
//                           {tailor.leaveStatus}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-between text-xs">
//                       <div className="text-gray-500">ID: {tailor.tailorId}</div>
//                       <div className="flex items-center gap-3">
//                         <span className="text-blue-600">{tailor.workStats?.totalAssigned || 0} works</span>
//                         <button
//                           onClick={() => handleViewTailor(tailor._id)}
//                           className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg"
//                         >
//                           <Eye size={14} />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}

//             {/* ===== DESKTOP TABLE VIEW (Hidden on mobile) ===== */}
//             <div className="hidden md:block bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-slate-50 border-b border-slate-200">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
//                         Tailor ID
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
//                         Name
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
//                         Phone
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
//                         Specialization
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
//                         Experience
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
//                         Work Stats
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100">
//                     {tailors.map((tailor) => (
//                       <tr key={tailor._id} className="hover:bg-slate-50 transition-all">
//                         <td className="px-6 py-4 font-mono font-bold text-blue-600">
//                           {tailor.tailorId}
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
//                               {tailor.name?.charAt(0)}
//                             </div>
//                             <div>
//                               <p className="font-medium text-slate-800">{tailor.name}</p>
//                               <p className="text-xs text-slate-400">{tailor.email || 'No email'}</p>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 text-slate-600">
//                           {tailor.phone}
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex flex-wrap gap-1">
//                             {tailor.specialization?.map((spec, idx) => (
//                               <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
//                                 {spec}
//                               </span>
//                             ))}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <span className="font-medium">{tailor.experience || 0} years</span>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-2">
//                             {getLeaveStatusIcon(tailor.leaveStatus)}
//                             <span className={`text-sm font-medium ${
//                               tailor.leaveStatus === 'present' ? 'text-green-600' :
//                               tailor.leaveStatus === 'leave' ? 'text-red-600' :
//                               tailor.leaveStatus === 'half-day' ? 'text-orange-600' :
//                               'text-purple-600'
//                             }`}>
//                               {tailor.leaveStatus?.replace('-', ' ')}
//                             </span>
//                           </div>
//                           {!tailor.isAvailable && (
//                             <span className="text-xs text-red-500 block mt-1">Unavailable</span>
//                           )}
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="space-y-1">
//                             <div className="flex items-center gap-2 text-xs">
//                               <span className="text-slate-400">Total:</span>
//                               <span className="font-bold">{tailor.workStats?.totalAssigned || 0}</span>
//                             </div>
//                             <div className="flex items-center gap-2 text-xs">
//                               <span className="text-green-600">✓ Completed:</span>
//                               <span className="font-bold">{tailor.workStats?.completed || 0}</span>
//                             </div>
//                             <div className="flex items-center gap-2 text-xs">
//                               <span className="text-orange-600">⚡ In Progress:</span>
//                               <span className="font-bold">{tailor.workStats?.inProgress || 0}</span>
//                             </div>
//                             <div className="flex items-center gap-2 text-xs">
//                               <span className="text-yellow-600">⏳ Pending:</span>
//                               <span className="font-bold">{tailor.workStats?.pending || 0}</span>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center gap-2">
//                             <button
//                               onClick={() => handleViewTailor(tailor._id)}
//                               className="p-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200"
//                               title="View Details"
//                             >
//                               <Eye size={16} />
//                             </button>
                            
//                             {(canEdit || tailor._id === user?.tailorId) && (
//                               <button
//                                 onClick={() => handleLeaveUpdate(tailor)}
//                                 className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200"
//                                 title="Update Leave Status"
//                               >
//                                 <Calendar size={16} />
//                               </button>
//                             )}

//                             {canEdit && (
//                               <button
//                                 onClick={() => handleEditTailor(tailor._id)}
//                                 className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
//                                 title="Edit"
//                               >
//                                 <Edit size={16} />
//                               </button>
//                             )}

//                             {canDelete && (
//                               <button
//                                 onClick={() => handleDeleteClick(tailor)}
//                                 className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
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
//             </div>
//           </>
//         ) : (
//           // Empty State
//           <div className="bg-white rounded-xl p-8 text-center">
//             <Scissors size={48} className="text-gray-300 mx-auto mb-4" />
//             <p className="text-gray-500 text-lg">No tailors found</p>
//             {canAdd && (
//               <button
//                 onClick={handleAddTailor}
//                 className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold inline-flex items-center gap-2"
//               >
//                 <Plus size={18} />
//                 Add Your First Tailor
//               </button>
//             )}
//           </div>
//         )}

//         {/* ✅ Pagination Section - Responsive */}
//         {pagination?.pages > 1 && (
//           <div className="mt-4 bg-white rounded-xl p-4 md:p-6">
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//               {/* Mobile Pagination Info */}
//               <div className="md:hidden text-sm text-gray-600 text-center">
//                 Showing {(pagination.page - 1) * pagination.limit + 1} -{' '}
//                 {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
//                 {pagination.total}
//               </div>

//               {/* Desktop Pagination */}
//               <div className="hidden md:flex items-center gap-4">
//                 {/* Items per page selector */}
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm text-slate-500">Show</span>
//                   <select
//                     value={itemsPerPage}
//                     onChange={handleItemsPerPageChange}
//                     className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
//                   >
//                     {itemsPerPageOptions.map(option => (
//                       <option key={option} value={option}>{option}</option>
//                     ))}
//                   </select>
//                   <span className="text-sm text-slate-500">entries</span>
//                 </div>

//                 {/* Showing info */}
//                 <div className="text-sm text-slate-500">
//                   Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
//                   {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
//                   {pagination.total} entries
//                 </div>
//               </div>

//               {/* Page navigation - Works on both mobile and desktop */}
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => handlePageChange(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className={`p-2 rounded-lg transition-all ${
//                     currentPage === 1
//                       ? 'text-gray-300 cursor-not-allowed'
//                       : 'text-gray-600 hover:bg-gray-100'
//                   }`}
//                 >
//                   <ChevronLeft size={20} />
//                 </button>

//                 {/* Page numbers - Hidden on very small screens */}
//                 <div className="hidden sm:flex items-center gap-1">
//                   {[...Array(pagination.pages)].map((_, i) => {
//                     const pageNum = i + 1;
                    
//                     if (
//                       pageNum === 1 ||
//                       pageNum === pagination.pages ||
//                       (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
//                     ) {
//                       return (
//                         <button
//                           key={pageNum}
//                           onClick={() => handlePageChange(pageNum)}
//                           className={`w-10 h-10 rounded-lg font-bold transition-all ${
//                             currentPage === pageNum
//                               ? 'bg-blue-600 text-white'
//                               : 'text-gray-600 hover:bg-gray-100'
//                           }`}
//                         >
//                           {pageNum}
//                         </button>
//                       );
//                     } else if (
//                       pageNum === currentPage - 2 ||
//                       pageNum === currentPage + 2
//                     ) {
//                       return <span key={pageNum} className="text-gray-400">...</span>;
//                     }
//                     return null;
//                   })}
//                 </div>

//                 {/* Mobile current page indicator */}
//                 <span className="sm:hidden text-sm font-medium">
//                   Page {currentPage} of {pagination.pages}
//                 </span>

//                 <button
//                   onClick={() => handlePageChange(currentPage + 1)}
//                   disabled={currentPage === pagination.pages}
//                   className={`p-2 rounded-lg transition-all ${
//                     currentPage === pagination.pages
//                       ? 'text-gray-300 cursor-not-allowed'
//                       : 'text-gray-600 hover:bg-gray-100'
//                   }`}
//                 >
//                   <ChevronRight size={20} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Delete Confirmation Modal */}
//       {showDeleteModal && selectedTailor && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
//           <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in zoom-in duration-300">
//             <div className="p-6">
//               <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <AlertCircle size={32} className="text-red-600" />
//               </div>
//               <h2 className="text-2xl font-black text-center text-slate-800 mb-2">Delete Tailor</h2>
//               <p className="text-center text-slate-500 mb-6">
//                 Are you sure you want to delete <span className="font-black text-slate-700">{selectedTailor.name}</span>?
//                 This action cannot be undone.
//               </p>
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setShowDeleteModal(false)}
//                   className="flex-1 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black transition-all"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleDeleteConfirm}
//                   className="flex-1 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black transition-all"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Leave Status Modal */}
//       {showLeaveModal && selectedTailor && (
//         <LeaveStatusModal
//           tailor={selectedTailor}
//           onClose={() => {
//             setShowLeaveModal(false);
//             setSelectedTailor(null);
//           }}
//           onUpdate={handleLeaveStatusUpdated}
//         />
//       )}
//     </div>
//   );
// }


















// pages/tailors/Tailors.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Users,
  Scissors,
  UserCheck,
  UserX,
  Coffee,
  ChevronLeft,
  ChevronRight,
  Menu,
  Grid,
  X
} from "lucide-react";
import { fetchAllTailors, deleteTailor, fetchTailorStats } from "../../../features/tailor/tailorSlice";
import showToast from "../../../utils/toast";
import StatusBadge from "../../../components/common/StatusBadge";
import LeaveStatusModal from "../../../components/modals/LeaveStatusModal";

export default function Tailors() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { tailors, tailorStats, loading, pagination } = useSelector((state) => state.tailor);
  const { user } = useSelector((state) => state.auth);

  // Get base path based on user role
  const basePath = user?.role === "ADMIN" ? "/admin" : 
                   user?.role === "STORE_KEEPER" ? "/storekeeper" : 
                   "/cuttingmaster";

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [availabilityFilter, setAvailabilityFilter] = useState("all");
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTailor, setSelectedTailor] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  
  // Mobile state
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mobileView, setMobileView] = useState("grid"); // 'grid' or 'list'

  const isAdmin = user?.role === "ADMIN";
  const isStoreKeeper = user?.role === "STORE_KEEPER";
  const isCuttingMaster = user?.role === "CUTTING_MASTER";
  const canEdit = isAdmin || isStoreKeeper;
  const canDelete = isAdmin;
  const canAdd = isAdmin || isStoreKeeper;

  // Fetch tailors with pagination
  useEffect(() => {
    dispatch(fetchAllTailors({ 
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm, 
      status: statusFilter,
      availability: availabilityFilter 
    }));
    dispatch(fetchTailorStats());
  }, [dispatch, currentPage, itemsPerPage, searchTerm, statusFilter, availabilityFilter]);

  // Handle Add Tailor - with basePath
  const handleAddTailor = () => {
    navigate(`${basePath}/tailors/add`);
  };

  // Handle View Tailor - with basePath
  const handleViewTailor = (id) => {
    navigate(`${basePath}/tailors/${id}`);
  };

  // Handle Edit Tailor - with basePath
  const handleEditTailor = (id) => {
    if (canEdit) {
      navigate(`${basePath}/tailors/edit/${id}`);
    } else {
      showToast.error("You don't have permission to edit tailors");
    }
  };

  const handleDeleteClick = (tailor) => {
    setSelectedTailor(tailor);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteTailor(selectedTailor._id)).unwrap();
      showToast.success("Tailor deleted successfully");
      setShowDeleteModal(false);
      setSelectedTailor(null);
    } catch (error) {
      showToast.error(error || "Failed to delete tailor");
    }
  };

  const handleLeaveUpdate = (tailor) => {
    setSelectedTailor(tailor);
    setShowLeaveModal(true);
  };

  const handleLeaveStatusUpdated = () => {
    dispatch(fetchAllTailors({ 
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm, 
      status: statusFilter,
      availability: availabilityFilter 
    }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination?.pages || 1)) {
      setCurrentPage(newPage);
    }
  };

  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page
  };

  const getLeaveStatusIcon = (status) => {
    switch(status) {
      case "present": return <UserCheck size={14} className="text-green-600" />;
      case "leave": return <UserX size={14} className="text-red-600" />;
      case "half-day": return <Coffee size={14} className="text-orange-600" />;
      case "holiday": return <Calendar size={14} className="text-purple-600" />;
      default: return <UserCheck size={14} className="text-green-600" />;
    }
  };

  const getLeaveStatusColor = (status) => {
    switch(status) {
      case "present": return "bg-green-100 text-green-800 border-green-200";
      case "leave": return "bg-red-100 text-red-800 border-red-200";
      case "half-day": return "bg-orange-100 text-orange-800 border-orange-200";
      case "holiday": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "present", label: "Present" },
    { value: "leave", label: "On Leave" },
    { value: "half-day", label: "Half Day" },
    { value: "holiday", label: "Holiday" },
  ];

  const availabilityOptions = [
    { value: "all", label: "All" },
    { value: "available", label: "Available" },
    { value: "unavailable", label: "Unavailable" },
  ];

  // Items per page options
  const itemsPerPageOptions = [5, 10, 25, 50, 100];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ===== MOBILE HEADER ===== */}
      <div className="lg:hidden bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-black text-slate-800">Tailors</h1>
          <div className="flex items-center gap-2">
            {canAdd && (
              <button
                onClick={handleAddTailor}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
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
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search tailors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Mobile Stats Row */}
        <div className="grid grid-cols-5 gap-1 px-4 pb-3">
          <div className="text-center">
            <div className="text-xs font-bold text-blue-600">{tailorStats?.total || 0}</div>
            <div className="text-[10px] text-slate-500 truncate">Total</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-bold text-green-600">{tailorStats?.present || 0}</div>
            <div className="text-[10px] text-slate-500 truncate">Present</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-bold text-red-600">{tailorStats?.onLeave || 0}</div>
            <div className="text-[10px] text-slate-500 truncate">Leave</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-bold text-orange-600">{tailorStats?.halfDay || 0}</div>
            <div className="text-[10px] text-slate-500 truncate">Half Day</div>
          </div>
          <div className="text-center">
            <div className="text-xs font-bold text-purple-600">{tailorStats?.available || 0}</div>
            <div className="text-[10px] text-slate-500 truncate">Available</div>
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
                <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Availability</label>
                <select
                  value={availabilityFilter}
                  onChange={(e) => setAvailabilityFilter(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {availabilityOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    setStatusFilter("all");
                    setAvailabilityFilter("all");
                  }}
                  className="flex-1 px-3 py-2.5 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 px-3 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===== DESKTOP HEADER (Hidden on mobile) ===== */}
      <div className="hidden lg:block max-w-7xl mx-auto px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Tailors</p>
                <p className="text-3xl font-black text-slate-800">{tailorStats?.total || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Scissors size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-2xl shadow-sm border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Present</p>
                <p className="text-3xl font-black text-green-700">{tailorStats?.present || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <UserCheck size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-2xl shadow-sm border border-red-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">On Leave</p>
                <p className="text-3xl font-black text-red-700">{tailorStats?.onLeave || 0}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <UserX size={24} className="text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-6 rounded-2xl shadow-sm border border-orange-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600">Half Day</p>
                <p className="text-3xl font-black text-orange-700">{tailorStats?.halfDay || 0}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Coffee size={24} className="text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-2xl shadow-sm border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600">Available</p>
                <p className="text-3xl font-black text-purple-700">{tailorStats?.available || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <CheckCircle size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">
              Tailors Management
            </h1>
            <p className="text-slate-500 font-medium">Manage all tailors and their work assignments</p>
          </div>
          {canAdd && (
            <button
              onClick={handleAddTailor}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
            >
              <Plus size={20} />
              Add Tailor
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="relative md:col-span-2">
            <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, phone, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
          >
            {availabilityOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-8">
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
              <Menu size={16} />
            </button>
          </div>
          <span className="text-xs text-slate-500">
            {tailors?.length || 0} tailors
          </span>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-2 text-sm text-slate-500">Loading tailors...</p>
          </div>
        ) : tailors?.length > 0 ? (
          <>
            {/* ===== MOBILE GRID VIEW - COMPLETELY CENTERED ===== */}
            {mobileView === "grid" && (
              <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tailors.map((tailor) => (
                  <div
                    key={tailor._id}
                    className="bg-white rounded-xl border border-slate-200 p-3 hover:shadow-md transition-all"
                  >
                    {/* Header with Avatar and Status */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {tailor.name?.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 text-sm truncate max-w-[100px]">{tailor.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">{tailor.tailorId}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap ${getLeaveStatusColor(tailor.leaveStatus)}`}>
                        {tailor.leaveStatus}
                      </span>
                    </div>

                    {/* Contact and Specialization */}
                    <div className="space-y-1 mb-2">
                      <p className="text-xs text-slate-600 truncate">{tailor.phone}</p>
                      <div className="flex flex-wrap gap-1">
                        {tailor.specialization?.slice(0, 2).map((spec, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[8px]">
                            {spec}
                          </span>
                        ))}
                        {tailor.specialization?.length > 2 && (
                          <span className="text-[8px] text-slate-400">+{tailor.specialization.length - 2}</span>
                        )}
                      </div>
                    </div>

                    {/* Work Stats */}
                    <div className="grid grid-cols-3 gap-1 text-center mb-3 text-[10px]">
                      <div>
                        <div className="font-bold text-blue-600">{tailor.workStats?.totalAssigned || 0}</div>
                        <div className="text-slate-500">Total</div>
                      </div>
                      <div>
                        <div className="font-bold text-green-600">{tailor.workStats?.completed || 0}</div>
                        <div className="text-slate-500">Done</div>
                      </div>
                      <div>
                        <div className="font-bold text-orange-600">{tailor.workStats?.inProgress || 0}</div>
                        <div className="text-slate-500">Progress</div>
                      </div>
                    </div>

                    {/* Action Icons - PERFECTLY CENTERED */}
                    <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleViewTailor(tailor._id)}
                        className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-all flex items-center justify-center"
                        title="View"
                      >
                        <Eye size={14} />
                      </button>
                      {canEdit && (
                        <button
                          onClick={() => handleLeaveUpdate(tailor)}
                          className="w-8 h-8 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-all flex items-center justify-center"
                          title="Leave"
                        >
                          <Calendar size={14} />
                        </button>
                      )}
                      {canEdit && (
                        <button
                          onClick={() => handleEditTailor(tailor._id)}
                          className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all flex items-center justify-center"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                      )}
                      {canDelete && (
                        <button
                          onClick={() => handleDeleteClick(tailor)}
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

            {/* ===== MOBILE LIST VIEW - COMPLETELY CENTERED ===== */}
            {mobileView === "list" && (
              <div className="lg:hidden space-y-2">
                {tailors.map((tailor) => (
                  <div
                    key={tailor._id}
                    className="bg-white rounded-xl border border-slate-200 p-3 hover:shadow-md transition-all"
                  >
                    {/* Header with Avatar and Status */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {tailor.name?.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 text-sm truncate">{tailor.name}</p>
                          <p className="text-xs text-slate-500 truncate">{tailor.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap ${getLeaveStatusColor(tailor.leaveStatus)}`}>
                          {tailor.leaveStatus}
                        </span>
                      </div>
                    </div>

                    {/* Footer with ID and View Button */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="text-slate-500 truncate max-w-[100px]">ID: {tailor.tailorId}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 font-medium">{tailor.workStats?.totalAssigned || 0} works</span>
                        <button
                          onClick={() => handleViewTailor(tailor._id)}
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

            {/* ===== DESKTOP TABLE VIEW (Hidden on mobile) ===== */}
            <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                        Tailor ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                        Specialization
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                        Experience
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                        Work Stats
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tailors.map((tailor) => (
                      <tr key={tailor._id} className="hover:bg-slate-50 transition-all">
                        <td className="px-6 py-4 font-mono font-bold text-blue-600">
                          {tailor.tailorId}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                              {tailor.name?.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-slate-800 truncate max-w-[150px]">{tailor.name}</p>
                              <p className="text-xs text-slate-400 truncate">{tailor.email || 'No email'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {tailor.phone}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {tailor.specialization?.slice(0, 2).map((spec, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium whitespace-nowrap">
                                {spec}
                              </span>
                            ))}
                            {tailor.specialization?.length > 2 && (
                              <span className="text-xs text-slate-400">+{tailor.specialization.length - 2}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium">{tailor.experience || 0} years</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getLeaveStatusIcon(tailor.leaveStatus)}
                            <span className={`text-sm font-medium ${
                              tailor.leaveStatus === 'present' ? 'text-green-600' :
                              tailor.leaveStatus === 'leave' ? 'text-red-600' :
                              tailor.leaveStatus === 'half-day' ? 'text-orange-600' :
                              'text-purple-600'
                            }`}>
                              {tailor.leaveStatus?.replace('-', ' ')}
                            </span>
                          </div>
                          {!tailor.isAvailable && (
                            <span className="text-xs text-red-500 block mt-1">Unavailable</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-slate-400">Total:</span>
                              <span className="font-bold">{tailor.workStats?.totalAssigned || 0}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-green-600">✓ Completed:</span>
                              <span className="font-bold">{tailor.workStats?.completed || 0}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-orange-600">⚡ In Progress:</span>
                              <span className="font-bold">{tailor.workStats?.inProgress || 0}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <span className="text-yellow-600">⏳ Pending:</span>
                              <span className="font-bold">{tailor.workStats?.pending || 0}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleViewTailor(tailor._id)}
                              className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-all flex items-center justify-center"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            
                            {(canEdit || tailor._id === user?.tailorId) && (
                              <button
                                onClick={() => handleLeaveUpdate(tailor)}
                                className="w-8 h-8 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-all flex items-center justify-center"
                                title="Update Leave Status"
                              >
                                <Calendar size={16} />
                              </button>
                            )}

                            {canEdit && (
                              <button
                                onClick={() => handleEditTailor(tailor._id)}
                                className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all flex items-center justify-center"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                            )}

                            {canDelete && (
                              <button
                                onClick={() => handleDeleteClick(tailor)}
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
            </div>
          </>
        ) : (
          // Empty State
          <div className="bg-white rounded-xl p-8 text-center">
            <Scissors size={40} className="text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-base">No tailors found</p>
            {canAdd && (
              <button
                onClick={handleAddTailor}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold inline-flex items-center justify-center gap-2 text-sm"
              >
                <Plus size={16} />
                Add Your First Tailor
              </button>
            )}
          </div>
        )}

        {/* Pagination Section - Responsive */}
        {pagination?.pages > 1 && (
          <div className="mt-4 lg:mt-6 bg-white rounded-xl p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Mobile Pagination Info */}
              <div className="lg:hidden text-xs text-slate-600 text-center">
                Showing {(pagination.page - 1) * pagination.limit + 1} -{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total}
              </div>

              {/* Desktop Pagination */}
              <div className="hidden lg:flex items-center gap-4">
                {/* Items per page selector */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">Show</span>
                  <select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {itemsPerPageOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <span className="text-sm text-slate-500">entries</span>
                </div>

                {/* Showing info */}
                <div className="text-sm text-slate-500">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} entries
                </div>
              </div>

              {/* Page navigation - Works on both mobile and desktop */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`w-8 h-8 rounded-lg transition-all flex items-center justify-center ${
                    currentPage === 1
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ChevronLeft size={16} />
                </button>

                {/* Page numbers - Hidden on mobile */}
                <div className="hidden lg:flex items-center gap-1">
                  {[...Array(pagination.pages)].map((_, i) => {
                    const pageNum = i + 1;
                    
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
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === currentPage - 2 ||
                      pageNum === currentPage + 2
                    ) {
                      return <span key={pageNum} className="text-slate-400">...</span>;
                    }
                    return null;
                  })}
                </div>

                {/* Mobile current page indicator */}
                <span className="lg:hidden text-xs font-medium">
                  {currentPage}/{pagination.pages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.pages}
                  className={`w-8 h-8 rounded-lg transition-all flex items-center justify-center ${
                    currentPage === pagination.pages
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal - Responsive */}
      {showDeleteModal && selectedTailor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-xl lg:rounded-2xl shadow-2xl animate-in zoom-in duration-300">
            <div className="p-4 lg:p-6">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 lg:mb-4">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <h2 className="text-xl lg:text-2xl font-black text-center text-slate-800 mb-2">Delete Tailor</h2>
              <p className="text-sm lg:text-base text-center text-slate-500 mb-4 lg:mb-6">
                Are you sure you want to delete <span className="font-black text-slate-700">{selectedTailor.name}</span>?
                This action cannot be undone.
              </p>
              <div className="flex gap-2 lg:gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 lg:px-6 py-3 lg:py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg lg:rounded-xl font-black transition-all text-sm lg:text-base flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="flex-1 px-4 lg:px-6 py-3 lg:py-4 bg-red-600 hover:bg-red-700 text-white rounded-lg lg:rounded-xl font-black transition-all text-sm lg:text-base flex items-center justify-center"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leave Status Modal */}
      {showLeaveModal && selectedTailor && (
        <LeaveStatusModal
          tailor={selectedTailor}
          onClose={() => {
            setShowLeaveModal(false);
            setSelectedTailor(null);
          }}
          onUpdate={handleLeaveStatusUpdated}
        />
      )}
    </div>
  );
}