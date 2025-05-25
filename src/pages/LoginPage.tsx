
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface LoginPageProps {
  onLogin: (role: 'user' | 'admin') => void;
}

const LoginPage = ({ onLogin }: LoginPageProps) => {
  const [selectedRole, setSelectedRole] = useState<'user' | 'admin'>('user');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Simulate login validation
      if (!username || !email || !password) {
        toast({
          title: "Error",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        return;
      }

      // Store auth data in localStorage
      const authData = {
        username,
        email,
        role: selectedRole,
        timestamp: Date.now()
      };
      localStorage.setItem('authData', JSON.stringify(authData));

      toast({
        title: "Success",
        description: `Logged in as ${selectedRole}`,
      });

      onLogin(selectedRole);
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, #2c3e50, #bdc3c7)'
    }}>
      <div className="bg-gray-100 p-12 rounded-2xl shadow-2xl w-96 text-center animate-in fade-in duration-1000">
        <h1 className="text-3xl mb-6 font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Student Voting System
        </h1>
        
        <div className="flex mb-4">
          <button
            className={`flex-1 p-3 rounded-lg mx-1 transition-all ${
              selectedRole === 'user' 
                ? 'bg-blue-500 text-white font-bold' 
                : 'bg-gray-300 text-gray-700'
            }`}
            onClick={() => setSelectedRole('user')}
          >
            User
          </button>
          <button
            className={`flex-1 p-3 rounded-lg mx-1 transition-all ${
              selectedRole === 'admin' 
                ? 'bg-blue-500 text-white font-bold' 
                : 'bg-gray-300 text-gray-700'
            }`}
            onClick={() => setSelectedRole('admin')}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-lg border-none bg-gray-200 focus:bg-white focus:outline-blue-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg border-none bg-gray-200 focus:bg-white focus:outline-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg border-none bg-gray-200 focus:bg-white focus:outline-blue-500"
            required
          />
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg mt-4"
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
