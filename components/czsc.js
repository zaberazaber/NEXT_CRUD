// components/UserTable.js
import { useEffect, useState } from 'react';
import {
    Column,
    Table,
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    RowData,
  } from "@tanstack/react-table";
//   import { makeData, Person } from "./makeData";
import axios from 'axios';
import React from 'react';


// declare module "@tanstack/react-table" {
//     interface TableMeta<TData extends RowData> {
//       updateData: (rowIndex: number, columnId: string, value: unknown) => void;
//     }
//   }
  
const UserTable = ({ users, setUsers, setselectedUser, setShowForm }) => {


  function useSkipper() {
    const shouldSkipRef = React.useRef(true);
    const shouldSkip = shouldSkipRef.current;
  
    // Wrap a function with this to skip a pagination reset temporarily
    const skip = React.useCallback(() => {
      shouldSkipRef.current = false;
    }, []);
  
    React.useEffect(() => {
      shouldSkipRef.current = true;
    });
  
    return [shouldSkip, skip];
  }

  
  const [data, setData] = React.useState(
    [{
            "first_name": "aefef",
            "lastName": "faefe",
            "email": "m.work.zubair@gmail.com",
            "alternate_email": "s@s.com",
            "password": "$2a$10$dXc8icE8OxPlCrXpQ7JQ4ucmk5a409JYwqIcio7VUqsvCBuyXGXIy",
            "age": "55",
            "id": 1002
          }
        ]);

        const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

   
  
  const columns = React.useMemo (
    () => [
      {
        header: "Name",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: "first_name",
            header: () => "First Name",
          },
          {
            accessorKey: "last_name",
            header: () => "Last Name",
          },
        ],
      },
      {
        header: "Info",
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: "email",
            header: () => "Email",
          },
          {
            accessorKey: "alternate_email",
            header: () => "Alternate Email",
          },
          {
            accessorKey: "age",
            header: "Age",
          },
          {
                 header: 'Actions',
                 id: "Actions",
                 cell: ({ row }) => (
                   <div>
                     <button onClick={() => handleEdit(row.original)}>Edit</button>
                     <button onClick={() => handleDelete(row.original.id)}>Delete</button>
                     <button onClick={() => setShowForm(true)}>Add user</button>
                   </div>
                 ),
               },
        ],
      },
    ],
    [],
  );
  

  function Filter( {
    column,
    table
  }) {
    const firstValue = table
      .getPreFilteredRowModel()
      .flatRows[0]?.getValue(column.id);
  
    const columnFilterValue = column.getFilterValue();
  
    return typeof firstValue === "number" ? (
      <div className="flex space-x-2">
        <input
          type="number"
          value={(columnFilterValue)?.[0] ?? ""}
          onChange={(e) =>
            column.setFilterValue((old) => [
              e.target.value,
              old?.[1],
            ])
          }
          placeholder={`Min`}
          className="w-24 border shadow rounded"
        />
        <input
          type="number"
          value={(columnFilterValue)?.[1] ?? ""}
          onChange={(e) =>
            column.setFilterValue((old) => [
              old?.[0],
              e.target.value,
            ])
          }
          placeholder={`Max`}
          className="w-24 border shadow rounded"
        />
      </div>
    ) : (
      <input
        type="text"
        value={(columnFilterValue ?? "")}
        onChange={(e) => column.setFilterValue(e.target.value)}
        placeholder={`Search...`}
        className="w-36 border shadow rounded"
      />
    );
  }

  const table = useReactTable({
    data: users,
    columns,
    // defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleEdit = (user) => {
    console.log("editinggggg")
    // Implement edit functionality here
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/users/${id}`);
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <table>
      <thead>
      {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : (
                    <div>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {header.column.getCanFilter() ? (
                        <div>
                          <Filter column={header.column} table={table} />
                        </div>
                      ) : null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
      </thead>
      <tbody >
      {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default UserTabley;
