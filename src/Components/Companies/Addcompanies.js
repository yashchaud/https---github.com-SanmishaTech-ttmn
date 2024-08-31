import React from "react";

const Addcompanies = () => {
  const navigate = useNavigate();
  const [newCompany, setNewCompany] = useState({
    name: "",
    industry: "",
    location: "",
    foundedDate: "",
    lastUpdated: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addCompany(newCompany);
    navigate("/");
  };
  return <div></div>;
};

export default Addcompanies;
