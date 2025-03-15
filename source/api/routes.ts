import { backendLocation as BE } from "../config";

const routes = {
  // User Routes
  getUser: `${BE}/user/get-me`,
  logoutUser: `${BE}/user/logout`,

  // getUser: () => `${BE}/user/get-me`,
};

export default routes;
