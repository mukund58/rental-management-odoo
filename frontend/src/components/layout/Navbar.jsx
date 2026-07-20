import React, { useState, useEffect, useRef } from 'react';
import { Heart, ShoppingCart, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Logo from '../common/Logo';
import SearchBar from './SearchBar';
import ProfileDropdown from './ProfileDropdown';
import { PATHS } from '../../routes/paths';
import { getProductById } from '../../api/productApi';
import { getCart } from '../../api/cartApi';
import useAuth from '../../hooks/useAuth';

const money = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export const Navbar = ({ onSearchChange, cartCount, onLogout }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'Admin' || user?.role === 'Vendor';

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);

  const [localCartCount, setLocalCartCount] = useState(cartCount || 0);

  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogoutClick = () => {
    setProfileOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  const loadWishlist = async () => {
    const wishlistedIds = JSON.parse(localStorage.getItem('wishlist_items') || '[]');
    const items = [];
    for (const id of wishlistedIds) {
      try {
        const prod = await getProductById(id);
        if (prod) items.push(prod);
      } catch (err) {
        console.warn(`Failed to fetch wishlisted item ${id}`);
      }
    }
    setWishlistItems(items);
  };

  const loadCartCount = async () => {
    try {
      const items = await getCart();
      const count = items.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
      setLocalCartCount(count);
    } catch (err) {
      console.warn('Could not load cart count:', err);
    }
  };

  useEffect(() => {
    loadWishlist();
    loadCartCount();
    window.addEventListener('wishlist-updated', loadWishlist);
    window.addEventListener('cart-updated', loadCartCount);
    return () => {
      window.removeEventListener('wishlist-updated', loadWishlist);
      window.removeEventListener('cart-updated', loadCartCount);
    };
  }, []);

  useEffect(() => {
    if (cartCount !== undefined) {
      setLocalCartCount(cartCount);
    }
  }, [cartCount]);

  const handleRemoveFromWishlist = (id) => {
    const wishlisted = JSON.parse(localStorage.getItem('wishlist_items') || '[]');
    const updated = wishlisted.filter((itemId) => String(itemId) !== String(id));
    localStorage.setItem('wishlist_items', JSON.stringify(updated));
    toast.error('Removed from wishlist');
    window.dispatchEvent(new Event('wishlist-updated'));
  };

  const handleNavigation = (item) => {
    if (item === 'Products') {
      navigate(PATHS.ROOT);
    } else if (item === 'Terms & Conditions') {
      navigate(PATHS.TERMS);
    } else if (item === 'About Us') {
      navigate(PATHS.ABOUT);
    } else if (item === 'Contact Us') {
      navigate(PATHS.CONTACT);
    }
  };

  return (
    <>
      <header className="fixed top-0 z-40 w-full border-b bg-background">
        <div className="flex h-[70px] items-center justify-between px-4 sm:px-8 gap-4">
          {/* Left Section: Logo & Center Left Links */}
          <div className="flex items-center gap-4 lg:gap-8">
            <Logo />

            <nav className="hidden md:flex items-center gap-6">
              {!isAdmin &&
                ['Products', 'Terms & Conditions', 'About Us', 'Contact Us'].map((item) => (
                  <button
                    key={item}
                    onClick={() => handleNavigation(item)}
                    className="text-sm font-semibold text-muted-foreground transition-colors hover:text-primary whitespace-nowrap"
                  >
                    {item}
                  </button>
                ))}
            </nav>
          </div>

          {/* Center Section: Rounded Search Bar */}
          <div className="flex-1 flex justify-center">
            {!isAdmin && <SearchBar onSearch={onSearchChange} />}
          </div>

          {/* Right Section: Actions & Avatar */}
          <div className="flex items-center gap-2 sm:gap-4">
            {!isAdmin && (
              <>
                <button
                  onClick={() => setWishlistOpen(true)}
                  className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800"
                >
                  <Heart size={20} />
                  {wishlistItems.length > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                      {wishlistItems.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => navigate(PATHS.CART)}
                  className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-slate-100 hover:text-primary dark:hover:bg-slate-800"
                >
                  <ShoppingCart size={20} />
                  {localCartCount > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {localCartCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {/* User Profile Avatar */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-primary text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
              >
                A
              </button>

              <ProfileDropdown
                open={profileOpen}
                onClose={() => setProfileOpen(false)}
                onLogout={handleLogoutClick}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Wishlist Drawer */}
      {wishlistOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => setWishlistOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-[380px] sm:w-[380px] transform bg-background shadow-2xl transition-transform duration-300 ease-in-out ${
          wishlistOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-6">
            <h2 className="text-lg font-bold">Wishlist ({wishlistItems.length})</h2>
            <button
              onClick={() => setWishlistOpen(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X size={20} />
            </button>
          </div>
          <hr className="border-border" />

          <div className="flex-1 overflow-y-auto p-6">
            {wishlistItems.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <p className="font-semibold text-foreground">Your wishlist is empty</p>
                <p className="text-sm">Add items while exploring products.</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-4">
                {wishlistItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center gap-4 rounded-xl border bg-card p-3"
                  >
                    <img
                      src={item.image || item.imageUrl}
                      alt={item.name}
                      className="h-16 w-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-foreground">{item.name}</h3>
                      <p className="mt-1 text-xs font-bold text-primary">
                        {money.format(item.price)}/day
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setWishlistOpen(false);
                          navigate(`/product/${item.id}`);
                        }}
                        className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground hover:bg-primary/90"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleRemoveFromWishlist(item.id)}
                        className="flex items-center justify-center text-destructive hover:text-destructive/80"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
