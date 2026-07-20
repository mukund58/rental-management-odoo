import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* ── Left Panel ── */}
      <div className="relative hidden flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-12 lg:flex">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/3 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative z-10 text-center"
        >
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm shadow-xl">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white">
            Rent Smarter,<br />Live Better
          </h1>
          <p className="max-w-sm text-base text-indigo-100 leading-relaxed">
            Access thousands of premium products for rent. No commitment, no hassle — just flexibility.
          </p>

          {/* Feature bullets */}
          <div className="mt-10 space-y-3 text-left">
            {[
              '✓  Browse 500+ curated rental products',
              '✓  Flexible rental durations',
              '✓  Free delivery & pickup',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm font-medium text-indigo-100">
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom attribution */}
        <p className="absolute bottom-6 text-xs text-indigo-300/60">
          © {new Date().getFullYear()} RentalOS. All rights reserved.
        </p>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-6 py-12 sm:px-10 lg:max-w-lg xl:max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="w-full max-w-md"
        >
          {/* Logo mark on mobile */}
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">RentalOS</span>
          </div>

          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};
export default AuthLayout;

