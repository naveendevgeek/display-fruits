import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { ApiRoutes, finofoApi } from '../../utils/api';
import { fetchDataSuccess } from '../../store/fruitsSlice';
import { Accordion, AccordionItem, Select, SelectItem } from '@nextui-org/react';

const DisplayFruits: React.FC = () => {
  const {data} = useAppSelector((state) => state.fruits);
  const dispatch = useAppDispatch();

  const [fruitsFamilyCat, setFruitsFamilyCat] = useState<any>([]);
  const [category, setCategory] = useState('none');
  const categories = [
    {key: 'none', label: 'None'},
    {key: 'family', label: 'Family'},
    {key: 'order', label: 'Order'},
    {key: 'genus', label: 'Genus'},
  ]

  const fetchFruits = async () => {
    console.log('i am calling the api');
    try {
        const urlPath = ApiRoutes.GET_FRIUTS;
        const response: any = await finofoApi.get(urlPath);
        dispatch(fetchDataSuccess(response?.data));
    } catch (error) {
        console.log(error);
    }
  }

  useEffect(() => {
    if(category == 'family') {
      const filterFruitsFamily = data?.map((fruit: any) => fruit.family);
      setFruitsFamilyCat(Array.from(new Set(filterFruitsFamily)));
    }
  }, [category]);

  useEffect(() => {
    if(data?.length === 0) {
      fetchFruits();
    }
  }, [data]);

  const onChange = (event: any) => {
    console.log(event?.target?.value);
    setCategory(event?.target?.value ? event?.target?.value : 'none');
  }

  const findFruitByFamily = (fruitFamily: any): any => {
    const filterByFamily = data.filter((fruit: any) => fruit.family === fruitFamily);
    return filterByFamily.map((fruit: any, index: number) => (
      <p key={index}>
        {`${fruit.name} (${fruit.nutritions.calories})`}
      </p>
    ))
  }

  const FruitsByCatAccordian: React.FC = () => {
    return (
      <Accordion>
      {
        fruitsFamilyCat.map((fruitFamily: string, index: number) => {
          return (
            <AccordionItem key={index} aria-label={fruitFamily} title={fruitFamily}>
              {findFruitByFamily(fruitFamily)}
            </AccordionItem>
          )
        })
      }
    </Accordion>
    )
  }

  const DisplayFruitsByCat: React.FC = () => {
    return (
        <div className='flex flex-col'>
            <Select
              label="Group by"
              placeholder="Select a category"
              className="max-w-xs"
              onChange={onChange}
              defaultSelectedKeys={["none"]}
              selectedKeys={[category]}
            >
              {categories.map((animal) => (
                <SelectItem key={animal.key}>
                  {animal.label}
                </SelectItem>
              ))}
            </Select>
            {
              category === 'none' &&
              data.map((fruit: any, index: number) => (
                <p key={index}>
                  {`${fruit.name} (${fruit.nutritions.calories})`}
                </p>
              ))
            }

            {
              category === 'family' && fruitsFamilyCat?.length !== 0 && <FruitsByCatAccordian />
            }
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
    <div className='flex flex-col pt-8'>
      <h2 className="text-4xl mx-auto">Display Fruits</h2>
      <div className='container flex flex-row grid grid-cols-2 gap-4 pt-6'>
        <DisplayFruitsByCat />
        <DisplayFruitsJar />
      </div>
    </div>
  );
};

export default DisplayFruits;
