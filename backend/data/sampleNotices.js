export const SAMPLE_NOTICES = {
  university: {
    id: 'university',
    label: 'University scholarship renewal',
    text: `OFFICE OF FINANCIAL AID AND SCHOLARSHIPS
WESTFIELD STATE UNIVERSITY
Student Services Building, Room 214
Academic Year 2025–2026

NOTICE TO CURRENT MERIT SCHOLARSHIP RECIPIENTS
Scholarship Renewal for Spring 2026 Semester

Date Issued: August 12, 2025

Dear Scholarship Recipient,

This notice concerns the renewal of your Merit Academic Scholarship for the Spring 2026 semester. Renewal is not automatic. You must submit a complete renewal application and supporting documents by the deadline stated below.

ELIGIBILITY FOR RENEWAL
To be considered for renewal, you must meet ALL of the following conditions as of the submission deadline:

1. You must be currently enrolled as a full-time undergraduate student at Westfield State University.
2. You must have maintained a cumulative Grade Point Average (GPA) of at least 3.25 on a 4.0 scale during the Fall 2025 semester.
3. You must have completed a minimum of 12 credit hours in the Fall 2025 semester with grades of C or higher in each course.
4. You must not be on academic probation, disciplinary suspension, or any financial hold with the Bursar's Office.
5. You must have used no more than 75% of your total scholarship allocation for the academic year.

REQUIRED DOCUMENTS
Your renewal packet must include:

(a) Completed Scholarship Renewal Form (Form SAR-2026), available at financialaid.westfield.edu/forms
(b) Official Fall 2025 transcript (unofficial copy accepted if downloaded from the student portal)
(c) A signed statement of continued enrollment for Spring 2026
(d) Updated Free Application for Federal Student Aid (FAFSA) confirmation page for 2025–2026, if not already on file
(e) One letter of recommendation from a faculty member dated within the last 12 months

SUBMISSION DEADLINE
All materials must be received by the Office of Financial Aid no later than:

    15 September 2026, 4:30 PM Eastern Time

Late submissions will not be reviewed. Incomplete packets will be returned without consideration.

HOW TO SUBMIT
Submit your renewal packet through the Student Financial Aid Portal at portal.westfield.edu/financialaid. Upload all documents as PDF files. Alternatively, you may deliver physical copies to Room 214, Student Services Building, during office hours (Monday–Friday, 9:00 AM–4:30 PM).

CONFIRMATION
You will receive an email confirmation within 3 business days of successful submission. If you do not receive confirmation by 22 September 2026, contact the Office of Financial Aid at (555) 014-2290 or financialaid@westfield.edu.

CONSEQUENCES OF NON-RENEWAL
If your renewal is not approved or not submitted by the deadline, your scholarship disbursement for Spring 2026 will not be processed. You remain responsible for any tuition and fees not covered by other aid.

For questions regarding this notice, contact the Scholarship Coordinator, Ms. Elena Vasquez, at the contact information above.

Sincerely,

Dr. Marcus Chen
Director, Office of Financial Aid and Scholarships
Westfield State University`,
  },

  government: {
    id: 'government',
    label: 'Property tax relief application',
    text: `COUNTY OF LAKESIDE
DEPARTMENT OF REVENUE AND TAXATION
1200 Civic Center Drive, Lakeside, ST 44102

PUBLIC NOTICE
Senior Citizen Property Tax Relief Program — 2026 Application Period

Notice Number: DRT-2026-SCPTR-0041
Date of Notice: July 28, 2025

TO: Property owners within Lakeside County who may qualify for the Senior Citizen Property Tax Relief Program.

PURPOSE OF THIS NOTICE
The County of Lakeside is accepting applications for the 2026 Senior Citizen Property Tax Relief Program. This program provides a partial reduction of property taxes for qualifying homeowners who meet age, residency, and income requirements. This notice explains who may apply, what documents are required, and the deadline for submission.

ELIGIBILITY REQUIREMENTS
You may apply if you meet ALL of the following conditions on or before the application deadline:

1. You are at least 65 years of age as of January 1, 2026.
2. The property for which you are applying is your primary residence located within Lakeside County.
3. The property is classified as a single-family dwelling or condominium under County Assessor records.
4. Your combined household gross income for calendar year 2024 did not exceed $42,500.
5. You are current on all property tax payments for tax years 2023 and 2024, with no outstanding liens or payment plans in default.
6. You have not received a property tax relief benefit under this program for the same property in 2025.

REQUIRED DOCUMENTS
Applications must include copies of the following:

• Completed Application Form SCPTR-2026 (available at lakesidecounty.gov/taxrelief or at any County Revenue office)
• Government-issued photo identification showing date of birth
• Proof of ownership (deed, mortgage statement, or property tax bill in your name)
• 2024 federal income tax return (Form 1040) or, if not required to file, a signed income affidavit (Form SCPTR-IA)
• Current property tax bill for tax year 2025
• Proof of residency for the past 12 months (utility bill, bank statement, or voter registration)

APPLICATION DEADLINE
Completed applications with all supporting documents must be received by:

    30 November 2025, 5:00 PM local time

Applications received after this date, or applications that are incomplete, will not be processed for the 2026 program year. There are no extensions.

WHERE TO SUBMIT
Submit your application by one of the following methods:

• Online: lakesidecounty.gov/taxrelief/apply (upload scanned documents as PDF)
• In person: Department of Revenue and Taxation, 1200 Civic Center Drive, Room 302
• By mail: SCPTR Program, P.O. Box 880, Lakeside, ST 44102 (must be postmarked by 30 November 2025)

Applications sent by mail are considered received on the postmark date. Hand-delivered applications are considered received on the date stamped by the receiving clerk.

PROCESSING AND NOTIFICATION
The County will review applications within 45 business days of receipt. You will be notified by mail of approval or denial. If approved, the tax relief credit will be applied to your 2026 property tax statement.

CONSEQUENCES OF MISSING THE DEADLINE
If you fail to submit a complete application by 30 November 2025, you will not be eligible for the 2026 program year. You may apply again during the next open application period in 2027.

CONTACT INFORMATION
For assistance, call the SCPTR Helpline at (555) 880-4100, Monday through Friday, 8:30 AM–4:00 PM, or email scptr@lakesidecounty.gov.

This notice is issued pursuant to Lakeside County Code Section 12.44.07.

Respectfully submitted,

Patricia Okonkwo
Director, Department of Revenue and Taxation
County of Lakeside`,
  },
};

function normalizeForCompare(text) {
  return text.replace(/\r\n/g, '\n').replace(/\u00a0/g, ' ').trim();
}

export function getSampleByText(text) {
  const normalized = normalizeForCompare(text);
  for (const sample of Object.values(SAMPLE_NOTICES)) {
    if (normalizeForCompare(sample.text) === normalized) {
      return sample.id;
    }
  }
  return null;
}

export function getSampleById(id) {
  return SAMPLE_NOTICES[id] ? id : null;
}
