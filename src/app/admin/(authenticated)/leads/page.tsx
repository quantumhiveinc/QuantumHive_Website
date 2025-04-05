'use client';

import React, { useState, useEffect, useCallback } from 'react';
// Assume Shadcn UI components are available via these paths
// Adjust imports based on actual project structure if different
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { DatePicker } from '@/components/ui/date-picker'; // Assuming a DatePicker component exists
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpDown, Download, Filter } from 'lucide-react'; // Import Filter icon

// Define the structure of a Lead object based on expected API response
interface Lead {
    id: string;
    fullName: string;
    email: string;
    company?: string;
    sourceFormName: string;
    status: 'New' | 'Contacted' | 'Qualified' | 'Lost' | 'Closed'; // Example statuses
    submissionTimestamp: string; // ISO string format from API
    // Add other fields as needed
    phone?: string;
    message?: string;
    [key: string]: unknown; // Allow for additional dynamic fields if necessary
}

interface LeadsApiResponse {
    leads: Lead[];
    totalLeads: number;
    totalPages: number;
    currentPage: number;
}

type SortField = 'fullName' | 'sourceFormName' | 'status' | 'submissionTimestamp';
type SortOrder = 'asc' | 'desc';

const AdminLeadsPage = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [totalLeads, setTotalLeads] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showFilters, setShowFilters] = useState(false); // State for filter visibility

    // --- State for Filters ---
    const [filters, setFilters] = useState({
        formName: '',
        status: '',
        startDate: '',
        endDate: '',
        search: '',
    });

    // --- State for Sorting ---
    const [sort, setSort] = useState<{ sortBy: SortField; sortOrder: SortOrder }>({
        sortBy: 'submissionTimestamp',
        sortOrder: 'desc',
    });

    const LEADS_PER_PAGE = 15; // Or fetch from settings/config

    // --- Fetch Leads Function ---
    const fetchLeads = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            params.append('page', currentPage.toString());
            params.append('limit', LEADS_PER_PAGE.toString());
            params.append('sortBy', sort.sortBy);
            params.append('sortOrder', sort.sortOrder);

            // Add filters to params if they have values
            if (filters.formName) params.append('formName', filters.formName);
            if (filters.status) params.append('status', filters.status);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);
            if (filters.search) params.append('search', filters.search);

            const response = await fetch(`/api/admin/leads?${params.toString()}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch leads: ${response.statusText}`);
            }
            const data: LeadsApiResponse = await response.json();
            setLeads(data.leads);
            setTotalLeads(data.totalLeads);
            setTotalPages(data.totalPages);
            // Ensure currentPage from response is used if API adjusts it
            setCurrentPage(data.currentPage);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setLeads([]);
            setTotalLeads(0);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [currentPage, filters, sort]); // Dependencies: refetch when these change

    // --- Initial Fetch and Refetch on State Change ---
    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]); // fetchLeads is memoized by useCallback

    // --- Handlers ---
    const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: (filterName === 'status' && value === 'all') ? '' : value
        }));
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleSortChange = (field: SortField) => {
        setSort(prev => ({
            sortBy: field,
            // Toggle order if same field is clicked, otherwise default to desc
            sortOrder: prev.sortBy === field && prev.sortOrder === 'desc' ? 'asc' : 'desc',
        }));
        setCurrentPage(1); // Reset to first page when sorting changes
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        // Include all current filters and sorting in the export URL
        params.append('sortBy', sort.sortBy);
        params.append('sortOrder', sort.sortOrder);
        if (filters.formName) params.append('formName', filters.formName);
        if (filters.status) params.append('status', filters.status);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
        if (filters.search) params.append('search', filters.search);

        // Trigger download
        window.location.href = `/api/admin/leads/export?${params.toString()}`;
    };

    const handleViewDetails = (lead: Lead) => {
        // Simple implementation: Log details to console
        console.log('Lead Details:', lead);
        // TODO: Implement modal or detail view navigation
        alert(`Viewing details for ${lead.fullName} (check console)`);
    };

    // --- Helper to format date ---
    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleString(); // Simple locale string format
        } catch (e) {
            console.error("Error formatting date:", dateString, e); // Log the error
            return 'Invalid Date';
        }
    };

    // --- Render Logic ---
    return (
        <div className="space-y-6">
            {/* Title and Filter Toggle Button */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Lead Management</h1>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    title={showFilters ? "Hide Filters" : "Show Filters"}
                    className={`
                        bg-accent text-accent-foreground hover:bg-accent hover:text-yellow-500
                    `}
                >
                    <Filter className="h-4 w-4 mr-1" />
                    Filters
                    <span className="sr-only">Toggle Filters</span>
                </Button>
            </div>

            {/* Filter Controls - Conditionally Rendered */}
            {showFilters && (
                <Card> {/* Wrap filters in a card again for visual grouping */}
                    <CardContent className="space-y-4 pt-6"> {/* Added pt-6 for padding */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <Input
                                placeholder="Search Name, Email, Company..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                            />
                            <Input
                                placeholder="Form Name"
                                value={filters.formName}
                                onChange={(e) => handleFilterChange('formName', e.target.value)}
                            />
                            <Select
                                value={filters.status}
                                onValueChange={(value) => handleFilterChange('status', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="New">New</SelectItem>
                                    <SelectItem value="Contacted">Contacted</SelectItem>
                                    <SelectItem value="Qualified">Qualified</SelectItem>
                                    <SelectItem value="Lost">Lost</SelectItem>
                                    <SelectItem value="Closed">Closed</SelectItem>
                                    {/* Add other statuses as needed */}
                                </SelectContent>
                            </Select>
                            {/* Replace with actual DatePicker components */}
                            <Input
                                type="date" // Basic date input, replace with DatePicker
                                placeholder="Start Date"
                                value={filters.startDate}
                                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                                />
                            <Input
                                type="date" // Basic date input, replace with DatePicker
                                placeholder="End Date"
                                value={filters.endDate}
                                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            />
                             {/* <DatePicker
                                date={filters.startDate ? new Date(filters.startDate) : undefined}
                                setDate={(date) => handleFilterChange('startDate', date ? date.toISOString().split('T')[0] : '')}
                                placeholder="Start Date"
                            />
                            <DatePicker
                                date={filters.endDate ? new Date(filters.endDate) : undefined}
                                setDate={(date) => handleFilterChange('endDate', date ? date.toISOString().split('T')[0] : '')}
                                placeholder="End Date"
                            /> */}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Lead Table */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle>Leads</CardTitle>
                    {/* Export Button - Moved Here */}
                    <Button onClick={handleExport} variant="outline" size="sm" disabled={loading || totalLeads === 0}>
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                </CardHeader>
                <CardContent>
                    {error && <p className="text-red-500 mb-4">Error: {error}</p>}
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {/* Sortable Headers */}
                                    <TableHead className="cursor-pointer" onClick={() => handleSortChange('fullName')}>
                                        Full Name {sort.sortBy === 'fullName' && (sort.sortOrder === 'asc' ? '▲' : '▼')}
                                        {sort.sortBy !== 'fullName' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                                    </TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Company</TableHead>
                                    <TableHead className="cursor-pointer" onClick={() => handleSortChange('sourceFormName')}>
                                        Form Name {sort.sortBy === 'sourceFormName' && (sort.sortOrder === 'asc' ? '▲' : '▼')}
                                        {sort.sortBy !== 'sourceFormName' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                                    </TableHead>
                                    <TableHead className="cursor-pointer" onClick={() => handleSortChange('status')}>
                                        Status {sort.sortBy === 'status' && (sort.sortOrder === 'asc' ? '▲' : '▼')}
                                        {sort.sortBy !== 'status' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                                    </TableHead>
                                    <TableHead className="cursor-pointer" onClick={() => handleSortChange('submissionTimestamp')}>
                                        Submitted {sort.sortBy === 'submissionTimestamp' && (sort.sortOrder === 'asc' ? '▲' : '▼')}
                                        {sort.sortBy !== 'submissionTimestamp' && <ArrowUpDown className="ml-2 h-4 w-4 inline" />}
                                    </TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                                        {/* TODO: Add Skeleton loaders */}
                                    </TableRow>
                                ) : leads.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center">No leads found.</TableCell>
                                    </TableRow>
                                ) : (
                                    leads.map((lead) => (
                                        <TableRow key={lead.id}>
                                            <TableCell>{lead.fullName}</TableCell>
                                            <TableCell>{lead.email}</TableCell>
                                            <TableCell>{lead.company || '-'}</TableCell>
                                            <TableCell>{lead.sourceFormName}</TableCell>
                                            <TableCell>{lead.status}</TableCell>
                                            <TableCell>{formatDate(lead.submissionTimestamp)}</TableCell>
                                            <TableCell>
                                                <Button variant="ghost" size="sm" onClick={() => handleViewDetails(lead)}>
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination and Export Controls */}
                    <div className="flex items-center justify-between mt-4">
                        {/* Pagination Info */}
                        {!loading && totalPages > 0 && ( // Show even if only one page
                            <span className="text-sm text-muted-foreground">
                                Page {currentPage} of {totalPages} ({totalLeads} total leads)
                            </span>
                        )}
                         {!loading && totalPages === 0 && ( // Show when no leads
                            <span className="text-sm text-muted-foreground">
                                {totalLeads} total leads
                            </span>
                        )}

                        {/* Action Buttons (Pagination & Export) */}
                        <div className="flex items-center space-x-2">
                            {/* Export Button - Removed from here */}
                            {/* Pagination Buttons */}
                            {!loading && totalPages > 1 && (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage <= 1}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage >= totalPages}
                                    >
                                        Next
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminLeadsPage;