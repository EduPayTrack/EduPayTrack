import { useOutletContext } from 'react-router-dom';
import { HistoryWorkspace } from '../../features/student/HistoryWorkspace';

type ContextType = {
  token: string;
  onError: (msg: string) => void;
};

export function StudentHistoryPage() {
  const { token, onError } = useOutletContext<ContextType>();

  return (
    <div className="max-w-screen-2xl mx-auto">
      <HistoryWorkspace 
        token={token}
        onError={onError}
      />
    </div>
  );
}
