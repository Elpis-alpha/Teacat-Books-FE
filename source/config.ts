// Site Constants
export const tokenCookieName = "teacat-books-user-token";

// Dynamic paths
export const host = process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";
export const backendLocation =
  process.env.NEXT_PUBLIC_BACK_END || "http://localhost:5000";

export const images = {
  landing:
    "https://res.cloudinary.com/elpis-cloud/image/upload/v1742054701/teacat-books/static/landing.jpg",
  signin:
    "https://res.cloudinary.com/elpis-cloud/image/upload/v1742054871/teacat-books/static/signin.jpg",
};
