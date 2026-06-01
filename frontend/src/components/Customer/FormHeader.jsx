import { UserPlus, UserPen } from 'lucide-react';

const FormHeader = ({ title, subtitle, isEditMode }) => {
  const Icon = isEditMode ? UserPen : UserPlus;

  return (
    <div className="flex items-start gap-4 mb-8 pb-6 border-b border-slate-100">
      <div className="bg-indigo-50 p-3 rounded-xl shrink-0">
        <Icon className="w-6 h-6 text-brand-primary" />
      </div>
      <div>
        <p className="text-sm font-medium text-brand-primary mb-0.5">
          {isEditMode ? 'Update record' : 'New customer'}
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{title}</h1>
        <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
      </div>
    </div>
  );
};

export default FormHeader;
