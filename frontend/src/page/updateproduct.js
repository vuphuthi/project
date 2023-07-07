import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { BsCloudUpload } from 'react-icons/bs';
import { ImagetoBase64 } from '../utility/ImagetoBase64';
import axios from 'axios'
import { useParams } from 'react-router-dom';
const EditProduct = () => {
    const { id } = useParams();
    const [data, setData] = useState({
        name: '',
        category: '',
        image: '',
        price: '',
        description: ''
      });
    
      useEffect(() => {
        // Lấy thông tin sản phẩm cần chỉnh sửa và gán vào state
        fetchData();
      }, []);
    
    //   const fetchData = async () => {
    //     axios.get(`http://localhost:8080/getByID/`+id)
    //     .then(result => console.log(result))
    //     .catch(err => console.log(err))
    //   };
    const fetchData = async () => {
  try {
    const response = await fetch(`http://localhost:8080/getByID/${id}`);
    if (response.ok) {
      const productData = await response.json();
      setData(productData);
    } else {
      toast('Không thể lấy thông tin sản phẩm');
    }
  } catch (error) {
    console.log(error);
    toast('Đã xảy ra lỗi khi lấy thông tin sản phẩm');
  }
};
      const handleOnChange = (e) => {
        const { name, value } = e.target;
    
        setData((prev) => {
          return {
            ...prev,
            [name]: value
          };
        });
      };
    
      const uploadImage = async (e) => {
        const imageData = await ImagetoBase64(e.target.files[0]);
    
        setData((prev) => {
          return {
            ...prev,
            image: imageData
          };
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(data);
    
        const { name, image, category, price } = data;
    
        if (name && image && category && price) {
          // Gửi dữ liệu cập nhật lên server
          try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_DOMIN}/updateProduct/${id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            });
    
            if (response.ok) {
              toast('Sản phẩm đã được cập nhật thành công');
            } else {
              toast('Không thể cập nhật sản phẩm');
            }
          } catch (error) {
            console.log(error);
            toast('Đã xảy ra lỗi khi cập nhật sản phẩm');
          }
        } else {
          toast('Vui lòng nhập các trường bắt buộc');
        }
      };
    

  return (
    <div className="p-4">
       <form className='m-auto w-full max-w-md  shadow flex flex-col p-3 bg-white' onSubmit={handleSubmit}>
        <label htmlFor='name'>Name</label>
        <input type={"text"}  name="name" className='bg-slate-200 p-1 my-1' onChange={handleOnChange} value={data.name}/>

        <label htmlFor='category'>Category</label>
        <select className='bg-slate-200 p-1 my-1' id='category' name='category' onChange={handleOnChange} value={data.category}>
          <option value={"other"}>select category</option>
          <option value={"fruits"}>Fruits</option>
          <option value={"vegetable"}>Vegetable</option>
          <option value={"icream"}>Icream</option>
          <option value={"dosa"}>Dosa</option>
          <option value={"pizza"}>Pizza</option>
          <option value={"rice"}>rice</option>
          <option value={"cake"}>Cake</option>
          <option value={"burger"}>Burger</option>
          <option value={"panner"}>Panner</option>
          <option value={"sandwich"}>Sandwich</option>
        </select>

        <label htmlFor='image'>Image
        <div  className='h-40 w-full bg-slate-200  rounded flex items-center justify-center cursor-pointer'>
            {
              data.image ? <img src={data.image} className="h-full" /> :<span className='text-5xl'><BsCloudUpload/></span> 
            }
            
            
           <input type={"file"} accept="image/*" id="image" onChange={uploadImage} className="hidden"/>
        </div>
        </label>
        

        <label htmlFor='price' className='my-1'>Price</label>
        <input type={"text"} className='bg-slate-200 p-1 my-1' name='price' onChange={handleOnChange} value={data.price}/>

        <label htmlFor='description'>Description</label>
        <textarea rows={2} value={data.description} className='bg-slate-200 p-1 my-1 resize-none' name='description' onChange={handleOnChange}></textarea>

        <button className='bg-red-500 hover:bg-red-600 text-white text-lg font-medium my-2 drop-shadow'>Save</button>
       </form>
    </div>
  );
};

export default EditProduct;