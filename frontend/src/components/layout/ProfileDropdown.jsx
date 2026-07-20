import React from 'react';
import { User, FileText, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ProfileDropdown = ({ open, onClose, onLogout }) => {
  const navigate = useNavigate();

  const handleItemClick = (path) => {
    onClose();
    navigate(path);
  };

  if (!open) return null;

  return (
    <div className="absolute right-0 mt-2 w-48 rounded-xl border bg-popover text-popover-foreground shadow-lg outline-none animate-in fade-in-80 zoom-in-95 z-50">
      <div className="p-1">
        <button
          onClick={() => handleItemClick('/profile')}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <User size={18} />
          My Profile
        </button>
        <button
          onClick={() => handleItemClick('/orders')}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <FileText size={18} />
          My Orders
        </button>
        <button
          onClick={() => handleItemClick('/profile')}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          <Settings size={18} />
          Settings
        </button>
      </div>
      <hr className="border-border my-1" />
      <div className="p-1">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
