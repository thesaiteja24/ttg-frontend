export const handleApiResponse = (response) => {
  const { data } = response;
  return {
    success: data.success,
    message: data.message,
    data: data.data || null,
    errors: data.errors || [],
    statusCode: data.statusCode || response.status,
  };
};