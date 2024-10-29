import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { ApiRoutes, finofoApi } from '../utils/api';
import axios from 'axios';

const ExampleComponent: React.FC = () => {
  const {data} = useAppSelector((state) => state.fruits);
  const dispatch = useAppDispatch();

  const fetchFruits = async () => {
    try {
        const urlPath = ApiRoutes.GET_FRIUTS;
        const response = await finofoApi.get('http://localhost:5000/api/v1/get-fruits');
        console.log('response data in api', response.data);
    } catch (error) {
        console.log(error);
    }
    
  }

  useEffect(() => {
    fetchFruits();
  }, []);

  return (
    <>
      <h2>Display Fruits</h2>
    </>
  );
};

export default ExampleComponent;
