import { useQuery } from "@apollo/client";
import { USER } from "..";
import DotLoader from "react-spinners/DotLoader";

const User = () => {
  const { data, loading, error } = useQuery(USER);

  if (loading) return <DotLoader />;
  if (error) return <p>Error :(</p>;

  return <h3>{data.user.name}</h3>;
};

export default User;
