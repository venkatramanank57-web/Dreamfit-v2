// import { useState, useEffect } from "react";
// import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
// import { 
//   LayoutDashboard, ShoppingCart, Scissors, Users, Landmark, 
//   Package, Settings, Bell, Search, ChevronDown, 
//   ChevronRight, LogOut, UserCircle, Briefcase, Store, Ruler, X,
//   Calendar, Clock, CheckSquare, BarChart3, FileText, Truck,
//   HelpCircle, BookOpen, Award, Gift, CreditCard, Shield,
//   Flag, Target, TrendingUp, UserPlus, UserCheck, UserX,
//   HardHat, ClipboardList, Wallet, IndianRupee, Download, Filter,
//   PieChart, Activity, DollarSign, Receipt, Banknote, PiggyBank
// } from "lucide-react";
// import { useSelector, useDispatch } from "react-redux";
// import { logout } from "../../features/auth/authSlice";
// import { fetchNotifications } from "../../features/notification/notificationSlice"; // 🔥 FIX: Fetch full notifications instead of just count
// import NotificationBell from "../common/NotificationBell";

// export default function MainLayout() {
//   const { user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
  
//   const [bankingOpen, setBankingOpen] = useState(false);
//   const [reportsOpen, setReportsOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
  
//   const navigate = useNavigate();
//   const location = useLocation();

//   // Standardize the ID format
//   const userId = user?._id || user?.id;

//   // ============================================
//   // ✅ STABLE INITIAL FETCH
//   // ============================================
//   useEffect(() => {
//     if (userId) {
//       console.log("🔔 MainLayout - Fetching notifications for:", userId);
//       // 🔥 FIX: Using fetchNotifications ensures consistency with NotificationBell
//       dispatch(fetchNotifications());
//     }
//     // No setInterval here - NotificationBell handles the 30s polling
//   }, [dispatch, userId]);

//   // ============================================
//   // ✅ FOCUS REFRESH
//   // ============================================
//   useEffect(() => {
//     const handleFocus = () => {
//       if (userId) {
//         console.log("🔔 MainLayout - Page focused, syncing state");
//         dispatch(fetchNotifications());
//       }
//     };

//     window.addEventListener('focus', handleFocus);
//     return () => window.removeEventListener('focus', handleFocus);
//   }, [dispatch, userId]);

//   const handleLogout = () => {
//     if (window.confirm("Are you sure you want to logout?")) {
//       dispatch(logout());
//       navigate("/");
//     }
//   };

//   // Role verification
//   const isAdmin = user?.role === "ADMIN";
//   const isStoreKeeper = user?.role === "STORE_KEEPER";
//   const isCuttingMaster = user?.role === "CUTTING_MASTER";
  
//   // Permissions logic
//   const canViewBanking = isAdmin || isStoreKeeper;
//   const canViewCustomers = isAdmin || isStoreKeeper;
//   const canViewStaff = isAdmin;
//   const canViewProducts = isAdmin || isStoreKeeper;
//   const canViewOrders = isAdmin || isStoreKeeper;
//   const canViewWorks = true;
//   const canViewMeasurement = isAdmin || isStoreKeeper;
//   const canViewTailors = true;
//   const canViewReports = isAdmin || isStoreKeeper;
//   const canViewSettings = isAdmin;
//   const canViewCuttingMasters = isAdmin;
//   const canViewStoreKeepers = isAdmin;

//   const isActive = (path) => {
//     if (path === '#') return false;
//     return location.pathname.includes(path);
//   };

//   const rolePath = user?.role === "ADMIN" ? "admin" : 
//                    user?.role === "STORE_KEEPER" ? "storekeeper" : 
//                    "cuttingmaster";

//   const bankingItems = [
//     { id: 'overview', label: 'Overview', icon: Wallet, path: `/${rolePath}/banking/overview` },
//     { id: 'income', label: 'Income', icon: TrendingUp, path: `/${rolePath}/banking/income` },
//     { id: 'expense', label: 'Expenses', icon: Receipt, path: `/${rolePath}/banking/expense` }
//   ];

//   const reportsItems = [
//     { id: 'sales', label: 'Sales Report', icon: TrendingUp, path: `/${rolePath}/reports/sales` },
//     { id: 'production', label: 'Production Report', icon: Briefcase, path: `/${rolePath}/reports/production` },
//     { id: 'inventory', label: 'Inventory Report', icon: Package, path: `/${rolePath}/reports/inventory` },
//   ];

//   const getNavigationItems = () => {
//     const items = [
//       { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: `/${rolePath}/dashboard`, show: true },
//       { id: 'orders', icon: ShoppingCart, label: 'Orders', path: `/${rolePath}/orders`, show: canViewOrders },
//       { id: 'works', icon: Briefcase, label: 'Works', path: `/${rolePath}/works`, show: canViewWorks },
//       { id: 'tailors', icon: Scissors, label: 'Tailors', path: `/${rolePath}/tailors`, show: canViewTailors },
//       { id: 'cutting-masters', icon: HardHat, label: 'Cutting Masters', path: `/${rolePath}/cutting-masters`, show: canViewCuttingMasters },
//       { id: 'store-keepers', icon: Store, label: 'Store Keepers', path: `/${rolePath}/store-keepers`, show: canViewStoreKeepers },
//       { id: 'measurements', icon: Ruler, label: 'Measurements', path: `/${rolePath}/measurements`, show: canViewMeasurement },
//       { id: 'products', icon: Package, label: 'Products', path: `/${rolePath}/products`, show: canViewProducts },
//       { id: 'customers', icon: Users, label: 'Customers', path: `/${rolePath}/customers`, show: canViewCustomers },
//       { id: 'banking', icon: Landmark, label: 'Banking', path: '#', show: canViewBanking, isDropdown: true },
//       { id: 'reports', icon: BarChart3, label: 'Reports', path: '#', show: canViewReports, isDropdown: true },
//       { id: 'staff', icon: UserCircle, label: 'Staff', path: `/${rolePath}/staff`, show: canViewStaff },
//       { id: 'settings', icon: Settings, label: 'Settings', path: `/${rolePath}/settings`, show: canViewSettings },
//     ];
//     return items.filter(item => item.show);
//   };

//   const filteredNavItems = getNavigationItems().filter(item => 
//     item.label.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   const isBankingActive = bankingItems.some(item => location.pathname.includes(item.id));

//   return (
//     <div className="flex h-screen bg-[#F1F5F9] overflow-hidden font-sans">
      
//       {/* --- LEFT SIDEBAR --- */}
//       <aside className="w-72 bg-[#0F172A] text-slate-300 flex flex-col shadow-2xl z-20">
//         <div className="p-6 border-b border-slate-800 bg-[#0F172A]">
//           <h2 className="text-xl font-black text-white tracking-[0.2em] uppercase italic">
//             Dreamfit <span className="text-blue-500 font-extrabold italic">Couture</span>
//           </h2>
//         </div>

//         <div className="px-6 py-5 flex items-center justify-between border-b border-slate-800 bg-[#1e293b]/30">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg border border-blue-400/20">
//               <UserCircle size={24} />
//             </div>
//             <div className="flex flex-col">
//               <span className="text-sm font-bold text-white truncate w-24 leading-none mb-1">
//                 {user?.name || "User"}
//               </span>
//               <div className="flex items-center gap-1">
//                 <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
//                 <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
//                   {user?.role?.replace('_', ' ')}
//                 </span>
//               </div>
//             </div>
//           </div>
//           <div className="flex gap-1">
//             <Link to={`/${rolePath}/settings`} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all">
//               <Settings size={18} />
//             </Link>
//             <NotificationBell />
//           </div>
//         </div>

//         {/* SEARCH */}
//         <div className="px-4 py-5">
//           <div className="relative group">
//             <Search className="absolute left-3 top-3 text-slate-500 group-focus-within:text-blue-400" size={18} />
//             <input 
//               type="text" 
//               placeholder="Search menu..." 
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full bg-[#1e293b]/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-10 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-white"
//             />
//           </div>
//         </div>

//         {/* NAV LINKS */}
//         <nav className="flex-1 px-3 space-y-1 overflow-y-auto mt-2 custom-scrollbar-hidden">
//           {filteredNavItems.map((item) => (
//             <div key={item.id}>
//               {item.isDropdown ? (
//                 <div>
//                   <button 
//                     onClick={() => {
//                       if (item.id === 'banking') setBankingOpen(!bankingOpen);
//                       if (item.id === 'reports') setReportsOpen(!reportsOpen);
//                     }}
//                     className="w-full nav-link flex justify-between items-center"
//                   >
//                     <div className="flex items-center gap-3">
//                       <item.icon size={19} /> 
//                       <span>{item.label}</span>
//                     </div>
//                     {((item.id === 'banking' && bankingOpen) || (item.id === 'reports' && reportsOpen)) ? 
//                       <ChevronDown size={14}/> : <ChevronRight size={14}/>}
//                   </button>
                  
//                   {item.id === 'banking' && bankingOpen && (
//                     <div className="ml-9 mt-1 space-y-1 border-l border-slate-700 pl-4 py-1">
//                       {bankingItems.map(sub => (
//                         <Link key={sub.id} to={sub.path} className="flex items-center gap-2 py-2 text-sm text-slate-500 hover:text-blue-400">
//                           <sub.icon size={14} /> {sub.label}
//                         </Link>
//                       ))}
//                     </div>
//                   )}

//                   {item.id === 'reports' && reportsOpen && (
//                     <div className="ml-9 mt-1 space-y-1 border-l border-slate-700 pl-4 py-1">
//                       {reportsItems.map(sub => (
//                         <Link key={sub.id} to={sub.path} className="flex items-center gap-2 py-2 text-sm text-slate-500 hover:text-blue-400">
//                           <sub.icon size={14} /> {sub.label}
//                         </Link>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <Link to={item.path} className={`nav-link ${isActive(item.path) ? 'active-link' : ''}`}>
//                   <item.icon size={19} /> 
//                   <span>{item.label}</span>
//                   {isActive(item.path) && <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></span>}
//                 </Link>
//               )}
//             </div>
//           ))}
//         </nav>

//         {/* FOOTER STATS */}
//         <div className="px-4 py-3 border-t border-slate-800 bg-[#0F172A]">
//           <div className="flex items-center justify-between text-xs text-slate-500">
//             <div className="flex items-center gap-1"><Clock size={12} /><span>{new Date().toLocaleTimeString()}</span></div>
//             <div className="flex items-center gap-1"><Calendar size={12} /><span>{new Date().toLocaleDateString()}</span></div>
//           </div>
//         </div>

//         <div className="p-4 border-t border-slate-800 bg-[#0F172A]">
//           <button onClick={handleLogout} className="flex items-center gap-3 text-slate-500 hover:text-red-400 w-full p-3 rounded-xl transition-all hover:bg-red-400/10 font-bold">
//             <LogOut size={19} /> <span className="text-sm">Log Out System</span>
//           </button>
//         </div>
//       </aside>

//       {/* --- CONTENT AREA --- */}
//       <main className="flex-1 flex flex-col relative overflow-hidden">
//         <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm sticky top-0 z-10">
//           <div className="flex items-center gap-3">
//             <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
//             <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
//               {user?.role?.replace('_', ' ')} Control Panel
//             </h2>
//           </div>
//           <div className="flex items-center gap-4">
//             <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"><HelpCircle size={18} /></button>
//             <div className="w-px h-6 bg-slate-200"></div>
//             <div className="text-[11px] font-black text-slate-400 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 uppercase">
//               {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
//             </div>
//           </div>
//         </header>
        
//         <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
//           <Outlet /> 
//         </div>
//       </main>

//       <style>{`
//         .nav-link { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 12px; transition: all 0.2s; color: #94a3b8; font-weight: 500; font-size: 0.95rem; cursor: pointer; }
//         .nav-link:hover { color: #ffffff; background-color: #1e293b; }
//         .active-link { background-color: #3b82f6 !important; color: #ffffff !important; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); }
//         .custom-scrollbar::-webkit-scrollbar { width: 5px; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
//         .custom-scrollbar-hidden::-webkit-scrollbar { display: none; }
//       `}</style>
//     </div>
//   );
// }







import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, ShoppingCart, Scissors, Users, Landmark, 
  Package, Settings, Bell, Search, ChevronDown, 
  ChevronRight, LogOut, UserCircle, Briefcase, Store, Ruler, X,
  Calendar, Clock, CheckSquare, BarChart3, FileText, Truck,
  HelpCircle, BookOpen, Award, Gift, CreditCard, Shield,
  Flag, Target, TrendingUp, UserPlus, UserCheck, UserX,
  HardHat, ClipboardList, Wallet, IndianRupee, Download, Filter,
  PieChart, Activity, DollarSign, Receipt, Banknote, PiggyBank,
  Menu
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { fetchNotifications } from "../../features/notification/notificationSlice";
import NotificationBell from "../common/NotificationBell";

export default function MainLayout() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  const [bankingOpen, setBankingOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const userId = user?._id || user?.id;

  useEffect(() => {
    if (userId) {
      console.log("🔔 MainLayout - Fetching notifications for:", userId);
      dispatch(fetchNotifications());
    }
  }, [dispatch, userId]);

  useEffect(() => {
    const handleFocus = () => {
      if (userId) {
        console.log("🔔 MainLayout - Page focused, syncing state");
        dispatch(fetchNotifications());
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [dispatch, userId]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      dispatch(logout());
      navigate("/");
    }
  };

  const isAdmin = user?.role === "ADMIN";
  const isStoreKeeper = user?.role === "STORE_KEEPER";
  const isCuttingMaster = user?.role === "CUTTING_MASTER";
  
  const canViewBanking = isAdmin || isStoreKeeper;
  const canViewCustomers = isAdmin || isStoreKeeper;
  const canViewStaff = isAdmin;
  const canViewProducts = isAdmin || isStoreKeeper;
  const canViewOrders = isAdmin || isStoreKeeper;
  const canViewWorks = true;
  const canViewMeasurement = isAdmin || isStoreKeeper;
  const canViewTailors = true;
  const canViewReports = isAdmin || isStoreKeeper;
  const canViewSettings = isAdmin;
  const canViewCuttingMasters = isAdmin;
  const canViewStoreKeepers = isAdmin;

  const isActive = (path) => {
    if (path === '#') return false;
    return location.pathname.includes(path);
  };

  const rolePath = user?.role === "ADMIN" ? "admin" : 
                   user?.role === "STORE_KEEPER" ? "storekeeper" : 
                   "cuttingmaster";

  const bankingItems = [
    { id: 'overview', label: 'Overview', icon: Wallet, path: `/${rolePath}/banking/overview` },
    { id: 'income', label: 'Income', icon: TrendingUp, path: `/${rolePath}/banking/income` },
    { id: 'expense', label: 'Expenses', icon: Receipt, path: `/${rolePath}/banking/expense` }
  ];

  const reportsItems = [
    { id: 'sales', label: 'Sales Report', icon: TrendingUp, path: `/${rolePath}/reports/sales` },
    { id: 'production', label: 'Production Report', icon: Briefcase, path: `/${rolePath}/reports/production` },
    { id: 'inventory', label: 'Inventory Report', icon: Package, path: `/${rolePath}/reports/inventory` },
  ];

  const getNavigationItems = () => {
    const items = [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', path: `/${rolePath}/dashboard`, show: true },
      { id: 'orders', icon: ShoppingCart, label: 'Orders', path: `/${rolePath}/orders`, show: canViewOrders },
      { id: 'works', icon: Briefcase, label: 'Works', path: `/${rolePath}/works`, show: canViewWorks },
      { id: 'tailors', icon: Scissors, label: 'Tailors', path: `/${rolePath}/tailors`, show: canViewTailors },
      { id: 'cutting-masters', icon: HardHat, label: 'Cutting Masters', path: `/${rolePath}/cutting-masters`, show: canViewCuttingMasters },
      { id: 'store-keepers', icon: Store, label: 'Store Keepers', path: `/${rolePath}/store-keepers`, show: canViewStoreKeepers },
      { id: 'measurements', icon: Ruler, label: 'Measurements', path: `/${rolePath}/measurements`, show: canViewMeasurement },
      { id: 'products', icon: Package, label: 'Products', path: `/${rolePath}/products`, show: canViewProducts },
      { id: 'customers', icon: Users, label: 'Customers', path: `/${rolePath}/customers`, show: canViewCustomers },
      { id: 'banking', icon: Landmark, label: 'Banking', path: '#', show: canViewBanking, isDropdown: true },
      { id: 'reports', icon: BarChart3, label: 'Reports', path: '#', show: canViewReports, isDropdown: true },
      { id: 'staff', icon: UserCircle, label: 'Staff', path: `/${rolePath}/staff`, show: canViewStaff },
      { id: 'settings', icon: Settings, label: 'Settings', path: `/${rolePath}/settings`, show: canViewSettings },
    ];
    return items.filter(item => item.show);
  };

  const filteredNavItems = getNavigationItems().filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-[#F1F5F9] overflow-hidden font-sans relative">
      
      {/* Mobile Header - Fixed at top */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 z-20 shadow-sm">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
        >
          <Menu size={24} />
        </button>
        <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest truncate max-w-[200px]">
          {user?.role?.replace('_', ' ')} Panel
        </h2>
        <div className="flex items-center gap-2">
          <NotificationBell />
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* --- LEFT SIDEBAR --- */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-72 bg-[#0F172A] text-slate-300 flex flex-col shadow-2xl
        transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        mt-0 md:mt-0
      `}>
        <div className="p-6 border-b border-slate-800 bg-[#0F172A] flex justify-between items-center">
          <h2 className="text-xl font-black text-white tracking-[0.2em] uppercase italic">
            Dreamfit <span className="text-blue-500 font-extrabold italic">Couture</span>
          </h2>
          {/* Close button on mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 flex items-center justify-between border-b border-slate-800 bg-[#1e293b]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg border border-blue-400/20">
              <UserCircle size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-white truncate w-24 leading-none mb-1">
                {user?.name || "User"}
              </span>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {user?.role?.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <Link 
              to={`/${rolePath}/settings`} 
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all"
              onClick={() => setSidebarOpen(false)}
            >
              <Settings size={18} />
            </Link>
            {/* Hide NotificationBell in sidebar on mobile since it's in header */}
            <div className="hidden md:block">
              <NotificationBell />
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="px-4 py-5">
          <div className="relative group">
            <Search className="absolute left-3 top-3 text-slate-500 group-focus-within:text-blue-400" size={18} />
            <input 
              type="text" 
              placeholder="Search menu..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1e293b]/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-10 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all text-white placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* NAV LINKS */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto mt-2 custom-scrollbar-hidden">
          {filteredNavItems.map((item) => (
            <div key={item.id}>
              {item.isDropdown ? (
                <div>
                  <button 
                    onClick={() => {
                      if (item.id === 'banking') setBankingOpen(!bankingOpen);
                      if (item.id === 'reports') setReportsOpen(!reportsOpen);
                    }}
                    className="w-full nav-link flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={19} /> 
                      <span>{item.label}</span>
                    </div>
                    {((item.id === 'banking' && bankingOpen) || (item.id === 'reports' && reportsOpen)) ? 
                      <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                  </button>
                  
                  {item.id === 'banking' && bankingOpen && (
                    <div className="ml-9 mt-1 space-y-1 border-l border-slate-700 pl-4 py-1">
                      {bankingItems.map(sub => (
                        <Link 
                          key={sub.id} 
                          to={sub.path} 
                          className="flex items-center gap-2 py-2 text-sm text-slate-500 hover:text-blue-400"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <sub.icon size={14} /> {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}

                  {item.id === 'reports' && reportsOpen && (
                    <div className="ml-9 mt-1 space-y-1 border-l border-slate-700 pl-4 py-1">
                      {reportsItems.map(sub => (
                        <Link 
                          key={sub.id} 
                          to={sub.path} 
                          className="flex items-center gap-2 py-2 text-sm text-slate-500 hover:text-blue-400"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <sub.icon size={14} /> {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  to={item.path} 
                  className={`nav-link ${isActive(item.path) ? 'active-link' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon size={19} /> 
                  <span>{item.label}</span>
                  {isActive(item.path) && <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full"></span>}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* FOOTER STATS */}
        <div className="px-4 py-3 border-t border-slate-800 bg-[#0F172A]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-1"><Clock size={12} /><span>{new Date().toLocaleTimeString()}</span></div>
            <div className="flex items-center gap-1"><Calendar size={12} /><span>{new Date().toLocaleDateString()}</span></div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-[#0F172A]">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 text-slate-500 hover:text-red-400 w-full p-3 rounded-xl transition-all hover:bg-red-400/10 font-bold"
          >
            <LogOut size={19} /> <span className="text-sm">Log Out System</span>
          </button>
        </div>
      </aside>

      {/* --- CONTENT AREA --- */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Desktop Header - Hidden on mobile */}
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 px-8 items-center justify-between shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
              {user?.role?.replace('_', ' ')} Control Panel
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
              <HelpCircle size={18} />
            </button>
            <div className="w-px h-6 bg-slate-200"></div>
            <div className="text-[11px] font-black text-slate-400 bg-slate-50 px-4 py-2 rounded-lg border border-slate-100 uppercase">
              {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </header>
        
        {/* Content with padding for mobile header */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 custom-scrollbar mt-16 md:mt-0">
          <Outlet /> 
        </div>
      </main>

      <style>{`
        .nav-link { 
          display: flex; 
          align-items: center; 
          gap: 12px; 
          padding: 12px 16px; 
          border-radius: 12px; 
          transition: all 0.2s; 
          color: #94a3b8; 
          font-weight: 500; 
          font-size: 0.95rem; 
          cursor: pointer; 
        }
        .nav-link:hover { 
          color: #ffffff; 
          background-color: #1e293b; 
        }
        .active-link { 
          background-color: #3b82f6 !important; 
          color: #ffffff !important; 
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3); 
        }
        .custom-scrollbar::-webkit-scrollbar { 
          width: 5px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #cbd5e1; 
          border-radius: 10px; 
        }
        .custom-scrollbar-hidden::-webkit-scrollbar { 
          display: none; 
        }
        
        @media (max-width: 640px) {
          .nav-link {
            padding: 10px 12px;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}