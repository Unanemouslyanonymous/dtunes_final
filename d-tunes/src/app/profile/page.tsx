"use client";
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/authContext';
import { Edit, User, Heart, ChevronRight, List, Users,} from 'lucide-react';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {

  const authContext = useContext(AuthContext);
  if (!authContext) return null;
  const { user, isAuthenticated } = authContext;
    const router = useRouter();
  useEffect(() =>{
    if (!isAuthenticated) {
      router.push('/login');
    }
  },[isAuthenticated,router])
  return (
    <MaxWidthWrapper>
      <div className="container mx-auto p-4 flex flex-col items-center">
        <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-violet-600 shadow-lg transform hover:scale-110 transition duration-500">
          <img src="https://picsum.photos/200" alt="Profile Picture" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition duration-300">
            <Edit size={32} className="text-white" />
          </div>
        </div>
        <h1 className="text-3xl font-bold mt-4">{user?.username}</h1>
        <p className="text-gray-600 mb-4">{user?.email}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8 w-full">
          <div className="relative p-6 border rounded-lg shadow-lg transform hover:scale-105 transition duration-500 hover:shadow-2xl cursor-pointer">
            <User size={32} className="text-violet-600" />
            <h2 className="text-xl font-bold mt-4">Personal Info</h2>
            <p className="text-gray-600 mt-2">Username: {user?.username}</p>
            <p className="text-gray-600">Email: {user?.email}</p>
          </div>

          <div className="relative p-6 border rounded-lg shadow-lg transform hover:scale-105 transition duration-500 hover:shadow-2xl cursor-pointer">
            <Heart size={32} className="text-violet-600" />
            <h2 className="text-xl font-bold mt-4">Favorite Songs</h2>
            <p className="text-gray-600 mt-2">View and manage your favorite songs.</p>
            <ChevronRight size={24} className="absolute top-4 right-4 text-gray-400" />
          </div>

          <div  className="relative p-6 border rounded-lg shadow-lg transform hover:scale-105 transition duration-500 hover:shadow-2xl cursor-pointer" onClick={()=> router.push("/dashboard/playlists")}>
            <List size={32} className="text-violet-600" />
            <h2 className="text-xl font-bold mt-4">Playlists</h2>
            <p className="text-gray-600 mt-2">Manage your playlists and add new ones.</p>
            <ChevronRight size={24} className="absolute top-4 right-4 text-gray-400" />
          </div>

          <div className="relative p-6 border rounded-lg shadow-lg transform hover:scale-105 transition duration-500 hover:shadow-2xl cursor-pointer" onClick={() => router.push("/dashboard/friends")}>
            <Users size={32} className="text-violet-600" />
            <h2 className="text-xl font-bold mt-4">Friends</h2>
            <p className="text-gray-600 mt-2">Make New Friends. Play Songs Together.</p>
            <ChevronRight size={24} className="absolute top-4 right-4 text-gray-400" />
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  );
};

export default ProfilePage;
