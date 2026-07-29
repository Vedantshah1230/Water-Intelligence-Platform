import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileText, Upload, Trophy, Medal } from 'lucide-react';
import api from '@/lib/api';

const reportSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  description: z.string().min(10, 'Please provide more details'),
  location: z.string().min(3, 'Location is required'),
});

type ReportFormValues = z.infer<typeof reportSchema>;

interface LeaderboardEntry {
  area: string;
  points: number;
  badge: string;
}

export function Reports() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema)
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    api.get('/advanced/leaderboard')
      .then(res => setLeaderboard(res.data))
      .catch(err => console.error("Failed to fetch leaderboard", err));
  }, []);

  const onSubmit = async (data: ReportFormValues) => {
    try {
      // Mock converting location string to coordinates for the hackathon
      await api.post('/advanced/citizen-report', {
        title: data.title,
        description: data.description + ` (Location: ${data.location})`,
        latitude: 19.0760 + (Math.random() * 0.1 - 0.05), // Random jitter around Mumbai
        longitude: 72.8777 + (Math.random() * 0.1 - 0.05)
      });
      setSubmitSuccess(true);
      reset();
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to submit report", err);
    }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-gutter">
      
      {/* Report Form Section */}
      <div>
        <div className="flex items-center gap-3 mb-gutter">
          <div className="bg-primary-container p-3 rounded-full text-on-primary-container">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="font-headline-lg text-primary">Submit a Report</h2>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Report an Issue</CardTitle>
            <p className="font-body-md text-on-surface-variant">Help us keep the water system safe. Provide details about the issue you observed.</p>
          </CardHeader>
          <CardContent>
            {submitSuccess && (
              <div className="bg-primary-container text-on-primary-container p-3 rounded-md mb-4 font-body-md">
                Report submitted successfully! Thank you for helping.
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  label="Report Title"
                  placeholder="e.g. Water leak on Main St"
                  {...register('title')}
                  error={errors.title?.message}
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="font-label-md text-on-surface">Description</label>
                <textarea 
                  className="flex w-full rounded-md border border-outline bg-surface px-3 py-2 text-sm placeholder:text-on-surface-variant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none h-32"
                  placeholder="Describe the issue in detail..."
                  {...register('description')}
                ></textarea>
                {errors.description && <span className="font-label-sm text-error">{errors.description.message}</span>}
              </div>
              
              <div>
                <Input
                  label="Location"
                  placeholder="Address or area"
                  {...register('location')}
                  error={errors.location?.message}
                />
              </div>
              
              <Button type="submit" className="w-full mt-4" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Gamification Leaderboard Section */}
      <div>
        <div className="flex items-center gap-3 mb-gutter">
          <div className="bg-[#ffedcc] text-[#cc7700] p-3 rounded-full">
            <Trophy className="w-6 h-6" />
          </div>
          <h2 className="font-headline-lg text-primary">Leaderboard</h2>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Water Savers</CardTitle>
            <p className="font-body-md text-on-surface-variant">Districts ranked by water conservation points.</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-surface-container-lowest rounded-lg border border-outline-variant hover:border-primary transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-[#ffedcc] text-[#cc7700]' : 'bg-surface-container text-on-surface-variant'}`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-headline-sm">{entry.area}</p>
                      <p className="font-label-sm text-on-surface-variant">{entry.badge}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-primary">
                    <Medal className="w-4 h-4" />
                    {entry.points} pts
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
