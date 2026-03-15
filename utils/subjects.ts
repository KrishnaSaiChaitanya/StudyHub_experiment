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

export const formatSubjectName = (subject: SubjectCategory): string => {
  return subject
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
