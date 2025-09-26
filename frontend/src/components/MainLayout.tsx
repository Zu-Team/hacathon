'use client';

import { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UserGroupIcon,
  UserIcon,
  ShieldCheckIcon,
  SparklesIcon,
  CogIcon,
  ChartBarIcon,
  RocketLaunchIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

interface MainLayoutProps {
  children: ReactNode;
}

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  category: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: HomeIcon,
    href: '/',
    category: 'Main'
  },
  {
    id: 'employee-360',
    label: 'Employee 360',
    icon: UserGroupIcon,
    href: '/employee-manager',
    category: 'HR'
  },
  {
    id: 'customer-360',
    label: 'Customer 360',
    icon: UserIcon,
    href: '/customer-manager',
    category: 'Customer'
  },
  {
    id: 'compliance-risk',
    label: 'Compliance & Risk',
    icon: ShieldCheckIcon,
    href: '/compliance-manager',
    category: 'Risk'
  },
  {
    id: 'personalized-products',
    label: 'Hyper-Personalization',
    icon: SparklesIcon,
    href: '/hyper-personalization',
    category: 'Products'
  },
  {
    id: 'operational-optimization',
    label: 'Smart Efficiency',
    icon: CogIcon,
    href: '/smart-efficiency',
    category: 'Operations'
  },
  {
    id: 'market-analysis',
    label: 'Predictive Market',
    icon: ChartBarIcon,
    href: '/predictive-market',
    category: 'Trading'
  },
  {
    id: 'product-development',
    label: 'Product Innovation',
    icon: RocketLaunchIcon,
    href: '/product-innovation',
    category: 'Innovation'
  },
  {
    id: 'services',
    label: 'All Services',
    icon: WrenchScrewdriverIcon,
    href: '/services',
    category: 'Services'
  }
];

export default function MainLayout({ children }: MainLayoutProps) {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-black flex" suppressHydrationWarning={true}>
      {/* Sidebar */}
      <div className={`${sidebarExpanded ? 'w-64' : 'w-16'} fixed left-0 top-0 h-full z-50 transition-all duration-300 bg-black/30 backdrop-blur-sm border-r border-gray-800/50 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-800/50">
          <div className="flex items-center justify-between">
            {sidebarExpanded && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  NX
                </div>
                <span className="text-white font-bold text-sm">Nexus Bank</span>
              </div>
            )}
            <button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors"
            >
              <div className="w-5 h-5 flex flex-col justify-center items-center">
                <div className={`w-4 h-0.5 bg-white transition-all duration-300 ${sidebarExpanded ? 'rotate-45 translate-y-0.5' : ''}`}></div>
                <div className={`w-4 h-0.5 bg-white transition-all duration-300 mt-1 ${sidebarExpanded ? '-rotate-45 -translate-y-0.5' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-2 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30' 
                    : 'hover:bg-gray-800/50'
                }`}
                title={!sidebarExpanded ? item.label : undefined}
              >
                <div className={`flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-gray-400 group-hover:text-white'}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                {sidebarExpanded && (
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {item.category}
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800/50">
          {sidebarExpanded && (
            <div className="text-xs text-gray-500 text-center">
              AI-Powered Banking
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col transition-all duration-300" style={{ marginLeft: sidebarExpanded ? '16rem' : '4rem' }}>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
