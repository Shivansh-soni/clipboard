import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, Users, Search, UserPlus } from "lucide-react";
import Link from "next/link";

export default function UsersPage() {
  // TODO: Fetch users from API
  const users: any[] = [];

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Users</h2>
          <p className='text-muted-foreground'>
            Manage user accounts and permissions
          </p>
        </div>
        <Link href='/admin/users/new'>
          <Button>
            <UserPlus className='mr-2 h-4 w-4' />
            Add User
          </Button>
        </Link>
      </div>

      <div className='rounded-md border'>
        <div className='p-4 border-b'>
          <div className='relative'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
            <Input
              type='search'
              placeholder='Search users...'
              className='w-full bg-background pl-8'
              // TODO: Implement search
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className='font-medium'>
                    <div className='flex items-center gap-2'>
                      <User className='h-5 w-5 text-muted-foreground' />
                      {user.name || "Unnamed User"}
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>
                      Active
                    </span>
                  </TableCell>
                  <TableCell>{user.role || "user"}</TableCell>
                  <TableCell className='text-right'>
                    <Button variant='ghost' size='sm' asChild>
                      <Link href={`/admin/users/${user.id}`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className='h-24 text-center'>
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
