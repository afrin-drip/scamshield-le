'use client';
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

type PlanId = 'free' | 'pro' | 'family';

interface Plan {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  devices: string;
  detection: string;
  familyAlerts: boolean;
  csvExport: boolean;
  priority: boolean;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    period: 'forever',
    devices: '1 device',
    detection: 'Basic pattern matching',
    familyAlerts: false,
    csvExport: false,
    priority: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$9.99',
    period: 'per month',
    devices: '1 device',
    detection: 'AI-powered (Claude)',
    familyAlerts: false,
    csvExport: true,
    priority: false,
  },
  {
    id: 'family',
    name: 'Family',
    price: '$19.99',
    period: 'per month',
    devices: 'Up to 5 devices',
    detection: 'AI-powered (Claude)',
    familyAlerts: true,
    csvExport: true,
    priority: true,
  },
];

const PLAN_ORDER: PlanId[] = ['free', 'pro' , 'family'];

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

export default function SubscriptionPage() {
  const [currentPlan, setCurrentPlan] = useState<PlanId>('free');
  const [renewalDate, setRenewalDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user: User | null) => {
      if (!user) {
        window.location.href = '/';
        return;
      }
      try {
        const subDoc = await getDoc(doc(db, 'users', user.uid, 'subscription', 'current'));
        if (subDoc.exists()) {
          const data = subDoc.data();
          setCurrentPlan((data.plan as PlanId) ?? 'free');
          if (data.renewsAt?.toDate) {
            setRenewalDate(data.renewsAt.toDate().toLocaleDateString());
          }
        }
      } catch (err) {
        console.error('subscription fetch error:', err);
      } finally {
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  const currentIdx = PLAN_ORDER.indexOf(currentPlan);

  function ctaLabel(plan: Plan): string {
    const planIdx = PLAN_ORDER.indexOf(plan.id);
    if (plan.id === currentPlan) return 'Current plan';
    return planIdx > currentIdx ? 'Upgrade' : 'Downgrade';
  }

  function ctaStyle(plan: Plan): string {
    if (plan.id === currentPlan)
      return 'w-full py-2 rounded-lg text-sm font-medium bg-gray-700 text-gray-400 cursor-not-allowed';
    const planIdx = PLAN_ORDER.indexOf(plan.id);
    if (planIdx > currentIdx)
      return 'w-full py-2 rounded-lg text-sm font-medium bg-scam-red hover:bg-red-700 text-white transition-colors';
    return 'w-full py-2 rounded-lg text-sm font-medium border border-gray-600 text-gray-300 hover:border-gray-400 transition-colors';
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500 text-lg">Loading subscription…</div>
      </div>
    );
  }

  const activePlan = PLANS.find(p => p.id === currentPlan)!;

  return (
    <div className="space-y-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-white">Subscription</h1>

      {/* Current plan banner */}
      <div className="bg-blue-950 border border-blue-800 rounded-xl p-6 flex items-center justify-between">
        <div>
          <p className="text-blue-300 text-sm font-medium mb-1">Current Plan</p>
          <p className="text-2xl font-bold text-white">{activePlan.name}</p>
          {renewalDate && (
            <p className="text-blue-400 text-sm mt-1">Renews {renewalDate}</p>
          )}
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold text-white">{activePlan.price}</p>
          <p className="text-blue-400 text-sm">{activePlan.period}</p>
        </div>
      </div>

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map(plan => {
          const isActive = plan.id === currentPlan;
          return (
            <div
              key={plan.id}
              className={`rounded-xl p-6 border flex flex-col gap-4 ${
                isActive
                  ? 'bg-gray-900 border-scam-red/60 ring-1 ring-scam-red/30'
                  : 'bg-gray-900 border-gray-800'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-lg font-bold text-white">{plan.name}</p>
                  {isActive && (
                    <span className="text-xs font-semibold bg-scam-red/20 text-scam-red px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-3xl font-bold text-white">
                  {plan.price}
                  <span className="text-sm text-gray-400 font-normal ml-1">{plan.period}</span>
                </p>
              </div>

              <ul className="space-y-2 text-sm flex-1">
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckIcon /> {plan.devices}
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckIcon /> {plan.detection}
                </li>
                <li className={`flex items-center gap-2 ${plan.familyAlerts ? 'text-gray-300' : 'text-gray-600'}`}>
                  {plan.familyAlerts ? <CheckIcon /> : <XIcon />} Family alerts
                </li>
                <li className={`flex items-center gap-2 ${plan.csvExport ? 'text-gray-300' : 'text-gray-600'}`}>
                  {plan.csvExport ? <CheckIcon /> : <XIcon />} CSV export
                </li>
                <li className={`flex items-center gap-2 ${plan.priority ? 'text-gray-300' : 'text-gray-600'}`}>
                  {plan.priority ? <CheckIcon /> : <XIcon />} Priority support
                </li>
              </ul>

              {plan.id === currentPlan ? (
                <button disabled className={ctaStyle(plan)}>
                  {ctaLabel(plan)}
                </button>
              ) : (
                <a
                  href={`https://billing.scamshieldle.com?plan=${plan.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={ctaStyle(plan)}
                  style={{ textAlign: 'center', display: 'block' }}
                >
                  {ctaLabel(plan)}
                </a>
               )}
            </div>
          );
        })}
      </div>

      <p className="text-gray-500 text-sm">
        Manage billing, invoices, and payment methods at{' '}
        <a href="https://billing.scamshieldle.com" target="_blank" rel="noopener noreferrer"
          className="text-blue-400 hover:underline">
          billing.scamshieldle.com
        </a>
      </p>
    </div>
  );
}
