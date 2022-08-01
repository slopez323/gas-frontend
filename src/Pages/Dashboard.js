import { useEffect, useState } from "react";

const Dashboard = () => {
  const [logged, setLogged] = useState("Not Logged In");
  useEffect(() => {
    const user = localStorage.getItem("gasUser");
    if (user) {
      setLogged("Logged In");
    }
  }, []);
  return <div>{logged}</div>;
};

export default Dashboard;
