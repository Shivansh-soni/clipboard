import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ClipboardList, UserPlus } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  // TODO: Fetch real stats
  const stats = [
    {
      title: "Total Users",
      value: "0",
      icon: Users,
      link: "/admin/users",
    },
    {
      title: "Active Users",
      value: "0",
      icon: Users,
      link: "/admin/users?status=active",
    },
    {
      title: "Total Clipboards",
      value: "0",
      icon: ClipboardList,
      link: "#",
    },
  ];

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-bold tracking-tight'>Dashboard</h2>
        <Link href='/admin/users/new'>
          <button className='inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90'>
            <UserPlus className='mr-2 h-4 w-4' />
            Add User
          </button>
        </Link>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.link}>
            <Card className='hover:bg-accent transition-colors'>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  {stat.title}
                </CardTitle>
                <stat.icon className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className='mt-8'>
        <h3 className='text-lg font-medium mb-4'>Recent Activity</h3>
        <div className='rounded-md border'>
          <div className='p-6 text-center text-sm text-muted-foreground'>
            No recent activity
          </div>
        </div>
      </div>
    </div>
  );
}
