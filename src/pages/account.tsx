import { IndexerLogsTable } from '@/features/account/indexer-logs-table';
import { RootPathAddForm, RootPathTable } from '@/components';
import { UserChangePasswordForm } from '@/features/account/user-change-password';
import { UserRotateSessionKeyForm } from '@/features/account/user-rotate-session-key-form';

const AccountPreferencesPage = () => {
  return (
    <>
      <title>Account preferences // SHM</title>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Account preferences</h1>
        {/* System management */}
        <section className="mb-8">
          <h2 className="font-semibold mb-2">System</h2>
          <div className="flex flex-row space-x-2">
            <div className="h-8">
              <UserChangePasswordForm />
              <UserRotateSessionKeyForm />
            </div>
          </div>
        </section>
        {/* Root path management */}
        <section className="mb-8">
          <h2 className="font-semibold mb-2">Library management</h2>
          <RootPathAddForm />
          <RootPathTable />
        </section>
        {/* Indexer logs */}
        <section>
          <h2 className="font-semibold mb-2">Indexer logs</h2>
          <IndexerLogsTable />
        </section>
      </div>
    </>
  );
};

export default AccountPreferencesPage;
