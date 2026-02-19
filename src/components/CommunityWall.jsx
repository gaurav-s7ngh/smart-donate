import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

export default function CommunityWall({ comments, onDonateClick }) {
  return (
    <section className="bg-[#1A1F16] py-24 text-[#F5F2EB]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 border-b border-[#6B8060]/30 pb-8">
          <div>
            <h2 className="text-4xl font-black flex items-center gap-3 mb-2">
              <MessageSquare className="text-[#6B8060]" size={36} /> Community Wall
            </h2>
            <p className="text-[#A3B19B] text-lg">Words of encouragement from our recent donors.</p>
          </div>
          <button onClick={onDonateClick} className="mt-6 md:mt-0 px-6 py-3 bg-[#6B8060] hover:bg-[#A3B19B] text-[#1A1F16] font-bold rounded-xl transition-colors">
            Add Your Voice
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {comments.slice(0, 4).map((comment, idx) => (
              <motion.div 
                key={idx + comment.text} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                layout
                className="bg-[#EAE3D2]/10 p-6 rounded-[2rem] border border-[#6B8060]/30 flex flex-col h-full"
              >
                <p className="text-[#F5F2EB] text-lg mb-6 italic leading-relaxed flex-grow">"{comment.text}"</p>
                <div className="flex justify-between items-center mt-auto border-t border-[#6B8060]/20 pt-4">
                  <span className="font-bold text-[#6B8060]">{comment.name}</span>
                  <span className="text-[#A3B19B] text-xs">{comment.time}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}   