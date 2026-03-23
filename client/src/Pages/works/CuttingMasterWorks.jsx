// Pages/works/CuttingMasterWorks.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  RefreshCw,
  Clock,
  CheckCircle,
  Scissors,
  Ruler,
  Truck,
  Eye,
  UserPlus,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  X,
  Calendar,
  Hash,
  Package,
  User,
  Search,
  Filter,
  Flag,
  Bell,
  Activity,
  Target,
  TrendingUp,
  PieChart,
  Layers,
  Download,
  Zap,
  UserCheck,
  BarChart3,
  PlusCircle,
} from "lucide-react";
import {
  fetchMyWorks,
  acceptWorkById,
  selectMyWorks,
  selectWorkPagination,
  selectWorkLoading,
  setFilters,
} from "../../features/work/workSlice";
import showToast from "../../utils/toast";

export default function CuttingMasterWorks() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const works = useSelector(selectMyWorks);
  const pagination = useSelector(selectWorkPagination);
  const loading = useSelector(selectWorkLoading);
  const { user } = useSelector((state) => state.auth);

  // State
  const [filter, setFilter] = useState("all");
  const [acceptingId, setAcceptingId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [acceptedWork, setAcceptedWork] = useState(null);

  // Queue search and filter state
  const [queueSearch, setQueueSearch] = useState("");
  const [queueStatus, setQueueStatus] = useState("all");
  const [sortBy, setSortBy] = useState("priority");
  const [selectedView, setSelectedView] = useState("all"); // all, new, need-tailor

  // 🔍 DEBUG: Log when sortBy changes
  useEffect(() => {
    console.log("%c🔍 SORT OPTION CHANGED TO:", "background: purple; color: white; font-size: 12px", sortBy);
  }, [sortBy]);

  // Load works when filter changes
  useEffect(() => {
    loadWorks();
  }, [filter]);

  // 🔍 DEBUG: Log when works are loaded
  useEffect(() => {
    if (works && works.length > 0) {
      console.log("%c📦 WORKS LOADED:", "background: blue; color: white; font-size: 12px", works.length);
      console.log("First work sample:", {
        workId: works[0].workId,
        garmentPriority: works[0].garment?.priority,
        estimatedDelivery: works[0].estimatedDelivery,
        status: works[0].status
      });
      
      // Log all priorities
      const priorities = works.map(w => ({
        id: w.workId,
        priority: w.garment?.priority || 'normal'
      }));
      console.log("📋 All priorities:", priorities);
    }
  }, [works]);

  // Load works with proper filter params
  const loadWorks = async () => {
    try {
      let params = {};

      if (filter === "assigned") {
        params.hasTailor = "true";
      } else if (filter === "unassigned") {
        params.hasTailor = "false";
        params.status = "accepted";
      } else if (filter === "in-progress") {
        params.status = [
          "cutting-started",
          "cutting-completed",
          "sewing-started",
          "sewing-completed",
          "ironing",
        ];
      } else if (filter !== "all") {
        params.status = filter;
      }

      console.log("🔍 Loading works with params:", params);
      await dispatch(fetchMyWorks(params)).unwrap();
    } catch (error) {
      showToast.error("Failed to load works");
    }
  };

  const handleRefresh = () => {
    loadWorks();
    showToast.success("Data refreshed");
  };

  // Accept work
  const handleAcceptWork = async (work) => {
    setAcceptingId(work._id);

    if (work.status !== "pending") {
      showToast.info("This work is no longer available");
      setAcceptingId(null);
      loadWorks();
      return;
    }

    if (!window.confirm("Accept this work? It will be assigned to you.")) {
      setAcceptingId(null);
      return;
    }

    try {
      const result = await dispatch(acceptWorkById(work._id)).unwrap();

      showToast.success("Work accepted successfully!");

      setAcceptedWork({
        ...work,
        ...result.data,
        assignedTo: user?.name,
      });
      setShowSuccessModal(true);

      loadWorks();
    } catch (error) {
      console.error("❌ Accept failed:", error);

      if (
        error === "This work was already accepted by another cutting master"
      ) {
        showToast.error("This work was just taken by another cutting master");
      } else {
        showToast.error(error || "Failed to accept work");
      }

      loadWorks();
    } finally {
      setAcceptingId(null);
    }
  };

  // View work details
  const handleViewWork = (id) => {
    navigate(`/cuttingmaster/works/${id}`);
  };

  // Assign tailor
  const handleAssignTailor = (workId) => {
    navigate(`/cuttingmaster/works/${workId}?assign=true`);
  };

  // COMPLETE STATUS COLORS for all 8 statuses
  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      accepted: "bg-blue-100 text-blue-800 border-blue-200",
      "cutting-started": "bg-purple-100 text-purple-800 border-purple-200",
      "cutting-completed": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "sewing-started": "bg-pink-100 text-pink-800 border-pink-200",
      "sewing-completed": "bg-teal-100 text-teal-800 border-teal-200",
      ironing: "bg-orange-100 text-orange-800 border-orange-200",
      "ready-to-deliver": "bg-green-100 text-green-800 border-green-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  // COMPLETE STATUS BADGES with icons
  const getStatusBadge = (status) => {
    const badges = {
      pending: "⏳ Pending",
      accepted: "✅ Accepted",
      "cutting-started": "✂️ Cutting Started",
      "cutting-completed": "✔️ Cutting Completed",
      "sewing-started": "🧵 Sewing Started",
      "sewing-completed": "🧵 Sewing Completed",
      ironing: "🔥 Ironing",
      "ready-to-deliver": "📦 Ready to Deliver",
    };
    return badges[status] || status;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "accepted":
        return <CheckCircle size={16} />;
      case "cutting-started":
        return <Scissors size={16} />;
      case "cutting-completed":
        return <Scissors size={16} />;
      case "sewing-started":
        return <Ruler size={16} />;
      case "sewing-completed":
        return <Ruler size={16} />;
      case "ironing":
        return <Truck size={16} />;
      case "ready-to-deliver":
        return <CheckCircle size={16} />;
      default:
        return <Briefcase size={16} />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Due status helper
  const getDueStatus = (date) => {
    if (!date)
      return {
        label: "No due date",
        color: "text-gray-600",
        icon: <Calendar className="w-4 h-4 text-gray-400" />,
      };

    const diff = new Date(date) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return {
        label: "Due Today 🚨",
        color: "text-red-600 font-bold",
        icon: <Bell className="w-4 h-4 text-red-500 animate-pulse" />,
      };
    }
    if (days < 0) {
      return {
        label: `Overdue by ${Math.abs(days)} days ⚠️`,
        color: "text-gray-900 font-bold",
        icon: <AlertCircle className="w-4 h-4 text-gray-700" />,
      };
    }
    if (days === 1) {
      return {
        label: "Due Tomorrow",
        color: "text-orange-600",
        icon: <Clock className="w-4 h-4 text-orange-500" />,
      };
    }
    return {
      label: `Due in ${days} days`,
      color: "text-green-600",
      icon: <Calendar className="w-4 h-4 text-green-500" />,
    };
  };

  // Filter works based on current filter and search
  const filteredWorks = useMemo(() => {
    console.log("%c🔍 FILTERING WORKS", "background: orange; color: white; font-size: 12px");
    console.log("Filter params:", { filter, queueSearch, queueStatus, selectedView });
    
    let filtered = works || [];

    // Apply status filter from tabs
    if (filter !== "all") {
      if (filter === "assigned") {
        filtered = filtered.filter(
          (work) => work.tailor !== null && work.tailor !== undefined,
        );
      } else if (filter === "unassigned") {
        filtered = filtered.filter(
          (work) => work.status === "accepted" && !work.tailor,
        );
      } else if (filter === "in-progress") {
        filtered = filtered.filter((work) =>
          [
            "cutting-started",
            "cutting-completed",
            "sewing-started",
            "sewing-completed",
            "ironing",
          ].includes(work.status),
        );
      } else {
        filtered = filtered.filter((work) => work.status === filter);
      }
    }

    // Apply search
    if (queueSearch) {
      const searchTerm = queueSearch.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.workId?.toLowerCase().includes(searchTerm) ||
          item.garment?.garmentId?.toLowerCase().includes(searchTerm) ||
          item.garment?.name?.toLowerCase().includes(searchTerm) ||
          item.order?.customer?.name?.toLowerCase().includes(searchTerm) ||
          item.order?.orderId?.toLowerCase().includes(searchTerm),
      );
    }

    // Apply queue status filter
    if (queueStatus !== "all") {
      filtered = filtered.filter((item) => item.status === queueStatus);
    }

    // Apply view filter
    if (selectedView === "new") {
      filtered = filtered.filter((item) => item.status === "pending");
    }
    if (selectedView === "need-tailor") {
      filtered = filtered.filter(
        (item) => item.status === "accepted" && !item.tailor,
      );
    }

    console.log(`✅ After filtering: ${filtered.length} works`);
    return filtered;
  }, [works, filter, queueSearch, queueStatus, selectedView]);

  // 🔥 DEBUG SORTING LOGIC - Shows each comparison
  const prioritizedQueue = useMemo(() => {
    if (!filteredWorks.length) {
      console.log("⚠️ No works to sort");
      return [];
    }

    console.log(`\n%c🔍 SORTING BY: ${sortBy === "priority" ? "PRIORITY" : "DUE DATE"}`, "background: purple; color: white; font-size: 14px");
    console.log(`📊 Total works to sort: ${filteredWorks.length}`);
    
    // Log works before sorting
    console.log("📋 Works BEFORE sorting:");
    filteredWorks.slice(0, 5).forEach((w, i) => {
      console.log(`  ${i+1}. ${w.workId} - Priority: ${w.garment?.priority || 'normal'}, Due: ${w.estimatedDelivery || 'No date'}`);
    });

    const sorted = [...filteredWorks].sort((a, b) => {
      // Priority weights
      const priorityWeight = { high: 1, normal: 2, low: 3 };
      
      const aPri = priorityWeight[a.garment?.priority] || 2;
      const bPri = priorityWeight[b.garment?.priority] || 2;

      const dateA = a.estimatedDelivery ? new Date(a.estimatedDelivery).getTime() : 9999999999999;
      const dateB = b.estimatedDelivery ? new Date(b.estimatedDelivery).getTime() : 9999999999999;

      const aDateStr = a.estimatedDelivery ? new Date(a.estimatedDelivery).toLocaleDateString() : 'No date';
      const bDateStr = b.estimatedDelivery ? new Date(b.estimatedDelivery).toLocaleDateString() : 'No date';

      console.log(`\nComparing:`, {
        a: `${a.workId} (${a.garment?.priority || 'normal'}, ${aDateStr})`,
        b: `${b.workId} (${b.garment?.priority || 'normal'}, ${bDateStr})`,
        aPri, bPri,
        dateA, dateB
      });

      if (sortBy === "priority") {
        // Sort by priority first
        if (aPri !== bPri) {
          const result = aPri - bPri;
          console.log(`  → Priority diff: ${result} (${result < 0 ? 'A comes first' : 'B comes first'})`);
          return result;
        }
        // Then by due date
        const result = dateA - dateB;
        console.log(`  → Same priority, due date diff: ${result} (${result < 0 ? 'A earlier' : result > 0 ? 'B earlier' : 'same'})`);
        return result;
      } 
      else {
        // Sort by due date first
        if (dateA !== dateB) {
          const result = dateA - dateB;
          console.log(`  → Due date diff: ${result} (${result < 0 ? 'A earlier' : 'B earlier'})`);
          return result;
        }
        // Then by priority
        const result = aPri - bPri;
        console.log(`  → Same due date, priority diff: ${result} (${result < 0 ? 'A higher priority' : result > 0 ? 'B higher priority' : 'same'})`);
        return result;
      }
    });

    // Log sorted order
    console.log("\n✅ SORTED ORDER (first 5):");
    sorted.slice(0, 5).forEach((work, i) => {
      console.log(`  ${i+1}. ${work.workId} - Priority: ${work.garment?.priority || 'normal'}, Due: ${work.estimatedDelivery || 'No date'}`);
    });

    return sorted;
  }, [filteredWorks, sortBy]);

  // Stats calculations with Overdue
  const stats = useMemo(() => {
    const allWorks = works || [];
    
    // Calculate overdue works
    const overdueCount = allWorks.filter(w => {
      if (!w.estimatedDelivery) return false;
      const today = new Date();
      const deliveryDate = new Date(w.estimatedDelivery);
      const isOverdue = deliveryDate < today && 
        !['ready-to-deliver', 'ironing'].includes(w.status);
      return isOverdue;
    }).length;
    
    return {
      totalWork: allWorks.length,
      pendingWorks: allWorks.filter((w) => w.status === "pending").length,
      acceptedWorks: allWorks.filter((w) => w.status === "accepted").length,
      inProgressWorks: allWorks.filter((w) =>
        [
          "cutting-started",
          "cutting-completed",
          "sewing-started",
          "sewing-completed",
          "ironing",
        ].includes(w.status),
      ).length,
      readyWorks: allWorks.filter((w) => w.status === "ready-to-deliver").length,
      assignedCount: allWorks.filter((w) => w.tailor).length,
      unassignedCount: allWorks.filter(
        (w) => w.status === "accepted" && !w.tailor,
      ).length,
      overdueCount: overdueCount,
    };
  }, [works]);

  // Status breakdown
  const statusBreakdown = useMemo(() => {
    const allWorks = works || [];
    return [
      {
        status: "pending",
        count: allWorks.filter((w) => w.status === "pending").length,
        color: "bg-yellow-500",
      },
      {
        status: "accepted",
        count: allWorks.filter((w) => w.status === "accepted").length,
        color: "bg-blue-500",
      },
      {
        status: "cutting-started",
        count: allWorks.filter((w) => w.status === "cutting-started").length,
        color: "bg-purple-500",
      },
      {
        status: "cutting-completed",
        count: allWorks.filter((w) => w.status === "cutting-completed").length,
        color: "bg-indigo-500",
      },
      {
        status: "sewing-started",
        count: allWorks.filter((w) => w.status === "sewing-started").length,
        color: "bg-pink-500",
      },
      {
        status: "sewing-completed",
        count: allWorks.filter((w) => w.status === "sewing-completed").length,
        color: "bg-teal-500",
      },
      {
        status: "ironing",
        count: allWorks.filter((w) => w.status === "ironing").length,
        color: "bg-orange-500",
      },
      {
        status: "ready-to-deliver",
        count: allWorks.filter((w) => w.status === "ready-to-deliver").length,
        color: "bg-green-500",
      },
    ];
  }, [works]);

  // Today's Due Works
  const todayDueWorks = useMemo(() => {
    const today = new Date();
    const todayStr = today.toDateString();
    
    return (works || [])
      .filter(work => {
        if (!work.estimatedDelivery) return false;
        const workDate = new Date(work.estimatedDelivery);
        return workDate.toDateString() === todayStr;
      })
      .sort((a, b) => {
        const priorityWeight = { high: 1, normal: 2, low: 3 };
        const aPriority = a.garment?.priority || 'normal';
        const bPriority = b.garment?.priority || 'normal';
        
        if (priorityWeight[aPriority] !== priorityWeight[bPriority]) {
          return priorityWeight[aPriority] - priorityWeight[bPriority];
        }
        
        const aTime = new Date(a.estimatedDelivery).getTime();
        const bTime = new Date(b.estimatedDelivery).getTime();
        return aTime - bTime;
      });
  }, [works]);

  // Tomorrow's Due Works
  const tomorrowDueWorks = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toDateString();
    
    return (works || [])
      .filter(work => {
        if (!work.estimatedDelivery) return false;
        const workDate = new Date(work.estimatedDelivery);
        return workDate.toDateString() === tomorrowStr;
      })
      .sort((a, b) => {
        const aTime = new Date(a.estimatedDelivery).getTime();
        const bTime = new Date(b.estimatedDelivery).getTime();
        return aTime - bTime;
      });
  }, [works]);

  // Priority counts for today
  const highPriorityToday = useMemo(() => 
    todayDueWorks.filter(w => w.garment?.priority === 'high').length, 
  [todayDueWorks]);

  const normalPriorityToday = useMemo(() => 
    todayDueWorks.filter(w => w.garment?.priority === 'normal' || !w.garment?.priority).length, 
  [todayDueWorks]);

  const lowPriorityToday = useMemo(() => 
    todayDueWorks.filter(w => w.garment?.priority === 'low').length, 
  [todayDueWorks]);

  // Function to get priority display
  const getPriorityDisplay = (work) => {
    const priority = work.garment?.priority || 'normal';
    if (priority === 'high') return '🔴 High';
    if (priority === 'normal') return '🟠 Normal';
    return '🟢 Low';
  };

  const getPriorityColor = (work) => {
    const priority = work.garment?.priority || 'normal';
    if (priority === 'high') return 'border-l-4 border-l-red-600 bg-red-50';
    if (priority === 'normal') return 'border-l-4 border-l-orange-400 bg-orange-50';
    return 'border-l-4 border-l-green-600 bg-green-50';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Scissors className="w-8 h-8 text-purple-600" />
            Cutting Master Work Queue
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <span>Welcome back, {user?.name || "Cutting Master"}! 👋</span>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </span>
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
        {/* 1. Not Accepted - Pending */}
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-gray-500">
          <p className="text-xs text-gray-500 mb-1">⏳ Not Accepted</p>
          <p className="text-2xl font-bold text-gray-800">
            {stats.pendingWorks}
          </p>
          <p className="text-xs text-gray-400 mt-1">Pending</p>
        </div>

        {/* 2. Accepted */}
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
          <p className="text-xs text-gray-500 mb-1">✅ Accepted</p>
          <p className="text-2xl font-bold text-blue-600">
            {stats.acceptedWorks}
          </p>
          <p className="text-xs text-gray-400 mt-1">Accepted works</p>
        </div>

        {/* 3. In Progress */}
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
          <p className="text-xs text-gray-500 mb-1">⚙️ In Progress</p>
          <p className="text-2xl font-bold text-purple-600">
            {stats.inProgressWorks}
          </p>
          <p className="text-xs text-gray-400 mt-1">Cutting → Ironing</p>
        </div>

        {/* 4. Ready to Deliver */}
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
          <p className="text-xs text-gray-500 mb-1">📦 Ready to Deliver</p>
          <p className="text-2xl font-bold text-green-600">
            {stats.readyWorks}
          </p>
          <p className="text-xs text-gray-400 mt-1">Ready for delivery</p>
        </div>

        {/* 5. Assigned to Tailor */}
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-indigo-500">
          <p className="text-xs text-gray-500 mb-1">👔 Assigned to Tailor</p>
          <p className="text-2xl font-bold text-indigo-600">
            {stats.assignedCount}
          </p>
          <p className="text-xs text-gray-400 mt-1">Tailor assigned</p>
        </div>

        {/* 6. Not Assigned (Need Tailor) */}
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-orange-500">
          <p className="text-xs text-gray-500 mb-1">⚠️ Not Assigned</p>
          <p className="text-2xl font-bold text-orange-600">
            {stats.unassignedCount}
          </p>
          <p className="text-xs text-gray-400 mt-1">Need tailor</p>
        </div>

        {/* 7. Overdue Works */}
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-600">
          <p className="text-xs text-gray-500 mb-1">🚨 Overdue</p>
          <p className="text-2xl font-bold text-red-600">
            {stats.overdueCount}
          </p>
          <p className="text-xs text-gray-400 mt-1">Past delivery date</p>
        </div>

        {/* 8. Total Works */}
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-cyan-500">
          <p className="text-xs text-gray-500 mb-1">📊 Total Works</p>
          <p className="text-2xl font-bold text-cyan-600">{stats.totalWork}</p>
          <p className="text-xs text-gray-400 mt-1">All works</p>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <PieChart size={20} className="text-purple-600" />
          Production Status Overview
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statusBreakdown.map((item) => (
            <div key={item.status} className="relative">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 capitalize">
                  {item.status.replace(/-/g, " ")}
                </span>
                <span className="font-bold text-gray-800">{item.count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`${item.color} h-2 rounded-full`}
                  style={{
                    width:
                      stats.totalWork > 0
                        ? `${(item.count / stats.totalWork) * 100}%`
                        : "0%",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Focus & Tomorrow's Prep */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Today's Focus */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg">
              <Target className="w-6 h-6 text-white" />
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-gray-500">Today</p>
                  <p className="text-sm font-bold text-gray-800">
                    {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
                
                <div className="w-px h-8 bg-red-200"></div>
                
                <div className="text-center">
                  <p className="text-xs text-gray-500">Due Today</p>
                  <p className="text-xl font-bold text-red-600">{todayDueWorks.length}</p>
                </div>
                
                <div className="w-px h-8 bg-red-200"></div>
                
                <div className="flex gap-2">
                  <div className="text-center">
                    <p className="text-xs text-red-600">🔴</p>
                    <p className="text-sm font-bold text-gray-800">{highPriorityToday}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-orange-600">🟠</p>
                    <p className="text-sm font-bold text-gray-800">{normalPriorityToday}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-green-600">🟢</p>
                    <p className="text-sm font-bold text-gray-800">{lowPriorityToday}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-800">Today's Deadline</h3>
          <p className="text-sm text-red-600 mb-4">
            {new Date().toLocaleDateString('en-IN', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })} - {todayDueWorks.length} items due
          </p>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {todayDueWorks.length > 0 ? (
              todayDueWorks.map((work) => {
                const priorityColor = getPriorityColor(work);
                const priorityText = getPriorityDisplay(work);
                
                return (
                  <div
                    key={work._id}
                    onClick={() => navigate(`/cuttingmaster/works/${work._id}`)}
                    className={`flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer ${priorityColor}`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                          #{work.workId}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                          {work.garment?.garmentId || 'N/A'}
                        </span>
                        <span className="text-xs font-medium">
                          {priorityText}
                        </span>
                      </div>
                      <p className="font-medium text-gray-800">
                        {work.garment?.name || 'Unknown Garment'}
                      </p>
                      <p className="text-xs text-gray-500">
                        👤 {work.order?.customer?.name || 'Unknown'} 
                        {work.tailor && ` | 👔 Tailor: ${work.tailor.name}`}
                      </p>
                      {work.estimatedDelivery && (
                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                          <Clock size={12} />
                          Due by {new Date(work.estimatedDelivery).toLocaleTimeString('en-IN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      )}
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 bg-white/50 rounded-lg">
                <CheckCircle size={32} className="text-green-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No works due today! 🎉</p>
                <p className="text-xs text-gray-400 mt-1">All caught up</p>
              </div>
            )}
          </div>
        </div>

        {/* Tomorrow's Prep */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6">
          <div className="p-3 bg-blue-500 rounded-lg w-fit mb-4">
            <Clock className="w-6 h-6 text-white" />
          </div>

          <h3 className="text-lg font-bold text-gray-800">Tomorrow's Preparation</h3>
          <p className="text-sm text-blue-600 mb-4">
            {new Date(Date.now() + 86400000).toLocaleDateString('en-IN', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })} - {tomorrowDueWorks.length} items due
          </p>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {tomorrowDueWorks.length > 0 ? (
              tomorrowDueWorks.map((work) => (
                <div
                  key={work._id}
                  onClick={() => navigate(`/cuttingmaster/works/${work._id}`)}
                  className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 border-blue-400"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        #{work.workId}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {work.garment?.garmentId || 'N/A'}
                      </span>
                      {work.garment?.priority === 'high' && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                          🔴 High
                        </span>
                      )}
                    </div>
                    <p className="font-medium text-gray-800">
                      {work.garment?.name || 'Unknown Garment'}
                    </p>
                    <p className="text-xs text-gray-500">
                      👤 {work.order?.customer?.name || 'Unknown'}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>
              ))
            ) : (
              <div className="text-center py-8 bg-white/50 rounded-lg">
                <p className="text-sm text-gray-600">No items due tomorrow</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Production Queue */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-600" />
              Work Queue
            </h2>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
              {prioritizedQueue.length} items
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* View Filters */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setSelectedView("all")}
                className={`px-3 py-1.5 text-xs rounded-md transition ${
                  selectedView === "all"
                    ? "bg-purple-600 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                All ({stats.totalWork})
              </button>
              <button
                onClick={() => setSelectedView("new")}
                className={`px-3 py-1.5 text-xs rounded-md transition flex items-center gap-1 ${
                  selectedView === "new"
                    ? "bg-yellow-500 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>🆕 New / Not Accepted</span>
                <span
                  className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                    selectedView === "new"
                      ? "bg-yellow-600 text-white"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {stats.pendingWorks}
                </span>
              </button>
              <button
                onClick={() => setSelectedView("need-tailor")}
                className={`px-3 py-1.5 text-xs rounded-md transition flex items-center gap-1 ${
                  selectedView === "need-tailor"
                    ? "bg-orange-500 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <span>👔 Need Tailor</span>
                <span
                  className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                    selectedView === "need-tailor"
                      ? "bg-orange-600 text-white"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {stats.unassignedCount}
                </span>
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={queueSearch}
                onChange={(e) => setQueueSearch(e.target.value)}
                placeholder="Search by Work ID, Garment ID or Customer..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 w-64"
              />
              {queueSearch && (
                <button
                  onClick={() => setQueueSearch("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <select
              value={queueStatus}
              onChange={(e) => setQueueStatus(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">🔍 All Status</option>
              <option value="pending">⏳ Pending</option>
              <option value="accepted">✅ Accepted</option>
              <option value="cutting-started">✂️ Cutting Started</option>
              <option value="cutting-completed">✔️ Cutting Completed</option>
              <option value="sewing-started">🧵 Sewing Started</option>
              <option value="sewing-completed">🧵 Sewing Completed</option>
              <option value="ironing">🔥 Ironing</option>
              <option value="ready-to-deliver">📦 Ready to Deliver</option>
            </select>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
            >
              <option value="priority">Sort by Priority</option>
              <option value="due">Sort by Due Date</option>
            </select>
          </div>
        </div>

        {/* Queue List */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2">
            {prioritizedQueue.length > 0 ? (
              prioritizedQueue.map((work) => {
                const dueStatus = getDueStatus(work.estimatedDelivery);
                const isHighPriority = work.garment?.priority === "high";

                return (
                  <div
                    key={work._id}
                    className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${getStatusColor(work.status)} ${
                      isHighPriority ? "border-l-8 border-l-red-500" : ""
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        {/* Top Row */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="font-mono text-sm font-bold text-purple-600 bg-white px-2 py-1 rounded">
                            #{work.workId}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}
                          >
                            {getStatusBadge(work.status)}
                          </span>
                          {isHighPriority && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center gap-1">
                              <Flag size={10} /> High Priority
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-gray-800 text-lg mb-1">
                          {work.garment?.name || "N/A"}
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          {/* <div className="flex items-center gap-1">
                            <User size={14} className="text-gray-400" />
                            <span>
                              {work.order?.customer?.name || "Unknown"}
                            </span>
                          </div> */}

                          <div
                            className={`flex items-center gap-1 ${dueStatus.color}`}
                          >
                            {dueStatus.icon}
                            <span>{dueStatus.label}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Package size={14} className="text-purple-500" />
                            <span>
                              Garment: {work.garment?.garmentId || "N/A"}
                            </span>
                          </div>

                          {work.tailor && (
                            <div className="flex items-center gap-1">
                              <UserCheck size={14} className="text-green-500" />
                              <span>Tailor: {work.tailor.name}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {work.status === "pending" ? (
                        <button
                          onClick={() => handleAcceptWork(work)}
                          disabled={acceptingId === work._id}
                          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                            acceptingId === work._id
                              ? "bg-gray-400 cursor-not-allowed text-white"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }`}
                        >
                          {acceptingId === work._id ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <CheckCircle size={16} />
                              Accept
                            </>
                          )}
                        </button>
                      ) : work.status === "accepted" && !work.tailor ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewWork(work._id)}
                            className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
                          >
                            <Eye size={14} /> View
                          </button>
                          <button
                            onClick={() => handleAssignTailor(work._id)}
                            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-1"
                          >
                            <UserPlus size={14} /> Assign
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleViewWork(work._id)}
                          className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition flex items-center gap-1"
                        >
                          <Eye size={14} /> Details
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Scissors className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="font-medium">No items in work queue</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination?.pages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => dispatch(setFilters({ page: pagination.page - 1 }))}
            disabled={pagination.page === 1}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() => dispatch(setFilters({ page: pagination.page + 1 }))}
            disabled={pagination.page === pagination.pages}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && acceptedWork && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>

            <h2 className="text-xl font-bold text-center mb-2">
              Work Accepted Successfully!
            </h2>

            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-green-700 mb-2">
                This work is now assigned to:
              </p>
              <p className="font-bold text-lg text-green-800">
                {acceptedWork.assignedTo}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Work ID: {acceptedWork.workId}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  navigate(
                    `/cuttingmaster/works/${acceptedWork._id}?assign=true`,
                  );
                }}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Assign Tailor Now
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


// // Pages/works/CuttingMasterWorks.jsx
// import React, { useState, useEffect, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   Briefcase,
//   RefreshCw,
//   Clock,
//   CheckCircle,
//   Scissors,
//   Ruler,
//   Truck,
//   Eye,
//   UserPlus,
//   ChevronLeft,
//   ChevronRight,
//   ChevronDown,
//   Check,
//   AlertCircle,
//   X,
//   Calendar,
//   Hash,
//   Package,
//   User,
//   Search,
//   Filter,
//   Flag,
//   Bell,
//   Activity,
//   Target,
//   TrendingUp,
//   PieChart,
//   Layers,
//   Download,
//   Zap,
//   UserCheck,
//   BarChart3,
//   PlusCircle,
//   Menu,
//   Grid
// } from "lucide-react";
// import {
//   fetchMyWorks,
//   acceptWorkById,
//   selectMyWorks,
//   selectWorkPagination,
//   selectWorkLoading,
//   setFilters,
// } from "../../features/work/workSlice";
// import showToast from "../../utils/toast";

// export default function CuttingMasterWorks() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const works = useSelector(selectMyWorks);
//   const pagination = useSelector(selectWorkPagination);
//   const loading = useSelector(selectWorkLoading);
//   const { user } = useSelector((state) => state.auth);

//   // State
//   const [filter, setFilter] = useState("all");
//   const [acceptingId, setAcceptingId] = useState(null);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [acceptedWork, setAcceptedWork] = useState(null);

//   // Queue search and filter state
//   const [queueSearch, setQueueSearch] = useState("");
//   const [queueStatus, setQueueStatus] = useState("all");
//   const [sortBy, setSortBy] = useState("priority");
//   const [selectedView, setSelectedView] = useState("all"); // all, new, need-tailor

//   // Mobile state
//   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [mobileTab, setMobileTab] = useState("queue"); // 'queue', 'stats', 'today'
//   const [mobileView, setMobileView] = useState("list"); // 'list' or 'grid'

//   // 🔍 DEBUG: Log when sortBy changes
//   useEffect(() => {
//     console.log("%c🔍 SORT OPTION CHANGED TO:", "background: purple; color: white; font-size: 12px", sortBy);
//   }, [sortBy]);

//   // Load works when filter changes
//   useEffect(() => {
//     loadWorks();
//   }, [filter]);

//   // 🔍 DEBUG: Log when works are loaded
//   useEffect(() => {
//     if (works && works.length > 0) {
//       console.log("%c📦 WORKS LOADED:", "background: blue; color: white; font-size: 12px", works.length);
//       console.log("First work sample:", {
//         workId: works[0].workId,
//         garmentPriority: works[0].garment?.priority,
//         estimatedDelivery: works[0].estimatedDelivery,
//         status: works[0].status
//       });
      
//       // Log all priorities
//       const priorities = works.map(w => ({
//         id: w.workId,
//         priority: w.garment?.priority || 'normal'
//       }));
//       console.log("📋 All priorities:", priorities);
//     }
//   }, [works]);

//   // Load works with proper filter params
//   const loadWorks = async () => {
//     try {
//       let params = {};

//       if (filter === "assigned") {
//         params.hasTailor = "true";
//       } else if (filter === "unassigned") {
//         params.hasTailor = "false";
//         params.status = "accepted";
//       } else if (filter === "in-progress") {
//         params.status = [
//           "cutting-started",
//           "cutting-completed",
//           "sewing-started",
//           "sewing-completed",
//           "ironing",
//         ];
//       } else if (filter !== "all") {
//         params.status = filter;
//       }

//       console.log("🔍 Loading works with params:", params);
//       await dispatch(fetchMyWorks(params)).unwrap();
//     } catch (error) {
//       showToast.error("Failed to load works");
//     }
//   };

//   const handleRefresh = () => {
//     loadWorks();
//     showToast.success("Data refreshed");
//   };

//   // Accept work
//   const handleAcceptWork = async (work) => {
//     setAcceptingId(work._id);

//     if (work.status !== "pending") {
//       showToast.info("This work is no longer available");
//       setAcceptingId(null);
//       loadWorks();
//       return;
//     }

//     if (!window.confirm("Accept this work? It will be assigned to you.")) {
//       setAcceptingId(null);
//       return;
//     }

//     try {
//       const result = await dispatch(acceptWorkById(work._id)).unwrap();

//       showToast.success("Work accepted successfully!");

//       setAcceptedWork({
//         ...work,
//         ...result.data,
//         assignedTo: user?.name,
//       });
//       setShowSuccessModal(true);

//       loadWorks();
//     } catch (error) {
//       console.error("❌ Accept failed:", error);

//       if (
//         error === "This work was already accepted by another cutting master"
//       ) {
//         showToast.error("This work was just taken by another cutting master");
//       } else {
//         showToast.error(error || "Failed to accept work");
//       }

//       loadWorks();
//     } finally {
//       setAcceptingId(null);
//     }
//   };

//   // View work details
//   const handleViewWork = (id) => {
//     navigate(`/cuttingmaster/works/${id}`);
//   };

//   // Assign tailor
//   const handleAssignTailor = (workId) => {
//     navigate(`/cuttingmaster/works/${workId}?assign=true`);
//   };

//   // COMPLETE STATUS COLORS for all 8 statuses
//   const getStatusColor = (status) => {
//     const colors = {
//       pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
//       accepted: "bg-blue-100 text-blue-800 border-blue-200",
//       "cutting-started": "bg-purple-100 text-purple-800 border-purple-200",
//       "cutting-completed": "bg-indigo-100 text-indigo-800 border-indigo-200",
//       "sewing-started": "bg-pink-100 text-pink-800 border-pink-200",
//       "sewing-completed": "bg-teal-100 text-teal-800 border-teal-200",
//       ironing: "bg-orange-100 text-orange-800 border-orange-200",
//       "ready-to-deliver": "bg-green-100 text-green-800 border-green-200",
//     };
//     return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
//   };

//   // COMPLETE STATUS BADGES with icons
//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: "⏳ Pending",
//       accepted: "✅ Accepted",
//       "cutting-started": "✂️ Cutting Started",
//       "cutting-completed": "✔️ Cutting Completed",
//       "sewing-started": "🧵 Sewing Started",
//       "sewing-completed": "🧵 Sewing Completed",
//       ironing: "🔥 Ironing",
//       "ready-to-deliver": "📦 Ready to Deliver",
//     };
//     return badges[status] || status;
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "pending":
//         return <Clock size={16} />;
//       case "accepted":
//         return <CheckCircle size={16} />;
//       case "cutting-started":
//         return <Scissors size={16} />;
//       case "cutting-completed":
//         return <Scissors size={16} />;
//       case "sewing-started":
//         return <Ruler size={16} />;
//       case "sewing-completed":
//         return <Ruler size={16} />;
//       case "ironing":
//         return <Truck size={16} />;
//       case "ready-to-deliver":
//         return <CheckCircle size={16} />;
//       default:
//         return <Briefcase size={16} />;
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return "Not set";
//     return new Date(dateString).toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric",
//     });
//   };

//   // Due status helper
//   const getDueStatus = (date) => {
//     if (!date)
//       return {
//         label: "No due date",
//         color: "text-gray-600",
//         icon: <Calendar className="w-4 h-4 text-gray-400" />,
//       };

//     const diff = new Date(date) - new Date();
//     const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

//     if (days === 0) {
//       return {
//         label: "Due Today 🚨",
//         color: "text-red-600 font-bold",
//         icon: <Bell className="w-4 h-4 text-red-500 animate-pulse" />,
//       };
//     }
//     if (days < 0) {
//       return {
//         label: `Overdue by ${Math.abs(days)} days ⚠️`,
//         color: "text-gray-900 font-bold",
//         icon: <AlertCircle className="w-4 h-4 text-gray-700" />,
//       };
//     }
//     if (days === 1) {
//       return {
//         label: "Due Tomorrow",
//         color: "text-orange-600",
//         icon: <Clock className="w-4 h-4 text-orange-500" />,
//       };
//     }
//     return {
//       label: `Due in ${days} days`,
//       color: "text-green-600",
//       icon: <Calendar className="w-4 h-4 text-green-500" />,
//     };
//   };

//   // Filter works based on current filter and search
//   const filteredWorks = useMemo(() => {
//     console.log("%c🔍 FILTERING WORKS", "background: orange; color: white; font-size: 12px");
//     console.log("Filter params:", { filter, queueSearch, queueStatus, selectedView });
    
//     let filtered = works || [];

//     // Apply status filter from tabs
//     if (filter !== "all") {
//       if (filter === "assigned") {
//         filtered = filtered.filter(
//           (work) => work.tailor !== null && work.tailor !== undefined,
//         );
//       } else if (filter === "unassigned") {
//         filtered = filtered.filter(
//           (work) => work.status === "accepted" && !work.tailor,
//         );
//       } else if (filter === "in-progress") {
//         filtered = filtered.filter((work) =>
//           [
//             "cutting-started",
//             "cutting-completed",
//             "sewing-started",
//             "sewing-completed",
//             "ironing",
//           ].includes(work.status),
//         );
//       } else {
//         filtered = filtered.filter((work) => work.status === filter);
//       }
//     }

//     // Apply search
//     if (queueSearch) {
//       const searchTerm = queueSearch.toLowerCase().trim();
//       filtered = filtered.filter(
//         (item) =>
//           item.workId?.toLowerCase().includes(searchTerm) ||
//           item.garment?.garmentId?.toLowerCase().includes(searchTerm) ||
//           item.garment?.name?.toLowerCase().includes(searchTerm) ||
//           item.order?.customer?.name?.toLowerCase().includes(searchTerm) ||
//           item.order?.orderId?.toLowerCase().includes(searchTerm),
//       );
//     }

//     // Apply queue status filter
//     if (queueStatus !== "all") {
//       filtered = filtered.filter((item) => item.status === queueStatus);
//     }

//     // Apply view filter
//     if (selectedView === "new") {
//       filtered = filtered.filter((item) => item.status === "pending");
//     }
//     if (selectedView === "need-tailor") {
//       filtered = filtered.filter(
//         (item) => item.status === "accepted" && !item.tailor,
//       );
//     }

//     console.log(`✅ After filtering: ${filtered.length} works`);
//     return filtered;
//   }, [works, filter, queueSearch, queueStatus, selectedView]);

//   // 🔥 DEBUG SORTING LOGIC - Shows each comparison
//   const prioritizedQueue = useMemo(() => {
//     if (!filteredWorks.length) {
//       console.log("⚠️ No works to sort");
//       return [];
//     }

//     console.log(`\n%c🔍 SORTING BY: ${sortBy === "priority" ? "PRIORITY" : "DUE DATE"}`, "background: purple; color: white; font-size: 14px");
//     console.log(`📊 Total works to sort: ${filteredWorks.length}`);
    
//     // Log works before sorting
//     console.log("📋 Works BEFORE sorting:");
//     filteredWorks.slice(0, 5).forEach((w, i) => {
//       console.log(`  ${i+1}. ${w.workId} - Priority: ${w.garment?.priority || 'normal'}, Due: ${w.estimatedDelivery || 'No date'}`);
//     });

//     const sorted = [...filteredWorks].sort((a, b) => {
//       // Priority weights
//       const priorityWeight = { high: 1, normal: 2, low: 3 };
      
//       const aPri = priorityWeight[a.garment?.priority] || 2;
//       const bPri = priorityWeight[b.garment?.priority] || 2;

//       const dateA = a.estimatedDelivery ? new Date(a.estimatedDelivery).getTime() : 9999999999999;
//       const dateB = b.estimatedDelivery ? new Date(b.estimatedDelivery).getTime() : 9999999999999;

//       const aDateStr = a.estimatedDelivery ? new Date(a.estimatedDelivery).toLocaleDateString() : 'No date';
//       const bDateStr = b.estimatedDelivery ? new Date(b.estimatedDelivery).toLocaleDateString() : 'No date';

//       console.log(`\nComparing:`, {
//         a: `${a.workId} (${a.garment?.priority || 'normal'}, ${aDateStr})`,
//         b: `${b.workId} (${b.garment?.priority || 'normal'}, ${bDateStr})`,
//         aPri, bPri,
//         dateA, dateB
//       });

//       if (sortBy === "priority") {
//         // Sort by priority first
//         if (aPri !== bPri) {
//           const result = aPri - bPri;
//           console.log(`  → Priority diff: ${result} (${result < 0 ? 'A comes first' : 'B comes first'})`);
//           return result;
//         }
//         // Then by due date
//         const result = dateA - dateB;
//         console.log(`  → Same priority, due date diff: ${result} (${result < 0 ? 'A earlier' : result > 0 ? 'B earlier' : 'same'})`);
//         return result;
//       } 
//       else {
//         // Sort by due date first
//         if (dateA !== dateB) {
//           const result = dateA - dateB;
//           console.log(`  → Due date diff: ${result} (${result < 0 ? 'A earlier' : 'B earlier'})`);
//           return result;
//         }
//         // Then by priority
//         const result = aPri - bPri;
//         console.log(`  → Same due date, priority diff: ${result} (${result < 0 ? 'A higher priority' : result > 0 ? 'B higher priority' : 'same'})`);
//         return result;
//       }
//     });

//     // Log sorted order
//     console.log("\n✅ SORTED ORDER (first 5):");
//     sorted.slice(0, 5).forEach((work, i) => {
//       console.log(`  ${i+1}. ${work.workId} - Priority: ${work.garment?.priority || 'normal'}, Due: ${work.estimatedDelivery || 'No date'}`);
//     });

//     return sorted;
//   }, [filteredWorks, sortBy]);

//   // Stats calculations with Overdue
//   const stats = useMemo(() => {
//     const allWorks = works || [];
    
//     // Calculate overdue works
//     const overdueCount = allWorks.filter(w => {
//       if (!w.estimatedDelivery) return false;
//       const today = new Date();
//       const deliveryDate = new Date(w.estimatedDelivery);
//       const isOverdue = deliveryDate < today && 
//         !['ready-to-deliver', 'ironing'].includes(w.status);
//       return isOverdue;
//     }).length;
    
//     return {
//       totalWork: allWorks.length,
//       pendingWorks: allWorks.filter((w) => w.status === "pending").length,
//       acceptedWorks: allWorks.filter((w) => w.status === "accepted").length,
//       inProgressWorks: allWorks.filter((w) =>
//         [
//           "cutting-started",
//           "cutting-completed",
//           "sewing-started",
//           "sewing-completed",
//           "ironing",
//         ].includes(w.status),
//       ).length,
//       readyWorks: allWorks.filter((w) => w.status === "ready-to-deliver").length,
//       assignedCount: allWorks.filter((w) => w.tailor).length,
//       unassignedCount: allWorks.filter(
//         (w) => w.status === "accepted" && !w.tailor,
//       ).length,
//       overdueCount: overdueCount,
//     };
//   }, [works]);

//   // Status breakdown
//   const statusBreakdown = useMemo(() => {
//     const allWorks = works || [];
//     return [
//       {
//         status: "pending",
//         count: allWorks.filter((w) => w.status === "pending").length,
//         color: "bg-yellow-500",
//       },
//       {
//         status: "accepted",
//         count: allWorks.filter((w) => w.status === "accepted").length,
//         color: "bg-blue-500",
//       },
//       {
//         status: "cutting-started",
//         count: allWorks.filter((w) => w.status === "cutting-started").length,
//         color: "bg-purple-500",
//       },
//       {
//         status: "cutting-completed",
//         count: allWorks.filter((w) => w.status === "cutting-completed").length,
//         color: "bg-indigo-500",
//       },
//       {
//         status: "sewing-started",
//         count: allWorks.filter((w) => w.status === "sewing-started").length,
//         color: "bg-pink-500",
//       },
//       {
//         status: "sewing-completed",
//         count: allWorks.filter((w) => w.status === "sewing-completed").length,
//         color: "bg-teal-500",
//       },
//       {
//         status: "ironing",
//         count: allWorks.filter((w) => w.status === "ironing").length,
//         color: "bg-orange-500",
//       },
//       {
//         status: "ready-to-deliver",
//         count: allWorks.filter((w) => w.status === "ready-to-deliver").length,
//         color: "bg-green-500",
//       },
//     ];
//   }, [works]);

//   // Today's Due Works
//   const todayDueWorks = useMemo(() => {
//     const today = new Date();
//     const todayStr = today.toDateString();
    
//     return (works || [])
//       .filter(work => {
//         if (!work.estimatedDelivery) return false;
//         const workDate = new Date(work.estimatedDelivery);
//         return workDate.toDateString() === todayStr;
//       })
//       .sort((a, b) => {
//         const priorityWeight = { high: 1, normal: 2, low: 3 };
//         const aPriority = a.garment?.priority || 'normal';
//         const bPriority = b.garment?.priority || 'normal';
        
//         if (priorityWeight[aPriority] !== priorityWeight[bPriority]) {
//           return priorityWeight[aPriority] - priorityWeight[bPriority];
//         }
        
//         const aTime = new Date(a.estimatedDelivery).getTime();
//         const bTime = new Date(b.estimatedDelivery).getTime();
//         return aTime - bTime;
//       });
//   }, [works]);

//   // Tomorrow's Due Works
//   const tomorrowDueWorks = useMemo(() => {
//     const tomorrow = new Date();
//     tomorrow.setDate(tomorrow.getDate() + 1);
//     const tomorrowStr = tomorrow.toDateString();
    
//     return (works || [])
//       .filter(work => {
//         if (!work.estimatedDelivery) return false;
//         const workDate = new Date(work.estimatedDelivery);
//         return workDate.toDateString() === tomorrowStr;
//       })
//       .sort((a, b) => {
//         const aTime = new Date(a.estimatedDelivery).getTime();
//         const bTime = new Date(b.estimatedDelivery).getTime();
//         return aTime - bTime;
//       });
//   }, [works]);

//   // Priority counts for today
//   const highPriorityToday = useMemo(() => 
//     todayDueWorks.filter(w => w.garment?.priority === 'high').length, 
//   [todayDueWorks]);

//   const normalPriorityToday = useMemo(() => 
//     todayDueWorks.filter(w => w.garment?.priority === 'normal' || !w.garment?.priority).length, 
//   [todayDueWorks]);

//   const lowPriorityToday = useMemo(() => 
//     todayDueWorks.filter(w => w.garment?.priority === 'low').length, 
//   [todayDueWorks]);

//   // Function to get priority display
//   const getPriorityDisplay = (work) => {
//     const priority = work.garment?.priority || 'normal';
//     if (priority === 'high') return '🔴 High';
//     if (priority === 'normal') return '🟠 Normal';
//     return '🟢 Low';
//   };

//   const getPriorityColor = (work) => {
//     const priority = work.garment?.priority || 'normal';
//     if (priority === 'high') return 'border-l-4 border-l-red-600 bg-red-50';
//     if (priority === 'normal') return 'border-l-4 border-l-orange-400 bg-orange-50';
//     return 'border-l-4 border-l-green-600 bg-green-50';
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* ===== MOBILE HEADER ===== */}
//       <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-20">
//         <div className="flex items-center justify-between mb-2">
//           <div className="flex items-center gap-2">
//             <Scissors className="w-5 h-5 text-purple-600" />
//             <h1 className="text-lg font-bold text-gray-800">Work Queue</h1>
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
//             >
//               <Menu size={20} />
//             </button>
//             <button
//               onClick={handleRefresh}
//               disabled={loading}
//               className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
//             >
//               <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu Dropdown */}
//         {mobileMenuOpen && (
//           <div className="absolute top-14 right-4 left-4 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-30">
//             <div className="space-y-2">
//               <p className="text-xs font-medium text-gray-500 px-2">Quick Stats</p>
//               <div className="grid grid-cols-4 gap-1 text-center">
//                 <div className="p-2">
//                   <div className="text-sm font-bold text-purple-600">{stats.totalWork}</div>
//                   <div className="text-[10px] text-gray-500">Total</div>
//                 </div>
//                 <div className="p-2">
//                   <div className="text-sm font-bold text-yellow-600">{stats.pendingWorks}</div>
//                   <div className="text-[10px] text-gray-500">Pending</div>
//                 </div>
//                 <div className="p-2">
//                   <div className="text-sm font-bold text-blue-600">{stats.inProgressWorks}</div>
//                   <div className="text-[10px] text-gray-500">Progress</div>
//                 </div>
//                 <div className="p-2">
//                   <div className="text-sm font-bold text-green-600">{stats.readyWorks}</div>
//                   <div className="text-[10px] text-gray-500">Ready</div>
//                 </div>
//               </div>
//               <div className="border-t border-gray-100 my-1"></div>
//               <p className="text-xs font-medium text-gray-500 px-2">Welcome</p>
//               <p className="text-sm font-medium px-2">{user?.name || "Cutting Master"}</p>
//               <p className="text-xs text-gray-500 px-2 pb-2">
//                 {new Date().toLocaleDateString("en-IN", {
//                   weekday: "long",
//                   day: "numeric",
//                   month: "long",
//                 })}
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Mobile Stats Row */}
//         <div className="grid grid-cols-4 gap-2 mt-1">
//           <div className="text-center">
//             <div className="text-xs font-bold text-purple-600">{stats.totalWork}</div>
//             <div className="text-[10px] text-gray-500">Total</div>
//           </div>
//           <div className="text-center">
//             <div className="text-xs font-bold text-yellow-600">{stats.pendingWorks}</div>
//             <div className="text-[10px] text-gray-500">Pending</div>
//           </div>
//           <div className="text-center">
//             <div className="text-xs font-bold text-blue-600">{stats.inProgressWorks}</div>
//             <div className="text-[10px] text-gray-500">Progress</div>
//           </div>
//           <div className="text-center">
//             <div className="text-xs font-bold text-green-600">{stats.readyWorks}</div>
//             <div className="text-[10px] text-gray-500">Ready</div>
//           </div>
//         </div>

//         {/* Mobile Tab Navigation */}
//         <div className="flex mt-3 border-t border-gray-200 pt-2">
//           <button
//             onClick={() => setMobileTab("queue")}
//             className={`flex-1 py-2 text-sm font-medium ${
//               mobileTab === "queue" 
//                 ? "text-purple-600 border-b-2 border-purple-600" 
//                 : "text-gray-500"
//             }`}
//           >
//             Work Queue
//           </button>
//           <button
//             onClick={() => setMobileTab("today")}
//             className={`flex-1 py-2 text-sm font-medium ${
//               mobileTab === "today" 
//                 ? "text-purple-600 border-b-2 border-purple-600" 
//                 : "text-gray-500"
//             }`}
//           >
//             Today's Focus
//           </button>
//           <button
//             onClick={() => setMobileTab("stats")}
//             className={`flex-1 py-2 text-sm font-medium ${
//               mobileTab === "stats" 
//                 ? "text-purple-600 border-b-2 border-purple-600" 
//                 : "text-gray-500"
//             }`}
//           >
//             Production
//           </button>
//         </div>

//         {/* Mobile View Toggle */}
//         <div className="flex items-center justify-between mt-3">
//           <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
//             <button
//               onClick={() => setMobileView("list")}
//               className={`p-1.5 rounded-md transition ${
//                 mobileView === "list" ? "bg-white text-purple-600 shadow-sm" : "text-gray-500"
//               }`}
//             >
//               <Menu size={16} />
//             </button>
//             <button
//               onClick={() => setMobileView("grid")}
//               className={`p-1.5 rounded-md transition ${
//                 mobileView === "grid" ? "bg-white text-purple-600 shadow-sm" : "text-gray-500"
//               }`}
//             >
//               <Grid size={16} />
//             </button>
//           </div>
//           <button
//             onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
//             className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 rounded-lg text-xs font-medium text-purple-700"
//           >
//             <Filter size={14} />
//             {mobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
//           </button>
//         </div>

//         {/* Mobile Filters */}
//         {mobileFiltersOpen && (
//           <div className="mt-3 p-3 bg-purple-50 rounded-lg space-y-3">
//             <input
//               type="text"
//               value={queueSearch}
//               onChange={(e) => setQueueSearch(e.target.value)}
//               placeholder="Search by ID, name..."
//               className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
//             />
            
//             <select
//               value={queueStatus}
//               onChange={(e) => setQueueStatus(e.target.value)}
//               className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
//             >
//               <option value="all">All Status</option>
//               <option value="pending">Pending</option>
//               <option value="accepted">Accepted</option>
//               <option value="cutting-started">Cutting Started</option>
//               <option value="cutting-completed">Cutting Completed</option>
//               <option value="sewing-started">Sewing Started</option>
//               <option value="sewing-completed">Sewing Completed</option>
//               <option value="ironing">Ironing</option>
//               <option value="ready-to-deliver">Ready to Deliver</option>
//             </select>

//             <select
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//               className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 outline-none"
//             >
//               <option value="priority">Sort by Priority</option>
//               <option value="due">Sort by Due Date</option>
//             </select>

//             <div className="flex gap-2">
//               <button
//                 onClick={() => setSelectedView("all")}
//                 className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
//                   selectedView === "all" 
//                     ? "bg-purple-600 text-white" 
//                     : "bg-white text-gray-600"
//                 }`}
//               >
//                 All
//               </button>
//               <button
//                 onClick={() => setSelectedView("new")}
//                 className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
//                   selectedView === "new" 
//                     ? "bg-yellow-500 text-white" 
//                     : "bg-white text-gray-600"
//                 }`}
//               >
//                 New
//               </button>
//               <button
//                 onClick={() => setSelectedView("need-tailor")}
//                 className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
//                   selectedView === "need-tailor" 
//                     ? "bg-orange-500 text-white" 
//                     : "bg-white text-gray-600"
//                 }`}
//               >
//                 Need Tailor
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ===== DESKTOP HEADER ===== */}
//       <div className="hidden md:block p-6">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
//           <div>
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
//               <Scissors className="w-8 h-8 text-purple-600" />
//               Cutting Master Work Queue
//             </h1>
//             <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
//               <span>Welcome back, {user?.name || "Cutting Master"}! 👋</span>
//               <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
//                 {new Date().toLocaleDateString("en-IN", {
//                   weekday: "long",
//                   day: "numeric",
//                   month: "long",
//                 })}
//               </span>
//             </p>
//           </div>

//           <button
//             onClick={handleRefresh}
//             className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 shadow-sm"
//           >
//             <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
//             Refresh
//           </button>
//         </div>

//         {/* Desktop KPI Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
//           {/* 1. Not Accepted - Pending */}
//           <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-gray-500">
//             <p className="text-xs text-gray-500 mb-1">⏳ Not Accepted</p>
//             <p className="text-2xl font-bold text-gray-800">
//               {stats.pendingWorks}
//             </p>
//             <p className="text-xs text-gray-400 mt-1">Pending</p>
//           </div>

//           {/* 2. Accepted */}
//           <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
//             <p className="text-xs text-gray-500 mb-1">✅ Accepted</p>
//             <p className="text-2xl font-bold text-blue-600">
//               {stats.acceptedWorks}
//             </p>
//             <p className="text-xs text-gray-400 mt-1">Accepted works</p>
//           </div>

//           {/* 3. In Progress */}
//           <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
//             <p className="text-xs text-gray-500 mb-1">⚙️ In Progress</p>
//             <p className="text-2xl font-bold text-purple-600">
//               {stats.inProgressWorks}
//             </p>
//             <p className="text-xs text-gray-400 mt-1">Cutting → Ironing</p>
//           </div>

//           {/* 4. Ready to Deliver */}
//           <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
//             <p className="text-xs text-gray-500 mb-1">📦 Ready to Deliver</p>
//             <p className="text-2xl font-bold text-green-600">
//               {stats.readyWorks}
//             </p>
//             <p className="text-xs text-gray-400 mt-1">Ready for delivery</p>
//           </div>

//           {/* 5. Assigned to Tailor */}
//           <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-indigo-500">
//             <p className="text-xs text-gray-500 mb-1">👔 Assigned to Tailor</p>
//             <p className="text-2xl font-bold text-indigo-600">
//               {stats.assignedCount}
//             </p>
//             <p className="text-xs text-gray-400 mt-1">Tailor assigned</p>
//           </div>

//           {/* 6. Not Assigned (Need Tailor) */}
//           <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-orange-500">
//             <p className="text-xs text-gray-500 mb-1">⚠️ Not Assigned</p>
//             <p className="text-2xl font-bold text-orange-600">
//               {stats.unassignedCount}
//             </p>
//             <p className="text-xs text-gray-400 mt-1">Need tailor</p>
//           </div>

//           {/* 7. Overdue Works */}
//           <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-600">
//             <p className="text-xs text-gray-500 mb-1">🚨 Overdue</p>
//             <p className="text-2xl font-bold text-red-600">
//               {stats.overdueCount}
//             </p>
//             <p className="text-xs text-gray-400 mt-1">Past delivery date</p>
//           </div>

//           {/* 8. Total Works */}
//           <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-cyan-500">
//             <p className="text-xs text-gray-500 mb-1">📊 Total Works</p>
//             <p className="text-2xl font-bold text-cyan-600">{stats.totalWork}</p>
//             <p className="text-xs text-gray-400 mt-1">All works</p>
//           </div>
//         </div>

//         {/* Desktop Status Breakdown */}
//         <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
//             <PieChart size={20} className="text-purple-600" />
//             Production Status Overview
//           </h2>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {statusBreakdown.map((item) => (
//               <div key={item.status} className="relative">
//                 <div className="flex justify-between text-sm mb-1">
//                   <span className="text-gray-600 capitalize">
//                     {item.status.replace(/-/g, " ")}
//                   </span>
//                   <span className="font-bold text-gray-800">{item.count}</span>
//                 </div>
//                 <div className="w-full bg-gray-200 rounded-full h-2">
//                   <div
//                     className={`${item.color} h-2 rounded-full`}
//                     style={{
//                       width:
//                         stats.totalWork > 0
//                           ? `${(item.count / stats.totalWork) * 100}%`
//                           : "0%",
//                     }}
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Desktop Today's Focus & Tomorrow's Prep */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//           {/* Today's Focus */}
//           <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6">
//             <div className="flex items-start justify-between mb-4">
//               <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg">
//                 <Target className="w-6 h-6 text-white" />
//               </div>
              
//               <div className="bg-white/80 backdrop-blur-sm rounded-lg p-2 shadow-sm">
//                 <div className="flex items-center gap-3">
//                   <div className="text-right">
//                     <p className="text-xs text-gray-500">Today</p>
//                     <p className="text-sm font-bold text-gray-800">
//                       {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
//                     </p>
//                   </div>
                  
//                   <div className="w-px h-8 bg-red-200"></div>
                  
//                   <div className="text-center">
//                     <p className="text-xs text-gray-500">Due Today</p>
//                     <p className="text-xl font-bold text-red-600">{todayDueWorks.length}</p>
//                   </div>
                  
//                   <div className="w-px h-8 bg-red-200"></div>
                  
//                   <div className="flex gap-2">
//                     <div className="text-center">
//                       <p className="text-xs text-red-600">🔴</p>
//                       <p className="text-sm font-bold text-gray-800">{highPriorityToday}</p>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-xs text-orange-600">🟠</p>
//                       <p className="text-sm font-bold text-gray-800">{normalPriorityToday}</p>
//                     </div>
//                     <div className="text-center">
//                       <p className="text-xs text-green-600">🟢</p>
//                       <p className="text-sm font-bold text-gray-800">{lowPriorityToday}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <h3 className="text-lg font-bold text-gray-800">Today's Deadline</h3>
//             <p className="text-sm text-red-600 mb-4">
//               {new Date().toLocaleDateString('en-IN', { 
//                 day: 'numeric', 
//                 month: 'long', 
//                 year: 'numeric' 
//               })} - {todayDueWorks.length} items due
//             </p>

//             <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
//               {todayDueWorks.length > 0 ? (
//                 todayDueWorks.map((work) => {
//                   const priorityColor = getPriorityColor(work);
//                   const priorityText = getPriorityDisplay(work);
                  
//                   return (
//                     <div
//                       key={work._id}
//                       onClick={() => navigate(`/cuttingmaster/works/${work._id}`)}
//                       className={`flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer ${priorityColor}`}
//                     >
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2 mb-1">
//                           <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
//                             #{work.workId}
//                           </span>
//                           <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
//                             {work.garment?.garmentId || 'N/A'}
//                           </span>
//                           <span className="text-xs font-medium">
//                             {priorityText}
//                           </span>
//                         </div>
//                         <p className="font-medium text-gray-800">
//                           {work.garment?.name || 'Unknown Garment'}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           👤 {work.order?.customer?.name || 'Unknown'} 
//                           {work.tailor && ` | 👔 Tailor: ${work.tailor.name}`}
//                         </p>
//                         {work.estimatedDelivery && (
//                           <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
//                             <Clock size={12} />
//                             Due by {new Date(work.estimatedDelivery).toLocaleTimeString('en-IN', { 
//                               hour: '2-digit', 
//                               minute: '2-digit' 
//                             })}
//                           </p>
//                         )}
//                       </div>
//                       <ChevronRight size={18} className="text-gray-400" />
//                     </div>
//                   );
//                 })
//               ) : (
//                 <div className="text-center py-8 bg-white/50 rounded-lg">
//                   <CheckCircle size={32} className="text-green-400 mx-auto mb-2" />
//                   <p className="text-sm text-gray-600">No works due today! 🎉</p>
//                   <p className="text-xs text-gray-400 mt-1">All caught up</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Tomorrow's Prep */}
//           <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6">
//             <div className="p-3 bg-blue-500 rounded-lg w-fit mb-4">
//               <Clock className="w-6 h-6 text-white" />
//             </div>

//             <h3 className="text-lg font-bold text-gray-800">Tomorrow's Preparation</h3>
//             <p className="text-sm text-blue-600 mb-4">
//               {new Date(Date.now() + 86400000).toLocaleDateString('en-IN', { 
//                 day: 'numeric', 
//                 month: 'short', 
//                 year: 'numeric' 
//               })} - {tomorrowDueWorks.length} items due
//             </p>

//             <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
//               {tomorrowDueWorks.length > 0 ? (
//                 tomorrowDueWorks.map((work) => (
//                   <div
//                     key={work._id}
//                     onClick={() => navigate(`/cuttingmaster/works/${work._id}`)}
//                     className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 border-blue-400"
//                   >
//                     <div className="flex-1">
//                       <div className="flex items-center gap-2 mb-1">
//                         <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
//                           #{work.workId}
//                         </span>
//                         <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
//                           {work.garment?.garmentId || 'N/A'}
//                         </span>
//                         {work.garment?.priority === 'high' && (
//                           <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
//                             🔴 High
//                           </span>
//                         )}
//                       </div>
//                       <p className="font-medium text-gray-800">
//                         {work.garment?.name || 'Unknown Garment'}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         👤 {work.order?.customer?.name || 'Unknown'}
//                       </p>
//                     </div>
//                     <ChevronRight size={18} className="text-gray-400" />
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8 bg-white/50 rounded-lg">
//                   <p className="text-sm text-gray-600">No items due tomorrow</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ===== MAIN CONTENT ===== */}
//       <div className="p-4 md:p-6 md:pt-0">
//         {/* Mobile Today's Focus Tab */}
//         {mobileTab === "today" && (
//           <div className="md:hidden space-y-4">
//             {/* Today's Focus */}
//             <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-4">
//               <div className="flex items-center justify-between mb-3">
//                 <div className="flex items-center gap-2">
//                   <Target className="w-5 h-5 text-red-600" />
//                   <h3 className="font-bold text-gray-800">Today's Focus</h3>
//                 </div>
//                 <span className="text-sm font-bold text-red-600">{todayDueWorks.length} due</span>
//               </div>

//               <div className="flex gap-2 mb-3">
//                 <div className="flex-1 bg-white/80 rounded-lg p-2 text-center">
//                   <span className="text-xs text-red-600">🔴</span>
//                   <span className="block text-sm font-bold">{highPriorityToday}</span>
//                 </div>
//                 <div className="flex-1 bg-white/80 rounded-lg p-2 text-center">
//                   <span className="text-xs text-orange-600">🟠</span>
//                   <span className="block text-sm font-bold">{normalPriorityToday}</span>
//                 </div>
//                 <div className="flex-1 bg-white/80 rounded-lg p-2 text-center">
//                   <span className="text-xs text-green-600">🟢</span>
//                   <span className="block text-sm font-bold">{lowPriorityToday}</span>
//                 </div>
//               </div>

//               <div className="space-y-2 max-h-[400px] overflow-y-auto">
//                 {todayDueWorks.length > 0 ? (
//                   todayDueWorks.slice(0, 5).map((work) => (
//                     <div
//                       key={work._id}
//                       onClick={() => handleViewWork(work._id)}
//                       className="bg-white rounded-lg p-3 shadow-sm"
//                     >
//                       <div className="flex justify-between mb-1">
//                         <span className="font-mono text-xs font-bold text-purple-600">
//                           #{work.workId}
//                         </span>
//                         <span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusColor(work.status)}`}>
//                           {getStatusBadge(work.status)}
//                         </span>
//                       </div>
//                       <p className="font-medium text-sm">{work.garment?.name}</p>
//                       <p className="text-xs text-gray-500 mt-1">
//                         {work.order?.customer?.name}
//                       </p>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-center py-8 bg-white/50 rounded-lg">
//                     <CheckCircle size={32} className="text-green-400 mx-auto mb-2" />
//                     <p className="text-sm text-gray-600">No works due today!</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Tomorrow's Prep */}
//             <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-4">
//               <div className="flex items-center justify-between mb-3">
//                 <div className="flex items-center gap-2">
//                   <Clock className="w-5 h-5 text-blue-600" />
//                   <h3 className="font-bold text-gray-800">Tomorrow</h3>
//                 </div>
//                 <span className="text-sm font-bold text-blue-600">{tomorrowDueWorks.length} due</span>
//               </div>

//               <div className="space-y-2 max-h-[300px] overflow-y-auto">
//                 {tomorrowDueWorks.length > 0 ? (
//                   tomorrowDueWorks.slice(0, 5).map((work) => (
//                     <div
//                       key={work._id}
//                       onClick={() => handleViewWork(work._id)}
//                       className="bg-white rounded-lg p-3 shadow-sm"
//                     >
//                       <div className="flex justify-between mb-1">
//                         <span className="font-mono text-xs font-bold text-blue-600">
//                           #{work.workId}
//                         </span>
//                         {work.garment?.priority === 'high' && (
//                           <span className="text-[10px] px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
//                             🔴 High
//                           </span>
//                         )}
//                       </div>
//                       <p className="font-medium text-sm">{work.garment?.name}</p>
//                       <p className="text-xs text-gray-500">{work.order?.customer?.name}</p>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-center py-8 bg-white/50 rounded-lg">
//                     <p className="text-sm text-gray-600">No items due tomorrow</p>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Mobile Stats Tab */}
//         {mobileTab === "stats" && (
//           <div className="md:hidden space-y-4">
//             <div className="bg-white rounded-xl p-4">
//               <h3 className="font-bold text-gray-800 mb-3">Production Status</h3>
//               <div className="space-y-3">
//                 {statusBreakdown.map((item) => (
//                   <div key={item.status}>
//                     <div className="flex justify-between text-sm mb-1">
//                       <span className="text-gray-600 capitalize">
//                         {item.status.replace(/-/g, " ")}
//                       </span>
//                       <span className="font-bold">{item.count}</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-1.5">
//                       <div
//                         className={`${item.color} h-1.5 rounded-full`}
//                         style={{
//                           width: stats.totalWork > 0 ? `${(item.count / stats.totalWork) * 100}%` : "0%",
//                         }}
//                       />
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="bg-white rounded-xl p-4">
//               <h3 className="font-bold text-gray-800 mb-3">Quick Stats</h3>
//               <div className="grid grid-cols-2 gap-3">
//                 <div className="bg-purple-50 p-3 rounded-lg text-center">
//                   <div className="text-xs text-purple-600">Assigned</div>
//                   <div className="text-lg font-bold text-purple-700">{stats.assignedCount}</div>
//                 </div>
//                 <div className="bg-orange-50 p-3 rounded-lg text-center">
//                   <div className="text-xs text-orange-600">Need Tailor</div>
//                   <div className="text-lg font-bold text-orange-700">{stats.unassignedCount}</div>
//                 </div>
//                 <div className="bg-red-50 p-3 rounded-lg text-center">
//                   <div className="text-xs text-red-600">Overdue</div>
//                   <div className="text-lg font-bold text-red-700">{stats.overdueCount}</div>
//                 </div>
//                 <div className="bg-green-50 p-3 rounded-lg text-center">
//                   <div className="text-xs text-green-600">Ready</div>
//                   <div className="text-lg font-bold text-green-700">{stats.readyWorks}</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Production Queue - Shows in all views */}
//         {(mobileTab === "queue" || window.innerWidth >= 768) && (
//           <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
//             <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
//               <div className="flex items-center gap-3">
//                 <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                   <Layers className="w-5 h-5 text-purple-600" />
//                   Work Queue
//                 </h2>
//                 <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
//                   {prioritizedQueue.length} items
//                 </span>
//               </div>

//               {/* Desktop Filters */}
//               <div className="hidden md:flex flex-wrap gap-3">
//                 {/* View Filters */}
//                 <div className="flex bg-gray-100 rounded-lg p-1">
//                   <button
//                     onClick={() => setSelectedView("all")}
//                     className={`px-3 py-1.5 text-xs rounded-md transition ${
//                       selectedView === "all"
//                         ? "bg-purple-600 text-white"
//                         : "text-gray-600 hover:bg-gray-200"
//                     }`}
//                   >
//                     All ({stats.totalWork})
//                   </button>
//                   <button
//                     onClick={() => setSelectedView("new")}
//                     className={`px-3 py-1.5 text-xs rounded-md transition flex items-center gap-1 ${
//                       selectedView === "new"
//                         ? "bg-yellow-500 text-white"
//                         : "text-gray-600 hover:bg-gray-200"
//                     }`}
//                   >
//                     <span>🆕 New / Not Accepted</span>
//                     <span
//                       className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
//                         selectedView === "new"
//                           ? "bg-yellow-600 text-white"
//                           : "bg-yellow-100 text-yellow-700"
//                       }`}
//                     >
//                       {stats.pendingWorks}
//                     </span>
//                   </button>
//                   <button
//                     onClick={() => setSelectedView("need-tailor")}
//                     className={`px-3 py-1.5 text-xs rounded-md transition flex items-center gap-1 ${
//                       selectedView === "need-tailor"
//                         ? "bg-orange-500 text-white"
//                         : "text-gray-600 hover:bg-gray-200"
//                     }`}
//                   >
//                     <span>👔 Need Tailor</span>
//                     <span
//                       className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
//                         selectedView === "need-tailor"
//                           ? "bg-orange-600 text-white"
//                           : "bg-orange-100 text-orange-700"
//                       }`}
//                     >
//                       {stats.unassignedCount}
//                     </span>
//                   </button>
//                 </div>

//                 {/* Search */}
//                 <div className="relative">
//                   <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//                   <input
//                     type="text"
//                     value={queueSearch}
//                     onChange={(e) => setQueueSearch(e.target.value)}
//                     placeholder="Search by Work ID, Garment ID or Customer..."
//                     className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 w-64"
//                   />
//                   {queueSearch && (
//                     <button
//                       onClick={() => setQueueSearch("")}
//                       className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                     >
//                       <X size={16} />
//                     </button>
//                   )}
//                 </div>

//                 {/* Status Filter */}
//                 <select
//                   value={queueStatus}
//                   onChange={(e) => setQueueStatus(e.target.value)}
//                   className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
//                 >
//                   <option value="all">🔍 All Status</option>
//                   <option value="pending">⏳ Pending</option>
//                   <option value="accepted">✅ Accepted</option>
//                   <option value="cutting-started">✂️ Cutting Started</option>
//                   <option value="cutting-completed">✔️ Cutting Completed</option>
//                   <option value="sewing-started">🧵 Sewing Started</option>
//                   <option value="sewing-completed">🧵 Sewing Completed</option>
//                   <option value="ironing">🔥 Ironing</option>
//                   <option value="ready-to-deliver">📦 Ready to Deliver</option>
//                 </select>

//                 {/* Sort By */}
//                 <select
//                   value={sortBy}
//                   onChange={(e) => setSortBy(e.target.value)}
//                   className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
//                 >
//                   <option value="priority">Sort by Priority</option>
//                   <option value="due">Sort by Due Date</option>
//                 </select>
//               </div>
//             </div>

//             {/* Queue List */}
//             {loading ? (
//               <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
//               </div>
//             ) : (
//               <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2">
//                 {prioritizedQueue.length > 0 ? (
//                   <>
//                     {/* Mobile Grid View */}
//                     {mobileView === "grid" && window.innerWidth < 768 ? (
//                       <div className="grid grid-cols-2 gap-3">
//                         {prioritizedQueue.map((work) => {
//                           const isHighPriority = work.garment?.priority === "high";
                          
//                           return (
//                             <div
//                               key={work._id}
//                               onClick={() => handleViewWork(work._id)}
//                               className={`border rounded-lg p-3 ${getStatusColor(work.status)} ${
//                                 isHighPriority ? "border-l-4 border-l-red-500" : ""
//                               }`}
//                             >
//                               <div className="flex items-center justify-between mb-2">
//                                 <span className="font-mono text-xs font-bold text-purple-600">
//                                   #{work.workId}
//                                 </span>
//                                 {work.status === "pending" && (
//                                   <button
//                                     onClick={(e) => {
//                                       e.stopPropagation();
//                                       handleAcceptWork(work);
//                                     }}
//                                     disabled={acceptingId === work._id}
//                                     className="px-2 py-1 bg-green-600 text-white text-[10px] rounded-lg"
//                                   >
//                                     Accept
//                                   </button>
//                                 )}
//                               </div>
//                               <p className="font-medium text-sm mb-1 line-clamp-1">{work.garment?.name}</p>
//                               <p className="text-xs text-gray-500 mb-2 line-clamp-1">
//                                 {work.order?.customer?.name}
//                               </p>
//                               <div className="flex items-center justify-between text-[10px]">
//                                 <span className="px-1.5 py-0.5 bg-gray-100 rounded-full">
//                                   {work.garment?.garmentId?.slice(-4)}
//                                 </span>
//                                 {isHighPriority && (
//                                   <span className="text-red-600 font-bold">🔴</span>
//                                 )}
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     ) : (
//                       /* Desktop and Mobile List View */
//                       prioritizedQueue.map((work) => {
//                         const dueStatus = getDueStatus(work.estimatedDelivery);
//                         const isHighPriority = work.garment?.priority === "high";

//                         return (
//                           <div
//                             key={work._id}
//                             className={`border-2 rounded-lg p-3 md:p-4 transition-all hover:shadow-md ${getStatusColor(work.status)} ${
//                               isHighPriority ? "border-l-8 border-l-red-500" : ""
//                             }`}
//                           >
//                             <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
//                               <div className="flex-1">
//                                 {/* Top Row */}
//                                 <div className="flex items-center gap-2 mb-2 flex-wrap">
//                                   <span className="font-mono text-xs md:text-sm font-bold text-purple-600 bg-white px-2 py-1 rounded">
//                                     #{work.workId}
//                                   </span>
//                                   <span
//                                     className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(work.status)}`}
//                                   >
//                                     {getStatusBadge(work.status)}
//                                   </span>
//                                   {isHighPriority && (
//                                     <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full flex items-center gap-1">
//                                       <Flag size={10} /> High Priority
//                                     </span>
//                                   )}
//                                 </div>

//                                 <h3 className="font-bold text-gray-800 text-base md:text-lg mb-1">
//                                   {work.garment?.name || "N/A"}
//                                 </h3>

//                                 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs md:text-sm">
//                                   <div className="flex items-center gap-1">
//                                     <User size={14} className="text-gray-400" />
//                                     <span className="truncate">
//                                       {work.order?.customer?.name || "Unknown"}
//                                     </span>
//                                   </div>

//                                   <div
//                                     className={`flex items-center gap-1 ${dueStatus.color}`}
//                                   >
//                                     {dueStatus.icon}
//                                     <span className="truncate">{dueStatus.label}</span>
//                                   </div>

//                                   <div className="flex items-center gap-1">
//                                     <Package size={14} className="text-purple-500" />
//                                     <span className="text-xs truncate">
//                                       Garment: {work.garment?.garmentId || "N/A"}
//                                     </span>
//                                   </div>

//                                   {work.tailor && (
//                                     <div className="flex items-center gap-1">
//                                       <UserCheck size={14} className="text-green-500" />
//                                       <span className="truncate">Tailor: {work.tailor.name}</span>
//                                     </div>
//                                   )}
//                                 </div>
//                               </div>

//                               {/* Action Buttons */}
//                               {work.status === "pending" ? (
//                                 <button
//                                   onClick={() => handleAcceptWork(work)}
//                                   disabled={acceptingId === work._id}
//                                   className={`w-full md:w-auto px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
//                                     acceptingId === work._id
//                                       ? "bg-gray-400 cursor-not-allowed text-white"
//                                       : "bg-green-600 hover:bg-green-700 text-white"
//                                   }`}
//                                 >
//                                   {acceptingId === work._id ? (
//                                     <>
//                                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                                       Processing...
//                                     </>
//                                   ) : (
//                                     <>
//                                       <CheckCircle size={16} />
//                                       Accept
//                                     </>
//                                   )}
//                                 </button>
//                               ) : work.status === "accepted" && !work.tailor ? (
//                                 <div className="flex gap-2 w-full md:w-auto">
//                                   <button
//                                     onClick={() => handleViewWork(work._id)}
//                                     className="flex-1 md:flex-initial px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition flex items-center justify-center gap-1"
//                                   >
//                                     <Eye size={14} /> View
//                                   </button>
//                                   <button
//                                     onClick={() => handleAssignTailor(work._id)}
//                                     className="flex-1 md:flex-initial px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center justify-center gap-1"
//                                   >
//                                     <UserPlus size={14} /> Assign
//                                   </button>
//                                 </div>
//                               ) : (
//                                 <button
//                                   onClick={() => handleViewWork(work._id)}
//                                   className="w-full md:w-auto px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-1"
//                                 >
//                                   <Eye size={14} /> Details
//                                 </button>
//                               )}
//                             </div>
//                           </div>
//                         );
//                       })
//                     )}
//                   </>
//                 ) : (
//                   <div className="text-center py-12 text-gray-500">
//                     <Scissors className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                     <p className="font-medium">No items in work queue</p>
//                     <p className="text-sm text-gray-400 mt-1">
//                       Try adjusting your filters
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}

//         {/* Pagination */}
//         {pagination?.pages > 1 && (
//           <div className="mt-6 flex items-center justify-center gap-2">
//             <button
//               onClick={() => dispatch(setFilters({ page: pagination.page - 1 }))}
//               disabled={pagination.page === 1}
//               className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
//             >
//               <ChevronLeft size={18} />
//             </button>
//             <span className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg">
//               Page {pagination.page} of {pagination.pages}
//             </span>
//             <button
//               onClick={() => dispatch(setFilters({ page: pagination.page + 1 }))}
//               disabled={pagination.page === pagination.pages}
//               className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
//             >
//               <ChevronRight size={18} />
//             </button>
//           </div>
//         )}
//       </div>

//       {/* Success Modal */}
//       {showSuccessModal && acceptedWork && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl max-w-md w-full p-6 animate-in zoom-in duration-300">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <CheckCircle size={32} className="text-green-600" />
//             </div>

//             <h2 className="text-xl font-bold text-center mb-2">
//               Work Accepted Successfully!
//             </h2>

//             <div className="bg-green-50 p-4 rounded-lg mb-4">
//               <p className="text-sm text-green-700 mb-2">
//                 This work is now assigned to:
//               </p>
//               <p className="font-bold text-lg text-green-800">
//                 {acceptedWork.assignedTo}
//               </p>
//               <p className="text-xs text-green-600 mt-1">
//                 Work ID: {acceptedWork.workId}
//               </p>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-3">
//               <button
//                 onClick={() => {
//                   setShowSuccessModal(false);
//                   navigate(
//                     `/cuttingmaster/works/${acceptedWork._id}?assign=true`,
//                   );
//                 }}
//                 className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
//               >
//                 Assign Tailor Now
//               </button>
//               <button
//                 onClick={() => setShowSuccessModal(false)}
//                 className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
//               >
//                 Later
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }