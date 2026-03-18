// // src/Pages/admin/EditFabric.jsx
// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { ArrowLeft, Save, X, Upload } from "lucide-react";
// import { fetchFabricById, updateFabric } from "../../../features/fabric/fabricSlice";
// import showToast from "../../../utils/toast";

// export default function EditFabric() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
  
//   const { currentFabric, loading } = useSelector((state) => state.fabric);
//   const { user } = useSelector((state) => state.auth);

//   // ✅ Get base path based on user role
//   const basePath = user?.role === "ADMIN" ? "/admin" : 
//                    user?.role === "STORE_KEEPER" ? "/storekeeper" : 
//                    "/cuttingmaster";

//   const isAdmin = user?.role === "ADMIN";
//   const isStoreKeeper = user?.role === "STORE_KEEPER";
//   const canEdit = isAdmin || isStoreKeeper;

//   const [formData, setFormData] = useState({
//     name: "",
//     color: "",
//     pricePerMeter: "",
//     imageFile: null,
//     imagePreview: null
//   });

//   useEffect(() => {
//     if (id) dispatch(fetchFabricById(id));
//   }, [id, dispatch]);

//   useEffect(() => {
//     if (currentFabric) {
//       setFormData({
//         name: currentFabric.name || "",
//         color: currentFabric.color || "",
//         pricePerMeter: currentFabric.pricePerMeter || "",
//         imageFile: null,
//         imagePreview: currentFabric.imageUrl || null
//       });
//     }
//   }, [currentFabric]);

//   // Check if user has permission to edit
//   useEffect(() => {
//     if (!canEdit && !loading && currentFabric) {
//       showToast.error("You don't have permission to edit fabrics");
//       navigate(`${basePath}/fabrics/${id}`);
//     }
//   }, [canEdit, loading, currentFabric, navigate, basePath, id]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         showToast.error("Image size should be less than 5MB");
//         return;
//       }
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData(prev => ({ ...prev, imageFile: file, imagePreview: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!canEdit) {
//       showToast.error("You don't have permission to edit fabrics");
//       return;
//     }

//     if (!formData.name || !formData.color || !formData.pricePerMeter) {
//       showToast.error("Please fill all required fields");
//       return;
//     }

//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append('name', formData.name);
//       formDataToSend.append('color', formData.color);
//       formDataToSend.append('pricePerMeter', formData.pricePerMeter);
//       if (formData.imageFile) {
//         formDataToSend.append('image', formData.imageFile);
//       }

//       await dispatch(updateFabric({ id, fabricData: formDataToSend })).unwrap();
//       showToast.success("Fabric updated successfully! ✅");
//       navigate(`${basePath}/fabrics/${id}`);
//     } catch (error) {
//       showToast.error(error || "Update failed");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-[400px]">
//         <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <button 
//         onClick={() => navigate(`${basePath}/fabrics/${id}`)} 
//         className="flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-6"
//       >
//         <ArrowLeft size={20} /> Back to Fabric Details
//       </button>

//       <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
//         <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
//           <h1 className="text-2xl font-bold">Edit Fabric</h1>
//           {!canEdit && (
//             <p className="text-sm text-red-200 mt-2">You don't have permission to edit</p>
//           )}
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           <input
//             type="text"
//             name="name"
//             placeholder="Fabric Name"
//             value={formData.name}
//             onChange={handleChange}
//             disabled={!canEdit}
//             className={`w-full px-4 py-3 border rounded-lg ${
//               !canEdit ? 'bg-slate-100 cursor-not-allowed' : ''
//             }`}
//             required
//           />
          
//           <input
//             type="text"
//             name="color"
//             placeholder="Color"
//             value={formData.color}
//             onChange={handleChange}
//             disabled={!canEdit}
//             className={`w-full px-4 py-3 border rounded-lg ${
//               !canEdit ? 'bg-slate-100 cursor-not-allowed' : ''
//             }`}
//             required
//           />
          
//           <input
//             type="number"
//             name="pricePerMeter"
//             placeholder="Price per Meter (₹)"
//             value={formData.pricePerMeter}
//             onChange={handleChange}
//             disabled={!canEdit}
//             className={`w-full px-4 py-3 border rounded-lg ${
//               !canEdit ? 'bg-slate-100 cursor-not-allowed' : ''
//             }`}
//             required
//           />

//           {formData.imagePreview && (
//             <div className="relative">
//               <img src={formData.imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
//               {canEdit && (
//                 <button
//                   type="button"
//                   onClick={() => setFormData(prev => ({ ...prev, imageFile: null, imagePreview: null }))}
//                   className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
//                 >
//                   <X size={16} />
//                 </button>
//               )}
//             </div>
//           )}

//           {canEdit && (
//             <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50">
//               <Upload className="w-8 h-8 mb-2 text-slate-400" />
//               <p className="text-sm text-slate-500">Click to upload new image</p>
//               <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
//             </label>
//           )}

//           <div className="flex gap-3 pt-4">
//             <button
//               type="submit"
//               disabled={!canEdit}
//               className={`flex-1 px-6 py-3 text-white rounded-lg font-bold flex items-center justify-center gap-2 ${
//                 canEdit 
//                   ? 'bg-blue-600 hover:bg-blue-700' 
//                   : 'bg-slate-400 cursor-not-allowed'
//               }`}
//             >
//               <Save size={18} /> Update Fabric
//             </button>
//             <button
//               type="button"
//               onClick={() => navigate(`${basePath}/fabrics/${id}`)}
//               className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg font-bold hover:bg-slate-300"
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }





// src/Pages/admin/EditFabric.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Save, X, Upload, Menu } from "lucide-react";
import { fetchFabricById, updateFabric } from "../../../features/fabric/fabricSlice";
import showToast from "../../../utils/toast";

export default function EditFabric() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentFabric, loading } = useSelector((state) => state.fabric);
  const { user } = useSelector((state) => state.auth);

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Get base path based on user role
  const basePath = user?.role === "ADMIN" ? "/admin" : 
                   user?.role === "STORE_KEEPER" ? "/storekeeper" : 
                   "/cuttingmaster";

  const isAdmin = user?.role === "ADMIN";
  const isStoreKeeper = user?.role === "STORE_KEEPER";
  const canEdit = isAdmin || isStoreKeeper;

  const [formData, setFormData] = useState({
    name: "",
    color: "",
    pricePerMeter: "",
    imageFile: null,
    imagePreview: null
  });

  useEffect(() => {
    if (id) dispatch(fetchFabricById(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (currentFabric) {
      setFormData({
        name: currentFabric.name || "",
        color: currentFabric.color || "",
        pricePerMeter: currentFabric.pricePerMeter || "",
        imageFile: null,
        imagePreview: currentFabric.imageUrl || null
      });
    }
  }, [currentFabric]);

  // Check if user has permission to edit
  useEffect(() => {
    if (!canEdit && !loading && currentFabric) {
      showToast.error("You don't have permission to edit fabrics");
      navigate(`${basePath}/fabrics/${id}`);
    }
  }, [canEdit, loading, currentFabric, navigate, basePath, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast.error("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageFile: file, imagePreview: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!canEdit) {
      showToast.error("You don't have permission to edit fabrics");
      return;
    }

    if (!formData.name || !formData.color || !formData.pricePerMeter) {
      showToast.error("Please fill all required fields");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('color', formData.color);
      formDataToSend.append('pricePerMeter', formData.pricePerMeter);
      if (formData.imageFile) {
        formDataToSend.append('image', formData.imageFile);
      }

      await dispatch(updateFabric({ id, fabricData: formDataToSend })).unwrap();
      showToast.success("Fabric updated successfully! ✅");
      navigate(`${basePath}/fabrics/${id}`);
    } catch (error) {
      showToast.error(error || "Update failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-sm sm:text-base text-slate-600">Loading fabric details...</p>
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
            onClick={() => navigate(`${basePath}/fabrics/${id}`)}
            className="flex items-center gap-1 text-slate-600"
          >
            <ArrowLeft size={18} />
            <span className="font-bold text-sm">Cancel</span>
          </button>
          <h1 className="text-base font-black text-slate-800 truncate max-w-[150px]">
            Edit Fabric
          </h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all flex items-center justify-center"
            style={{ minWidth: '36px', minHeight: '36px' }}
          >
            <Menu size={18} />
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg p-4 z-40">
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
                  navigate(`${basePath}/products?tab=fabric`);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-slate-100 rounded-xl font-medium"
              >
                Fabrics List
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6 lg:py-8">
        {/* Desktop Back Button - Hidden on Mobile */}
        <button 
          onClick={() => navigate(`${basePath}/fabrics/${id}`)} 
          className="hidden lg:flex items-center gap-2 text-slate-600 hover:text-blue-600 mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold">Back to Fabric Details</span>
        </button>

        <div className="bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-lg border overflow-hidden">
          {/* Header - Mobile Responsive */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">Edit Fabric</h1>
              {!canEdit && (
                <p className="text-xs sm:text-sm text-red-200 mt-1 sm:mt-0">You don't have permission to edit</p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-5 lg:p-6 space-y-3 sm:space-y-4">
            {/* Fabric Name Input */}
            <div>
              <input
                type="text"
                name="name"
                placeholder="Fabric Name"
                value={formData.name}
                onChange={handleChange}
                disabled={!canEdit}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl text-sm sm:text-base ${
                  !canEdit ? 'bg-slate-100 cursor-not-allowed' : ''
                }`}
                required
              />
            </div>
            
            {/* Color Input */}
            <div>
              <input
                type="text"
                name="color"
                placeholder="Color"
                value={formData.color}
                onChange={handleChange}
                disabled={!canEdit}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl text-sm sm:text-base ${
                  !canEdit ? 'bg-slate-100 cursor-not-allowed' : ''
                }`}
                required
              />
            </div>
            
            {/* Price Input */}
            <div>
              <input
                type="number"
                name="pricePerMeter"
                placeholder="Price per Meter (₹)"
                value={formData.pricePerMeter}
                onChange={handleChange}
                disabled={!canEdit}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-lg sm:rounded-xl text-sm sm:text-base ${
                  !canEdit ? 'bg-slate-100 cursor-not-allowed' : ''
                }`}
                required
              />
            </div>

            {/* Image Preview */}
            {formData.imagePreview && (
              <div className="relative">
                <img 
                  src={formData.imagePreview} 
                  alt="Preview" 
                  className="w-full h-32 sm:h-36 lg:h-40 object-cover rounded-lg sm:rounded-xl border" 
                />
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, imageFile: null, imagePreview: null }))}
                    className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-all"
                    title="Remove image"
                  >
                    <X size={14} className="sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>
            )}

            {/* Image Upload */}
            {canEdit && (
              <label className="flex flex-col items-center justify-center w-full h-28 sm:h-32 border-2 border-dashed rounded-lg sm:rounded-xl cursor-pointer hover:bg-slate-50 transition-all">
                <Upload className="w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2 text-slate-400" />
                <p className="text-xs sm:text-sm text-slate-500">Click to upload new image</p>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                />
              </label>
            )}

            {/* Form Actions - Responsive */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
              <button
                type="submit"
                disabled={!canEdit}
                className={`flex-1 px-4 sm:px-6 py-2.5 sm:py-3 text-white rounded-lg sm:rounded-xl font-bold flex items-center justify-center gap-2 text-sm sm:text-base transition-all ${
                  canEdit 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-slate-400 cursor-not-allowed'
                } order-2 sm:order-1`}
              >
                <Save size={16} className="sm:w-[18px] sm:h-[18px]" />
                <span>Update Fabric</span>
              </button>
              <button
                type="button"
                onClick={() => navigate(`${basePath}/fabrics/${id}`)}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-200 text-slate-700 rounded-lg sm:rounded-xl font-bold hover:bg-slate-300 transition-all text-sm sm:text-base order-1 sm:order-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}