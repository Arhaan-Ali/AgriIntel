export interface PlanFeature {
  name: string;
  included: boolean;
}

export interface PlanProps {
  name: string;
  price: string | number;
  description: string;
  features: PlanFeature[];
  highlighted?: boolean;
  gradient: string;
  comingSoon?: boolean;
  cta: string;
}
