export const SAMPLE_ANALYSES = {
  university: {
    summary:
      'Westfield State University requires current Merit Academic Scholarship recipients to submit a renewal application for Spring 2026. Renewal is not automatic — you must meet GPA, enrollment, and conduct requirements and upload a complete document packet. Late or incomplete submissions will not be reviewed, and your Spring scholarship disbursement will not be processed if renewal is not approved.',
    deadlines: [
      {
        date: '15 September 2026, 4:30 PM Eastern Time',
        description:
          'All renewal materials must be received by the Office of Financial Aid. Late submissions will not be reviewed.',
      },
      {
        date: '22 September 2026',
        description:
          'If you have not received email confirmation of your submission by this date, contact the Office of Financial Aid.',
      },
    ],
    eligibility: [
      'Currently enrolled full-time undergraduate at Westfield State University',
      'Cumulative GPA of at least 3.25 after Fall 2025 semester',
      'Completed at least 12 credit hours in Fall 2025 with grades of C or higher in each course',
      'Not on academic probation, disciplinary suspension, or a financial hold with the Bursar\'s Office',
      'Used no more than 75% of total scholarship allocation for the academic year',
    ],
    checklist: [
      'Download and complete Scholarship Renewal Form SAR-2026 from financialaid.westfield.edu/forms',
      'Obtain your Fall 2025 transcript (official or unofficial from student portal)',
      'Prepare a signed statement of continued enrollment for Spring 2026',
      'Confirm your 2025–2026 FAFSA is on file, or include the confirmation page',
      'Request a faculty letter of recommendation dated within the last 12 months',
      'Upload all documents as PDFs to portal.westfield.edu/financialaid, or deliver to Room 214 by 15 September 2026, 4:30 PM',
      'Watch for email confirmation within 3 business days; contact financial aid if none by 22 September 2026',
    ],
    quickTake: {
      deadline: '15 Sep 2026',
      action: 'Submit scholarship renewal application',
      eligibility: 'Current merit scholarship recipients',
    },
  },

  government: {
    summary:
      'Lakeside County is accepting applications for the 2026 Senior Citizen Property Tax Relief Program, which offers a partial property tax reduction for qualifying homeowners. You must meet age, residency, income, and tax-payment requirements and submit a complete application with supporting documents. Applications received after the deadline or without all required documents will not be processed.',
    deadlines: [
      {
        date: '30 November 2025, 5:00 PM local time',
        description:
          'Completed applications with all supporting documents must be received. No extensions. Mail submissions must be postmarked by this date.',
      },
    ],
    eligibility: [
      'At least 65 years of age as of January 1, 2026',
      'Property is your primary residence within Lakeside County',
      'Property classified as single-family dwelling or condominium',
      'Combined household gross income for 2024 did not exceed $42,500',
      'Current on property tax payments for 2023 and 2024 with no outstanding liens or defaulted payment plans',
      'Did not receive this relief benefit for the same property in 2025',
    ],
    checklist: [
      'Download and complete Application Form SCPTR-2026 from lakesidecounty.gov/taxrelief',
      'Gather government-issued photo ID showing your date of birth',
      'Collect proof of ownership (deed, mortgage statement, or property tax bill)',
      'Prepare your 2024 federal tax return (Form 1040) or signed income affidavit (Form SCPTR-IA)',
      'Include your current 2025 property tax bill',
      'Gather proof of residency for the past 12 months (utility bill, bank statement, or voter registration)',
      'Submit online at lakesidecounty.gov/taxrelief/apply, in person at 1200 Civic Center Drive Room 302, or by mail postmarked by 30 November 2025',
      'Expect a mailed decision within 45 business days of receipt',
    ],
    quickTake: {
      deadline: '30 Nov 2025',
      action: 'Submit property tax relief application',
      eligibility: 'Senior homeowners in Lakeside County',
    },
  },
};
