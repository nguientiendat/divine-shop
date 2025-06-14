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
  Download,
} from "lucide-react";
import * as XLSX from "xlsx";
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
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [excelLoading, setExcelLoading] = useState(false);

  const formatDateForApi = (date) => {
    return date.toISOString().split("T")[0];
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("api/orders");
      if (response.status !== 200) throw new Error("Failed to fetch orders");
      const ordersData = response.data.content || response.data || [];
      setOrders(ordersData);
      calculateStats(ordersData, "today");
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra khi tải dữ liệu thống kê");
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async (fDate, tDate) => {
    if (!fDate || !tDate) {
      setChartError("Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.");
      return;
    }
    try {
      setChartLoading(true);
      setChartError(null);
      const response = await api.get(
        `/api/dashboard/chart-data?fromDate=${fDate}&toDate=${tDate}`
      );
      if (response.status !== 200)
        throw new Error("Failed to fetch chart data");

      const backendData = response.data;
      if (!backendData || !backendData.series || !backendData.categories) {
        throw new Error("Định dạng dữ liệu từ API không hợp lệ.");
      }

      const salesSeries = backendData.series.find((s) => s.name === "Sales");
      const revenueSeries = backendData.series.find((s) =>
        s.name.startsWith("Revenue")
      );
      const customersSeries = backendData.series.find(
        (s) => s.name === "Customers"
      );

      const transformedData = backendData.categories.map(
        (dateString, index) => {
          const sales = salesSeries ? salesSeries.data[index] : 0;
          const revenue = revenueSeries ? revenueSeries.data[index] * 1000 : 0;
          const customers = customersSeries ? customersSeries.data[index] : 0;
          return {
            date: new Date(dateString).toLocaleDateString("vi-VN", {
              month: "short",
              day: "numeric",
            }),
            sales,
            revenue,
            customers,
          };
        }
      );

      setChartData(transformedData);
    } catch (err) {
      setChartError(err.message || "Có lỗi xảy ra khi tải dữ liệu biểu đồ");
    } finally {
      setChartLoading(false);
    }
  };

  const exportToExcel = async () => {
    try {
      setExcelLoading(true);

      if (!fromDate || !toDate) {
        alert("Vui lòng chọn khoảng thời gian");
        return;
      }

      // Lọc orders theo khoảng thời gian đã chọn
      const filteredOrders = orders.filter((order) => {
        const orderDate = new Date(order.orderDate);
        const from = new Date(fromDate);
        const to = new Date(toDate);
        return orderDate >= from && orderDate <= to;
      });

      console.log("Filtered orders:", filteredOrders);

      // Tạo dữ liệu Excel
      const excelData = [];

      // Header thông tin tổng quan
      excelData.push({
        Mục: "BÁO CÁO DOANH THU",
        "Giá trị": "",
        "Ghi chú": `Từ ${fromDate} đến ${toDate}`,
      });

      excelData.push({
        Mục: "Tổng doanh số",
        "Giá trị": stats.sales,
        "Ghi chú": "đơn hàng",
      });

      excelData.push({
        Mục: "Tổng doanh thu",
        "Giá trị": stats.revenue,
        "Ghi chú": "VND",
      });

      excelData.push({
        Mục: "Tổng khách hàng",
        "Giá trị": stats.customers,
        "Ghi chú": "khách hàng",
      });

      excelData.push({});

      // Chi tiết từng đơn hàng
      excelData.push({
        Mục: "CHI TIẾT ĐơN HÀNG",
        "Giá trị": "",
        "Ghi chú": "",
      });

      // Header cho chi tiết đơn hàng
      excelData.push({
        "Mã đơn hàng": "Mã đơn hàng",
        "Ngày đặt": "Ngày đặt",
        "Tổng tiền": "Tổng tiền (VND)",
      });

      // Thêm chi tiết từng đơn hàng
      filteredOrders.forEach((order) => {
        excelData.push({
          "Mã đơn hàng": order.id || order.orderId || "N/A",
          "Ngày đặt": new Date(order.orderDate).toLocaleDateString("vi-VN"),
          "Tổng tiền": order.finalAmount || order.totalAmount || 0,
        });
      });

      excelData.push({});

      // Thống kê theo ngày từ chartData
      if (chartData && chartData.length > 0) {
        excelData.push({
          Ngày: "THỐNG KÊ THEO NGÀY",
          "Doanh số": "",
          "Doanh thu": "",
          "Khách hàng": "",
        });

        excelData.push({
          Ngày: "Ngày",
          "Doanh số": "Doanh số",
          "Doanh thu": "Doanh thu (VND)",
          "Khách hàng": "Khách hàng",
        });

        chartData.forEach((item) => {
          excelData.push({
            Ngày: item.date,
            "Doanh số": item.sales,
            "Doanh thu": item.revenue,
            "Khách hàng": item.customers,
          });
        });
      }

      // Tạo workbook và worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(excelData);

      const colWidths = [
        { wch: 20 }, // Cột 1
        { wch: 15 }, // Cột 2
        { wch: 20 }, // Cột 3
        { wch: 15 }, // Cột 4
        { wch: 15 }, // Cột 5
      ];
      ws["!cols"] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, "Báo cáo doanh thu");

      const fileName = `bao_cao_doanh_thu_${fromDate.replace(
        /-/g,
        ""
      )}_${toDate.replace(/-/g, "")}.xlsx`;

      // Xuất file
      XLSX.writeFile(wb, fileName);

      console.log("Excel file exported successfully:", fileName);
    } catch (err) {
      console.error("Export error:", err);
      alert(`Lỗi xuất file Excel: ${err.message}`);
    } finally {
      setExcelLoading(false);
    }
  };

  useEffect(() => {
    const todayStr = formatDateForApi(new Date());
    setFromDate(todayStr);
    setToDate(todayStr);

    fetchOrders();
    fetchChartData(todayStr, todayStr);
  }, []);

  const handleDateRangeChange = (newRange) => {
    const now = new Date();
    let fromDateObj;
    const toDateObj = new Date();

    switch (newRange) {
      case "month":
        fromDateObj = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "year":
        fromDateObj = new Date(now.getFullYear(), 0, 1);
        break;
      case "today":
      default:
        fromDateObj = new Date();
        break;
    }

    const fromDateStr = formatDateForApi(fromDateObj);
    const toDateStr = formatDateForApi(toDateObj);

    setDateRange(newRange);

    setFromDate(fromDateStr);
    setToDate(toDateStr);

    calculateStats(orders, newRange, fromDateStr, toDateStr);

    fetchChartData(fromDateStr, toDateStr);
  };

  const handleDateFilter = () => {
    setDateRange("custom");

    calculateStats(orders, "custom", fromDate, toDate);

    fetchChartData(fromDate, toDate);
  };

  const calculateStats = (
    orderData,
    currentRange,
    customFromDate = null,
    customToDate = null
  ) => {
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
    let currentFromDate, currentToDate, previousFromDate, previousToDate;

    if (currentRange === "custom" && customFromDate && customToDate) {
      currentFromDate = new Date(customFromDate);
      currentToDate = new Date(customToDate);
      currentToDate.setHours(23, 59, 59, 999);

      const daysDiff = Math.ceil(
        (currentToDate - currentFromDate) / (1000 * 60 * 60 * 24)
      );
      previousToDate = new Date(currentFromDate);
      previousToDate.setDate(previousToDate.getDate() - 1);
      previousFromDate = new Date(previousToDate);
      previousFromDate.setDate(previousFromDate.getDate() - daysDiff + 1);
    } else {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const thisYear = new Date(now.getFullYear(), 0, 1);
      const lastYear = new Date(now.getFullYear() - 1, 0, 1);

      switch (currentRange) {
        case "month":
          currentFromDate = thisMonth;
          currentToDate = now;
          previousFromDate = lastMonth;
          previousToDate = new Date(thisMonth.getTime() - 1);
          break;
        case "year":
          currentFromDate = thisYear;
          currentToDate = now;
          previousFromDate = lastYear;
          previousToDate = new Date(thisYear.getTime() - 1);
          break;
        case "today":
        default:
          currentFromDate = today;
          currentToDate = now;
          previousFromDate = yesterday;
          previousToDate = today;
          break;
      }
    }

    const currentOrders = orderData.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= currentFromDate && orderDate <= currentToDate;
    });

    const previousOrders = orderData.filter((order) => {
      const orderDate = new Date(order.orderDate);
      return orderDate >= previousFromDate && orderDate <= previousToDate;
    });

    // Calculate metrics
    const currentRevenue = currentOrders.reduce(
      (sum, order) => sum + (order.finalAmount || 0),
      0
    );
    const previousRevenue = previousOrders.reduce(
      (sum, order) => sum + (order.finalAmount || 0),
      0
    );
    const currentCustomers = new Set(
      currentOrders.map((o) => o.customerId || o.userId)
    ).size;
    const previousCustomers = new Set(
      previousOrders.map((o) => o.customerId || o.userId)
    ).size;

    const calculateGrowth = (current, previous) => {
      if (previous > 0) return ((current - previous) / previous) * 100;
      return current > 0 ? 100 : 0;
    };

    setStats({
      sales: currentOrders.length,
      revenue: currentRevenue,
      customers: currentCustomers,
      salesGrowth:
        Math.round(
          calculateGrowth(currentOrders.length, previousOrders.length) * 10
        ) / 10,
      revenueGrowth:
        Math.round(calculateGrowth(currentRevenue, previousRevenue) * 10) / 10,
      customerGrowth:
        Math.round(calculateGrowth(currentCustomers, previousCustomers) * 10) /
        10,
    });
  };

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
  }) => {
    const periodText =
      {
        today: "Hôm nay",
        month: "Tháng này",
        year: "Năm này",
        custom: "Tùy chỉnh",
      }[period] || "Hôm nay";

    return (
      <div className="card h-100 shadow-sm">
        <div className="card-body">
          <h5 className="card-title text-muted mb-3">
            {title} <small className="text-muted">| {periodText}</small>
          </h5>
          <div className="d-flex align-items-center">
            <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
              <Icon size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="fw-bold text-dark mb-1">
                {isRevenue ? formatCurrency(value) : value.toLocaleString()}
              </h3>
              {period !== "custom" && (
                <div className="d-flex align-items-center">
                  {growth >= 0 ? (
                    <TrendingUp size={16} className="text-success me-1" />
                  ) : (
                    <TrendingDown size={16} className="text-danger me-1" />
                  )}
                  <span
                    className={`fw-semibold small ${
                      growth >= 0 ? "text-success" : "text-danger"
                    }`}
                  >
                    {Math.abs(growth)}%
                  </span>
                  <span className="text-muted small ms-1">
                    {growth >= 0 ? "tăng" : "giảm"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container-fluid bg-light min-vh-100 py-4 d-flex justify-content-center align-items-center">
        ...Loading
      </div>
    );
  }
  if (error) {
    return (
      <div className="container-fluid bg-light min-vh-100 py-4">
        <div className="alert alert-danger">Lỗi: {error}</div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="mb-4">
        <h1 className="display-5 fw-bold text-dark mb-2">Dashboard</h1>
      </div>

      <div className="mb-4">
        <div className="btn-group" role="group">
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

      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-4">
          <StatCard
            title="Doanh số"
            value={stats.sales}
            growth={stats.salesGrowth}
            icon={ShoppingCart}
            period={dateRange}
          />
        </div>
        <div className="col-md-6 col-lg-4">
          <StatCard
            title="Doanh thu"
            value={stats.revenue}
            growth={stats.revenueGrowth}
            icon={DollarSign}
            period={dateRange}
            isRevenue={true}
          />
        </div>
        <div className="col-md-6 col-lg-4">
          <StatCard
            title="Khách hàng"
            value={stats.customers}
            growth={stats.customerGrowth}
            icon={Users}
            period={dateRange}
          />
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4">
            <h5 className="card-title text-muted mb-2 mb-md-0">
              Báo cáo doanh thu
            </h5>
            <div className="d-flex align-items-center gap-2">
              <div className="form-floating">
                <input
                  type="date"
                  className="form-control"
                  id="fromDate"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
                <label htmlFor="fromDate">Từ ngày</label>
              </div>
              <div className="form-floating">
                <input
                  type="date"
                  className="form-control"
                  id="toDate"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
                <label htmlFor="toDate">Đến ngày</label>
              </div>
              <button
                className="btn btn-primary align-self-stretch"
                onClick={handleDateFilter}
                disabled={chartLoading}
              >
                {chartLoading ? "..." : "Lọc"}
              </button>
              <button
                className="btn btn-success align-self-stretch"
                onClick={exportToExcel}
                disabled={excelLoading || !fromDate || !toDate}
                title="Xuất file Excel"
              >
                {excelLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Đang xuất...
                  </>
                ) : (
                  <>
                    <Download size={16} className="me-2" />
                    Xuất Excel
                  </>
                )}
              </button>
            </div>
          </div>

          <div style={{ height: "400px" }}>
            {chartLoading ? (
              <div className="d-flex justify-content-center align-items-center h-100">
                ...Loading Chart
              </div>
            ) : chartError ? (
              <div className="d-flex justify-content-center align-items-center h-100">
                <div className="alert alert-warning w-100 text-center">
                  Lỗi: {chartError}.{" "}
                  <button
                    onClick={handleDateFilter}
                    className="btn btn-sm btn-warning"
                  >
                    Thử lại
                  </button>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d6efd" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0d6efd" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
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
                  <YAxis
                    stroke="#6c757d"
                    fontSize={12}
                    tickFormatter={(value) =>
                      new Intl.NumberFormat("vi-VN").format(value)
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #dee2e6",
                      borderRadius: "0.375rem",
                    }}
                    formatter={(value, name) => {
                      if (name === "revenue")
                        return [formatCurrency(value), "Doanh thu"];
                      return [
                        value.toLocaleString(),
                        name === "sales" ? "Doanh số" : "Khách hàng",
                      ];
                    }}
                  />
                  <Legend
                    formatter={(value) =>
                      ({
                        sales: "Doanh số",
                        revenue: "Doanh thu",
                        customers: "Khách hàng",
                      }[value] || value)
                    }
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#0d6efd"
                    strokeWidth={2}
                    fill="url(#colorSales)"
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#198754"
                    strokeWidth={2}
                    fill="url(#colorRevenue)"
                  />
                  <Area
                    type="monotone"
                    dataKey="customers"
                    stroke="#ffc107"
                    strokeWidth={2}
                    fill="url(#colorCustomers)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
