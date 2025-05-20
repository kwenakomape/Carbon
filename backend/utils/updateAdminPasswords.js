
const userToken = 'your-very-secure'
const handleUpdatePasswords = async () => {
  try {
    const response = await axios.post(
      '/api/admin/update-passwords',
      { newPassword: 'SSISA2023!' },
      {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      }
    );
    console.log(response.data.message);
  } catch (error) {
    console.error('Failed to update passwords:', error.response?.data?.message);
  }
};

handleUpdatePasswords()