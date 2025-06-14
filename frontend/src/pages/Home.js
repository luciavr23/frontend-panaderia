import React from "react";
import Navbar from "../components/NavBar";
import HeroSection from "../components/home/HeroSection";
import QuickContact from "../components/home/QuickContact";
import PopularProducts from "../components/home/PopularProducts";
import StoreStatus from "../components/home/StoreStatus";
import Reviews from "../components/home/Reviews";
import DailySpecialsTable from "../components/home/DailySpecialsTable";
import Footer from "../components/Footer";
import {useState, useEffect} from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import {Grid} from "@mui/material";

function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {!loading && (
        <>
          <HeroSection />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
              marginTop: "60px",
            }}
          >
            <div style={{flex: 1}}>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  padding: "2rem",
                }}
              >
                <div style={{flex: 1, minWidth: 300, marginBottom: "2rem"}}>
                  <StoreStatus />
                  <QuickContact />
                  <DailySpecialsTable />
                </div>
                <div style={{flex: 1, minWidth: 300}}>
                  <PopularProducts />
                  <Reviews />
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </>
      )}

      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(254, 250, 243, 0.85)",
            zIndex: 2000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(2px)",
          }}
        >
          <Box
            sx={{
              border: "6px solid #cce5b1",
              borderTop: "6px solid #8DBB01",
              borderRadius: "50%",
              width: 60,
              height: 60,
              animation: "spin 1s linear infinite",
            }}
          />
          <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        </Box>
      )}
    </>
  );
}

export default Home;
