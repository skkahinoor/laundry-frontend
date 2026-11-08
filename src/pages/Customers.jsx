import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  UserPlus,
  Phone,
  MapPin,
  Eye,
  Plus,
  Users,
  Package,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { calculateOrderTotals } from '../utils/helpers';

export default function Customers({
  customers,
  orders,
  customerSearch,
  setCustomerSearch,
  setShowNewCustomerModal,
  setSelectedCustomerDetail,
  setShowNewOrderModal,
}) {
  const [filterType, setFilterType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  // Filter customers based on search and activity filter
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      const q = customerSearch.toLowerCase();
      const matchesSearch =
        !customerSearch ||
        c.name.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)) ||
        (c.address && c.address.toLowerCase().includes(q));

      const custOrders = orders.filter((o) => o.customerId === c.id || o.customerName === c.name);
      const activeOrders = custOrders.filter((o) => o.stage !== 'delivered');

      let matchesFilter = true;
      if (filterType === 'Active') {
        matchesFilter = activeOrders.length > 0;
      } else if (filterType === 'Repeat') {
        matchesFilter = custOrders.length >= 2;
      } else if (filterType === 'New') {
        matchesFilter = custOrders.length === 0;
      }

      return matchesSearch && matchesFilter;
    });
  }, [customers, orders, customerSearch, filterType]);

  // Pagination
  const totalPages = Math.ceil(filteredCustomers.length / perPage) || 1;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredCustomers.slice(start, start + perPage);
  }, [filteredCustomers, currentPage, perPage]);

  // Overall customer stats
  const totalOrdersCount = orders.length;
  const activeOrdersCount = orders.filter((o) => o.stage !== 'delivered').length;

  return (
    <motion.div
      key="customers"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      {/* Top Banner & Action */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
            Customer Directory
          </span>
          <h2 className="text-xl font-bold mt-0.5">Manage All Store Customers & Delivery Addresses</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            View customer contact info, delivery addresses, order counts, and lifetime spends in an organized table.
          </p>
        </div>

        <button
          onClick={() => setShowNewCustomerModal(true)}
          className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition shrink-0"
        >
          <UserPlus className="w-4 h-4" /> Add New Customer
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Customers</span>
          <p className="text-xl font-bold text-slate-900 mt-1">{customers.length}</p>
          <span className="text-[11px] text-slate-500">Registered store users</span>
        </div>

        <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-sky-600 block">Active Laundry Orders</span>
          <p className="text-xl font-bold text-sky-700 mt-1">{activeOrdersCount}</p>
          <span className="text-[11px] text-slate-500">In-progress orders</span>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-bold uppercase text-emerald-600 block">Lifetime Orders</span>
          <p className="text-xl font-bold text-emerald-700 mt-1">{totalOrdersCount}</p>
          <span className="text-[11px] text-slate-500">Total laundry bookings</span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={customerSearch}
            onChange={(e) => {
              setCustomerSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by customer name, phone or address..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto gap-1">
          {[
            { id: 'All', label: 'All Customers' },
            { id: 'Active', label: 'Active Orders' },
            { id: 'Repeat', label: 'Repeat (2+ Orders)' },
            { id: 'New', label: 'No Orders Yet' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setFilterType(item.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                filterType === item.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="font-bold text-slate-800">
            Showing {paginatedCustomers.length} of {filteredCustomers.length} Customers
          </span>
          <span className="text-slate-400 text-[11px]">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-semibold">
                <th className="py-3.5 px-5">Customer</th>
                <th className="py-3.5 px-4">Contact Phone</th>
                <th className="py-3.5 px-4">Delivery & Pickup Address</th>
                <th className="py-3.5 px-4">Orders Placed</th>
                <th className="py-3.5 px-4">Lifetime Spend</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {paginatedCustomers.map((cust) => {
                const custOrders = orders.filter(
                  (o) => o.customerId === cust.id || o.customerName === cust.name
                );
                const activeOrders = custOrders.filter((o) => o.stage !== 'delivered');
                const totalSpent = custOrders.reduce(
                  (sum, o) => sum + calculateOrderTotals(o).netRevenue,
                  0
                );

                return (
                  <tr key={cust.id} className="hover:bg-slate-50/80 transition">
                    {/* Customer Name & Avatar */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-100 to-indigo-100 text-sky-800 font-bold text-xs flex items-center justify-center shrink-0 border border-sky-200">
                          {cust.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 text-xs sm:text-sm leading-tight truncate">
                            {cust.name}
                          </p>
                          <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                            Customer #{cust.id}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Contact Phone */}
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-800">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{cust.phone || '-'}</span>
                      </div>
                    </td>

                    {/* Address */}
                    <td className="py-3.5 px-4 max-w-xs text-xs text-slate-600">
                      <div className="flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-2 leading-relaxed">
                          {cust.address || 'Address not specified'}
                        </span>
                      </div>
                    </td>

                    {/* Orders Placed */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">
                          {custOrders.length}
                        </span>
                        <span className="text-[11px] text-slate-400">orders</span>
                        {activeOrders.length > 0 && (
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-sky-100 text-sky-800 ml-1">
                            {activeOrders.length} active
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Lifetime Spend */}
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-xs sm:text-sm">
                      ₹{totalSpent.toLocaleString('en-IN')}
                    </td>

                    {/* Actions: View Details / Order History */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedCustomerDetail(cust)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 font-bold text-xs inline-flex items-center gap-1.5 transition"
                          title="View Customer Order History"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>History</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paginatedCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm font-semibold text-slate-400">
                    No customers found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-3 bg-slate-50/70 border-t border-slate-200/80 flex items-center justify-between gap-3 text-xs">
            <span className="text-slate-500 font-medium">
              Showing {(currentPage - 1) * perPage + 1} to{' '}
              {Math.min(currentPage * perPage, filteredCustomers.length)} of {filteredCustomers.length}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 transition"
                title="Previous Page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 font-bold text-slate-800">
                {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 transition"
                title="Next Page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
