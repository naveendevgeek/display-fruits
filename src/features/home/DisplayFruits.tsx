import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { ApiRoutes, finofoApi } from '../../utils/api';
import { fetchDataSuccess } from '../../store/fruitsSlice';

const DisplayFruits: React.FC = () => {
  const {data} = useAppSelector((state) => state.fruits);
  const dispatch = useAppDispatch();

  const fetchFruits = async () => {
    try {
        const urlPath = ApiRoutes.GET_FRIUTS;
        const response: any = await finofoApi.get(urlPath);
        console.log('response data in api', response.data);
        dispatch(fetchDataSuccess(response?.data))
    } catch (error) {
        console.log(error);
    }
    
  }

  useEffect(() => {
    fetchFruits();
  }, []);

  const DisplayFruitsByCat: React.FC = () => {
    console.log('data from store', data);
    return (
        <div className='flex'>
            Left
        </div>
    )
  }

  const DisplayFruitsJar: React.FC = () => {
    return (
        <div className='flex'>
            right
        </div>
    )
  }

  return (
    <div className='h-screen bg-slate-200 flex flex-col'>
      <h2 className="text-4xl mx-auto">Display Fruits</h2>
      <div className='container flex flex-row grid grid-cols-2 gap-4 pt-6'>
        <DisplayFruitsByCat />
        <DisplayFruitsJar />
      </div>
    </div>
  );
};

export default DisplayFruits;
