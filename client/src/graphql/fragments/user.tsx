import { useQuery } from "@apollo/client";
import Loader from "@components/Loader";
import { USER } from "..";

const User = () => {
  const { data, loading, error } = useQuery(USER);

  if (loading) return <Loader />;
  if (error) return <p>Error :(</p>;

  return <h3>{data.user.name}</h3>;
};

export default User;
