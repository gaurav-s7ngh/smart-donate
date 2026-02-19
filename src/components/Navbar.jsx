import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import logo from '../assets/logo.jpeg'; 

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled ? 'bg-[#F5F2EB]/95 backdrop-blur-xl border-b border-[#6B8060]/20 py-4 shadow-sm' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
        
        {/* Left: Logo & Brand */}
        <a href="/" className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity">
          <div className="relative w-11 h-11 overflow-hidden rounded-xl border border-[#6B8060]/30 flex items-center justify-center shadow-md bg-white">
             <img src={logo} alt="SevaPay Logo" className="w-full h-full object-cover" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-[#1A1F16]">
            Seva<span className="text-[#6B8060]">Pay</span>
          </span>
        </a>

        {/* Right: Navigation Links */}
        <div className="flex items-center gap-4">
          <a 
            href="/history" 
            className="group flex items-center gap-2 text-[#4A5E40] hover:text-[#1A1F16] font-bold transition-all duration-300 bg-white/40 hover:bg-white px-4 py-2.5 rounded-xl border border-[#6B8060]/20 shadow-sm backdrop-blur-md"
          >
            <History size={18} className="group-hover:-rotate-12 transition-transform duration-300" />
            <span className="hidden sm:inline">Transaction History</span>
          </a>
        </div>

      </div>
    </motion.nav>
  );
}