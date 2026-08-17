import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHeader,
  AdminTableHeaderCell,
  AdminTableRow,
} from '../../components/admin-table';
import { Badge } from '@/components/ui/badge';
import { UserDeleteForm } from './user-delete-form';
import { UserRotateSessionKeyForm } from './user-rotate-session-key-form';
import { UserUpdatePasswordForm } from './user-update-password';
import { UserUpdateRolesForm } from './user-update-roles';
import { useAccounts } from '@/hooks/use-accounts';

export function UserTable() {
  const { accounts, isLoading } = useAccounts();
  if (isLoading) {
    const dummyData = {
      id: 0,
      username: '',
      roles: [],
    };
    const dummyRows = [dummyData, dummyData, dummyData];
    return (
      <AdminTable>
        <AdminTableHeader>
          <AdminTableHeaderCell className="w-50">Username</AdminTableHeaderCell>
          <AdminTableHeaderCell className="w-50">Role(s)</AdminTableHeaderCell>
          <AdminTableHeaderCell>Actions</AdminTableHeaderCell>
        </AdminTableHeader>
        <AdminTableBody>
          {dummyRows.map((_, index) => {
            const opacity = index % 2 ? 20 : 10;
            return (
              <AdminTableRow key={index}>
                <AdminTableCell>
                  <span
                    className={`bg-foreground/${opacity} h-8 w-full block`}
                  />
                </AdminTableCell>
                <AdminTableCell>
                  <span
                    className={`bg-foreground/${opacity} h-8 w-full block`}
                  />
                </AdminTableCell>
                <AdminTableCell>
                  <span
                    className={`bg-foreground/${opacity} h-8 w-full block`}
                  />
                </AdminTableCell>
              </AdminTableRow>
            );
          })}
        </AdminTableBody>
      </AdminTable>
    );
  }
  if (!accounts) {
    return <p>No accounts found.</p>;
  }

  return (
    <>
      <AdminTable>
        <AdminTableHeader>
          <AdminTableHeaderCell className="w-50">Username</AdminTableHeaderCell>
          <AdminTableHeaderCell className="w-50">Role(s)</AdminTableHeaderCell>
          <AdminTableHeaderCell>Actions</AdminTableHeaderCell>
        </AdminTableHeader>
        <AdminTableBody>
          {accounts.map((account) => (
            <AdminTableRow key={account.id}>
              <AdminTableCell>{account.username}</AdminTableCell>
              <AdminTableCell>
                {account.roles.map((role) => (
                  <Badge
                    variant={role === 'admin' ? 'destructive' : 'secondary'}
                    key={`${account.id}-${role}`}
                    className="mr-4"
                  >
                    {role}
                  </Badge>
                ))}
              </AdminTableCell>
              <AdminTableCell>
                <div className="flex gap-2 whitespace-nowrap">
                  <UserRotateSessionKeyForm user={account} className="mr-4" />
                  <UserUpdateRolesForm user={account} className="mr-4" />
                  <UserUpdatePasswordForm user={account} className="mr-4" />
                  <UserDeleteForm user={account} className="mr-4" />
                </div>
              </AdminTableCell>
            </AdminTableRow>
          ))}
        </AdminTableBody>
      </AdminTable>
    </>
  );
}
