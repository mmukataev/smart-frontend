'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const SsoOrdersContext = createContext();
const CACHE_KEY = 'ssoOrdersCache';
const CACHE_TTL = 15 * 60 * 1000; // 15 минут в миллисекундах

function parseJwt(token) {
  try {
    const base64 = token.split('.')[1];
    const payload = atob(base64);
    return JSON.parse(payload);
  } catch (e) {
    console.error('Invalid JWT', e);
    return null;
  }
}

export function SsoOrdersProvider({ children }) {
  const [ssoOrders, setSsoOrders] = useState([]);
  const [ssoUserLink, setSsoUserLink] = useState(null);
  const [ssoTechdeskOrders, setSsoTechdeskOrders] = useState([]);
  const [ssoTechdeskLink, setSsoTechdeskLink] = useState(null);
  const [ssoHelpdeskOrders, setSsoHelpdeskOrders] = useState([]);

  const [viewerUsername, setViewerUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rawToken = Cookies.get('access_token') || Cookies.get('access'); 
    const payload = rawToken ? parseJwt(rawToken) : null;
    const username = payload?.username || null; 
    setViewerUsername(username);
    console.log("SsoOrdersContext username from JWT:", username);

    if (!rawToken) {
      setLoading(false);
      return;
    }

    const cached = localStorage.getItem(CACHE_KEY);
    // if (cached) {
    //   const { timestamp, data } = JSON.parse(cached);
    //   if (Date.now() - timestamp < CACHE_TTL) {
    //     console.log("Loaded SSO orders from cache");
    //     setSsoOrders(data.ssoOrders || []);
    //     setSsoUserLink(data.ssoUserLink || null);
    //     setSsoTechdeskOrders(data.ssoTechdeskOrders || []);
    //     setSsoTechdeskLink(data.ssoTechdeskLink || null);
    //     setSsoHelpdeskOrders(data.ssoHelpdeskOrders || []);
    //     setLoading(false);
    //     return;
    //   }
    // }

    Promise.all([
      fetch(`https://helpdesk.apa.kz/api/Tickets/active-by-creator?creatorEmail=${encodeURIComponent(username)}`, { method: "GET" })
        .then(res => res.json())
        .then(data => {
          console.log("Helpdesk API response:", data);
          setSsoHelpdeskOrders(data || []);
          return data || [];
        })
        .catch(err => {
          console.error(err);
          return [];
        }),

      fetch("https://absence.apa.kz/api/check_access", {
        method: "GET",
        headers: { Authorization: `Bearer ${rawToken}` },
      })
        .then(res => res.json())
        .then(data => {
          setSsoOrders(data.orders || []);
          setSsoUserLink(data.userLink || null);
          return data;
        })
        .catch(err => {
          console.error(err);
          return {};
        }),

      fetch("https://techdesk.apa.kz/api/check_access", {
        method: "GET",
        headers: { Authorization: `Bearer ${rawToken}` },
      })
        .then(res => res.json())
        .then(data => {
          setSsoTechdeskOrders(data.orders || []);
          setSsoTechdeskLink(data.userLink || null);
          return data;
        })
        .catch(err => {
          console.error(err);
          return {};
        })
    ])
      .then(([helpdeskData, absenceData, techdeskData]) => {
        // --- сохраняем в кэш ---
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            timestamp: Date.now(),
            data: {
              ssoOrders: absenceData.orders || [],
              ssoUserLink: absenceData.userLink || null,
              ssoTechdeskOrders: techdeskData.orders || [],
              ssoTechdeskLink: techdeskData.userLink || null,
              ssoHelpdeskOrders: helpdeskData || [],
            }
          })
        );
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <SsoOrdersContext.Provider 
      value={{ 
        ssoOrders, 
        ssoUserLink, 
        ssoTechdeskOrders, 
        ssoTechdeskLink,
        ssoHelpdeskOrders,
        viewerUsername,
        loading
      }}
    >
      {children}
    </SsoOrdersContext.Provider>
  );
}

export function useSsoOrders() {
  return useContext(SsoOrdersContext);
}
