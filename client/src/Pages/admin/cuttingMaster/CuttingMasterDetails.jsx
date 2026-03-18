// // src/Pages/admin/cuttingMaster/CuttingMasterDetails.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   ArrowLeft,
//   Edit,
//   Trash2,
//   Calendar,
//   Phone,
//   Mail,
//   MapPin,
//   Briefcase,
//   Scissors,
//   CheckCircle,
//   Clock,
//   AlertCircle,
//   Star,
// } from "lucide-react";
// import { fetchCuttingMasterById, deleteCuttingMaster } from "../../../features/cuttingMaster/cuttingMasterSlice";
// import showToast from "../../../utils/toast";

// export default function CuttingMasterDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
  
//   const { currentCuttingMaster, works, workStats, loading } = useSelector((state) => state.cuttingMaster);
//   const { user } = useSelector((state) => state.auth);

//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [activeTab, setActiveTab] = useState("overview");

//   const isAdmin = user?.role === "ADMIN";
//   const canEdit = isAdmin;
//   const canDelete = isAdmin;

//   useEffect(() => {
//     if (id) {
//       dispatch(fetchCuttingMasterById(id));
//     }
//   }, [dispatch, id]);

//   const handleBack = () => {
//     navigate("/admin/cutting-masters");
//   };

//   const handleEdit = () => {
//     navigate(`/admin/cutting-masters/edit/${id}`);
//   };

//   const handleDelete = async () => {
//     try {
//       await dispatch(deleteCuttingMaster(id)).unwrap();
//       showToast.success("Cutting Master deleted successfully");
//       navigate("/admin/cutting-masters");
//     } catch (error) {
//       showToast.error(error || "Failed to delete");
//     }
//   };

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[400px]">
//         <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent"></div>
//       </div>
//     );
//   }

//   if (!currentCuttingMaster) {
//     return (
//       <div className="text-center py-16 bg-white rounded-3xl shadow-sm">
//         <Scissors size={64} className="mx-auto text-slate-300 mb-4" />
//         <h2 className="text-2xl font-black text-slate-800 mb-2">Cutting Master Not Found</h2>
//         <button onClick={handleBack} className="bg-orange-600 text-white px-8 py-4 rounded-xl font-bold">
//           Back to List
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <button onClick={handleBack} className="flex items-center gap-2 text-slate-600 hover:text-orange-600">
//           <ArrowLeft size={20} /> <span className="font-bold">Back</span>
//         </button>

//         <div className="flex gap-3">
//           {canEdit && (
//             <button onClick={handleEdit} className="bg-orange-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
//               <Edit size={18} /> Edit
//             </button>
//           )}
//           {canDelete && (
//             <button onClick={() => setShowDeleteModal(true)} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
//               <Trash2 size={18} /> Delete
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
//         {/* Profile Header */}
//         <div className="bg-gradient-to-r from-orange-600 to-red-600 px-8 py-6 text-white">
//           <div className="flex items-start justify-between">
//             <div className="flex items-center gap-6">
//               <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center text-5xl font-black">
//                 {currentCuttingMaster.name?.charAt(0)}
//               </div>
//               <div>
//                 <h1 className="text-3xl font-black mb-2">{currentCuttingMaster.name}</h1>
//                 <p className="text-orange-100">{currentCuttingMaster.cuttingMasterId}</p>
//                 <div className="flex gap-4 mt-2">
//                   <span className="flex items-center gap-1">
//                     <Briefcase size={16} /> {currentCuttingMaster.experience || 0} years
//                   </span>
//                   {currentCuttingMaster.isActive ? (
//                     <span className="flex items-center gap-1 text-green-300"><CheckCircle size={16} /> Active</span>
//                   ) : (
//                     <span className="flex items-center gap-1 text-red-300"><AlertCircle size={16} /> Inactive</span>
//                   )}
//                 </div>
//               </div>
//             </div>
//             <div className="text-right">
//               <p className="text-orange-200 text-sm">Joined</p>
//               <p className="font-bold">{formatDate(currentCuttingMaster.joiningDate)}</p>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="border-b px-8 flex gap-8">
//           {["overview", "works"].map(tab => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`py-4 font-bold capitalize border-b-2 transition-colors ${
//                 activeTab === tab ? "border-orange-600 text-orange-600" : "border-transparent text-slate-500"
//               }`}
//             >
//               {tab} {tab === "works" && `(${works?.length || 0})`}
//             </button>
//           ))}
//         </div>

//         {/* Tab Content */}
//         <div className="p-8">
//           {activeTab === "overview" && (
//             <div className="space-y-8">
//               {/* Stats Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <div className="bg-blue-50 p-6 rounded-xl"><p className="text-blue-600">Total Works</p><p className="text-3xl font-black">{workStats?.total || 0}</p></div>
//                 <div className="bg-green-50 p-6 rounded-xl"><p className="text-green-600">Completed</p><p className="text-3xl font-black">{workStats?.completed || 0}</p></div>
//                 <div className="bg-orange-50 p-6 rounded-xl"><p className="text-orange-600">In Progress</p><p className="text-3xl font-black">{workStats?.inProgress || 0}</p></div>
//                 <div className="bg-yellow-50 p-6 rounded-xl"><p className="text-yellow-600">Pending</p><p className="text-3xl font-black">{workStats?.pending || 0}</p></div>
//               </div>

//               {/* Contact Info */}
//               <div className="grid grid-cols-2 gap-6">
//                 <div className="space-y-4">
//                   <h3 className="font-black">Contact</h3>
//                   <div className="bg-slate-50 p-4 rounded-xl">
//                     <Phone className="text-orange-600 mb-2" size={18} />
//                     <p className="font-bold">{currentCuttingMaster.phone}</p>
//                   </div>
//                   <div className="bg-slate-50 p-4 rounded-xl">
//                     <Mail className="text-purple-600 mb-2" size={18} />
//                     <p className="font-bold break-all">{currentCuttingMaster.email}</p>
//                   </div>
//                   {currentCuttingMaster.address?.street && (
//                     <div className="bg-slate-50 p-4 rounded-xl">
//                       <MapPin className="text-green-600 mb-2" size={18} />
//                       <p>{currentCuttingMaster.address.street}</p>
//                       <p className="text-sm text-slate-600">
//                         {[currentCuttingMaster.address.city, currentCuttingMaster.address.state].filter(Boolean).join(', ')}
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 <div className="space-y-4">
//                   <h3 className="font-black">Professional</h3>
//                   <div className="bg-slate-50 p-4 rounded-xl">
//                     <Scissors className="text-indigo-600 mb-2" size={18} />
//                     <div className="flex flex-wrap gap-2">
//                       {currentCuttingMaster.specialization?.map((s, i) => (
//                         <span key={i} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs">{s}</span>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === "works" && (
//             <div>
//               <h3 className="font-black mb-4">Assigned Works</h3>
//               {works?.length > 0 ? (
//                 <div className="space-y-3">
//                   {works.map(work => (
//                     <div key={work._id} className="bg-slate-50 p-4 rounded-xl cursor-pointer hover:shadow-md"
//                          onClick={() => navigate(`/admin/works/${work._id}`)}>
//                       <div className="flex justify-between mb-2">
//                         <span className="font-mono font-bold text-orange-600">{work.workId}</span>
//                         <span className={`px-2 py-1 rounded-full text-xs font-bold ${
//                           work.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
//                         }`}>{work.status}</span>
//                       </div>
//                       <div className="grid grid-cols-3 gap-4 text-sm">
//                         <div><p className="text-slate-400">Order</p><p>{work.order?.orderId}</p></div>
//                         <div><p className="text-slate-400">Garment</p><p>{work.garment?.name}</p></div>
//                         <div><p className="text-slate-400">Delivery</p><p>{formatDate(work.deliveryDate)}</p></div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-8 bg-slate-50 rounded-xl">
//                   <Clock size={40} className="text-slate-300 mx-auto mb-2" />
//                   <p className="text-slate-500">No works assigned</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Delete Modal */}
//       {showDeleteModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
//           <div className="bg-white max-w-md rounded-2xl p-6">
//             <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
//             <h3 className="text-xl font-black text-center mb-2">Delete Cutting Master?</h3>
//             <p className="text-center text-slate-500 mb-6">Are you sure you want to delete {currentCuttingMaster.name}?</p>
//             <div className="flex gap-3">
//               <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3 bg-slate-200 rounded-xl">Cancel</button>
//               <button onClick={handleDelete} className="flex-1 py-3 bg-red-600 text-white rounded-xl">Delete</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }























// src/Pages/admin/cuttingMaster/CuttingMasterDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  Scissors,
  CheckCircle,
  Clock,
  AlertCircle,
  Star,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { fetchCuttingMasterById, deleteCuttingMaster } from "../../../features/cuttingMaster/cuttingMasterSlice";
import showToast from "../../../utils/toast";

export default function CuttingMasterDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentCuttingMaster, works, workStats, loading } = useSelector((state) => state.cuttingMaster);
  const { user } = useSelector((state) => state.auth);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = user?.role === "ADMIN";
  const canEdit = isAdmin;
  const canDelete = isAdmin;

  useEffect(() => {
    if (id) {
      dispatch(fetchCuttingMasterById(id));
    }
  }, [dispatch, id]);

  const handleBack = () => {
    navigate("/admin/cutting-masters");
  };

  const handleEdit = () => {
    navigate(`/admin/cutting-masters/edit/${id}`);
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteCuttingMaster(id)).unwrap();
      showToast.success("Cutting Master deleted successfully");
      navigate("/admin/cutting-masters");
    } catch (error) {
      showToast.error(error || "Failed to delete");
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-orange-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm sm:text-base text-slate-600">Loading cutting master details...</p>
        </div>
      </div>
    );
  }

  if (!currentCuttingMaster) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full text-center">
          <Scissors size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl sm:text-2xl font-black text-slate-800 mb-2">Cutting Master Not Found</h2>
          <button 
            onClick={handleBack} 
            className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base"
          >
            Back to List
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
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-slate-600"
          >
            <ArrowLeft size={18} />
            <span className="font-bold text-sm">Back</span>
          </button>
          <h1 className="text-base font-black text-slate-800 truncate max-w-[150px]">
            {currentCuttingMaster.name}
          </h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        
        {/* Mobile Action Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg p-4 z-40">
            <div className="space-y-2">
              {canEdit && (
                <button
                  onClick={() => {
                    handleEdit();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-600 rounded-lg font-bold"
                >
                  <Edit size={18} />
                  Edit
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => {
                    setShowDeleteModal(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 text-red-600 rounded-lg font-bold"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        {/* Desktop Header - Hidden on Mobile */}
        <div className="hidden lg:flex items-center justify-between mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-slate-600 hover:text-orange-600 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold">Back to Cutting Masters</span>
          </button>

          <div className="flex items-center gap-3">
            {canEdit && (
              <button
                onClick={handleEdit}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm"
              >
                <Edit size={18} />
                Edit
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm"
              >
                <Trash2 size={18} />
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Profile Header - Mobile Responsive */}
          <div className="bg-gradient-to-r from-orange-600 to-red-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center text-white border-2 border-white/30 flex-shrink-0">
                  <span className="text-xl sm:text-2xl lg:text-3xl font-black">
                    {currentCuttingMaster.name?.charAt(0)}
                  </span>
                </div>
                <div className="text-white flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                    <h1 className="text-base sm:text-lg lg:text-2xl font-black truncate">{currentCuttingMaster.name}</h1>
                    <span className="self-start sm:self-auto px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full text-[10px] sm:text-xs lg:text-sm font-bold w-fit">
                      {currentCuttingMaster.cuttingMasterId}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[10px] sm:text-xs lg:text-sm">
                      <Briefcase size={12} className="sm:w-3 sm:h-3 lg:w-4 lg:h-4" />
                      {currentCuttingMaster.experience || 0} years
                    </span>
                    {currentCuttingMaster.isActive ? (
                      <span className="flex items-center gap-1 text-green-300 text-[10px] sm:text-xs lg:text-sm">
                        <CheckCircle size={12} className="sm:w-3 sm:h-3 lg:w-4 lg:h-4" /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-300 text-[10px] sm:text-xs lg:text-sm">
                        <AlertCircle size={12} className="sm:w-3 sm:h-3 lg:w-4 lg:h-4" /> Inactive
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="sm:text-right">
                <p className="text-white/80 text-[10px] sm:text-xs lg:text-sm">Joined</p>
                <p className="text-white font-bold text-xs sm:text-sm lg:text-base">{formatDate(currentCuttingMaster.joiningDate)}</p>
              </div>
            </div>
          </div>

          {/* Tabs - Mobile Responsive (Scrollable) */}
          <div className="border-b border-slate-200 px-4 sm:px-6 lg:px-8 overflow-x-auto">
            <div className="flex gap-4 sm:gap-6 lg:gap-8 min-w-max sm:min-w-0">
              {["overview", "works"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 sm:py-3 lg:py-4 font-bold text-xs sm:text-sm lg:text-base capitalize border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab ? "border-orange-600 text-orange-600" : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab} {tab === "works" && `(${works?.length || 0})`}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 lg:p-8">
            {activeTab === "overview" && (
              <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                {/* Stats Cards - Mobile Responsive Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
                  <div className="bg-blue-50 p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl">
                    <p className="text-[10px] sm:text-xs lg:text-sm text-blue-600 font-bold mb-1">Total Works</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-black text-blue-700">{workStats?.total || 0}</p>
                  </div>
                  <div className="bg-green-50 p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl">
                    <p className="text-[10px] sm:text-xs lg:text-sm text-green-600 font-bold mb-1">Completed</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-black text-green-700">{workStats?.completed || 0}</p>
                  </div>
                  <div className="bg-orange-50 p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl">
                    <p className="text-[10px] sm:text-xs lg:text-sm text-orange-600 font-bold mb-1">In Progress</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-black text-orange-700">{workStats?.inProgress || 0}</p>
                  </div>
                  <div className="bg-yellow-50 p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl">
                    <p className="text-[10px] sm:text-xs lg:text-sm text-yellow-600 font-bold mb-1">Pending</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-black text-yellow-700">{workStats?.pending || 0}</p>
                  </div>
                </div>

                {/* Contact Info - Mobile Responsive */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="font-black text-slate-800 text-xs sm:text-sm lg:text-base">Contact</h3>
                    
                    <div className="bg-slate-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                      <Phone size={14} className="text-orange-600 mb-1 sm:mb-2 sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px]" />
                      <p className="font-bold text-slate-800 text-xs sm:text-sm lg:text-base break-all">{currentCuttingMaster.phone}</p>
                    </div>

                    <div className="bg-slate-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                      <Mail size={14} className="text-purple-600 mb-1 sm:mb-2 sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px]" />
                      <p className="font-bold text-slate-800 text-xs sm:text-sm lg:text-base break-all">{currentCuttingMaster.email}</p>
                    </div>

                    {currentCuttingMaster.address?.street && (
                      <div className="bg-slate-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                        <MapPin size={14} className="text-green-600 mb-1 sm:mb-2 sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px]" />
                        <p className="text-xs sm:text-sm lg:text-base font-medium">{currentCuttingMaster.address.street}</p>
                        <p className="text-[10px] sm:text-xs lg:text-sm text-slate-600 mt-0.5">
                          {[currentCuttingMaster.address.city, currentCuttingMaster.address.state].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="font-black text-slate-800 text-xs sm:text-sm lg:text-base">Professional</h3>
                    
                    <div className="bg-slate-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                      <Scissors size={14} className="text-indigo-600 mb-1 sm:mb-2 sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px]" />
                      <div className="flex flex-wrap gap-1 sm:gap-1.5">
                        {currentCuttingMaster.specialization?.length > 0 ? (
                          currentCuttingMaster.specialization.map((s, i) => (
                            <span key={i} className="px-1.5 sm:px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[8px] sm:text-[10px] lg:text-xs font-medium">
                              {s}
                            </span>
                          ))
                        ) : (
                          <p className="text-slate-500 text-[10px] sm:text-xs lg:text-sm">No specialization specified</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "works" && (
              <div>
                <h3 className="font-black text-slate-800 mb-3 sm:mb-4 text-xs sm:text-sm lg:text-base">Assigned Works</h3>
                {works?.length > 0 ? (
                  <div className="space-y-2 sm:space-y-3">
                    {works.map(work => (
                      <div 
                        key={work._id} 
                        className="bg-slate-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-200 hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => navigate(`/admin/works/${work._id}`)}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="font-mono font-bold text-orange-600 text-xs sm:text-sm">{work.workId}</span>
                          <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] lg:text-xs font-bold whitespace-nowrap ${
                            work.status === 'completed' ? 'bg-green-100 text-green-700' : 
                            work.status === 'in-progress' ? 'bg-orange-100 text-orange-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {work.status}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 text-[10px] sm:text-xs lg:text-sm">
                          <div className="min-w-0">
                            <p className="text-slate-400 text-[8px] sm:text-[10px] lg:text-xs">Order</p>
                            <p className="font-medium text-slate-800 truncate">{work.order?.orderId || 'N/A'}</p>
                          </div>
                          <div className="min-w-0">
                            <p className="text-slate-400 text-[8px] sm:text-[10px] lg:text-xs">Garment</p>
                            <p className="font-medium text-slate-800 truncate">{work.garment?.name || 'N/A'}</p>
                          </div>
                          <div className="min-w-0 col-span-2 sm:col-span-1">
                            <p className="text-slate-400 text-[8px] sm:text-[10px] lg:text-xs">Delivery</p>
                            <p className="text-slate-600 truncate">{formatDate(work.deliveryDate)}</p>
                          </div>
                        </div>

                        <div className="mt-2 flex justify-end">
                          <ChevronRight size={14} className="text-slate-400 group-hover:text-orange-600 transition-colors sm:w-4 sm:h-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8 bg-slate-50 rounded-lg sm:rounded-xl">
                    <Clock size={24} className="mx-auto text-slate-300 mb-2 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                    <p className="text-slate-500 text-xs sm:text-sm lg:text-base">No works assigned</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal - Responsive */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-xl lg:rounded-2xl shadow-2xl animate-in zoom-in duration-300 mx-4">
            <div className="p-4 sm:p-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <AlertCircle size={24} className="text-red-600 sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-lg sm:text-xl font-black text-center text-slate-800 mb-2">Delete Cutting Master?</h3>
              <p className="text-sm sm:text-base text-center text-slate-500 mb-4 sm:mb-6">
                Are you sure you want to delete <span className="font-black text-slate-700">{currentCuttingMaster.name}</span>?
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
                  onClick={handleDelete}
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