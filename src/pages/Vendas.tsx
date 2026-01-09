import { useNavigate } from "react-router-dom";
import SalesHero from "@/components/sales/SalesHero";
import FeatureList from "@/components/sales/FeatureList";
import WarningSection from "@/components/sales/WarningSection";
import TwoPathsSection from "@/components/sales/TwoPathsSection";
import DietGridSection from "@/components/sales/DietGridSection";
import BonusSection from "@/components/sales/BonusSection";
import PlanPreviewSection from "@/components/sales/PlanPreviewSection";
import MindsetPreviewSection from "@/components/sales/MindsetPreviewSection";
import ScienceSection from "@/components/sales/ScienceSection";
import PricingSection from "@/components/sales/PricingSection";
import PWASection from "@/components/sales/PWASection";
import SalesFAQ from "@/components/sales/SalesFAQ";
import SalesFooter from "@/components/sales/SalesFooter";

const Vendas = () => {
  const navigate = useNavigate();

  const handleCtaClick = () => {
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      <SalesHero onCtaClick={handleCtaClick} />
      <FeatureList />
      <WarningSection />
      <TwoPathsSection />
      <DietGridSection />
      <BonusSection />
      <PlanPreviewSection />
      <MindsetPreviewSection />
      <ScienceSection />
      <PricingSection onCtaClick={handleCtaClick} />
      <PWASection />
      <SalesFAQ />
      <SalesFooter onCtaClick={handleCtaClick} />
    </div>
  );
};

export default Vendas;
