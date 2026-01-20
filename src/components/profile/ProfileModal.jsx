
import { useState, useRef, useEffect } from 'react';
import { uploadFile, deleteFile, downloadFile, listFiles } from '../../services/storage';
import { Button } from '../ui';

export function ProfileModal({ isOpen, onClose, session }) {
    const [avatarPath, setAvatarPath] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    // Storage key helper
    const getStorageKey = () => `avatar_path_${session?.user?.id || 'anon'}`;

    // Initialize path from storage when session changes or modal opens
    useEffect(() => {
        if (session?.user?.id) {
            const savedPath = localStorage.getItem(getStorageKey());
            if (savedPath) {
                setAvatarPath(savedPath);
            }
        }
    }, [session?.user?.id, session?.access_token]);

    const fetchAvatarFromServer = async () => {
        if (!session?.access_token) return;

        try {
            console.log("Fetching avatar list...");
            const response = await listFiles("", session);

            // Supabase storage.list returns { data: [], error: null } usually
            const files = response.data || response;

            if (Array.isArray(files)) {
                const prefix = session.access_token.slice(0, 8);
                const userFile = files.find(f => f.name.startsWith(prefix));

                if (userFile) {
                    console.log("Found avatar:", userFile.name);
                    setAvatarPath(userFile.name);
                    localStorage.setItem(getStorageKey(), userFile.name);
                } else {
                    console.log("No avatar found for user.");
                }
            } else {
                console.warn("Unexpected avatar list response:", response);
            }
        } catch (err) {
            console.error("Failed to list files:", err);
        }
    };

    useEffect(() => {
        if (isOpen) {
            if (avatarPath && !avatarUrl) {
                loadAvatar();
            } else if (!avatarPath) {
                fetchAvatarFromServer();
            }
        }
    }, [isOpen, avatarPath]);

    const loadAvatar = async () => {
        try {
            setLoading(true);
            const res = await downloadFile(avatarPath, session);

            if (typeof res === 'string' && (res.startsWith('http') || res.startsWith('blob:'))) {
                setAvatarUrl(res);
            } else if (res && res.signedUrl) {
                setAvatarUrl(res.signedUrl);
            } else if (res instanceof Blob) {
                setAvatarUrl(URL.createObjectURL(res));
            } else {
                if (res.url) setAvatarUrl(res.url);
            }
        } catch (err) {
            console.error('Failed to load avatar:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setError('');
        setLoading(true);

        try {
            await uploadFile(file, session);

            // Generating path as per user request logic
            const generatedPath = `${session.access_token.slice(0, 8)}-${file.name}`;

            setAvatarPath(generatedPath);
            localStorage.setItem(getStorageKey(), generatedPath);

            setAvatarUrl(URL.createObjectURL(file));

        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload profile picture');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!avatarPath) return;

        if (!confirm('Are you sure you want to delete your profile picture?')) return;

        setLoading(true);
        try {
            await deleteFile(avatarPath, session);
            setAvatarPath(null);
            setAvatarUrl(null);
            localStorage.removeItem(getStorageKey());
        } catch (err) {
            console.error('Delete error:', err);
            setError('Failed to delete image');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadClick = async () => {
        if (!avatarPath) return;
        try {
            if (avatarUrl) {
                const a = document.createElement('a');
                a.href = avatarUrl;
                a.download = avatarPath.split('-').slice(1).join('-') || 'avatar';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                await loadAvatar();
            }
        } catch (e) {
            setError('Download failed');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative"
                onClick={e => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-6">Profile</h2>

                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-24 h-24 rounded-full bg-neutral-800 border-2 border-neutral-700 overflow-hidden flex items-center justify-center relative group">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-neutral-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </div>
                            )}
                        </div>

                        <div className="text-neutral-300">
                            <p className="font-medium text-lg">{session?.user?.email}</p>
                            <p className="text-xs text-neutral-500 mt-1">User ID: {session?.user?.id?.slice(0, 8)}...</p>
                        </div>

                        <div className="w-full space-y-3 mt-4">

                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={handleFileSelect}
                            />

                            <Button
                                variant="primary"
                                className="w-full flex items-center justify-center gap-2"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={loading}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                {avatarPath ? 'Change Picture' : 'Upload Picture'}
                            </Button>

                            {avatarPath && (
                                <div className="flex gap-2">
                                    <Button
                                        variant="secondary"
                                        className="flex-1 flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300"
                                        onClick={handleDownloadClick}
                                        disabled={loading}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                        Download
                                    </Button>
                                    <Button
                                        variant="danger"
                                        className="flex-1 flex items-center justify-center gap-2 bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/50"
                                        onClick={handleDelete}
                                        disabled={loading}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                        Delete
                                    </Button>
                                </div>
                            )}
                        </div>

                        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
