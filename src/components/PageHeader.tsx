import { LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface PageHeaderProps {
  icon: LucideIcon;
  badge: string;
  title: string;
  description: string;
  gradientFrom?: string;
  gradientTo?: string;
}

const PageHeader = ({
  icon: Icon,
  badge,
  title,
  description,
  gradientFrom = "primary",
  gradientTo = "accent",
}: PageHeaderProps) => {
  return (
    <div className="mb-8 relative overflow-hidden p-8 rounded-3xl">
      <div className={`absolute inset-0 bg-gradient-to-br from-${gradientFrom}/10 via-${gradientTo}/5 to-${gradientFrom}/10`} />
      <div className={`absolute top-0 right-0 w-64 h-64 bg-${gradientFrom}/20 rounded-full blur-3xl animate-pulse`} />
      <div className={`absolute bottom-0 left-0 w-48 h-48 bg-${gradientTo}/20 rounded-full blur-3xl animate-pulse`} style={{ animationDelay: '1s' }} />
      
      <div className="relative">
        <div className={`inline-flex items-center gap-2 px-5 py-2.5 mb-6 bg-gradient-to-r from-${gradientFrom}/15 via-${gradientTo}/10 to-${gradientFrom}/15 border-2 border-${gradientFrom}/30 rounded-full backdrop-blur-md shadow-lg`}>
          <Icon className={`h-4 w-4 text-${gradientFrom} animate-pulse`} />
          <span className={`text-sm font-bold bg-gradient-to-r from-${gradientFrom} to-${gradientTo} bg-clip-text text-transparent uppercase tracking-wider`}>
            {badge}
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          <span className={`bg-gradient-to-r from-${gradientFrom} via-${gradientTo} to-${gradientFrom} bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent`}>
            {title}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground font-light">
          {description} ✨
        </p>
      </div>
    </div>
  );
};

export default PageHeader;
