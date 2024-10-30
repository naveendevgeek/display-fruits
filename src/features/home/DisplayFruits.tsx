import React, { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { ApiRoutes, finofoApi } from '../../utils/api';
import { fetchDataSuccess, setFruitsGroupByFamily, setFruitsGroupByGenus, setFruitsGroupByOrder,  } from './fruitsSlice';
import { Accordion, AccordionItem, Select, SelectItem, Tab, Tabs, getKeyValue, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Button } from '@nextui-org/react';
import { Legend, Pie, PieChart, Tooltip } from 'recharts';

const DisplayFruits: React.FC = () => {
  const {data, fruitsGroupByFamily, fruitsGroupByOrder, fruitsGroupByGenus} = useAppSelector((state) => state.fruits);
  const dispatch = useAppDispatch();
  const [category, setCategory] = useState('none');
  const categories = [
    {key: 'none', label: 'None'},
    {key: 'family', label: 'Family'},
    {key: 'order', label: 'Order'},
    {key: 'genus', label: 'Genus'},
  ]

  const [selectedFruits, setSelectedFruits] = useState([]);
  const [pieChartDataInfo, setPieChartDataInfo] = useState([]);
  const [selectedView, setSelectedView] = useState('fruits-table');

  useEffect(() => {
    if(selectedFruits.length !== 0) {
      const pieChartData: any = selectedFruits.map((fruit: any) => {
        return {
          name: fruit.name,
          value: fruit.nutritions.calories
        }
      });
      console.log('piechart data', pieChartData);
      const merged = pieChartData.reduce((acc: any, obj: any) => {
        const existing = acc.find((item: any) => item.name === obj.name);
        if (existing) {
          existing.value += obj.value; // Adjust this logic as needed
        } else {
          acc.push({ ...obj });
        }
        return acc;
      }, []);
      setPieChartDataInfo(merged);
    }
  }, [selectedFruits])

  const fetchFruits = async () => {
    try {
        const urlPath = ApiRoutes.GET_FRIUTS;
        const response: any = await finofoApi.get(urlPath);
        dispatch(fetchDataSuccess(response?.data));
    } catch (error) {
        console.log(error);
    }
  }

  const filterData = (category: string) => {
    const filterByGroupBy = data.filter((fruit: any) => fruit.family === category || fruit.order === category || fruit.genus === category);
    return filterByGroupBy;
  }

  const addFruit = (fruit: any) => {
    setSelectedFruits((currentItems: any): any => [...currentItems, fruit]);
  }

  const displayFruitByCategory = (category: string) => {
    const filterByGroupBy = data.filter((fruit: any) => fruit.family === category || fruit.order === category || fruit.genus === category);
    return filterByGroupBy.map((fruit: any, index: number) => {
      return (
        <div key={index} className='flex flex-row justify-between pt-3'>
          <p>
            {`${fruit.name} (${fruit.nutritions.calories})`}
          </p>
          <Button size='sm' color='success' onClick={(e) => addFruit(fruit)}>Add</Button>
        </div>
        
      )
    });
  }

  const DisplayAccordian: React.FC<any> = ({data}) => {
    return (
      <Accordion>
      {
        data?.map((category: string, index: number) => {
          return (
            <AccordionItem key={index} aria-label={category} title={category}>
              {displayFruitByCategory(category)}
            </AccordionItem>
          )
        })
      }
    </Accordion>
    )
  }

  const fruitsByCategory = (category: any) => {
    switch (category) {
      case 'family':
        return <DisplayAccordian data={fruitsGroupByFamily} />
      case 'order':
        return <DisplayAccordian data={fruitsGroupByOrder} />
      case 'genus':
        return <DisplayAccordian data={fruitsGroupByGenus} />
      default:
        break;
    }
  }

  const displayFruitsList = () => {
    if(category === 'family' && fruitsGroupByFamily?.length !== 0) {
      return fruitsByCategory('family')
    } else if (category === 'order' && fruitsGroupByOrder?.length !== 0) {
      return fruitsByCategory('order')
    } else if (category === 'genus' && fruitsGroupByGenus?.length !== 0) {
      return fruitsByCategory('genus')
    } else {
      return data.map((fruit: any, index: number) => (
        <p key={index} className='flex justify-between pt-2'>
          <span>{`${fruit.name} (${fruit.nutritions.calories})`}</span>
          <Button size='sm' onClick={(e) => addFruit(fruit)} color='success'>Add</Button>
        </p>
      ))
    }
  }

  const columns = [
    {
      key: "name",
      label: "Name",
    },
    {
      key: "family",
      label: "Family",
    },
    {
      key: "order",
      label: "Order",
    },
    {
      key: "genus",
      label: "Genus",
    },
    {
      key: "calories",
      label: "Calories",
    },
    {
      key: 'action',
      label: 'Action'
    }
  ];

  const renderCell = useCallback((fruit: any, columnKey: any): any => {
    switch (columnKey) {
      case 'calories':
        return getKeyValue(fruit.nutritions, columnKey);
      case 'action': 
        return <Button size='sm' onClick={(e) => addFruit(fruit)} color='success'>Add</Button>
      default:
        return getKeyValue(fruit, columnKey);
    }
  }, []);

  const displayTableData = (): any => {
    console.log('category', category);
    let filteredData: any = [];
    if(category === 'family') {
      filteredData = fruitsGroupByFamily?.map((category: string) => {
        return filterData(category);
      });
    } else if (category === 'order') {
      filteredData = fruitsGroupByOrder?.map((category: string) => {
        return filterData(category);
      });
    } else if (category === 'genus') {
      filteredData = fruitsGroupByGenus?.map((category: string) => {
        return filterData(category);
      });
    } else {
      filteredData = data
    }
    

    return filteredData.flat().map((row: any) =>
      <TableRow key={row.id}>
        {(columnKey) => <TableCell key={columnKey}>{renderCell(row, columnKey)}</TableCell>}
      </TableRow>
    )
  }

  const displayFruitsTable = () => {
    return (
      <Table aria-label="Example table with dynamic content">
      <TableHeader columns={columns}>
        {(column: any) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody> {displayTableData()}</TableBody>
    </Table>
    )
  }

  let tabs = [
    {
      id: "fruits-table",
      label: "Table",
      content: displayFruitsTable()
    },
    {
      id: "fruits-list",
      label: "List",
      content: displayFruitsList()
    }
  ];

  const getUniqueArray = (data: string[]): string[] => Array.from(new Set(data));

  const setFruitsGroupBy = (groupBy: string): void => {
    switch (groupBy) {
      case 'family':
        const filterFruitsFamily = data?.map((fruit: any) => fruit.family);
        dispatch(setFruitsGroupByFamily(getUniqueArray(filterFruitsFamily)));
        break;
      case 'order':
        const fruitsOrderCat = data?.map((fruit: any) => fruit.order);
        dispatch(setFruitsGroupByOrder(getUniqueArray(fruitsOrderCat)));
        break;
      case 'genus':
        const fruitsGenusCat = data?.map((fruit: any) => fruit.genus);
        dispatch(setFruitsGroupByGenus(getUniqueArray(fruitsGenusCat)));
        break;
      default:
        break;
    }
  }

  useEffect(() => {
    if(category !== 'none') {
      setFruitsGroupBy(category);
    }
  }, [category]);

  useEffect(() => {
    if(data?.length === 0) {
      fetchFruits();
    }
  }, [data]);

  const onChange = (event: any) => {
    setCategory(event?.target?.value ? event?.target?.value : 'none');
  }

  const onSelectionChange = (key: any) => {
    console.log('key', key);
    setSelectedView(key);
  }

  const DisplayTabs: React.FC = () => {
    return (
      <Tabs 
        aria-label="Dynamic tabs" 
        items={tabs} 
        selectedKey={selectedView}
        onSelectionChange={onSelectionChange}>
        {(item) => (
          <Tab key={item.id} title={item.label}>
            <>
              {item.content}
            </> 
          </Tab>
        )}
      </Tabs>
    )
  }

  const DisplayFruitsByCat: React.FC = () => {
    return (
        <div className='flex flex-col'>
            <Select
              label="Group by"
              placeholder="Select a category"
              className="max-w-xs pb-4"
              onChange={onChange}
              defaultSelectedKeys={["none"]}
              selectedKeys={[category]}
            >
              {categories.map((category) => (
                <SelectItem key={category.key}>
                  {category.label}
                </SelectItem>
              ))}
            </Select>
            <DisplayTabs />
        </div>
    )
  }

  const DisplayFruitsJar: React.FC = () => {
    return (
        <div className='flex container flex-col text-center max-auto'>
          <p className='text-2xl'>Fruits in Jar</p>
          {
            pieChartDataInfo?.length === 0 ? <p className='pt-4 text-red-800'>Fruit Jar is Empty</p> : 
            <div className='grid grid-cols-2 gap-2 pt-6'>
              <div className='flex flex-col text-left'>
                {
                  pieChartDataInfo?.map((fruit: any, index) => <p key={index}>{`${fruit.name} (${fruit.value})`}</p>)
                }
              </div>
              <PieChart width={400} height={400}>
                <Pie data={pieChartDataInfo} cx={200} cy={200} outerRadius={100} fill="#8884d8" dataKey="value" />
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          }
          
          
        </div>
    )
  }

  return (
    <div className='mx-auto flex flex-col pt-8 px-10'>
      <h2 className="text-4xl mx-auto">Display Fruits</h2>
      <div className='flex flex-row grid grid-cols-2 gap-4 pt-6'>
        <DisplayFruitsByCat />
        <DisplayFruitsJar />
      </div>
    </div>
  );
};

export default DisplayFruits;
