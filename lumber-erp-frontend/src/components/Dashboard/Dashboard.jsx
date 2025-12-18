import React, { useState, useEffect } from 'react';
import { 
  Users, Package, TrendingUp, TrendingDown, DollarSign, 
  Truck, ShoppingCart, AlertCircle, CheckCircle, Clock,
  BarChart3, FileText, Boxes, Sprout, Award
} from 'lucide-react';
import {
  usersAPI, employeesAPI, stockItemsAPI, salesOrdersAPI,
  purchaseOrdersAPI, shipmentsAPI, invoicesAPI, paymentsAPI,
  customersAPI, suppliersAPI, trucksAPI, driversAPI,
  forestsAPI, harvestBatchesAPI, warehousesAPI, productTypesAPI
} from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    // Overview
    totalEmployees: 0,
    activeEmployees: 0,
    totalCustomers: 0,
    totalSuppliers: 0,
    
    // Inventory
    totalProducts: 0,
    lowStockItems: 0,
    totalWarehouses: 0,
    stockValue: 0,
    
    // Sales & Orders
    totalSalesOrders: 0,
    pendingSalesOrders: 0,
    totalPurchaseOrders: 0,
    pendingPurchaseOrders: 0,
    
    // Financial
    totalInvoices: 0,
    unpaidInvoices: 0,
    totalRevenue: 0,
    totalPayments: 0,
    
    // Transportation
    totalTrucks: 0,
    activeTrucks: 0,
    totalDrivers: 0,
    activeDrivers: 0,
    totalShipments: 0,
    inTransitShipments: 0,
    
    // Forest & Harvest
    totalForests: 0,
    totalHarvestBatches: 0,
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [
        employeesRes, customersRes, suppliersRes,
        stockRes, warehousesRes, productTypesRes,
        salesOrdersRes, purchaseOrdersRes,
        invoicesRes, paymentsRes,
        trucksRes, driversRes, shipmentsRes,
        forestsRes, harvestBatchesRes
      ] = await Promise.all([
        employeesAPI.getAll(),
        customersAPI.getAll(),
        suppliersAPI.getAll(),
        stockItemsAPI.getAll(),
        warehousesAPI.getAll(),
        productTypesAPI.getAll(),
        salesOrdersAPI.getAll(),
        purchaseOrdersAPI.getAll(),
        invoicesAPI.getAll(),
        paymentsAPI.getAll(),
        trucksAPI.getAll(),
        driversAPI.getAll(),
        shipmentsAPI.getAll(),
        forestsAPI.getAll(),
        harvestBatchesAPI.getAll(),
      ]);

      const employees = employeesRes.data || [];
      const customers = customersRes.data || [];
      const suppliers = suppliersRes.data || [];
      const stock = stockRes.data || [];
      const warehouses = warehousesRes.data || [];
      const productTypes = productTypesRes.data || [];
      const salesOrders = salesOrdersRes.data || [];
      const purchaseOrders = purchaseOrdersRes.data || [];
      const invoices = invoicesRes.data || [];
      const payments = paymentsRes.data || [];
      const trucks = trucksRes.data || [];
      const drivers = driversRes.data || [];
      const shipments = shipmentsRes.data || [];
      const forests = forestsRes.data || [];
      const harvestBatches = harvestBatchesRes.data || [];

      // Debug: Check what fields are available
      console.log('Stock Items Sample:', stock[0]);
      console.log('Invoices Sample:', invoices[0]);
      console.log('Payments Sample:', payments[0]);

      // Calculate stock value with error handling
      const stockValue = stock.reduce((sum, item) => {
        const quantity = parseFloat(item.quantity || item.stock_quantity || item.qty || 0);
        const unitPrice = parseFloat(item.unit_price || item.price || item.unitPrice || 0);
        return sum + (quantity * unitPrice);
      }, 0);
      
      // Calculate total revenue from invoices with error handling
      const totalRevenue = invoices.reduce((sum, inv) => {
        const amount = parseFloat(inv.total_amount || inv.amount || inv.totalAmount || 0);
        return sum + amount;
      }, 0);
      
      // Calculate total payments with error handling
      const totalPayments = payments.reduce((sum, pay) => {
        const amount = parseFloat(pay.amount || pay.payment_amount || pay.paymentAmount || 0);
        return sum + amount;
      }, 0);

      // Count low stock items with safe comparison
      const lowStockItems = stock.filter(s => {
        const qty = parseFloat(s.quantity || s.stock_quantity || s.qty || 0);
        return qty < 100;
      }).length;

      setStats({
        totalEmployees: employees.length,
        activeEmployees: employees.filter(e => e.employment_status === 'Active').length,
        totalCustomers: customers.length,
        totalSuppliers: suppliers.length,
        
        totalProducts: productTypes.length,
        lowStockItems: lowStockItems,
        totalWarehouses: warehouses.length,
        stockValue: stockValue,
        
        totalSalesOrders: salesOrders.length,
        pendingSalesOrders: salesOrders.filter(so => so.status === 'Pending').length,
        totalPurchaseOrders: purchaseOrders.length,
        pendingPurchaseOrders: purchaseOrders.filter(po => po.status === 'Pending').length,
        
        totalInvoices: invoices.length,
        unpaidInvoices: invoices.filter(inv => inv.status === 'Unpaid').length,
        totalRevenue: totalRevenue,
        totalPayments: totalPayments,
        
        totalTrucks: trucks.length,
        activeTrucks: trucks.filter(t => t.status === 'Available' || t.status === 'In Use').length,
        totalDrivers: drivers.length,
        activeDrivers: drivers.filter(d => d.status === 'Active').length,
        totalShipments: shipments.length,
        inTransitShipments: shipments.filter(s => s.status === 'In Transit').length,
        
        totalForests: forests.length,
        totalHarvestBatches: harvestBatches.length,
      });

      // Generate alerts with safe checking
      const newAlerts = [];
      if (lowStockItems > 0) {
        newAlerts.push({
          type: 'warning',
          message: `${lowStockItems} items are low in stock`,
          icon: AlertCircle
        });
      }
      if (invoices.filter(inv => inv.status === 'Unpaid').length > 0) {
        newAlerts.push({
          type: 'warning',
          message: `${invoices.filter(inv => inv.status === 'Unpaid').length} unpaid invoices`,
          icon: FileText
        });
      }
      if (shipments.filter(s => s.status === 'In Transit').length > 0) {
        newAlerts.push({
          type: 'info',
          message: `${shipments.filter(s => s.status === 'In Transit').length} shipments in transit`,
          icon: Truck
        });
      }
      setAlerts(newAlerts);

      // Generate recent activities with safe checking
      const activities = [];
      
      // Recent sales orders
      if (salesOrders.length > 0) {
        salesOrders.slice(0, 3).forEach(so => {
          activities.push({
            type: 'sales',
            title: `New sales order #${so.soid}`,
            time: getTimeAgo(so.order_date),
            icon: ShoppingCart,
            color: 'success'
          });
        });
      }
      
      // Recent shipments
      if (shipments.length > 0) {
        shipments.slice(0, 2).forEach(ship => {
          activities.push({
            type: 'shipment',
            title: `Shipment #${ship.shipment_id} - ${ship.status}`,
            time: getTimeAgo(ship.shipment_date),
            icon: Truck,
            color: 'info'
          });
        });
      }

      setRecentActivities(activities.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Set default values on error
      setStats({
        totalEmployees: 0,
        activeEmployees: 0,
        totalCustomers: 0,
        totalSuppliers: 0,
        totalProducts: 0,
        lowStockItems: 0,
        totalWarehouses: 0,
        stockValue: 0,
        totalSalesOrders: 0,
        pendingSalesOrders: 0,
        totalPurchaseOrders: 0,
        pendingPurchaseOrders: 0,
        totalInvoices: 0,
        unpaidInvoices: 0,
        totalRevenue: 0,
        totalPayments: 0,
        totalTrucks: 0,
        activeTrucks: 0,
        totalDrivers: 0,
        activeDrivers: 0,
        totalShipments: 0,
        inTransitShipments: 0,
        totalForests: 0,
        totalHarvestBatches: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Unknown';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 60) return `${diffMins} min ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      return `${diffDays} days ago`;
    } catch (error) {
      return 'Unknown';
    }
  };

  const formatCurrency = (amount) => {
    // Handle NaN, null, undefined
    const validAmount = isNaN(amount) || amount === null || amount === undefined ? 0 : amount;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(validAmount);
  };

  const mainStats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'success',
      trend: '+15.3%',
      trendUp: true,
    },
    {
      title: 'Stock Value',
      value: formatCurrency(stats.stockValue),
      icon: Boxes,
      color: 'brown',
      trend: '+8.2%',
      trendUp: true,
    },
    {
      title: 'Active Shipments',
      value: stats.inTransitShipments,
      icon: Truck,
      color: 'info',
      trend: `${stats.totalShipments} total`,
      trendUp: null,
    },
    {
      title: 'Pending Orders',
      value: stats.pendingSalesOrders + stats.pendingPurchaseOrders,
      icon: Clock,
      color: 'warning',
      trend: `${stats.totalSalesOrders + stats.totalPurchaseOrders} total`,
      trendUp: null,
    },
  ];

  const secondaryStats = [
    { label: 'Employees', value: stats.totalEmployees, active: stats.activeEmployees, icon: Users },
    { label: 'Customers', value: stats.totalCustomers, icon: Users },
    { label: 'Suppliers', value: stats.totalSuppliers, icon: Package },
    { label: 'Products', value: stats.totalProducts, icon: Boxes },
    { label: 'Warehouses', value: stats.totalWarehouses, icon: Package },
    { label: 'Trucks', value: stats.totalTrucks, active: stats.activeTrucks, icon: Truck },
    { label: 'Drivers', value: stats.totalDrivers, active: stats.activeDrivers, icon: Users },
    { label: 'Forests', value: stats.totalForests, icon: Sprout },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's your lumber management overview.</p>
        </div>
        <div className="dashboard-date">
          <Clock size={16} />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="alerts-container">
          {alerts.map((alert, index) => (
            <div key={index} className={`alert alert-${alert.type}`}>
              <alert.icon size={20} />
              <span>{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Main Stats */}
      <div className="stats-grid">
        {mainStats.map((stat, index) => (
          <div key={index} className={`stat-card stat-${stat.color}`}>
            <div className="stat-icon-wrapper">
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">{stat.title}</p>
              <h3 className="stat-value">{stat.value}</h3>
              <span className={`stat-trend ${stat.trendUp === true ? 'trend-up' : stat.trendUp === false ? 'trend-down' : ''}`}>
                {stat.trendUp === true && <TrendingUp size={14} />}
                {stat.trendUp === false && <TrendingDown size={14} />}
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Stats Grid */}
      <div className="secondary-stats-grid">
        {secondaryStats.map((stat, index) => (
          <div key={index} className="secondary-stat-card">
            <div className="secondary-stat-icon">
              <stat.icon size={20} />
            </div>
            <div className="secondary-stat-content">
              <p className="secondary-stat-label">{stat.label}</p>
              <p className="secondary-stat-value">
                {stat.value}
                {stat.active !== undefined && (
                  <span className="secondary-stat-active"> ({stat.active} active)</span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Activities Grid */}
      <div className="dashboard-grid">
        {/* Recent Activity */}
        <div className="card chart-card">
          <h3 className="card-title">
            <BarChart3 size={20} />
            Recent Activity
          </h3>
          <div className="activity-list">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <div className={`activity-icon ${activity.color}`}>
                    <activity.icon size={16} />
                  </div>
                  <div className="activity-content">
                    <p className="activity-title">{activity.title}</p>
                    <p className="activity-time">{activity.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No recent activities</p>
            )}
          </div>
        </div>

        {/* Order Status Overview */}
        <div className="card">
          <h3 className="card-title">
            <ShoppingCart size={20} />
            Order Status Overview
          </h3>
          <div className="order-stats">
            <div className="order-stat-item">
              <div className="order-stat-header">
                <span className="order-stat-label">Sales Orders</span>
                <span className="order-stat-total">{stats.totalSalesOrders}</span>
              </div>
              <div className="order-stat-breakdown">
                <span className="order-stat-chip pending">{stats.pendingSalesOrders} Pending</span>
                <span className="order-stat-chip completed">{stats.totalSalesOrders - stats.pendingSalesOrders} Completed</span>
              </div>
            </div>
            <div className="order-stat-item">
              <div className="order-stat-header">
                <span className="order-stat-label">Purchase Orders</span>
                <span className="order-stat-total">{stats.totalPurchaseOrders}</span>
              </div>
              <div className="order-stat-breakdown">
                <span className="order-stat-chip pending">{stats.pendingPurchaseOrders} Pending</span>
                <span className="order-stat-chip completed">{stats.totalPurchaseOrders - stats.pendingPurchaseOrders} Completed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="card">
          <h3 className="card-title">
            <DollarSign size={20} />
            Financial Overview
          </h3>
          <div className="financial-stats">
            <div className="financial-stat-item">
              <div className="financial-stat-icon revenue">
                <TrendingUp size={16} />
              </div>
              <div>
                <p className="financial-stat-label">Total Revenue</p>
                <p className="financial-stat-value">{formatCurrency(stats.totalRevenue)}</p>
              </div>
            </div>
            <div className="financial-stat-item">
              <div className="financial-stat-icon payments">
                <CheckCircle size={16} />
              </div>
              <div>
                <p className="financial-stat-label">Payments Received</p>
                <p className="financial-stat-value">{formatCurrency(stats.totalPayments)}</p>
              </div>
            </div>
            <div className="financial-stat-item">
              <div className="financial-stat-icon invoices">
                <FileText size={16} />
              </div>
              <div>
                <p className="financial-stat-label">Unpaid Invoices</p>
                <p className="financial-stat-value unpaid">{stats.unpaidInvoices}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Status */}
        <div className="card">
          <h3 className="card-title">
            <Package size={20} />
            Inventory Status
          </h3>
          <div className="inventory-stats">
            <div className="inventory-stat-row">
              <span>Total Products</span>
              <span className="inventory-stat-value">{stats.totalProducts}</span>
            </div>
            <div className="inventory-stat-row">
              <span>Warehouses</span>
              <span className="inventory-stat-value">{stats.totalWarehouses}</span>
            </div>
            <div className="inventory-stat-row warning">
              <span>Low Stock Items</span>
              <span className="inventory-stat-value">{stats.lowStockItems}</span>
            </div>
            <div className="inventory-stat-row highlight">
              <span>Stock Value</span>
              <span className="inventory-stat-value">{formatCurrency(stats.stockValue)}</span>
            </div>
          </div>
        </div>

        {/* Transportation Status */}
        <div className="card">
          <h3 className="card-title">
            <Truck size={20} />
            Transportation Status
          </h3>
          <div className="transport-stats">
            <div className="transport-stat-circle">
              <div className="circle-progress" style={{ '--progress': stats.totalTrucks > 0 ? (stats.activeTrucks / stats.totalTrucks * 100) : 0 }}>
                <div className="circle-inner">
                  <span className="circle-value">{stats.activeTrucks}</span>
                  <span className="circle-label">Active Trucks</span>
                </div>
              </div>
            </div>
            <div className="transport-stat-details">
              <div className="transport-detail-item">
                <Truck size={16} />
                <span>{stats.totalTrucks} Total Trucks</span>
              </div>
              <div className="transport-detail-item">
                <Users size={16} />
                <span>{stats.activeDrivers} Active Drivers</span>
              </div>
              <div className="transport-detail-item">
                <Package size={16} />
                <span>{stats.inTransitShipments} In Transit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Forest & Harvest */}
        <div className="card">
          <h3 className="card-title">
            <Sprout size={20} />
            Forest & Harvest
          </h3>
          <div className="forest-stats">
            <div className="forest-stat-item">
              <div className="forest-stat-icon">
                <Sprout size={24} />
              </div>
              <div>
                <p className="forest-stat-value">{stats.totalForests}</p>
                <p className="forest-stat-label">Total Forests</p>
              </div>
            </div>
            <div className="forest-stat-item">
              <div className="forest-stat-icon">
                <Award size={24} />
              </div>
              <div>
                <p className="forest-stat-value">{stats.totalHarvestBatches}</p>
                <p className="forest-stat-label">Harvest Batches</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;