import { useNavigate } from "react-router-dom";
import { Hero } from "../components/landing/Hero";
import { HowItWorks } from "../components/landing/HowItWorks";
import { WhyDifferent } from "../components/landing/WhyDifferent";
import { demoSeed } from "../lib/api";
import { mockDemoSeed } from "../lib/mockApi";
import { apiMode } from "../hooks/useApiMode";
import { toast } from "sonner";

export function Landing() {
  const navigate = useNavigate();
  const mode = apiMode();

  const handleDemo = async () => {
    try {
      if (mode === "mock") {
        await mockDemoSeed();
      } else {
        await demoSeed();
      }
      toast.success("Demo data loaded");
      navigate("/app");
    } catch (error) {
      toast.error("Failed to load demo");
    }
  };

  return (
    <div className="min-h-screen">
      <Hero onUpload={() => navigate("/app/upload")} onDemo={handleDemo} />
      <HowItWorks />
      <WhyDifferent />
    </div>
  );
}
