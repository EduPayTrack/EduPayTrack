import type { FormEvent } from 'react';

import type { OcrPreview, UploadedReceipt } from '../../../types/api';
import { formatMoney } from '../../../utils/format';

type StudentReceiptToolsProps = {
  selectedFile: File | null;
  uploading: boolean;
  uploadedReceipt: UploadedReceipt | null;
  ocrText: string;
  ocrLoading: boolean;
  ocrPreview: OcrPreview | null;
  onFileSelect: (file: File | null) => void;
  onUpload: () => void;
  onOcrTextChange: (value: string) => void;
  onPreviewOcr: () => void;
};

export function StudentReceiptTools({
  selectedFile,
  uploading,
  uploadedReceipt,
  ocrText,
  ocrLoading,
  ocrPreview,
  onFileSelect,
  onUpload,
  onOcrTextChange,
  onPreviewOcr,
}: StudentReceiptToolsProps) {
  const handleUploadSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onUpload();
  };

  const handleOcrSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void onPreviewOcr();
  };

  return (
    <>
      <section className="action-card">
        <div className="card-head">
          <div>
            <p className="section-kicker">Step 1</p>
            <h3>Upload receipt</h3>
          </div>
        </div>

        <form className="stack-form" onSubmit={handleUploadSubmit}>
          <label className="upload-dropzone">
            <span>Choose a receipt file</span>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={(event) => onFileSelect(event.target.files?.[0] ?? null)}
            />
            <strong>{selectedFile?.name ?? 'No file selected yet'}</strong>
          </label>

          <button className="primary-button" disabled={uploading} type="submit">
            {uploading ? 'Uploading...' : 'Upload receipt'}
          </button>
        </form>

        {uploadedReceipt ? (
          <div className="inline-note">
            Uploaded: {uploadedReceipt.originalName}
            <br />
            Proof URL saved for payment submission.
          </div>
        ) : null}
      </section>

      <section className="action-card">
        <div className="card-head">
          <div>
            <p className="section-kicker">Step 2</p>
            <h3>Preview OCR hints</h3>
          </div>
        </div>

        <form className="stack-form" onSubmit={handleOcrSubmit}>
          <label>
            <span>Paste OCR text from the receipt</span>
            <textarea
              rows={6}
              value={ocrText}
              onChange={(event) => onOcrTextChange(event.target.value)}
              placeholder="Example: Amount MWK 250,000 Ref TXN-44591 Date 2026-03-18"
            />
          </label>

          <button className="secondary-button" disabled={ocrLoading} type="submit">
            {ocrLoading ? 'Parsing...' : 'Preview extracted values'}
          </button>
        </form>

        {ocrPreview ? (
          <div className="ocr-preview">
            <div>
              <span>Amount</span>
              <strong>
                {ocrPreview.amount ? formatMoney(ocrPreview.amount) : 'Not found'}
              </strong>
            </div>
            <div>
              <span>Reference</span>
              <strong>{ocrPreview.reference ?? 'Not found'}</strong>
            </div>
            <div>
              <span>Date</span>
              <strong>{ocrPreview.paymentDate ?? 'Not found'}</strong>
            </div>
            <div>
              <span>Confidence</span>
              <strong>{Math.round(ocrPreview.confidence * 100)}%</strong>
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
