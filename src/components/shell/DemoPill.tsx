import { apiMode } from "../../hooks/useApiMode";
import { Badge } from "../primitives/Badge";

export function DemoPill() {
  const mode = apiMode();

  if (mode !== "mock") return null;

  return (
    <Badge variant="brand" className="text-xs">
      Demo mode
    </Badge>
  );
}
