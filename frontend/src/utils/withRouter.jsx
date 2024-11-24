import { useNavigate, useParams } from "react-router-dom";

export function withRouter(Component) {
  return function ComponentWithRouter(props) {
    const params = useParams();
    const navigate = useNavigate();
    return <Component {...props} params={params} navigate={navigate} />;
  };
}
