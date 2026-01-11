import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingCart, Sparkles } from "lucide-react";
import { DietInfo, DietType } from "@/types/diet";
import { motion } from "framer-motion";

// Links de checkout para cada dieta
// TODO: Substituir pelos links reais de pagamento
// Links de checkout para cada dieta na Kirvano
// Substitua os links abaixo pelos seus links reais da Kirvano
const CHECKOUT_LINKS: Record<DietType, string> = {
  carnivore: 'https://kirvano.com/seu-link-carnivora',
  keto: 'https://pay.kirvano.com/7ed7bef7-1073-40a5-b8f5-44876b60022e',
  lowcarb: 'https://kirvano.com/seu-link-lowcarb',
  metabolic: 'https://pay.kirvano.com/65c427dc-23be-4a8e-8124-aab00eb6f589',
  detox: 'https://kirvano.com/seu-link-detox',
  fasting: 'https://kirvano.com/seu-link-jejum',
};

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  diet: DietInfo | null;
  dietKey: DietType | null;
}

const PurchaseModal = ({ isOpen, onClose, diet, dietKey }: PurchaseModalProps) => {
  if (!diet || !dietKey) return null;

  const handlePurchase = () => {
    const checkoutUrl = CHECKOUT_LINKS[dietKey];
    window.open(checkoutUrl, '_blank');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-center">
            Desbloquear {diet.name}
          </DialogTitle>
          <DialogDescription className="text-center">
            Acesse todas as receitas e o plano de 21 dias
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Diet Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground">{diet.name}</h3>
                <p className="text-sm text-muted-foreground">{diet.description}</p>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-2">
              {diet.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5">✓</span>
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CTA */}
          <Button
            onClick={handlePurchase}
            className="w-full h-14 text-lg font-display gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Desbloquear Agora
            <ExternalLink className="w-4 h-4" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Você será redirecionado para a página de pagamento seguro
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;
