import { StudentLevel, SubjectCategory } from "./supabase/types";

export const SUBJECT_MAPPING: Record<StudentLevel, SubjectCategory[]> = {
  foundation: [
    'principles_and_practice_of_accounting',
    'business_laws',
    'business_math_logical_reasoning_and_statistics',
    'business_economics',
  ],
  intermediate: [
    'advanced_accounting',
    'corporate_and_other_laws',
    'taxation',
    'cost_and_management_accounting',
    'auditing_and_ethics',
    'financial_management_and_strategic_management',
  ],
  final: [
    'financial_reporting',
    'advanced_financial_management',
    'advanced_auditing_assurance_and_professional_ethics',
    'direct_tax_laws',
    'indirect_tax_laws',
    'integrated_business_solutions',
  ],
};

export const SUBJECT_ABBREVIATIONS: Record<SubjectCategory, string> = {
  general: 'General',
  principles_and_practice_of_accounting: 'Accounting',
  business_laws: 'Business Laws',
  business_math_logical_reasoning_and_statistics: 'Math,LR',
  business_economics: 'Business Economics',
  advanced_accounting: 'Adv Accounting',
  corporate_and_other_laws: 'Law',
  taxation: 'Taxation',
  cost_and_management_accounting: 'Costing',
  auditing_and_ethics: 'Auditing & Ethics',
  financial_management_and_strategic_management: 'FM & SM',
  financial_reporting: 'Financial Reporting',
  advanced_financial_management: 'AFM',
  advanced_auditing_assurance_and_professional_ethics: 'Auditing',
  direct_tax_laws: 'Direct Tax Laws',
  indirect_tax_laws: 'Indirect Tax Laws',
  integrated_business_solutions: 'IBS',
};

export const getSubjectAbbreviation = (subject: SubjectCategory): string => {
  return SUBJECT_ABBREVIATIONS[subject] || formatSubjectName(subject);
};

export const formatSubjectName = (subject: SubjectCategory): string => {
  if (subject === 'general') return 'General';
  return subject
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
