import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Droplets, Shield, Activity, BarChart3, ArrowRight } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <header className="px-6 py-4 flex items-center justify-between border-b border-outline-variant bg-surface/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 text-primary">
          <Droplets className="w-6 h-6" />
          <span className="font-headline-md tracking-tight">AquaSense AI</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/auth/login" className="font-label-md hover:text-primary transition-colors">Sign In</Link>
          <Link to="/auth/register">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-24 px-6 text-center max-w-4xl mx-auto">
          <h1 className="font-headline-lg text-6xl mb-6 text-on-surface leading-tight">
            Intelligent Water <br />
            <span className="text-primary">Management for the Future</span>
          </h1>
          <p className="font-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Leverage AI and real-time data to monitor, predict, and manage water resources efficiently. Empowering communities and industries to build a sustainable water ecosystem.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/auth/register">
              <Button size="lg" className="flex items-center gap-2 group text-lg h-14 px-8 rounded-full">
                Start for free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button size="lg" variant="outline" className="text-lg h-14 px-8 rounded-full">
                View Live Demo
              </Button>
            </Link>
          </div>
        </section>

        <section className="py-24 px-6 bg-surface-container-lowest border-y border-outline-variant">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-surface border border-outline-variant hover:shadow-lg transition-all text-center">
              <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-6 text-on-primary-container">
                <Activity className="w-8 h-8" />
              </div>
              <h3 className="font-headline-sm mb-3">Real-time Monitoring</h3>
              <p className="font-body-md text-on-surface-variant">Continuous tracking of water quality, reservoir levels, and distribution networks.</p>
            </div>
            <div className="p-6 rounded-2xl bg-surface border border-outline-variant hover:shadow-lg transition-all text-center">
              <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-6 text-on-primary-container">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="font-headline-sm mb-3">Predictive Maintenance</h3>
              <p className="font-body-md text-on-surface-variant">AI-powered algorithms detect potential leaks and failures before they happen.</p>
            </div>
            <div className="p-6 rounded-2xl bg-surface border border-outline-variant hover:shadow-lg transition-all text-center">
              <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mx-auto mb-6 text-on-primary-container">
                <BarChart3 className="w-8 h-8" />
              </div>
              <h3 className="font-headline-sm mb-3">Actionable Insights</h3>
              <p className="font-body-md text-on-surface-variant">Comprehensive reports and data visualization for informed decision making.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 px-6 text-center border-t border-outline-variant">
        <p className="font-body-sm text-on-surface-variant">© 2026 AquaSense AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
