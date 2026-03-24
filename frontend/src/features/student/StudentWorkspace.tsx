import { startTransition, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { API_BASE_URL } from '../../config/env';
import {
  getStudentDashboard,
  submitStudentPayment,
  uploadStudentReceipt,
  scanStudentReceipt,
} from '../../services/student';
import type { AuthResponse, DashboardResponse, OcrPreview, UploadedReceipt } from '../../types/api';
import { initialPaymentForm, type PaymentFormState } from '../../types/forms';

type StudentWorkspaceProps = {
  token: string;
  authUser: AuthResponse['user'];
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
};

export function StudentWorkspace({
  token,
  onError,
  onSuccess,
}: StudentWorkspaceProps) {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrStep, setOcrStep] = useState<string>('');
  const [submittingPayment, setSubmittingPayment] = useState(false);
  
  const [uploadedReceipt, setUploadedReceipt] = useState<UploadedReceipt | null>(null);
  const [ocrPreview, setOcrPreview] = useState<OcrPreview | null>(null);
  const [paymentForm, setPaymentForm] = useState<PaymentFormState>(initialPaymentForm);
  const [isVerified, setIsVerified] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadDashboard() {
    setDashboardLoading(true);
    try {
      const data = await getStudentDashboard(token);
      startTransition(() => {
        setDashboard(data);
      });
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to load dashboard');
    } finally {
      setDashboardLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, [token]);

  async function handleFileSelect(file: File) {
    setUploading(true);
    onError('');
    onSuccess('');
    // Reset state from any previous upload
    setUploadedReceipt(null);
    setOcrPreview(null);
    setIsVerified(false);

    try {
      const data = await uploadStudentReceipt(token, file);
      setUploadedReceipt(data);
      setPaymentForm((current) => ({
        ...current,
        proofUrl: `${API_BASE_URL}${data.proofUrl}`,
      }));
      onSuccess('Receipt uploaded. Scanning document...');
      
      // Auto trigger Python OCR scan
      void handleOcrScan(data);
      
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleOcrScan(receipt: UploadedReceipt) {
    setOcrLoading(true);
    setOcrStep('INITIALIZING AI ENGINE...');
    onError('');
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setOcrStep('ANALYZING DOCUMENT FIELDS...');
      
      const data = await scanStudentReceipt(token, receipt.fileName);
      setOcrStep('POPULATING DATA...');
      setOcrPreview(data);
      
      // Auto-fill form with OCR results (only overwrite empty fields)
      setPaymentForm((current) => ({
        ...current,
        amount: current.amount || (data.amount ? String(data.amount) : ''),
        externalReference: current.externalReference || data.reference || '',
        receiptNumber: current.receiptNumber || data.reference || '',
        paymentDate: current.paymentDate || data.paymentDate || '',
        registrationNumber: current.registrationNumber || data.registrationNumber || '',
        codeNumber: current.codeNumber || data.codeNumber || '',
        payerName: current.payerName || data.depositorName || '',
      }));

      // Auto-verify if OCR extracted sufficient data
      const hasMinData = data.amount && data.paymentDate && (data.registrationNumber || data.codeNumber);
      setIsVerified(Boolean(hasMinData));
      
      if (hasMinData) {
        onSuccess('Scan complete. Data auto-filled. Review and submit when ready.');
      } else {
        onSuccess('Scan complete. Please fill in any missing fields and click Verify.');
      }
    } catch (error) {
      console.error('OCR Error:', error);
      // Non-fatal — student can still fill in manually
      onError('AI scan could not read the document. Please fill in receipt details manually.');
    } finally {
      setOcrLoading(false);
      setOcrStep('');
      // ⚠️ Do NOT reset isVerified here — that would undo auto-verify from the try block
    }
  }

  function handleInputChange<K extends keyof PaymentFormState>(key: K, value: PaymentFormState[K]) {
    setPaymentForm(current => ({ ...current, [key]: value }));
    setIsVerified(false);
  }

  async function handlePaymentSubmit() {
    setSubmittingPayment(true);
    onError('');
    onSuccess('');

    try {
      await submitStudentPayment(token, {
        ...paymentForm,
        ocrText: ocrPreview?.rawText,
        ocrAmount: ocrPreview?.amount ?? undefined,
        ocrReference: ocrPreview?.reference ?? undefined,
        registrationNumber: paymentForm.registrationNumber,
        codeNumber: paymentForm.codeNumber,
      });

      setPaymentForm(initialPaymentForm);
      setUploadedReceipt(null);
      setOcrPreview(null);
      setIsVerified(false);
      onSuccess('Payment submitted successfully for verification.');
      await loadDashboard(); // Refresh Recent Submissions immediately
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Payment submission failed');
    } finally {
      setSubmittingPayment(false);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HeroPanel Section */}
      <section className="relative overflow-hidden bg-[#004e99] rounded-[1.5rem] p-8 lg:p-10 text-white shadow-xl shadow-[#004e99] animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2">Tuition Verification Hub</p>
            <h2 className="text-2xl md:text-3xl font-black font-headline tracking-tighter mb-2 leading-none text-white">Payment Processing Center</h2>
            <p className="text-blue-100/70 text-sm font-medium max-w-md">Your academic journey, seamlessly funded. Track every cent with professional precision.</p>
          </div>
          <div className="flex items-center space-x-4 md:space-x-8 shrink-0">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center font-black mb-2 border border-white/10">1</div>
              <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Submit</span>
            </div>
            <div className="w-8 h-px bg-white/20 hidden sm:block"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center font-black mb-2 border border-white/10">2</div>
              <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Review</span>
            </div>
            <div className="w-8 h-px bg-white/20 hidden sm:block"></div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center font-black mb-2 border border-white/10">3</div>
              <span className="text-[8px] font-black uppercase tracking-widest opacity-60">Track</span>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-10 pointer-events-none">
          <svg fill="none" height="300" viewBox="0 0 400 400" width="300" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" fill="white" r="200"></circle>
          </svg>
        </div>
      </section>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Summary Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#eff4ff] rounded-xl p-6 space-y-6 shadow-[0px_20px_40px_rgba(11,28,48,0.06)] border border-white">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#414752] block mb-2">Current Outstanding Balance</span>
              <div className="text-4xl font-extrabold font-headline text-[#004e99] tracking-tighter">MWK 2,450.00</div>
            </div>
            <div className="pt-6 border-t border-[#c1c6d4]/30">
              <span className="text-xs font-bold uppercase tracking-widest text-[#414752] block mb-2">Next Installment Due</span>
              <div className="flex items-center justify-between text-[#0b1c30]">
                <span className="text-lg font-semibold">MWK 850.00</span>
                <span className="px-3 py-1 bg-[#ffdadb] text-[#92002a] text-xs font-bold rounded-full">OCT 15, 2026</span>
              </div>
            </div>
          </div>
          
          <div className="glass-card bg-[#d3e4fe]/60 rounded-xl p-6 space-y-4 border border-white/40">
            <div className="flex items-center space-x-2 text-[#004e99]">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              <span className="font-bold text-sm uppercase tracking-wider">Intelligent Data Engine</span>
            </div>
            <p className="text-sm text-[#414752] italic leading-relaxed">
              "Our OCR engine is optimized to extract handwritten notes, REG numbers, and codes from physical receipts."
            </p>
          </div>

          {/* Verification Form - Moved to Left Column */}
          <div className="bg-white rounded-xl p-6 shadow-[0px_20px_40px_rgba(11,28,48,0.06)] border border-[#c1c6d4]/20 space-y-4 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="border-b border-slate-100 pb-2 mb-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-[#0b1c30]">VERIFICATION FORM</h3>
              <p className="text-[10px] text-[#414752]">Review and edit auto-filled OCR extracted data</p>
            </div>

            <div className="space-y-3">
              <div className="bg-[#f8faff] p-3 rounded-lg border border-[#c1c6d4]/30">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#414752]">Payment Date</span>
                  {ocrPreview?.paymentDate && (
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${paymentForm.paymentDate === ocrPreview.paymentDate ? 'bg-green-50 text-green-600 border-green-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>
                      AI: {ocrPreview.paymentDate}
                    </span>
                  )}
                </div>
                <input 
                  type="text" 
                  className="bg-transparent border-none p-0 focus:ring-0 text-sm font-bold w-full text-[#0b1c30]"
                  value={paymentForm.paymentDate}
                  onChange={e => handleInputChange('paymentDate', e.target.value)}
                  placeholder="DD MMM YYYY"
                />
              </div>

              <div className="bg-[#f8faff] p-3 rounded-lg border border-[#c1c6d4]/30">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#414752]">Amount (MWK)</span>
                  {ocrPreview?.amount && (
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${Number(paymentForm.amount) === Number(ocrPreview.amount) ? 'bg-green-50 text-green-600 border-green-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>
                      AI: {ocrPreview.amount}
                    </span>
                  )}
                </div>
                <input 
                  type="text" 
                  className="bg-transparent border-none p-0 focus:ring-0 text-lg font-black w-full text-[#004e99]"
                  value={paymentForm.amount}
                  onChange={e => handleInputChange('amount', e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="bg-[#f8faff] p-3 rounded-lg border border-[#c1c6d4]/30">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#414752]">Reference Number</span>
                  {ocrPreview?.reference && (
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${paymentForm.externalReference === ocrPreview.reference ? 'bg-green-50 text-green-600 border-green-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>
                      AI: {ocrPreview.reference}
                    </span>
                  )}
                </div>
                <input 
                  type="text" 
                  className="bg-transparent border-none p-0 focus:ring-0 text-xs font-mono font-semibold w-full text-[#0b1c30]"
                  value={paymentForm.externalReference}
                  onChange={e => handleInputChange('externalReference', e.target.value)}
                  placeholder="TRX-XXXXXX"
                />
              </div>

              <div className="bg-[#f8faff] p-3 rounded-lg border border-[#c1c6d4]/30">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#414752]">Depositor's Name</span>
                  {ocrPreview?.depositorName && (
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${paymentForm.payerName === ocrPreview.depositorName ? 'bg-green-50 text-green-600 border-green-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>
                      AI: {ocrPreview.depositorName}
                    </span>
                  )}
                </div>
                <input 
                  type="text" 
                  className="bg-transparent border-none p-0 focus:ring-0 text-sm font-bold w-full text-[#0b1c30]"
                  value={paymentForm.payerName}
                  onChange={e => handleInputChange('payerName', e.target.value)}
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#f8faff] p-3 rounded-lg border border-[#c1c6d4]/30">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#414752]">REG Number</span>
                    {ocrPreview?.registrationNumber && (
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${paymentForm.registrationNumber === ocrPreview.registrationNumber ? 'bg-green-50 text-green-600 border-green-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>
                        AI: {ocrPreview.registrationNumber}
                      </span>
                    )}
                  </div>
                  <input 
                    type="text" 
                    className="bg-transparent border-none p-0 focus:ring-0 text-xs font-bold w-full text-[#0b1c30]"
                    value={paymentForm.registrationNumber}
                    onChange={e => handleInputChange('registrationNumber', e.target.value)}
                    placeholder="REG-XXX"
                  />
                  <p className="text-[7px] text-[#414752] mt-0.5">Required for College/University students</p>
                </div>

                <div className="bg-[#f8faff] p-3 rounded-lg border border-[#c1c6d4]/30">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#414752]">Code Number</span>
                    {ocrPreview?.codeNumber && (
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded border ${paymentForm.codeNumber === ocrPreview.codeNumber ? 'bg-green-50 text-green-600 border-green-200' : 'bg-orange-50 text-orange-600 border-orange-200'}`}>
                        AI: {ocrPreview.codeNumber}
                      </span>
                    )}
                  </div>
                  <input 
                    type="text" 
                    className="bg-transparent border-none p-0 focus:ring-0 text-xs font-bold w-full text-[#0b1c30]"
                    value={paymentForm.codeNumber}
                    onChange={e => handleInputChange('codeNumber', e.target.value)}
                    placeholder="CODE-YYY"
                  />
                  <p className="text-[7px] text-[#414752] mt-0.5">Required for Primary/Secondary students</p>
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              {!isVerified ? (
                <button 
                  type="button"
                  onClick={() => setIsVerified(true)}
                  disabled={!paymentForm.amount || !paymentForm.paymentDate || !uploadedReceipt || (!paymentForm.registrationNumber && !paymentForm.codeNumber)}
                  className="w-full bg-[#f0f4ff] text-[#004e99] py-3 rounded-xl text-xs font-bold border border-[#004e99]/10 hover:bg-[#e5eeff] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-lg">fact_check</span>
                  <span>Verify Details</span>
                </button>
              ) : (
                <div className="w-full bg-green-50 text-green-700 py-3 rounded-xl text-xs font-bold border border-green-200 flex items-center justify-center space-x-2">
                  <span className="material-symbols-outlined text-lg">verified</span>
                  <span>Verified & Matched</span>
                </div>
              )}

              <button 
                type="button"
                onClick={() => void handlePaymentSubmit()}
                disabled={submittingPayment || !uploadedReceipt || !isVerified}
                className="w-full bg-[#004e99] text-white py-4 rounded-xl font-bold shadow-lg shadow-[#004e99]/20 hover:bg-[#0a66c2] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:grayscale"
              >
                <span className="material-symbols-outlined text-xl">send</span>
                <span>{submittingPayment ? 'Submitting...' : 'Submit Proof'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Upload Column */}
        <div id="upload-section" className="lg:col-span-2">
          <div className="bg-white rounded-xl p-8 shadow-[0px_20px_40px_rgba(11,28,48,0.06)] relative overflow-hidden h-full flex flex-col">
            <div className="mb-8">
              <h3 className="text-2xl font-bold font-headline tracking-tight text-[#0b1c30]">Verification Portal</h3>
              <p className="text-[#414752]">Accepted formats: PDF, PNG, JPG (Max 10MB)</p>
            </div>
            
            {/* Drag and Drop Zone */}
            <div 
              className={`border-2 border-dashed ${uploadedReceipt ? 'border-green-500/50 bg-green-50' : 'border-[#004e99]/20 bg-[#e5eeff]'} rounded-xl p-10 flex flex-col items-center justify-center text-center space-y-4 hover:border-[#004e99]/50 transition-colors duration-300 cursor-pointer group`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-300 ${uploadedReceipt ? 'bg-green-100 text-green-600 scale-110' : 'bg-[#d6e3ff] text-[#004e99] group-hover:scale-110'}`}>
                <span className="material-symbols-outlined text-4xl">{uploadedReceipt ? 'task_alt' : 'cloud_upload'}</span>
              </div>
              <div>
                <p className={`text-lg font-semibold ${uploadedReceipt ? 'text-green-800' : 'text-[#0b1c30]'}`}>
                  {uploading ? 'Uploading securely...' : (uploadedReceipt ? 'Receipt Uploaded Successfully!' : 'Drag & drop your receipt here')}
                </p>
                <p className="text-[#414752]">
                  {!uploading && !uploadedReceipt && (
                    <>or <span className="text-[#004e99] font-bold">browse files</span></>
                  )}
                  {uploadedReceipt && (
                    <span className="text-sm">Click to upload a different file</span>
                  )}
                </p>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".pdf,image/png,image/jpeg,image/jpg" 
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    void handleFileSelect(e.target.files[0]);
                  }
                }} 
              />
            </div>

            {/* OCR Prominent Visual Section (Always Visible) */}
            <div className="mt-8 pt-8 border-t border-outline-variant/20 animate-in fade-in duration-500">
              <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                <div className="flex items-center space-x-3">
                  <span className="relative flex h-3 w-3">
                    {ocrLoading && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>}
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
                  </span>
                  <h4 className="font-bold text-sm uppercase tracking-widest text-[#004e99]">
                    {ocrLoading ? ocrStep : 'AI Processing & Data Extraction'}
                  </h4>
                </div>
                {!ocrLoading && (ocrPreview || !uploadedReceipt) && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100">
                      <span className="material-symbols-outlined text-blue-600 text-lg mr-2" style={{ fontVariationSettings: "'FILL' 1" }}>shutter_speed</span>
                      <span className="text-xs font-bold text-blue-700">98.2% Average Confidence Score</span>
                    </div>
                    {uploadedReceipt && (
                      <button 
                        type="button"
                        onClick={() => void handleOcrScan(uploadedReceipt)}
                        className="flex items-center px-4 py-1.5 bg-[#e5eeff] hover:bg-[#d6e3ff] rounded-full border border-[#004e99]/20 text-[#004e99] transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm mr-1.5">document_scanner</span>
                        <span className="text-xs font-bold">Rescan</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Receipt Viewer with OCR Visuals */}
              <div className="w-full bg-slate-900 rounded-xl relative overflow-hidden shadow-2xl group border border-slate-700 min-h-[350px]">
                <img 
                  alt="Receipt verification" 
                  className={`w-full h-full object-cover transition-all duration-700 ${ocrLoading ? 'opacity-70 grayscale-[30%]' : 'opacity-100 grayscale-0'}`} 
                  src={paymentForm.proofUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuCvQC1222x4M5DYoc6rZyNDK_7GzbiEequq2UVVwVhaNnzZ6bdZgL7_WJPEokjiUOB8fPjl2DBtg-8x4f8q72nfmUGKxsH52nHBEIDXYtTnEQlJPjIQUNhOUjz8ZjuO57bCGfd6Nyut4mb6M8TNzPjklYvLTqTeZNOIujwFsO5ssPSJYDTSUFYi62TdX2MoxEmjaBlCWntdKhNsRSLnk03RHUQTjL18XVOcUp5ILG-wM7jD10i0G96_C7lxstW4X_vxR3EtEPPoZmnE"}
                />
                
                {/* Scanline animation overlay */}
                {ocrLoading && <div className="ocr-scanline"></div>}
                
                {/* OCR Bounding Boxes (Blue Overlays) */}
                {!ocrLoading && (ocrPreview || !uploadedReceipt) && (
                  <>
                    <div className="absolute top-[15%] left-[60%] w-[30%] h-6 border-2 border-blue-400 bg-blue-500/10 bounding-box-pulse rounded-sm flex items-start justify-end">
                      <span className="absolute -top-5 right-0 text-[10px] font-bold text-blue-400 uppercase tracking-tighter">DATE_VAL</span>
                    </div>
                    <div className="absolute top-[45%] left-[20%] w-[50%] h-10 border-2 border-blue-400 bg-blue-500/10 bounding-box-pulse rounded-sm flex items-start justify-end">
                      <span className="absolute -top-5 right-0 text-[10px] font-bold text-blue-400 uppercase tracking-tighter">TOTAL_AMOUNT</span>
                    </div>
                    <div className="absolute bottom-[20%] left-[10%] w-[40%] h-6 border-2 border-blue-400 bg-blue-500/10 bounding-box-pulse rounded-sm flex items-start justify-end">
                      <span className="absolute -top-5 right-0 text-[10px] font-bold text-blue-400 uppercase tracking-tighter">REF_NUM</span>
                    </div>
                    <div className="absolute top-[25%] left-[5%] w-[25%] h-5 border-2 border-emerald-400 bg-emerald-500/10 bounding-box-pulse rounded-sm flex items-start justify-end">
                      <span className="absolute -top-5 right-0 text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">REG_ID (Handwritten)</span>
                    </div>
                    <div className="absolute top-[35%] left-[5%] w-[20%] h-5 border-2 border-purple-400 bg-purple-500/10 bounding-box-pulse rounded-sm flex items-start justify-end">
                      <span className="absolute -top-5 right-0 text-[10px] font-bold text-purple-400 uppercase tracking-tighter">CODE_VAL (Handwritten)</span>
                    </div>
                  </>
                )}
                <div className="absolute inset-0 pointer-events-none border-[12px] border-slate-900/40"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent History Section */}
      <section id="history-section" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold font-headline text-[#0b1c30]">Recent Submissions</h3>
          <Link to="/student/history" className="text-sm font-bold text-[#004e99] hover:underline">View All History</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(!dashboard?.payments || dashboard.payments.length === 0) && !dashboardLoading ? (
            <div className="col-span-4 text-center py-6 text-[#414752]">No recent submissions found.</div>
          ) : (
            dashboard?.payments.slice(0, 4).map((payment) => (
              <div key={payment.id} className="bg-white p-4 rounded-xl shadow-[0px_20px_40px_rgba(11,28,48,0.06)] border border-white flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center
                  ${payment.status === 'APPROVED' ? 'bg-[#6cf8bb] text-[#00714d]' : 
                    payment.status === 'REJECTED' ? 'bg-[#ffdad6] text-[#ba1a1a]' : 
                    'bg-[#e5eeff] text-[#004e99]'}`}
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {payment.status === 'APPROVED' ? 'check_circle' : 
                     payment.status === 'REJECTED' ? 'error' : 'pending'}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-sm text-[#0b1c30]">MWK {payment.amount}</p>
                  <p className="text-[10px] uppercase font-black text-[#414752]">{payment.status}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
