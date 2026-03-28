import { StudentLevel, SubjectCategory } from "./supabase/types";

export const SUBJECT_MAPPING: Record<StudentLevel, SubjectCategory[]> = {
  foundation: [
    'general',
    'principles_and_practice_of_accounting',
    'business_laws',
    'business_math_logical_reasoning_and_statistics',
    'business_economics',
  ],
  intermediate: [
    'general',
    'advanced_accounting',
    'corporate_and_other_laws',
    'taxation',
    'cost_and_management_accounting',
    'auditing_and_ethics',
    'financial_management_and_strategic_management',
  ],
  final: [
    'general',
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
  principles_and_practice_of_accounting: 'Acct',
  business_laws: 'Law',
  business_math_logical_reasoning_and_statistics: 'Math/Stat',
  business_economics: 'Eco',
  advanced_accounting: 'Adv Acc',
  corporate_and_other_laws: 'Law',
  taxation: 'Tax',
  cost_and_management_accounting: 'Costing',
  auditing_and_ethics: 'Audit',
  financial_management_and_strategic_management: 'FM-SM',
  financial_reporting: 'FR',
  advanced_financial_management: 'AFM',
  advanced_auditing_assurance_and_professional_ethics: 'Audit',
  direct_tax_laws: 'DT',
  indirect_tax_laws: 'IDT',
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
