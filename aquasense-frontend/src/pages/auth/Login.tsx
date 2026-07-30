import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function Login() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log(data);
    navigate('/dashboard');
  };

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="font-headline-lg text-on-surface mb-2">Welcome Back</h2>
      <p className="font-body-md text-on-surface-variant mb-8">Enter your credentials to access your dashboard.</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="sam@example.com"
          {...register('email')}
          error={errors.email?.message}
        />
        
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label className="font-label-md text-on-surface">Password</label>
            <Link to="/auth/forgot-password" className="font-label-sm text-primary hover:underline">Forgot password?</Link>
          </div>
          <Input
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />
        </div>
        
        <Button type="submit" className="w-full mt-4 flex items-center justify-center gap-2 group" size="lg">
          Sign In
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>
      
      <p className="font-body-sm text-center mt-8 text-on-surface-variant">
        Don't have an account? <Link to="/auth/register" className="text-primary font-bold hover:underline">Create one</Link>
      </p>
    </div>
  );
}
