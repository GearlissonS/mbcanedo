import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ label = "Voltar" }: { label?: string }) {
  const navigate = useNavigate();
  return (
    <Button variant="outline" className="mb-4" onClick={() => navigate(-1)}>
      <ArrowLeft className="mr-2 h-4 w-4" /> {label}
    </Button>
  );
}
