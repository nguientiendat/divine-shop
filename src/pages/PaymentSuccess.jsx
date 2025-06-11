import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import api from '../api/api';

function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const userInfo = JSON.parse(localStorage.getItem("user"))
  console.log(id)
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const payosRes = await api.get(`https://api-merchant.payos.vn/v2/payment-requests/${id}`, {
           headers: {
                'x-client-id': process.env.REACT_APP_CLIENT_ID,
                'x-api-key': process.env.REACT_APP_API_KEY,
   }         
        });
        console.log(payosRes)

        if (payosRes.data.code === '00') {
          const callbackRes = await api.post('http://localhost:8080/api/payment/callback', {
            userId: userInfo.user_id,
            amountPaid: payosRes.data.data.amountPaid
          });

          if (callbackRes.status === 200) {
            navigate('/');
          } else {
            console.error('Callback API thất bại');
          }
        } else {
          console.error('Thanh toán chưa thành công');
        }
      } catch (err) {
        console.error('Lỗi xảy ra:', err);
      }
    };

    if (id) {
      verifyPayment();
    }
  }, [id, navigate]);
  return (
    <div>
      <h2>Đang xử lý thanh toán...</h2>
    </div>
  );
}

export default PaymentSuccess;
