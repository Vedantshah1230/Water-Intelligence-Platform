import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FileText, Upload } from 'lucide-react';

const reportSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  description: z.string().min(10, 'Please provide more details'),
  location: z.string().min(3, 'Location is required'),
});

type ReportFormValues = z.infer<typeof reportSchema>;

export function Reports() {
  const { register, handleSubmit, formState: { errors } } = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema)
  });

  const onSubmit = (data: ReportFormValues) => {
    console.log(data);
    alert("Report submitted successfully!");
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-2xl mx-auto">
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
                placeholder="Address or coordinates"
                {...register('location')}
                error={errors.location?.message}
              />
            </div>
            
            <div className="border-2 border-dashed border-outline rounded-lg p-8 flex flex-col items-center justify-center gap-2 bg-surface-container-lowest cursor-pointer hover:bg-surface-container transition-colors">
              <Upload className="w-8 h-8 text-primary" />
              <p className="font-label-md">Click to upload photos</p>
              <p className="font-body-sm text-on-surface-variant">JPG, PNG up to 5MB</p>
            </div>
            
            <Button type="submit" className="w-full mt-4" size="lg">Submit Report</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
