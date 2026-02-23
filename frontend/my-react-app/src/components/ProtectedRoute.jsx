// import React, { useEffect, useState } from 'react';
// import { Navigate } from 'react-router-dom';
// import axios from 'axios';

// export default function ProtectedRoute({ children }) {
//   const [loading, setLoading] = useState(true);
//   const [ok, setOk] = useState(false);

//   useEffect(() => {
//     async function check() {
//       const token = localStorage.getItem('token');
//       if (!token) { setOk(false); setLoading(false); return; }
//       try {
//         await axios.get('http://localhost:3023/api/me');
//         setOk(true);
//       } catch (err) {
//         setOk(false);
//       } finally {
//         setLoading(false);
//       }
//     }
//     check();
//   }, []);

//   if (loading) return <div className="d-flex vh-100 align-items-center justify-content-center">Loading...</div>;
//   if (!ok) return <Navigate to="/student/login" replace />;
//   return children;
// }

import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    async function check() {
      const token = localStorage.getItem('token');
      if (!token) { 
        setOk(false); 
        setLoading(false); 
        return; 
      }
      try {
        const res = await axios.get('http://localhost:3023/api/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOk(true);
      } catch (err) {
        console.error(err.response?.data || err.message);
        setOk(false);
      } finally {
        setLoading(false);
      }
    }
    check();
  }, []);

  if (loading)
    return (
      <div className="d-flex vh-100 align-items-center justify-content-center">
        Loading...
      </div>
    );

  if (!ok) return <Navigate to="/student/login" replace />;

  return children;
}
