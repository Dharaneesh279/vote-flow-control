
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AdminPageProps {
  onLogout: () => void;
}

interface Candidate {
  id: string;
  name: string;
  votes: number;
}

const AdminPage = ({ onLogout }: AdminPageProps) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [candidateName, setCandideName] = useState('');
  const [totalVoters, setTotalVoters] = useState(0);
  const [showResetPopup, setShowResetPopup] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
    
    // Simulate real-time updates
    const interval = setInterval(loadData, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    const storedCandidates = JSON.parse(localStorage.getItem('candidates') || '[]');
    const storedVotedUsers = JSON.parse(localStorage.getItem('votedUsers') || '{}');
    
    setCandidates(storedCandidates);
    setTotalVoters(Object.keys(storedVotedUsers).length);
  };

  const addCandidate = () => {
    if (!candidateName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a candidate name",
        variant: "destructive",
      });
      return;
    }

    const newCandidate: Candidate = {
      id: Date.now().toString(),
      name: candidateName.trim(),
      votes: 0
    };

    const updatedCandidates = [...candidates, newCandidate];
    setCandidates(updatedCandidates);
    localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
    setCandideName('');

    toast({
      title: "Success",
      description: `Added candidate: ${newCandidate.name}`,
    });
  };

  const resetVotes = () => {
    localStorage.removeItem('candidates');
    localStorage.removeItem('votedUsers');
    setCandidates([]);
    setTotalVoters(0);
    setShowResetPopup(true);

    toast({
      title: "Reset Complete",
      description: "All votes and candidates have been reset",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, #2c3e50, #bdc3c7)'
    }}>
      {/* Overlay */}
      {showResetPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center max-w-sm">
            <p className="text-lg mb-6 text-gray-800">
              All votes and candidates have been reset successfully.
            </p>
            <Button onClick={() => setShowResetPopup(false)}>
              OK
            </Button>
          </div>
        </div>
      )}

      <div className="bg-gray-100 p-12 rounded-2xl shadow-2xl max-w-3xl w-full mx-4 text-center animate-in fade-in duration-1000">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <Button onClick={onLogout} variant="outline">
            Logout
          </Button>
        </div>

        <div className="mb-8">
          <h2 className="text-xl text-gray-700 mb-4">Add Candidate</h2>
          <div className="flex gap-4 justify-center">
            <input
              type="text"
              placeholder="Candidate Name"
              value={candidateName}
              onChange={(e) => setCandideName(e.target.value)}
              className="p-3 rounded-lg border-none bg-gray-200 focus:bg-white focus:outline-blue-500 flex-1 max-w-md"
              onKeyPress={(e) => e.key === 'Enter' && addCandidate()}
            />
            <Button onClick={addCandidate} className="bg-blue-500 hover:bg-blue-600">
              Add
            </Button>
          </div>
        </div>

        <div className="bg-gray-200 p-6 rounded-xl">
          <h3 className="text-xl text-gray-700 mb-4">Voting Results</h3>
          <p className="mb-4 font-semibold">Total Voters: {totalVoters}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="p-4 rounded-xl shadow-lg text-gray-800 font-semibold"
                style={{
                  background: 'linear-gradient(to right, #74ebd5, #acb6e5)'
                }}
              >
                <div className="text-lg">{candidate.name}</div>
                <div>Votes: {candidate.votes}</div>
              </div>
            ))}
          </div>

          <Button
            onClick={resetVotes}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Reset All Votes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
