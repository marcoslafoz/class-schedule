import React from 'react';
import './schedule.css';
import { Shortcut } from './shortcut';

export const Schedule: React.FC = () => {
  return (

    <table >
      <tbody>
        <tr>
          <td className="table-cell-base w-[100px] hour-cell ">08:30 <br /> 09:20</td>
          <td className="table-cell-base mat1 " rowSpan={2}>Fh</td>
          <td className="table-cell-base mat2" rowSpan={2}>Iso</td>
          <td className="table-cell-base mat3">Lm</td>
          <td className="table-cell-base mat8">Ippe</td>
          <td className="table-cell-base mat1" rowSpan={2}>Fh</td>
          <Shortcut link='https://mail.google.com/' imageSrc="/gmail.png" />

        </tr>
        <tr>
          <td className="table-cell-base w-[100px] hour-cell ">09:25 <br /> 10:15</td>
          <td className="table-cell-base mat4" rowSpan={2}>Bd</td>
          <td className="table-cell-base mat2" rowSpan={2}>Iso</td>
          <Shortcut link='https://classroom.google.com/' imageSrc="/classroom.png" />

        </tr>
        <tr>
          <td className="table-cell-base w-[100px] hour-cell ">10:20 <br /> 11:10</td>
          <td className="table-cell-base mat8">Ippe</td>
          <td className="table-cell-base mat7">Inglés</td>
          <td className="table-cell-base mat8">Ippe</td>
          <Shortcut link='https://drive.google.com/' imageSrc="/drive.png" />

        </tr>
        <tr className='h-36' >
          <td className="table-cell-base w-[100px] hour-cell "> </td>
          <td className="table-cell-base bg-gray-300" colSpan={5}></td>


        </tr>
        <tr>
          <td className="table-cell-base w-[100px] hour-cell ">11:40 <br /> 12:30</td>
          <td className="table-cell-base mat4" rowSpan={3}>Bd</td>
          <td className="table-cell-base mat5">Dasp</td>
          <td className="table-cell-base mat2" rowSpan={2}>Iso</td>
          <td className="table-cell-base mat6" rowSpan={3}>Par</td>
          <td className="table-cell-base mat6" rowSpan={2}>Par</td>
          <Shortcut link='https://mail.google.com/mail/u/0/#chat/space' imageSrc="/chat.png" />
        </tr>
        <tr>
          <td className="table-cell-base w-[100px] hour-cell ">12:35 <br /> 13:25</td>
          <td className="table-cell-base mat6" rowSpan={2}>Par</td>
          <Shortcut link='https://iespabloserrano.aeducar.es/my/courses.php' imageSrc="/aeducar.ico" />
        </tr>
        <tr>
          <td className="table-cell-base w-[100px] hour-cell ">13:30 <br /> 14:20</td>
          <td className="table-cell-base mat7">Inglés</td>
          <td className="table-cell-base mat3">Lmsgi</td>
          <Shortcut link='https://aplicaciones.aragon.es/sigaddweb/login' imageSrc="/sigad.png" />
        </tr>
      </tbody>
    </table>

  );
};

