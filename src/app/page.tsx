'use client';

import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from '../context/LanguageContext';
import { LanguageStartScreen } from '../components/common/LanguageStartScreen';
import { Header } from '../components/common/Header';
import { UserMainInterface } from '../components/home/UserMainInterface';
import { SellMaterialFlow } from '../components/sell/SellMaterialFlow';
import { FindRecyclerScreen } from '../components/recyclers/FindRecyclerScreen';
import { LotDetailsScreen } from '../components/lots/LotDetailsScreen';
import { VerifyHandoverScreen } from '../components/lots/VerifyHandoverScreen';
import { TodaysRatesScreen } from '../components/prices/TodaysRatesScreen';
import { HelpSectionScreen } from '../components/help/HelpSectionScreen';
import { MyEarningsScreen } from '../components/earnings/MyEarningsScreen';
import { RoleSelectionScreen, UserRole } from '../components/common/RoleSelectionScreen';
import { RecyclerDashboard } from '../components/recyclers/RecyclerDashboard';
import { AIChatbot } from '../components/chat/AIChatbot';
import { Package, ChevronRight, CheckCircle2, Lock } from 'lucide-react';

type ScreenState =
  | 'home'
  | 'sell'
  | 'find_recycler'
  | 'lot_details'
  | 'verify_handover'
  | 'todays_rates'
  | 'my_lots'
  | 'help'
  | 'my_earnings'
  | 'recycler_dashboard';

function AppContent() {
  const { isLanguageSelected, t } = useLanguage();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('home');
  const [userLots, setUserLots] = useState<any[]>([
    {
      id: 'KBD-1042',
      material: 'Copper Cables & Wire Scrap',
      weight: 2.5,
      priceRange: '₹180–₹240/kg',
      offerPrice: 220,
      pickupType: 'home',
      recycler: {
        name: 'GreenCycle Recycling',
        address: 'MIDC Andheri East, Mumbai',
        rate: 220,
      },
      status: 'Quote Locked',
      quoteStatus: 'locked',
      quotedRates: [
        { material_category: 'Copper Cables & Wire Scrap', weight_kg: 1.5, rate_per_kg: 220, subtotal_inr: 330 },
        { material_category: 'Optical Mouse Scrap', weight_kg: 1.0, rate_per_kg: 100, subtotal_inr: 100 },
      ],
      quotedTotal: 430,
      timestamp: new Date().toISOString(),
    },
    {
      id: 'KBD-1041',
      material: 'PCB (Circuit Board)',
      weight: 12.0,
      priceRange: '₹340–370/kg',
      offerPrice: 355,
      pickupType: 'self',
      status: 'Completed',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);
  const [activeLotId, setActiveLotId] = useState<string>('KBD-1042');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRole = localStorage.getItem('kabadiwala_user_role') as UserRole;
      if (savedRole) {
        setUserRole(savedRole);
      }
    }
  }, []);

  const handleSelectRole = (role: UserRole) => {
    setUserRole(role);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kabadiwala_user_role', role);
    }
    if (role === 'recycler') {
      setCurrentScreen('recycler_dashboard');
    } else {
      setCurrentScreen('home');
    }
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentScreen('home');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kabadiwala_user_role');
    }
  };

  const handleLotCreated = (newLot: any) => {
    setUserLots((prev) => [newLot, ...prev]);
    setActiveLotId(newLot.id);
  };

  const handleUpdateLotStatus = (lotId: string, newStatus: string, extraData?: any) => {
    setUserLots((prev) =>
      prev.map((l) => (l.id === lotId ? { ...l, status: newStatus, ...extraData } : l))
    );
  };

  const selectedLot = userLots.find((l) => l.id === activeLotId) || userLots[0];

  const activeCount = userLots.filter((l) => l.status !== 'Completed').length;
  const completedCount = userLots.filter((l) => l.status === 'Completed').length;

  const enRouteLot = userLots.find((l) => l.status === 'Pickup Person On The Way');

  return (
    <div className="min-h-screen bg-slate-100/60 selection:bg-emerald-500 selection:text-white font-sans text-slate-900">
      {/* 1. Language Start Screen Modal overlay */}
      {!isLanguageSelected && <LanguageStartScreen />}

      {/* 2. Role Selection Landing Screen if no role selected */}
      {isLanguageSelected && !userRole && (
        <RoleSelectionScreen onSelectRole={handleSelectRole} />
      )}

      {/* 3. Role-Based Routers */}
      {isLanguageSelected && userRole === 'recycler' && currentScreen === 'recycler_dashboard' && (
        <RecyclerDashboard
          onSwitchToSellerMode={handleLogout}
          lots={userLots}
          onUpdateLotStatus={handleUpdateLotStatus}
        />
      )}

      {isLanguageSelected && (userRole === 'user' || (userRole === 'recycler' && currentScreen !== 'recycler_dashboard')) && (
        <>
          {currentScreen === 'home' && (
            <>
              <Header
                onSwitchRecyclerMode={() => handleSelectRole('recycler')}
                onLogout={handleLogout}
              />

              {/* Real-time En-Route Pickup Live Notification Banner */}
              {enRouteLot && (
                <div className="max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3">
                  <div
                    onClick={() => {
                      setActiveLotId(enRouteLot.id);
                      setCurrentScreen('lot_details');
                    }}
                    className="p-4 rounded-3xl bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white shadow-lg flex items-center justify-between gap-3 cursor-pointer hover:shadow-xl transition-all border border-amber-400/40 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-xl animate-bounce shrink-0">
                        🚚
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-white text-amber-900 px-2.5 py-0.5 rounded-full">
                            Pickup Partner En Route
                          </span>
                          <span className="text-xs font-semibold text-amber-200">
                            {enRouteLot.id}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-black text-white mt-0.5">
                          {enRouteLot.dispatchInfo?.driverName || 'Suresh Kumar'} is on the way ({enRouteLot.dispatchInfo?.etaMinutes || 15} mins away)
                        </h4>
                      </div>
                    </div>

                    <div className="px-3.5 py-2 rounded-2xl bg-white text-amber-900 font-black text-xs shrink-0 group-hover:scale-105 transition-transform flex items-center gap-1 shadow-sm">
                      <span>Track Live Map</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              )}

              <UserMainInterface
                onNavigate={(scr) => setCurrentScreen(scr as ScreenState)}
                activeLotsCount={activeCount}
                completedLotsCount={completedCount}
              />
            </>
          )}

          {currentScreen === 'sell' && (
            <SellMaterialFlow
              onBackToHome={() => setCurrentScreen('home')}
              onLotCreated={handleLotCreated}
              onFindRecyclersForLot={(lotId) => {
                setActiveLotId(lotId);
                setCurrentScreen('find_recycler');
              }}
            />
          )}

      {currentScreen === 'find_recycler' && (
        <FindRecyclerScreen
          onBack={() => setCurrentScreen('home')}
          lotId={selectedLot?.id || 'KBD-1042'}
          materialName={selectedLot?.material || 'Cable'}
          weightKg={selectedLot?.weight || 0.5}
          onSelectRecycler={(rec) => {
            // Update lot's recycler
            setUserLots((prev) =>
              prev.map((l) =>
                l.id === (selectedLot?.id || 'KBD-1042')
                  ? { ...l, recycler: rec, status: 'Recycler Selected' }
                  : l
              )
            );
            setCurrentScreen('lot_details');
          }}
        />
      )}

      {currentScreen === 'lot_details' && (
        <LotDetailsScreen
          onBack={() => setCurrentScreen('home')}
          lot={selectedLot}
          onVerifyHandover={() => setCurrentScreen('verify_handover')}
          onAcceptQuote={(lotId) => {
            handleUpdateLotStatus(lotId, 'Recycler Selected', {
              quoteStatus: 'accepted',
            });
          }}
          onDeclineQuote={(lotId) => {
            handleUpdateLotStatus(lotId, 'Finding Recycler', {
              quoteStatus: 'declined',
              recycler: null,
            });
            setActiveLotId(lotId);
            setCurrentScreen('find_recycler');
          }}
        />
      )}

      {currentScreen === 'verify_handover' && (
        <VerifyHandoverScreen
          onBack={() => setCurrentScreen('lot_details')}
          lotId={selectedLot?.id || 'KBD-1042'}
          yourWeight={selectedLot?.weight || 0.5}
          verifiedWeight={7.8}
          finalPricePerKg={selectedLot?.recycler?.rate || 210}
          onHandoverComplete={() => {
            setUserLots((prev) =>
              prev.map((l) =>
                l.id === (selectedLot?.id || 'KBD-1042')
                  ? { ...l, status: 'Completed' }
                  : l
              )
            );
            setCurrentScreen('my_earnings');
          }}
        />
      )}

      {currentScreen === 'todays_rates' && (
        <TodaysRatesScreen onBack={() => setCurrentScreen('home')} />
      )}

      {currentScreen === 'help' && (
        <HelpSectionScreen onBack={() => setCurrentScreen('home')} />
      )}

      {currentScreen === 'my_earnings' && (
        <MyEarningsScreen onBack={() => setCurrentScreen('home')} />
      )}

      {currentScreen === 'my_lots' && (
        <div className="min-h-screen bg-slate-50 pb-24 font-sans">
          <Header
            title={t('my_lots')}
            subtitle=""
            showBack
            onBack={() => setCurrentScreen('home')}
            pageAudioText={`${t('my_lots')}. ${userLots.length} total lots.`}
          />
          <div className="max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">{t('my_lots')}</h2>
              <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                {userLots.length} Active & Completed Lots
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userLots.map((lot) => {
                const isQuoteLocked = lot.status === 'Quote Locked' || lot.quoteStatus === 'locked';
                const totalDisplayVal = lot.quotedTotal || Math.round(lot.weight * (lot.offerPrice || 210));

                return (
                  <button
                    key={lot.id}
                    onClick={() => {
                      setActiveLotId(lot.id);
                      setCurrentScreen('lot_details');
                    }}
                    className="w-full text-left bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Package className="w-7 h-7 stroke-[2]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-black text-slate-900">
                            {lot.id}
                          </h3>
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                              lot.status === 'Completed' || isQuoteLocked
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : lot.status === 'Quote Declined'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            {isQuoteLocked ? (
                              <Lock className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <CheckCircle2 className="w-3 h-3" />
                            )}
                            {isQuoteLocked
                              ? `Quote Locked · ₹${totalDisplayVal.toLocaleString('en-IN')}`
                              : lot.status === 'Quote Declined'
                              ? 'Quote Declined — Finding New Recycler'
                              : lot.status}
                          </span>

                        </div>
                        <p className="text-sm font-semibold text-slate-500 mt-1">
                          {lot.material} • {lot.weight} kg
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

        </>
      )}

      {/* Floating AI Assistant Chatbot */}
      {isLanguageSelected && userRole && (
        <AIChatbot onNavigate={(scr) => setCurrentScreen(scr as ScreenState)} />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
