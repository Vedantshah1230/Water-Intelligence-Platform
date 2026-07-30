import React from 'react';
import { Users, MessageSquare, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Community() {
  const discussions = [
    {
      id: 1,
      author: 'Dr. Elena Rostova',
      title: 'Optimizing filter backwash cycles with AI insights',
      replies: 14,
      likes: 32,
      time: '2 hours ago'
    },
    {
      id: 2,
      author: 'Marcus Chen',
      title: 'Has anyone seen false positives on turbidity sensors during heavy rain?',
      replies: 8,
      likes: 12,
      time: '5 hours ago'
    },
    {
      id: 3,
      author: 'Sarah Jenkins',
      title: 'Case Study: Reducing energy consumption in Sector 7',
      replies: 21,
      likes: 45,
      time: '1 day ago'
    }
  ];

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-headline-lg text-on-surface">Community</h2>
          <p className="font-body-md text-on-surface-variant">Connect with other water management professionals and AI specialists.</p>
        </div>
        <Button variant="default" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" /> New Discussion
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {discussions.map(post => (
            <div key={post.id} className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant hover:shadow-md transition-shadow cursor-pointer">
              <h3 className="font-headline-sm text-on-surface mb-2">{post.title}</h3>
              <div className="flex items-center gap-4 text-sm text-on-surface-variant">
                <span className="flex items-center gap-1 font-semibold text-primary"><Users className="w-4 h-4" /> {post.author}</span>
                <span>{post.time}</span>
              </div>
              <div className="mt-4 flex items-center gap-4 pt-4 border-t border-outline-variant/30">
                <button className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
                  <ThumbsUp className="w-4 h-4" /> {post.likes}
                </button>
                <button className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors">
                  <MessageSquare className="w-4 h-4" /> {post.replies} Replies
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="space-y-6">
          <div className="bg-secondary-fixed text-on-secondary-fixed p-6 rounded-2xl border border-outline-variant">
            <h3 className="font-headline-sm mb-2">Upcoming Webinar</h3>
            <p className="font-body-sm opacity-90 mb-4">Join our engineering team this Friday to discuss the new anomaly detection models.</p>
            <Button variant="default" className="w-full bg-on-secondary-fixed text-secondary-fixed hover:bg-on-secondary-fixed-variant">RSVP Now</Button>
          </div>
          
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant">
            <h3 className="font-headline-sm mb-4 text-on-surface">Top Contributors</h3>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xs font-bold">
                    U{i}
                  </div>
                  <div>
                    <p className="font-label-sm text-on-surface">User Name {i}</p>
                    <p className="text-xs text-on-surface-variant">{100 - (i*10)} points</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
