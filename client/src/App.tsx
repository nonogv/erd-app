import React, { useEffect, useState } from 'react';

type Item = {
  type: 'PDL' | 'XKCD'
  img: string
  title: string
  description: string
  url: string
  date: string
}

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!items && !error) {
      fetch('http://localhost:4000')
        .then(response => response.json())
        .then(data => setItems(data))
        .catch(error => setError(error.message || error));
    }
  }, [items, error]);

  if (error) return <div>{error}</div>;

  return (
    <div className='p-12'>
      {items?.map((item, index) => (
        <div key={item.url} className='border rounded-lg p-4 mb-4 last:mb-0'>
          <div className='flex row justify-between items-center'>
            <span className='text-lg font-semibold'>{item.title}</span>
            <span className='text-sm text-slate-400 italic'>{item.date}</span>
          </div>
          <div className='border my-4'>
            {item.type === 'PDL'
              ? <div dangerouslySetInnerHTML={{ __html: item.img }} />
              : <img src={item.img} />
            }
          </div>
          <div className='flex row mb-4 justify-between'>
            <div className='order-2 text-6xl px-4'>{index + 1}</div>
            <div className={index % 2 === 0 ? 'order-1' : 'order-3'}>
              <span className='pr-1 font-semibold'>Description:</span>
              {item.description}
            </div>
          </div>
          <a className='text-blue-600 underline hover:no-underline' href={item.url} target='_blank'>{item.url}</a>
        </div>
      ))}
    </div>
  );
}

export default App;
