import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MockupPhoneProps {
  children: ReactNode;
  className?: string;
}

const MockupPhone = ({ children, className }: MockupPhoneProps) => {
  return (
    <div className={cn("relative mx-auto", className)}>
      {/* Phone frame */}
      <div className="relative bg-card rounded-[2.5rem] p-2 shadow-2xl border border-border/50">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-card rounded-b-2xl z-10" />
        
        {/* Screen */}
        <div className="relative bg-background rounded-[2rem] overflow-hidden">
          {/* Status bar */}
          <div className="h-6 bg-background flex items-center justify-between px-6 text-[10px] text-muted-foreground">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 border border-muted-foreground rounded-sm">
                <div className="w-3 h-1.5 bg-muted-foreground rounded-sm m-[1px]" />
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="min-h-[400px] max-h-[500px] overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockupPhone;
