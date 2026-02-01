import { useState, useEffect } from 'react';
import BusinessCardModal from './components/BusinessCardModal/BusinessCardModal';
import SearchBar from './components/SearchBar/SearchBar';
import NFCSimulator from './components/NFCSimulator/NFCSimulator';
import NetworkGraph from './components/NetworkGraph/NetworkGraph';
import { User, Connection } from './types';
import { allUsers, connections as initialConnections, CURRENT_USER_ID } from './data/mockData';
import { saveGraphState, loadGraphState } from './utils/persistence';
import { generateUser, getNextUserId } from './utils/userGenerator';
import './App.css';

function App() {
  const [currentUserId, setCurrentUserId] = useState(CURRENT_USER_ID);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [connections, setConnections] = useState<Connection[]>(initialConnections);
  const [highlightedNodeIds, setHighlightedNodeIds] = useState<string[]>([]);
  const [users, setUsers] = useState<User[]>(allUsers);

  // Load connections from localStorage on mount
  useEffect(() => {
    const saved = loadGraphState();
    // Validate saved data before using it
    if (saved && Array.isArray(saved) && saved.length > 0) {
      setConnections(saved);
    }
  }, []);

  // Save connections to localStorage when they change
  useEffect(() => {
    saveGraphState(connections);
  }, [connections]);

  const handleNodeClick = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
    }
  };

  const handleViewNetwork = (userId: string) => {
    setCurrentUserId(userId);
    setSelectedUser(null);
  };

  const handleBackToMyNetwork = () => {
    setCurrentUserId(CURRENT_USER_ID);
    setSelectedUser(null);
  };

  const handleSearchResults = (matchedIds: string[]) => {
    setHighlightedNodeIds(matchedIds);
  };

  const handleNFCTap = () => {
    // Check for unconnected users
    const unconnectedUsers = users.filter(
      user =>
        user.id !== CURRENT_USER_ID &&
        !connections.some(
          conn =>
            (conn.userId1 === CURRENT_USER_ID && conn.userId2 === user.id) ||
            (conn.userId2 === CURRENT_USER_ID && conn.userId1 === user.id)
        )
    );

    let newUser: User;

    // If everyone is connected, generate a new user
    if (unconnectedUsers.length === 0) {
      const newUserId = getNextUserId(users);
      newUser = generateUser(newUserId);
      setUsers([...users, newUser]);
    } else {
      // Pick random unconnected user
      newUser = unconnectedUsers[Math.floor(Math.random() * unconnectedUsers.length)];
    }

    // Create connection with random strength (30-70)
    const randomStrength = Math.floor(Math.random() * 40) + 30;
    const newConnection: Connection = {
      userId1: CURRENT_USER_ID,
      userId2: newUser.id,
      strength: randomStrength,
      interactionCount: 1,
      lastInteraction: new Date()
    };

    setConnections([...connections, newConnection]);
  };

  // Get current user for display
  const currentUser = users.find(u => u.id === currentUserId);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-surface">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-header bg-surface-elevated shadow-subtle">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight">SocialNet POC</h1>
              <p className="text-sm text-neutral-600 mt-1">
                Viewing: <span className="font-medium text-neutral-900">{currentUser?.name || 'Unknown'}</span>
              </p>
              {currentUserId !== CURRENT_USER_ID && (
                <button
                  onClick={handleBackToMyNetwork}
                  className="mt-3 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 active:scale-95 transition-all duration-150 text-sm font-medium shadow-sm"
                >
                  ← Back to My Network
                </button>
              )}
            </div>
            <SearchBar users={users} onSearchResults={handleSearchResults} />
          </div>
        </div>
      </div>

      {/* Network Graph */}
      <div className="h-full" style={{ paddingTop: '104px' }}>
        <NetworkGraph
          currentUserId={currentUserId}
          users={users}
          connections={connections}
          onNodeClick={handleNodeClick}
          highlightedNodeIds={highlightedNodeIds}
        />
      </div>

      {/* Business Card Modal */}
      <BusinessCardModal
        user={selectedUser}
        isOpen={!!selectedUser}
        onClose={() => setSelectedUser(null)}
        onViewNetwork={handleViewNetwork}
      />

      {/* NFC Simulator */}
      <NFCSimulator onTap={handleNFCTap} />
    </div>
  );
}

export default App;
