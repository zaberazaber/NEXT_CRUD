import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Define your API requests
const fetchUsers = async () => {
  const { data } = await axios.get('/api/users');
  return data;
};

const deleteUser = async (id) => {
  await axios.delete(`/api/users/${id}`);
};

const deleteMultipleUsers = async (ids) => {
  await Promise.all(ids.map(id => axios.delete(`/api/users/${id}`)));
};

function UserTable({ setSelectedUser, setShowForm }) {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
  const mutation = useMutation(
     {
   mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
  const multiDeleteMutation = useMutation( {
    mutationFn: deleteMultipleUsers,
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });

  const [selectedRows, setSelectedRows] = useState([]);
  const [columnFilters, setColumnFilters] = useState({});

  const handleCheckboxChange = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === users.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(users.map((user) => user.id));
    }
  };

  const columns = useMemo(
    () => [
      {
        header: ' ',
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: 'first_name',
            header: () => (
              <div>
                First Name
              </div>
            ),
          },
          {
            accessorKey: 'last_name',
            header: () => (
              <div>
                Last Name
              </div>
            ),
          },
          {
            accessorKey: 'email',
            header: () => (
              <div>
                Email
              </div>
            ),
          },
          {
            accessorKey: 'alternate_email',
            header: () => (
              <div>
                Alternate Email
              </div>
            ),
          },
          {
            accessorKey: 'age',
            header: () => (
              <div>
                Age
              </div>
            ),
          },
          {
            header: 'Actions',
            id: 'Actions',
            cell: ({ row }) => (
              <div className="flex space-x-2">
                <button
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                  onClick={() => handleEdit(row.original)}
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 bg-red-500 text-white rounded"
                  onClick={() => mutation.mutate(row.original.id)}
                >
                  Delete
                </button>
              </div>
            ),
          },
        ],
      },
    ],
    [selectedRows, columnFilters]
  );

  const [data, setData] = useState(users);
  // const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  useEffect(() => {
    const filteredData = users.filter((user) => {
      return Object.entries(columnFilters).every(([key, value]) =>
        value === '' || user[key]?.toString().toLowerCase().includes(value.toLowerCase())
      );
    });
    setData(filteredData);
  }, [users, columnFilters]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value) => {
        skipAutoResetPageIndex();
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex],
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
  });

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleDeleteSelected = async () => {
    try {
      await multiDeleteMutation.mutateAsync(selectedRows);
      setSelectedRows([]);
    } catch (error) {
      console.error('Error deleting selected users:', error);
      alert('Failed to delete selected users');
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading users.</p>;

  return (
    <div className="bg-white rounded shadow-md">
      <div className="flex justify-between mb-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => setShowForm(true)}
        >
          Add User
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={handleDeleteSelected}
          disabled={selectedRows.length === 0}
        >
          Delete Selected
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              <th>
                <input
                  type="checkbox"
                  checked={selectedRows.length === users.length}
                  onChange={handleSelectAll}
                />
              </th>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan} className="border-b p-2 text-left">
                  {header.isPlaceholder ? null : (
                    <div>
                      {flexRender(header.column.columnDef.header, header.getContext())}
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
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(row.original.id)}
                  onChange={() => handleCheckboxChange(row.original.id)}
                />
              </td>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border-b p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-2 mt-4">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
      <div>{table.getRowModel().rows.length} Rows</div>
    </div>
  );
}

function Filter({ column, table }) {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === 'number' ? (
    <div className="flex space-x-2">
      <input
        type="number"
        value={(columnFilterValue)?.[0] ?? ''}
        onChange={(e) =>
          column.setFilterValue((old) => [e.target.value, old?.[1]])
        }
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <input
        type="number"
        value={(columnFilterValue)?.[1] ?? ''}
        onChange={(e) =>
          column.setFilterValue((old) => [old?.[0], e.target.value])
        }
        placeholder={`Max`}
        className="w-24 border shadow rounded"
      />
    </div>
  ) : (
    <input
      type="text"
      value={columnFilterValue ?? ''}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="w-36 border shadow rounded"
    />
  );
}

export default UserTable;
