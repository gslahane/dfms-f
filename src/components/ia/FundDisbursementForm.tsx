import React, { useState, useEffect, ChangeEvent } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Schemes and their works
const schemeOptions = [
  {
    id: '1', name: '३०५४३६११ ग्रामीण रस्ते विकास व मजबुतीकरण',
    works: [
      { id: 'w1', name: 'काम क्र. ४२: जांबूत ते चांडोह (0/500–1/500) रस्ता सुधारित करणे' },
      { id: 'w2', name: 'खडक ते जोगिव्हीर फाटा (0/500–1/500) रस्ता सुधारणा – ता. आंबेगाव' }
    ]
  },
  {
    id: '2', name: '३५४७८९९९ रस्ता दुरुस्ती योजना',
    works: [
      { id: 'w3', name: 'ता. आंबेगाव: खडक ते जोगिव्हीर फाटा (0/500–1/500) दुरुस्ती' },
      { id: 'w4', name: 'जांबूत ते चांडोह (0/500–1/500) दुरुस्ती काम क्र. ४२' }
    ]
  }
];

// Vendors
const vendorOptions = [
  { id: 'v1', name: 'Vendor 1', bank: 'SBI', accNo: '1234567890', ifsc: 'SBIN0001234', aadhaar: '1234-5678-9012' },
  { id: 'v2', name: 'Vendor 2', bank: 'BOI', accNo: '0987654321', ifsc: 'BOIN0005678', aadhaar: '9876-5432-1098' }
];

// Financial years
const financialYears = ['2023-24', '2024-25', '2025-26'];

interface FundDisbursementFormProps {
  onCancel: () => void;
  disbursement?: any;
}

const FundDisbursementForm: React.FC<FundDisbursementFormProps> = ({ onCancel, disbursement }) => {
  const { toast } = useToast();
  const [workId] = useState(disbursement?.workId || `W-${Date.now()}`);
  const [demandId] = useState(disbursement?.demandId || `D-${Date.now()}`);
  const [documents, setDocuments] = useState<File[]>([]);
  const [adminApprovalDoc, setAdminApprovalDoc] = useState<File | null>(null);
  const [workOrderDoc, setWorkOrderDoc] = useState<File | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<typeof vendorOptions[0] | null>(null);
  const [activeTab, setActiveTab] = useState<'work' | 'demand' | 'documents'>('work');

  const [formData, setFormData] = useState({
    schemeId: '', workId: '', startDate: '', endDate: '', sanctionDate: '',
    adminApprovedAmount: 0, workOrderNet: 0, workOrderTax: 0, workOrderTotal: 0,
    demandAmount: 0, demandDate: '', demandDescription: '', financialYear: '',
    paymentType: 'partial', vendorId: ''
  });

  // Calculate total automatically
  useEffect(() => {
    const total = (formData.workOrderNet || 0) + (formData.workOrderTax || 0);
    setFormData(fd => ({ ...fd, workOrderTotal: total }));
  }, [formData.workOrderNet, formData.workOrderTax]);

  const handleChange = (field: string, value: any) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, type: 'admin' | 'workOrder' | 'support') => {
    if (!e.target.files) return;
    if (type === 'admin') setAdminApprovalDoc(e.target.files[0]);
    if (type === 'workOrder') setWorkOrderDoc(e.target.files[0]);
    if (type === 'support') setDocuments(Array.from(e.target.files));
  };

  const saveWork = () => {
    if (!formData.schemeId || !formData.workId || !formData.startDate) return toast({ title: 'Error', description: 'Work पार पूर्ण करा', variant: 'destructive' });
    setActiveTab('demand');
  };
  const saveDemand = () => {
    if (!formData.demandAmount || !formData.financialYear || !formData.demandDate) return toast({ title: 'Error', description: 'Demand पार पूर्ण करा', variant: 'destructive' });
    setActiveTab('documents');
  };
  const finalize = () => {
    const payload = { workId, demandId, ...formData, adminApprovalDoc, workOrderDoc, documents };
    console.log(payload);
    toast({ title: 'Success', description: 'सुरक्षीत राहिले', variant: 'success' });
    onCancel();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fund Disbursement Form</CardTitle>
        <CardDescription>काम व मागणी व्यवस्थापन</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="work">Work Details</TabsTrigger>
            <TabsTrigger value="demand">Demand Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="work" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Work ID</Label><Input value={workId} disabled /></div>
              <div><Label>Scheme</Label>
                <Select value={formData.schemeId} onValueChange={v => handleChange('schemeId', v)}>
                  <SelectTrigger><SelectValue placeholder="Select Scheme"/></SelectTrigger>
                  <SelectContent>{schemeOptions.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Work</Label>
                <Select value={formData.workId} onValueChange={v => handleChange('workId', v)} disabled={!formData.schemeId}>
                  <SelectTrigger><SelectValue placeholder="Select Work"/></SelectTrigger>
                  <SelectContent>{(schemeOptions.find(s=>s.id===formData.schemeId)?.works||[]).map(w=><SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Start Date</Label><Input type="date" value={formData.startDate} onChange={e=>handleChange('startDate',e.target.value)}/></div>
              <div><Label>End Date</Label><Input type="date" value={formData.endDate} onChange={e=>handleChange('endDate',e.target.value)}/></div>
              <div><Label>Sanction Date</Label><Input type="date" value={formData.sanctionDate} onChange={e=>handleChange('sanctionDate',e.target.value)}/></div>
              <div><Label>Admin Approved Amount</Label><Input type="number" value={formData.adminApprovedAmount} onChange={e=>handleChange('adminApprovedAmount',parseFloat(e.target.value))}/></div>
              <div><Label>Upload Admin Doc</Label><Input type="file" onChange={e=>handleFileChange(e,'admin')}/></div>
              <div><Label>Work Order Net</Label><Input type="number" value={formData.workOrderNet} onChange={e=>handleChange('workOrderNet',parseFloat(e.target.value))}/></div>
              <div><Label>Work Order Tax</Label><Input type="number" value={formData.workOrderTax} onChange={e=>handleChange('workOrderTax',parseFloat(e.target.value))}/></div>
              <div><Label>Work Order Total</Label><Input value={formData.workOrderTotal} disabled/></div>
              <div><Label>Upload Order Doc</Label><Input type="file" onChange={e=>handleFileChange(e,'workOrder')}/></div>
            </div>
            <div className="flex justify-end"><Button onClick={saveWork}>Next to Demand</Button></div>
          </TabsContent>

          <TabsContent value="demand" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div><Label>Demand ID</Label><Input value={demandId} disabled/></div>
              <div><Label>Scheme Name</Label><Input value={schemeOptions.find(s=>s.id===formData.schemeId)?.name||''} disabled/></div>
              <div><Label>Work</Label><Input value={(schemeOptions.find(s=>s.id===formData.schemeId)?.works.find(w=>w.id===formData.workId)?.name)||''} disabled/></div>
              <div><Label>Admin Approved Amount</Label><Input value={formData.adminApprovedAmount} disabled/></div>
              <div><Label>Work Order Amount</Label><Input value={formData.workOrderTotal} disabled/></div>
              <div><Label>Demand Amount</Label><Input type="number" value={formData.demandAmount} onChange={e=>handleChange('demandAmount',parseFloat(e.target.value))}/></div>
              <div><Label>Financial Year</Label>
                <Select value={formData.financialYear} onValueChange={v=>handleChange('financialYear',v)}>
                  <SelectTrigger><SelectValue placeholder="Select FY"/></SelectTrigger>
                  <SelectContent>{financialYears.map(fy=><SelectItem key={fy} value={fy}>{fy}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Demand Date</Label><Input type="date" value={formData.demandDate} onChange={e=>handleChange('demandDate',e.target.value)}/></div>
              <div><Label>Demand Description</Label><Textarea rows={3} value={formData.demandDescription} onChange={e=>handleChange('demandDescription',e.target.value)}/></div>
              <div><Label>Payment Type</Label>
                <Select value={formData.paymentType} onValueChange={v=>handleChange('paymentType',v)}>
                  <SelectTrigger><SelectValue placeholder="Select Type"/></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="partial">Partial</SelectItem>
                    <SelectItem value="final">Final</SelectItem>
                    <SelectItem value="spill">Spill</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Vendor</Label>
                <Select value={formData.vendorId} onValueChange={v=>{handleChange('vendorId',v);setSelectedVendor(vendorOptions.find(x=>x.id===v)||null)}}>
                  <SelectTrigger><SelectValue placeholder="Select Vendor"/></SelectTrigger>
                  <SelectContent>{vendorOptions.map(v=><SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {selectedVendor && <div className="col-span-2 p-4 border rounded bg-gray-50">
                <p><strong>Name:</strong> {selectedVendor.name}</p>
                <p><strong>Bank:</strong> {selectedVendor.bank}</p>
                <p><strong>A/c No:</strong> {selectedVendor.accNo}</p>
                <p><strong>IFSC:</strong> {selectedVendor.ifsc}</p>
                <p><strong>Aadhaar:</strong> {selectedVendor.aadhaar}</p>
              </div>}
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={()=>setActiveTab('work')}>Back</Button>
              <Button onClick={saveDemand}>Next to Documents</Button>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4">
            <div className="border-2 border-dashed rounded p-6 text-center">
              <Upload className="h-10 w-10 mx-auto mb-2 text-gray-400" />
              <p>Supporting Documents</p>
              <input type="file" multiple onChange={e=>handleFileChange(e,'support')} className="mt-2" />
            </div>
            {documents.length>0 && <ul className="list-disc list-inside">
              {documents.map((f,i)=><li key={i}>{f.name}</li>)}
            </ul>}
            <div className="flex justify-between">
              <Button variant="outline" onClick={()=>setActiveTab('demand')}>Back</Button>
              <Button onClick={finalize}>Save All</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default FundDisbursementForm;
