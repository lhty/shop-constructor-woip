import axios from 'axios';
import { API_URL } from '../../../config';

export function Login({ name, password, photo }) {
  axios
    .post(`${API_URL}auth/local`, {
      identifier: name,
      password: password,
      photo: photo
    })
    .then(response => {
      localStorage.setItem('user', response.data.jwt);
      return response.data.user;
    })
    .catch(error => {
      if (error) {
      }
    });
}
export function Register({
  name,
  password,
  photo = false,
  email = null,
  phone = null
}) {
  axios
    .post(`${API_URL}auth/local/register`, {
      username: name,
      password: password,
      email: email,
      phone: phone
    })
    .then(response => {
      localStorage.setItem('user', response.data.jwt);
      return response.data.user;
    })
    .catch(error => {});
}

// export function Vklogin() {
//   window.VK.Auth.login(response => {
//     if (response.status === 'connected') {
//       let userdata = {
//         name:
//           response.session.user.first_name +
//           ' ' +
//           response.session.user.last_name,
//         password: response.session.user.domain + response.session.user.id
//       };
//       window.VK.Api.call(
//         'users.get',
//         { user_ids: userdata.id, fields: 'photo_50', v: '5.73' },
//         response =>
//           userDispatch({
//             type: 'SIGN_UP',
//             payload: {
//               ...userdata,
//               photo: response.response[0].photo_50
//             }
//           })
//       );
//     }
//   }, 4194304);
// }
