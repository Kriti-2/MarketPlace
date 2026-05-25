import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle } from 'lucide-react';

export const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const steps = [
    { name: 'Sign In', active: step1, link: '/login' },
    { name: 'Shipping', active: step2, link: '/shipping' },
    { name: 'Payment', active: step3, link: '/payment' },
    { name: 'Place Order', active: step4, link: '/placeorder' }
  ];

  return (
    <div className="flex items-center justify-between w-full max-w-xl mx-auto mb-10 px-4">
      {steps.map((step, idx) => (
        <React.Fragment key={idx}>
          {/* Step indicator */}
          <div className="flex flex-col items-center gap-2 flex-1">
            {step.active ? (
              <Link to={step.link} className="flex flex-col items-center group">
                <CheckCircle2 className="w-6 h-6 text-brand-500 group-hover:scale-105 transition-transform" />
                <span className="text-xs font-semibold text-slate-200 mt-1">{step.name}</span>
              </Link>
            ) : (
              <div className="flex flex-col items-center opacity-40">
                <Circle className="w-6 h-6 text-slate-500" />
                <span className="text-xs text-slate-400 mt-1">{step.name}</span>
              </div>
            )}
          </div>

          {/* Connectors */}
          {idx < steps.length - 1 && (
            <div className={`h-[1px] flex-1 border-t border-dashed ${steps[idx+1].active ? 'border-brand-500' : 'border-slate-800'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;
