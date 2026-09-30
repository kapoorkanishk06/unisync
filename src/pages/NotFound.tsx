import { useNavigate } from "react-router-dom";
import { Button } from "../components/primitives/Button";
import { ArrowLeft } from "lucide-react";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
      <div className="text-center space-y-5 max-w-md">
        <h1 className="font-display font-bold text-6xl">404</h1>
        <p className="text-xl text-text-dim">That route is also cooked.</p>
        <Button onClick={() => navigate("/app")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
