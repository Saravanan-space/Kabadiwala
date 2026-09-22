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
import { Package, ChevronRight, CheckCircle2 } from 'lucide-react';

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
      material: 'Cable',
      weight: 0.5,
      priceRange: '₹90–₹110',
      offerPrice: 210,
      pickupType: 'home',
      recycler: {
        name: 'GreenCycle Recycling',
        address: 'MIDC Andheri East, Mumbai',
        rate: 210,
      },
      status: 'Handover Pending',
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
        <div className="min-h-screen bg-slate-50 pb-24">
          <Header
            title={t('my_lots')}
            subtitle=""
            showBack
            onBack={() => setCurrentScreen('home')}
            pageAudioText={`${t('my_lots')}. ${userLots.length} total lots.`}
          />
          <div className="max-w-md mx-auto px-4 py-4 space-y-4">
            <h2 className="text-xl font-black text-slate-900">{t('my_lots')}</h2>
            {userLots.map((lot) => (
              <button
                key={lot.id}
                onClick={() => {
                  setActiveLotId(lot.id);
                  setCurrentScreen('lot_details');
                }}
                className="w-full text-left bg-white rounded-3xl p-4 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Package className="w-6 h-6 stroke-[2]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-slate-900">
                        {lot.id}
                      </h3>
                      <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {lot.status}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-500 mt-0.5">
                      {lot.material} • {lot.weight} kg
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      )}
        </>
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
