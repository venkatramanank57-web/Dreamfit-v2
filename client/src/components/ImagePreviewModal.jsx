// // Updated ImagePreviewModal.jsx - Make sure to replace your existing file

// import React, { useState, useEffect } from 'react';
// import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';

// export default function ImagePreviewModal({ images, title, onClose }) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [imageLoaded, setImageLoaded] = useState(false);

//   // Handle keyboard navigation
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === 'Escape') {
//         onClose();
//       } else if (e.key === 'ArrowLeft') {
//         handlePrevious();
//       } else if (e.key === 'ArrowRight') {
//         handleNext();
//       }
//     };

//     window.addEventListener('keydown', handleKeyDown);
    
//     // Prevent body scroll when modal is open
//     document.body.style.overflow = 'hidden';
    
//     return () => {
//       window.removeEventListener('keydown', handleKeyDown);
//       document.body.style.overflow = 'unset';
//     };
//   }, [currentIndex]);

//   const handlePrevious = (e) => {
//     if (e) {
//       e.preventDefault();
//       e.stopPropagation();
//     }
//     setImageLoaded(false);
//     setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
//   };

//   const handleNext = (e) => {
//     if (e) {
//       e.preventDefault();
//       e.stopPropagation();
//     }
//     setImageLoaded(false);
//     setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
//   };

//   const handleDownload = async (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     try {
//       const response = await fetch(images[currentIndex]);
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `image-${currentIndex + 1}.jpg`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);
//     } catch (error) {
//       console.error('Error downloading image:', error);
//     }
//   };

//   const handleThumbnailClick = (idx) => {
//     setImageLoaded(false);
//     setCurrentIndex(idx);
//   };

//   if (!images || images.length === 0) return null;

//   return (
//     <div 
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4"
//       onClick={onClose}
//     >
//       <div 
//         className="relative max-w-6xl w-full bg-white rounded-2xl overflow-hidden"
//         onClick={(e) => e.stopPropagation()}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 border-b bg-white">
//           <div>
//             <h3 className="text-lg font-black text-slate-800">
//               {title || 'Image Preview'}
//             </h3>
//             <p className="text-sm text-slate-500">
//               {currentIndex + 1} of {images.length}
//             </p>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={handleDownload}
//               className="p-2 hover:bg-slate-100 rounded-lg transition-all"
//               title="Download"
//             >
//               <Download size={20} className="text-slate-600" />
//             </button>
//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-slate-100 rounded-lg transition-all"
//               title="Close (Esc)"
//             >
//               <X size={20} className="text-slate-600" />
//             </button>
//           </div>
//         </div>

//         {/* Image Container */}
//         <div 
//           className="relative bg-slate-900 flex items-center justify-center p-4"
//           style={{ minHeight: '500px', maxHeight: '70vh' }}
//         >
//           {!imageLoaded && (
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//             </div>
//           )}
          
//           <img
//             src={images[currentIndex]}
//             alt={`${title} ${currentIndex + 1}`}
//             className={`max-w-full max-h-[65vh] object-contain rounded-lg transition-opacity duration-300 ${
//               imageLoaded ? 'opacity-100' : 'opacity-0'
//             }`}
//             onLoad={() => setImageLoaded(true)}
//             onError={(e) => {
//               console.error("Failed to load image:", images[currentIndex]);
//               e.target.src = 'https://via.placeholder.com/500?text=Failed+to+load+image';
//               setImageLoaded(true);
//             }}
//           />

//           {/* Navigation Buttons */}
//           {images.length > 1 && (
//             <>
//               <button
//                 onClick={handlePrevious}
//                 className="absolute left-4 p-3 bg-white rounded-full shadow-lg hover:bg-slate-50 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 title="Previous (←)"
//               >
//                 <ChevronLeft size={24} className="text-slate-700" />
//               </button>
//               <button
//                 onClick={handleNext}
//                 className="absolute right-4 p-3 bg-white rounded-full shadow-lg hover:bg-slate-50 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 title="Next (→)"
//               >
//                 <ChevronRight size={24} className="text-slate-700" />
//               </button>
//             </>
//           )}
//         </div>

//         {/* Thumbnail Strip */}
//         {images.length > 1 && (
//           <div className="p-4 border-t bg-white overflow-x-auto">
//             <div className="flex gap-2 justify-center">
//               {images.map((img, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => handleThumbnailClick(idx)}
//                   className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all focus:outline-none ${
//                     idx === currentIndex 
//                       ? 'border-blue-600 ring-2 ring-blue-300 scale-110' 
//                       : 'border-transparent hover:border-blue-400'
//                   }`}
//                 >
//                   <img
//                     src={img}
//                     alt={`Thumbnail ${idx + 1}`}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.target.src = 'https://via.placeholder.com/64?text=Error';
//                     }}
//                   />
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }









// Updated ImagePreviewModal.jsx - Fixed download functionality
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import showToast from '../utils/toast';

export default function ImagePreviewModal({ images, title, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [currentIndex]);

  const handlePrevious = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setImageLoaded(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setImageLoaded(false);
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const getFileNameFromUrl = (url) => {
    try {
      // Extract filename from URL or create a meaningful name
      const urlParts = url.split('/');
      const lastPart = urlParts[urlParts.length - 1].split('?')[0]; // Remove query params
      
      // If last part has extension, use it
      if (lastPart.includes('.')) {
        return lastPart;
      }
      
      // Otherwise create a name with index and extension
      const extension = url.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i)?.[0] || '.jpg';
      return `image-${currentIndex + 1}${extension}`;
    } catch (error) {
      return `image-${currentIndex + 1}.jpg`;
    }
  };

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (downloading) return;
    
    setDownloading(true);
    
    try {
      const imageUrl = images[currentIndex];
      const fileName = getFileNameFromUrl(imageUrl);
      
      console.log('📥 Downloading image:', imageUrl);
      
      // Method 1: Try using fetch with no-cors mode (may not work for all servers)
      try {
        const response = await fetch(imageUrl, {
          mode: 'cors', // Try with cors first
          cache: 'no-cache',
          headers: {
            'Accept': 'image/*'
          }
        });
        
        if (response.ok) {
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = fileName;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          showToast.success('Image downloaded successfully');
          setDownloading(false);
          return;
        }
      } catch (fetchError) {
        console.log('Fetch failed, trying alternative method:', fetchError);
      }
      
      // Method 2: Try using XMLHttpRequest
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', imageUrl, true);
        xhr.responseType = 'blob';
        
        xhr.onload = function() {
          if (this.status === 200) {
            const blob = this.response;
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            showToast.success('Image downloaded successfully');
          } else {
            throw new Error('Failed to download');
          }
          setDownloading(false);
        };
        
        xhr.onerror = function() {
          throw new Error('XHR failed');
        };
        
        xhr.send();
        return;
      } catch (xhrError) {
        console.log('XHR failed, trying direct download:', xhrError);
      }
      
      // Method 3: Direct download (opens in new tab, user needs to save manually)
      const link = document.createElement('a');
      link.href = imageUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = fileName; // This may not work due to CORS
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show info message
      showToast.info('If download didn\'t start, right-click the image and select "Save image as..."');
      
    } catch (error) {
      console.error('Error downloading image:', error);
      showToast.error('Failed to download image. Please try right-clicking and saving.');
    } finally {
      setDownloading(false);
    }
  };

  // Alternative: Simple download that works by opening in new tab
  const handleSimpleDownload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const imageUrl = images[currentIndex];
    const fileName = getFileNameFromUrl(imageUrl);
    
    // Create an anchor element
    const link = document.createElement('a');
    link.href = imageUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.download = fileName; // This might not work due to CORS
    
    // Try to trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show helpful message
    showToast.info('If download doesn\'t start automatically, right-click the image and select "Save image as..."');
  };

  const handleThumbnailClick = (idx) => {
    setImageLoaded(false);
    setCurrentIndex(idx);
  };

  if (!images || images.length === 0) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-2 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="relative max-w-6xl w-full bg-white rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b bg-white">
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-black text-slate-800 truncate pr-2">
              {title || 'Image Preview'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {currentIndex + 1} of {images.length}
            </p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={handleDownload}
              disabled={downloading}
              className={`p-2 hover:bg-slate-100 rounded-lg transition-all touch-manipulation ${
                downloading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="Download image"
            >
              <Download size={18} className="sm:w-5 sm:h-5 text-slate-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-all touch-manipulation"
              title="Close (Esc)"
            >
              <X size={18} className="sm:w-5 sm:h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Image Container */}
        <div 
          className="relative bg-slate-900 flex items-center justify-center p-2 sm:p-4"
          style={{ minHeight: '300px', maxHeight: '70vh' }}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 sm:w-12 sm:h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          <img
            src={images[currentIndex]}
            alt={`${title} ${currentIndex + 1}`}
            className={`max-w-full max-h-[60vh] sm:max-h-[65vh] object-contain rounded-lg transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              console.error("Failed to load image:", images[currentIndex]);
              e.target.src = 'https://via.placeholder.com/500?text=Failed+to+load+image';
              setImageLoaded(true);
            }}
          />

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-2 sm:left-4 p-2 sm:p-3 bg-white rounded-full shadow-lg hover:bg-slate-50 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation"
                title="Previous (←)"
              >
                <ChevronLeft size={20} className="sm:w-6 sm:h-6 text-slate-700" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 p-2 sm:p-3 bg-white rounded-full shadow-lg hover:bg-slate-50 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 touch-manipulation"
                title="Next (→)"
              >
                <ChevronRight size={20} className="sm:w-6 sm:h-6 text-slate-700" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <div className="p-3 sm:p-4 border-t bg-white overflow-x-auto hide-scrollbar">
            <div className="flex gap-2 justify-start sm:justify-center">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => handleThumbnailClick(idx)}
                  className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all focus:outline-none touch-manipulation ${
                    idx === currentIndex 
                      ? 'border-blue-600 ring-2 ring-blue-300 scale-110' 
                      : 'border-transparent hover:border-blue-400'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/64?text=Error';
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CSS for hiding scrollbar */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}