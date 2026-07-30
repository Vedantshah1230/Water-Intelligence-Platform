import React, { useState, useEffect } from 'react';
import { reportService } from '@/services/apiServices';
import { downloadCSV, printPDFReport } from '@/utils/exportUtils';
import { toast } from 'sonner';
import { FileText, Download, Printer, Plus, Award, Filter, Search, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Reports() {
  const [reports, setReports] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Leakage');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await reportService.getAll({ search, status: statusFilter });
      setReports(res.data || []);
      const lb = await reportService.getLeaderboard();
      setLeaderboard(lb || []);
    } catch (err: any) {
      toast.error('Failed to load reports: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) {
      toast.error('Please enter a title and description');
      return;
    }

    try {
      setSubmitting(true);
      await reportService.submitReport({
        title,
        description,
        category,
        location: location || 'City Center'
      });
      toast.success('Report submitted successfully!');
      setTitle('');
      setDescription('');
      setLocation('');
      fetchReports();
    } catch (err: any) {
      toast.error('Failed to submit report: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      toast.info('Downloading CSV export...');
      const csvData = await reportService.exportCSV();
      downloadCSV('aquasense_reports.csv', csvData);
      toast.success('CSV downloaded successfully');
    } catch (err: any) {
      toast.error('Failed to export CSV: ' + err.message);
    }
  };

  const handlePrintPDF = () => {
    const tableRows = reports.map(r => `
      <tr>
        <td>${r.title}</td>
        <td>${r.category}</td>
        <td>${r.status}</td>
        <td>${r.location || 'N/A'}</td>
        <td>${r.reportedBy}</td>
        <td>${new Date(r.createdAt).toLocaleDateString()}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <h3>Active Citizen & Grid Reports (${reports.length})</h3>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Status</th>
            <th>Location</th>
            <th>Reported By</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;

    printPDFReport('System Water Incidents & Reports', htmlContent);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            <span>Reports & Citizen Intelligence</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Submit community incident reports, track resolutions, and export official audit documentation
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button onClick={handleExportCSV} variant="outline" size="sm" className="border-slate-700 text-slate-200">
            <Download className="w-4 h-4 mr-1.5" /> Export CSV
          </Button>
          <Button onClick={handlePrintPDF} size="sm" className="bg-cyan-600 hover:bg-cyan-500 text-white">
            <Printer className="w-4 h-4 mr-1.5" /> Print PDF Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-1 p-5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Submit a Water Report</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Issue Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pipeline leak near Main St"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Leakage">Pipeline Leakage</option>
                <option value="Low Pressure">Low Water Pressure</option>
                <option value="Contamination">Water Quality / Odor</option>
                <option value="Waste">Public Water Waste</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Location / Area</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Andheri West, Ward 4"
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide specific details about the issue..."
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold">
              {submitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </form>

          {/* Community Leaderboard */}
          <div className="pt-4 border-t border-slate-800">
            <h4 className="font-bold text-white text-xs mb-3 flex items-center space-x-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Top Water Conservation Districts</span>
            </h4>
            <div className="space-y-2">
              {leaderboard.map((item, idx) => (
                <div key={item.id} className="flex justify-between items-center p-2 bg-slate-950/60 rounded border border-slate-800/60 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-amber-400">#{idx + 1}</span>
                    <span className="text-slate-200 font-medium">{item.district}</span>
                  </div>
                  <span className="font-mono text-cyan-400 font-bold">{item.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reports Table Column */}
        <div className="lg:col-span-2 p-5 bg-slate-900/60 rounded-xl border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base">Active System Reports</h3>
            
            <div className="flex items-center space-x-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && fetchReports()}
                  className="p-1.5 pl-7 bg-slate-950 border border-slate-800 rounded text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2 top-2" />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-300 focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Investigating">Investigating</option>
                <option value="Resolved">Resolved</option>
              </select>

              <button onClick={fetchReports} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
              <p className="text-xs">Loading reports from database...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="p-12 text-center text-slate-400 border border-dashed border-slate-800 rounded-lg">
              No reports matching the selected filters.
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((r) => (
                <div key={r.id} className="p-4 bg-slate-950/60 rounded-lg border border-slate-800 space-y-2 hover:border-slate-700 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-white text-sm">{r.title}</h4>
                      <p className="text-xs text-slate-400">{r.description}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold border ${
                      r.status === 'Pending' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                      r.status === 'Investigating' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {r.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-500 pt-2 border-t border-slate-800/60">
                    <span>Category: <strong className="text-slate-300">{r.category}</strong> • Location: <strong className="text-slate-300">{r.location}</strong></span>
                    <span>By: {r.reportedBy}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
