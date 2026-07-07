import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, ShieldAlert, Key, Calendar, MapPin, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();
  const [updating, setUpdating] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || ''
    }
  });

  const onSubmit = async (data: { name: string; email: string; avatar: string }) => {
    setUpdating(true);
    try {
      await updateProfile(data.name, data.email, data.avatar);
      showToast('Operator profile configuration successfully updated.', 'success');
    } catch (err) {
      showToast('Profile save failed. Local node rejected changes.', 'error');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-wide">OPERATOR PROFILE</h2>
        <p className="text-xs text-gray-400">Manage user credentials, security clearance details, and profile avatar.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card Summary */}
        <Card variant="glass" className="h-max text-center">
          <CardContent className="p-6 space-y-4">
            <div className="relative w-24 h-24 mx-auto">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop'}
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full border-2 border-cyber-cyan shadow-glow-cyan/20 object-cover"
              />
              <span className="absolute bottom-1 right-1 w-5.5 h-5.5 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-[10px] text-cyber-cyan" title="Operational Clearance Level">
                L2
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">{user?.name}</h3>
              <p className="text-xs text-gray-500 font-mono mt-0.5">{user?.email}</p>
            </div>

            <div className="inline-flex items-center gap-1 bg-cyber-cyan/10 border border-cyber-cyan/30 px-3 py-1 rounded-full text-xs font-semibold text-cyber-cyan uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5" /> {user?.role || 'Operator'}
            </div>

            <div className="border-t border-white/5 pt-4 text-left space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 flex items-center gap-1.5"><Key className="w-3.5 h-3.5" /> Cryptographic ID</span>
                <span className="font-mono text-gray-300">{user?.id || 'usr-mock'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Node Enrolled</span>
                <span className="font-mono text-gray-300">July 2026</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Console Terminal</span>
                <span className="font-mono text-gray-300">192.168.1.104</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit profile form */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label="Clearance Name"
                  type="text"
                  icon={<User className="w-4 h-4" />}
                  error={errors.name?.message}
                  {...register('name', { required: 'Clearance name is required' })}
                />
                
                <Input
                  label="Secured Communications Email"
                  type="email"
                  icon={<Mail className="w-4 h-4" />}
                  error={errors.email?.message}
                  {...register('email', { 
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email syntax structure'
                    }
                  })}
                />

                <Input
                  label="Avatar URL link"
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  error={errors.avatar?.message}
                  {...register('avatar')}
                />

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    isLoading={updating}
                  >
                    Commit Profile Alterations
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Security alerts placeholder */}
          <Card variant="glass" className="border-l-4 border-l-red-500 bg-red-950/5">
            <CardContent className="p-5 flex gap-3">
              <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <h5 className="font-bold text-white uppercase tracking-wider">Operational Warning</h5>
                <p className="text-gray-400 leading-relaxed">
                  Clearance name updates are logged cryptographically. Any modifications outside standardized security protocol audits could lead to session revocation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
