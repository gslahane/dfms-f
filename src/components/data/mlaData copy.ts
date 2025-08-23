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