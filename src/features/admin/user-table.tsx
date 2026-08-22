import {
  AdminCard,
  AdminCardContent,
  AdminCardFooter,
  AdminCardSubtitle,
  AdminCardTitle,
} from '@/components/admin-card';
import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableHeader,
  AdminTableHeaderCell,
  AdminTableRow,
} from '../../components/admin-table';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { UserDeleteForm } from './user-delete-form';
import { UserRotateSessionKeyForm } from './user-rotate-session-key-form';
import { UserUpdatePasswordForm } from './user-update-password';
import { UserUpdateRolesForm } from './user-update-roles';
import { useAccounts } from '@/hooks/use-accounts';
import { useIsMobile } from '@/hooks/use-is-mobile';

export function UserTable() {
  const { accounts, isLoading } = useAccounts();
  const isMobile = useIsMobile();

  const cellFiller = (opacity: number) => <span className={`bg-foreground/${opacity} h-8 w-full block`} />;
  const dummyRows = [
    {
      id: -1,
      accountId: -1,
      roles: [],
      username: '',
    },
    {
      id: -2,
      accountId: -2,
      roles: [],
      username: '',
    },
    {
      id: -3,
      accountId: -3,
      roles: [],
      username: '',
    },
  ];

  return (
    <>
      {/* Mobile card view */}
      {isMobile && (
        <div role="list" aria-label="User accounts">
          {(isLoading ? dummyRows : accounts).map((account, index) => {
            const opacity = index % 2 === 0 ? 20 : 10;
            return (
              <AdminCard
                key={`card-${account.id}`}
                role="row"
                aria-label={`User account ${account.username || 'loading'}`}
              >
                <AdminCardTitle>{account.username || cellFiller(opacity)}</AdminCardTitle>
                <AdminCardContent>
                  <AdminCardSubtitle>Role(s)</AdminCardSubtitle>
                  {account.roles.length ? (
                    <div className="flex flex-wrap gap-2">
                      {account.roles.map((role) => (
                        <Badge variant={role === 'admin' ? 'destructive' : 'secondary'} key={`${account.id}-${role}`}>
                          {role}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    cellFiller(opacity)
                  )}
                </AdminCardContent>
                <Separator />
                <AdminCardFooter>
                  {account.id > 0 ? (
                    <>
                      <UserRotateSessionKeyForm user={account} />
                      <UserUpdateRolesForm user={account} />
                      <UserUpdatePasswordForm user={account} />
                      <UserDeleteForm user={account} />
                    </>
                  ) : (
                    cellFiller(opacity)
                  )}
                </AdminCardFooter>
              </AdminCard>
            );
          })}
        </div>
      )}

      {/* Desktop table view */}
      {!isMobile && (
        <AdminTable role="table" aria-label="User accounts">
          <AdminTableHeader>
            <AdminTableHeaderCell className="w-50">Username</AdminTableHeaderCell>
            <AdminTableHeaderCell className="w-50">Role(s)</AdminTableHeaderCell>
            <AdminTableHeaderCell>Actions</AdminTableHeaderCell>
          </AdminTableHeader>
          <AdminTableBody>
            {(isLoading ? dummyRows : accounts).map((account, index) => {
              const opacity = index % 2 === 0 ? 20 : 10;
              return (
                <AdminTableRow
                  key={`row-${account.id}`}
                  role="row"
                  aria-label={`User account ${account.username || 'loading'}`}
                >
                  <AdminTableCell>{account.username || cellFiller(opacity)}</AdminTableCell>
                  <AdminTableCell>
                    {account.roles.length
                      ? account.roles.map((role) => (
                          <Badge
                            variant={role === 'admin' ? 'destructive' : 'secondary'}
                            key={`${account.id}-${role}`}
                            className="mr-4"
                          >
                            {role}
                          </Badge>
                        ))
                      : cellFiller(opacity)}
                  </AdminTableCell>
                  <AdminTableCell>
                    {account.id > 0 ? (
                      <div className="flex gap-2 whitespace-nowrap">
                        <UserRotateSessionKeyForm user={account} className="mr-4" />
                        <UserUpdateRolesForm user={account} className="mr-4" />
                        <UserUpdatePasswordForm user={account} className="mr-4" />
                        <UserDeleteForm user={account} className="mr-4" />
                      </div>
                    ) : (
                      cellFiller(opacity)
                    )}
                  </AdminTableCell>
                </AdminTableRow>
              );
            })}
          </AdminTableBody>
        </AdminTable>
      )}
    </>
  );
}
