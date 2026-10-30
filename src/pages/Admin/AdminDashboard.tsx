import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  BookOpen, 
  Award, 
  Briefcase, 
  Inbox,
  Trash2, 
  Edit2, 
  Save,
  Code,
  MessageCircle,
  Upload,
  ImageIcon,
  X,
  ExternalLink,
  DollarSign,
  Search
} from 'lucide-react';
import { useDataContext } from '../../context/DataContext';
import SEO from '../../components/SEO/SEO';

const API_BASE = window.location.port === '5173' ? 'http://localhost:5000' : '';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { 
    courses = {}, updateCourse, 
    placements = [], addPlacement, deletePlacement, clearAllPlacements, updatePlacement,
    jobs = [], addJob, deleteJob, updateJob,
    inquiries = [], deleteInquiry, refreshInquiries,
    projects = [], addProject, deleteProject,
    chatConversations = [], sendAdminReply, refreshChats
  } = useDataContext() || {};

  const [activeTab, setActiveTab] = useState<'courses' | 'placements' | 'jobs' | 'inquiries' | 'projects' | 'chats' | 'payments'>('courses');
  
  // Payments & UPI Settings states
  const [paymentsList, setPaymentsList] = useState<any[]>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [upiIdInput, setUpiIdInput] = useState('');
  const [upiQrFile, setUpiQrFile] = useState<File | null>(null);
  const [upiQrPreview, setUpiQrPreview] = useState('');
  const [updatingUpi, setUpdatingUpi] = useState(false);
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);
  const [rejectingPaymentId, setRejectingPaymentId] = useState<string | null>(null);
  const [failureReason, setFailureReason] = useState('');

  // Placements Search
  const [placementSearchQuery, setPlacementSearchQuery] = useState('');

  const handleMovePlacementToTop = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/placements/${id}/move-to-top`, {
        method: 'POST'
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (e) {
      console.error('Failed to move placement to top', e);
    }
  };

  const handleMovePlacementUp = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/placements/${id}/move-up`, { method: 'POST' });
      if (res.ok) window.location.reload();
    } catch (e) { console.error(e); }
  };

  const handleMovePlacementDown = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/placements/${id}/move-down`, { method: 'POST' });
      if (res.ok) window.location.reload();
    } catch (e) { console.error(e); }
  };

  const handleReversePlacementOrder = async () => {
    try {
      const token = sessionStorage.getItem('appteknow_admin_token');
      const res = await fetch(`${API_BASE}/api/placements-reverse-order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        window.location.reload();
      }
    } catch (e) {
      console.error('Failed to reverse order', e);
    }
  };

  const filteredPlacements = (placements || []).filter((p) => {
    const q = placementSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.company && p.company.toLowerCase().includes(q)) ||
      (p.role && p.role.toLowerCase().includes(q))
    );
  });

  // Job Drives Search & Sort
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [jobSortBy, setJobSortBy] = useState('recent');

  const filteredAndSortedJobs = (jobs || [])
    .filter((j) => {
      const q = jobSearchQuery.toLowerCase().trim();
      if (!q) return true;
      return (
        (j.title && j.title.toLowerCase().includes(q)) ||
        (j.company && j.company.toLowerCase().includes(q)) ||
        (j.location && j.location.toLowerCase().includes(q)) ||
        (j.status && j.status.toLowerCase().includes(q)) ||
        (j.description && j.description.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (jobSortBy === 'oldest') {
        return Number(a.id || 0) - Number(b.id || 0);
      }
      if (jobSortBy === 'company') {
        return (a.company || '').localeCompare(b.company || '');
      }
      if (jobSortBy === 'ctc') {
        const getCtcVal = (val: string) => {
          const m = (val || '').match(/(\d+(\.\d+)?)/);
          return m ? parseFloat(m[1]) : 0;
        };
        return getCtcVal(b.ctc) - getCtcVal(a.ctc);
      }
      // default 'recent'
      return Number(b.id || 0) - Number(a.id || 0);
    });

  // Fetch payments list
  const fetchPaymentsList = async () => {
    setLoadingPayments(true);
    try {
      const token = sessionStorage.getItem('appteknow_admin_token');
      const res = await fetch(`${API_BASE}/api/payments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setPaymentsList(data);
      }
    } catch (err) {
      console.error('Failed to fetch payments:', err);
    } finally {
      setLoadingPayments(false);
    }
  };

  // Fetch UPI details for configuration
  const fetchAdminUpiConfig = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/payment/upi-details`);
      if (res.ok) {
        const data = await res.json();
        if (data.upiId) setUpiIdInput(data.upiId);
        if (data.upiQrCode) {
          let cleanUrl = data.upiQrCode;
          if (cleanUrl.includes('localhost') || cleanUrl.includes('127.0.0.1')) {
            try {
              cleanUrl = new URL(cleanUrl).pathname;
            } catch (e) {
              const idx = cleanUrl.indexOf('/uploads');
              if (idx !== -1) cleanUrl = cleanUrl.substring(idx);
            }
          }
          setUpiQrPreview(cleanUrl);
        }
      }
    } catch (err) {
      console.error('Failed to fetch admin UPI settings:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'payments') {
      fetchPaymentsList();
      fetchAdminUpiConfig();
    }
  }, [activeTab]);

  const handleUpdateUpiConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingUpi(true);
    try {
      const token = sessionStorage.getItem('appteknow_admin_token');
      const formData = new FormData();
      formData.append('upiId', upiIdInput);
      if (upiQrFile) {
        formData.append('qrCode', upiQrFile);
      }

      const res = await fetch(`${API_BASE}/api/upi-details`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        if (data.upiId) setUpiIdInput(data.upiId);
        if (data.upiQrCode) {
          let cleanUrl = data.upiQrCode;
          if (cleanUrl.includes('localhost') || cleanUrl.includes('127.0.0.1')) {
            try {
              cleanUrl = new URL(cleanUrl).pathname;
            } catch (e) {
              const idx = cleanUrl.indexOf('/uploads');
              if (idx !== -1) cleanUrl = cleanUrl.substring(idx);
            }
          }
          setUpiQrPreview(cleanUrl);
        }
        setUpiQrFile(null);
        alert('UPI payment details updated successfully!');
      } else {
        const errData = await res.json();
        alert(errData.error || 'Failed to update UPI settings.');
      }
    } catch (err) {
      console.error('Failed to save UPI config:', err);
      alert('Network error. Please try again.');
    } finally {
      setUpdatingUpi(false);
    }
  };

  const handleApprovePayment = async (id: number) => {
    if (!window.confirm('Are you sure you want to approve this payment registration?')) return;
    try {
      const token = sessionStorage.getItem('appteknow_admin_token');
      const res = await fetch(`${API_BASE}/api/payments/${id}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        alert('Payment approved successfully!');
        fetchPaymentsList();
      } else {
        alert('Failed to approve payment.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingPaymentId) return;
    try {
      const token = sessionStorage.getItem('appteknow_admin_token');
      const res = await fetch(`${API_BASE}/api/payments/${rejectingPaymentId}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ failureMessage: failureReason })
      });
      if (res.ok) {
        alert('Payment rejected successfully.');
        setRejectingPaymentId(null);
        setFailureReason('');
        fetchPaymentsList();
      } else {
        alert('Failed to reject payment.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Course editing state
  const [editingCourseSlug, setEditingCourseSlug] = useState<string | null>(null);
  const [courseForm, setCourseForm] = useState<any>(null);

  // Placement adding state
  const [newPlacement, setNewPlacement] = useState({ name: '', company: '', role: '', package: '', studentImage: '' });
  const [placementImageFile, setPlacementImageFile] = useState<File | null>(null);
  const [placementImagePreview, setPlacementImagePreview] = useState('');
  const [uploadingPlacementImage, setUploadingPlacementImage] = useState(false);
  const [isDraggingPlacementImage, setIsDraggingPlacementImage] = useState(false);
  const placementImageRef = useRef<HTMLInputElement>(null);

  const processFileToDataUrl = (file: File) => {
    setPlacementImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPlacementImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handlePlacementDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPlacementImage(true);
  };

  const handlePlacementDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPlacementImage(false);
  };

  const handlePlacementDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPlacementImage(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processFileToDataUrl(file);
    }
  };

  const handlePlacementImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFileToDataUrl(file);
  };

  // Student Project adding state
  const [newProject, setNewProject] = useState({
    studentName: '',
    title: '',
    description: '',
    challengesSolved: '',
    techStackStr: '',
    placedCompany: '',
    courseId: 'java',
    liveUrl: '',
    githubUrl: '',
    thumbnailUrl: '',
    screenshots: [] as string[]
  });

  // Job Drive adding/editing state
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    exp: '',
    location: '',
    ctc: '',
    status: 'Active - Hiring Now',
    hot: false,
    description: ''
  });
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [editingPlacementId, setEditingPlacementId] = useState<string | null>(null);

  // Upload state
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [screenshotFiles, setScreenshotFiles] = useState<File[]>([]);
  const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingScreenshots, setUploadingScreenshots] = useState(false);
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const screenshotsRef = useRef<HTMLInputElement>(null);

  // Chat state
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');

  useEffect(() => {
    if (sessionStorage.getItem('appteknow_admin_authenticated') !== 'true') {
      navigate('/admin');
    } else {
      if (refreshInquiries) refreshInquiries();
    }
  }, [navigate, refreshInquiries]);

  // Periodically refresh chats & inquiries every 3 seconds for same-tab polling
  useEffect(() => {
    const interval = setInterval(() => {
      if (refreshChats) refreshChats();
      if (refreshInquiries) refreshInquiries();
    }, 3000);
    return () => clearInterval(interval);
  }, [refreshChats, refreshInquiries]);

  const handleLogout = () => {
    sessionStorage.removeItem('appteknow_admin_authenticated');
    sessionStorage.removeItem('appteknow_admin_token');
    navigate('/admin');
  };

  // -----------------------------------------
  // Course Handlers
  // -----------------------------------------
  const startEditCourse = (slug: string, course: any) => {
    setEditingCourseSlug(slug);
    setCourseForm({ ...course });
  };

  const saveEditedCourse = () => {
    if (editingCourseSlug && courseForm && updateCourse) {
      updateCourse(editingCourseSlug, courseForm);
      setEditingCourseSlug(null);
      setCourseForm(null);
      alert('Course curriculum synchronized with live environment!');
    }
  };

  const updateCourseFormArray = (field: 'topics', index: number, value: string) => {
    if (!courseForm || !courseForm[field]) return;
    const updatedArr = [...courseForm[field]];
    updatedArr[index] = value;
    setCourseForm({ ...courseForm, [field]: updatedArr });
  };


  // -----------------------------------------
  // Placement Handlers
  // -----------------------------------------

  const getPlacementImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('data:') || url.startsWith('https://')) return url;
    let cleanUrl = url;
    if (cleanUrl.startsWith('http://localhost:5000')) {
      cleanUrl = cleanUrl.replace('http://localhost:5000', '');
    }
    const apiBase = window.location.port === '5173' ? 'http://localhost:5000' : '';
    return `${apiBase}${cleanUrl.startsWith('/') ? '' : '/'}${cleanUrl}`;
  };

  const uploadPlacementImage = async (): Promise<string> => {
    if (!placementImageFile) return '';
    setUploadingPlacementImage(true);
    try {
      const formData = new FormData();
      formData.append('image', placementImageFile);
      const res = await fetch(`${API_BASE}/api/upload/single`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        return data.url;
      }
    } catch (err) {
      console.error('Failed to upload placement image', err);
    } finally {
      setUploadingPlacementImage(false);
    }
    return placementImagePreview;
  };

  const handleAddPlacement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlacement.name && newPlacement.company) {
      if (editingPlacementId) {
        // Update existing placement
        const imageUrl = placementImageFile ? await uploadPlacementImage() : undefined;
        const updateData: any = {
          name: newPlacement.name,
          company: newPlacement.company,
          role: newPlacement.role,
          package: newPlacement.package
        };
        if (imageUrl) updateData.studentImage = imageUrl;
        if (updatePlacement) updatePlacement(editingPlacementId, updateData);
        setEditingPlacementId(null);
        alert('Placement updated successfully!');
      } else {
        // Add new placement
        const imageUrl = await uploadPlacementImage();
        if (addPlacement) addPlacement({
          name: newPlacement.name,
          company: newPlacement.company,
          role: newPlacement.role,
          package: newPlacement.package,
          studentImage: imageUrl || undefined
        } as any);
        alert('Placement added successfully!');
      }
      setNewPlacement({ name: '', company: '', role: '', package: '', studentImage: '' });
      setPlacementImageFile(null);
      setPlacementImagePreview('');
      if (placementImageRef.current) placementImageRef.current.value = '';
    }
  };

  const startEditPlacement = (p: any) => {
    setEditingPlacementId(p.id.toString());
    setNewPlacement({
      name: p.name || '',
      company: p.company || '',
      role: p.role || '',
      package: p.package || '',
      studentImage: p.studentImage || ''
    });
    setPlacementImagePreview(p.studentImage || '');
  };

  const cancelEditPlacement = () => {
    setEditingPlacementId(null);
    setNewPlacement({ name: '', company: '', role: '', package: '', studentImage: '' });
    setPlacementImageFile(null);
    setPlacementImagePreview('');
    if (placementImageRef.current) placementImageRef.current.value = '';
  };

  // -----------------------------------------
  // Job Drive Handlers
  // -----------------------------------------
  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (newJob.title && newJob.company) {
      if (editingJobId) {
        // Update existing job
        if (updateJob) updateJob(editingJobId, {
          title: newJob.title,
          company: newJob.company,
          exp: newJob.exp,
          location: newJob.location,
          ctc: newJob.ctc,
          status: newJob.status,
          hot: newJob.hot,
          description: newJob.description
        });
        setEditingJobId(null);
        alert('Job drive updated successfully!');
      } else {
        // Add new job
        if (addJob) addJob({
          title: newJob.title,
          company: newJob.company,
          exp: newJob.exp,
          location: newJob.location,
          ctc: newJob.ctc,
          status: newJob.status,
          hot: newJob.hot,
          description: newJob.description
        });
        alert('Job drive referral successfully published!');
      }
      setNewJob({
        title: '',
        company: '',
        exp: '',
        location: '',
        ctc: '',
        status: 'Active - Hiring Now',
        hot: false,
        description: ''
      });
    }
  };

  const startEditJob = (job: any) => {
    setEditingJobId(job.id.toString());
    setNewJob({
      title: job.title || '',
      company: job.company || '',
      exp: job.exp || '',
      location: job.location || '',
      ctc: job.ctc || '',
      status: job.status || 'Active - Hiring Now',
      hot: job.hot || false,
      description: job.description || ''
    });
  };

  const cancelEditJob = () => {
    setEditingJobId(null);
    setNewJob({
      title: '',
      company: '',
      exp: '',
      location: '',
      ctc: '',
      status: 'Active - Hiring Now',
      hot: false,
      description: ''
    });
  };


  // -----------------------------------------
  // Student Project Handlers
  // -----------------------------------------
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleScreenshotsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setScreenshotFiles(prev => [...prev, ...files]);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setScreenshotPreviews(prev => [...prev, ...newPreviews]);
  };

  const removeScreenshotPreview = (idx: number) => {
    setScreenshotFiles(prev => prev.filter((_, i) => i !== idx));
    setScreenshotPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const uploadThumbnail = async (): Promise<string> => {
    if (!thumbnailFile) return newProject.thumbnailUrl;
    const token = sessionStorage.getItem('appteknow_admin_token');
    setUploadingThumbnail(true);
    try {
      const formData = new FormData();
      formData.append('image', thumbnailFile);
      const res = await fetch(`${API_BASE}/api/upload/single`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        return data.url;
      }
    } catch {}
    finally { setUploadingThumbnail(false); }
    return thumbnailPreview;
  };

  const uploadScreenshots = async (): Promise<string[]> => {
    if (!screenshotFiles.length) return newProject.screenshots;
    const token = sessionStorage.getItem('appteknow_admin_token');
    setUploadingScreenshots(true);
    try {
      const formData = new FormData();
      screenshotFiles.forEach(f => formData.append('images', f));
      const res = await fetch(`${API_BASE}/api/upload/multiple`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        return data.urls;
      }
    } catch {}
    finally { setUploadingScreenshots(false); }
    return screenshotPreviews;
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.studentName || !newProject.title || !addProject) return;

    const techArray = newProject.techStackStr
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const [resolvedThumbnail, resolvedScreenshots] = await Promise.all([
      uploadThumbnail(),
      uploadScreenshots()
    ]);

    addProject({
      studentName: newProject.studentName,
      title: newProject.title,
      description: newProject.description,
      challengesSolved: newProject.challengesSolved,
      techStack: techArray.length > 0 ? techArray : ['React', 'Java'],
      placedCompany: newProject.placedCompany,
      courseId: newProject.courseId,
      liveUrl: newProject.liveUrl,
      githubUrl: newProject.githubUrl,
      thumbnailUrl: resolvedThumbnail,
      screenshots: resolvedScreenshots
    });

    setNewProject({
      studentName: '', title: '', description: '', challengesSolved: '',
      techStackStr: '', placedCompany: '', courseId: 'java',
      liveUrl: '', githubUrl: '', thumbnailUrl: '', screenshots: []
    });
    setThumbnailFile(null);
    setThumbnailPreview('');
    setScreenshotFiles([]);
    setScreenshotPreviews([]);
    if (thumbnailRef.current) thumbnailRef.current.value = '';
    if (screenshotsRef.current) screenshotsRef.current.value = '';
  };

  // Reusable Styles
  const darkInputStyle: React.CSSProperties = {
    width: '100%',
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '8px',
    padding: '10px 14px',
    color: 'white',
    fontSize: '0.9rem',
    outline: 'none',
    marginBottom: '12px'
  };

  const tableHeaderStyle: React.CSSProperties = {
    padding: '12px 16px',
    background: '#0f172a',
    textAlign: 'left',
    color: '#94a3b8',
    fontSize: '0.8rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: 600,
    borderBottom: '1px solid #334155'
  };

  const tableCellStyle: React.CSSProperties = {
    padding: '16px',
    borderBottom: '1px solid #1e293b',
    fontSize: '0.9rem'
  };

  return (
    <>
      <SEO title="Command Console - Operations Control" description="Platform administration terminal." />
      <div style={{ 
        minHeight: '100vh', 
        background: '#020617', 
        color: '#f8fafc', 
        fontFamily: 'var(--font-heading)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <header style={{ 
          background: '#0f172a', 
          borderBottom: '1px solid #1e293b', 
          padding: '16px 30px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
              padding: '6px 12px', 
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '1px'
            }}>SYS ADMIN</div>
            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>AppTeknow Live Control Panel</span>
          </div>
          
          <button 
            onClick={handleLogout}
            style={{ 
              background: 'transparent', 
              border: '1px solid #ef4444', 
              color: '#ef4444', 
              borderRadius: '8px', 
              padding: '8px 16px', 
              fontSize: '0.85rem', 
              fontWeight: 600,
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <LogOut size={15} /> Terminate Session
          </button>
        </header>

        <div style={{ display: 'flex', flex: 1 }}>
          <aside style={{ 
            width: '260px', 
            background: '#090d16', 
            borderRight: '1px solid #1e293b',
            padding: '20px 15px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { id: 'courses', label: 'Curriculums', icon: <BookOpen size={18} /> },
                { id: 'placements', label: 'Placed Alumni', icon: <Award size={18} /> },
                { id: 'projects', label: 'Student Projects', icon: <Code size={18} /> },
                { id: 'jobs', label: 'Job Drive Referrals', icon: <Briefcase size={18} /> },
                { id: 'payments', label: 'Payments & UPI', icon: <DollarSign size={18} />, badge: paymentsList.filter(p => p.status === 'Pending').length || 0 },
                { id: 'inquiries', label: 'Student Leads', icon: <Inbox size={18} />, badge: inquiries?.length || 0 },
                { id: 'chats', label: 'Live Chats', icon: <MessageCircle size={18} />, badge: chatConversations?.filter(c => c.status === 'active').length || 0 }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as any); setEditingCourseSlug(null); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    background: activeTab === tab.id ? '#1e293b' : 'transparent',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    color: activeTab === tab.id ? '#3b82f6' : '#94a3b8',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {tab.icon}
                    {tab.label}
                  </div>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span style={{ background: '#ef4444', color: 'white', borderRadius: '12px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 800 }}>{tab.badge}</span>
                  )}
                </button>
              ))}
            </div>
          </aside>

          <main style={{ flex: 1, padding: '40px', overflowY: 'auto', maxHeight: 'calc(100vh - 73px)' }}>
            
            {activeTab === 'courses' && (
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '20px' }}>Curriculum Management Engine</h2>
                {!editingCourseSlug ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {Object.entries(courses || {}).map(([slug, course]: [string, any]) => (
                      <div key={slug} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                          <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>{course?.duration}</span>
                          <span style={{ color: '#eab308', fontSize: '0.85rem', fontWeight: 600 }}>★ {course?.rating?.split(' ')[0]}</span>
                        </div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px' }}>{course?.title}</h3>
                        <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '20px' }}>{course?.tagline}</p>
                        <button onClick={() => startEditCourse(slug, course)} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', color: 'white', borderRadius: '10px', padding: '10px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <Edit2 size={14} /> Modify Curriculum
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #1e293b', paddingBottom: '20px' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Editing: {courseForm?.title}</h3>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={() => setEditingCourseSlug(null)} style={{ background: 'transparent', border: '1px solid #475569', color: '#94a3b8', borderRadius: '8px', padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                        <button onClick={saveEditedCourse} style={{ background: '#10b981', border: 'none', color: 'white', borderRadius: '8px', padding: '8px 20px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Save size={16} /> Save Changes
                        </button>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Title</label>
                        <input style={darkInputStyle} value={courseForm?.title || ''} onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })} />
                        <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Tagline</label>
                        <textarea style={{ ...darkInputStyle, minHeight: '80px' }} value={courseForm?.tagline || ''} onChange={(e) => setCourseForm({ ...courseForm, tagline: e.target.value })} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '15px', color: '#60a5fa' }}>Topics</h4>
                        {courseForm?.topics?.map((topic: string, idx: number) => (
                          <input key={idx} style={darkInputStyle} value={topic} onChange={(e) => updateCourseFormArray('topics', idx, e.target.value)} />
                        ))}
                      </div>
                    </div>
                    <hr style={{ border: '0', borderTop: '1px solid #1e293b', margin: '30px 0' }} />
                    <div style={{ marginTop: '24px' }}>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Inbox size={16} /> Welcome Email Customization Template
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                        <div>
                          <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Email Course Matching Key (Read-Only)</label>
                          <input style={{ ...darkInputStyle, background: '#090d16', color: '#64748b', cursor: 'not-allowed' }} readOnly value={courseForm?.emailKey || ''} />
                          
                          <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Email Course Display Name</label>
                          <input style={darkInputStyle} placeholder="e.g. Full Stack Java Development with AI" value={courseForm?.emailDisplayName || ''} onChange={(e) => setCourseForm({ ...courseForm, emailDisplayName: e.target.value })} />
                          
                          <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Syllabus PDF Brochure URL</label>
                          <input style={darkInputStyle} placeholder="e.g. https://appteknow.com/brochures/syllabus.pdf" value={courseForm?.brochureUrl || ''} onChange={(e) => setCourseForm({ ...courseForm, brochureUrl: e.target.value })} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Tools Covered (comma-separated)</label>
                          <input style={darkInputStyle} placeholder="Java, Spring Boot, Git, Docker" value={courseForm?.emailTools ? courseForm.emailTools.join(', ') : ''} onChange={(e) => setCourseForm({ ...courseForm, emailTools: e.target.value.split(',').map(s => s.trim()) })} />
                          
                          <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Welcome Key Highlights (one per line)</label>
                          <textarea style={{ ...darkInputStyle, minHeight: '100px' }} placeholder="Spring Boot microservices architecture coding&#10;Production-grade database modeling" value={courseForm?.emailHighlights ? courseForm.emailHighlights.join('\n') : ''} onChange={(e) => setCourseForm({ ...courseForm, emailHighlights: e.target.value.split('\n').filter(s => s.trim().length > 0) })} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'placements' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0 }}>Alumni Placements</h2>
                  
                  {/* Admin Only Display Order Settings Card */}
                  <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '12px', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '0.85rem', color: 'white', fontWeight: 700 }}>Order Management</span>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>New alumni added will ALWAYS land at the VERY TOP!</span>
                    </div>

                    <button
                      type="button"
                      onClick={handleReversePlacementOrder}
                      style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '9px 16px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        whiteSpace: 'nowrap'
                      }}
                      title="Flips existing alumni list order. New entries added afterwards will still be placed at position #1 at the top."
                    >
                      🔄 Reverse Existing Order
                    </button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '40px' }}>
                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', alignSelf: 'start' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#60a5fa', marginBottom: '20px', letterSpacing: '0.5px' }}>
                      {editingPlacementId ? '📋 EDIT PLACEMENT' : '📋 ADD NEW PLACEMENT'}
                    </h3>
                    <form onSubmit={handleAddPlacement}>
                      <input style={darkInputStyle} required placeholder="Candidate Name" value={newPlacement.name} onChange={(e) => setNewPlacement({ ...newPlacement, name: e.target.value })} />
                      <input style={darkInputStyle} required placeholder="Company" value={newPlacement.company} onChange={(e) => setNewPlacement({ ...newPlacement, company: e.target.value })} />
                      <input style={darkInputStyle} required placeholder="Role" value={newPlacement.role} onChange={(e) => setNewPlacement({ ...newPlacement, role: e.target.value })} />
                      <input style={darkInputStyle} required placeholder="Package" value={newPlacement.package} onChange={(e) => setNewPlacement({ ...newPlacement, package: e.target.value })} />
                      
                      {/* Drag & Drop Photo Uploader */}
                      <div style={{ marginBottom: '20px' }}>
                        <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '8px', textAlign: 'left' }}>
                          Candidate Photo (Avatar / Poster)
                        </label>
                        
                        <div
                          onDragOver={handlePlacementDragOver}
                          onDragLeave={handlePlacementDragLeave}
                          onDrop={handlePlacementDrop}
                          onClick={() => placementImageRef.current?.click()}
                          style={{
                            border: isDraggingPlacementImage ? '2px dashed #38bdf8' : '2px dashed #334155',
                            borderRadius: '12px',
                            padding: '16px',
                            textAlign: 'center',
                            background: isDraggingPlacementImage ? 'rgba(56, 189, 248, 0.12)' : '#1e293b',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            position: 'relative'
                          }}
                        >
                          <input 
                            type="file" 
                            accept="image/*" 
                            ref={placementImageRef} 
                            style={{ display: 'none' }} 
                            onChange={handlePlacementImageChange} 
                          />

                          {placementImagePreview ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                              <img 
                                src={getPlacementImageUrl(placementImagePreview)} 
                                alt="Candidate Preview" 
                                style={{ 
                                  width: '80px', 
                                  height: '80px', 
                                  borderRadius: '12px', 
                                  objectFit: 'cover',
                                  border: '2px solid #38bdf8',
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                                }} 
                              />
                              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>Click or drop to replace</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPlacementImageFile(null);
                                    setPlacementImagePreview('');
                                    if (placementImageRef.current) placementImageRef.current.value = '';
                                  }}
                                  style={{
                                    background: 'rgba(239, 68, 68, 0.2)',
                                    color: '#f87171',
                                    border: '1px solid rgba(239, 68, 68, 0.4)',
                                    borderRadius: '6px',
                                    padding: '2px 8px',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer'
                                  }}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                              <div style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '50%',
                                background: 'rgba(56, 189, 248, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#38bdf8'
                              }}>
                                <Upload size={20} />
                              </div>
                              <div>
                                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>
                                  Drag & Drop Photo Here
                                </p>
                                <p style={{ margin: '3px 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>
                                  or click to choose photo from computer
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <button type="submit" disabled={uploadingPlacementImage} style={{ width: '100%', background: '#3b82f6', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', marginBottom: editingPlacementId ? '10px' : '0px', opacity: uploadingPlacementImage ? 0.7 : 1 }}>
                        {uploadingPlacementImage ? 'Uploading Image...' : (editingPlacementId ? 'Update Placement' : 'Add Placement')}
                      </button>
                      
                      {editingPlacementId && (
                        <button type="button" onClick={cancelEditPlacement} style={{ width: '100%', background: '#475569', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
                          Cancel Edit
                        </button>
                      )}
                    </form>
                  </div>
                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', overflow: 'hidden' }}>
                    {/* Alumni Search & Sort Bar */}
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input
                          type="text"
                          placeholder="Search alumni by student name, company, or role..."
                          value={placementSearchQuery}
                          onChange={(e) => setPlacementSearchQuery(e.target.value)}
                          style={{
                            width: '100%',
                            background: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            padding: '10px 14px 10px 38px',
                            color: 'white',
                            fontSize: '0.85rem',
                            outline: 'none'
                          }}
                        />
                        {placementSearchQuery && (
                          <button
                            type="button"
                            onClick={() => setPlacementSearchQuery('')}
                            style={{
                              position: 'absolute',
                              right: '12px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'transparent',
                              border: 'none',
                              color: '#94a3b8',
                              cursor: 'pointer'
                            }}
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8', whiteSpace: 'nowrap', fontWeight: 600 }}>
                          Showing {filteredPlacements.length} of {(placements || []).length}
                        </span>
                        {(placements || []).length > 0 && (
                          <button
                            type="button"
                            onClick={async () => {
                              if (confirm('Are you sure you want to clear ALL placement records? This will empty the placements list.')) {
                                if (clearAllPlacements) {
                                  await clearAllPlacements();
                                }
                              }
                            }}
                            style={{
                              background: 'rgba(239, 68, 68, 0.15)',
                              color: '#f87171',
                              border: '1px solid rgba(239, 68, 68, 0.4)',
                              borderRadius: '8px',
                              padding: '6px 12px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Clear All
                          </button>
                        )}
                      </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={tableHeaderStyle}>Candidate</th>
                          <th style={tableHeaderStyle}>Company</th>
                          <th style={tableHeaderStyle}>Role</th>
                          <th style={tableHeaderStyle}>Package</th>
                          <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPlacements.length > 0 ? (
                          filteredPlacements.map((p, idx) => (
                            <tr key={p.id || idx}>
                              <td style={tableCellStyle}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  {p.studentImage ? (
                                    <img src={getPlacementImageUrl(p.studentImage)} alt={p.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid #334155' }} />
                                  ) : (
                                    <div style={{
                                      width: '36px',
                                      height: '36px',
                                      borderRadius: '50%',
                                      background: '#1e293b',
                                      color: '#94a3b8',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: '0.85rem',
                                      fontWeight: 700,
                                      border: '1.5px solid #334155'
                                    }}>
                                      {p.name ? p.name.charAt(0) : 'A'}
                                    </div>
                                  )}
                                  <span style={{ fontWeight: 600 }}>{p.name}</span>
                                </div>
                              </td>
                              <td style={tableCellStyle}>{p.company}</td>
                              <td style={tableCellStyle}>{p.role}</td>
                              <td style={{ ...tableCellStyle, color: '#10b981', fontWeight: 700 }}>{p.package}</td>
                              <td style={{ ...tableCellStyle, textAlign: 'right' }}>
                                <button onClick={() => handleMovePlacementToTop(p.id)} title="Move candidate to top of list" style={{ background: '#1e293b', border: '1px solid #10b981', borderRadius: '6px', padding: '5px 9px', color: '#10b981', marginRight: '5px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                                  🔝 Top
                                </button>
                                <button onClick={() => handleMovePlacementUp(p.id)} title="Move UP 1 position" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', padding: '5px 8px', color: '#38bdf8', marginRight: '5px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                                  ▲
                                </button>
                                <button onClick={() => handleMovePlacementDown(p.id)} title="Move DOWN 1 position" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', padding: '5px 8px', color: '#38bdf8', marginRight: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                                  ▼
                                </button>
                                <button onClick={() => startEditPlacement(p)} title="Edit Placement" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', padding: '5px 8px', color: '#3b82f6', marginRight: '5px', cursor: 'pointer' }}>
                                  <Edit2 size={15} />
                                </button>
                                <button onClick={() => deletePlacement?.(p.id)} title="Delete Placement" style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', padding: '5px 8px', color: '#ef4444', cursor: 'pointer' }}>
                                  <Trash2 size={15} />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                              No alumni candidates found matching "{placementSearchQuery}".
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '20px' }}>Student Projects</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '480px 1fr', gap: '30px', alignItems: 'start' }}>

                  {/* ── LEFT: Upload Form ── */}
                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '28px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#60a5fa', marginBottom: '20px', letterSpacing: '0.5px' }}>📋 NEW PROJECT</h3>
                    <form onSubmit={handleAddProject}>
                      <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Student Name *</label>
                      <input style={darkInputStyle} required placeholder="e.g. Rahul Sharma" value={newProject.studentName} onChange={(e) => setNewProject({ ...newProject, studentName: e.target.value })} />

                      <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Project Title *</label>
                      <input style={darkInputStyle} required placeholder="e.g. TrustNet Banking App" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} />

                      <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Description *</label>
                      <textarea style={{ ...darkInputStyle, minHeight: '70px', resize: 'vertical' }} required placeholder="What does this project do?" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} />

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Placed Company</label>
                          <input style={darkInputStyle} placeholder="e.g. Wipro" value={newProject.placedCompany} onChange={(e) => setNewProject({ ...newProject, placedCompany: e.target.value })} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Course</label>
                          <select style={{ ...darkInputStyle, cursor: 'pointer' }} value={newProject.courseId} onChange={(e) => setNewProject({ ...newProject, courseId: e.target.value })}>
                            <option value="java">Java Full Stack</option>
                            <option value="python">Python Full Stack</option>
                            <option value="mern">MERN Stack</option>
                            <option value="data-science">Data Science</option>
                          </select>
                        </div>
                      </div>

                      <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Tech Stack (comma separated)</label>
                      <input style={darkInputStyle} placeholder="React, Java, Spring Boot, MySQL" value={newProject.techStackStr} onChange={(e) => setNewProject({ ...newProject, techStackStr: e.target.value })} />

                      <div>
                        <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Live URL</label>
                        <input style={darkInputStyle} placeholder="https://..." value={newProject.liveUrl} onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })} />
                      </div>

                      {/* ── Thumbnail Upload ── */}
                      <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Thumbnail Image</label>
                      <div
                        onClick={() => thumbnailRef.current?.click()}
                        style={{
                          border: '2px dashed #334155', borderRadius: '10px', padding: '16px',
                          textAlign: 'center', cursor: 'pointer', marginBottom: '12px',
                          background: thumbnailPreview ? 'transparent' : '#0d1724',
                          transition: 'border-color 0.2s'
                        }}
                      >
                        {thumbnailPreview ? (
                          <img src={thumbnailPreview} alt="thumbnail" style={{ width: '100%', maxHeight: '120px', objectFit: 'cover', borderRadius: '8px' }} />
                        ) : (
                          <div style={{ color: '#475569' }}>
                            <ImageIcon size={24} style={{ margin: '0 auto 6px' }} />
                            <div style={{ fontSize: '0.8rem' }}>Click to upload thumbnail</div>
                            <div style={{ fontSize: '0.7rem', marginTop: '2px', color: '#334155' }}>JPG, PNG, WEBP · Max 5MB</div>
                          </div>
                        )}
                      </div>
                      <input ref={thumbnailRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleThumbnailChange} />

                      {/* ── Screenshots Upload ── */}
                      <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '8px' }}>Screenshots (up to 10)</label>
                      <div
                        onClick={() => screenshotsRef.current?.click()}
                        style={{
                          border: '2px dashed #334155', borderRadius: '10px', padding: '14px',
                          textAlign: 'center', cursor: 'pointer', marginBottom: '12px',
                          background: '#0d1724'
                        }}
                      >
                        <Upload size={20} style={{ margin: '0 auto 6px', color: '#475569' }} />
                        <div style={{ fontSize: '0.8rem', color: '#475569' }}>Click to add screenshots</div>
                      </div>
                      <input ref={screenshotsRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleScreenshotsChange} />

                      {screenshotPreviews.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '16px' }}>
                          {screenshotPreviews.map((src, i) => (
                            <div key={i} style={{ position: 'relative' }}>
                              <img src={src} alt={`screenshot-${i}`} style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #334155' }} />
                              <button
                                type="button"
                                onClick={() => removeScreenshotPreview(i)}
                                style={{ position: 'absolute', top: '3px', right: '3px', background: '#ef4444', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
                              >
                                <X size={11} color="white" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={uploadingThumbnail || uploadingScreenshots}
                        style={{ width: '100%', background: uploadingThumbnail || uploadingScreenshots ? '#1e3a5f' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      >
                        <Upload size={16} />
                        {uploadingThumbnail || uploadingScreenshots ? 'Uploading files...' : 'Publish Project'}
                      </button>
                    </form>
                  </div>

                  {/* ── RIGHT: Project Cards ── */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {(projects || []).length === 0 && (
                      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '40px', textAlign: 'center', color: '#475569' }}>
                        No projects published yet.
                      </div>
                    )}
                    {(projects || []).map((proj, idx) => (
                      <div key={proj.id || idx} style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', gap: '16px', padding: '20px' }}>
                          {proj.thumbnailUrl ? (
                            <img src={proj.thumbnailUrl} alt={proj.title} style={{ width: '90px', height: '70px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }} />
                          ) : (
                            <div style={{ width: '90px', height: '70px', background: '#1e293b', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <Code size={24} color="#475569" />
                            </div>
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '2px' }}>{proj.title}</div>
                                <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '6px' }}>by {proj.studentName} · {proj.courseId}</div>
                              </div>
                              <button onClick={() => deleteProject?.(proj.id)} style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '0.75rem', flexShrink: 0 }}>Delete</button>
                            </div>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              {(proj.techStack || []).slice(0, 5).map((tech: string, i: number) => (
                                <span key={i} style={{ background: 'rgba(59,130,246,0.1)', color: '#60a5fa', borderRadius: '6px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 600 }}>{tech}</span>
                              ))}
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                              {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer" style={{ color: '#10b981', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}><ExternalLink size={12} /> Live</a>}
                            </div>
                          </div>
                        </div>
                        {(proj.screenshots || []).length > 0 && (
                          <div style={{ borderTop: '1px solid #1e293b', padding: '12px 20px' }}>
                            <div style={{ fontSize: '0.7rem', color: '#475569', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Screenshots ({proj.screenshots.length})</div>
                            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                              {proj.screenshots.map((src: string, i: number) => (
                                <img key={i} src={src} alt={`ss-${i}`} style={{ height: '60px', width: '100px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0, border: '1px solid #334155' }} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '20px' }}>Job Drive Referrals Management</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '30px', alignItems: 'start' }}>
                  {/* Form Side */}
                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#60a5fa', marginBottom: '20px', letterSpacing: '0.5px' }}>
                      {editingJobId ? '📋 EDIT JOB DRIVE' : '📋 ADD NEW JOB DRIVE'}
                    </h3>
                    <form onSubmit={handleAddJob}>
                      <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Job Title *</label>
                      <input style={darkInputStyle} required placeholder="e.g. Full Stack Java Developer" value={newJob.title} onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} />

                      <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Hiring Company *</label>
                      <input style={darkInputStyle} required placeholder="e.g. InnoTech Solutions" value={newJob.company} onChange={(e) => setNewJob({ ...newJob, company: e.target.value })} />

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Experience *</label>
                          <input style={darkInputStyle} required placeholder="e.g. 0-2 Years" value={newJob.exp} onChange={(e) => setNewJob({ ...newJob, exp: e.target.value })} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>CTC Range *</label>
                          <input style={darkInputStyle} required placeholder="e.g. 5.5 - 8.0 LPA" value={newJob.ctc} onChange={(e) => setNewJob({ ...newJob, ctc: e.target.value })} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Location *</label>
                          <input style={darkInputStyle} required placeholder="e.g. Bangalore" value={newJob.location} onChange={(e) => setNewJob({ ...newJob, location: e.target.value })} />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Status *</label>
                          <input style={darkInputStyle} required placeholder="e.g. Active - Hiring Now" value={newJob.status} onChange={(e) => setNewJob({ ...newJob, status: e.target.value })} />
                        </div>
                      </div>


                      <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Job Description & Role Details *</label>
                      <textarea 
                        style={{ ...darkInputStyle, minHeight: '120px', resize: 'vertical' }} 
                        required 
                        placeholder="Detail the technical stack, daily roles, eligibility criteria, and interview dates..." 
                        value={newJob.description} 
                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} 
                      />

                      <button type="submit" style={{ width: '100%', background: '#3b82f6', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '0.95rem', marginBottom: editingJobId ? '10px' : '0px' }}>
                        <Briefcase size={16} /> {editingJobId ? 'Update Job Referral' : 'Publish Job Referral'}
                      </button>
                      
                      {editingJobId && (
                        <button type="button" onClick={cancelEditJob} style={{ width: '100%', background: '#475569', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
                          Cancel Edit
                        </button>
                      )}
                    </form>
                  </div>

                  {/* List Side */}
                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', overflow: 'hidden' }}>
                    {/* Job Drives Search & Sort Bar */}
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '15px', flexWrap: 'wrap' }}>
                      <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        <input
                          type="text"
                          placeholder="Search jobs by title, company, location, CTC..."
                          value={jobSearchQuery}
                          onChange={(e) => setJobSearchQuery(e.target.value)}
                          style={{
                            width: '100%',
                            background: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            padding: '10px 14px 10px 38px',
                            color: 'white',
                            fontSize: '0.85rem',
                            outline: 'none'
                          }}
                        />
                        {jobSearchQuery && (
                          <button
                            onClick={() => setJobSearchQuery('')}
                            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.8rem' }}
                          >
                            ✕
                          </button>
                        )}
                      </div>

                      {/* Sort Dropdown */}
                      <select
                        value={jobSortBy}
                        onChange={(e) => setJobSortBy(e.target.value)}
                        style={{
                          background: '#1e293b',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          padding: '10px 14px',
                          color: '#38bdf8',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          outline: 'none',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="recent">⚡ Sort: Most Recent</option>
                        <option value="oldest">⌛ Sort: Oldest First</option>
                        <option value="company">🏢 Sort: Company (A-Z)</option>
                        <option value="ctc">💰 Sort: CTC (High to Low)</option>
                      </select>

                      <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                        Showing {filteredAndSortedJobs.length} of {(jobs || []).length}
                      </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr>
                          <th style={tableHeaderStyle}>Job Role</th>
                          <th style={tableHeaderStyle}>Company</th>
                          <th style={tableHeaderStyle}>CTC</th>
                          <th style={tableHeaderStyle}>Location</th>
                          <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAndSortedJobs.length === 0 ? (
                          <tr>
                            <td colSpan={5} style={{ ...tableCellStyle, textAlign: 'center', color: '#64748b', padding: '30px' }}>
                              No matching job drives found.
                            </td>
                          </tr>
                        ) : (
                          filteredAndSortedJobs.map((job, idx) => (
                            <tr key={job.id || idx}>
                              <td style={tableCellStyle}>
                                <div style={{ fontWeight: 700, color: 'white' }}>{job.title}</div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Exp: {job.exp}</div>
                              </td>
                              <td style={tableCellStyle}>{job.company}</td>
                              <td style={{ ...tableCellStyle, color: '#10b981', fontWeight: 700 }}>{job.ctc}</td>
                              <td style={tableCellStyle}>{job.location}</td>
                              <td style={{ ...tableCellStyle, textAlign: 'right' }}>
                                <button onClick={() => startEditJob(job)} style={{ background: 'transparent', border: 'none', color: '#3b82f6', marginRight: '10px', cursor: 'pointer' }}>
                                  <Edit2 size={18} />
                                </button>
                                <button onClick={() => deleteJob?.(job.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                                  <Trash2 size={18} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'inquiries' && (
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '20px' }}>Inquiries</h2>
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={tableHeaderStyle}>Student</th>
                        <th style={tableHeaderStyle}>Contact</th>
                        <th style={tableHeaderStyle}>Course</th>
                        <th style={{ ...tableHeaderStyle, textAlign: 'right' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(inquiries || []).map((inq, idx) => (
                        <tr key={inq.id || idx}>
                          <td style={tableCellStyle}>{inq.name}</td>
                          <td style={tableCellStyle}>{inq.email}<br/>{inq.phone}</td>
                          <td style={tableCellStyle}>{inq.course}</td>
                          <td style={{ ...tableCellStyle, textAlign: 'right' }}>
                            <button onClick={() => deleteInquiry?.(inq.id)} style={{ background: '#ef4444', border: 'none', color: 'white', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}>Resolve</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'chats' && (
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '20px' }}>Live Chats</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', minHeight: '400px' }}>
                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px' }}>
                    {(chatConversations || []).map(convo => (
                      <div key={convo.id} onClick={() => setActiveChatId(convo.id)} style={{ padding: '15px', borderBottom: '1px solid #1e293b', cursor: 'pointer', background: activeChatId === convo.id ? '#1e293b' : 'transparent' }}>
                        <div style={{ fontWeight: 700 }}>{convo.visitorName}</div>
                        <div style={{ fontSize: '0.8rem', color: '#3b82f6', marginBottom: '4px' }}>{convo.visitorPhone}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{convo.status}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                    {activeChatId ? (
                      <>
                        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
                          {(chatConversations.find(c => c.id === activeChatId)?.messages || []).map(msg => (
                            <div key={msg.id} style={{ marginBottom: '10px', textAlign: msg.senderType === 'admin' ? 'right' : 'left' }}>
                              <div style={{ display: 'inline-block', padding: '8px 12px', borderRadius: '12px', background: msg.senderType === 'admin' ? '#3b82f6' : '#1e293b' }}>
                                {msg.message}
                              </div>
                            </div>
                          ))}
                        </div>
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          if (adminReplyText.trim() && sendAdminReply) {
                            sendAdminReply(activeChatId, adminReplyText.trim());
                            setAdminReplyText('');
                          }
                        }} style={{ display: 'flex', gap: '10px' }}>
                          <input style={{ ...darkInputStyle, marginBottom: 0 }} value={adminReplyText} onChange={(e) => setAdminReplyText(e.target.value)} placeholder="Reply..." />
                          <button type="submit" style={{ background: '#3b82f6', border: 'none', color: 'white', borderRadius: '8px', padding: '0 20px' }}>Send</button>
                        </form>
                      </>
                    ) : <div style={{ textAlign: 'center', color: '#94a3b8', marginTop: '100px' }}>Select a chat</div>}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'payments' && (
              <div style={{ padding: '25px', color: 'white' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '20px' }}>Payments & UPI Configuration</h2>

                {/* UPI Settings Config Panel */}
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', marginBottom: '30px' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '1.15rem', color: '#f8fafc', fontWeight: 700 }}>Configure UPI Credentials</h3>
                  <form onSubmit={handleUpdateUpiConfig} style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div style={{ flex: '1 1 250px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>UPI ID *</label>
                      <input
                        type="text"
                        value={upiIdInput}
                        onChange={(e) => setUpiIdInput(e.target.value)}
                        required
                        style={{ ...darkInputStyle, marginBottom: 0 }}
                        placeholder="Enter UPI ID (e.g. pay@company)"
                      />
                    </div>
                    <div style={{ flex: '1 1 250px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>UPI QR Code Scanner (Upload Image)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setUpiQrFile(file);
                        }}
                        style={{
                          width: '100%',
                          padding: '10px',
                          border: '1px solid #1e293b',
                          borderRadius: '8px',
                          background: '#090d16',
                          color: '#94a3b8',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                    
                    {upiQrPreview && (
                      <div style={{ textAlign: 'center' }}>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#94a3b8', marginBottom: '4px' }}>Active QR:</span>
                        <img
                          src={upiQrPreview}
                          alt="UPI QR Scanner"
                          style={{ width: '40px', height: '40px', borderRadius: '4px', border: '1px solid #1e293b', cursor: 'pointer', objectFit: 'contain' }}
                          onClick={() => setLightboxImageUrl(upiQrPreview)}
                        />
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={updatingUpi}
                      style={{
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 24px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      {updatingUpi ? 'Saving Configuration...' : 'Update UPI Credentials'}
                    </button>
                  </form>
                </div>

                {/* Payments Log Table */}
                <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '1.15rem', color: '#f8fafc', fontWeight: 700 }}>Transaction Logs</h3>
                  {loadingPayments ? (
                    <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>Loading payment logs...</div>
                  ) : paymentsList.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>No transactions recorded yet.</div>
                  ) : (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #1e293b', color: '#94a3b8', textAlign: 'left' }}>
                            <th style={{ padding: '12px 10px' }}>Order ID</th>
                            <th style={{ padding: '12px 10px' }}>Student Info</th>
                            <th style={{ padding: '12px 10px' }}>Selected Course</th>
                            <th style={{ padding: '12px 10px' }}>Amount</th>
                            <th style={{ padding: '12px 10px' }}>Method</th>
                            <th style={{ padding: '12px 10px' }}>Receipt Screenshot</th>
                            <th style={{ padding: '12px 10px' }}>Status</th>
                            <th style={{ padding: '12px 10px', textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paymentsList.map((payment) => (
                            <tr key={payment.id} style={{ borderBottom: '1px solid #0f172a' }}>
                              <td style={{ padding: '12px 10px', fontWeight: 700, color: '#f1f5f9' }}>{payment.orderId}</td>
                              <td style={{ padding: '12px 10px' }}>
                                <div style={{ fontWeight: 600, color: '#f1f5f9' }}>{payment.studentName}</div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{payment.studentEmail}</div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{payment.studentPhone}</div>
                              </td>
                              <td style={{ padding: '12px 10px', color: '#cbd5e1' }}>{payment.courseSlug}</td>
                              <td style={{ padding: '12px 10px', fontWeight: 700, color: '#10b981' }}>₹{parseFloat(payment.amount).toLocaleString('en-IN')}</td>
                              <td style={{ padding: '12px 10px' }}>
                                <span style={{
                                  background: payment.paymentMode === 'UPI_SCREENSHOT' ? '#0369a1' : '#1e293b',
                                  color: '#e0f2fe',
                                  padding: '2px 8px',
                                  borderRadius: '6px',
                                  fontSize: '0.75rem',
                                  fontWeight: 700
                                }}>
                                  {payment.paymentMode === 'UPI_SCREENSHOT' ? 'UPI Manual' : 'Gateway Online'}
                                </span>
                              </td>
                              <td style={{ padding: '12px 10px' }}>
                                {payment.screenshotUrl ? (
                                  <img
                                    src={payment.screenshotUrl}
                                    alt="Receipt"
                                    style={{ width: '45px', height: '45px', borderRadius: '6px', cursor: 'pointer', objectFit: 'cover', border: '1px solid #1e293b' }}
                                    onClick={() => setLightboxImageUrl(payment.screenshotUrl)}
                                  />
                                ) : (
                                  <span style={{ color: '#64748b', fontSize: '0.8rem' }}>None</span>
                                )}
                              </td>
                              <td style={{ padding: '12px 10px' }}>
                                <span style={{
                                  background: payment.status === 'Success' ? '#065f46' : payment.status === 'Pending' ? '#92400e' : '#991b1b',
                                  color: payment.status === 'Success' ? '#d1fae5' : payment.status === 'Pending' ? '#fef3c7' : '#fee2e2',
                                  padding: '4px 10px',
                                  borderRadius: '12px',
                                  fontSize: '0.78rem',
                                  fontWeight: 800
                                }}>
                                  {payment.status}
                                </span>
                                {payment.status === 'Failure' && payment.failureMessage && (
                                  <div style={{ fontSize: '0.7rem', color: '#f87171', marginTop: '4px', maxWidth: '160px' }}>
                                    Reason: {payment.failureMessage}
                                  </div>
                                )}
                              </td>
                              <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                                {payment.status === 'Pending' && (
                                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                    <button
                                      onClick={() => handleApprovePayment(payment.id)}
                                      style={{
                                        background: '#10b981',
                                        border: 'none',
                                        color: 'white',
                                        borderRadius: '6px',
                                        padding: '6px 12px',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        cursor: 'pointer'
                                      }}
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => setRejectingPaymentId(payment.id.toString())}
                                      style={{
                                        background: '#ef4444',
                                        border: 'none',
                                        color: 'white',
                                        borderRadius: '6px',
                                        padding: '6px 12px',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        cursor: 'pointer'
                                      }}
                                    >
                                      Reject
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Screenshot Lightbox Modal overlay */}
      {lightboxImageUrl && (
        <div 
          onClick={() => setLightboxImageUrl(null)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0, 0, 0, 0.85)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }} onClick={(e) => e.stopPropagation()}>
            <img 
              src={lightboxImageUrl} 
              alt="Full Receipt" 
              style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)', border: '1px solid #1e293b' }} 
            />
            <button 
              onClick={() => setLightboxImageUrl(null)}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '2rem',
                cursor: 'pointer'
              }}
            >
              &times;
            </button>
          </div>
        </div>
      )}

      {/* Reject Payment modal dialog */}
      {rejectingPaymentId && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            background: '#0f172a',
            border: '1px solid #1e293b',
            borderRadius: '16px',
            padding: '24px',
            width: '400px',
            maxWidth: '90%'
          }}>
            <h3 style={{ margin: '0 0 12px 0', color: 'white', fontWeight: 700 }}>Reject Payment Registration</h3>
            <form onSubmit={handleRejectPayment}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: '#94a3b8' }}>Reason for Rejection *</label>
              <textarea
                value={failureReason}
                onChange={(e) => setFailureReason(e.target.value)}
                required
                placeholder="E.g., Screenshot is blurry or amount is incorrect."
                style={{
                  width: '100%',
                  height: '80px',
                  background: '#090d16',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  color: 'white',
                  padding: '10px',
                  fontSize: '0.88rem',
                  outline: 'none',
                  resize: 'none',
                  marginBottom: '16px'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => { setRejectingPaymentId(null); setFailureReason(''); }}
                  style={{
                    background: '#1e293b',
                    border: 'none',
                    color: '#cbd5e1',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#ef4444',
                    border: 'none',
                    color: 'white',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Reject Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
