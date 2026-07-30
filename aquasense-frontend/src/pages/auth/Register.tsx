import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function Register() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = (data: RegisterFormValues) => {
    console.log(data);
    navigate('/dashboard');
  };

  return (
    <div className="animate-in fade-in duration-500">
      <h2 className="font-headline-lg text-on-surface mb-2">Create Account</h2>
      <p className="font-body-md text-on-surface-variant mb-8">Join AquaSense to manage water intelligence.</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Sam Doe"
          {...register('name')}
          error={errors.name?.message}
        />
        
        <Input
          label="Email Address"
          type="email"
          placeholder="sam@example.com"
          {...register('email')}
          error={errors.email?.message}
        />
        
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          error={errors.password?.message}
        />
        
        <Button type="submit" className="w-full mt-4 flex items-center justify-center gap-2 group" size="lg">
          Create Account
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>
      
      <p className="font-body-sm text-center mt-8 text-on-surface-variant">
        Already have an account? <Link to="/auth/login" className="text-primary font-bold hover:underline">Sign In</Link>
      </p>
    </div>
  );
}
