import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Upload, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FINANCIAL_YEARS, SCHEMES, SECTORS } from '@/types/mla';
import { implementingAgencies, currentMLA } from '@/data/mlaData';

const formSchema = z.object({
  financialYear: z.string().min(1, 'Please select financial year'),
  implementingAgency: z.string().min(1, 'Please select implementing agency'),
  sector: z.string().min(1, 'Please select sector'),
  workName: z.string().min(1, 'Work name is required'),
  recommendedWorkAmount: z.number().min(1, 'Amount must be greater than 0'),
  scheme: z.string().min(1, 'Please select scheme'),
  mlaRecommendationLetter: z.any().optional(),
});

export function RecommendWorkDialog() {
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      financialYear: '',
      implementingAgency: '',
      sector: '',
      workName: '',
      recommendedWorkAmount: 0,
      scheme: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log('Form submitted:', values);
    setSubmittedData(values);
    setShowConfirmation(true);
  };

  const handleConfirmSubmission = () => {
    // Generate PDF download
    const element = document.createElement('a');
    const file = new Blob([`
Work Recommendation Details

MLA: ${currentMLA.name}
Constituency: ${currentMLA.constituency}
Financial Year: ${submittedData.financialYear}
Implementing Agency: ${submittedData.implementingAgency}
Sector: ${submittedData.sector}
Work Name: ${submittedData.workName}
Recommended Amount: ₹${(submittedData.recommendedWorkAmount / 100000).toFixed(1)} L
Scheme: ${submittedData.scheme}

Submitted on: ${new Date().toLocaleDateString()}
    `], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `work-recommendation-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: 'Work Recommendation Submitted',
      description: 'Your work recommendation has been submitted successfully and PDF downloaded.',
    });
    setOpen(false);
    setShowConfirmation(false);
    form.reset();
    setFileName('');
    setSubmittedData(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      form.setValue('mlaRecommendationLetter', file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-6">
          <Plus className="h-4 w-4 mr-2" />
          Recommend New Work
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        {!showConfirmation ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Recommend New Work</DialogTitle>
              <DialogDescription>
                Submit a new work recommendation for approval and budget allocation.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="financialYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Financial Year</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Financial Year" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {FINANCIAL_YEARS.map((year) => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="implementingAgency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Implementing Agency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select IA" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {implementingAgencies.map((ia) => (
                              <SelectItem key={ia.id} value={ia.name}>
                                {ia.name} ({ia.code})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="sector"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sector</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Sector" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {SECTORS.map((sector) => (
                            <SelectItem key={sector} value={sector}>
                              {sector}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Name</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter detailed work description"
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="recommendedWorkAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recommended Work Amount (₹ in Lakhs)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="Enter amount in lakhs"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value) * 100000)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="scheme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Scheme</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Scheme" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SCHEMES.map((scheme) => (
                              <SelectItem key={scheme} value={scheme}>
                                {scheme}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="mlaRecommendationLetter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MLA Recommendation Letter</FormLabel>
                      <FormControl>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileChange}
                            className="hidden"
                            id="file-upload"
                          />
                          <label htmlFor="file-upload" className="cursor-pointer">
                            <div className="flex flex-col items-center space-y-2">
                              {fileName ? (
                                <>
                                  <FileText className="h-8 w-8 text-primary" />
                                  <span className="text-sm font-medium">{fileName}</span>
                                  <span className="text-xs text-muted-foreground">Click to change file</span>
                                </>
                              ) : (
                                <>
                                  <Upload className="h-8 w-8 text-muted-foreground" />
                                  <span className="text-sm text-muted-foreground">
                                    Click to upload recommendation letter
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    PDF, DOC, DOCX up to 10MB
                                  </span>
                                </>
                              )}
                            </div>
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">MLA Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name:</span>
                      <div className="font-medium">{currentMLA.name}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Constituency:</span>
                      <div className="font-medium">{currentMLA.constituency}</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Submit Recommendation
                  </Button>
                </div>
              </form>
            </Form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Confirm Submission</DialogTitle>
              <DialogDescription>
                Please review your work recommendation details before final submission.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                <h4 className="font-medium">Work Recommendation Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Financial Year:</span>
                    <div className="font-medium">{submittedData?.financialYear}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Implementing Agency:</span>
                    <div className="font-medium">{submittedData?.implementingAgency}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Sector:</span>
                    <div className="font-medium">{submittedData?.sector}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Amount:</span>
                    <div className="font-medium">₹{submittedData ? (submittedData.recommendedWorkAmount / 100000).toFixed(1) : 0} L</div>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Work Name:</span>
                  <div className="font-medium">{submittedData?.workName}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Scheme:</span>
                  <div className="font-medium">{submittedData?.scheme}</div>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">MLA Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Name:</span>
                    <div className="font-medium">{currentMLA.name}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Constituency:</span>
                    <div className="font-medium">{currentMLA.constituency}</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowConfirmation(false)}>
                  Back to Edit
                </Button>
                <Button onClick={handleConfirmSubmission}>
                  Confirm & Download PDF
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}