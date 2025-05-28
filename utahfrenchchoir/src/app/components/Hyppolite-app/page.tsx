/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Eye, 
  Mail, 
  Calendar, 
  User, 
  Phone, 
  Music,
  RefreshCw,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  Heart,
  Users,
  Camera,
  Send
} from 'lucide-react';
import { supabase } from '@/app/lib/supabaseClient';

// TypeScript interface for application data
interface Application {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  application_date: string;
  physical_address: string;
  musical_background: string;
  picture_url?: string;
  speaks_french: boolean;
  has_musical_skills: boolean;
  favorite_voice: string;
  is_religious: boolean;
  congregation?: string | null;
  gender: string;
  rehearsal_time_works: boolean;
  marital_status: string;
  volunteer_willingness: boolean;
  church_restriction_comfortable: boolean;
  status?: string;
  created_at: string;
  [key: string]: any; // Index signature for dynamic property access
}

type SortableFields = 'created_at' | 'application_date' | 'full_name';

export default function ChoirAdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [voiceFilter, setVoiceFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortableFields>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Application>>({});
  const [messageData, setMessageData] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasStatusColumn, setHasStatusColumn] = useState(false);

  // Check if status column exists
  const checkStatusColumn = async () => {
    try {
      // Try to select status column specifically
      const { data, error } = await supabase
        .from('choir_applications')
        .select('status')
        .limit(1);
      
      if (error && error.message.includes('status')) {
        setHasStatusColumn(false);
        console.log('Status column does not exist in the database');
      } else {
        setHasStatusColumn(true);
        console.log('Status column exists in the database');
      }
    } catch (error) {
      console.log('Could not check status column, assuming it does not exist');
      setHasStatusColumn(false);
    }
  };

  // Fetch applications from Supabase
  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('choir_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch applications: ${error.message}`);
      }

      // Add default status if it doesn't exist
      const applicationsWithStatus = (data || []).map(app => ({
        ...app,
        status: app.status || 'pending'
      }));

      setApplications(applicationsWithStatus);
      console.log('Fetched applications:', applicationsWithStatus);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch applications');
    } finally {
      setIsLoading(false);
    }
  };

  // Load applications on component mount
  useEffect(() => {
    checkStatusColumn();
    fetchApplications();
  }, []);

  // Statistics
  const stats = {
    total: applications.length,
    pending: applications.filter(a => (a.status || 'pending') === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    frenchSpeakers: applications.filter(a => a.speaks_french).length,
    musicalSkills: applications.filter(a => a.has_musical_skills).length
  };

  // Filter and search functionality
  useEffect(() => {
    let filtered = applications;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.phone.includes(searchTerm) ||
        app.musical_background.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => (app.status || 'pending') === statusFilter);
    }

    // Voice filter
    if (voiceFilter !== 'all') {
      filtered = filtered.filter(app => app.favorite_voice === voiceFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortOrder === 'asc' ? -1 : 1;
      if (bValue == null) return sortOrder === 'asc' ? 1 : -1;

      if (sortBy === 'created_at' || sortBy === 'application_date') {
        aValue = new Date(aValue as string);
        bValue = new Date(bValue as string);
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter, voiceFilter, sortBy, sortOrder]);

  // Status update functions - Updated to handle missing status column
  const updateApplicationStatus = async (id: number, newStatus: string) => {
    setIsLoading(true);
    try {
      if (hasStatusColumn) {
        // If status column exists, update it
        const { error } = await supabase
          .from('choir_applications')
          .update({ status: newStatus })
          .eq('id', id);

        if (error) {
          throw new Error(`Failed to update status: ${error.message}`);
        }
      } else {
        // If status column doesn't exist, create it first
        console.log('Status column not found. Please add it to your database schema.');
        setError('Status column does not exist in the database. Please add it using the SQL command provided.');
        return;
      }
      
      // Update local state
      setApplications(prev => prev.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      ));

      // Show message modal for status updates
      const application = applications.find(app => app.id === id);
      if (application) {
        setSelectedApplication(application);
        setMessageData({
          type: newStatus,
          message: newStatus === 'approved' 
            ? `Congratulations ${application.full_name}! Your application has been approved. Welcome to the Utah French Choir!`
            : `Thank you ${application.full_name} for your interest. Unfortunately, we cannot accept your application at this time.`
        });
        setShowMessageModal(true);
      }

    } catch (error) {
      console.error('Error updating status:', error);
      setError(error instanceof Error ? error.message : 'Failed to update application status');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement email sending service
      // For now, just simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log(`Message sent to ${selectedApplication?.email}:`, messageData.message);
      setShowMessageModal(false);
      setMessageData({ type: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteApplication = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('choir_applications')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Failed to delete application: ${error.message}`);
      }

      // Update local state
      setApplications(prev => prev.filter(app => app.id !== id));
    } catch (error) {
      console.error('Error deleting application:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete application');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (application: Application) => {
    setEditFormData(application);
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    if (!editFormData.id) return;

    setIsLoading(true);
    try {
      // Remove status from update if column doesn't exist
      const updateData = { ...editFormData };
      if (!hasStatusColumn) {
        delete updateData.status;
      }

      const { error } = await supabase
        .from('choir_applications')
        .update(updateData)
        .eq('id', editFormData.id);

      if (error) {
        throw new Error(`Failed to update application: ${error.message}`);
      }
      
      // Update local state
      setApplications(prev => prev.map(app =>
        app.id === editFormData.id ? { ...app, ...editFormData } : app
      ));
      
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating application:', error);
      setError(error instanceof Error ? error.message : 'Failed to update application');
    } finally {
      setIsLoading(false);
    }
  };

  // PDF download functionality
  const downloadPDF = (application: Application) => {
    const pdfContent = `
CHOIR APPLICATION RECORD
========================

Personal Information:
Name: ${application.full_name}
Email: ${application.email}
Phone: ${application.phone}
Address: ${application.physical_address}
Gender: ${application.gender}
Marital Status: ${application.marital_status}
Application Date: ${application.application_date}

Musical Information:
Musical Background: ${application.musical_background}
Favorite Voice: ${application.favorite_voice}
Has Musical Skills: ${application.has_musical_skills ? 'Yes' : 'No'}

Language & Religious Information:
Speaks French: ${application.speaks_french ? 'Yes' : 'No'}
Religious: ${application.is_religious ? 'Yes' : 'No'}
Congregation: ${application.congregation || 'N/A'}

Availability & Commitment:
Rehearsal Time Works: ${application.rehearsal_time_works ? 'Yes' : 'No'}
Volunteer Willingness: ${application.volunteer_willingness ? 'Yes' : 'No'}
Church Restrictions Comfortable: ${application.church_restriction_comfortable ? 'Yes' : 'No'}

Application Status: ${(application.status || 'pending').toUpperCase()}
Created: ${new Date(application.created_at).toLocaleString()}
    `;

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `choir-application-${application.id}-${application.full_name.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    
    const icons: Record<string, React.ComponentType<{ className?: string }>> = {
      pending: Clock,
      approved: CheckCircle,
      rejected: AlertCircle
    };

    const Icon = icons[status];
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badges[status]}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getVoiceBadge = (voice: string) => {
    const colors: Record<string, string> = {
      'Soprano': 'bg-pink-100 text-pink-800',
      'Alto': 'bg-purple-100 text-purple-800',
      'Tenor': 'bg-blue-100 text-blue-800',
      'Bass': 'bg-gray-100 text-gray-800',
      'Other': 'bg-indigo-100 text-indigo-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${colors[voice] || colors['Other']}`}>
        <Music className="w-3 h-3 mr-1" />
        {voice}
      </span>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Choir Application Management</h1>
            <p className="text-gray-600">Manage and review all choir membership applications</p>
          </div>
          <button
            onClick={fetchApplications}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
        
        {/* Database Setup Warning */}
        {!hasStatusColumn && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-amber-600 mr-3 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-amber-800">Database Setup Required</h3>
                <p className="text-sm text-amber-700 mt-1">
                  The status column is missing from your choir_applications table. 
                  Please run the SQL command provided to add it, or status updates will not work.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <span className="text-red-700">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <FileText className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Applications</p>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(a => (a.status || 'pending') === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(a => a.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <X className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(a => a.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Heart className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">French Speakers</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(a => a.speaks_french).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Music className="w-8 h-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Musical Skills</p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter(a => a.has_musical_skills).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, phone, or musical background..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Voice Filter */}
          <select
            value={voiceFilter}
            onChange={(e) => setVoiceFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Voices</option>
            <option value="Soprano">Soprano</option>
            <option value="Alto">Alto</option>
            <option value="Tenor">Tenor</option>
            <option value="Bass">Bass</option>
            <option value="Other">Other</option>
          </select>

          {/* Sort */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as SortableFields);
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="created_at-desc">Newest First</option>
            <option value="created_at-asc">Oldest First</option>
            <option value="full_name-asc">Name A-Z</option>
            <option value="full_name-desc">Name Z-A</option>
            <option value="application_date-desc">Latest Applications</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Voice</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {application.picture_url ? (
                          <img 
                            className="h-12 w-12 rounded-full object-cover" 
                            src={application.picture_url} 
                            alt={application.full_name}
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{application.full_name}</div>
                        <div className="text-sm text-gray-500">{application.email}</div>
                        <div className="flex items-center mt-1">
                          {application.speaks_french && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-1">
                              🇫🇷 French
                            </span>
                          )}
                          {application.is_religious && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                              ⛪ Religious
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getVoiceBadge(application.favorite_voice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      {application.has_musical_skills && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          🎵 Musical
                        </span>
                      )}
                      {application.volunteer_willingness && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          🤝 Volunteer
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(application.status || 'pending')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(application.application_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {(application.status || 'pending') === 'pending' && hasStatusColumn && (
                        <>
                          <button
                            onClick={() => updateApplicationStatus(application.id, 'approved')}
                            disabled={isLoading}
                            className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            title="Approve"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(application.id, 'rejected')}
                            disabled={isLoading}
                            className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            title="Reject"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowDetailModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(application)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => downloadPDF(application)}
                        className="text-gray-600 hover:text-gray-900"
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteApplication(application.id)}
                        disabled={isLoading}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Section */}
                <div className="lg:col-span-1">
                  <div className="text-center mb-6">
                    {selectedApplication.picture_url ? (
                      <img 
                        src={selectedApplication.picture_url} 
                        alt={selectedApplication.full_name}
                        className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-gray-200"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
                        <Camera className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <h3 className="mt-4 text-xl font-bold text-gray-900">{selectedApplication.full_name}</h3>
                    <div className="mt-2">
                      {getStatusBadge(selectedApplication.status || 'pending')}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Quick Info</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                          <Music className="w-4 h-4 mr-2 text-gray-400" />
                          {getVoiceBadge(selectedApplication.favorite_voice)}
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          {selectedApplication.gender} • {selectedApplication.marital_status}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          {new Date(selectedApplication.application_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-800 mb-3">Skills & Preferences</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Speaks French:</span>
                          <span className={`text-sm font-medium ${selectedApplication.speaks_french ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedApplication.speaks_french ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Musical Skills:</span>
                          <span className={`text-sm font-medium ${selectedApplication.has_musical_skills ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedApplication.has_musical_skills ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Volunteer Willing:</span>
                          <span className={`text-sm font-medium ${selectedApplication.volunteer_willingness ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedApplication.volunteer_willingness ? 'Yes' : 'No'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Schedule Works:</span>
                          <span className={`text-sm font-medium ${selectedApplication.rehearsal_time_works ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedApplication.rehearsal_time_works ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      Contact Information
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-600">Email</label>
                        <div className="flex items-center mt-1">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm font-medium">{selectedApplication.email}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Phone</label>
                        <div className="flex items-center mt-1">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm font-medium">{selectedApplication.phone}</span>
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm text-gray-600">Address</label>
                        <div className="flex items-center mt-1">
                          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                          <span className="text-sm font-medium">{selectedApplication.physical_address}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                      <Music className="w-5 h-5 mr-2" />
                      Musical Background
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700 leading-relaxed">{selectedApplication.musical_background}</p>
                    </div>
                  </div>

                  {selectedApplication.is_religious && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <Heart className="w-5 h-5 mr-2" />
                        Religious Information
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-2">Congregation:</span>
                          <span className="text-sm font-medium">{selectedApplication.congregation || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Application Summary</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Application Date:</span>
                          <span className="font-medium">{new Date(selectedApplication.application_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Submitted:</span>
                          <span className="font-medium">{new Date(selectedApplication.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Church Comfortable:</span>
                          <span className={`font-medium ${selectedApplication.church_restriction_comfortable ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedApplication.church_restriction_comfortable ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => downloadPDF(selectedApplication)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </button>
                {(selectedApplication.status || 'pending') === 'pending' && hasStatusColumn && (
                  <>
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        updateApplicationStatus(selectedApplication.id, 'rejected');
                      }}
                      className="px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 flex items-center"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        setShowDetailModal(false);
                        updateApplicationStatus(selectedApplication.id, 'approved');
                      }}
                      className="px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 flex items-center"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Application</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={editFormData.full_name || ''}
                      onChange={(e) => setEditFormData({...editFormData, full_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={editFormData.email || ''}
                      onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={editFormData.phone || ''}
                      onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={editFormData.physical_address || ''}
                      onChange={(e) => setEditFormData({...editFormData, physical_address: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={editFormData.gender || ''}
                      onChange={(e) => setEditFormData({...editFormData, gender: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Non-binary">Non-binary</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                    <select
                      value={editFormData.marital_status || ''}
                      onChange={(e) => setEditFormData({...editFormData, marital_status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Favorite Voice</label>
                    <select
                      value={editFormData.favorite_voice || ''}
                      onChange={(e) => setEditFormData({...editFormData, favorite_voice: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Soprano">Soprano</option>
                      <option value="Alto">Alto</option>
                      <option value="Tenor">Tenor</option>
                      <option value="Bass">Bass</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {hasStatusColumn && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={editFormData.status || ''}
                        onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Congregation</label>
                    <input
                      type="text"
                      value={editFormData.congregation || ''}
                      onChange={(e) => setEditFormData({...editFormData, congregation: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="speaks_french"
                        checked={editFormData.speaks_french || false}
                        onChange={(e) => setEditFormData({...editFormData, speaks_french: e.target.checked})}
                        className="mr-2 text-blue-600"
                      />
                      <label htmlFor="speaks_french" className="text-sm text-gray-700">Speaks French</label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="has_musical_skills"
                        checked={editFormData.has_musical_skills || false}
                        onChange={(e) => setEditFormData({...editFormData, has_musical_skills: e.target.checked})}
                        className="mr-2 text-blue-600"
                      />
                      <label htmlFor="has_musical_skills" className="text-sm text-gray-700">Has Musical Skills</label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_religious"
                        checked={editFormData.is_religious || false}
                        onChange={(e) => setEditFormData({...editFormData, is_religious: e.target.checked})}
                        className="mr-2 text-blue-600"
                      />
                      <label htmlFor="is_religious" className="text-sm text-gray-700">Religious</label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="rehearsal_time_works"
                        checked={editFormData.rehearsal_time_works || false}
                        onChange={(e) => setEditFormData({...editFormData, rehearsal_time_works: e.target.checked})}
                        className="mr-2 text-blue-600"
                      />
                      <label htmlFor="rehearsal_time_works" className="text-sm text-gray-700">Rehearsal Time Works</label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="volunteer_willingness"
                        checked={editFormData.volunteer_willingness || false}
                        onChange={(e) => setEditFormData({...editFormData, volunteer_willingness: e.target.checked})}
                        className="mr-2 text-blue-600"
                      />
                      <label htmlFor="volunteer_willingness" className="text-sm text-gray-700">Willing to Volunteer</label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="church_restriction_comfortable"
                        checked={editFormData.church_restriction_comfortable || false}
                        onChange={(e) => setEditFormData({...editFormData, church_restriction_comfortable: e.target.checked})}
                        className="mr-2 text-blue-600"
                      />
                      <label htmlFor="church_restriction_comfortable" className="text-sm text-gray-700">Comfortable with Church Restrictions</label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Musical Background</label>
                <textarea
                  rows={4}
                  value={editFormData.musical_background || ''}
                  onChange={(e) => setEditFormData({...editFormData, musical_background: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Musical background and experience..."
                />
              </div>

              <div className="mt-8 flex justify-end space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 flex items-center"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Send {messageData.type === 'approved' ? 'Approval' : 'Rejection'} Message
                </h2>
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 h-10 w-10">
                    {selectedApplication?.picture_url ? (
                      <img 
                        className="h-10 w-10 rounded-full object-cover" 
                        src={selectedApplication.picture_url} 
                        alt={selectedApplication.full_name}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">To: {selectedApplication?.full_name}</p>
                    <p className="text-sm text-gray-500">{selectedApplication?.email}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    rows={8}
                    value={messageData.message}
                    onChange={(e) => setMessageData({...messageData, message: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your message..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !messageData.message.trim()}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white flex items-center ${
                    messageData.type === 'approved' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  } disabled:opacity-50`}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
            <RefreshCw className="h-6 w-6 mr-3 animate-spin text-blue-600" />
            <span className="text-gray-900 font-medium">Processing...</span>
          </div>
        </div>
      )}
    </div>
  );
}