import * as yup from 'yup';

export const productSchema = yup.object({
  name: yup.string().required('Tên sản phẩm bắt buộc'),
  price: yup.number().typeError('Giá không hợp lệ').required('Giá bắt buộc'),
  quantity: yup
    .number()
    .typeError('Số lượng không hợp lệ')
    .required('Số lượng bắt buộc'),
  slug: yup.string().required('Slug sản phẩm bắt buộc'),
  image: yup.string().required('Hình ảnh sản phẩm bắt buộc'),
});
