
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface VotePageProps {
  onLogout: () => void;
}

interface Candidate {
  id: string;
  name: string;
  votes: number;
}

const VotePage = ({ onLogout }: VotePageProps) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [studentId, setStudentId] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [voteConfirmation, setVoteConfirmation] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadCandidates();
    
    // Real-time updates
    const interval = setInterval(loadCandidates, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadCandidates = () => {
    const storedCandidates = JSON.parse(localStorage.getItem('candidates') || '[]');
    setCandidates(storedCandidates);
  };

  const handleLogin = () => {
    if (!studentId.trim()) {
      toast({
        title: "Error",
        description: "Please enter your Student ID",
        variant: "destructive",
      });
      return;
    }

    const votedUsers = JSON.parse(localStorage.getItem('votedUsers') || '{}');
    
    if (votedUsers[studentId]) {
      setHasVoted(true);
      setShowLogin(false);
      setShowResults(true);
      toast({
        title: "Already Voted",
        description: "You have already cast your vote",
      });
      return;
    }

    setCurrentUser(studentId);
    setShowLogin(false);
    loadCandidates();
  };

  const vote = (candidateIndex: number) => {
    if (hasVoted) return;

    const votedUsers = JSON.parse(localStorage.getItem('votedUsers') || '{}');
    const updatedCandidates = [...candidates];
    
    updatedCandidates[candidateIndex].votes += 1;
    votedUsers[currentUser] = true;

    localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
    localStorage.setItem('votedUsers', JSON.stringify(votedUsers));

    setCandidates(updatedCandidates);
    setHasVoted(true);
    setVoteConfirmation(`You voted for ${updatedCandidates[candidateIndex].name}!`);

    toast({
      title: "Vote Cast",
      description: `Your vote for ${updatedCandidates[candidateIndex].name} has been recorded`,
    });

    setTimeout(() => {
      setShowResults(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{
      background: 'linear-gradient(135deg, #2c3e50, #bdc3c7)'
    }}>
      <div className="bg-gray-100 p-12 rounded-2xl shadow-2xl max-w-3xl w-full mx-4 text-center animate-in fade-in duration-1000">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Student Leader Voting
          </h1>
          <Button onClick={onLogout} variant="outline">
            Logout
          </Button>
        </div>

        {showLogin && (
          <div>
            <h2 className="text-xl text-gray-700 mb-4">Login</h2>
            <div className="flex gap-4 justify-center mb-4">
              <input
                type="text"
                placeholder="Enter your Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="p-3 rounded-lg border-none bg-gray-200 focus:bg-white focus:outline-blue-500 flex-1 max-w-md"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
              <Button onClick={handleLogin} className="bg-blue-500 hover:bg-blue-600">
                Login
              </Button>
            </div>
          </div>
        )}

        {!showLogin && !showResults && (
          <div>
            <h2 className="text-xl text-gray-700 mb-6">Vote for Your Leader</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {candidates.map((candidate, index) => (
                <div
                  key={candidate.id}
                  className="p-4 bg-gray-200 rounded-xl flex justify-between items-center shadow-lg"
                >
                  <span className="font-semibold">{candidate.name}</span>
                  <span className="font-bold text-gray-600">Votes: {candidate.votes}</span>
                  <Button
                    onClick={() => vote(index)}
                    disabled={hasVoted}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2"
                  >
                    Vote
                  </Button>
                </div>
              ))}
            </div>

            {voteConfirmation && (
              <div className="text-green-600 font-semibold text-lg mb-4">
                {voteConfirmation}
              </div>
            )}
          </div>
        )}

        {showResults && (
          <div>
            <h2 className="text-2xl text-gray-700 mb-4">Thank you for voting!</h2>
            <p className="text-gray-600">Your vote has been recorded successfully.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VotePage;
