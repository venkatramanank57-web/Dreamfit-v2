// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { 
//   ArrowLeft, Edit, Trash2, Layers, Calendar, 
//   Package, Power, Eye
// } from "lucide-react";
// import { fetchAllCategories, deleteCategory, updateCategory } from "../../../features/category/categorySlice";
// import { fetchItems } from "../../../features/item/itemSlice";
// import showToast from "../../../utils/toast";

// export default function CategoryDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
  
//   const { categories } = useSelector((state) => state.category);
//   const { items } = useSelector((state) => state.item);
//   const { user } = useSelector((state) => state.auth);

//   // ✅ Get base path based on user role
//   const basePath = user?.role === "ADMIN" ? "/admin" : 
//                    user?.role === "STORE_KEEPER" ? "/storekeeper" : 
//                    "/cuttingmaster";

//   const [isEditing, setIsEditing] = useState(false);
//   const [categoryName, setCategoryName] = useState("");

//   const isAdmin = user?.role === "ADMIN";
//   const isStoreKeeper = user?.role === "STORE_KEEPER";
//   const canEdit = isAdmin || isStoreKeeper;
//   const canDelete = isAdmin; // Only Admin can delete

//   const category = categories?.find(c => c._id === id);

//   useEffect(() => {
//     if (!categories?.length) {
//       dispatch(fetchAllCategories());
//     }
//     dispatch(fetchItems(id)); // Fetch items in this category
//   }, [dispatch, id, categories?.length]);

//   useEffect(() => {
//     if (category) {
//       setCategoryName(category.name);
//     }
//   }, [category]);

//   const handleDelete = async () => {
//     if (!canDelete) {
//       showToast.error("Only Admin can delete categories");
//       return;
//     }
//     if (window.confirm("Delete this category? Items in this category will also be affected.")) {
//       try {
//         await dispatch(deleteCategory(id)).unwrap();
//         showToast.success("Category deleted");
//         navigate(`${basePath}/products?tab=category`);
//       } catch (error) {
//         showToast.error("Delete failed");
//       }
//     }
//   };

//   const handleUpdate = async () => {
//     if (!canEdit) {
//       showToast.error("You don't have permission to edit categories");
//       return;
//     }
//     if (!categoryName.trim()) {
//       showToast.error("Category name is required");
//       return;
//     }

//     try {
//       await dispatch(updateCategory({ 
//         id, 
//         categoryData: { name: categoryName } 
//       })).unwrap();
//       showToast.success("Category updated");
//       setIsEditing(false);
//     } catch (error) {
//       showToast.error("Update failed");
//     }
//   };

//   const handleViewItem = (itemId) => {
//     navigate(`${basePath}/items/${itemId}`);
//   };

//   if (!category) {
//     return (
//       <div className="text-center py-16">
//         <Layers size={64} className="mx-auto text-slate-300 mb-4" />
//         <h2 className="text-2xl font-bold text-slate-800">Category Not Found</h2>
//         <button 
//           onClick={() => navigate(`${basePath}/products?tab=category`)}
//           className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//         >
//           Back to Categories
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 animate-in fade-in duration-500">
//       {/* Back Button */}
//       <button 
//         onClick={() => navigate(`${basePath}/products?tab=category`)} 
//         className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-6 group"
//       >
//         <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
//         Back to Categories
//       </button>

//       {/* Main Card */}
//       <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6 text-white">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center gap-4">
//               <div className="bg-white/20 p-3 rounded-xl">
//                 <Layers size={32} />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold">Category Details</h1>
//                 <p className="text-green-100">Manage category information</p>
//               </div>
//             </div>
//             <div className="flex gap-3">
//               {canEdit && (
//                 <button 
//                   onClick={() => setIsEditing(!isEditing)}
//                   className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2"
//                 >
//                   <Edit size={18} /> {isEditing ? 'Cancel' : 'Edit'}
//                 </button>
//               )}
//               {canDelete && (
//                 <button 
//                   onClick={handleDelete}
//                   className="bg-red-500/20 hover:bg-red-500/30 px-4 py-2 rounded-lg flex items-center gap-2"
//                 >
//                   <Trash2 size={18} /> Delete
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Category Info */}
//             <div className="space-y-4">
//               <h2 className="text-lg font-bold text-slate-800 mb-4">Category Information</h2>
              
//               {/* Name */}
//               <div className="bg-slate-50 p-4 rounded-lg">
//                 <div className="flex items-center gap-2 text-slate-600 mb-2">
//                   <Layers size={18} className="text-green-600" />
//                   <span className="text-sm font-medium uppercase tracking-wider">Name</span>
//                 </div>
//                 {isEditing ? (
//                   <div className="flex gap-2">
//                     <input
//                       type="text"
//                       value={categoryName}
//                       onChange={(e) => setCategoryName(e.target.value)}
//                       className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
//                       autoFocus
//                     />
//                     <button
//                       onClick={handleUpdate}
//                       className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
//                     >
//                       Save
//                     </button>
//                   </div>
//                 ) : (
//                   <p className="text-xl font-bold">{category.name}</p>
//                 )}
//               </div>

//               {/* ID */}
//               <div className="bg-slate-50 p-4 rounded-lg">
//                 <div className="flex items-center gap-2 text-slate-600 mb-2">
//                   <Package size={18} className="text-green-600" />
//                   <span className="text-sm font-medium uppercase tracking-wider">Category ID</span>
//                 </div>
//                 <p className="text-sm font-mono bg-slate-100 p-2 rounded">{category._id}</p>
//               </div>

//               {/* Created Date */}
//               <div className="bg-slate-50 p-4 rounded-lg">
//                 <div className="flex items-center gap-2 text-slate-600 mb-2">
//                   <Calendar size={18} className="text-green-600" />
//                   <span className="text-sm font-medium uppercase tracking-wider">Created On</span>
//                 </div>
//                 <p className="text-lg">{new Date(category.createdAt).toLocaleDateString('en-US', {
//                   year: 'numeric',
//                   month: 'long',
//                   day: 'numeric'
//                 })}</p>
//               </div>

//               {/* Status */}
//               <div className="bg-slate-50 p-4 rounded-lg">
//                 <div className="flex items-center gap-2 text-slate-600 mb-2">
//                   <Power size={18} className="text-green-600" />
//                   <span className="text-sm font-medium uppercase tracking-wider">Status</span>
//                 </div>
//                 <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${
//                   category.isActive 
//                     ? 'bg-green-100 text-green-700' 
//                     : 'bg-red-100 text-red-700'
//                 }`}>
//                   {category.isActive ? 'Active' : 'Inactive'}
//                 </span>
//               </div>
//             </div>

//             {/* Items in this Category */}
//             <div className="space-y-4">
//               <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
//                 <Package size={20} className="text-green-600" />
//                 Items in this Category ({items?.length || 0})
//               </h2>

//               {items?.length > 0 ? (
//                 <div className="space-y-3">
//                   {items.map(item => (
//                     <div 
//                       key={item._id} 
//                       className="bg-slate-50 p-4 rounded-lg border border-slate-200 hover:shadow-md transition-all cursor-pointer"
//                       onClick={() => handleViewItem(item._id)}
//                     >
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <h3 className="font-bold text-slate-800">{item.name}</h3>
//                           <p className="text-xs text-slate-400 mt-1">
//                             Added: {new Date(item.createdAt).toLocaleDateString()}
//                           </p>
//                         </div>
//                         <Eye size={18} className="text-slate-400 hover:text-green-600" />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="bg-slate-50 p-8 rounded-lg text-center">
//                   <Package size={40} className="mx-auto text-slate-300 mb-3" />
//                   <p className="text-slate-500">No items in this category</p>
//                   {canEdit && (
//                     <button
//                       onClick={() => navigate(`${basePath}/products?tab=item`)}
//                       className="mt-3 text-green-600 hover:text-green-700 font-medium text-sm"
//                     >
//                       + Add Item
//                     </button>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Quick Actions */}
//           <div className="mt-6 pt-6 border-t border-slate-200">
//             <h3 className="font-bold text-slate-800 mb-3">Quick Actions</h3>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => navigate(`${basePath}/products?tab=category`)}
//                 className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-all"
//               >
//                 View All Categories
//               </button>
//               {canEdit && (
//                 <button
//                   onClick={() => {
//                     navigate(`${basePath}/products?tab=category`);
//                     setTimeout(() => {
//                       document.querySelector('[data-add-button]')?.click();
//                     }, 100);
//                   }}
//                   className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
//                 >
//                   Add New Category
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }












import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  ArrowLeft, Edit, Trash2, Layers, Calendar, 
  Package, Power, Eye, Menu
} from "lucide-react";
import { fetchAllCategories, deleteCategory, updateCategory } from "../../../features/category/categorySlice";
import { fetchItems } from "../../../features/item/itemSlice";
import showToast from "../../../utils/toast";

export default function CategoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { categories } = useSelector((state) => state.category);
  const { items } = useSelector((state) => state.item);
  const { user } = useSelector((state) => state.auth);

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get base path based on user role
  const basePath = user?.role === "ADMIN" ? "/admin" : 
                   user?.role === "STORE_KEEPER" ? "/storekeeper" : 
                   "/cuttingmaster";

  const [isEditing, setIsEditing] = useState(false);
  const [categoryName, setCategoryName] = useState("");

  const isAdmin = user?.role === "ADMIN";
  const isStoreKeeper = user?.role === "STORE_KEEPER";
  const canEdit = isAdmin || isStoreKeeper;
  const canDelete = isAdmin; // Only Admin can delete

  const category = categories?.find(c => c._id === id);

  useEffect(() => {
    if (!categories?.length) {
      dispatch(fetchAllCategories());
    }
    dispatch(fetchItems(id)); // Fetch items in this category
  }, [dispatch, id, categories?.length]);

  useEffect(() => {
    if (category) {
      setCategoryName(category.name);
    }
  }, [category]);

  const handleDelete = async () => {
    if (!canDelete) {
      showToast.error("Only Admin can delete categories");
      return;
    }
    if (window.confirm("Delete this category? Items in this category will also be affected.")) {
      try {
        await dispatch(deleteCategory(id)).unwrap();
        showToast.success("Category deleted");
        navigate(`${basePath}/products?tab=category`);
      } catch (error) {
        showToast.error("Delete failed");
      }
    }
  };

  const handleUpdate = async () => {
    if (!canEdit) {
      showToast.error("You don't have permission to edit categories");
      return;
    }
    if (!categoryName.trim()) {
      showToast.error("Category name is required");
      return;
    }

    try {
      await dispatch(updateCategory({ 
        id, 
        categoryData: { name: categoryName } 
      })).unwrap();
      showToast.success("Category updated");
      setIsEditing(false);
    } catch (error) {
      showToast.error("Update failed");
    }
  };

  const handleViewItem = (itemId) => {
    navigate(`${basePath}/items/${itemId}`);
  };

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full text-center">
          <Layers size={48} className="mx-auto text-slate-300 mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">Category Not Found</h2>
          <button 
            onClick={() => navigate(`${basePath}/products?tab=category`)}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base"
          >
            Back to Categories
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
            onClick={() => navigate(`${basePath}/products?tab=category`)}
            className="flex items-center gap-1 text-slate-600"
          >
            <ArrowLeft size={18} />
            <span className="font-bold text-sm">Back</span>
          </button>
          <h1 className="text-base font-black text-slate-800 truncate max-w-[150px]">
            {category?.name}
          </h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all flex items-center justify-center"
            style={{ minWidth: '36px', minHeight: '36px' }}
          >
            <Menu size={18} />
          </button>
        </div>
        
        {/* Mobile Action Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg p-4 z-40">
            <div className="space-y-2">
              {canEdit && (
                <button
                  onClick={() => {
                    setIsEditing(!isEditing);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-green-50 text-green-600 rounded-lg font-bold"
                >
                  <Edit size={18} />
                  {isEditing ? 'Cancel Edit' : 'Edit Category'}
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => {
                    handleDelete();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 text-red-600 rounded-lg font-bold"
                >
                  <Trash2 size={18} />
                  Delete Category
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        {/* Desktop Back Button - Hidden on Mobile */}
        <button 
          onClick={() => navigate(`${basePath}/products?tab=category`)} 
          className="hidden lg:flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold">Back to Categories</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg border overflow-hidden">
          {/* Header - Mobile Responsive */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 p-1.5 sm:p-2 rounded-lg lg:rounded-xl flex items-center justify-center">
                  <Layers size={16} className="sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">Category Details</h1>
                  <p className="text-green-100 text-xs sm:text-sm">Manage category information</p>
                </div>
              </div>
              {/* Desktop Action Buttons - Hidden on Mobile */}
              <div className="hidden lg:flex gap-2">
                {canEdit && (
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-white/20 hover:bg-white/30 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <Edit size={16} /> {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                )}
                {canDelete && (
                  <button 
                    onClick={handleDelete}
                    className="bg-red-500/20 hover:bg-red-500/30 px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg flex items-center gap-2 text-sm"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Content - Mobile Responsive */}
          <div className="p-4 sm:p-5 lg:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
              {/* Category Info Column */}
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-2 sm:mb-3 lg:mb-4">
                  Category Information
                </h2>
                
                {/* Name */}
                <div className="bg-slate-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-slate-600 mb-1 sm:mb-2">
                    <Layers size={14} className="text-green-600 sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px]" />
                    <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">Name</span>
                  </div>
                  {isEditing ? (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 border rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-green-500"
                        autoFocus
                      />
                      <button
                        onClick={handleUpdate}
                        className="w-full sm:w-auto bg-green-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-sm"
                      >
                        <span>Save</span>
                      </button>
                    </div>
                  ) : (
                    <p className="text-base sm:text-lg lg:text-xl font-bold break-words">{category.name}</p>
                  )}
                </div>

                {/* ID */}
                <div className="bg-slate-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-slate-600 mb-1 sm:mb-2">
                    <Package size={14} className="text-green-600 sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px]" />
                    <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">Category ID</span>
                  </div>
                  <p className="text-xs sm:text-sm font-mono bg-slate-100 p-1.5 sm:p-2 rounded break-all">{category._id}</p>
                </div>

                {/* Created Date */}
                <div className="bg-slate-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-slate-600 mb-1 sm:mb-2">
                    <Calendar size={14} className="text-green-600 sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px]" />
                    <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">Created On</span>
                  </div>
                  <p className="text-sm sm:text-base lg:text-lg break-words">
                    {new Date(category.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>

                {/* Status */}
                <div className="bg-slate-50 p-3 sm:p-4 rounded-lg sm:rounded-xl">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-slate-600 mb-1 sm:mb-2">
                    <Power size={14} className="text-green-600 sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px]" />
                    <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wider">Status</span>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold ${
                    category.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Items in this Category Column */}
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-2 sm:mb-3 lg:mb-4 flex items-center gap-1.5 sm:gap-2">
                  <Package size={16} className="text-green-600 sm:w-5 sm:h-5" />
                  <span>Items in this Category ({items?.length || 0})</span>
                </h2>

                {items?.length > 0 ? (
                  <div className="space-y-2 sm:space-y-3">
                    {items.map(item => (
                      <div 
                        key={item._id} 
                        className="bg-slate-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-slate-200 hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => handleViewItem(item._id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-800 text-sm sm:text-base truncate">{item.name}</h3>
                            <p className="text-[10px] sm:text-xs text-slate-400 mt-1 truncate">
                              Added: {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <Eye size={16} className="text-slate-400 group-hover:text-green-600 transition-colors flex-shrink-0 ml-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-slate-50 p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl text-center">
                    <Package size={32} className="mx-auto text-slate-300 mb-2 sm:w-8 sm:h-8 lg:w-10 lg:h-10" />
                    <p className="text-slate-500 text-xs sm:text-sm">No items in this category</p>
                    {canEdit && (
                      <button
                        onClick={() => navigate(`${basePath}/products?tab=item`)}
                        className="mt-2 text-green-600 hover:text-green-700 font-medium text-[10px] sm:text-xs"
                      >
                        + Add Item
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-4 sm:mt-5 lg:mt-6 pt-4 sm:pt-5 lg:pt-6 border-t border-slate-200">
              <h3 className="font-bold text-slate-800 text-sm sm:text-base mb-2 sm:mb-3">Quick Actions</h3>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => navigate(`${basePath}/products?tab=category`)}
                  className="w-full sm:w-auto bg-slate-100 text-slate-700 px-4 py-2.5 sm:py-2 rounded-lg hover:bg-slate-200 transition-all text-sm flex items-center justify-center"
                >
                  View All Categories
                </button>
                {canEdit && (
                  <button
                    onClick={() => {
                      navigate(`${basePath}/products?tab=category`);
                      setTimeout(() => {
                        document.querySelector('[data-add-button]')?.click();
                      }, 100);
                    }}
                    className="w-full sm:w-auto bg-green-600 text-white px-4 py-2.5 sm:py-2 rounded-lg hover:bg-green-700 transition-all text-sm flex items-center justify-center"
                  >
                    Add New Category
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}