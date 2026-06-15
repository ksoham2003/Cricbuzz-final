import { Inbox } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = Inbox, 
  title = 'No data found', 
  message = 'There is nothing to display at the moment.' 
}) {
  return (
    <div className="empty-state animate-fade-in">
      <Icon size={48} className="icon" />
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}
