import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';

const fetchUsers = async () => {
  const { data } = await axios.get('/api/users');
  return data;
};

const UserTable = ({ setSelectedUser, setShowForm }) => {
  const queryClient = useQueryClient();
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const deleteUser = useMutation({
    mutationFn: (id) => axios.delete(`/api/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleDelete = (id) => {
    deleteUser.mutate(id);
  };

  const columns = React.useMemo(
    () => [
      {
        header: ' ',
        footer: (props) => props.column.id,
        columns: [
          {
            accessorKey: 'first_name',
            header: () => 'First Name',
          },
          {
            accessorKey: 'last_name',
            header: () => 'Last Name',
          },
          {
            accessorKey: 'email',
            header: () => 'Email',
          },
          {
            accessorKey: 'alternate_email',
            header: () => 'Alternate Email',
          },
          {
            accessorKey: 'age',
            header: 'Age',
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
                  onClick={() => handleDelete(row.original.id)}
                >
                  Delete
                </button>
              </div>
            ),
          },
        ],
      },
    ],
    []
  );

  const table = useReactTable({
    data: users,
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
      await Promise.all(
        selectedRows.map((id) => axios.delete(`/api/users/${id}`))
      );
      setUsers((prevUsers) => prevUsers.filter((user) => !selectedRows.includes(user.id)));
      setSelectedRows([]);
    } catch (error) {
      console.error('Error deleting selected users:', error);
      alert('Failed to delete selected users');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <div className="bg-white rounded shadow-md">
      <div className="flex justify-between mb-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded"
          onClick={() => setShowForm(true)}
        >
          Add User
        </button>
      </div>
      <table className="w-full border-collapse">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} colSpan={header.colSpan} className="border-b p-2 text-left">
                  {header.isPlaceholder ? null : (
                    <div>
                      {flexRender(header.column.columnDef.header, header.getContext())}
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
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="border-b p-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
