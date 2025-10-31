import React, { useState, useEffect } from 'react';
import { Youtube } from 'lucide-react';
import { FaDiscord, FaSteam, FaGithub, FaFacebook } from 'react-icons/fa';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BioLinkCard = () => {
  const [profile, setProfile] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Icon mapping
  const iconMap = {
    facebook: <FaFacebook size={20} />,
    discord: <FaDiscord size={20} />,
    steam: <FaSteam size={20} />,
    github: <FaGithub size={20} />,
    youtube: <Youtube size={20} />
  };

  // Color mapping
  const colorMap = {
    facebook: "bg-gray-700 hover:bg-gray-600",
    discord: "bg-[#5865F2] hover:bg-[#4752C4]",
    steam: "bg-[#1b2838] hover:bg-[#2a475e]",
    github: "bg-gray-800 hover:bg-gray-700",
    youtube: "bg-[#FF0000] hover:bg-[#CC0000]"
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [profileRes, linksRes] = await Promise.all([
        axios.get(`${API}/profile`),
        axios.get(`${API}/links`)
      ]);
      
      setProfile(profileRes.data);
      setLinks(linksRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <p className="text-white text-xl">Profile not found</p>
      </div>
    );
  }

  console.log('Profile Data:', profile);

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-gray-800 shadow-2xl bg-gray-900">
            {!imageLoaded && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <img
              src={profile.profile_image}
              alt={profile.name}
              className={`w-full h-full object-cover ${imageLoaded ? 'block' : 'hidden'}`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150/1a1a1a/ffffff?text=F";
                setImageLoaded(true);
              }}
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">{profile.name}</h1>
          <p className="text-gray-400 text-lg">{profile.description}</p>
        </div>

        {/* Links Section */}
        <div className="space-y-4 mb-8">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full ${colorMap[link.icon_type] || 'bg-gray-700 hover:bg-gray-600'} text-white py-4 px-6 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl`}
            >
              {iconMap[link.icon_type]}
              <span className="font-semibold text-lg">{link.title}</span>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm">
          <p>{profile.name} Bio © 2025</p>
        </div>
      </div>
    </div>
  );
};

export default BioLinkCard;
