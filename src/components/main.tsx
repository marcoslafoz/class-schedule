import React from 'react';
import './main.css';
import { Schedule } from './schedule';
import { Counter } from './counter';
import { Sidebar } from './sidebar';

export const Main: React.FC = () => {
  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-center ">
        <div className="text-center">
          <Counter />
          <div className='d-flex flex-row' >
          <Schedule />
          <Sidebar/>
          </div>
        </div>
      </div>
    </div>
  );
};
