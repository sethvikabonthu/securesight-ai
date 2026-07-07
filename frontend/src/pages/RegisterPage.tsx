import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardContent } from '../components/Card';

export const RegisterPage: React.FC = () => {
  const { register: registerUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const password = watch('password');

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await registerUser(data.name, data.email);
      showToast('Registration complete. Protection node configured.', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast('Registration failed. Node registration rejected.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyber-cyan/5 rounded-full blur-[80px] pointer-events-none" />

      <Card variant="glass" className="w-full max-w-md shadow-2xl relative z-10 border border-white/5">
        <CardContent className="p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-lg bg-cyber-blue/10 border border-cyber-cyan/20 flex items-center justify-center mb-3">
              <Shield className="w-6 h-6 text-cyber-cyan" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-widest uppercase">REGISTER NODE</h2>
            <p className="text-xs text-gray-400 mt-1">Configure Local Operator Access</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Operator Full Name"
              type="text"
              placeholder="e.g. Sethvika Bonthu"
              icon={<User className="w-4 h-4" />}
              error={errors.name?.message}
              {...register('name', { 
                required: 'Operator full name is required',
                minLength: {
                  value: 3,
                  message: 'Name must be at least 3 characters'
                }
              })}
            />

            <Input
              label="Secure Email"
              type="email"
              placeholder="e.g. sethvika@securesight.com"
              icon={<Mail className="w-4 h-4" />}
              error={errors.email?.message}
              {...register('email', { 
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address syntax'
                }
              })}
            />

            <Input
              label="Console Passphrase"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Minimum password strength: 8 characters'
                }
              })}
            />

            <Input
              label="Confirm Passphrase"
              type="password"
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', { 
                required: 'Confirm password is required',
                validate: value => value === password || 'Passphrase keys do not match'
              })}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={loading}
            >
              Initialize Console Profile
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            Already have an authorized profile?{' '}
            <Link to="/login" className="text-cyber-cyan hover:underline font-semibold">
              Verify Access
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
