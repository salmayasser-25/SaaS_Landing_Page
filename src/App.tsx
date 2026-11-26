import { useState } from 'react';
import { AnalyticsSection } from './components/AnalyticsSection';
import { DashboardPreview } from './components/DashboardPreview';
import { FaqSection } from './components/FaqSection';
import { FeaturesSection } from './components/FeaturesSection';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { HowItWorksSection } from './components/HowItWorksSection';
import { Navbar } from './components/Navbar';
import { PricingSection } from './components/PricingSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { TrialModal } from './components/TrialModal';

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Pro');
  const [modalMode, setModalMode] = useState<'trial' | 'demo'>('trial');

  const handleOpenTrial = (plan = 'Pro', mode: 'trial' | 'demo' = 'trial') => {
    setSelectedPlan(plan);
    setModalMode(mode);
    setModalOpen(true);
  };

  const handleSelectPlan = (planName: string) => {
    const mode = planName === 'Enterprise' ? 'demo' : 'trial';
    handleOpenTrial(planName, mode);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-slate-100">
      <Navbar onOpenTrial={handleOpenTrial} />

      <main>
        <Hero onOpenTrial={handleOpenTrial} />
        <DashboardPreview />
        <FeaturesSection />
        <HowItWorksSection />
        <AnalyticsSection />
        <PricingSection onSelectPlan={handleSelectPlan} />
        <TestimonialsSection />
        <FaqSection />
      </main>

      <Footer onOpenTrial={handleOpenTrial} />

      <TrialModal
        isOpen={modalOpen}
        initialPlan={selectedPlan}
        initialMode={modalMode}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
