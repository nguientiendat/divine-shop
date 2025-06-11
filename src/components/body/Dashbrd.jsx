import React, { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  Users,
} from "lucide-react";
import api from "../../api/api";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState("today");
  const [stats, setStats] = useState({
    sales: 0,
    revenue: 0,
    customers: 0,
    salesGrowth: 0,
    revenueGrowth: 0,
    customerGrowth: 0,
  });
  const [chartData, setChartData] = useState([]);

  // API call function - Fixed version
  const fetchOrders = async (fromDate, toDate) => {
    try {
      setLoading(true);
      setError(null); // Reset error state

      // Fixed: Đây là lỗi chính - không nên dùng params nếu không sử dụng
      const response = await api.get("api/orders"); // Thêm await

      console.log("API Response:", response); // Debug log

      // Fixed: Kiểm tra cấu trúc response từ axios
      if (response.status !== 200) {
        throw new Error("Failed to fetch orders");
      }

      const data = response.data; // Axios trả về data trong response.data
      console.log("Orders data:", data);

      // Fixed: Kiểm tra cấu trúc dữ liệu trước khi sử dụng
      const ordersData = data.content || data || [];
      setOrders(ordersData);
      calculateStats(ordersData);
      generateChartData(ordersData);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics from order data - Fixed version
  const calculateStats = (orderData) => {
    if (!orderData || orderData.length === 0) {
      setStats({
        sales: 0,
        revenue: 0,
        customers: 0,
        salesGrowth: 0,
        revenueGrowth: 0,
        customerGrowth: 0,
      });
      return;
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisYear = new Date(now.getFullYear(), 0, 1);

    // Filter orders by date ranges
    const todayOrders = orderData.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= today;
    });

    const yesterdayOrders = orderData.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= yesterday && orderDate < today;
    });

    const thisMonthOrders = orderData.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= thisMonth;
    });

    const lastMonthOrders = orderData.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= lastMonth && orderDate < thisMonth;
    });

    // Calculate metrics based on selected date range
    let currentOrders, previousOrders;
    switch (dateRange) {
      case "today":
        currentOrders = todayOrders;
        previousOrders = yesterdayOrders;
        break;
      case "month":
        currentOrders = thisMonthOrders;
        previousOrders = lastMonthOrders;
        break;
      case "year":
        currentOrders = orderData.filter((order) => {
          const orderDate = new Date(order.orderDate);
          return orderDate >= thisYear;
        });
        previousOrders = []; // Simplified for demo
        break;
      default:
        currentOrders = todayOrders;
        previousOrders = yesterdayOrders;
    }

    const currentSales = currentOrders.length;
    const previousSales = previousOrders.length;

    // Fixed: Kiểm tra field name của finalAmount
    const currentRevenue = currentOrders.reduce((sum, order) => {
      const amount =
        order.finalAmount || order.totalAmount || order.amount || 0;
      return sum + amount;
    }, 0);

    const previousRevenue = previousOrders.reduce((sum, order) => {
      const amount =
        order.finalAmount || order.totalAmount || order.amount || 0;
      return sum + amount;
    }, 0);

    // Fixed: Sử dụng customerId thay vì id để đếm unique customers
    const currentCustomers = new Set(
      currentOrders.map((order) => order.customerId || order.userId || order.id)
    ).size;

    const previousCustomers = new Set(
      previousOrders.map(
        (order) => order.customerId || order.userId || order.id
      )
    ).size;

    const salesGrowth =
      previousSales > 0
        ? ((currentSales - previousSales) / previousSales) * 100
        : currentSales > 0
        ? 100
        : 0;

    const revenueGrowth =
      previousRevenue > 0
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100
        : currentRevenue > 0
        ? 100
        : 0;

    const customerGrowth =
      previousCustomers > 0
        ? ((currentCustomers - previousCustomers) / previousCustomers) * 100
        : currentCustomers > 0
        ? 100
        : 0;

    setStats({
      sales: currentSales,
      revenue: currentRevenue,
      customers: currentCustomers,
      salesGrowth: Math.round(salesGrowth * 10) / 10,
      revenueGrowth: Math.round(revenueGrowth * 10) / 10,
      customerGrowth: Math.round(customerGrowth * 10) / 10,
    });
  };

  // Generate chart data - Fixed version
  const generateChartData = (orderData) => {
    if (!orderData || orderData.length === 0) {
      setChartData([]);
      return;
    }

    const last7Days = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

      const dayOrders = orderData.filter((order) => {
        const orderDate = new Date(order.orderDate);
        return orderDate >= dayStart && orderDate < dayEnd;
      });

      const sales = dayOrders.length;
      const revenue = Math.round(
        dayOrders.reduce((sum, order) => {
          const amount =
            order.finalAmount || order.totalAmount || order.amount || 0;
          return sum + amount;
        }, 0)
      );
      const customers = new Set(
        dayOrders.map((order) => order.customerId || order.userId || order.id)
      ).size;

      last7Days.push({
        date: date.toLocaleDateString("vi-VN", {
          month: "short",
          day: "numeric",
        }),
        fullDate: date.toISOString(),
        sales,
        revenue,
        customers,
      });
    }

    setChartData(last7Days);
  };

  // Handle date range change - Fixed version
  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
    // Đơn giản hóa - chỉ gọi API một lần để lấy tất cả dữ liệu
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Re-calculate stats when dateRange changes
  useEffect(() => {
    if (orders.length > 0) {
      calculateStats(orders);
    }
  }, [dateRange, orders]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const StatCard = ({
    title,
    value,
    growth,
    icon: Icon,
    period,
    isRevenue = false,
  }) => (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="card-title text-muted mb-0">
            {title} <small className="text-muted">| {period}</small>
          </h5>
          <div className="dropdown">
            <button className="btn btn-link text-muted p-0" type="button">
              <svg
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="d-flex align-items-center">
          <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
            <Icon size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="fw-bold text-dark mb-1">
              {isRevenue ? formatCurrency(value) : value.toLocaleString()}
            </h3>
            <div className="d-flex align-items-center">
              {growth >= 0 ? (
                <>
                  <TrendingUp size={16} className="text-success me-1" />
                  <span className="text-success fw-semibold small">
                    {Math.abs(growth)}%
                  </span>
                </>
              ) : (
                <>
                  <TrendingDown size={16} className="text-danger me-1" />
                  <span className="text-danger fw-semibold small">
                    {Math.abs(growth)}%
                  </span>
                </>
              )}
              <span className="text-muted small ms-1">
                {growth >= 0 ? "tăng" : "giảm"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container-fluid bg-light min-vh-100 py-4">
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "300px" }}
        >
          <div className="spinner-border text-primary me-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <span className="text-muted">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid bg-light min-vh-100 py-4">
        <div className="alert alert-danger" role="alert">
          <div className="d-flex">
            <div className="flex-shrink-0">
              <svg
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 20 20"
                className="text-danger"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ms-3">
              <h4 className="alert-heading h6">Lỗi tải dữ liệu</h4>
              <p className="mb-2">{error}</p>
              <button
                onClick={() => fetchOrders()}
                className="btn btn-outline-danger btn-sm"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="display-5 fw-bold text-dark mb-2">Dashboard</h1>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#" className="text-decoration-none">
                Trang chủ
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Dashboard
            </li>
          </ol>
        </nav>
      </div>

      {/* Date Range Selector */}
      <div className="mb-4">
        <div
          className="btn-group"
          role="group"
          aria-label="Date range selector"
        >
          {[
            { key: "today", label: "Hôm nay" },
            { key: "month", label: "Tháng này" },
            { key: "year", label: "Năm này" },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleDateRangeChange(key)}
              className={`btn ${
                dateRange === key ? "btn-primary" : "btn-outline-primary"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-4">
          <StatCard
            title="Doanh số"
            value={stats.sales}
            growth={stats.salesGrowth}
            icon={ShoppingCart}
            period={
              dateRange === "today"
                ? "Hôm nay"
                : dateRange === "month"
                ? "Tháng này"
                : "Năm này"
            }
          />
        </div>
        <div className="col-md-6 col-lg-4">
          <StatCard
            title="Doanh thu"
            value={stats.revenue}
            growth={stats.revenueGrowth}
            icon={DollarSign}
            period={
              dateRange === "today"
                ? "Hôm nay"
                : dateRange === "month"
                ? "Tháng này"
                : "Năm này"
            }
            isRevenue={true}
          />
        </div>
        <div className="col-md-6 col-lg-4">
          <StatCard
            title="Khách hàng"
            value={stats.customers}
            growth={stats.customerGrowth}
            icon={Users}
            period={
              dateRange === "today"
                ? "Hôm nay"
                : dateRange === "month"
                ? "Tháng này"
                : "Năm này"
            }
          />
        </div>
      </div>

      {/* Chart */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="card-title text-muted mb-0">
              Báo cáo <small className="text-muted">/ 7 ngày qua</small>
            </h5>
            <div className="dropdown">
              <button className="btn btn-link text-muted p-0" type="button">
                <svg
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </div>

          <div style={{ height: "400px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0d6efd" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#198754" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#198754" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorCustomers"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#ffc107" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ffc107" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#dee2e6" />
                <XAxis dataKey="date" stroke="#6c757d" fontSize={12} />
                <YAxis stroke="#6c757d" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #dee2e6",
                    borderRadius: "0.375rem",
                    boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
                  }}
                  formatter={(value, name) => {
                    if (name === "revenue") {
                      return [formatCurrency(value), "Doanh thu"];
                    }
                    return [
                      value.toLocaleString(),
                      name === "sales" ? "Doanh số" : "Khách hàng",
                    ];
                  }}
                />
                <Legend
                  formatter={(value) => {
                    switch (value) {
                      case "sales":
                        return "Doanh số";
                      case "revenue":
                        return "Doanh thu";
                      case "customers":
                        return "Khách hàng";
                      default:
                        return value;
                    }
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#0d6efd"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#198754"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Area
                  type="monotone"
                  dataKey="customers"
                  stroke="#ffc107"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCustomers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === "development" && (
        <div className="card mt-4">
          <div className="card-body bg-light">
            <h5 className="card-title">Debug Info:</h5>
            <p className="mb-1">Orders count: {orders.length}</p>
            <p className="mb-1">Chart data points: {chartData.length}</p>
            <pre className="small">{JSON.stringify(stats, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
