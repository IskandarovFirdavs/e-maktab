// context/PrivateRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated, authChecked } = useAuth();
  const location = useLocation();

  // 1. Loading holati
  if (loading || !authChecked) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "50px",
              height: "50px",
              border: "5px solid #f3f3f3",
              borderTop: "5px solid #3498db",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 20px",
            }}
          ></div>
          <p>Autentifikatsiya tekshirilmoqda...</p>
        </div>

        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // 2. Agar user authenticated bo'lmasa
  if (!isAuthenticated) {
    // Faqat login sahifasidan tashqari sahifalarga kirishga urinilganda
    if (location.pathname !== "/") {
      // Kechirasiz, avval tizimga kiring
      alert("Iltimos, avval tizimga kiring!");
    }

    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 3. Role tekshirish (agar required bo'lsa)
  if (allowedRoles && user?.role) {
    const hasRequiredRole = allowedRoles.includes(user.role);

    if (!hasRequiredRole) {
      // User roliga qarab yo'naltirish
      let redirectPath = "/";

      switch (user.role) {
        case "student":
          redirectPath = "/student/dashboard";
          break;
        case "teacher":
        case "head_of_department":
        case "deputy_dean":
        case "dean":
        case "rector":
        case "admin":
        case "super_user":
          redirectPath = "/admin/dashboard";
          break;
        default:
          redirectPath = "/";
      }

      // Xabar berish
      alert(
        `Sizga bu sahifaga kirish huquqi berilmagan! Siz "${user.role}" rolida kirdingiz.`
      );

      return <Navigate to={redirectPath} replace />;
    }
  }

  return children;
};

export default PrivateRoute;
