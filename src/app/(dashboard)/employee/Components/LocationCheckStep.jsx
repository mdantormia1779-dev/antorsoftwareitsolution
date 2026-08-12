"use client";

import React, { useEffect, useState, useCallback } from "react";
import { MapPin, Navigation, AlertTriangle, Loader2 } from "lucide-react";

const LocationCheckStep = ({ onInsideRadius, onOutsideRadius }) => {
  const [loading, setLoading] = useState(true);
  const [statusText, setStatusText] = useState("Detecting your location...");
  const [errorMessage, setErrorMessage] = useState("");

  // ==========================================
  // OFFICE COORDINATES & GEOFENCE RADIUS
  // ==========================================
  const OFFICE_LAT = 24.331020; 
  const OFFICE_LNG = 91.443930;
  const ALLOWED_RADIUS_METERS = 500; // ব্যাসার্ধ ৫০০ মিটার (প্রয়োজনে কমাতে বা বাড়াতে পারেন)

  // দুটি পয়েন্টের দূরত্ব হিসাব করার ফর্মুলা (Haversine formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // ==========================================
  // CHECK GEOLOCATION
  // ==========================================
  const verifyLocation = useCallback(() => {
    setLoading(true);
    setErrorMessage("");
    setStatusText("Fetching your GPS coordinates...");

    if (!navigator.geolocation) {
      setLoading(false);
      setErrorMessage("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        setStatusText("Calculating distance from office...");

        const distance = calculateDistance(userLat, userLng, OFFICE_LAT, OFFICE_LNG);
        console.log(`User Distance from Office: ${distance.toFixed(2)} meters`);

        setLoading(false);

        if (distance <= ALLOWED_RADIUS_METERS) {
          setStatusText("Location verified! Working hours started. 🎉");
          if (onInsideRadius) {
            onInsideRadius({ distance: distance.toFixed(0), userLat, userLng });
          }
        } else {
          setStatusText(`You are outside the office radius (~${distance.toFixed(0)}m away).`);
          if (onOutsideRadius) {
            onOutsideRadius({ distance: distance.toFixed(0), userLat, userLng });
          }
        }
      },
      (error) => {
        setLoading(false);
        console.error("Geolocation error:", error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setErrorMessage("Location permission denied. Please enable GPS access.");
            break;
          case error.POSITION_UNAVAILABLE:
            setErrorMessage("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setErrorMessage("Location request timed out. Please try again.");
            break;
          default:
            setErrorMessage("An unknown error occurred while detecting location.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }, [onInsideRadius, onOutsideRadius]);

  useEffect(() => {
    verifyLocation();
  }, [verifyLocation]);

  return (
    <div className="w-full flex flex-col items-center justify-center transition-all duration-500 space-y-8">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-blue-100/70 flex items-center justify-center mb-5 shadow-inner">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-blue-200/60 flex items-center justify-center">
            {loading ? (
              <Loader2 className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 animate-spin" />
            ) : errorMessage ? (
              <AlertTriangle className="w-7 h-7 sm:w-8 sm:h-8 text-rose-600" />
            ) : (
              <MapPin className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 fill-blue-600/10" />
            )}
          </div>
        </div>

        <div className="space-y-1.5 px-4 max-w-sm">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {loading ? "Checking your location..." : errorMessage ? "Location Error" : "Location Checked"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            {statusText}
          </p>
        </div>
      </div>

      {/* Error Message Box */}
      {errorMessage && (
        <div className="w-full max-w-md px-2">
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-xs p-3.5 rounded-2xl text-center">
            {errorMessage}
          </div>
        </div>
      )}

      {/* Retry / Manual Refresh Button */}
      <div className="w-full max-w-md space-y-3 pt-2 px-2">
        <button
          type="button"
          onClick={verifyLocation}
          disabled={loading}
          className="w-full bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-semibold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 transition-all cursor-pointer text-xs sm:text-sm disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Detecting GPS...</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" />
              <span>Retry Location Check</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LocationCheckStep;