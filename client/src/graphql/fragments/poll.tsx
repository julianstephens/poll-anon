import { useQuery } from "@apollo/client";
import DotLoader from "react-spinners/DotLoader";
import { USER } from "..";

const Poll = () => {
    const { data, loading, error } = useQuery(USER);
  
    if (loading) return <DotLoader />;
    if (error) return <p>Error : (</p>;
  
    return <h3>{ data.user.name }</h3>;
  
};

export default Poll;