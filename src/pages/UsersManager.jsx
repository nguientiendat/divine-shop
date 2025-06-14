import React, { useState, useEffect } from "react";
import {
  Search,
  Users,
  Shield,
  ShieldCheck,
  Clock,
  Mail,
  Phone,
  Calendar,
  Lock,
  Unlock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import api from "../api/api";
import { useSelector } from "react-redux";

const UsersManage = () => {
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [actionLoading, setActionLoading] = useState({});
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get("/users");

        if (response.status === 200) {
          setUsers(response.data.result);
        } else {
          setError(
            response.data.message ||
              "Có lỗi xảy ra khi tải danh sách người dùng"
          );
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi tải danh sách người dùng");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Hiển thị thông báo
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Filter users based on search term, role, and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);

    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && user.active) ||
      (statusFilter === "INACTIVE" && !user.active);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleIcon = (role) => {
    return role === "ADMIN" ? (
      <ShieldCheck size={16} className="text-danger" />
    ) : (
      <Shield size={16} className="text-primary" />
    );
  };

  const getStatusBadge = (active) => {
    return active ? (
      <span className="badge bg-success">Hoạt động</span>
    ) : (
      <span className="badge bg-danger">Không hoạt động</span>
    );
  };

  // Function to toggle user account status with correct API endpoints
  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      setActionLoading((prev) => ({ ...prev, [userId]: true }));

      let response;
      if (currentStatus) {
        // Nếu đang active, gọi DELETE để khóa
        response = await api.delete(`/users/${userId}`);
      } else {
        // Nếu đang inactive, gọi PATCH để khôi phục
        response = await api.patch(`/users/${userId}`);
      }

      if (response.status === 200) {
        // Update user status trong local state
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId ? { ...user, active: !currentStatus } : user
          )
        );

        // Hiển thị thông báo thành công
        const message = currentStatus
          ? "Tài khoản đã bị khóa"
          : "Tài khoản đã được khôi phục";
        showNotification(message, "success");
      } else {
        throw new Error(response.data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error toggling user status:", error);

      // Hiển thị thông báo lỗi
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi thay đổi trạng thái tài khoản";
      showNotification(errorMessage, "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Đang tải danh sách người dùng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="alert alert-danger" role="alert">
          <AlertTriangle size={20} className="me-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid bg-light min-vh-100 py-4">
      <div className="container">
        {/* Notification */}
        {notification && (
          <div
            className={`alert alert-${
              notification.type === "success" ? "success" : "danger"
            } alert-dismissible fade show`}
            role="alert"
          >
            {notification.type === "success" ? (
              <CheckCircle size={20} className="me-2" />
            ) : (
              <XCircle size={20} className="me-2" />
            )}
            {notification.message}
            <button
              type="button"
              className="btn-close"
              onClick={() => setNotification(null)}
              aria-label="Close"
            ></button>
          </div>
        )}

        {/* Header */}
        <div className="mb-4">
          <div className="d-flex align-items-center mb-3">
            <Users size={32} className="text-primary me-3" />
            <h1 className="h2 mb-0">Quản lý người dùng</h1>
          </div>
          <p className="text-muted">
            Quản lý và theo dõi thông tin người dùng trong hệ thống
          </p>
        </div>

        {/* Search and Filters */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              {/* Search */}
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text">
                    <Search size={18} />
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Role Filter */}
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="ALL">Tất cả vai trò</option>
                  <option value="ADMIN">Admin</option>
                  <option value="USER">User</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">Tất cả trạng thái</option>
                  <option value="ACTIVE">Hoạt động</option>
                  <option value="INACTIVE">Không hoạt động</option>
                </select>
              </div>
            </div>

            {/* Results count */}
            <div className="mt-3">
              <small className="text-muted">
                Hiển thị {filteredUsers.length} / {users.length} người dùng
              </small>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <Users size={32} className="text-primary" />
                  </div>
                  <div>
                    <p className="card-text text-muted mb-1">Tổng người dùng</p>
                    <h4 className="card-title mb-0">{users.length}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <ShieldCheck size={32} className="text-danger" />
                  </div>
                  <div>
                    <p className="card-text text-muted mb-1">Admin</p>
                    <h4 className="card-title mb-0">
                      {users.filter((u) => u.role === "ADMIN").length}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center">
                  <div className="me-3">
                    <Clock size={32} className="text-success" />
                  </div>
                  <div>
                    <p className="card-text text-muted mb-1">Đang hoạt động</p>
                    <h4 className="card-title mb-0">
                      {users.filter((u) => u.active).length}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card">
          <div className="card-body">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-5">
                <Users size={48} className="text-muted mb-3" />
                <h5 className="text-muted">Không tìm thấy người dùng</h5>
                <p className="text-muted">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Người dùng</th>
                      <th>Liên hệ</th>
                      <th>Vai trò</th>
                      <th>Trạng thái</th>
                      <th>Ngày tạo</th>
                      <th width="140">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => {
                      if (currentUser && user.id === currentUser.user_id)
                        return;
                      else {
                        return (
                          <tr key={user.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div
                                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    background:
                                      "linear-gradient(45deg, #007bff, #6f42c1)",
                                    color: "white",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div className="fw-semibold">
                                    {user.username}
                                  </div>
                                  <small className="text-muted">
                                    ID: {user.id.split("-")[0]}...
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div>
                                <div className="d-flex align-items-center mb-1">
                                  <Mail size={14} className="text-muted me-2" />
                                  <small>{user.email}</small>
                                </div>
                                <div className="d-flex align-items-center">
                                  <Phone
                                    size={14}
                                    className="text-muted me-2"
                                  />
                                  <small>{user.phone}</small>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                {getRoleIcon(user.role)}
                                <span
                                  className={`ms-2 fw-semibold ${
                                    user.role === "ADMIN"
                                      ? "text-danger"
                                      : "text-primary"
                                  }`}
                                >
                                  {user.role}
                                </span>
                              </div>
                            </td>
                            <td>{getStatusBadge(user.active)}</td>
                            <td>
                              <div className="d-flex align-items-center">
                                <Calendar
                                  size={14}
                                  className="text-muted me-2"
                                />
                                <small>{formatDate(user.createdAt)}</small>
                              </div>
                            </td>
                            <td>
                              <button
                                className={`btn btn-sm ${
                                  user.active
                                    ? "btn-outline-danger"
                                    : "btn-outline-success"
                                }`}
                                onClick={() =>
                                  handleToggleUserStatus(user.id, user.active)
                                }
                                disabled={actionLoading[user.id]}
                                title={
                                  user.active
                                    ? "Khóa tài khoản"
                                    : "Khôi phục tài khoản"
                                }
                              >
                                {actionLoading[user.id] ? (
                                  <div
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                  >
                                    <span className="visually-hidden">
                                      Loading...
                                    </span>
                                  </div>
                                ) : user.active ? (
                                  <>
                                    <Lock size={14} className="me-1" />
                                    Khóa
                                  </>
                                ) : (
                                  <>
                                    <Unlock size={14} className="me-1" />
                                    Khôi phục
                                  </>
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      }
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersManage;
