import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';

import { uploadProfilePicture, deleteProfilePicture } from '../../services/auth';
import { API_BASE_URL } from '../../config/env';

function resolveImageUrl(url: string | null | undefined): string | null {
    if (!url) return null;

    // Already a full URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    // Relative path like /uploads/filename
    if (url.startsWith('/')) {
        // Remove trailing slash from API_BASE_URL if present
        const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
        return `${baseUrl}${url}`;
    }

    // Just a filename, assume it's in uploads
    const baseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    return `${baseUrl}/uploads/${url}`;
}

type ProfilePictureCardProps = {
    token: string;
    currentPictureUrl?: string | null;
    title?: string;
    onError: (message: string) => void;
    onSuccess: (message: string) => void;
    onPictureUpdated?: (pictureUrl: string | null) => void;
};

export function ProfilePictureCard({
    token,
    currentPictureUrl,
    title = 'Update your profile picture',
    onError,
    onSuccess,
    onPictureUpdated,
}: ProfilePictureCardProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [imageLoadError, setImageLoadError] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset image load error when currentPictureUrl changes
    useEffect(() => {
        setImageLoadError(false);
    }, [currentPictureUrl]);

    function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            onError('Only image files are allowed');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            onError('File size must be less than 5MB');
            return;
        }

        setSelectedFile(file);
        onError('');

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
    }

    async function handleUpload(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!selectedFile) return;

        setSubmitting(true);
        onError('');
        onSuccess('');

        try {
            const result = await uploadProfilePicture(token, selectedFile);
            setSelectedFile(null);
            setPreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            onSuccess('Profile picture updated successfully');
            onPictureUpdated?.(result.user.profilePictureUrl ?? null);
        } catch (error) {
            onError(error instanceof Error ? error.message : 'Failed to upload profile picture');
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete() {
        if (!currentPictureUrl) return;

        setSubmitting(true);
        onError('');
        onSuccess('');

        try {
            await deleteProfilePicture(token);
            onSuccess('Profile picture deleted successfully');
            onPictureUpdated?.(null);
        } catch (error) {
            onError(error instanceof Error ? error.message : 'Failed to delete profile picture');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="action-card">
            <div className="card-head">
                <div>
                    <p className="section-kicker">Profile</p>
                    <h3>{title}</h3>
                </div>
            </div>

            <div className="profile-picture-section">
                {currentPictureUrl && !imageLoadError && (
                    <div className="current-picture">
                        <img
                            src={resolveImageUrl(currentPictureUrl || undefined) || undefined}
                            alt="Current profile picture"
                            className="profile-picture-preview"
                            onError={() => {
                                console.error('Failed to load image from URL:', resolveImageUrl(currentPictureUrl || undefined));
                                console.error('Original URL:', currentPictureUrl);
                                setImageLoadError(true);
                            }}
                        />
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={submitting}
                            className="danger-button"
                        >
                            {submitting ? 'Removing...' : 'Remove picture'}
                        </button>
                    </div>
                )}

                <form className="stack-form" onSubmit={handleUpload}>
                    <label>
                        <span>Select a new picture</span>
                        <input
                            id="profilePicture"
                            name="profilePicture"
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                        />
                    </label>

                    {preview && (
                        <div className="preview-section">
                            <p>Preview:</p>
                            <img src={preview} alt="Preview" className="profile-picture-preview" />
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={!selectedFile || submitting}
                        className="primary-button"
                    >
                        {submitting ? 'Uploading...' : 'Upload picture'}
                    </button>
                </form>
            </div>

            <style>{`
        .profile-picture-section {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-height: 600px;
          overflow-y: auto;
        }

        .current-picture {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          align-items: center;
        }

        .profile-picture-preview {
          width: 120px;
          height: 120px;
          min-width: 120px;
          min-height: 120px;
          max-width: 120px;
          max-height: 120px;
          border-radius: 50%;
          object-fit: cover;
          object-position: center;
          border: 2px solid #e5e7eb;
          background-color: #f3f4f6;
          display: block;
          margin: 0 auto;
        }

        .preview-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          max-height: 250px;
          overflow-y: auto;
        }

        .danger-button {
          padding: 0.5rem 1rem;
          background-color: #ef4444;
          color: white;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          font-weight: 500;
        }

        .danger-button:hover:not(:disabled) {
          background-color: #dc2626;
        }

        .danger-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>
        </section>
    );
}
