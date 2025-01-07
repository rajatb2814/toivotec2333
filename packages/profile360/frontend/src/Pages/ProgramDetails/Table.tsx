import React, { HTMLProps, useMemo } from 'react';
import { ReactComponent as LeftChiron } from '../../assests/images/LeftChiron.svg';
import { ReactComponent as RightChiron } from '../../assests/images/RightChiron.svg';

import {
  Column,
  createColumnHelper,
  PaginationState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  OnChangeFn,
  flexRender,
} from '@tanstack/react-table';
import { useInitialData } from 'context/InitialDataContext';
import { orderData } from 'types';

const Table = () => {
  // const { initialData } = useInitialData();
  // const [rowSelection, setRowSelection] = React.useState({});
  // const [globalFilter, setGlobalFilter] = React.useState('');

  // //
  // // const defaultData: orderData = initialData?.order_table && initialData.order_table;
  // const columnHelper = createColumnHelper<orderData>();
  // const columns: orderData | any[] = [
  //   columnHelper.accessor('select', {
  //     header: ({ table }) => (
  //       <IndeterminateCheckbox
  //         {...{
  //           checked: table.getIsAllRowsSelected(),
  //           indeterminate: table.getIsSomeRowsSelected(),
  //           onChange: table.getToggleAllRowsSelectedHandler(),
  //         }}
  //       />
  //     ),
  //     cell: ({ row }) => (
  //       <div className="">
  //         <IndeterminateCheckbox
  //           {...{
  //             checked: row.getIsSelected(),
  //             indeterminate: row.getIsSomeSelected(),
  //             onChange: row.getToggleSelectedHandler(),
  //           }}
  //         />
  //       </div>
  //     ),
  //     footer: (info) => info.column.id,
  //   }),
  //   columnHelper.accessor('orderId', {
  //     header: () => <span>Order ID</span>,
  //     cell: (info) => info.getValue(),
  //     footer: (info) => info.column.id,
  //   }),
  //   columnHelper.accessor('orderCode', {
  //     header: () => <span>Order Code</span>,
  //     cell: (info) => info.renderValue(),
  //     footer: (info) => info.column.id,
  //   }),
  //   columnHelper.accessor('orderGenerationDate', {
  //     header: () => 'Order Generation Date',
  //     cell: (info) => info.renderValue(),
  //     footer: (info) => info.column.id,
  //   }),
  //   columnHelper.accessor('orderStatus', {
  //     header: () => (
  //       <div className="flex flex-col">
  //         <span>Order</span> <span>Status</span>
  //       </div>
  //     ),
  //     footer: (info) => info.column.id,
  //   }),
  //   columnHelper.accessor('orderBenifit', {
  //     header: 'Order Benifit',
  //     footer: (info) => info.column.id,
  //   }),
  // ];
  // const [data, setData] = React.useState(() =>
  //   initialData?.order_table?.Data ? [...initialData.order_table.Data] : []
  // );

  // const table = useReactTable({
  //   data,
  //   columns,
  //   getCoreRowModel: getCoreRowModel(),
  //   getFilteredRowModel: getFilteredRowModel(),
  //   getPaginationRowModel: getPaginationRowModel(),
  // });
  return (
    // <div className="pt-4">
    //   <table className="w-full table-fixed overflow-auto">
    //     <thead>
    //       {table.getHeaderGroups().map((headerGroup) => (
    //         <tr key={headerGroup.id}>
    //           {headerGroup.headers.map((header) => (
    //             <>
    //               <th
    //                 className="border-seconder whitespace-nowrap border-0 border-b-4 pl-4 pb-[28px] text-start font-lato  text-sm font-bold tracking-[0.6px] text-tertiary"
    //                 key={header.id}
    //               >
    //                 {header.isPlaceholder
    //                   ? null
    //                   : flexRender(header.column.columnDef.header, header.getContext())}
    //               </th>
    //             </>
    //           ))}
    //         </tr>
    //       ))}
    //     </thead>
    //     <tbody>
    //       <>
    //         {table.getRowModel().rows.map((row) => (
    //           <tr key={row.id}>
    //             {row.getVisibleCells().map((cell) => (
    //               <>
    //                 {/* {

    //                 <td
    //                   className={`border-0 border-b-2 border-secondary py-[14px] pl-4 font-lato text-sm tracking-[0.2px] ${
    //                     cell.column.id === 'orderId' ? 'text-primary-action' : null
    //                   }`}
    //                   key={cell.id}
    //                 >
    //                   {cell.column.id === 'orderId' ? (
    //                     <a href="#">{flexRender(cell.column.columnDef.cell, cell.getContext())}</a>
    //                   ) : (
    //                     flexRender(cell.column.columnDef.cell, cell.getContext())
    //                   )}
    //                 </td>
    //               </>
    //             ))}
    //           </tr>
    //         ))}
    //       </>
    //     </tbody>
    //   </table>
    //   <div className="h-2" />
    //   <div className="flex h-[50px] items-center justify-between text-neutral-700">
    //     <div className=" py-[17px] pl-[22px] ">
    //       <div className="font-lato text-xs tracking-[0.2px]">
    //         Total Count: {table.getCoreRowModel().rows.length}{' '}
    //       </div>
    //       <div></div>
    //     </div>

    //     <div className="flex items-center pr-14 ">
    //       <div className="flex items-center pr-14">
    //         <div className="flex items-center gap-2 pr-6 ">
    //           <div className="py-[17px] font-lato text-xs tracking-[0.2px]">Counts per page</div>
    //           <select
    //             className="rounded border-[1px] border-primary-border bg-white py-[6px] pl-2 text-xs"
    //             value={table.getState().pagination.pageSize}
    //             onChange={(e) => {
    //               table.setPageSize(Number(e.target.value));
    //             }}
    //           >
    //             {[10, 20, 30, 40, 50].map((pageSize) => (
    //               <option key={pageSize} value={pageSize}>
    //                 {pageSize}
    //               </option>
    //             ))}
    //           </select>
    //         </div>
    //         <div className="h-[42px] w-[2px] bg-secondary py-1 "></div>
    //       </div>
    //       <div className="flex gap-8 py-[17px]">
    //         <button
    //           className=" px-1 text-secondary-label disabled:cursor-default"
    //           onClick={() => table.previousPage()}
    //           disabled={!table.getCanPreviousPage()}
    //         >
    //           <LeftChiron />
    //         </button>
    //         <span className="flex items-center gap-1">
    //           {table.getState().pagination.pageIndex + 1}
    //         </span>
    //         <span className="flex items-center gap-1">
    //           <button
    //             className=" px-1 text-secondary-label disabled:cursor-default"
    //             onClick={() => table.nextPage()}
    //             disabled={!table.getCanNextPage()}
    //           >
    //             <RightChiron />
    //           </button>
    //         </span>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <></>
  );
  function IndeterminateCheckbox({
    indeterminate,
    className = 'w-4 h-4 border-1 rounded border border-neutral-400',
    ...rest
  }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
    const ref = React.useRef<HTMLInputElement>(null!);
    //
    React.useEffect(() => {
      if (typeof indeterminate === 'boolean') {
        ref.current.indeterminate = !rest.checked && indeterminate;
      }
    }, [ref, indeterminate]);

    return <input type="checkbox" ref={ref} className={className + ' cursor-pointer'} {...rest} />;
  }
};

export default Table;
