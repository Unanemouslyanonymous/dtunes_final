"use client";
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '@/context/authContext';
import { userModel } from '@/app/models/userModel';
import { useRouter } from 'next/navigation';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

const FriendsPage = () => {
  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  const { user, isAuthenticated } = authContext;
  const [friendRequests, setFriendRequests] = useState<userModel[]>([]);
  const [friends, setFriends] = useState<userModel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<userModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?origin=friends');
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (user) {
      fetchFriendRequests();
      fetchFriends();
    }
  }, [user]);

  const fetchFriendRequests = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/friends/requests`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFriendRequests(res.data.requests);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const fetchFriends = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/friends`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const friendsData = res.data.friends;
      setFriends(friendsData);
      fetchFriendsCurrentlyPlaying(friendsData);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const fetchFriendsCurrentlyPlaying = async (friendsData: userModel[]) => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/friends/${user?._id}/currently-playing`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const friendsWithCurrentlyPlaying = res.data.data.map((friend: any) => {
        const friendData = friendsData.find(f => f._id === friend.friend._id);
        return {
          ...friendData,
          currentlyPlaying: friend.currentlyPlaying || 'No song playing',
        };
      });
      setFriends(friendsWithCurrentlyPlaying);
    } catch (error) {
      console.error('Error fetching friends currently playing songs:', error);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/friends/search`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        params: { query: searchQuery }
      });
      setSearchResults(res.data.users);
    } catch (error) {
      console.error('Error searching users:', error);
      setError('Error searching users');
    }
    setLoading(false);
  };

  const sendFriendRequest = async (userId: string) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/friends/send`, { userId }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchFriendRequests();
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const acceptFriendRequest = async (userId: string) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/friends/accept`, { userId }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchFriends();
      fetchFriendRequests();
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  return (
    <MaxWidthWrapper>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Friends</h1>

        <div className="mb-6">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search users"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border rounded-md w-full"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white p-2 rounded-md"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Friend Requests</h2>
          <ul>
            {friendRequests.length > 0 ? (
              friendRequests.map((request: userModel) => (
                <li key={request._id} className="flex justify-between items-center p-4 border-b">
                  <span>{request.username}</span>
                  <button
                    onClick={() => acceptFriendRequest(request._id)}
                    className="bg-green-500 text-white p-2 rounded-md"
                  >
                    Accept
                  </button>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No friend requests</p>
            )}
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Friends</h2>
          <ul>
            {friends.length > 0 ? (
              friends.map((friend: userModel) => (
                <li key={friend._id} className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <span>{friend.username}</span>
                    <span className="text-gray-500">Currently Playing: {friend.currentlyPlaying || 'None'}</span>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No friends found</p>
            )}
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <ul>
            {searchResults.length > 0 ? (
              searchResults.map((result: userModel) => (
                <li key={result._id} className="flex justify-between items-center p-4 border-b">
                  <span>{result.username}</span>
                  <button
                    onClick={() => sendFriendRequest(result._id)}
                    className="bg-blue-500 text-white p-2 rounded-md"
                  >
                    Add Friend
                  </button>
                </li>
              ))
            ) : (
              <p className="text-gray-500">No users found</p>
            )}
          </ul>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default FriendsPage;
