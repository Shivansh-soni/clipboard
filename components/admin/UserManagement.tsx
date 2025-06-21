"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { userService } from "@/lib/db/userFunctions";
import { User, UserRole } from "@/lib/types/users";

type InvitationData = {
  email: string;
  role: UserRole;
};

export function UserManagement() {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [invitationData, setInvitationData] = useState<InvitationData>({
    email: "",
    role: "user",
  });

  // Fetch users and current user on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [userList, current] = await Promise.all([
          userService.listUsers(),
          userService.getCurrentUser(),
        ]);
        setUsers(userList);
        setCurrentUser(current);
      } catch (error) {
        console.error("Failed to load data:", error);
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const handleSendInvitation = async () => {
    if (!invitationData.email) {
      toast({
        title: "Error",
        description: "Please enter an email address.",
        variant: "destructive",
      });
      return;
    }

    if (!currentUser?.$id) {
      toast({
        title: "Error",
        description: "You must be logged in to send invitations.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSending(true);
      await userService.createInvitation(
        {
          email: invitationData.email,
          role: invitationData.role,
        },
        currentUser.$id
      );

      toast({
        title: "Invitation sent!",
        description: `An invitation has been sent to ${invitationData.email}.`,
      });

      // Reset form
      setInvitationData({ email: "", role: "user" });
    } catch (error: any) {
      console.error("Failed to send invitation:", error);
      toast({
        title: "Error",
        description:
          error.message || "Failed to send invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const updatedUser = await userService.updateUserRole(userId, newRole);
      if (updatedUser) {
        setUsers(
          users.map((user) =>
            user.$id === userId
              ? { ...user, prefs: { ...user.prefs, role: newRole } }
              : user
          )
        );
        toast({
          title: "Success",
          description: "User role updated successfully.",
        });
      }
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast({
        title: "Error",
        description: "Failed to update user role. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this user? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const success = await userService.deleteUser(userId);
      if (success) {
        setUsers(users.filter((user) => user.$id !== userId));
        toast({
          title: "Success",
          description: "User deleted successfully.",
        });
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        Loading users...
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>User Management</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Invite User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite New User</DialogTitle>
              <DialogDescription>
                Send an invitation to a new user to join the platform.
              </DialogDescription>
            </DialogHeader>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='user@example.com'
                  value={invitationData.email}
                  onChange={(e) =>
                    setInvitationData({
                      ...invitationData,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='role'>Role</Label>
                <select
                  id='role'
                  className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background'
                  value={invitationData.role}
                  onChange={(e) =>
                    setInvitationData({
                      ...invitationData,
                      role: e.target.value as UserRole,
                    })
                  }
                >
                  <option value='user'>User</option>
                  <option value='admin'>Admin</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type='button'
                onClick={handleSendInvitation}
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className='text-center py-8'>
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.$id}>
                  <TableCell className='font-medium'>
                    {user.name || "N/A"}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <select
                      className='rounded-md border p-1 text-sm'
                      value={user.prefs?.role || "user"}
                      onChange={(e) =>
                        handleUpdateUserRole(
                          user.$id,
                          e.target.value as UserRole
                        )
                      }
                      disabled={user.$id === currentUser?.$id}
                    >
                      <option value='user'>User</option>
                      <option value='admin'>Admin</option>
                    </select>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : user.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell className='text-right'>
                    <Button
                      variant='destructive'
                      size='sm'
                      onClick={() => handleDeleteUser(user.$id)}
                      disabled={user.$id === currentUser?.$id}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default UserManagement;
