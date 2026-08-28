import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, CalendarPlus, ListOrdered, Users, Building2,
  Wheat, CalendarDays, Clock, FileCheck2, CreditCard, Bell, User, BarChart3, ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const farmerLinks = [
    { name: 'Dashboard', path: '/farmer/dashboard', icon: LayoutDashboard },
    { name: 'Book Slot', path: '/farmer/book-slot', icon: CalendarPlus },
    { name: 'My Bookings', path: '/farmer/bookings', icon: ListOrdered },
    { name: 'My Queue', path: '/farmer/queue', icon: Clock },
    { name: 'Procurement', path: '/farmer/procurement', icon: FileCheck2 },
    { name: 'Payments', path: '/farmer/payments', icon: CreditCard },
    { name: 'Notifications', path: '/farmer/notifications', icon: Bell },
    { name: 'Profile', path: '/farmer/profile', icon: User },
  ];

  const operatorLinks = [
    { name: 'Dashboard', path: '/operator/dashboard', icon: LayoutDashboard },
    { name: 'Live Queue', path: '/operator/queue', icon: Clock },
    { name: "Today's Bookings", path: '/operator/bookings', icon: ListOrdered },
    { name: 'Procurement', path: '/operator/procurement', icon: FileCheck2 },
    { name: 'Payments', path: '/operator/payments', icon: CreditCard },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Farmers', path: '/admin/farmers', icon: Users },
    { name: 'Operators', path: '/admin/operators', icon: ShieldCheck },
    { name: 'Centres', path: '/admin/centres', icon: Building2 },
    { name: 'Crops', path: '/admin/crops', icon: Wheat },
    { name: 'Slots', path: '/admin/slots', icon: CalendarDays },
    { name: 'Bookings', path: '/admin/bookings', icon: ListOrdered },
    { name: 'Procurement', path: '/admin/procurement', icon: FileCheck2 },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
  ];

  let links = [];
  if (user.role === 'FARMER') links = farmerLinks;
  else if (user.role === 'OPERATOR') links = operatorLinks;
  else if (user.role === 'ADMIN') links = adminLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between shrink-0">
      <div className="space-y-1">
        <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
          {user.role} Navigation
        </div>
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-sm border border-emerald-100'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-slate-500">
        <p className="font-semibold text-slate-700">KisanQ Support</p>
        <p className="mt-0.5">Helpline: 1800-180-1551</p>
        <p className="text-[10px] text-slate-400 mt-1">Toll Free DoCA Procurement Line</p>
      </div>
    </aside>
  );
};

export default Sidebar;
