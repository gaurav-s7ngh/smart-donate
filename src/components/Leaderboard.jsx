import React from 'react';
import { Trophy, Medal } from 'lucide-react';

const LEADERBOARD_DATA = [
  { rank: 1, name: "Aarav Sharma", amount: 1500000, cause: "Plant Trees" },
  { rank: 2, name: "Priya Patel", amount: 850000, cause: "Fund Education" },
  { rank: 3, name: "TechCorp India", amount: 500000, cause: "Provide Meals" },
  { rank: 4, name: "Rohan Gupta", amount: 250000, cause: "Plant Trees" },
  { rank: 5, name: "Anonymous", amount: 100000, cause: "Fund Education" },
  { rank: 6, name: "Neha Singh", amount: 75000, cause: "Provide Meals" },
];

export default function Leaderboard() {
  return (
    <section className="bg-[#F5F2EB] py-24 border-t border-[#6B8060]/20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-[#1A1F16] mb-4 flex items-center justify-center gap-3">
            <Trophy className="text-[#6B8060]" size={40} /> Top Cultivators
          </h2>
          <p className="text-[#4A5E40] text-lg max-w-2xl mx-auto">The individuals and organizations making the largest impact.</p>
        </div>
        
        <div className="bg-[#EAE3D2] rounded-[2rem] border border-[#6B8060]/20 overflow-hidden shadow-sm">
          {LEADERBOARD_DATA.map((donor, idx) => {
            const isTop3 = donor.rank <= 3;
            return (
              <div key={idx} className={`flex items-center justify-between p-6 ${idx !== LEADERBOARD_DATA.length - 1 ? 'border-b border-[#6B8060]/10' : ''} hover:bg-[#F5F2EB]/50 transition-colors`}>
                <div className="flex items-center gap-6">
                  <div className="w-12 h-12 flex items-center justify-center font-black text-xl">
                    {donor.rank === 1 ? <Medal size={36} className="text-yellow-600" /> : 
                     donor.rank === 2 ? <Medal size={32} className="text-slate-400" /> : 
                     donor.rank === 3 ? <Medal size={28} className="text-amber-700" /> : 
                     <span className="text-[#4A5E40] opacity-50">#{donor.rank}</span>}
                  </div>
                  <div>
                    <h3 className={`font-black text-lg ${isTop3 ? 'text-[#1A1F16]' : 'text-[#4A5E40]'}`}>{donor.name}</h3>
                    <p className="text-[#6B8060] text-sm font-bold uppercase">{donor.cause}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-black ${isTop3 ? 'text-2xl text-[#1A1F16]' : 'text-xl text-[#4A5E40]'}`}>₹{donor.amount.toLocaleString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}