import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Building, Calendar, Users, Settings, LogOut, Plus } from 'lucide-react';
import Logo from '../common/Logo';
import { useAuthContext } from '../../contexts/AuthContext';

const navItems = [
  { icon: Home, label: 'Dashboard', path: '/admin' },
  { icon: Building, label: 'Properties', path: '/admin/properties' },
  { icon: Calendar, label: 'Bookings', path: '/admin/bookings' },
  { icon: Users, label: 'Clients', path: '/admin/clients' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export default function AdminSidebar() {
  const { signOut } = useAuthContext();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <Logo />
      </div>
      
      <nav className="mt-6">
        {navItems.map((item) => (
          <div key={item.path} className="relative">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-gray-600 hover:bg-gray-50 hover:text-primary ${
                  isActive ? 'text-primary bg-gray-50' : ''
                }`
              }
            >
              <item.icon className="h-5 w-5 mr-3" />
              <span>{item.label}</span>
            </NavLink>
            {item.path === '/admin/bookings' && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <NavLink
                  to="/admin/bookings/new"
                  className="p-1 hover:bg-primary/10 rounded-full"
                  title="Add Booking"
                >
                  <Plus className="h-4 w-4" />
                </NavLink>
              </div>
            )}
          </div>
        ))}
        
        <button 
          onClick={signOut}
          className="flex items-center space-x-3 px-6 py-3 text-red-600 hover:bg-red-50 w-full mt-6"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </nav>
    </aside>
  );
}