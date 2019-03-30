import http from "./httpService";

const apiEndpoint = `/api/user`;
const tokenKey = "token";

export function register(user) {
  return http.post(`${apiEndpoint}/new`, {
    email: user.email,
    password: user.password,
    name: user.name,
    role_id: user.role
  });
}

export async function updatePassword(data) {
  const { data: jwt } = await http.put(`${apiEndpoint}/updatePassword`, {
    password: data.password,
    newPassword: data.newPassword
  });
  // set the new token in localstorage after password change
  localStorage.setItem(tokenKey, jwt);
}

export function adminUpdatePassword(data) {
  return http.put(`${apiEndpoint}/updatePassword/${data.id}`, {
    newPassword: data.newPassword
  });
}

export function adminUpdateStatus(data) {
  return http.put(
    `${apiEndpoint}/updateStatus/${data.id}?enabled=${data.enabled}`
  );
}

export function adminUpdateRole(data) {
  return http.put(`${apiEndpoint}/updateRole/${data.id}`, {
    role_id: data.role_id
  });
}

export function getAllUser() {
  return http.get(`${apiEndpoint}/all`);
}

export default {
  register,
  getAllUser,
  updatePassword,
  adminUpdatePassword,
  adminUpdateStatus,
  adminUpdateRole
};
