import { Work, MLADashboardStats, ImplementingAgency } from '@/types/mla';

export const mlaStats: MLADashboardStats = {
  totalBalance: 250000000, // 25 Crores (2024-2029)
  totalWorks: 9,
  approvedDemands: 9,
  pendingDemandAmount: 134965000 // 13.5 Crores approx
};

export const implementingAgencies: ImplementingAgency[] = [
  { id: '1', name: 'Public Works Department', code: 'PWD' },
  { id: '2', name: 'Rural Development Department', code: 'RDD' },
  { id: '3', name: 'Urban Development Department', code: 'UDD' },
  { id: '4', name: 'Education Department', code: 'ED' },
  { id: '5', name: 'Health Department', code: 'HD' },
];

export const worksData: Work[] = [
  {
    id: '1',
    srNo: 228,
    workName: 'मौजे शिरदाळे येथे महिला अस्मिता भवन बांधणे ता.आंबेगाव',
    iaName: 'Executive Engineer, Public Works North Division, Pune',
    mlaLetter: 'ML/2425/5498',
    recommendedAmount: 149924900,
    aaAmount: 120000000,
    aaLetter: 'AA/2024/001',
    fundDisbursed: 0,
    fundsPending: 0,
    financialYear: '2024-25',
    status: 'Not Started'
  },
  {
    id: '2',
    srNo: 259,
    workName: 'मौजे पहाडदरा येथील ठाकरवाडी येथे सामाजिक सभागृह बांधणे ता.आंबेगाव',
    iaName: 'Executive Engineer, Public Works North Division, Pune',
    mlaLetter: 'ML/2425/5465',
    recommendedAmount: 199770000,
    aaAmount: 150000000,
    aaLetter: 'AA/2024/002',
    fundDisbursed: 0,
    fundsPending: 0,
    financialYear: '2024-25',
    status: 'Not Started'
  },
  {
    id: '3',
    srNo: 260,
    workName: 'गावडेवाडी येथील शंभूमळा अंतर्गत रस्ता डांबरीकरण करणे ता.आंबेगाव',
    iaName: 'Executive Engineer, Public Works North Division, Pune',
    mlaLetter: 'ML/2425/5464',
    recommendedAmount: 149993700,
    aaAmount: 130000000,
    aaLetter: 'AA/2024/003',
    fundDisbursed: 0,
    fundsPending: 0,
    financialYear: '2024-25',
    status: 'Not Started'
  },
  {
    id: '4',
    srNo: 269,
    workName: 'लांडेवाडी येथे महिला अस्मिता भवन बांधणे ता.आंबेगांव ग्रामपंचायत चिंचोडी लांडेवाडी मालमत्ता क्रमांक 829',
    iaName: 'Executive Engineer, Public Works North Division, Pune',
    mlaLetter: 'ML/2425/5452',
    recommendedAmount: 149986000,
    aaAmount: 125000000,
    aaLetter: 'AA/2024/004',
    fundDisbursed: 0,
    fundsPending: 0,
    financialYear: '2024-25',
    status: 'Not Started'
  },
  {
    id: '5',
    srNo: 270,
    workName: 'लांडेवाडी येथील चिंचोडी येथे सामाजिक सभागृह बांधणे ता.आंबेगाव',
    iaName: 'Executive Engineer, Public Works North Division, Pune',
    mlaLetter: 'ML/2425/5451',
    recommendedAmount: 149949000,
    aaAmount: 140000000,
    aaLetter: 'AA/2024/005',
    fundDisbursed: 0,
    fundsPending: 0,
    financialYear: '2024-25',
    status: 'Not Started'
  },
  {
    id: '6',
    srNo: 320,
    workName: 'फलोदे येथे ग्रामपंचायतीच्या मालकीच्या जागेत सामाजिक सभागृह बांधणे ता.आंबेगाव (अनुसुचित जाती/जमाती करिता राखीव निधीतून)',
    iaName: 'Executive Engineer, Public Works North Division, Pune',
    mlaLetter: 'ML/2425/5391',
    recommendedAmount: 119999000,
    aaAmount: 100000000,
    aaLetter: 'AA/2024/006',
    fundDisbursed: 0,
    fundsPending: 0,
    financialYear: '2024-25',
    status: 'Not Started'
  },
  {
    id: '7',
    srNo: 321,
    workName: 'ग्रुप ग्रामपंचायत पंचाळे बु. अंतर्गत अडिवरे येथे स्मशानभूमी सुधारणा व वेटिंगशेड बांधणे ता.आंबेगाव (अनुसुचित जाती/जमाती करिता राखीव)',
    iaName: 'Executive Engineer, Public Works North Division, Pune',
    mlaLetter: 'ML/2425/5390',
    recommendedAmount: 149983500,
    aaAmount: 135000000,
    aaLetter: 'AA/2024/007',
    fundDisbursed: 0,
    fundsPending: 0,
    financialYear: '2024-25',
    status: 'Not Started'
  },
  {
    id: '8',
    srNo: 322,
    workName: 'नारोडी येथील श्री मुक्तादेवी मंदिर परिसर येथे ग्रामपंचायतीच्या मालकीच्या जागेत सामाजिक सभागृह बांधणे ता.आंबेगाव',
    iaName: 'Executive Engineer, Public Works North Division, Pune',
    mlaLetter: 'ML/2425/5389',
    recommendedAmount: 149971900,
    aaAmount: 110000000,
    aaLetter: 'AA/2024/008',
    fundDisbursed: 0,
    fundsPending: 0,
    financialYear: '2024-25',
    status: 'Not Started'
  },
  {
    id: '9',
    srNo: 323,
    workName: 'गोनवडी येथील मारुती मंदिरासमोर ग्रामपंचायतीच्या मालकीच्या जागेत सामाजिक सभागृह बांधणे ता.आंबेगाव',
    iaName: 'Executive Engineer, Public Works North Division, Pune',
    mlaLetter: 'ML/2425/5388',
    recommendedAmount: 99990000,
    aaAmount: 80000000,
    aaLetter: 'AA/2024/009',
    fundDisbursed: 0,
    fundsPending: 0,
    financialYear: '2024-25',
    status: 'Not Started'
  }
];

export const currentMLA = {
  name: 'Shri Dilip Dattatray Walse',
  constituency: 'Ambegaon Assembly Constituency',
  tenure: '2024–2029'
};
export const hadpMock: DemandRecord[] = [
  {
    districtCode: "HADP-AMB",
    district: "Pune",
    taluka: "Ambegaon",
    planType: "HADP",
    financialYear: "2025-26",
    demandCode: "Ambegaon",
    schemeCode: "HADP01",
    schemeName: "HADP Special Scheme",
    head: "—",
    demandAmount: 20000,
    spillAmount: 98.18,
    remainingBalance: 101.82,
    status: "Approved"
  },
  {
    districtCode: "HADP-JUN",
    district: "Pune",
    taluka: "Junnar",
    planType: "HADP",
    financialYear: "2025-26",
    demandCode: "Junnar",
    schemeCode: "HADP02",
    schemeName: "HADP Development Grant",
    head: "—",
    demandAmount: 20000,
    spillAmount: 57.29,
    remainingBalance: 142.71,
    status: "Approved"
  },
  {
    districtCode: "HADP-MAW",
    district: "Pune",
    taluka: "Mawal",
    planType: "HADP",
    financialYear: "2025-26",
    demandCode: "Mawal",
    schemeCode: "HADP03",
    schemeName: "HADP Rural Infrastructure",
    head: "—",
    demandAmount: 20000,
    spillAmount: 114.18,
    remainingBalance: 85.82,
    status: "Approved"
  },
  {
    districtCode: "HADP-BHO",
    district: "Pune",
    taluka: "Bhor",
    planType: "HADP",
    financialYear: "2025-26",
    demandCode: "Bhor",
    schemeCode: "HADP04",
    schemeName: "HADP Infrastructure Upgrade",
    head: "—",
    demandAmount: 20000,
    spillAmount: 52.15,
    remainingBalance: 147.85,
    status: "Approved"
  },
  {
    districtCode: "HADP-MUL",
    district: "Pune",
    taluka: "Mulshi",
    planType: "HADP",
    financialYear: "2025-26",
    demandCode: "Mulshi",
    schemeCode: "HADP05",
    schemeName: "HADP Special Grant",
    head: "—",
    demandAmount: 20000,
    spillAmount: 60,
    remainingBalance: 140.00,
    status: "Approved"
  },
  {
    districtCode: "HADP-VEL",
    district: "Pune",
    taluka: "Velhe",
    planType: "HADP",
    financialYear: "2025-26",
    demandCode: "Velhe",
    schemeCode: "HADP06",
    schemeName: "HADP Village Development",
    head: "—",
    demandAmount: 20000,
    spillAmount: 65,
    remainingBalance: 135.00,
    status: "Approved"
  },
  {
    districtCode: "HADP-PUR",
    district: "Pune",
    taluka: "Purandar",
    planType: "HADP",
    financialYear: "2025-26",
    demandCode: "Purandar",
    schemeCode: "HADP07",
    schemeName: "HADP Sustainable Growth",
    head: "—",
    demandAmount: 20000,
    spillAmount: 22.29,
    remainingBalance: 177.71,
    status: "Approved"
  },
  {
    districtCode: "HADP-KHE",
    district: "Pune",
    taluka: "Khed",
    planType: "HADP",
    financialYear: "2025-26",
    demandCode: "Khed",
    schemeCode: "HADP08",
    schemeName: "HADP Rural Roads",
    head: "—",
    demandAmount: 20000,
    spillAmount: 101.98,
    remainingBalance: 98.02,
    status: "Approved"
  },
  {
    districtCode: "HADP-HAW",
    district: "Pune",
    taluka: "Haweli",
    planType: "HADP",
    financialYear: "2025-26",
    demandCode: "Haweli",
    schemeCode: "HADP09",
    schemeName: "HADP Green Pune",
    head: "—",
    demandAmount: 20000,
    spillAmount: 33.54,
    remainingBalance: 166.46,
    status: "Approved"
  },
  {
    districtCode: "HADP-SHI",
    district: "Pune",
    taluka: "Shirur",
    planType: "HADP",
    financialYear: "2025-26",
    demandCode: "Shirur",
    schemeCode: "HADP10",
    schemeName: "HADP Urban-Rural Link",
    head: "—",
    demandAmount: 10000, // 100 Cr
    spillAmount: 49.98,
    remainingBalance: 50.02,
    status: "Approved"
  },
  {
    districtCode: "HADP-DAU",
    district: "Pune",
    taluka: "Daund",
    planType: "HADP",
    financialYear: "2025-26",
    demandCode: "Daund",
    schemeCode: "HADP11",
    schemeName: "HADP Development Package",
    head: "—",
    demandAmount: 10000, // 100 Cr
    spillAmount: 105,
    remainingBalance: -5.00,
    status: "Approved"
  }
];


// export const  mlaMock = {
//   financialYear: "2025-2026",
//   planType: "MLA/MLC",
//   data: [
//     { district: "PUNE", taluka: "Junnar", term: 13, name: "Sharad Sonavane", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 40000, pendingDemands: 10000 },
//     { district: "PUNE", taluka: "Ambegaon", term: 14, name: "Dilip Walse-Patil", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 0, pendingDemands: 0 },
//     { district: "PUNE", taluka: "Khed Alandi", term: 15, name: "Babaji Ramchandra Kale", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 0, pendingDemands: 0 },
//     { district: "PUNE", taluka: "Shirur", term: 13, name: "Dnyaneshwar Katke", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 0, pendingDemands: 0 },
//     { district: "PUNE", taluka: "Daund", term: 14, name: "Rahul Subhashrao Kul", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 0, pendingDemands: 0 },
//     { district: "PUNE", taluka: "Indapur", term: 15, name: "Dattatraya Vithoba Bharne", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 0, pendingDemands: 0 },
//     { district: "PUNE", taluka: "Baramati", term: 13, name: "Ajit Anantrao Pawar", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 0, pendingDemands: 0 },
//     { district: "PUNE", taluka: "Purandar", term: 14, name: "Vijay Shivtare", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 0, pendingDemands: 0 },
//     { district: "PUNE", taluka: "Bhor", term: 15, name: "Shankar Hiraman Mandekar", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 0, pendingDemands: 0 },
//     { district: "PUNE", taluka: "Maval", term: 13, name: "Sunil Shankarrao Shelke", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 0, pendingDemands: 0 },
//     { district: "PUNE", taluka: "Chinchwad", term: 14, name: "Shankar Jagtap", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 0, pendingDemands: 0 },
//     { district: "PUNE", taluka: "Pimpri", term: 15, name: "Anna Dadu Bansode", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 0, pendingDemands: 0 },
//     { district: "PUNE", taluka: "Bhosari", term: 13, name: "Mahesh Landge", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 0, pendingDemands: 0 },
//     { district: "PUNE", taluka: "Vadgaon Sheri", term: 14, name: "Bapusaheb Tukaram Pathare", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 0, pendingDemands: 0 },
//     { district: "PUNE", taluka: "Shivajinagar", term: 15, name: "Siddharth Shirole", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 0, pendingDemands: 0 },
//     { district: "PUNE", taluka: "Kothrud", term: 13, name: "Chandrakant Bachhu Patil", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 0, pendingDemands: 0 },
//     { district: "PUNE", taluka: "Khadakwasala", term: 14, name: "Bhimrao Dhondiba Tapkir", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 0, pendingDemands: 0 },
//     { district: "PUNE", taluka: "Parvati", term: 15, name: "Madhuri Satish Misal", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 0, pendingDemands: 0 },
//     { district: "PUNE", taluka: "Hadapsar", term: 13, name: "Chetan Tupe", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 0, pendingDemands: 0 },
//     { district: "PUNE", taluka: "Pune Cantonment", term: 14, name: "Suni Dnyandev Kamble", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 0, pendingDemands: 0 },
//     { district: "PUNE", taluka: "Kasba Peth", term: 15, name: "Hemant Narayan Rasane", schemeName: "45150012 53 MLA/MLC LOCAL DEVELOPMENT PROGRAMME", budget: 50000, fundUtilized: 0, balance: 0, pendingDemands: 0 }
//   ]
// };

// export const mlcMock = {
//   financialYear: "2025-2026",
//   planType: "MLA/MLC",
//   data: [
//     {
//       district: "PUNE",
//       taluka: "Nodal",
//       term: 13,
//       name: "Shri Vinod Patil",
//       schemeName: "45150012 53 MLC LOCAL DEVELOPMENT PROGRAMME",
//       budget: 300000,         // in thousands
//       fundUtilized: 100000,   // in thousands
//       balance: 200000,        // in thousands
//       pendingDemands: 50000   // in thousands
//     },
//     {
//       district: "PUNE",
//       taluka: "Non-Nodal",
//       term: 14,
//       name: "Smt. Sneha Jadhav",
//       schemeName: "45150012 53 MLC LOCAL DEVELOPMENT PROGRAMME",
//       budget: 150000,         // in thousands
//       fundUtilized:  50000,   // in thousands
//       balance:    100000,     // in thousands
//       pendingDemands: 25000   // in thousands
//     }
//   ]
// };
