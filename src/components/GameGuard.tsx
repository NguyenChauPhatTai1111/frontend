import { Navigate } from "react-router";

export const GameGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const passed = localStorage.getItem("gamePassed");

  if (!passed) {
    return <Navigate to="/game" replace />;
  }

  return <>{children}</>;
};